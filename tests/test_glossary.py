"""Checks the glossary data in the frontend: every word has a picture, links resolve, and the text is clean."""

import re
from pathlib import Path

SRC = Path(__file__).resolve().parent.parent / "frontend" / "src"
TERMS_TS = (SRC / "glossary" / "terms.ts").read_text(encoding="utf-8")
PICTURES_TSX = (SRC / "glossary" / "pictures.tsx").read_text(encoding="utf-8")

ENTRY_RE = re.compile(r"\{\s*id: '([a-z0-9-]+)',(.*?)related: \[([^\]]*)\],\s*\}", re.S)
entries = [(m.group(1), m.group(2), re.findall(r"'([a-z0-9-]+)'", m.group(3))) for m in ENTRY_RE.finditer(TERMS_TS)]
ids = [e[0] for e in entries]

scenes_block = PICTURES_TSX.split("const scenes", 1)[1].split("export const PICTURE_IDS", 1)[0]
picture_ids = re.findall(r"^  '?([a-z0-9-]+)'?: \(", scenes_block, re.M)

categories = re.findall(r"^  '([^']+)',$", TERMS_TS.split("] as const", 1)[0], re.M)


def test_enough_unique_terms():
    assert len(ids) >= 110
    assert len(ids) == len(set(ids))
    assert TERMS_TS.count("    id: '") == len(ids), "an entry didn't match the expected shape"


def test_every_term_has_exactly_one_picture():
    assert sorted(picture_ids) == sorted(ids)


def test_related_terms_exist_and_are_not_self():
    known = set(ids)
    for term_id, _, related in entries:
        assert related, f"{term_id} has no related terms"
        for r in related:
            assert r in known, f"{term_id} links to unknown term {r}"
            assert r != term_id


def test_categories_are_known_and_all_used():
    used = set(re.findall(r"category: '([^']+)'", TERMS_TS))
    assert used == set(categories)


def test_text_has_no_em_dashes_or_filler():
    for term_id, body, _ in entries:
        assert "—" not in body, f"{term_id} uses an em dash"
        for phrase in ("delve", "in today's", "it's important to note", "navigate the"):
            assert phrase not in body.lower(), f"{term_id} contains filler: {phrase}"


def test_every_term_used_in_the_app_exists():
    used = set()
    for path in SRC.rglob("*.tsx"):
        used.update(re.findall(r"<Term\s+id=\"([a-z0-9-]+)\"", path.read_text(encoding="utf-8")))
        for expr in re.findall(r"<Term\s+id=\{([^}]*)\}", path.read_text(encoding="utf-8")):
            used.update(re.findall(r"[?:]\s*'([a-z0-9-]+)'", expr))
    assert used, "no Term usages found"
    assert used <= set(ids), f"unknown terms used: {used - set(ids)}"
