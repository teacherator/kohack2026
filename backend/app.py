from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from email_service import send_update
from main import tts
import os
import json
# from googletrans import Translator
from eleven import get_daily_mishnah_hebrew 
from eleven import generate_tts_with_timestamps
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

# @app.route('/api/translate', methods=['POST'])
# def translate_text():
#     """
#     Translate text using Google Translate.
#     Expects JSON: {"text": "mishnah text", "src": "iw", "dest": "en"}
#     Defaults: src="iw" (Hebrew), dest="en" (English)
#     Returns: {"translated": "translated text"}
#     Disability-friendly: Provides translations for accessibility.
#     """
#     data = request.get_json()
#     if not data or 'text' not in data:
#         return jsonify({"error": "Missing 'text' in request"}), 400

#     text = data['text']
#     src = data.get('src', 'iw')  # Default Hebrew
#     dest = data.get('dest', 'en')  # Default English

#     try:
#         translator = Translator()
#         translated = translator.translate(text, src=src, dest=dest)
#         return jsonify({"translated": translated.text})
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

@app.route('/api/hebrew-text', methods=['GET'])
def get_hebrew_text():
    """
    Get the daily Mishnah Hebrew text.
    Returns: {"hebrew_text": "text"}
    """
    try:
        hebrew_text = get_daily_mishnah_hebrew()
        return jsonify({"hebrew_text": hebrew_text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/audio/<filename>')
def serve_audio(filename):
    return send_file(f"audio/{filename}", mimetype='audio/mpeg')

@app.route('/api/tts', methods=['POST'])
def generate_tts():
    generate_tts_with_timestamps(get_daily_mishnah_hebrew())
    audio_path = "audio/audio.mp3"
    if os.path.exists(audio_path):
        return send_file(audio_path, as_attachment=True, mimetype='audio/mpeg')
    else:
        return jsonify({"error": "Audio file not generated"}), 500

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