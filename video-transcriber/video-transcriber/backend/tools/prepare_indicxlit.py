"""Convert the official IndicXlit v1 Indic-to-Roman checkpoint without Fairseq.

Uses CTranslate2's existing Fairseq tensor mapping. Only the official release is
downloaded; source provenance and SHA256 are recorded beside the converted model.
Torch/OmegaConf are preparation-only dependencies; runtime uses CTranslate2.
"""
import argparse
import hashlib
import json
import math
import shutil
import tempfile
import urllib.request
import zipfile
from pathlib import Path
from types import SimpleNamespace as NS

from app import config

URL = "https://github.com/AI4Bharat/IndicXlit/releases/download/v1.0/indicxlit-indic-en-v1.0.zip"
LANGUAGES = "en as bn brx gom gu hi kn ks mai ml mni mr ne or pa sa sd si ta te ur".split()
CHECKPOINT_SHA256 = "45ffecef88d990ae12f915939b91267a3fc8f69f26331baa59f7932005976f28"
LICENSE = """MIT License

Copyright (c) 2022 AI4Bhārat

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
"""


def vocabulary(path):
    tokens = ["<s>", "<blank>", "</s>", "<unk>"]
    for line in path.read_text(encoding="utf-8").splitlines():
        token = line.rsplit(" ", 1)[0]
        if token not in tokens:
            tokens.append(token)
    for language in LANGUAGES:
        token = f"__{language}__"
        if token not in tokens:
            tokens.append(token)
    return tokens


def convert(source, dest):
    import torch
    from ctranslate2.specs import TransformerSpec, common_spec
    from ctranslate2.converters.fairseq import set_transformer_encoder, set_transformer_decoder
    checkpoint = source / "transformer" / "indicxlit.pt"
    digest = hashlib.sha256(checkpoint.read_bytes()).hexdigest()
    if digest != CHECKPOINT_SHA256:
        raise ValueError("This is not the verified official IndicXlit v1 checkpoint; conversion aborted.")
    # Legacy official Fairseq checkpoints contain Namespace configuration metadata.
    # This preparation tool never accepts arbitrary checkpoint URLs or user uploads.
    data = torch.load(checkpoint, map_location="cpu", weights_only=False)
    args, state = data["args"] or data["cfg"]["model"], data["model"]
    if args.arch != "transformer" or args.encoder_embed_dim != 256 or args.activation_fn != "gelu":
        raise ValueError("Unexpected official checkpoint architecture; conversion aborted.")
    def layer(prefix):
        return NS(weight=state[prefix + ".weight"], bias=state.get(prefix + ".bias"))
    def attention(prefix):
        return NS(**{name: layer(prefix + "." + name) for name in ("q_proj", "k_proj", "v_proj", "out_proj")})
    def side(name):
        dim = getattr(args, name + "_embed_dim")
        half = dim // 2
        frequencies = torch.exp(torch.arange(half, dtype=torch.float32) * -(math.log(10000) / (half - 1)))
        angles = torch.arange(1026, dtype=torch.float32).unsqueeze(1) * frequencies.unsqueeze(0)
        positions = torch.cat([torch.sin(angles), torch.cos(angles)], dim=1)
        positions[1] = 0
        layers = []
        for i in range(getattr(args, name + "_layers")):
            prefix = f"{name}.layers.{i}"
            item = NS(self_attn=attention(prefix + ".self_attn"),
                      self_attn_layer_norm=layer(prefix + ".self_attn_layer_norm"),
                      final_layer_norm=layer(prefix + ".final_layer_norm"),
                      fc1=layer(prefix + ".fc1"), fc2=layer(prefix + ".fc2"))
            if name == "decoder":
                item.encoder_attn = attention(prefix + ".encoder_attn")
                item.encoder_attn_layer_norm = layer(prefix + ".encoder_attn_layer_norm")
            layers.append(item)
        result = NS(embed_positions=NS(weights=positions, padding_idx=1), embed_scale=math.sqrt(dim),
                    embed_tokens=layer(name + ".embed_tokens"), layers=layers,
                    layer_norm=layer(name + ".layer_norm"), layernorm_embedding=layer(name + ".layernorm_embedding"))
        if name == "decoder":
            result.output_projection = layer(name + ".output_projection")
            result.project_in_dim = result.project_out_dim = None
        return result
    spec = TransformerSpec.from_config((args.encoder_layers, args.decoder_layers), args.encoder_attention_heads,
                                       pre_norm=True, activation=common_spec.Activation.GELU, layernorm_embedding=True)
    set_transformer_encoder(spec.encoder, side("encoder"))
    set_transformer_decoder(spec.decoder, side("decoder"))
    src, tgt = vocabulary(source / "corpus-bin/dict.hi.txt"), vocabulary(source / "corpus-bin/dict.en.txt")
    if len(src) != state["encoder.embed_tokens.weight"].shape[0] or len(tgt) != state["decoder.embed_tokens.weight"].shape[0]:
        raise ValueError("Checkpoint and vocabulary sizes differ; conversion aborted.")
    spec.register_source_vocabulary(src)
    spec.register_target_vocabulary(tgt)
    spec.config.decoder_start_token = spec.config.eos_token
    spec.config.add_source_eos = True
    spec.validate()
    spec.optimize(quantization="int8")
    dest.mkdir(parents=True, exist_ok=False)
    spec.save(str(dest))
    (dest / "LICENSE").write_text(LICENSE, encoding="utf-8")
    manifest = {"source": URL, "checkpoint_sha256": digest,
                "license": "MIT", "language_order": LANGUAGES, "format": "CTranslate2 int8", "model": "IndicXlit v1 Indic-to-Roman"}
    (dest / "provenance.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--source", type=Path, help="Already downloaded/extracted official archive")
    args = p.parse_args()
    dest = Path(config.MODEL_DIR) / "indicxlit-ct2"
    if (dest / "model.bin").is_file():
        (dest / "LICENSE").write_text(LICENSE, encoding="utf-8")
        print("Already prepared:", dest)
        return
    Path(config.MODEL_DIR).mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(dir=config.MODEL_DIR, prefix="indicxlit-prepare-") as temp:
        root = Path(temp)
        source = args.source
        if source is None:
            archive = root / "official.zip"
            with urllib.request.urlopen(URL, timeout=60) as response, archive.open("wb") as stream:
                shutil.copyfileobj(response, stream)
            source = root / "source"
            source.mkdir()
            with zipfile.ZipFile(archive) as z:
                for entry in z.infolist():
                    if not (source / entry.filename).resolve().is_relative_to(source.resolve()):
                        raise ValueError("Unsafe path in official archive.")
                z.extractall(source)
        converted = root / "converted"
        convert(source, converted)
        import ctranslate2
        translator = ctranslate2.Translator(str(converted), device="cpu", compute_type="int8")
        words = ["\u0928\u092e\u0938\u094d\u0924\u0947", "\u092d\u093e\u0930\u0924"]
        results = translator.translate_batch([["__hi__", *word] for word in words], beam_size=4, max_decoding_length=64)
        actual = ["".join(r.hypotheses[0]) for r in results]
        if actual[0] != "namaste" or actual[1] not in ("bharat", "bhaarat"):
            raise ValueError(f"Converted model failed transliteration smoke check: {actual}")
        del translator
        # Both paths are verified children of the configured model directory.
        converted.rename(dest)
    print("Prepared trained IndicXlit:", dest)


if __name__ == "__main__":
    main()
