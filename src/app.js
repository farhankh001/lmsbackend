import express, {urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import passport from "passport";
import errorHandlerMiddleware from "./middleware/ErrorHandlingMiddleware.js";
const app=express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie'],
}))

app.use(cookieParser())
app.use(urlencoded({extended:true}))
app.use(express.json())
app.use(express.static("public"))
app.use(passport.initialize());

/------------------------------------------------------------------------------------/
import UserRouter from "./routes/User.routes.js"
app.use('/',UserRouter)

import CategoryRouter from "./routes/Categry.routes.js"
app.use('/',CategoryRouter)

import CourseRouer from "./routes/Course.routes.js"
app.use('/',CourseRouer)

import EnrollmentRouter from "./routes/enrollment.routes.js"
app.use('/',EnrollmentRouter)

app.use(errorHandlerMiddleware);








export default app;