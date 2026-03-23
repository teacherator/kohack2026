import requests
import base64
import json
import sys

# ===== CONFIG =====
API_KEY = "sk_66bf70b99e33b122703a58124821c88cfe07d705aa7ff760"
VOICE_ID = "pNInz6obpgDQGcFmaJgB"
MODEL_ID = "eleven_multilingual_v2"


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


def get_daily_mishnah_data():
    mishnah_item = get_daily_mishnah_item()
    mishnah_url = mishnah_item["url"]

    response = requests.get(
        f"https://www.sefaria.org/api/v3/texts/{mishnah_url}?return_format=text_only",
        timeout=30,
    )
    response.raise_for_status()
    data = response.json()

    hebrew_segments = get_text_segments_from_versions(data.get("versions", []), "he")

    if not hebrew_segments:
        raise RuntimeError("Could not find Hebrew text in Sefaria response.")

    return {
        "displayed_mishnah_en": mishnah_item.get("displayValue", {}).get("en"),
        "displayed_mishnah_he": mishnah_item.get("displayValue", {}).get("he"),
        "ref": mishnah_item.get("ref"),
        "url": mishnah_item.get("url"),
        "hebrew_segments": hebrew_segments,
        "hebrew_combined": " ".join(hebrew_segments),
    }


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


def save_outputs(result, mishnah_data):
    audio_bytes = base64.b64decode(result["audio_base64"])

    with open("audio.mp3", "wb") as f:
        f.write(audio_bytes)

    with open("alignment.json", "w", encoding="utf-8") as f:
        json.dump(result["alignment"], f, ensure_ascii=False, indent=2)

    with open("mishnah_data.json", "w", encoding="utf-8") as f:
        json.dump(mishnah_data, f, ensure_ascii=False, indent=2)

    print("Saved audio.mp3")
    print("Saved alignment.json")
    print("Saved mishnah_data.json")


def main():
    if API_KEY == "YOUR_API_KEY" or API_KEY == "REPLACE_ME" or VOICE_ID == "YOUR_VOICE_ID":
        raise RuntimeError("Replace YOUR_API_KEY and YOUR_VOICE_ID first.")

    mishnah_data = get_daily_mishnah_data()

    print("Displayed Mishnah:")
    print(mishnah_data["displayed_mishnah_en"])
    print(mishnah_data["displayed_mishnah_he"])
    print()

    print("Hebrew segments:")
    for i, seg in enumerate(mishnah_data["hebrew_segments"], start=1):
        print(f"{i}. {seg}")
    print()

    result = generate_tts_with_timestamps(mishnah_data["hebrew_combined"])
    save_outputs(result, mishnah_data)


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print("ERROR:", e)
        sys.exit(1)