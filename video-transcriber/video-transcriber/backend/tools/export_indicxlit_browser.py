"""Export the prepared IndicXlit CTranslate2 model as the browser asset used by frontend/src/app/engine/hinglish.

The browser runtime (indicxlit.ts) is a hand-written TypeScript / WebAssembly inference engine. It reads exactly the
int8 tensors, per-row quantisation scales, biases, layer-norm parameters and vocabularies that the server's
CTranslate2 model.bin contains, so the weights are bit-identical to the model the server runs. Nothing is
re-quantised or re-trained here.

    cd backend
    .venv/Scripts/python.exe -m tools.prepare_indicxlit          # once: official archive -> CTranslate2 (needs torch)
    .venv/Scripts/python.exe -m tools.export_indicxlit_browser   # model.bin -> frontend/public/models/indicxlit

Only numpy is required by this tool (no torch, no ctranslate2). Output files (all <= 20 MiB, total ~13 MB):

    indicxlit.json   header: dimensions, special ids, both vocabularies, tensor table, decoding defaults, SHA-256
    indicxlit.bin    tensors, 16-byte aligned (int8 weights, float32 scales / biases / layer norms, all 1,024 position rows)
    provenance.json  where the weights come from and how they were converted
    LICENSE          MIT licence notice of AI4Bharat IndicXlit

Optional: --wordcache N also writes wordcache.tsv, the N most frequent words of a word list mapped to the
beam-4 output of the *server* model, so the browser can answer common words without running the network.
"""
import argparse
import hashlib
import json
import struct
import sys
from pathlib import Path

import numpy as np

SOURCE_URL = "https://github.com/AI4Bharat/IndicXlit/releases/download/v1.0/indicxlit-indic-en-v1.0.zip"
CHECKPOINT_SHA256 = "45ffecef88d990ae12f915939b91267a3fc8f69f26331baa59f7932005976f28"
FORMAT = "indicxlit-int8-v1"
# All rows of the model's sinusoidal position table. CTranslate2 truncates inputs to max_input_length = 1024 tokens
# and never computes a position outside this table, so the browser must not either (it throws past the last row).
POSITION_ROWS = 1024
# Sections of provenance.json written by the other export tools; kept when this tool rewrites the file.
FOREIGN_PROVENANCE = ("wordcache", "kernels")
DTYPE_IDS = {0: np.float32, 1: np.int8, 2: np.int16, 3: np.int32, 4: np.float16}
NAMES = {np.dtype(np.float32): "f32", np.dtype(np.int8): "i8"}


def read_ct2_model(path):
    """Parse CTranslate2 model.bin (binary version 6). Returns (variables, aliases, header)."""
    data = Path(path).read_bytes()
    pos = 0

    def unpack(fmt):
        nonlocal pos
        value = struct.unpack_from(fmt, data, pos)[0]
        pos += struct.calcsize(fmt)
        return value

    def string():
        nonlocal pos
        n = unpack("<H")
        text = data[pos:pos + n - 1].decode("utf-8")
        pos += n
        return text

    version = unpack("<I")
    if version != 6:
        raise ValueError(f"Unsupported CTranslate2 binary version {version}")
    spec = string()
    revision = unpack("<I")
    variables = {}
    for _ in range(unpack("<I")):
        name = string()
        shape = tuple(unpack("<I") for _ in range(unpack("<B")))
        dtype = DTYPE_IDS[unpack("<B")]
        nbytes = unpack("<I")
        variables[name] = np.frombuffer(data, dtype=dtype, count=nbytes // np.dtype(dtype).itemsize, offset=pos).reshape(shape)
        pos += nbytes
    aliases = {}
    for _ in range(unpack("<I")):
        alias = string()
        aliases[alias] = string()
    if pos != len(data):
        raise ValueError("Trailing bytes in model.bin")
    return variables, aliases, {"version": version, "spec": spec, "revision": revision}


def sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def build(ct2_dir, out_dir):
    ct2_dir, out_dir = Path(ct2_dir), Path(out_dir)
    provenance_in = json.loads((ct2_dir / "provenance.json").read_text(encoding="utf-8"))
    if provenance_in.get("checkpoint_sha256") != CHECKPOINT_SHA256:
        raise ValueError("The CTranslate2 model was not converted from the verified official IndicXlit v1 checkpoint.")
    variables, aliases, header = read_ct2_model(ct2_dir / "model.bin")
    for alias, target in aliases.items():
        variables[alias] = variables[target]
    config = json.loads((ct2_dir / "config.json").read_text(encoding="utf-8"))
    source_vocab = json.loads((ct2_dir / "source_vocabulary.json").read_text(encoding="utf-8"))
    target_vocab = json.loads((ct2_dir / "target_vocabulary.json").read_text(encoding="utf-8"))

    # --- architecture, read from the tensors themselves and checked against what the runtime implements ---------
    d_model = variables["encoder/layernorm_embedding/gamma"].shape[0]
    layers = {side: sum(1 for n in variables if n.startswith(f"{side}/layer_") and n.endswith("/ffn/linear_0/weight"))
              for side in ("encoder", "decoder")}
    heads = int(variables["encoder/num_heads"])
    ffn = variables["encoder/layer_0/ffn/linear_0/weight"].shape[0]
    expected = dict(d_model=256, heads=4, ffn=1024, enc_layers=6, dec_layers=6)
    actual = dict(d_model=int(d_model), heads=heads, ffn=int(ffn), enc_layers=layers["encoder"], dec_layers=layers["decoder"])
    if actual != expected:
        raise ValueError(f"Unexpected architecture {actual}; the browser runtime implements {expected}")
    if int(variables["encoder/activation"]) != 3 or int(variables["decoder/activation"]) != 3:
        raise ValueError("Activation is not GELU")
    if not (int(variables["encoder/pre_norm"]) and int(variables["decoder/pre_norm"])):
        raise ValueError("Expected pre-norm transformer")
    for flag in ("decoder/alibi", "decoder/start_from_zero_embedding", "encoder/multi_query_attention"):
        if int(variables[flag]):
            raise ValueError(f"Unsupported option {flag}")
    if config.get("layer_norm_epsilon") is not None:
        raise ValueError("Unexpected explicit layer-norm epsilon")

    # --- tensors to ship ---------------------------------------------------------------------------------------------
    keep = {}
    for name, value in sorted(variables.items()):
        if value.ndim == 0:
            continue  # scalar flags are represented in the header
        if name == "encoder/position_encodings/encodings":
            continue  # alias of the decoder table; stored once below
        if name == "decoder/position_encodings/encodings":
            if value.shape[0] < POSITION_ROWS:
                raise ValueError(f"position table has {value.shape[0]} rows; expected at least {POSITION_ROWS}")
            value = value[:POSITION_ROWS]
            name = "positions"
        if value.dtype not in NAMES:
            raise ValueError(f"{name}: unsupported dtype {value.dtype}")
        keep[name] = np.ascontiguousarray(value)
    out_dir.mkdir(parents=True, exist_ok=True)
    table, offset = {}, 0
    blob = bytearray()
    for name, value in keep.items():
        pad = (-offset) % 16
        blob += b"\0" * pad
        offset += pad
        raw = value.tobytes()
        table[name] = {"dtype": NAMES[value.dtype], "shape": list(value.shape), "offset": offset, "bytes": len(raw)}
        blob += raw
        offset += len(raw)
    blob += b"\0" * ((-offset) % 16)
    bin_path = out_dir / "indicxlit.bin"
    bin_path.write_bytes(bytes(blob))

    ids = {"bos": target_vocab.index("<s>"), "pad": target_vocab.index("<blank>"), "eos": target_vocab.index("</s>"),
           "unk": target_vocab.index("<unk>")}
    if (ids["bos"], ids["pad"], ids["eos"], ids["unk"]) != (0, 1, 2, 3) or source_vocab[:4] != target_vocab[:4]:
        raise ValueError("Unexpected special token ids")
    meta = {
        "format": FORMAT,
        "model": "AI4Bharat IndicXlit v1 Indic-to-Roman, Hindi, int8 (CTranslate2 int8 tensors, unchanged)",
        "dims": {**expected, "head_dim": expected["d_model"] // expected["heads"], "source_vocab": len(source_vocab),
                 "target_vocab": len(target_vocab), "position_rows": POSITION_ROWS},
        "specials": ids,
        "language_token": "__hi__",
        "scale_embeddings": {"encoder": float(variables["encoder/scale_embeddings"]), "decoder": float(variables["decoder/scale_embeddings"])},
        "layer_norm_epsilon": 1e-5,
        "activation": "gelu",
        "add_source_eos": bool(config["add_source_eos"]),
        "add_source_bos": bool(config["add_source_bos"]),
        "decoder_start_token": config["decoder_start_token"],
        "decoding_defaults": {"beam_size": 4, "num_hypotheses": 1, "max_decoding_length": 96, "max_input_length": 1024,
                              "min_decoding_length": 1, "length_penalty": 1, "patience": 1},
        "source_vocabulary": source_vocab,
        "target_vocabulary": target_vocab,
        "tensors": table,
        "bin": {"file": "indicxlit.bin", "bytes": len(blob), "sha256": sha256(bin_path)},
    }
    (out_dir / "indicxlit.json").write_text(json.dumps(meta, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    license_text = (ct2_dir / "LICENSE").read_text(encoding="utf-8")
    (out_dir / "LICENSE").write_text(license_text, encoding="utf-8")
    previous = {}
    if (out_dir / "provenance.json").is_file():
        previous = json.loads((out_dir / "provenance.json").read_text(encoding="utf-8"))
    provenance = {
        "model": "AI4Bharat IndicXlit v1 (Indic -> Roman), transformer, Hindi source language token __hi__",
        "source": SOURCE_URL,
        "checkpoint_sha256": CHECKPOINT_SHA256,
        "license": "MIT",
        "license_notice": "Copyright (c) 2022 AI4Bharat. MIT License; the full text is in LICENSE next to this file.",
        "format": FORMAT,
        "weights": "int8 tensors, per-row scales, biases and layer norms copied unchanged from the server's CTranslate2 model.bin "
                   f"(spec {header['spec']} rev {header['revision']}, binary v{header['version']}) which backend/tools/prepare_indicxlit.py "
                   "built from the checkpoint above",
        "conversion": [
            "cd backend",
            ".venv/Scripts/python.exe -m pip install -r requirements-indicxlit.txt",
            ".venv/Scripts/python.exe -m tools.prepare_indicxlit",
            ".venv/Scripts/python.exe -m tools.export_indicxlit_browser",
        ],
        "files": {name: {"bytes": (out_dir / name).stat().st_size, "sha256": sha256(out_dir / name)}
                  for name in ("indicxlit.bin", "indicxlit.json", "LICENSE")},
    }
    # Keep what the word-cache and kernel tools recorded; they are regenerated separately.
    if (out_dir / "wordcache.tsv").is_file() and "wordcache.tsv" in previous.get("files", {}):
        provenance["files"]["wordcache.tsv"] = previous["files"]["wordcache.tsv"]
    for key in FOREIGN_PROVENANCE:
        if key in previous:
            provenance[key] = previous[key]
    if previous.get("wordcache", {}).get("model_sha256") not in (None, meta["bin"]["sha256"]):
        print("note: wordcache.tsv is pinned to the previous indicxlit.bin and will be ignored by the browser;",
              "re-run: python -m tools.export_indicxlit_wordcache", file=sys.stderr)
    (out_dir / "provenance.json").write_text(json.dumps(provenance, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    return meta, out_dir


def verify(out_dir, ct2_dir):
    """Re-read the shipped blob and compare every tensor with the CTranslate2 model.bin."""
    out_dir = Path(out_dir)
    meta = json.loads((out_dir / "indicxlit.json").read_text(encoding="utf-8"))
    blob = (out_dir / "indicxlit.bin").read_bytes()
    if hashlib.sha256(blob).hexdigest() != meta["bin"]["sha256"] or len(blob) != meta["bin"]["bytes"]:
        raise ValueError("indicxlit.bin does not match its header")
    variables, aliases, _ = read_ct2_model(Path(ct2_dir) / "model.bin")
    for alias, target in aliases.items():
        variables[alias] = variables[target]
    count = 0
    for name, info in meta["tensors"].items():
        dtype = np.float32 if info["dtype"] == "f32" else np.int8
        arr = np.frombuffer(blob, dtype=dtype, count=int(np.prod(info["shape"])), offset=info["offset"]).reshape(info["shape"])
        ref = variables["decoder/position_encodings/encodings"][:POSITION_ROWS] if name == "positions" else variables[name]
        if arr.shape != ref.shape or not np.array_equal(arr.view(np.uint8) if arr.dtype == np.float32 else arr,
                                                        ref.view(np.uint8) if ref.dtype == np.float32 else ref):
            raise ValueError(f"tensor {name} differs from model.bin")
        count += 1
    return count


def write_wordcache(reference_json, out_dir, limit):
    """tsv: word<TAB>output. Taken from a reference table produced with the SERVER model (beam 4)."""
    rows = json.loads(Path(reference_json).read_text(encoding="utf-8"))["rows"]
    seen, lines = set(), []
    for row in rows:
        if not row.get("server") or row["w"] in seen or not row["b4"].isalpha():
            continue
        seen.add(row["w"])
        lines.append(f"{row['w']}\t{row['b4']}")
        if len(lines) >= limit:
            break
    (Path(out_dir) / "wordcache.tsv").write_text("\n".join(lines) + "\n", encoding="utf-8")
    return len(lines)


def main():
    here = Path(__file__).resolve().parent.parent
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--ct2-dir", type=Path, help="Prepared CTranslate2 model folder (default: <model dir>/indicxlit-ct2)")
    p.add_argument("--out", type=Path, default=here.parent / "frontend" / "public" / "models" / "indicxlit",
                   help="Output folder (default: frontend/public/models/indicxlit)")
    p.add_argument("--no-verify", action="store_true")
    p.add_argument("--wordcache", type=int, default=0, metavar="N", help="Also write wordcache.tsv with N words (needs --reference)")
    p.add_argument("--reference", type=Path, help="Reference table (rows with w/b4/server) from the server model")
    args = p.parse_args()
    ct2_dir = args.ct2_dir
    if ct2_dir is None:
        sys.path.insert(0, str(here))
        from app import config
        ct2_dir = Path(config.MODEL_DIR) / "indicxlit-ct2"
    if not (ct2_dir / "model.bin").is_file():
        sys.exit(f"{ct2_dir} is not prepared. Run: python -m tools.prepare_indicxlit")
    meta, out = build(ct2_dir, args.out)
    print("wrote", out, "-", meta["bin"]["bytes"], "bytes of tensors,", len(meta["tensors"]), "tensors")
    if not args.no_verify:
        print("verified", verify(out, ct2_dir), "tensors bit-identical to", ct2_dir / "model.bin")
    if args.wordcache:
        if not args.reference:
            sys.exit("--wordcache needs --reference")
        print("word cache:", write_wordcache(args.reference, out, args.wordcache), "words")


if __name__ == "__main__":
    main()
