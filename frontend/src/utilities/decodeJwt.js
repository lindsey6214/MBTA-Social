import jwt_decode from "jwt-decode";

const getUserInfo = () => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) return null;

  try {
    const decoded = jwt_decode(accessToken);
    
    // Check if the token has expired
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("accessToken"); // Clear expired token
      return null;
    }

    return decoded;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null; // Return null if the token is invalid
  }
};

export default getUserInfo;