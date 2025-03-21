const backendURL = "http://192.168.105.12:5000"; // Update this if using an emulator or physical device

export const checkBackendConnection = async () => {
  try {
    const response = await fetch(`${backendURL}/`);
    const data = await response.json();
    return data.message; // "Flask Backend is Connected to React Native!"
  } catch (error) {
    console.error("Error connecting to Flask:", error);
    return "Connection Failed";
  }
};

export const startRecording = async () => {
  try {
    const response = await fetch(`${backendURL}/start_recording`, { method: "POST" });
    return await response.json();
  } catch (error) {
    console.error("Error starting recording:", error);
  }
};

export const stopRecording = async () => {
  try {
    const response = await fetch(`${backendURL}/stop_recording`, { method: "POST" });
    return await response.json();
  } catch (error) {
    console.error("Error stopping recording:", error);
  }
};

export const detectKey = async () => {
    try {
      const response = await fetch(`${backendURL}/detect_key`);
      return await response.json();
    } catch (error) {
      console.error("Error detecting key:", error);
      return { key: "Unknown" };
    }
  };
  
