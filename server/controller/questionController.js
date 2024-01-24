import { PrismaClient } from "@prisma/client";
import pkg from 'bson-objectid';
const { default: ObjectId } = pkg; // Alias the default export as ObjectId


// Initialises the prisma client 
const prisma = new PrismaClient();

// generate a bson-ojectId (mongodb id) for usage: 
const generatedId = new ObjectId().toHexString();
console.log(generatedId);


// Create Question(s)
const createQuestion = async (req, res) => {

    const { text, options, correctAnswer, image, examId } = req.body;
    try {
        const createdQuestion = await prisma.question.create({
            data: {
                text,
                options,
                correctAnswer,
                image,
                examId: generatedId
            }
        });
        res.status(200).json(createQuestion);
    } catch (err) {
        console.log(err)
        res.status(500).json({ err: "Internal Server error" });
    }

}

// Get Questions 
const getQuestions = async (req, res) => {
    try {
        const questions = await prisma.question.findMany();
        res.status(200).json(questions);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

// Update Question 
const updateQuestion = async (req, res) => {
    console.log('Update question function called');
    const questionId = req.params.id;
    const { text, options, correctAnswer, image, examId } = req.body;
    try {
        const updateQuestion = await prisma.question.update({
            where: { id: questionId },
            data: {
                text,
                options,
                correctAnswer,
                image,
                examId,
            },
        });

        res.status(200).json(updateQuestion);

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

// delete single question by Id
const deleteQuestion = async (req, res) => {
    const questionId = req.params.id;

    try {
        const deletedQuestion = await prisma.question.delete({
            where: { id: questionId }
        });
        res.status(200).json(deleteQuestion);
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: "Internal Server Error" });
    }
}

// Delete all questions with same ExamId 
const deleteAllQuestions = async (req, res) => {
    const { examId } = req.params
    try {
        const emptied = await prisma.question.deleteMany({
            where: { examId: examId }
        });
        res.status(200).json(emptied);
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: "internal server error" });
    }
}

export default { createQuestion, getQuestions, updateQuestion, deleteQuestion, deleteAllQuestions };