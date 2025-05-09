import { Router } from "express";
import { enrollStudent } from "../controllers/Enrollment.controller.js";
import { getCurrentUser } from "../middleware/authentication/GetCurrentUser.js";
const router=Router();

router.route("/enroll-student",getCurrentUser,enrollStudent);


export default router;