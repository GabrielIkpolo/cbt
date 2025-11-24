import prisma from '../helpers/prisma.js';
import pkg from 'bson-objectid';
const { default: ObjectId } = pkg;

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
    }

}



//================ Using UserExamResultModel here ==================

// Using the userExamResultModel
// const submitExamResult = async (req, res) => {
//     const { userId, examId, userResponses } = req.body;

//     try {
//         await prisma.$transaction(async (prisma) => {
//             // Fetch the examInProgress record to get the current score
//             const examInProgress = await prisma.examInProgress.findFirst({
//                 where: {
//                     userId: userId,
//                     examId: examId
//                 },
//                 orderBy: { startTime: 'desc' },
//                 include: {
//                     answeredQuestions: true,
//                     exam: {
//                         include: { questions: true }
//                     }
//                 }
//             });

//             if (!examInProgress) {
//                 return res.status(404).json({ error: "Exam in Progress not Found" });
//             }

//             // Calculate the final score based on userResponses and totalQuestions
//             const totalQuestions = examInProgress.exam.questions.length;
//             let finalScore = examInProgress.answeredQuestions.filter(q => q.isCorrect).length;

//             finalScore = (finalScore / totalQuestions) * 100;

//             // Increment totalExamsTaken in User model

//             console.log("Was update user called");
//             await prisma.user.update({
//                 where: { id: userId },
//                 data: { totalExamsTaken: 1 },
//                 // data: { totalExamsTaken: { increment: 1 } }, It is registering now, but called 3 times
//             });
//             console.log("update user called");

//             // Fetch the existing UserExamResult if it exists
//             const existingUserExamResult = await prisma.userExamResult.findFirst({
//                 where: {
//                     userId: userId,
//                     examId: examId
//                 }
//             });

//             // If the user exam result exists, update it. Otherwise, create a new one.
//             let userExamResult;
//             if (existingUserExamResult) {
//                 userExamResult = await prisma.userExamResult.update({
//                     where: {
//                         id: existingUserExamResult.id
//                     },
//                     data: {
//                         score: finalScore,
//                         status: "completed"
//                     }
//                 });
//             } else {
//                 userExamResult = await prisma.userExamResult.create({
//                     data: {
//                         user: { connect: { id: userId } },
//                         exam: { connect: { id: examId } },
//                         score: finalScore,
//                         userResponses: userResponses,
//                     }
//                 });


//             }

//             // Return the updated user exam result with final score
//             return res.status(200).json({ message: "Final result submitted successfully", userExamResult });
//         }, { timeout: 120000 });

//     } catch (error) {
//         console.error(error);
//         if (error.message === "Exam in Progress not Found") {
//             return res.status(404).json({ error: "Exam in Progress not Found" });
//         }
//         return res.status(500).json({ error: "Internal server error" });
//     }
// };


const submitExamResult = async (req, res) => {
    const { userId, examId } = req.body; // We get IDs from the request

    try {
        // Using a transaction to ensure all database operations succeed or fail together
        const userExamResult = await prisma.$transaction(async (prisma) => {
            // Fetch the most recent examInProgress record to ensure we're submitting the latest attempt
            const examInProgress = await prisma.examInProgress.findFirst({
                where: { userId, examId },
                orderBy: { startTime: 'desc' },
                include: {
                    answeredQuestions: { // Include the actual questions for more detailed logging
                        include: {
                            question: {
                                select: { text: true }
                            }
                        }
                    },
                    exam: { include: { questions: true } }
                }
            });

            if (!examInProgress) {
                // This will cause the transaction to rollback
                throw new Error("Exam in Progress not Found");
            }

            // Calculate the final score from the secure, server-side data
            const totalQuestions = examInProgress.exam.questions.length;
            const correctAnswers = examInProgress.answeredQuestions.filter(q => q.isCorrect).length;
            const finalScore = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

            // Format the user's responses to be stored in the final result for verification purposes
            const formattedUserResponses = examInProgress.answeredQuestions.map(aq => ({
                questionText: aq.question.text,
                selectedOption: aq.selectedOption,
                isCorrect: aq.isCorrect,
            }));

            // Check if a result already exists for this user and exam to either update or create
            const existingUserExamResult = await prisma.userExamResult.findFirst({
                where: { userId, examId }
            });

            let result;
            if (existingUserExamResult) {
                // Update the existing result
                result = await prisma.userExamResult.update({
                    where: { id: existingUserExamResult.id },
                    data: {
                        score: finalScore,
                        status: "completed",
                        userResponses: formattedUserResponses, // Store the verified responses
                    }
                });
            } else {
                // Create a new result
                result = await prisma.userExamResult.create({
                    data: {
                        user: { connect: { id: userId } },
                        exam: { connect: { id: examId } },
                        score: finalScore,
                        status: "completed",
                        userResponses: formattedUserResponses, // Store the verified responses
                    }
                });
            }
      
            return result;
        }, { timeout: 60000 }); // Added a 60-second timeout for the transaction

        // If the transaction is successful, send the response
        return res.status(200).json({ message: "Final result submitted successfully", userExamResult });
it
    } catch (error) {
        console.error(error);
        if (error.message === "Exam in Progress not Found") {
            return res.status(404).json({ error: "Exam in Progress not Found" });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
};




// Fetch user details with exam scores UserExamResult is in Pascal Case.
const getUserDetailsWithExamScores = async (req, res) => {
    const userId = req.params.id;

    try {
        // Fetch user details
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { UserExamResult: { select: { id: true, score: true, exam: { select: { subject: true } } } } },
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Map exam results to include exam name/subject
        const examResults = user.UserExamResult.map(result => ({
            ...result,
            examName: result.exam.subject
        }));

        // Return user details with exam scores
        return res.status(200).json({
            name: user.name,
            email: user.email,
            registrationNumber: user.registrationNumber,
            department: user.department,
            level: user.level,
            examResults: examResults
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};



//Get all user details and their exam scores The UserExamResult Model is in Pascal Case
const getAllUsersWithExamScores = async (req, res) => {
    try {
        // Fetch all users with their exam results
        const users = await prisma.user.findMany({
            include: {
                UserExamResult: {
                    select: {
                        id: true,
                        score: true,
                        exam: { select: { subject: true } },
                    },
                },
            },
        });

        if (!users.length) {
            return res.status(404).json({ error: "No users found" });
        }

        // Map the results to a user-friendly format
        const usersWithScores = users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            registrationNumber: user.registrationNumber,
            department: user.department,
            level: user.level,
            totalExamsTaken: user.totalExamsTaken,
            examResults: user.UserExamResult.map(result => ({
                id: result.id,
                score: result.score,
                examName: result.exam.subject,
            })),
        }));

        // Return all users with their exam scores
        return res.status(200).json(usersWithScores);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
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
    }
};


// Delete All User Exam Results
const deleteAllUserExamResults = async (req, res) => {
    try {
        await prisma.userExamResult.deleteMany();
        return res.status(200).json({ message: "All user exam results deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// Delete User Exam Result by ID
const deleteUserExamResultById = async (req, res) => {
    const userExamResultId = req.params.id;

    try {
        const deletedUserExamResult = await prisma.userExamResult.delete({
            where: { id: userExamResultId },
        });

        if (!deletedUserExamResult) {
            return res.status(404).json({ error: "User exam result not found" });
        }

        return res.status(200).json(deletedUserExamResult);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export default {
    createExamResult, getExamResultById, updateExamResult, deleteUserExamResultById,
    deleteExamResult, getAllExamResults, submitExamResult, getUserDetailsWithExamScores,
    getExamResultBySelectedUserIdAndExamId, deleteAllUserExamResults, getAllUsersWithExamScores,
}