import { PrismaClient } from "@prisma/client";
import pkg from 'bson-objectid';
const { default: ObjectId } = pkg;




// Iniializes the prisma client 
const prisma = new PrismaClient();


// Create exam result 
const createExamResult = async (req, res) => {
    const { studentId, examId, score, status } = req.body;
    try {

        const createdExamResult = await prisma.examResult.create({
            data: {
                student: { connect: { id: studentId } },
                exam: { connect: { id: examId } },
                score,
                status,
            },
        });
        return res.status(200).json({ createdExamResult });
    } catch (error) {
        console.error({ error });
        return res.status(500).json({ error: "Internal Server Error" });
    } finally {
        await prisma.$disconnect();
    }

}


// Get exam result by id
const getExamResultById = async (req, res) => {
    const examResultId = req.params.id;
    try {
        const examResult = await prisma.examResult.findUnique({
            where: { id: examResultId },
            include: { student: true, exam: true },
        });

        if (!examResult) {
            return res.status(404).json({ error: "ExamResult not found" });
        }

        return res.status(200).json(examResult);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    } finally {
        await prisma.$disconnect();
    }
}

// Update ExamResult 
const updateExamResult = async (req, res) => {
    const examResultId = req.params.id;
    const { score, status } = req.body;

    try {
        const updatedExamResult = await prisma.examResult.update({
            where: { id: examResultId },
            data: {
                score,
                status,
            },
        });

        if (!updatedExamResult) {
            return res.status(404).json({ error: "ExamResult not found" });
        }

        return res.status(200).json(updatedExamResult);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    } finally {
        await prisma.$disconnect();
    }
}


//Delete Exam Result by id
const deleteExamResult = async (req, res) => {
    const examId = req.params.id;

    try {
        const deletedExamResult = await prisma.examResult.delete({
            where: { id: examId },
        });

        if (!deletedExamResult) {
            return res.status(404).json({ error: "ExamResult not found" });
        }

        return res.status(200).json(deletedExamResult);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server error" });
    } finally {
        await prisma.$disconnect();
    }
}


// Get all ExamResult 

const getAllExamResults = async (req, res) => {
    try {
        const allExamResults = await prisma.examResult.findMany();

        if (!allExamResults) {
            return res.status(404).json({ error: "ExamResults not found" });
        }

        return res.status(200).json(allExamResults);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    } finally {
        await prisma.$disconnect();
    }

}


// Submit exam result
// const submitExamResult = async (req, res) => {
//     const { userId, examId, userResponses } = req.body;

//     try {
//         // Fetch the examInProgress record to get the current score
//         const examInProgress = await prisma.examInProgress.findFirst({
//             where: { userId, examId },
//             include: { answeredQuestions: true, exam: { include: { questions: true } } },
//         });

//         if (!examInProgress) {
//             return res.status(404).json({ error: "Exam in Progress not Found" });
//         }

//         // Calculate the final score based on userResponses and totalQuestions
//         const totalQuestions = examInProgress.exam.questions.length;
//         let finalScore = 0;
//         for (const response of examInProgress.answeredQuestions) {
//             if (response.isCorrect) {
//                 finalScore += 1;
//             }
//         }
//         finalScore = (finalScore / totalQuestions) * 100;

//         // Fetch the existing ExamResult if it exists
//         const existingExamResult = await prisma.examResult.findFirst({
//             where: {
//                 userId: userId,
//                 examId: examId,
//             }
//         });

//         // If the exam result exists, update it. Otherwise, create a new one.
//         let examResult;
//         if (existingExamResult) {
//             examResult = await prisma.examResult.update({
//                 where: {
//                     id: existingExamResult.id
//                 },
//                 data: {
//                     score: finalScore,
//                     status: "completed"
//                 }
//             });
//         } else {
//             examResult = await prisma.examResult.create({
//                 data: {
//                     student: { connect: { id: userId } },
//                     exam: { connect: { id: examId } },
//                     score: finalScore,
//                     status: "completed",
//                 }
//             });
//         }
//         return res.status(200).json({ message: "Final result submitted successfully", examResult });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: "Internal server error" });
//     } finally {
//         await prisma.$disconnect();
//     }
// };

//================ Using UserExamResultModel here ==================

// Using the userExamResultModel
const submitExamResult = async (req, res) => {
    const { userId, examId, userResponses } = req.body;

    try {
        // Fetch the examInProgress record to get the current score
        const examInProgress = await prisma.examInProgress.findFirst({
            where: {
                userId: userId,
                examId: examId
            },
            include: {
                answeredQuestions: true,
                exam: {
                    include: { questions: true }
                }
            }
        });

        if (!examInProgress) {
            return res.status(404).json({ error: "Exam in Progress not Found" });
        }

        // Calculate the final score based on userResponses and totalQuestions
        const totalQuestions = examInProgress.exam.questions.length;
        let finalScore = 0;
        for (const response of examInProgress.answeredQuestions) {
            if (response.isCorrect) {
                finalScore += 1;
            }
        }
        finalScore = (finalScore / totalQuestions) * 100;

        // Fetch the existing userExamResult if it exists
        const existingUserExamResult = await prisma.userExamResult.findFirst({
            where: {
                userId: userId, // Ensure these field names match your schema
                examId: examId
            }
        });

        // If the user exam result exists, update it. Otherwise, create a new one.
        let userExamResult;
        if (existingUserExamResult) {
            userExamResult = await prisma.userExamResult.update({
                where: {
                    id: existingUserExamResult.id
                },
                data: {
                    score: finalScore,
                    status: "completed"
                }
            });
        } else {
            userExamResult = await prisma.userExamResult.create({
                data: {
                    user: { connect: { id: userId } },
                    exam: { connect: { id: examId } },
                    score: finalScore,
                    userResponses: userResponses,
                }
            });
        }

        return res.status(200).json({ message: "Final result submitted successfully", userExamResult });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    } finally {
        await prisma.$disconnect();
    }
};


// Get exam result by user ID and selected exam ID
const getExamResultBySelectedUserIdAndExamId = async (req, res) => {
    const { userId, selectedExam } = req.body;

    try {
        // Fetch the exam result from the database
        const userExamResult = await prisma.userExamResult.findFirst({
            where: {
                userId: userId,
                examId: selectedExam
            },
            include: {
                exam: true,
                user: true
            }
        });

        if (!userExamResult) {
            return res.status(404).json({ error: "Exam result not found" });
        }

        

        // Return the exam result
        return res.status(200).json(userExamResult);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    } finally {
        await prisma.$disconnect();
    }
};



export default {
    createExamResult, getExamResultById, updateExamResult,
    deleteExamResult, getAllExamResults, submitExamResult,
    getExamResultBySelectedUserIdAndExamId,
}