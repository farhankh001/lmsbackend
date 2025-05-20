import { Router } from "express";
import { uploadFile } from "../middleware/multer/multerFileUpload.middleware.js";
import { createNewCourse,getAllCourses ,getSingleCourse} from "../controllers/Course.Controller.js";
import { getCurrentUser } from "../middleware/authentication/GetCurrentUser.js";
import { getAllCoursesByTeacher } from "../controllers/TeacherDash.controller.js";
const router=Router()

router.route("/create-new-course").post(getCurrentUser,uploadFile.single("course_thumbnail"),createNewCourse)
router.route("/get-all-courses").get(getAllCourses)

router.route("/get-single-course").get(getSingleCourse)
router.route("/fetch-all-courses-by-teacher").get(getCurrentUser,getAllCoursesByTeacher)
export default router;