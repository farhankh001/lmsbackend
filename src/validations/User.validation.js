const userValidationSchema={
    username:{
        in:["body"],
        exists:{
            errorMessage:"No User Name found!"
        },
        isString:{
            errorMessage:"User Name should be a in Plain English i.e. A String of Characters!"
        },
        isLength:{
            options:{
                min:3,
                max:100
            },
            errorMessage:"User Name should not have less then 3 or more then 100 characters!"
        },
        matches:{
            options: /^[a-zA-Z][A-Za-z0-9-_]{3,23}$/,
            errorMessage:"User Name could include English language Characters in upper or lower case, numbers,- , _ and it must starts with a letter!"
        }
    },
    password:{
        in:["body"],
        exists:{
            errorMessage:"Password Not Found!"
        },
        isString:{
            errorMessage:"Password is not a String!"
        },
        isLength:{
            options:{
                min:8,
                max:100
            },
        errorMessage:"Password must have atleast 8 characters and at most 100."
        },
       
    },
    email:{
        in:["body"],
        exists:{
            errorMessage:"Email not Found!"
        },
        isEmail:{
            errorMessage:"Email is not valid Email Formate!"
        }
    },
    fullname:{
        in:['body'],
        exists:{
            errorMessage:"Full Name not found!"
        },
        isString:{
            errorMessage:"Full Name must be a String!"
        },
        isLength:{
            options:{
                min:1,
                max:100
            },
            errorMessage:"Full Name must have atleast 1 and at most 100 characters!"
        }
    },
    avatar:{
        custom:{
            options:(value,{req})=>{
                try {
                    if(!req.file){
                        throw new Error("Avatar is required!")
                    }
                    if(req.file.size===0||req.file.size>1024*1024){
                        throw new Error("Avatar file size should be between 1kb to 1mb")
                    }
                    if(["image/jpg","image/png","imge/jpeg","image/gif","image/svg+xml"].includes(req.file.mimetype)){
                        throw new Error("Invalid file type! Allowed file types : image/jpg, image/png, imge/jpeg,image/gif, image/svg+xml")
                    }
                    return true
                } catch (error) {
                    console.log(`!! Error during User Form Validation : ${error}`)
                    throw new Error(error)
                }
            }
        },
        errorMessage:"Invalid Avatar File!"
    }
}

export default userValidationSchema;