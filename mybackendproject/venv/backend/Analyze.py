from flask import Flask, request, jsonify, send_file
import sounddevice as sd
import numpy as np
import wave
import threading
import os

app = Flask(__name__)

recording = False
frames = []
samplerate = 44100  
filename = "recording.wav"

def record_audio():
    global recording, frames
    recording = True
    frames = []

    def callback(indata, frame_count, time_info, status):
        if recording:
            frames.append(indata.copy())

    with sd.InputStream(callback=callback, samplerate=samplerate, channels=1, dtype='int16'):
        while recording:
            sd.sleep(100)

@app.route("/start_recording", methods=["POST"])
def start_recording():
    global recording
    if not recording:
        thread = threading.Thread(target=record_audio)
        thread.start()
    return jsonify({"message": "Recording started"})

@app.route("/stop_recording", methods=["POST"])
def stop_recording():
    global recording, frames
    recording = False

    # Convert frames to NumPy array
    audio_data = np.concatenate(frames, axis=0)

    # Save as WAV file
    with wave.open(filename, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)  # 16-bit audio
        wf.setframerate(samplerate)
        wf.writeframes(audio_data.tobytes())

    return jsonify({"message": "Recording stopped", "file": filename})

@app.route("/play_audio", methods=["GET"])
def play_audio():
    if os.path.exists(filename):
        return send_file(filename, as_attachment=True)
    else:
        return jsonify({"error": "No recording found"}), 404

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
