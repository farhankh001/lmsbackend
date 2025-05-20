import prisma from "../db/config.js";

export const getAllCoursesByTeacher=async(req,res)=>{
    try {
        if(!req.user){
        return res.status(404).json({error:"Login and try again."})
         }

        const currentTeacher=await prisma.teacher.findUnique({
            where:{
                user_id:req.user.id
            },
            include:{
                course_teacher:{
                    include:{
                        course:{
                            select:{
                                createdAt:true,
                                activationStatus:true,
                                title:true,

                            },
                            include:{  
                                enrollment:{
                                    include:{
                                        rating:true,
                                        student:true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        if(!currentTeacher){
            return res.status(401).json({error:"You are not authorized to get this detail."})
        }
        
        const totalCourses=currentTeacher.course_teacher.length;
        const allEnrollments=currentTeacher.course_teacher.flatMap(ct=>ct.course.enrollment)
        const totalEnrollment=allEnrollments.length

        const allRatings=allEnrollments.filter(enrollment=>enrollment.rating!==null).map(enrollment=>enrollment.rating)
        const avgRating=allRatings.length>0?allRatings.reduce((sum,rating)=>sum+rating.rating,0):0;
        const fiveStarRatings = allRatings.filter(rating => rating.rating === 5.0).length;
        const courseEnrollments = teacher.course_teacher.map(ct => ({
        courseId: ct.course.id,
        courseTitle: ct.course.title,
        totalEnrolledStudents: ct.course.enrollment.length
         }));
    } catch (error) {
        
    }
}