import prisma from "../db/config.js"
//task courseId not provided.
export const createCourseWithQuizAndAssignmen=async(req,res)=>{
    try {
        const {lesson_text,lesson_title, lesson_document,lesson_video, lesson_image}=req.body
        if(!lesson_text||!lesson_document||!lesson_title||!lesson_video||!lesson_image){
            return res.status(400).json({error:"Some required fields(lesson_text,lesson_title, lesson_document,lesson_video, lesson_image) are missing to create lesson. "})
        }
    
        const lesson=await prisma.lesson.create({
            data:{
                lesson_text:lesson_text,
                url_image:lesson_image,
                url_docs:lesson_document,
                url_video:lesson_video,
                title:lesson_title
            }
            }) 
        if(!lesson){
            return res.status(500).json({error:"Cannot create course due to some internal db error"})
        }
        
        if(req.body.quiz){
            const { title,description,question,timeLimit,activationStatus,passingScore,totalScore}=req.body.quiz;
            if(!title||!description||!question||!timeLimit||!activationStatus||!passingScore||!totalScore){
                return res.status(404).json({
                    error:"If you want to create quiz, provide all necessary fields, (title,description,question,timeLimit,activationStatus,passingScore,totalScore) "
                })
            }
            const quiz=await prisma.quiz.create({
                data:{
                    description:description,
                    activationStatus:activationStatus,
                    passing_score:passingScore,
                    questions:question,
                    timelimit:timeLimit,
                    title:title,
                    total_score:totalScore,
                    
                }
            })
            if(!quiz){
                res.status(500).json({error:"Quiz was not created due to some interal db error."})
            }
        }
         if(req.body.assignment){
            const { title,description,question,timeLimit,activationStatus,passingScore,totalScore}=req.body.assignment;
            if(!title||!description||!question||!timeLimit||!activationStatus||!passingScore||!totalScore){
                return res.status(404).json({
                    error:"If you want to create assignment, provide all necessary fields, (title,description,question,timeLimit,activationStatus,passingScore,totalScore) "
                })
            }
            const assignment=await prisma.assignment.create({
                data:{
                    description:description,
                    activationStatus:activationStatus,
                    passing_score:passingScore,
                    questions:question,
                    timelimit:timeLimit,
                    title:title,
                    total_score:totalScore,
                    
                }
            })
            if(!assignment){
                res.status(500).json({error:"Assignment was not created due to some interal db error."})
            }
        }

        return res.status(200).json({message:"Lesson Created Successfully."})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Something went wrong see logs for full description",errorDetails:error})
    }
}