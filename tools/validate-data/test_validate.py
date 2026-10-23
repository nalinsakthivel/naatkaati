"""Mutation tests use temporary copies; checked-in datasets are never modified."""
import importlib.util
import json
from pathlib import Path
import shutil
import tempfile
import unittest
from unittest.mock import patch

SPEC = importlib.util.spec_from_file_location("validate", Path(__file__).with_name("validate.py"))
validator = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(validator)
DATA = Path(__file__).resolve().parents[2] / "data"


class DatasetValidationTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name) / "data"
        shutil.copytree(DATA, self.root)
        self.root_patch = patch.object(validator, "ROOT", self.root)
        self.root_patch.start()
        self.addCleanup(self.root_patch.stop)
        validator.errors.clear()

    def change(self, name, mutate):
        path = self.root / name
        data = json.loads(path.read_text())
        mutate(data)
        path.write_text(json.dumps(data, ensure_ascii=False))

    def rejects(self, check, text):
        check()
        self.assertTrue(any(text in error for error in validator.errors), validator.errors)

    def test_original_data_passes(self):
        for check in (validator.holidays, validator.commemorations, validator.tamil_months,
                      validator.thirukkural, validator.manifest):
            check()
        self.assertEqual(validator.errors, [])

    def test_duplicate_kural_cannot_replace_missing_number(self):
        self.change("thirukkural.json", lambda d: d["kurals"][1].update(number=1))
        self.rejects(validator.thirukkural, "kural numbering")

    def test_duplicate_chapter_cannot_replace_missing_number(self):
        self.change("thirukkural.json", lambda d: d["adhikarams"][1].update(number=1))
        self.rejects(validator.thirukkural, "chapter numbering")

    def test_wrong_chapter_assignment(self):
        self.change("thirukkural.json", lambda d: d["kurals"][0].update(adhikaram=2))
        self.rejects(validator.thirukkural, "wrong adhikaram")

    def test_whitespace_source_is_not_attribution(self):
        self.change("holidays/2026.json", lambda d: d["holidays"][0].update(source="  "))
        self.rejects(validator.holidays, "missing source")

    def test_compact_iso_date_is_rejected(self):
        self.change("holidays/2026.json", lambda d: d["holidays"][0].update(date="20260101"))
        self.rejects(validator.holidays, "bad date")

    def test_manifest_rejects_wrong_byte_count(self):
        self.change("manifest.json", lambda d: d["datasets"][0].update(bytes=1))
        self.rejects(validator.manifest, "byte count")

    def test_manifest_rejects_duplicate_name(self):
        self.change("manifest.json", lambda d: d["datasets"].append(d["datasets"][0].copy()))
        self.rejects(validator.manifest, "duplicate dataset")

    def test_invalid_month_date_reports_error_without_crashing(self):
        self.change("tamil-months.json", lambda d: d["months"][1].update(start="1900-02-30"))
        self.rejects(validator.tamil_months, "bad date")

    def test_invalid_holiday_category(self):
        self.change("holidays/2026.json", lambda d: d["holidays"][0].update(category="astrology"))
        self.rejects(validator.holidays, "bad category")

    def test_duplicate_holiday_id(self):
        self.change("holidays/2026.json", lambda d: d["holidays"].append(d["holidays"][0].copy()))
        self.rejects(validator.holidays, "duplicate id")

    def test_manifest_rejects_escape_path(self):
        self.change("manifest.json", lambda d: d["datasets"][0].update(url="../outside.json"))
        self.rejects(validator.manifest, "path escapes")


if __name__ == "__main__":
    unittest.main()
