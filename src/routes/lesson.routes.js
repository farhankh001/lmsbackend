import {Router} from 'express'
import { createCourseWithQuizAndAssignmen } from '../controllers/Lesson.Controller.js'

const router = Router()

router.route("/create-lesson-with-assignment-quiz").post(createCourseWithQuizAndAssignmen)



export default router