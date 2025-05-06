import asyncHandler from "../../utils/asyncHandler.js";
import userValidationSchema from "../../validations/User.validation.js";
import { checkSchema, validationResult } from "express-validator";
import ErrorHandler from "../../utils/errorHandler.js";

const registrationFormValidation=asyncHandler(async(req,res,next)=>{
   await checkSchema(userValidationSchema).run(req);
   const validationErrors=validationResult(req);

    if(!validationErrors.isEmpty()){
        return next(new ErrorHandler(400,"Bad Request","",validationErrors.array()))
    }

    next()
})



export {registrationFormValidation}