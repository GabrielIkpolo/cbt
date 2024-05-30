import prisma from "../helpers/prisma.js";


// Delete All Answered Questions
const deleteAllAnsweredQuestions = async (req, res) => {
    try {
        await prisma.answeredQuestion.deleteMany();
        return res.status(200).json({ message: "All answered questions deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    } 
};


// Delete Answered Questions by Exam In Progress ID
const deleteAnsweredQuestionsByExamInProgressId = async (req, res) => {
    const examInProgressId = req.params.id;

    try {
        const deletedAnsweredQuestions = await prisma.answeredQuestion.deleteMany({
            where: { examInProgressId: examInProgressId },
        });

        if (deletedAnsweredQuestions.length === 0) {
            return res.status(404).json({ error: "No answered questions found for the given exam in progress" });
        }

        return res.status(200).json({ message: "Answered questions deleted successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    } 
};



export default {
    deleteAllAnsweredQuestions,
    deleteAnsweredQuestionsByExamInProgressId,
}