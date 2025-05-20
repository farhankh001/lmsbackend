import prisma from "../db/config.js";

export const enrollStudent = async(req, res) => {
    try {
        const { courseId } = req.body;
        const user = req.user;

        if(!courseId) {
            return res.status(400).json({
                success: false,
                error: "Course Id was not provided"
            });
        }

        // Check if course exists and is active
        const course = await prisma.course.findUnique({
            where: {
                id: courseId,
                activationStatus: "ACTIVE" // Only allow enrollment in active courses
            }
        });

        if(!course) {
            return res.status(404).json({
                success: false,
                error: "Course not found or is not active!"
            });
        }

        // Verify user is a student
        if(user.role !== "Student") {
            return res.status(401).json({
                success: false,
                error: "Register as student to enroll in a course."
            });
        }

        // Get student profile
        const currentStudent = await prisma.student.findUnique({
            where: {
                user_id: user.id
            }
        });

        if(!currentStudent) {
            return res.status(401).json({
                success: false,
                error: "User not registered as Student."
            });
        }

        // Check if already enrolled
        const existingEnrollment = await prisma.enrollment.findFirst({
            where: {
                student_id: currentStudent.id,
                course_id: courseId
            }
        });

        if(existingEnrollment) {
            return res.status(400).json({
                success: false,
                error: "Already enrolled in this course"
            });
        }

        // Create enrollment with transaction
       const enrollment=await prisma.$transaction(async(prisma)=>{
            const newEnrollment=await prisma.enrollment.create({
                data:{
                    student:{
                        connect:{
                            id:currentStudent.id
                        }
                    },
                    course:{
                        connect:{
                            id:courseId
                        }
                    },
                    status:"INPROGRESS"
                }
            })
        await prisma.course.update({
            where:{id:courseId},
            data:{
                total_enrollments:{
                    increment:1
                }
            }
        })
       })

            // Update course enrollment count
          

        return res.status(201).json({
            success: true,
            message: "Successfully enrolled in the course",
                
        });

    } catch (error) {
        console.error("Enrollment error:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to enroll in course"
        });
    }
};