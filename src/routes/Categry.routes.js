import express from "express"
import { getAllCategories,createCategory } from "../controllers/Category.controller.js";
const router=express.Router()

router.route("/get-all-categories").get(getAllCategories)


router.route("/create-category").post(createCategory)

export default router;