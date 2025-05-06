import express, {urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import passport from "passport";
import errorHandlerMiddleware from "./middleware/ErrorHandlingMiddleware.js";
const app=express();

app.use(cors({
    credentials:true,
    origin:"http://localhost:5173"
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
app.use(errorHandlerMiddleware);








export default app;