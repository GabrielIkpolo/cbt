import prisma from '../helpers/prisma.js';

// Delete Answered Questions by User ID
const deleteAnsweredQuestionsByUserId = async (req, res) => {
    const userId = req.params.id;

    try {

        // Delete related AnsweredQuestion records
         const deletedAnsweredQuestions =await prisma.answeredQuestion.deleteMany({
            where: { examInProgress: { userId: userId } },
        });

        // const deletedAnsweredQuestions = await prisma.answeredQuestion.deleteMany({
        //     where: { userId: userId },
        // });

        if (deletedAnsweredQuestions.count === 0) {
            return res.json({ error: "No answered questions found for the given user ID" });
        }

        return res.status(200).json({ message: "Answered questions deleted successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


// Delete examInProgress by user ID
const deleteExamInProgressByUserId = async (req, res) => {
    const userId = req.params.id;

    try {
        const deletedExamInProgress = await prisma.examInProgress.deleteMany({
            where: { userId: userId },
        });

        if (deletedExamInProgress.count === 0) {
            return res.json({ error: "No exams in progress found for the given user ID" });
        }

        return res.status(200).json({ message: "Exams in progress deleted successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};



// Delete User Exam Results by User ID
const deleteUserExamResultsByUserId = async (req, res) => {
    const userId = req.params.id;

    try {
        const deletedUserExamResults = await prisma.examResult.deleteMany({
            where: { userId: userId },
        });

        if (deletedUserExamResults.count === 0) {
            return res.json({ error: "No user exam results found for the given user ID" });
        }

        return res.status(200).json({ message: "User exam results deleted successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const deleteUserExamDetails = async (req, res) => {
    const userId = req.params.id;
    try {
        await prisma.$transaction(async (prisma) => {
            // Delete related AnsweredQuestion records
            await prisma.answeredQuestion.deleteMany({
                where: { examInProgress: { userId: userId } },
            });

            // Delete related ExamInProgress records
            await prisma.examInProgress.deleteMany({
                where: { userId: userId },
            });

            // Delete related UserExamResult records
            await prisma.userExamResult.deleteMany({
                where: { userId: userId },
            });

            return res.status(200).json({message: "Deleted User details"});
        }, {timeout:60000});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}


export default {
    deleteAnsweredQuestionsByUserId, deleteExamInProgressByUserId,
    deleteUserExamResultsByUserId,deleteUserExamDetails, deleteUserExamDetails,
}