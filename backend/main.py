from gtts import gTTS

def tts(text, language):
    tts = gTTS(text, lang=language)
    tts.save(f"audio/mishnah_{language}.mp3")
