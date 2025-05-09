import { Router } from "express";
import { uploadFile } from "../middleware/multer/multerFileUpload.middleware.js";
import { createNewCourse,getAllCourses } from "../controllers/Course.Controller.js";
import { getCurrentUser } from "../middleware/authentication/GetCurrentUser.js";

const router=Router()

router.route("/create-new-course").post(getCurrentUser,uploadFile.single("course_thumbnail"),createNewCourse)
router.route("/get-all-courses").get(getAllCourses)

export default router;