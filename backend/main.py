from gtts import gTTS
from TTS import allignment


def tts(text):
    """Generate English gTTS audio and return output path."""
    target_path = "audio/mishnah_en.mp3"
    tts_obj = gTTS(text, lang="en")
    tts_obj.save(target_path)
    return target_path


def tts_with_alignment(english_text):
    """Generate English gTTS and run alignment mapping based on existing Eleven alignment."""
    audio_file = tts(english_text)
    allignment.align_eleven_to_audio(
        alignment_input="alignment.json",
        real_audio_file=audio_file,
        remapped_chars_output="remapped_chars.json",
        word_alignment_output="word_alignment.json",
    )
    return audio_file
