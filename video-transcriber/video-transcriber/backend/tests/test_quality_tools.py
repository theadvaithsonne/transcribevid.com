from tools.compare_engines import score


def test_hindi_english_reference_scores_original_recognition_not_pretty_output():
    # A conversion must not conceal a recognition substitution from the accuracy metric.
    segments = [{"text": "student ki life", "original_text": "student की लाइप"}]
    result = score("student की लाइफ", segments)
    assert result["n_ref"] == 3 and result["errors"] == 1
    assert score("student की लाइफ", [{"text": "student की लाइफ।"}])["errors"] == 0
