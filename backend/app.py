from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from email_service import send_update
from main import tts
import os
import json
from googletrans import Translator
from eleven import get_daily_mishnah_item, generate_tts_with_timestamps, get_daily_mishnah_data, save_outputs
from truman import main as simplify_text

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

@app.route('/api/send-update', methods=['POST'])
def send_email_update():
    """
    Send a study update email with calendar invite.
    Expects JSON: {"time_studied": 2.5, "mishnah_portion": "Berakhot 1-3"}
    Disability-friendly: Provides accessible notifications via email/screen readers.
    """
    data = request.get_json()
    if not data or 'time_studied' not in data or 'mishnah_portion' not in data:
        return jsonify({"error": "Missing required fields"}), 400

    time_studied = data['time_studied']
    mishnah_portion = data['mishnah_portion']

    try:
        send_update(time_studied, mishnah_portion)
        return jsonify({"message": "Update sent successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/translate', methods=['POST'])
def translate_text():
    """
    Translate text using Google Translate.
    Expects JSON: {"text": "mishnah text", "src": "iw", "dest": "en"}
    Defaults: src="iw" (Hebrew), dest="en" (English)
    Returns: {"translated": "translated text"}
    Disability-friendly: Provides translations for accessibility.
    """
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({"error": "Missing 'text' in request"}), 400

    text = data['text']
    src = data.get('src', 'iw')  # Default Hebrew
    dest = data.get('dest', 'en')  # Default English

    try:
        translator = Translator()
        translated = translator.translate(text, src=src, dest=dest)
        return jsonify({"translated": translated.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/hebrew-text', methods=['GET'])
def get_hebrew_text():
    """
    Get the daily Mishnah Hebrew text.
    Returns: {"hebrew_text": "text", "hebrew_segments": [], "ref": "ref"}
    """
    try:
        data = get_daily_mishnah_data()
        return jsonify({
            "hebrew_text": data["hebrew_combined"],
            "hebrew_segments": data["hebrew_segments"],
            "ref": data["ref"]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/audio/<filename>')
def serve_audio(filename):
    return send_file(f"audio/{filename}", mimetype='audio/mpeg')

@app.route('/api/tts', methods=['POST'])
def generate_tts():
    """
    Generate TTS workflow:
      1) load daily Hebrew Mishnah text
      2) generate ElevenLabs TTS + alignment
      3) translate Hebrew -> English
      4) generate gTTS English audio
      5) remap alignment to English audio
      6) return english text + audio url + alignment
    """
    try:
        # 1) Fetch daily Mishnah Hebrew text through existing Eleven helper
        mishnah_data = get_daily_mishnah_data()
        hebrew_text = mishnah_data["hebrew_combined"]

        # 2) Save Eleven Labs audio+alignment files
        eleven_result = generate_tts_with_timestamps(hebrew_text)
        save_outputs(eleven_result, mishnah_data)

        # 3) Translate to English
        translator = Translator()
        english_translation = translator.translate(hebrew_text, src='he', dest='en')
        english_text = english_translation.text

        # 4) Generate gTTS English audio and 5) align to Eleven timings
        from main import tts_with_alignment
        audio_file = tts_with_alignment(english_text)

        # 6) Load the remapped word alignment file for frontend use
        word_alignment_path = "word_alignment.json"
        word_alignment = None
        if os.path.exists(word_alignment_path):
            with open(word_alignment_path, 'r', encoding='utf-8') as f:
                word_alignment = json.load(f)

        return jsonify({
            "hebrew_text": hebrew_text,
            "english_text": english_text,
            "audio_url": "/audio/mishnah_en.mp3",
            "alignment": word_alignment,
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/simplify', methods=['POST'])
def simplify_text_endpoint():
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({"error": "Missing 'text' in request"}), 400

    text = data['text']
    simplified = simplify_text(text)
    return jsonify({"simplified": simplified})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)