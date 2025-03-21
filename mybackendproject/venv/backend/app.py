from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import pyaudio
import wave
import threading
import os
import librosa
import numpy as np
import time

app = Flask(__name__)
CORS(app)

# Audio recording settings
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 44100
CHUNK = 1024
OUTPUT_DIR = os.path.abspath(os.path.dirname(__file__))  # Get the current script directory
FILENAME = os.path.join(OUTPUT_DIR, "recorded_audio.wav")  # Save file in the backend folder

# Initialize recording variables
audio = pyaudio.PyAudio()
stream = None
frames = []
is_recording = False

# Function to handle recording
def record_audio():
    global is_recording, stream, frames

    stream = audio.open(format=FORMAT, channels=CHANNELS,
                        rate=RATE, input=True,
                        frames_per_buffer=CHUNK)

    frames = []
    is_recording = True
    print("Recording...")

    while is_recording:
        try:
            data = stream.read(CHUNK, exception_on_overflow=False)  # Handle buffer overflow
            frames.append(data)
        except Exception as e:
            print(f"Error during recording: {e}")
            break  # Exit if error occurs

    print("Recording Stopped.")

    if stream is not None:
        stream.stop_stream()
        stream.close()

    # Save the recorded file
    with wave.open(FILENAME, "wb") as wf:
        wf.setnchannels(CHANNELS)
        wf.setsampwidth(audio.get_sample_size(FORMAT))
        wf.setframerate(RATE)
        wf.writeframes(b"".join(frames))

    print("File saved:", FILENAME)

def detect_key(filename):
    try:
        # Ensure the file exists and is not empty
        if not os.path.exists(filename) or os.path.getsize(filename) == 0:
            return "Error: Audio file is empty or missing"

        # Load the audio file
        y, sr = librosa.load(filename, sr=None)  # Keep original sample rate

        # Check if the file contains enough audio data
        if len(y) < sr * 0.5:  # Ensure at least 0.5 seconds of audio
            return "Error: Insufficient audio data"

        # Extract chroma features
        chroma = librosa.feature.chroma_stft(y=y, sr=sr)
        chroma_mean = np.mean(chroma, axis=1)

        # Define musical keys
        keys = [
            "C Major", "C# Major", "D Major", "D# Major", "E Major", "F Major", "F# Major", "G Major", 
            "G# Major", "A Major", "A# Major", "B Major", 
            "C Minor", "C# Minor", "D Minor", "D# Minor", "E Minor", "F Minor", "F# Minor", "G Minor", 
            "G# Minor", "A Minor", "A# Minor", "B Minor"
        ]

        key_index = np.argmax(chroma_mean)  # Get the highest chroma value index
        detected_key = keys[key_index]  # Map to the corresponding key
        
        return detected_key
    except Exception as e:
        return f"Error detecting key: {e}"

# Flask routes
@app.route("/")
def home():
    return jsonify({"message": "Flask Backend is Connected to React Native!"})


@app.route("/start_recording", methods=["POST"])
def start_recording():
    global is_recording

    if is_recording:
        return jsonify({"message": "Recording already in progress"}), 400

    threading.Thread(target=record_audio).start()
    return jsonify({"message": "Recording started"})



@app.route("/stop_recording", methods=["POST"])
def stop_recording():
    global is_recording

    if not is_recording:
        return jsonify({"message": "No recording in progress"}), 400

    is_recording = False  # Stop the recording loop

    # Wait a bit to ensure the thread finishes saving the file
    time.sleep(3)  # Increased from 1s to 3s

    if not os.path.exists(FILENAME) or os.path.getsize(FILENAME) == 0:
        return jsonify({"error": "Recording failed, file not found or empty"}), 500

    return jsonify({"message": "Recording stopped", "file": f"http://192.168.105.12:5000/get_audio"})

@app.route("/detect_key", methods=["GET"])
def get_key():
    if not os.path.exists(FILENAME):
        return jsonify({"error": "Audio file not found"}), 404

    detected_key = detect_key(FILENAME)
    
    if "Error" in detected_key:
        return jsonify({"error": detected_key}), 500

    return jsonify({"key": detected_key})

@app.route("/get_audio", methods=["GET"])
def get_audio():
    if os.path.exists(FILENAME):
        return send_from_directory(OUTPUT_DIR, "recorded_audio.wav", as_attachment=True)
    else:
        return jsonify({"error": "Audio file not found"}), 404

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
