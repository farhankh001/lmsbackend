import prisma from "../../db/config.js"
import jwt from "jsonwebtoken"
export const getCurrentUser=async(req,res,next)=>{
    const accessToken=req.cookies.accessToken;
    if(!accessToken){
        return res.status(401).json({error:"Missing Authentication Credentials. Try logging in again."})
    }
    const decodedAccessToken=jwt.verify(accessToken,process.env.JWT_SECRET)
    if(!decodedAccessToken){
        return res.status(401).json({error:"Invalid Credentials."})
    }
    const {userId}=accessToken;
    if(!userId){
        return res.status(401).json({error:"Missing user details."})
    }
    const currentUser=await prisma.user.findUnique({
        where:{
            id:userId
        }
    })
    if(!currentUser){
        return res.status(401).json({error:"Current user not found."})
    }
    req.user=currentUser;
    next()

}