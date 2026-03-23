from typing import Any

import numpy as np
import sounddevice as sd
from transformers import pipeline

SAMPLE_RATE = 16000
DURATION_SECONDS = 4

asr_pipeline = None

def get_asr_pipeline():
    global asr_pipeline
    if asr_pipeline is None:
        asr_pipeline = pipeline(
            "automatic-speech-recognition",
            model="openai/whisper-small",
        )
    return asr_pipeline


def record_audio():
    print("Listening...")
    audio = sd.rec(
        int(DURATION_SECONDS * SAMPLE_RATE),
        samplerate=SAMPLE_RATE,
        channels=1,
        dtype="float32",
    )
    sd.wait()

    audio = np.squeeze(audio).astype(np.float32)
    return audio

def transcribe_once():
    audio = record_audio()
    model = get_asr_pipeline()

    result: Any = model({
        "sampling_rate": SAMPLE_RATE,
        "raw": audio,
    })

    text = ""
    if isinstance(result, str):
        text = result
    elif isinstance(result, dict) and "text" in result:
        text = result["text"]
    elif isinstance(result, list) and result and isinstance(result[0], dict) and "text" in result[0]:
        text = result[0]["text"]
    else:
        raise RuntimeError(f"Unexpected ASR output format: {type(result)} {result}")

    return str(text).strip().lower()