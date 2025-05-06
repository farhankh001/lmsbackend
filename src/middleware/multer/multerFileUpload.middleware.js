import multer from "multer";

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"public")
    },
    filename:function(req,file,cb){
        cb(null,file.originalname)
    }
})

export const uploadFile=multer({
    storage
})


export const uploadMultiple=(fields)=>{
    return uploadFile.fields(fields.map(field=>({
        name:field.name,
        maxCount:maxCount
    })))   
}