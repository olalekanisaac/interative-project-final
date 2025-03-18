const backendURL = "http://192.168.150.12:5000"; // Update this if using an emulator or physical device

export const checkBackendConnection = async () => {
    try {
      console.log("Trying to connect to Flask at:", backendURL);
      const response = await fetch(`${backendURL}/`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Flask Response:", data);
      return data.message;
    } catch (error) {
      console.error("Error connecting to Flask:", error.message);
      return "Connection Failed";
    }
  };
  