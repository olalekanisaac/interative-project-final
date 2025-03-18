import librosa
import numpy as np
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/analyze', methods=['POST'])
def analyze_audio():
    try:
        file = request.files['audio']
        y, sr = librosa.load(file, sr=22050)  # Load audio

        # Extract Features
        pitch, voiced_flag, _ = librosa.pyin(y, fmin=librosa.note_to_hz('C2'), fmax=librosa.note_to_hz('C7'))
        pitch = np.nanmean(pitch)  # Average pitch (ignoring NaNs)
        rms_energy = np.mean(librosa.feature.rms(y=y))  # Loudness
        duration = librosa.get_duration(y=y, sr=sr)  # Duration

        return jsonify({"pitch": pitch, "loudness": rms_energy, "duration": duration})

    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
   app.run(host="0.0.0.0", port=5000, debug=True)
