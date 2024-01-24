import { PrismaClient } from "@prisma/client";
import pkg from 'bson-objectid';
const { default: ObjectId } = pkg;
import * as fastcsv from 'fast-csv';

// Initialize prisma client 
const prisma = new PrismaClient();

// Generate a BSON-ObjectID (MongoDB ID) for usage
const generatedId = new ObjectId().toHexString();

// Create Exam 
const createExam = async (req, res) => {
    const { questions, durationMinutes, subject } = req.body;

    try {
        const createdExam = await prisma.exam.create({
            data: {
                questions: {
                    createMany: {
                        data: questions.map((question) => ({
                            ...question,
                            id: new ObjectId().toHexString(),
                        })),


                    }
                },
                durationMinutes,
                subject,
            }
        });

        res.status(200).json(createdExam);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}

// Pases the csv file 
const parseCSV = async (buffer) => {
    try {
        const exams = [];

        const csvStream = fastcsv.parseString(buffer.toString(), { headers: true });

        for await (const row of csvStream) {
            const examData = {
                questions: [],
                durationMinutes: parseInt(row.durationMinutes),
                subject: row.subject,
            };

            const question = {
                text: row.text,
                options: row.options.split(';').map(option => option.trim()),
                correctAnswer: row.correctAnswer,
                image: row.image,
            };

            examData.questions.push(question);
            exams.push(examData);
        }

        console.log('Parsed exam data:', exams);
        return exams;
    } catch (err) {
        console.error('Error parsing CSV:', err);
        throw err;
    }
};



const createExamFromCSV = async (req, res) => {
    const examsBuffer = req.file.buffer;

    try {
        const exams = await parseCSV(examsBuffer);

        if (exams.length === 0) {
            throw new Error('No exams parsed from CSV');
        }

        const firstExamData = exams[0]; // Use the first exam data for creating the exam
        const createdExam = await prisma.exam.create({
            data: {
                durationMinutes: firstExamData.durationMinutes,
                subject: firstExamData.subject,
                questions: {
                    createMany: {
                        data: exams.flatMap((examData) =>
                            examData.questions.map((question) => ({
                                ...question,
                                id: new ObjectId().toHexString(),
                            }))
                        ),
                    },
                },
            },
        });

        res.status(200).json({ message: 'Exam created successfully', data: createdExam });
    } catch (err) {
        console.error('Error creating exam:', err);
        res.status(500).json({ err: 'Internal Server Error' });
    }
};

//Get an Exam by its Id
const getExamById = async (req, res) => {
    const examId = req.params.id;
    try {
        const exam = await prisma.exam.findUnique({
            where: { id: examId },
            include: { questions: true },
        });

        if (!exam) {
            console.log("exam with specific id not found");
            return res.status(404).json({ error: "Exam not found" })
        }

        return res.status(200).json(exam);

    } catch (err) {
        console.error("Error getting exam by ID", err);
        res.status(500).json({ error: "Internal server error" });
    }
}


// Update an exam 

const updateExam = async (req, res) => {
    const examId = req.params.id;

    const { questions, durationMinutes, subject } = req.body;
    try {
        const updatedExam = await prisma.exam.update({
            where: { id: examId },
            data: {
                questions: {
                    updateMany: questions.map((question) => ({
                        where: { id: question.id }, // Provide the question ID for updating
                        data: { ...question },
                    })),

                },
                durationMinutes,
                subject,
            },
            include: { questions: true },
        });
        return res.status(200).json(updateExam);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
}


//Delete associated questions
const deleteQuestionsForExam = async (examId) => {
    try {
        await prisma.question.deleteMany({
            where: { examId: examId },
        });
        console.log(`Questions for Exam ${examId} deleted successfully`);
    } catch (error) {
        console.error(`Error deleting questions for Exam ${examId}:`, error);
        throw error;
    }
};


// Delete an exam by Id 
const deleteExam = async (req, res) => {
    const examId = req.params.id;
    console.log(examId);
    try {

        // Delete associated questions
        await deleteQuestionsForExam(examId);
        
        const deletedExam = await prisma.exam.delete({
            where: { id: examId },
            include: { questions: true }, // Include associated questions
        });

        if (!deletedExam) {
            return res.status(404).json({ Error: "Exam not found" });
        }

        return res.status(200).json(deletedExam);

    } catch (err) {
        console.error('Error deleting exam:', err);

        return res.status(500).json({ error: "Internal Server Error" });
    }
}


export default { createExam, parseCSV, createExamFromCSV, getExamById, updateExam, deleteExam }

