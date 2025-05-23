class ErrorHandler extends Error{
    constructor(
        statusCode,
        message="Something went Wrong!",
        stack="",
        errors=[]
    ){
        super(message);
       this.statusCode=statusCode;
       this.message=message;
       this.errors=errors;
       this.success=false;
       this.data=null;
       if(stack){
        this.stack=stack;
       }else{
        Error.captureStackTrace(this,this.constructor)
       }


    }
}

export default ErrorHandler;