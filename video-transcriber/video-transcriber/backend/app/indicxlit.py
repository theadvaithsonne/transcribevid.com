"""Small CTranslate2 runtime for the official, prepared IndicXlit model."""
import unicodedata
from pathlib import Path

from . import config


def prepared():
    return (Path(config.MODEL_DIR) / "indicxlit-ct2/model.bin").is_file()


class IndicXlit:
    def __init__(self):
        import ctranslate2
        self.model = ctranslate2.Translator(str(Path(config.MODEL_DIR) / "indicxlit-ct2"),
            device="cpu", compute_type="int8", inter_threads=1, intra_threads=2)

    def translit_word(self, word, lang_code="hi", topk=1):
        if lang_code != "hi":
            raise ValueError("The application's prepared converter is for Hindi.")
        tokens = ["__hi__", *unicodedata.normalize("NFC", word)]
        result = self.model.translate_batch([tokens], beam_size=max(4, topk), num_hypotheses=topk,
                                            max_decoding_length=96)[0]
        return ["".join(hypothesis) for hypothesis in result.hypotheses]
