const backendURL = "http://192.168.105.12:5000"; 

export const startRecording = async () => {
  try {
    const response = await fetch(`${backendURL}/start_recording`, { method: "POST" });
    if (!response.ok) throw new Error("Failed to start recording");

    return await response.json();
  } catch (error) {
    console.error("❌ Error starting recording:", error);
    return { message: "Failed to start recording", error: error.message };
  }
};

export const stopRecording = async () => {
  try {
    const response = await fetch(`${backendURL}/stop_recording`, { method: "POST" });
    if (!response.ok) throw new Error("Failed to stop recording");

    const data = await response.json();
    if (!data.file) throw new Error("Recording file missing!");

    console.log("🔥 Recording stopped, saved as:", data.file);
    return data;  // ✅ Now includes filename and last detected note
  } catch (error) {
    console.error("❌ Error stopping recording:", error);
    return { message: "Failed to stop recording", error: error.message };
  }
};

// ✅ Fetch Current Note
export const getCurrentNote = async () => {
  try {
    console.log("🎵 Fetching current note...");
    const response = await fetch(`${backendURL}/detect_key`); // ✅ Correct route
    if (!response.ok) throw new Error("Failed to fetch current note");

    const data = await response.json();
    return data.current_note || "...";
  } catch (error) {
    console.error("❌ Error fetching current note:", error);
    return "...";
  }
};
