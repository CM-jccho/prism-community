#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
PRISM daily feed updater
========================
Collects *real* public items (models, tools, prompt libraries, AI art demos,
news) from free, no-key public APIs and merges them into
``data/community-feed.json``, which the static site reads at runtime.

Sources (all public, no API key required):
  * Hugging Face — trending models        https://huggingface.co/api/models
  * Hugging Face — daily papers           https://huggingface.co/api/daily_papers
  * Hugging Face — trending Spaces        https://huggingface.co/api/spaces
  * GitHub       — recently pushed prompt/ai repos  https://api.github.com/search/repositories
  * Hacker News  — Algolia search API      https://hn.algolia.com/api/v1/search

Rules:
  * Nothing is invented: every item carries the URL it came from.
  * Re-running never duplicates an item (id = source + native id).
  * If every source fails, the existing file is left untouched and the script
    exits non-zero, so the workflow does not commit an empty feed.
  * The file is rewritten only when its content actually changed.
"""
from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "data" / "community-feed.json"
MAX_ITEMS = 80
TIMEOUT = 25
UA = "PRISM-feed-bot/1.0 (+https://github.com/CM-jccho/prism-community)"

KST = timezone(timedelta(hours=9))


def log(msg: str) -> None:
    print(f"[update_feed] {msg}", file=sys.stderr)


def get_json(url: str, headers: dict | None = None):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json", **(headers or {})})
    with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
        raw = resp.read().decode("utf-8", "replace")
    return json.loads(raw)


def iso(value) -> str:
    """Normalise a date-ish value to an ISO-8601 UTC string (or '')."""
    if not value:
        return ""
    if isinstance(value, (int, float)):
        return datetime.fromtimestamp(value, tz=timezone.utc).isoformat().replace("+00:00", "Z")
    text = str(value).strip().replace("Z", "+00:00")
    try:
        dt = datetime.fromisoformat(text)
    except ValueError:
        return ""
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")


def clip(text: str, n: int = 190) -> str:
    text = " ".join((text or "").split())
    return text if len(text) <= n else text[: n - 1].rstrip() + "…"


# --------------------------------------------------------------- collectors
# Each collector returns a list of items:
#   {id, kind, title, desc, url, source, tags[], publishedAt}
# kind is one of: model | tool | prompt | art | news


def from_hf_models() -> list[dict]:
    data = get_json(
        "https://huggingface.co/api/models"
        "?sort=trendingScore&direction=-1&limit=12&full=false"
    )
    out = []
    for m in data or []:
        mid = m.get("id") or m.get("modelId")
        if not mid:
            continue
        tags = [x for x in (m.get("tags") or []) if isinstance(x, str)][:6]
        pipe = m.get("pipeline_tag") or ""
        if pipe and pipe not in tags:
            tags.insert(0, pipe)
        out.append({
            "id": f"hf-model:{mid}",
            "kind": "model",
            "title": mid,
            # 설명은 특정 언어에 묶이지 않게 영문/숫자만 쓴다(로케일 표기는 앱이 담당).
            "desc": clip(
                f"Hugging Face · likes {m.get('likes', 0):,} · downloads {m.get('downloads', 0):,}"
                + (f" · {pipe}" if pipe else "")
            ),
            "url": f"https://huggingface.co/{mid}",
            "source": "Hugging Face",
            "tags": tags,
            "publishedAt": iso(m.get("createdAt")),
        })
    return out


def from_hf_papers() -> list[dict]:
    data = get_json("https://huggingface.co/api/daily_papers?limit=10")
    out = []
    for entry in data or []:
        paper = entry.get("paper") or {}
        pid = paper.get("id") or entry.get("id")
        title = entry.get("title") or paper.get("title")
        if not pid or not title:
            continue
        out.append({
            "id": f"hf-paper:{pid}",
            "kind": "news",
            "title": title,
            "desc": clip(paper.get("summary") or entry.get("summary") or "Hugging Face Daily Papers"),
            "url": f"https://huggingface.co/papers/{pid}",
            "source": "HF Daily Papers",
            "tags": ["paper", "research"],
            "publishedAt": iso(entry.get("publishedAt") or paper.get("publishedAt")),
        })
    return out


def from_hf_spaces() -> list[dict]:
    data = get_json(
        "https://huggingface.co/api/spaces"
        "?sort=trendingScore&direction=-1&limit=12&full=false"
    )
    out = []
    for s in data or []:
        sid = s.get("id")
        if not sid:
            continue
        sdk = s.get("sdk") or "gradio"
        out.append({
            "id": f"hf-space:{sid}",
            "kind": "art",
            "title": sid,
            "desc": clip(f"Hugging Face Space · {sdk} demo · likes {s.get('likes', 0):,}"),
            "url": f"https://huggingface.co/spaces/{sid}",
            "source": "Hugging Face Spaces",
            "tags": ["space", sdk],
            "publishedAt": iso(s.get("createdAt")),
        })
    return out


def from_github() -> list[dict]:
    since = (datetime.now(timezone.utc) - timedelta(days=14)).strftime("%Y-%m-%d")
    headers = {}
    token = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"
    queries = [
        ("prompt", f"topic:prompt-engineering pushed:>{since} stars:>20"),
        ("tool", f"topic:text-to-image pushed:>{since} stars:>50"),
    ]
    out = []
    for kind, q in queries:
        url = (
            "https://api.github.com/search/repositories?q="
            + urllib.parse.quote(q)
            + "&sort=stars&order=desc&per_page=8"
        )
        try:
            payload = get_json(url, headers)
        except urllib.error.HTTPError as exc:
            if exc.code not in (401, 403) or not headers:
                raise
            # 토큰이 만료·무효면 익명 요청(분당 10회)으로 한 번 더 시도한다.
            payload = get_json(url)
        for repo in (payload.get("items") or []):
            full = repo.get("full_name")
            if not full:
                continue
            topics = [t for t in (repo.get("topics") or []) if isinstance(t, str)][:5]
            out.append({
                "id": f"gh-repo:{full}",
                "kind": kind,
                "title": full,
                "desc": clip(repo.get("description") or "AI repository updated recently on GitHub"),
                "url": repo.get("html_url") or f"https://github.com/{full}",
                "source": "GitHub",
                "tags": topics,
                "publishedAt": iso(repo.get("pushed_at") or repo.get("updated_at")),
            })
    return out


def from_hn() -> list[dict]:
    cutoff = int((datetime.now(timezone.utc) - timedelta(days=3)).timestamp())
    out = []
    for term in ("AI art", "prompt", "generative AI"):
        url = (
            "https://hn.algolia.com/api/v1/search?query="
            + urllib.parse.quote(term)
            + f"&tags=story&hitsPerPage=6&numericFilters=points>40,created_at_i>{cutoff}"
        )
        for hit in (get_json(url).get("hits") or []):
            oid = hit.get("objectID")
            title = hit.get("title")
            if not oid or not title:
                continue
            link = hit.get("url") or f"https://news.ycombinator.com/item?id={oid}"
            out.append({
                "id": f"hn:{oid}",
                "kind": "news",
                "title": title,
                "desc": clip(f"Hacker News · {hit.get('points', 0)} points · {hit.get('num_comments', 0)} comments"),
                "url": link,
                "source": "Hacker News",
                "tags": ["news"],
                "publishedAt": iso(hit.get("created_at_i")),
            })
    return out


COLLECTORS = [
    ("Hugging Face models", from_hf_models),
    ("Hugging Face papers", from_hf_papers),
    ("Hugging Face Spaces", from_hf_spaces),
    ("GitHub", from_github),
    ("Hacker News", from_hn),
]


# --------------------------------------------------------------- merge / save
def load_existing() -> dict:
    if not OUT.exists():
        return {"version": 1, "updatedAt": "", "sources": [], "items": []}
    try:
        data = json.loads(OUT.read_text(encoding="utf-8"))
    except (ValueError, OSError) as exc:
        log(f"기존 파일을 읽지 못했습니다: {exc}")
        return {"version": 1, "updatedAt": "", "sources": [], "items": []}
    data.setdefault("items", [])
    return data


def main() -> int:
    existing = load_existing()
    merged: dict[str, dict] = {}
    for item in existing.get("items", []):
        if isinstance(item, dict) and item.get("id"):
            merged[item["id"]] = item

    ok_sources, failed_sources = [], []
    added = 0
    now = datetime.now(timezone.utc)
    for name, fn in COLLECTORS:
        try:
            items = fn()
        except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, ValueError, KeyError) as exc:
            failed_sources.append(f"{name} ({type(exc).__name__})")
            log(f"{name} 실패: {exc}")
            continue
        except Exception as exc:  # noqa: BLE001 - one source must not kill the run
            failed_sources.append(f"{name} ({type(exc).__name__})")
            log(f"{name} 실패: {exc}")
            continue
        count = 0
        for item in items:
            if not item.get("id") or not item.get("title") or not item.get("url"):
                continue
            item.setdefault("firstSeenAt", now.isoformat().replace("+00:00", "Z"))
            item["lastSeenAt"] = now.isoformat().replace("+00:00", "Z")
            if item["id"] not in merged:
                added += 1
            merged[item["id"]] = {**merged.get(item["id"], {}), **item}
            count += 1
        ok_sources.append(f"{name} ({count})")
        log(f"{name}: {count}건")

    if not ok_sources:
        log("모든 소스가 실패했습니다. 기존 데이터를 그대로 둡니다.")
        return 1

    items = sorted(
        merged.values(),
        key=lambda it: (it.get("publishedAt") or it.get("firstSeenAt") or "", it.get("id") or ""),
        reverse=True,
    )[:MAX_ITEMS]

    payload = {
        "version": 1,
        "generatedBy": "scripts/update_feed.py",
        "updatedAt": now.isoformat().replace("+00:00", "Z"),
        "updatedAtKst": now.astimezone(KST).strftime("%Y-%m-%d %H:%M KST"),
        "sources": ok_sources,
        "failedSources": failed_sources,
        "count": len(items),
        "items": items,
    }

    text = json.dumps(payload, ensure_ascii=False, indent=2, sort_keys=False) + "\n"
    if OUT.exists() and OUT.read_text(encoding="utf-8") == text:
        log("변경 사항이 없어 파일을 그대로 둡니다.")
        return 0
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(text, encoding="utf-8")
    log(f"저장 완료: {OUT} · 신규 {added}건 · 전체 {len(items)}건")
    return 0


if __name__ == "__main__":
    sys.exit(main())
