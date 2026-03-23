import requests
import base64
import json
import sys
from pathlib import Path

# ===== CONFIG =====
API_KEY = "REPLACE_ME"
VOICE_ID = "pNInz6obpgDQGcFmaJgB"
MODEL_ID = "eleven_multilingual_v2"

BASE_DIR = Path(__file__).resolve().parent
OUTPUT_AUDIO = BASE_DIR / "audio.mp3"
OUTPUT_ALIGNMENT = BASE_DIR / "alignment.json"
OUTPUT_TEXT_DATA = BASE_DIR / "daily_mishnah_text.json"


def get_daily_mishnah_item():
    response = requests.get("https://www.sefaria.org/api/calendars", timeout=30)
    response.raise_for_status()
    data = response.json()

    for item in data.get("calendar_items", []):
        if item.get("category") == "Mishnah":
            return item

    raise RuntimeError("Could not find daily Mishnah in Sefaria calendar data.")


def flatten_text_segments(text):
    segments = []

    def walk(value):
        if isinstance(value, str):
            cleaned = value.replace("\n", " ").strip()
            if cleaned:
                segments.append(cleaned)
        elif isinstance(value, list):
            for item in value:
                walk(item)

    walk(text)
    return segments


def get_text_segments_from_versions(versions, lang):
    for version in versions:
        if version.get("language") == lang:
            text = version.get("text")

            if isinstance(text, (list, str)):
                return flatten_text_segments(text)

    return []


def get_daily_mishnah_text_data():
    mishnah_item = get_daily_mishnah_item()
    mishnah_url = mishnah_item["url"]

    response = requests.get(
        f"https://www.sefaria.org/api/v3/texts/{mishnah_url}?return_format=text_only",
        timeout=30,
    )
    response.raise_for_status()
    data = response.json()

    hebrew_segments = get_text_segments_from_versions(data.get("versions", []), "he")
    english_segments = get_text_segments_from_versions(data.get("versions", []), "en")

    if not hebrew_segments:
        raise RuntimeError("Could not find Hebrew text in Sefaria response.")

    result = {
        "displayed_mishnah": mishnah_item.get("displayValue", {}).get("en") or mishnah_item.get("ref"),
        "displayed_mishnah_he": mishnah_item.get("displayValue", {}).get("he") or mishnah_item.get("heRef"),
        "ref": mishnah_item.get("ref"),
        "url": mishnah_item.get("url"),
        "hebrew_segments": hebrew_segments,
        "english_segments": english_segments,
        "hebrew_combined": " ".join(hebrew_segments),
        "english_combined": " ".join(english_segments),
    }

    return result


def generate_tts_with_timestamps(text):
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}/with-timestamps"

    headers = {
        "xi-api-key": API_KEY,
        "Content-Type": "application/json",
    }

    payload = {
        "text": text,
        "model_id": MODEL_ID,
    }

    response = requests.post(url, headers=headers, json=payload, timeout=120)

    print("ElevenLabs status code:", response.status_code)
    print("ElevenLabs raw response preview:")
    print(response.text[:1000])
    print()

    response.raise_for_status()
    result = response.json()

    if "audio_base64" not in result:
        raise RuntimeError(
            "ElevenLabs response did not include 'audio_base64'.\n"
            + json.dumps(result, ensure_ascii=False, indent=2)
        )

    if "alignment" not in result:
        raise RuntimeError(
            "ElevenLabs response did not include 'alignment'.\n"
            + json.dumps(result, ensure_ascii=False, indent=2)
        )

    return result


def save_outputs(tts_result, text_data):
    audio_bytes = base64.b64decode(tts_result["audio_base64"])

    with open(OUTPUT_AUDIO, "wb") as f:
        f.write(audio_bytes)

    with open(OUTPUT_ALIGNMENT, "w", encoding="utf-8") as f:
        json.dump(tts_result["alignment"], f, ensure_ascii=False, indent=2)

    with open(OUTPUT_TEXT_DATA, "w", encoding="utf-8") as f:
        json.dump(text_data, f, ensure_ascii=False, indent=2)

    print(f"Saved {OUTPUT_AUDIO}")
    print(f"Saved {OUTPUT_ALIGNMENT}")
    print(f"Saved {OUTPUT_TEXT_DATA}")


def main():
    if API_KEY in {"YOUR_API_KEY", "REPLACE_ME"} or VOICE_ID == "YOUR_VOICE_ID":
        raise RuntimeError("Replace API_KEY and VOICE_ID first.")

    text_data = get_daily_mishnah_text_data()

    print("Displayed Mishnah:")
    print(text_data["displayed_mishnah"])
    print(text_data["displayed_mishnah_he"])
    print()

    print("Ref:")
    print(text_data["ref"])
    print()

    print("Hebrew segments:")
    for i, seg in enumerate(text_data["hebrew_segments"], start=1):
        print(f"{i}. {seg}")
    print()

    print("English segments:")
    for i, seg in enumerate(text_data["english_segments"], start=1):
        print(f"{i}. {seg}")
    print()

    print("Hebrew combined for TTS:")
    print(text_data["hebrew_combined"])
    print()

    tts_result = generate_tts_with_timestamps(text_data["hebrew_combined"])
    save_outputs(tts_result, text_data)


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print("ERROR:", e)
        sys.exit(1)