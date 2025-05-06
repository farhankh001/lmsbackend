import express from "express";

import { registerUser,loginUser } from "../controllers/User.controller.js";
import { loginUserAuthMiddleware } from "../middleware/authentication/LoginUser.strategy.js";
import { uploadFile } from "../middleware/multer/multerFileUpload.middleware.js";
import { getCurrentUser } from "../middleware/authentication/GetCurrentUser.js";
const router = express.Router();

// Configure multer for file uploads
// const upload = multer({ dest: "uploads/" }); // Temporary storage for uploaded files

// Registration route
router.post("/create-user", uploadFile.single("profile_picture"), registerUser);
router.post("/login", loginUserAuthMiddleware, loginUser);

router.post("/test_reg" ,uploadFile.single("profile_picture"),(req,res)=>{
    console.log(req.body)
    return res.status(200).json({message:"success"})
})
export default router;