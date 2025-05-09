import prisma from "../../db/config.js"
import jwt from "jsonwebtoken"

export const getCurrentUser = async(req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if(!accessToken) {
            return res.status(401).json({
                error: "Missing Authentication Credentials. Try logging in again."
            });
        }

        // Decode token and extract userId from decoded token, not from accessToken
        const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
        const userId = decodedToken.userId; // Changed this line

        if(!userId) {
            return res.status(401).json({
                error: "Missing user details."
            });
        }

        const currentUser = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if(!currentUser) {
            return res.status(401).json({
                error: "Current user not found."
            });
        }

        req.user = currentUser;
        next();

    } catch(error) {
        // Add proper error handling for JWT verification
        if(error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                error: "Invalid or expired token"
            });
        }
        
        return res.status(500).json({
            error: "Authentication failed"
        });
    }
}