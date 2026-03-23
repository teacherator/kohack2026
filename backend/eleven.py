import requests
import base64
import json
import sys

# ===== CONFIG =====
API_KEY = "sk_66bf70b99e33b122703a58124821c88cfe07d705aa7ff760"
VOICE_ID = "pNInz6obpgDQGcFmaJgB"
MODEL_ID = "eleven_multilingual_v2"


def get_daily_mishnah_url():
    response = requests.get("https://www.sefaria.org/api/calendars", timeout=30)
    response.raise_for_status()
    data = response.json()

    for item in data.get("calendar_items", []):
        if item.get("category") == "Mishnah":
            return item["url"]

    raise RuntimeError("Could not find daily Mishnah in Sefaria calendar data.")


def get_text_from_versions(versions, lang):
    for version in versions:
        if version.get("language") == lang:
            text = version.get("text")
            if isinstance(text, list) and text:
                if isinstance(text[0], str):
                    return text[0].replace("\n", " ").strip()
            elif isinstance(text, str):
                return text.replace("\n", " ").strip()
    return None


def get_daily_mishnah_hebrew():
    mishnah_url = get_daily_mishnah_url()

    response = requests.get(
        f"https://www.sefaria.org/api/v3/texts/{mishnah_url}?return_format=text_only",
        timeout=30,
    )
    response.raise_for_status()
    data = response.json()

    hebrew_text = get_text_from_versions(data.get("versions", []), "he")
    if not hebrew_text:
        raise RuntimeError("Could not find Hebrew text in Sefaria response.")

    return hebrew_text


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


def save_outputs(result):
    audio_bytes = base64.b64decode(result["audio_base64"])

    with open("audio.mp3", "wb") as f:
        f.write(audio_bytes)

    with open("alignment.json", "w", encoding="utf-8") as f:
        json.dump(result["alignment"], f, ensure_ascii=False, indent=2)

    print("Saved audio.mp3")
    print("Saved alignment.json")


def main():
    if API_KEY == "YOUR_API_KEY" or VOICE_ID == "YOUR_VOICE_ID":
        raise RuntimeError("Replace YOUR_API_KEY and YOUR_VOICE_ID first.")

    hebrew_text = get_daily_mishnah_hebrew()

    print("Hebrew text:")
    print(hebrew_text)
    print()

    result = generate_tts_with_timestamps(hebrew_text)
    save_outputs(result)


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print("ERROR:", e)
        sys.exit(1)