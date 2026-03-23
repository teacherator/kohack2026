import json
from mutagen.mp3 import MP3

ALIGNMENT_INPUT = "TTS/alignment/alignment.json"
REAL_AUDIO_FILE = "TTS/audio/mishnah_en.mp3"

REMAPPED_CHARS_OUTPUT = "TTS/alignment/remapped_chars.json"
WORD_ALIGNMENT_OUTPUT = "TTS/alignment/word_alignment.json"


def load_alignment(path: str):
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Handle either:
    # 1. raw list of chars
    # 2. full ElevenLabs response with alignment fields
    if isinstance(data, list):
        return data

    if isinstance(data, dict):
        if "alignment" in data and isinstance(data["alignment"], list):
            return data["alignment"]

        # Some responses may store char-level arrays differently
        if (
            "characters" in data
            and "character_start_times_seconds" in data
            and "character_end_times_seconds" in data
        ):
            chars = data["characters"]
            starts = data["character_start_times_seconds"]
            ends = data["character_end_times_seconds"]

            if not (len(chars) == len(starts) == len(ends)):
                raise ValueError("Alignment arrays are not the same length.")

            return [
                {"char": ch, "start": start, "end": end}
                for ch, start, end in zip(chars, starts, ends)
            ]

    raise ValueError("Unsupported alignment.json format.")


def get_mp3_duration(path: str) -> float:
    audio = MP3(path)
    return float(audio.info.length)


def get_alignment_duration(char_alignment: list[dict]) -> float:
    if not char_alignment:
        raise ValueError("Alignment is empty.")
    return float(char_alignment[-1]["end"])


def remap_alignment(char_alignment: list[dict], old_duration: float, new_duration: float):
    if old_duration <= 0:
        raise ValueError("Old duration must be > 0.")

    scale = new_duration / old_duration
    remapped = []

    for item in char_alignment:
        remapped.append({
            "char": item["char"],
            "start": item["start"] * scale,
            "end": item["end"] * scale,
        })

    return remapped


def chars_to_words(char_alignment: list[dict]):
    words = []
    current_word = ""
    current_start = None
    current_end = None

    for item in char_alignment:
        ch = item["char"]

        if ch.isspace():
            if current_word:
                words.append({
                    "word": current_word,
                    "start": current_start,
                    "end": current_end,
                })
                current_word = ""
                current_start = None
                current_end = None
            continue

        if current_start is None:
            current_start = item["start"]

        current_word += ch
        current_end = item["end"]

    if current_word:
        words.append({
            "word": current_word,
            "start": current_start,
            "end": current_end,
        })

    return words


def save_json(path: str, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def main():
    char_alignment = load_alignment(ALIGNMENT_INPUT)

    elevenlabs_duration = get_alignment_duration(char_alignment)
    real_audio_duration = get_mp3_duration(REAL_AUDIO_FILE)

    remapped_chars = remap_alignment(
        char_alignment,
        old_duration=elevenlabs_duration,
        new_duration=real_audio_duration,
    )

    word_alignment = chars_to_words(remapped_chars)

    save_json(REMAPPED_CHARS_OUTPUT, remapped_chars)
    save_json(WORD_ALIGNMENT_OUTPUT, word_alignment)

    print("ElevenLabs alignment duration:", round(elevenlabs_duration, 3), "seconds")
    print("Real audio duration:", round(real_audio_duration, 3), "seconds")
    print("Saved:", REMAPPED_CHARS_OUTPUT)
    print("Saved:", WORD_ALIGNMENT_OUTPUT)

    print("\nFirst 10 words:")
    for word in word_alignment[:10]:
        print(word)


if __name__ == "__main__":
    main()