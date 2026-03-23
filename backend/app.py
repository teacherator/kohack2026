from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from email_service import send_update
from main import tts
import os

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

@app.route('/api/tts', methods=['POST'])
def generate_tts():
    """
    Generate TTS audio for given text and language.
    Expects JSON: {"text": "mishnah text", "language": "en"}
    Returns the audio file.
    Disability-friendly: Provides audio alternative for visually impaired users.
    Note: Current TTS only supports language; voice/speed not yet implemented.
    """
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({"error": "Missing 'text' in request"}), 400

    text = data['text']
    language = data.get('language', 'en')

    try:
        tts(text, language)
        audio_path = f"audio/mishnah_{language}.mp3"
        if os.path.exists(audio_path):
            return send_file(audio_path, as_attachment=True, mimetype='audio/mpeg')
        else:
            return jsonify({"error": "Audio file not generated"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Basic health check endpoint.
    """
    return jsonify({"status": "OK"})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)