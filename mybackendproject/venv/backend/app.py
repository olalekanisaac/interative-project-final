from flask import Flask, jsonify, request
from flask import send_file
from flask_cors import CORS
import pyaudio
import wave
import threading
import os
import numpy as np
import time
import librosa
import music21
import webrtcvad  # ✅ Import WebRTC VAD
import google.generativeai as genai
import soundfile as sf

# ✅ Configure Gemini API
genai.configure(api_key="AIzaSyDRmdHNQoqadTc7M8HzjXuLW47Hc-NkJNQ")

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# 🔹 Audio settings
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 16000  # WebRTC VAD works best with 16kHz
CHUNK = 1024
OUTPUT_DIR = os.path.abspath(os.path.dirname(__file__))
recordings = {}
is_recording = False
current_note = "..."
vad = webrtcvad.Vad(1)  # ✅ Aggressiveness level (0-3)

audio = pyaudio.PyAudio()

# ✅ Function to clean up note names
def clean_note_name(note_name):
    """Replace invalid characters in note names with correct accidentals."""
    return note_name.replace("~", "-")  # Convert B~3 to B-3 (B-flat 3)

# ✅ Function to detect voice using WebRTC VAD
def is_voice(data):
    return vad.is_speech(data, RATE)

# ✅ Function to detect pitch from audio buffer
def detect_pitch_from_buffer(data):
    global current_note
    try:
        # Convert byte data to NumPy array
        samples = np.frombuffer(data, dtype=np.int16).astype(np.float32)
        
        # Handle zero or silent input
        if len(samples) == 0 or np.max(np.abs(samples)) == 0:
            return None

        samples = samples / np.max(np.abs(samples))  # Normalize

        # Compute fundamental frequency (f0)
        f0 = librosa.yin(
            samples, 
            fmin=librosa.note_to_hz('C2'), 
            fmax=librosa.note_to_hz('C7'), 
            sr=RATE  # ✅ Ensure sample rate is used
        )
        
        f0 = f0[f0 > 0]  # Remove unvoiced parts
        if len(f0) == 0:
            return None  # No valid pitch detected

        # Get median pitch to reduce fluctuations
        median_pitch = np.median(f0)

        # Convert frequency to MIDI and then to note name
        midi_note = round(librosa.hz_to_midi(median_pitch))
        detected_note = librosa.midi_to_note(midi_note)

        # Clean the note name format
        detected_note = clean_note_name(detected_note)
        current_note = detected_note  # ✅ Ensure global variable updates correctly
        return detected_note

    except Exception as e:
        print(f"❌ Error detecting pitch: {e}")
        return None


# ✅ Function to record audio
def record_audio():
    global is_recording, current_note
    timestamp = int(time.time())
    filename = os.path.join(OUTPUT_DIR, f"recording_{timestamp}.wav")
    recordings["latest"] = filename

    stream = audio.open(format=FORMAT, channels=CHANNELS, rate=RATE, input=True, frames_per_buffer=CHUNK)
    frames = []
    is_recording = True
    print(f"🎤 Recording started: {filename}")

    while is_recording:
        try:
            data = stream.read(CHUNK, exception_on_overflow=False)
            if len(data) == 0:
                continue  # Skip if no audio data

            frames.append(data)
            detected_pitch = detect_pitch_from_buffer(data)
            if detected_pitch:
                print(f"🎵 Detected Note: {detected_pitch}")  # ✅ Debugging
                current_note = detected_pitch  # ✅ Update global note

        except Exception as e:
            print(f"❌ Error during recording: {e}")
            break

    print("🛑 Recording stopped.")
    stream.stop_stream()
    time.sleep(0.5)
    stream.close()

    if not frames:
        print("❌ No audio data captured!")
        return

    # ✅ Save recorded frames properly
    with wave.open(filename, "wb") as wf:
        wf.setnchannels(CHANNELS)
        wf.setsampwidth(audio.get_sample_size(FORMAT))
        wf.setframerate(RATE)
        wf.writeframes(b''.join(frames))  # 🔹 Ensure all frames are written

    print(f"✅ Full audio file saved: {filename}")





# ✅ API Route to start recording
@app.route("/start_recording", methods=["POST"])
def start_recording_route():
    global is_recording
    if is_recording:
        return jsonify({"message": "Recording already in progress"}), 400
    threading.Thread(target=record_audio).start()
    return jsonify({"message": "Recording started"})

@app.route("/detect_key", methods=["GET"])
def detect_key():
    return jsonify({"current_note": current_note})

# ✅ Function to extract vocal features
def extract_vocal_features(data):
    try:
        samples = np.frombuffer(data, dtype=np.int16).astype(np.float32)
        samples = samples / np.max(np.abs(samples))  # Normalize

        f0 = librosa.yin(samples, fmin=librosa.note_to_hz('C2'), fmax=librosa.note_to_hz('C7'))
        f0 = f0[f0 > 0]  

        if len(f0) == 0:
            return {"pitch": None, "stability": "Unknown", "type": "Unknown", "accuracy": "Unknown"}

        median_pitch = np.median(f0)
        pitch_variation = np.std(f0)  # Standard deviation of pitch

        p = music21.pitch.Pitch()
        p.frequency = median_pitch
        detected_note = clean_note_name(p.nameWithOctave)  # ✅ Fix note formatting

        expected_pitch = librosa.note_to_hz(detected_note)
        pitch_accuracy = round(abs(median_pitch - expected_pitch), 2)

        vocal_type = "Singing" if pitch_variation > 10 else "Speaking"

        voice_type = "Soprano" if median_pitch > 349.23 else "Alto" if median_pitch > 261.63 else "Tenor" if median_pitch > 196.00 else "Bass"

        return {
            "pitch": median_pitch,
            "note": detected_note,
            "accuracy": f"{pitch_accuracy} Hz",
            "stability": "Stable" if pitch_variation < 5 else "Wobbly",
            "type": vocal_type,
            "vocal_range": voice_type
        }
    except Exception as e:
        print(f"❌ Error extracting vocal features: {e}")
        return {"pitch": None, "stability": "Unknown", "type": "Unknown", "accuracy": "Unknown"}

@app.route("/stop_recording", methods=["POST"])
def stop_recording_route():
    global is_recording
    if not is_recording:
        return jsonify({"error": "No recording in progress"}), 400

    print("🛑 Stopping recording...")
    is_recording = False

    # 🕒 Small delay to ensure last audio frames are captured
    time.sleep(1)  # Try increasing if audio still cuts off

    latest_file = recordings.get("latest")
    if not latest_file or not os.path.exists(latest_file):
        return jsonify({"error": "No recording found"}), 500

    try:
        with wave.open(latest_file, "rb") as wf:
            frames = wf.readframes(wf.getnframes())

        vocal_features = extract_vocal_features(frames)

        return jsonify({
            "message": "Recording stopped",
            "file": os.path.basename(latest_file),
            "last_note": vocal_features["note"],
            "pitch": f"{vocal_features['pitch']} Hz" if vocal_features["pitch"] else "Unknown",
            "accuracy": vocal_features["accuracy"],
            "detect_key": vocal_features["note"],
            "stability": vocal_features["stability"],
            "type": vocal_features["type"],
            "vocal_range": vocal_features["vocal_range"]
        })

    except Exception as e:
        print(f"❌ Error processing recording: {e}")
        return jsonify({"error": f"Error processing recording: {e}"}), 500

    
@app.route("/recordings/<filename>")
def get_recording(filename):
    file_path = os.path.join(OUTPUT_DIR, filename)
    if os.path.exists(file_path):
        return send_file(file_path, mimetype="audio/wav")
    else:
        return jsonify({"error": "File not found"}), 404

@app.route("/get_feedback", methods=["POST"])
def get_feedback():
    data = request.json
    pitch = data.get("pitch", "Unknown")
    key = data.get("key", "Unknown")
    stability = data.get("stability", "Unknown")
    vocal_type = data.get("type", "Unknown")

    prompt = f"""
    You are an expert **singing coach** analyzing a singer’s voice.  
    **Details:**  
    🎤 **Pitch:** {pitch} Hz  
    🎶 **Key:** {key}  
    📈 **Stability:** {stability}  
    🎭 **Vocal Type:** {vocal_type}  

    **Instructions:**  
    - Give short, direct feedback on **accuracy, key, and technique**.  
    - If it's **speaking**, suggest improving by singing.  
    - Provide **one** tip for better vocal control.  
    - Keep responses **brief, clear, and motivating**.
    """

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")  # ✅ Use correct model
        response = model.generate_content(prompt)

        if not response or not hasattr(response, 'text'):
            return jsonify({"error": "No feedback received from Gemini"}), 500

        feedback_text = response.text.strip()
        return jsonify({"feedback": feedback_text})

    except Exception as e:
        print(f"❌ Gemini API Error: {e}")  # ✅ Log error for debugging
        return jsonify({"error": f"Error generating feedback: {str(e)}"}), 500




if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
