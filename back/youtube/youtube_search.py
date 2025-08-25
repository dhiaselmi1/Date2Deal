# youtube_search.py
# -------------------------------------------------------------
# Recherche YouTube (Google YouTube Data API v3) + transcripts via Apify
# - 5 vidéos fixes
# - Clés API HARDCODÉES (⚠️ ne pas committer en prod)
# - JSON identique au format précédent
# Prérequis:
#   pip install google-api-python-client apify-client
# Exécution:
#   python youtube_search.py "Nicolas Dufourcq"
# -------------------------------------------------------------

import os
import sys
import json
import time
import random
from datetime import datetime

from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from apify_client import ApifyClient

# ============== CONFIG (remplacer par tes vraies clés) ==============
YT_API_KEY   = "AIzaSyC8TFCXVX3FZpjGzNIL8TtTXSqloHD61lQ"     # <--- clé YouTube Data v3
APIFY_TOKEN  = "apify_api_LRVafPiBL8Wem02sYb7j5MEdrTMV7J1dazqG"            # <--- token Apify
APIFY_ACTOR_ID = "CTQcdDtqW5dvELvur"                     # Actor Apify donné
APIFY_LANGUAGE = "Default"                                # ou "French" selon actor
APIFY_INCLUDE_TIMESTAMPS = "No"                           # "Yes" / "No"

MAX_VIDEOS = 5
PAUSE_BETWEEN_VIDEOS = (0.5, 1.1)  # petite pause propre


# ===================== YOUTUBE SEARCH =====================
def get_youtube_client():
    if not YT_API_KEY or "REMPLACE_PAR" in YT_API_KEY:
        raise RuntimeError("La clé YT_API_KEY n'est pas définie dans le code.")
    try:
        return build("youtube", "v3", developerKey=YT_API_KEY)
    except Exception as e:
        raise RuntimeError(f"Erreur init client YouTube: {e}")

def search_youtube_videos(yt, query: str, max_results: int = MAX_VIDEOS):
    try:
        req = yt.search().list(
            part="snippet",
            q=query,
            maxResults=max_results,
            type="video",
            safeSearch="none"
        )
        resp = req.execute()
    except HttpError as e:
        raise RuntimeError(f"Erreur YouTube Data API: {e}")
    except Exception as e:
        raise RuntimeError(f"Erreur recherche YouTube: {e}")

    videos = []
    for item in resp.get("items", []):
        vid = (item.get("id") or {}).get("videoId")
        title = (item.get("snippet") or {}).get("title")
        if not vid or not title:
            continue
        videos.append({
            "title": title,
            "videoId": vid,
            "url": f"https://www.youtube.com/watch?v={vid}",
        })
        if len(videos) >= max_results:
            break
    return videos


# ===================== APIFY TRANSCRIPTS =====================
def fetch_transcript_via_apify(video_url: str) -> tuple[str | None, str]:
    """
    Appelle l'Actor Apify pour extraire le transcript d'une vidéo YouTube.
    Retourne (texte, source) ou (None, 'apify-...').
    """
    if not APIFY_TOKEN or "REMPLACE_PAR" in APIFY_TOKEN:
        return None, "apify-missing-token"

    try:
        client = ApifyClient(APIFY_TOKEN)
        run_input = {
            "startUrls": [video_url],
            "language": APIFY_LANGUAGE,
            "includeTimestamps": APIFY_INCLUDE_TIMESTAMPS,
        }
        run = client.actor(APIFY_ACTOR_ID).call(run_input=run_input)

        dataset_id = run.get("defaultDatasetId")
        if not dataset_id:
            return None, "apify-no-dataset"

        texts = []
        for item in client.dataset(dataset_id).iterate_items():
            if not isinstance(item, dict):
                continue
            # Essayer différents schémas de sortie possibles de l'actor
            if isinstance(item.get("transcript"), str) and item["transcript"].strip():
                texts.append(item["transcript"].strip())
            elif isinstance(item.get("captions"), list):
                segs = [(seg.get("text") or "").strip() for seg in item["captions"] if isinstance(seg, dict)]
                texts.append(" ".join([s for s in segs if s]))
            elif isinstance(item.get("segments"), list):
                segs = [(seg.get("text") or "").strip() for seg in item["segments"] if isinstance(seg, dict)]
                texts.append(" ".join([s for s in segs if s]))
            elif isinstance(item.get("text"), str) and item["text"].strip():
                texts.append(item["text"].strip())

        full = " ".join([t for t in texts if t]).strip()
        if full:
            return full, "apify"
        return None, "apify-no-transcript"

    except Exception as e:
        return None, f"apify-error:{type(e).__name__}"


# ===================== MAIN PIPELINE =====================
def run(query: str):
    print(f"\n▶️ Recherche de vidéos pour : '{query}'\n")

    yt = get_youtube_client()
    videos = search_youtube_videos(yt, query, max_results=MAX_VIDEOS)
    if not videos:
        print("❌ Aucune vidéo trouvée.")
        return False

    results = {
        "search_query": query,
        "search_date": datetime.now().isoformat(),
        "videos": []
    }

    for idx, v in enumerate(videos, 1):
        print(f"  ✓ Vidéo {idx}/{MAX_VIDEOS}")
        print(f"    {v['title'][:80]}…  ({v['url']})")

        info = {
            "video_number": idx,
            "title": v["title"],
            "video_id": v["videoId"],
            "url": v["url"],
            "subtitles_available": False,
            "full_speech": "",
            "subtitle_source": None,
            "error": None
        }

        text, src = fetch_transcript_via_apify(v["url"])
        if text:
            info["subtitles_available"] = True
            info["full_speech"] = text
            info["subtitle_source"] = src
            print(f"    ✓ Transcript OK ({src}), {len(text)} caractères")
        else:
            info["error"] = src
            print(f"    ✗ Transcript indisponible ({src})")

        results["videos"].append(info)
        time.sleep(random.uniform(*PAUSE_BETWEEN_VIDEOS))

    # Sauvegarde JSON
    script_dir = os.path.dirname(__file__)
    safe_query = "".join(c for c in query if c.isalnum() or c in (" ", "-", "_")).strip().replace(" ", "_")
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    out_path = os.path.join(script_dir, f"youtube_search_{safe_query}_{ts}.json")

    try:
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(results, f, ensure_ascii=False, indent=2)
        with_subs = sum(1 for v in results["videos"] if v["subtitles_available"])
        print("\n📊 Résumé :")
        print(f"  - Vidéos traitées : {MAX_VIDEOS}")
        print(f"  - Avec transcripts : {with_subs}/{MAX_VIDEOS}")
        print(f"\n✅ Fichier : {out_path}")
        return True
    except Exception as e:
        print(f"❌ Erreur sauvegarde JSON: {e}")
        return False


# ===================== CLI =====================
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python youtube_search.py \"<terme_de_recherche>\"")
        sys.exit(1)

    ok = run(sys.argv[1])
    sys.exit(0 if ok else 1)
