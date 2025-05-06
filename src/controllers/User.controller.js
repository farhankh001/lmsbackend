import prisma from "../db/config.js";
import bcrypt from "bcryptjs";
import {promises as fs} from "fs"
import cloudinary from "../middleware/authentication/Cloudinary.js";
//register user controller
export const registerUser = async (req, res) => {
  try {
    //......................extracting user data..........................//
    const {userDataString,roleSpecificDataString}=req.body;
    const roleSpecificData=JSON.parse(roleSpecificDataString)
    const userData=JSON.parse(userDataString)

    //......................check for mising data...................//
    if(!userData||!roleSpecificData){
      return res.status(400).json({error:"User data or role specific data is missing!"})
    }

    const {name,email,password,role,bio}=userData;
      if(!email||!name||!password||!role){
        return res.status(400).json({error:"Required Fields (name, email,passwrod,role) are not present."})
    }
      
      //...........................check if email already exist..............//
    const existingUser=await prisma.user.findUnique({
      where:{email},
    });
    if(existingUser){
      return res.status(400).json({error:"Email already exists."})
    }
    
    //...........................hash password........................//
    const hashedPassword=await bcrypt.hash(password,10);
  
  
    //................generate 6 digit otp:......................//
    const otp=Math.floor(100000 + Math.random() * 900000);
    const email_verified=false;
    let profile_picture_url = null;
  

    //...............variables to set categories............//
    let category_mapping_teacher=null;
    let category_mapping_student=null;
  
    //.................mapping categories from title to id...............//
    try {
      if(role==="Teacher"){
        if(!roleSpecificData.qualifications||!roleSpecificData.teacher_expertiese){
            return res.status(400).json({error:"Role specific data(qualifications and expertise) is missing for teacher role."})
        }
        category_mapping_teacher=await prisma.category.findMany({
          where:{
            title:{
            in:roleSpecificData.teacher_expertiese
              }, 
            },
          select:{
            id:true,
            title:true
            }
          })
        }  
        
    } catch (error) {
      console.log(error);
      return res.status(500).json({error:error})
    }

    //...............mapping categories for student......................//
   try {
    if(role==="Student"){
      if(!roleSpecificData.education_level||!roleSpecificData.student_interests){
        return res.status(400).json({error:"Role specific data(education level, interests) for student is missing."})
      }
      category_mapping_student=await prisma.category.findMany({
        where:{
          title:{
            in:roleSpecificData.student_interests
          }
        },
        select:{
          id:true,
          title:true
        }
      })
    }  
     } catch (error) {
      return res.status(500).json({error:error})
    }

    //........................uploading profile picture................//
    if (req.file) {
      try {
          // Upload to Cloudinary
          const result = await cloudinary.uploader.upload(req.file.path, {
              folder: "profile_pictures",
              resource_type: "image",
              allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
          });
          
          profile_picture_url = result.secure_url;
          
          // Clean up local file
          await fs.unlink(req.file.path);
          
      } catch (err) {
          console.error('Profile picture upload error:', err);
          
          // Clean up local file if it exists
          if (req.file?.path) {
              try {
                  await fs.unlink(req.file.path);
              } catch (unlinkError) {
                  console.error('Error cleaning up local file:', unlinkError);
              }
          }
          
          return res.status(500).json({
              success: false,
              error: "Failed to upload profile picture",
              details: err.message
          });
      }
  }
  
      //...........................formating form data...................//
      
      const formatedUserData=formateUserData(userData,hashedPassword,otp,profile_picture_url)

      //.....................creating new user.........................//
      const user=await prisma.user.create({
       data:formatedUserData
      })
      if(!user){
        return res.status(500).json({error:"Failed to regiser user due to interal issue."})
      }

    //.......................registring user as teacher................//
    try {
      if(role==="Teacher"){
        const teacher=await prisma.teacher.create({
          data: {
              qualifications: roleSpecificData.qualifications,
              user: {
                  connect: {
                      id: user.id
                  }
              },
              teacher_expertiese: {
                  create: category_mapping_teacher.map(category => ({
                      category: {
                          connect: {
                              id: category.id
                          }
                      }
                  }))
              }
          },
      });
      if(teacher){
          return res.status(201).json({
            success: true,
            message: "Teacher registered successfully",
          });
          
        }else{
          return res.status(500).json({error:"Something went wrong while registring teacher."})
        }
      }

      //...................registring student....................//
      if(role==="Student"){
        const student=await prisma.student.create(
          {
            data:{
              education_level:roleSpecificData.education_level,
              user:{
              connect:{
                id:user.id
              }
              },
              student_interests:{
                create:category_mapping_student.map(category=>({
                  category:{
                    connect:{
                      id:category.id
                    }
                  }
                }))
              }
            }
          }
        )
        if(student){
          return res.status(201).json({
            success: true,
            message: "Student registered successfully",
        });
        }
      }

      //...............registring admin.....................//
     try {
      if(role==="Admin"){
        const admin=await prisma.admin.create({
          data:{
            user:{
              connect:{
                id:user.id
              }
            }
          }
        })
        if(admin){
          return res.status(200).json({message:"Admin created successfully."})
        }
      }
     } catch (error) {
       return res.status(500).json({error:error})
     }
     //.....................................................//
    } catch (error) {
      console.log(error);
      return res.status(500).json({error:error})
    }
    } catch (error) {
      console.log(error)
      return res.status(500).json({error:error})
    }
            
};


//login user controller
export const loginUser = async (req, res) => {
    try {
      // Set the JWT token as a cookie
      res.cookie("accessToken", req.token, {
        httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "strict", // Prevent CSRF attacks
        maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
      });
  
      // Send the user data in the response
      res.status(200).json({
        message: "Login successful.",
        user: {
          bio:req.user.bio,
          name: req.user.name,
          email: req.user.email,
          profile_picture: req.user.profile_picture,
          role:req.user.role,
          email_verified: req.user.email_verified, // Include avatar in the response
        },
      });
    } catch (error) {
      console.error("Error logging in user:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  };








//....................helper functions........................//



const formateUserData = (userData, hashedPassword, otp, profile_picture_url) => {
  const baseData = {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: userData.role,
      email_verified: false,
      email_OTP: otp
  };

  // Add optional fields only if they exist
  if (profile_picture_url) baseData.profile_picture = profile_picture_url;
  if (userData.bio) baseData.bio = userData.bio;

  return baseData;
};