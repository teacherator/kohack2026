from gtts import gTTS
from TTS import allignment

def tts(text, language='en'):
    # Force English only
    tts = gTTS(text, lang='en')
    tts.save(f"audio/mishnah_en.mp3")
    allignment.main()
