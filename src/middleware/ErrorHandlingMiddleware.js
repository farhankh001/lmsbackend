const errorHandlerMiddleware=(err,req,res,next)=>{
    const statusCode=err.statusCode||500;
    const message=err.message||"Internal Server Error!"
    const errors=err.errors||[];

   return res.status(statusCode).json({
        success:false,
        message,
        errors,
        stack:process.env.NODE_ENV==="development"?err.stack:undefined,
        
    })
}

export default errorHandlerMiddleware