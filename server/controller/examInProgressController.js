import prisma from "../helpers/prisma.js";


//Create ExamInProgress 
const createExamInProgress = async (req, res) => {
    const { userId, examId, currentQuestionIndex } = req.body;
    try {
        await prisma.$transaction(async (prisma) => {
            const createdExamInProgress = await prisma.examInProgress.create({
                data: {
                    user: { connect: { id: userId } },
                    exam: { connect: { id: examId } },
                    currentQuestionIndex,
                },
            });

            return res.status(200).json(createdExamInProgress);
        }, { timeout: 30000 });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

// Get Exam in Progress by id

const getExamInProgressById = async (req, res) => {
    const examInProgressId = req.params.id;
    try {
        const gottenExamInProgressById = await prisma.examInProgress.findUnique({
            where: { id: examInProgressId },
            include: {
                user: true,
                exam: true,
            },
        });

        if (!gottenExamInProgressById) {
            return res.status(404).json({ Error: "ExamInProgress not Found!  " });
        }
        return res.status(200).json(gottenExamInProgressById);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

// Update exam in Progress
const updateExamInProgress = async (req, res) => {
    const examInProgressId = req.params.id;
    const { currentQuestionIndex, score } = req.body;

    try {
        await prisma.$transaction(async (prisma) => {
            const updatedExamInProgress = await prisma.examInProgress.update({
                where: { id: examInProgressId },
                data: { currentQuestionIndex, score },
            });

            if (!updatedExamInProgress) {
                return res.status(404).json({ Error: " Exam in progress not found" });
            }

            return res.status(200).json({ updatedExamInProgress });
        }, { timeout: 30000 });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ Error: "Internal Server Error" });
    }
}


// Delete Exam in Progress by Id   
const deleteExamInProgressById = async (req, res) => {
    const examInProgressId = req.params.id;
    try {

        await prisma.$transaction(async (prisma) => {


            // First, delete related AnsweredQuestion records
            await prisma.answeredQuestion.deleteMany({
                where: { examInProgressId: examInProgressId },
            });

            const deletedExamInProgress = await prisma.examInProgress.delete({
                where: { id: examInProgressId },

            });

            if (!deletedExamInProgress) {
                console.error(error);
                return res.json({ error: "Exam in Progress not Found" });
            }

            return res.status(200).json(deletedExamInProgress);

        }, { timeout: 60000 });

    } catch (error) {
        console.error(error);
        if (error.code === 'P2025') { 
            return res.status(404).json({ error: "Exam in Progress not Found" });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
}


// Get all Exam in Progress 
const getAllExamInProgress = async (req, res) => {

    try {
        await prisma.$transaction(async (prisma) => {
            const allExamsInProgress = await prisma.examInProgress.findMany({
                include: {
                    user: true,
                    exam: true,
                },
            });

            if (!allExamsInProgress) {
                return res.json({ Error: "No ExamInProgress Found" });
            }

            return res.status(200).json(allExamsInProgress);
        }, { timeout: 60000 });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}


// Function to check Answer 
const checkAnswer = async (req, res) => {

    // const { examId, questionId, selectedOption, userId } = req.body;

    // try {
    //     await prisma.$transaction(
    //         async (prisma) => {

    //             // Check if an ExamInProgress record exists for the user and exam
    //             let examInProgress = await prisma.examInProgress.findFirst({
    //                 where: {
    //                     userId: userId,
    //                     examId: examId,
    //                 },
    //             });

    //             // If no ExamInProgress record found, create one
    //             if (!examInProgress) {
    //                 examInProgress = await prisma.examInProgress.create({
    //                     data: {
    //                         userId: userId,
    //                         examId: examId,
    //                         currentQuestionIndex: 0, // Set initial value for currentQuestionIndex
    //                     },
    //                 });
    //             }

    //             // Persist the Answered Question to db
    //             await prisma.answeredQuestion.create({
    //                 data: {
    //                     questionId: questionId,
    //                     examInProgressId: examInProgress.id,
    //                     selectedOption: selectedOption,
    //                 },
    //             });

    //             //======================================================


    //             // const question = await prisma.question.findUnique({
    //             //     where: { id: questionId },
    //             // });

    //             // if (!question) {
    //             //     return res.json({ error: "Question not found" });
    //             // }

    //             // const isCorrect = question.correctAnswer === selectedOption;

    //             // // Persist the Answered Question to db

    //             // await prisma.answeredQuestion.create({
    //             //     data: {
    //             //         question: { connect: { id: questionId } },
    //             //         examInProgress: { connect: { id: examId } },
    //             //         selectedOption,
    //             //         isCorrect,
    //             //     },
    //             // });

    //             return res.status(200).json({ success: true });

    //         }, { timeout: 60000 }
    //     );
    // } catch (error) {
    //     console.error("Error checking answer: ", error);
    //     res.status(500).json({ error: "Internal Server Error" });
    // } finally {
    //     await prisma.$disconnect();
    // }
}


// saveUserResponse function to ensure proper score calculation and prevent duplicate submissions
const saveUserResponse = async (req, res) => {
    try {
        await prisma.$transaction(async (prisma) => {
            const { userId, examId, questionId, selectedOption } = req.body;

            // Validate incoming data
            if (!userId || !examId || !questionId || !selectedOption) {
                return res.status(400).json({ error: "Missing Parameters" });
            }

            // Fetch the relevant examInProgress record
            const examInProgress = await prisma.examInProgress.findFirst({
                where: { userId, examId },
                orderBy: {
                    startTime: 'desc',
                },
                include: { answeredQuestions: true, exam: { include: { questions: true } } },
            });

            if (!examInProgress) {
                return res.status(404).json({ error: "Exam in Progress not Found" });
            }

            // Fetch the correct answer for the question
            const question = await prisma.question.findUnique({
                where: { id: questionId },
                select: { correctAnswer: true },
            });

            if (!question) {
                return res.status(404).json({ error: "Question not found" });
            }

            const selectedLetter = selectedOption.split(':')[0].trim();

            // Check if the selected option is correct
            const isCorrect = question.correctAnswer === selectedLetter;

            console.log("Is correct Answer:", isCorrect, "check", question.correctAnswer, " selected option==>", selectedOption);

            // Check if the question was already answered
            const existingAnswer = examInProgress.answeredQuestions.find(q => q.questionId === questionId);

            let updatedScore = examInProgress.score;

            if (existingAnswer) {
                // Update existing answer if necessary
                await prisma.answeredQuestion.update({
                    where: { id: existingAnswer.id },
                    data: { selectedOption, isCorrect },
                });

                // Adjust score based on the new correctness
                if (existingAnswer.isCorrect && !isCorrect) {
                    updatedScore -= (1 / examInProgress.exam.questions.length) * 100;
                } else if (!existingAnswer.isCorrect && isCorrect) {
                    updatedScore += (1 / examInProgress.exam.questions.length) * 100;
                }
            } else {
                // Create a new answered question entry
                await prisma.answeredQuestion.create({
                    data: {
                        question: { connect: { id: questionId } },
                        examInProgress: { connect: { id: examInProgress.id } },
                        selectedOption,
                        isCorrect,
                    },
                });

                // Adjust score based on the new answer
                if (isCorrect) {
                    updatedScore += (1 / examInProgress.exam.questions.length) * 100;
                }
            }

            // Update the examInProgress with the new score
            const updatedExamInProgress = await prisma.examInProgress.update({
                where: { id: examInProgress.id },
                data: { score: updatedScore },
            });

            return res.status(200).json(updatedExamInProgress);
        }, { timeout: 90000 });
    } catch (error) {
        console.error('Error saving user response:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


// Delete All Exam In Progress
const deleteAllExamInProgress = async (req, res) => {
    try {
        await prisma.examInProgress.deleteMany();
        return res.json({ message: "All exams in progress deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};



//Get all Exam in Progress with Pagination and Search
const nowGetAllExamInProgress = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // defaults to page 1
        const pageSize = parseInt(req.query.pageSize) || 100; // defaults to 10 items per page
        const search = req.query.search || ''; // defaults to an empty search
        const skip = (page - 1) * pageSize;

        const examsInProgress = await prisma.examInProgress.findMany({
            skip,
            take: pageSize,
            where: {
                OR: [
                    { user: { email: { contains: search, mode: 'insensitive' } } },
                    { exam: { subject: { contains: search, mode: 'insensitive' } } },
                ],
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
                exam: {
                    select: {
                        id: true,
                        subject: true,
                    },
                },
            },
            // orderBy: {
            //     createdAt: 'desc',
            // },
        });

        const total = await prisma.examInProgress.count({
            where: {
                OR: [
                    { user: { email: { contains: search, mode: 'insensitive' } } },
                    { exam: { subject: { contains: search, mode: 'insensitive' } } },
                ],
            },
        });

        const formattedExamsInProgress = examsInProgress.map(examInProgress => ({
            id: examInProgress.id,
            userId: examInProgress.user.id,
            userEmail: examInProgress.user.email,
            examId: examInProgress.exam.id,
            examSubject: examInProgress.exam.subject,
            score: examInProgress.score
        }));

        return res.json({
            data: formattedExamsInProgress,
            page,
            pageSize,
            total,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};



export default {
    createExamInProgress, getExamInProgressById, checkAnswer, saveUserResponse,
    updateExamInProgress, deleteExamInProgressById, getAllExamInProgress,
    deleteAllExamInProgress, nowGetAllExamInProgress
}