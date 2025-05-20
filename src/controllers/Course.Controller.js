import { uploadImageToCloudinary } from "../utils/uploadToCloudnary.js"
import prisma from "../db/config.js";
export const createNewCourse=async(req,res)=>{
    const currentUser=req.user;
    if(!currentUser){
        return res.status(400).json({error:"Login expired! login again to create course!"})
    }
    const currentUserValidated=await prisma.user.findUnique({
        where:{
            id:currentUser.id
        }
    })

    if(!currentUserValidated){
        return res.status(404).json({error:"No user found. Login again."})
    }
    const currentTeacher=await prisma.teacher.findUnique({
        where:{
           user_id:currentUser.id
        }
    })
    if(!currentTeacher) {
        return res.status(403).json({
            success: false,
            error: "Only teachers can create courses. Please register as a teacher first."
        });
    }
    const{title,subtitle,description,level,language,activationStatus,preRequisites,whatYouWillLearn,sales_category,course_category}=req.body
    const price=Number(req.body.price)
    const duration=Number(req.body.duration)

    if(!title ||!whatYouWillLearn||!preRequisites|| !subtitle || !description || !level || !language || !activationStatus || !sales_category || !price || !duration ||!course_category) {
        return res.status(400).json({
            success: false,
            error: "All Fields are required to create course."
        });
    }
    const validatedCourseCategories=await prisma.category.findMany({
        where:{
            title:{
                in:course_category
            }
        },
        select:{
            id:true,
            title:true
        }
    })
    if(!req.file) {
        return res.status(400).json({
            success: false,
            error: "Course thumbnail is required"
        });
    }
    const uploadResult=await uploadImageToCloudinary(req.file)
    if(!uploadResult.success===true){
        return res.status(500).json({error:uploadResult.error})
    }
    const course=await prisma.course.create({
        data:{
            title,
            subtitle,
            description,
            level,
            whatYouWillLearn,
            language,
            activationStatus:activationStatus,
            duration,
            price,
            sales_category,
            preRequisites,
            course_thumbnail_url:uploadResult.url,
            course_category:{
                create:validatedCourseCategories.map(category=>({
                    category:{
                        connect:{id:category.id}
                    }
                }))
            },
            course_teacher:{
                create:{
                    teacher:{
                        connect:{id:currentTeacher.id}
                    }
                }
            }
        },
    })

    return res.status(201).json({success:true,message:"Course Created Successfullys"})
}



export const getAllCourses = async(req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;
        const skip = (page - 1) * limit;

        const totalCourses = await prisma.course.count();

        const courses = await prisma.course.findMany({
            skip,
            take:limit,
            include: {
                course_category: {
                    include: {
                        category: {
                            select: {
                                id: true,
                                title: true
                            }
                        }
                    }
                },
                course_teacher: {
                    include: {
                        teacher: {
                            select: {
                                id: true,
                                qualifications: true,
                                user: {
                                    select: {
                                        name: true,
                                        profile_picture: true
                                    }
                                }
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        enrollment: true,
                        lessons: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Format the response
        const formattedCourses = courses.map(course => ({
            id: course.id,
            title: course.title,
            subtitle: course.subtitle,
            description: course.description,
            level: course.level,
            language: course.language,
            price: course.price,
            duration: course.duration,
            status: course.activationStatus,
            sales_category: course.sales_category,
            course_thumbnail_url: course.course_thumbnail_url,
            avg_ratings: course.avg_ratings,
            totalLessons: course._count.lessons,
            categories: course.course_category.map(cc => ({
                id: cc.category.id,
                title: cc.category.title
            })),
            course_teacher: {
                id: course.course_teacher[0]?.teacher.id,
                name: course.course_teacher[0]?.teacher.user.name,
                profile: course.course_teacher[0]?.teacher.user.profile_picture,
                qualifications: course.course_teacher[0]?.teacher.qualifications
            },
            createdAt: course.createdAt,
            updatedAt: course.updatedAt
        }));

        return res.status(200).json({
            success: true,
            courses: formattedCourses,
            totalPages: Math.ceil(totalCourses / limit),
            
        });

    } catch (error) {
        console.error("Error fetching courses:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to fetch courses"
        });
    }
};


export const getSingleCourse = async(req, res) => {
    try {
        const courseId = req.query.courseId;
        if(!courseId) {
            return res.status(400).json({
                success: false,
                error: "Course Id was not Provided!"
            });
        }

        const course = await prisma.course.findUnique({
            where: {
                id: courseId
            },
            include: {
                course_category: {
                    include: {
                        category: {
                            select: {
                                id: true,
                                title: true,
                                description: true
                            }
                        }
                    }
                },
                course_teacher: {
                    include: {
                        teacher: {
                            select: {
                                id: true,
                                qualifications: true,
                                user: {
                                    select: {
                                        name: true,
                                        profile_picture: true,
                                        bio: true
                                    }
                                }
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        enrollment: true,
                        lessons: true
                    }
                }
            }
        });

        if (!course) {
            return res.status(404).json({
                success: false,
                error: "Course not found"
            });
        }

        // Format single course (not using map since findUnique returns single object)
        const formattedCourse = {
            id: course.id,
            title: course.title,
            subtitle: course.subtitle,
            description: course.description,
            level: course.level,
            language: course.language,
            price: course.price,
            duration: course.duration,
            status: course.activationStatus,
            sales_category: course.sales_category,
            course_thumbnail_url: course.course_thumbnail_url,
            avg_ratings: course.avg_ratings,
            total_enrollments: course._count.enrollment,
            totalLessons: course._count.lessons,
            categories: course.course_category.map(cc => ({
                id: cc.category.id,
                title: cc.category.title,
                description: cc.category.description
            })),
            whatYouWillLearn:course.whatYouWillLearn,
            preRequisites:course.preRequisites,
            course_teacher: {
                id: course.course_teacher[0]?.teacher.id,
                name: course.course_teacher[0]?.teacher.user.name,
                profile: course.course_teacher[0]?.teacher.user.profile_picture,
                qualifications: course.course_teacher[0]?.teacher.qualifications,
                bio: course.course_teacher[0]?.teacher.user.bio
            }
        };

        return res.status(200).json({
            course: formattedCourse
        });

    } catch (error) {
        console.error("Error fetching course:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to fetch course"
        });
    }
}