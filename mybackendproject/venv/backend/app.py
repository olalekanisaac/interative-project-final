from flask import Flask, jsonify, request
from flask_cors import CORS
import pyaudio
import wave
import threading
import os
import numpy as np
import time
import librosa
import webrtcvad
import google.generativeai as genai
from supabase import create_client, Client

# Set up Supabase credentials
SUPABASE_URL = 'https://rrgscadnpzbecaakhfbk.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyZ3NjYWRucHpiZWNhYWtoZmJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MDQwMzEsImV4cCI6MjA1ODk4MDAzMX0.x-VY-VX6BFu3BueYdq6jnhDPEj6bExDg1Wti7EFpiSw'

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Configure Gemini API
genai.configure(api_key="AIzaSyDRmdHNQoqadTc7M8HzjXuLW47Hc-NkJNQ")

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Audio settings
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 16000
CHUNK = 1600  # Adjusted for 10ms VAD compatibility
OUTPUT_DIR = os.path.abspath(os.path.dirname(__file__))
recordings = {}
is_recording = False
current_note = "..."

vad = webrtcvad.Vad(1)
audio = pyaudio.PyAudio()

def clean_note_name(note_name):
    return note_name.replace("~", "-")  # Convert B~3 to B-3 (B-flat 3)

def detect_pitch_from_buffer(data):
    global current_note
    try:
        samples = np.frombuffer(data, dtype=np.int16).astype(np.float32)

        if len(samples) == 0 or np.max(np.abs(samples)) == 0:
            return None

        samples /= np.max(np.abs(samples))

        f0 = librosa.yin(samples, fmin=librosa.note_to_hz('C2'),
                          fmax=librosa.note_to_hz('C7'), sr=RATE)
        f0 = f0[f0 > 0]  # Remove zero values
        f0 = f0[~np.isnan(f0)]  # Remove NaN values

        if len(f0) == 0:
            return None

        median_pitch = np.nanmedian(f0)  # Handle NaN values safely
        midi_note = round(librosa.hz_to_midi(median_pitch))
        detected_note = clean_note_name(librosa.midi_to_note(midi_note))
        
        current_note = detected_note  # Update current note
        return detected_note

    except Exception as e:
        print(f"❌ Error detecting pitch: {e}")
        return None

def record_audio():
    global is_recording, current_note
    timestamp = int(time.time())
    filename = os.path.join(OUTPUT_DIR, f"recording_{timestamp}.wav")
    recordings["latest"] = filename

    stream = audio.open(format=FORMAT, channels=CHANNELS, rate=RATE, input=True, frames_per_buffer=CHUNK)
    frames = []
    is_recording = True

    while is_recording:
        try:
            data = stream.read(CHUNK, exception_on_overflow=False)
            if len(data) == 0:
                continue

            frames.append(data)

            detected_pitch = detect_pitch_from_buffer(data)
            if detected_pitch:
                current_note = detected_pitch  # Update global note

        except Exception as e:
            print(f"❌ Error during recording: {e}")
            break

    stream.stop_stream()
    time.sleep(0.5)
    stream.close()

    if not frames:
        print("❌ No audio data captured!")
        return

    with wave.open(filename, "wb") as wf:
        wf.setnchannels(CHANNELS)
        wf.setsampwidth(audio.get_sample_size(FORMAT))
        wf.setframerate(RATE)
        wf.writeframes(b''.join(frames))

def save_and_upload_recording(file_path):
    try:
        with open(file_path, 'rb') as file_obj:
            response = supabase.storage.from_('audio-files').upload(
                f"recordings/{os.path.basename(file_path)}", file_obj
            )

            print("🔥 Upload Response:", response)  # Debugging output

            if not response or isinstance(response, dict) and "error" in response:
                print(f"❌ Upload error: {response}")
                return None

            # Supabase provides the path, but we need the full URL
            file_url = f"{SUPABASE_URL}/storage/v1/object/public/audio-files/recordings/{os.path.basename(file_path)}"
            return file_url

    except Exception as e:
        print(f"❌ Error uploading file: {e}")
        return None


@app.route("/detect_key", methods=["GET"])
def detect_key():
    return jsonify({"current_note": current_note})

@app.route("/start_recording", methods=["POST"])
def start_recording_route():
    global is_recording

    if is_recording:
        return jsonify({"message": "Recording already in progress"}), 400

    # Delete previous local recording file if it exists
    latest_file = recordings.get("latest")
    if latest_file and os.path.exists(latest_file):
        os.remove(latest_file)  # Remove only locally, Supabase keeps it
        print(f"🗑 Deleted old recording: {latest_file}")

    threading.Thread(target=record_audio).start()
    return jsonify({"message": "Recording started"})


@app.route("/stop_recording", methods=["POST"])
def stop_recording_route():
    global is_recording

    if not is_recording:
        print("❌ No recording in progress!")  
        return jsonify({"error": "No recording in progress"}), 400

    is_recording = False  # Stop recording
    time.sleep(1)  # Allow buffer processing

    latest_file = recordings.get("latest")
    if not latest_file or not os.path.exists(latest_file):
        print(f"❌ Recording file not found: {latest_file}")  
        return jsonify({"error": "No recording found"}), 500

    uploaded_url = save_and_upload_recording(latest_file)
    if uploaded_url:
        # Remove only local file, Supabase keeps the uploaded one
        os.remove(latest_file)
        print(f"🗑 Deleted local recording: {latest_file}")

        return jsonify({
            "message": "Recording stopped, uploaded, and deleted locally",
            "file": uploaded_url,
            "last_note": current_note
        })
    else:
        return jsonify({"error": "Upload failed"}), 500




@app.route("/get_feedback", methods=["POST"])
def get_feedback():
    data = request.json
    pitch = data.get("pitch", "Unknown")
    key = data.get("key", "Unknown")
    stability = data.get("stability", "Unknown")
    vocal_type = data.get("type", "Unknown")

    prompt = f"""
    You are an expert singing coach analyzing a singer’s voice.
    - **Pitch:** {pitch} Hz  
    - **Key:** {key}  
    - **Stability:** {stability}  
    - **Vocal Type:** {vocal_type}  

    Instructions:  
    - Provide **direct** feedback on accuracy, key, and technique.  
    - If **speaking**, suggest improvement techniques.  
    - Give **one tip** for better control.
    """

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)

        if response and hasattr(response, "candidates") and response.candidates:
            feedback_text = response.candidates[0].content.parts[0].text.strip()
            return jsonify({"feedback": feedback_text})
        else:
            return jsonify({"error": "No feedback received"}), 500
    except Exception as e:
        print(f"❌ Gemini API error: {e}")
        return jsonify({"error": "AI feedback failed"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
    