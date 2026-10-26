"""Reference table for checking the browser IndicXlit runtime against the server: Devanagari word -> CT2 output.

Builds a large, varied list of Devanagari words and records, with the PRODUCTION code (app.indicxlit.IndicXlit and
app.hinglish), what the server returns for each:

  b4        IndicXlit().translit_word(word)  - beam 4, one hypothesis, at most 96 symbols, tokens ['__hi__', *NFC(word)]
  b1        the same with beam 1 (greedy)
  top4      the four finished beam hypotheses with their length-normalised scores (to judge near-ties)
  pipeline  hinglish.romanize(word, 'indicxlit')   (spelling dictionary, model, output validation)
  basic     hinglish.romanize(word, 'basic')

Word sources (download them first; none is shipped):
  --subtitles   OpenSubtitles Hindi frequency list, 'word count' per line (hermitdave/FrequencyWords, hi_full.txt)
  --wiki-titles hiwiki-latest-all-titles-in-ns0.gz (https://dumps.wikimedia.org/hiwiki/latest/)
  --aksharantar AI4Bharat Aksharantar Hindi zip (https://huggingface.co/datasets/ai4bharat/Aksharantar, hin.zip)
plus the keys of hinglish._SPELLINGS, every Devanagari word in backend/tests/*.py, Hindi number words, orthographic
variants (anusvara / chandrabindu, nukta composed / decomposed, ZWJ / ZWNJ, visarga ...) and synthetic stress inputs
(all consonant conjuncts, syllables, random strings up to 40 symbols, 150-symbol repeats).
backend/tests/golden/*.json hold ENGLISH transcripts only, so they cannot supply Hindi words.

    cd backend
    .venv/Scripts/python.exe -m tools.export_indicxlit_reference --subtitles hi_full.txt \\
        --wiki-titles hiwiki-titles.gz --aksharantar hin.zip --out reference.json

Then compare with the TypeScript runtime (frontend/src/app/engine/hinglish) - see docs/in-browser/spike/indicxlit.md.
"""
import argparse
import collections
import gzip
import json
import random
import re
import sys
import time
import unicodedata
import zipfile
from pathlib import Path

RUN = re.compile(r"[ऀ-ॣॱ-ॿ]+")
ZWJ, ZWNJ, VIRAMA, NUKTA = "‍", "‌", "्", "़"
NUMBERS = """शून्य एक दो तीन चार पाँच पांच छह छः छे सात आठ नौ दस ग्यारह बारह तेरह चौदह पंद्रह पन्द्रह सोलह सत्रह अठारह उन्नीस बीस
इक्कीस बाईस तेईस चौबीस पच्चीस छब्बीस सत्ताईस अट्ठाईस अठ्ठाईस उनतीस तीस इकतीस बत्तीस तैंतीस चौंतीस पैंतीस छत्तीस सैंतीस अड़तीस उनतालीस
चालीस इकतालीस बयालीस तैंतालीस चौवालीस पैंतालीस छियालीस सैंतालीस अड़तालीस उनचास पचास इक्यावन बावन तिरपन चौवन पचपन छप्पन सत्तावन अट्ठावन
उनसठ साठ इकसठ बासठ तिरसठ चौंसठ पैंसठ छियासठ सड़सठ अड़सठ उनहत्तर सत्तर इकहत्तर बहत्तर तिहत्तर चौहत्तर पचहत्तर छिहत्तर सतहत्तर अठहत्तर
उन्यासी अस्सी इक्यासी बयासी तिरासी चौरासी पचासी छियासी सत्तासी अट्ठासी नवासी नब्बे इक्यानवे बानवे तिरानवे चौरानवे पंचानवे छियानवे
सत्तानवे अट्ठानवे निन्यानवे सौ हज़ार हजार लाख करोड़ करोड अरब खरब नील पद्म शंख पहला दूसरा तीसरा चौथा पाँचवाँ पांचवां छठा सातवाँ आठवाँ नौवाँ दसवाँ
ग्यारहवाँ बारहवाँ बीसवाँ सौवाँ पहली दूसरी तीसरी चौथी पाँचवीं आधा आधी पौन सवा डेढ़ ढाई साढ़े दोगुना तिगुना चौगुना दर्जन जोड़ी इकहरा दुगना""".split()


def candidate_words(args, backend):
    """Ordered mapping word -> set of categories."""
    from app import hinglish
    rng = random.Random(20261025)
    entries = collections.OrderedDict()

    def add(word, cat):
        if word:
            entries.setdefault(word, set()).add(cat)

    for key in hinglish._SPELLINGS:
        add(key, "spellings")
    for path in sorted((backend / "tests").glob("*.py")):
        for m in RUN.finditer(path.read_text(encoding="utf-8")):
            add(m.group(), "tests")
    if args.subtitles:
        pure = []
        for line in args.subtitles.read_text(encoding="utf-8").splitlines():
            word = line.rsplit(" ", 1)[0]
            if RUN.fullmatch(word):
                pure.append(word)
        for w in pure[:9000]:
            add(w, "subs_top")
        for w in rng.sample(pure[9000:], min(1500, len(pure[9000:]))):
            add(w, "subs_tail")
    if args.wiki_titles:
        words = set()
        with gzip.open(args.wiki_titles, "rt", encoding="utf-8") as f:
            for line in f:
                words.update(m.group() for m in RUN.finditer(line.replace("_", " ")))
        for w in rng.sample(sorted(words), min(2500, len(words))):
            add(w, "wiki")
    if args.aksharantar:
        with zipfile.ZipFile(args.aksharantar) as z:
            for name, n in (("hin_train.json", 3000), ("hin_valid.json", 400), ("hin_test.json", 400)):
                pool = []
                with z.open(name) as f:
                    for raw in f:
                        try:
                            word = json.loads(raw).get("native word") or ""
                        except ValueError:
                            continue
                        if RUN.fullmatch(word):
                            pool.append(word)
                for w in rng.sample(pool, min(n, len(pool))):
                    add(w, "aksharantar")
    for w in NUMBERS:
        add(w, "numerals")
    base = [w for w in entries if RUN.fullmatch(w) and 2 <= len(w) <= 12]
    rng.shuffle(base)
    for w in base[:900]:  # orthographic variants of real words
        nfd = unicodedata.normalize("NFD", w)
        if nfd != w:
            add(nfd, "variants")
        if "ं" in w:
            add(w.replace("ं", "ँ"), "variants")
        if "ँ" in w:
            add(w.replace("ँ", "ं"), "variants")
        for cp in range(0x0958, 0x0960):
            decomposed = unicodedata.normalize("NFD", chr(cp))
            if decomposed in w:
                add(w.replace(decomposed, chr(cp)), "variants")
        if NUKTA in w:
            add(w.replace(NUKTA, ""), "variants")
        for tail in ("ः", "ँ", VIRAMA, "ऽ"):
            add(w + tail, "variants")
        if VIRAMA in w:
            add(w.replace(VIRAMA, VIRAMA + ZWJ, 1), "variants")
            add(w.replace(VIRAMA, VIRAMA + ZWNJ, 1), "variants")
        add(w[:1] + "ाा" + w[1:], "variants")
    cons = [chr(c) for c in range(0x0915, 0x093a)]
    matras = [chr(c) for c in (0x093e, 0x093f, 0x0940, 0x0941, 0x0942, 0x0943, 0x0944, 0x0945, 0x0946, 0x0947, 0x0948, 0x0949, 0x094a, 0x094b, 0x094c)]
    vowels = [chr(c) for c in range(0x0904, 0x0915)]
    for a in cons:
        for b in cons:
            add(a + VIRAMA + b + "ा", "synthetic")
        for m in matras:
            add(a + m, "synthetic")
        add(a, "synthetic")
        add(a + VIRAMA, "synthetic")
        add(a + NUKTA, "synthetic")
        add(a + NUKTA + "ा", "synthetic")
    for _ in range(400):
        add(rng.choice(cons) + VIRAMA + rng.choice(cons) + VIRAMA + rng.choice(cons) + rng.choice(matras), "synthetic")
    for cp in range(0x0900, 0x0980):
        if RUN.fullmatch(chr(cp)):
            add(chr(cp), "synthetic")
            add(chr(cp) * 2, "synthetic")
    pool = cons + vowels
    for n in range(1, 41):
        for _ in range(12):
            s = ""
            while len(s) < n:
                s += rng.choice(pool) + (rng.choice(matras) if rng.random() < 0.5 else "") + rng.choice(["ं", "ँ", "ः", ""])
            add(s[:n], "synthetic")
    for unit in ("अ", "क", "त्र", "है"):
        for n in (30, 60, 100, 150):
            add(unit * n, "synthetic")
    return entries


def main():
    here = Path(__file__).resolve().parent.parent
    sys.path.insert(0, str(here))
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--subtitles", type=Path)
    p.add_argument("--wiki-titles", type=Path)
    p.add_argument("--aksharantar", type=Path)
    p.add_argument("--out", type=Path, required=True)
    p.add_argument("--limit", type=int, help="only the first N words (smoke test)")
    args = p.parse_args()

    import ctranslate2
    from app import config, hinglish
    from app.indicxlit import IndicXlit, prepared
    if not prepared():
        sys.exit("The server model is not prepared. Run: python -m tools.prepare_indicxlit")
    entries = candidate_words(args, here)
    words = list(entries.items())[: args.limit]
    model_dir = str(Path(config.MODEL_DIR) / "indicxlit-ct2")
    production = IndicXlit()  # exactly what the server constructs
    direct = ctranslate2.Translator(model_dir, device="cpu", compute_type="int8", inter_threads=1, intra_threads=2)

    def decode(word, beam, hypotheses=1, scores=False):
        tokens = ["__hi__", *unicodedata.normalize("NFC", word)]
        result = direct.translate_batch([tokens], beam_size=beam, num_hypotheses=hypotheses, max_decoding_length=96, return_scores=scores)[0]
        return ["".join(h) for h in result.hypotheses], (list(result.scores) if scores else None)

    rows, started = [], time.perf_counter()
    for i, (word, cats) in enumerate(words):
        b4 = production.translit_word(word, "hi", 1)[0]
        top4, scores = decode(word, 4, 4, True)
        server = bool(RUN.fullmatch(word))
        row = {"w": word, "nfc": unicodedata.normalize("NFC", word), "server": server, "cat": sorted(cats),
               "b4": b4, "b1": decode(word, 1)[0][0], "top4": top4, "top4_scores": [round(float(s), 6) for s in scores]}
        if server:
            try:
                row["pipeline"] = hinglish.romanize(word, "indicxlit")
            except hinglish.RomanizerUnavailable as exc:
                row["pipeline_error"] = str(exc)
            row["basic"] = hinglish.romanize(word, "basic")
        rows.append(row)
        if (i + 1) % 2000 == 0:
            print(f"{i + 1}/{len(words)} {time.perf_counter() - started:.0f}s", flush=True)
    meta = {"ctranslate2": ctranslate2.__version__, "words": len(rows), "server_reachable": sum(r["server"] for r in rows),
            "settings": {"compute_type": "int8", "inter_threads": 1, "intra_threads": 2, "beam_size_server": 4, "max_decoding_length": 96},
            "b4_vs_b1_differ": sum(r["b4"] != r["b1"] for r in rows)}
    args.out.write_text(json.dumps({"meta": meta, "rows": rows}, ensure_ascii=False), encoding="utf-8")
    print(json.dumps(meta, indent=1))


if __name__ == "__main__":
    main()
