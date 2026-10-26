"""Optional exact lookup table of frequent words for the browser IndicXlit converter.

The browser runtime reproduces the server's CTranslate2 model bit for bit, but running a transformer for every word
costs ~25 ms. Common words recur in every transcript, so this tool precomputes what the *server's own pipeline*
returns for the N most frequent Hindi words and writes it as frontend/public/models/indicxlit/wordcache.tsv. The
browser answers those words from the table (the answer is identical by construction) and runs the network only for
the rest. The table is bound to one model file by its SHA-256; a table made for another model is ignored.

    cd backend
    .venv/Scripts/python.exe -m tools.export_indicxlit_wordcache --words hindi_words.txt --limit 10000 \\
        --source-note "OpenSubtitles Hindi frequency list (hermitdave/FrequencyWords, CC BY-SA 4.0)"

--words is a UTF-8 text file with one word per line, most frequent first (a trailing count, as in the
FrequencyWords lists, is ignored). Words the spelling dictionary of app/hinglish.py already covers, words with
characters the converter would not hand to the model, and outputs the server would reject are skipped.
Uses the production class app.indicxlit.IndicXlit (batch of one, exactly what the server runs).
"""
import argparse
import hashlib
import json
import re
import sys
import unicodedata
from pathlib import Path

HEADER = "#indicxlit-wordcache v1 model={sha} beam=4 max=96 count={count}\n"
RUN = re.compile(r"[ऀ-ॣॱ-ॿ]+")
VALID = re.compile(r"[A-Za-z'-]+")


def main():
    here = Path(__file__).resolve().parent.parent
    sys.path.insert(0, str(here))
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--words", type=Path, required=True)
    p.add_argument("--limit", type=int, default=10000)
    p.add_argument("--max-length", type=int, default=24, help="skip words longer than this many characters")
    p.add_argument("--out-dir", type=Path, default=here.parent / "frontend" / "public" / "models" / "indicxlit")
    p.add_argument("--source-note", default="", help="where the word list comes from (recorded in provenance.json)")
    args = p.parse_args()

    from app import hinglish
    from app.indicxlit import IndicXlit, prepared
    if not prepared():
        sys.exit("The server model is not prepared. Run: python -m tools.prepare_indicxlit")
    manifest = json.loads((args.out_dir / "indicxlit.json").read_text(encoding="utf-8"))
    sha = manifest["bin"]["sha256"]
    model = IndicXlit()
    seen, rows = set(), []
    for line in args.words.read_text(encoding="utf-8").splitlines():
        parts = line.split()
        if not parts:
            continue
        word = unicodedata.normalize("NFC", parts[0])
        if word in seen or not RUN.fullmatch(word) or len(word) > args.max_length or word in hinglish._SPELLINGS:
            continue
        seen.add(word)
        roman = model.translit_word(word, lang_code="hi", topk=1)[0]
        if not VALID.fullmatch(roman):
            continue
        rows.append((word, roman))
        if len(rows) >= args.limit:
            break
    text = HEADER.format(sha=sha, count=len(rows)) + "".join(f"{w}\t{r}\n" for w, r in rows)
    out = args.out_dir / "wordcache.tsv"
    out.write_text(text, encoding="utf-8", newline="\n")
    digest = hashlib.sha256(out.read_bytes()).hexdigest()
    prov_path = args.out_dir / "provenance.json"
    prov = json.loads(prov_path.read_text(encoding="utf-8"))
    prov["files"]["wordcache.tsv"] = {"bytes": out.stat().st_size, "sha256": digest}
    prov["wordcache"] = {
        "what": "outputs of the server pipeline (app.indicxlit.IndicXlit, beam 4, max 96) for the most frequent Hindi words",
        "words": len(rows),
        "word_list": args.source_note or "not recorded",
        "model_sha256": sha,
        "regenerate": ".venv/Scripts/python.exe -m tools.export_indicxlit_wordcache --words <list> --limit %d" % args.limit,
    }
    prov_path.write_text(json.dumps(prov, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"wrote {out} ({len(rows)} words, {out.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
