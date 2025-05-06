import jwt from "jsonwebtoken";

const generateJwtToken = (userId, role) => {
  try {
    // Define the payload
    const payload = {
      userId,
      role, // Include the user's role in the token
    };

    // Generate the token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d", // Token expiration time (e.g., 1 day)
    });

    return token;
  } catch (error) {
    console.error("Error generating JWT token:", error);
    throw new Error("Failed to generate token.");
  }
};

export default generateJwtToken;