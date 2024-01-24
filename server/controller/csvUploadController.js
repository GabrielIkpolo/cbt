import { PrismaClient } from "@prisma/client";
import * as fastcsv from 'fast-csv';
import pkg from 'bson-objectid';

const { default: ObjectId } = pkg; // Alias the default export as ObjectId


// Initialize the prisma client 
const prisma = new PrismaClient();

// Function for parsing csv
const parseCSV = async (buffer) => {
    try {
        const questions = [];

        const csvStream = fastcsv.parseString(buffer.toString(), { headers: true });

        for await (const row of csvStream) {
            row.options = row.options.split(';').map(option => option.trim());
            questions.push(row);
        }

        console.log('Parsed questions:', questions);
        return questions;
    } catch (err) {
        console.error('Error parsing CSV:', err);
        throw err;
    }
}

const createQuestionFromCSV = async (req, res) => {
    try {
        const questionsBuffer = req.file.buffer;

        console.log('CSV buffer:', questionsBuffer); // Logging buffer content

        const questions = await parseCSV(questionsBuffer);

        if (questions.length === 0) {
            throw new Error('No questions parsed from CSV'); // Explicit error for empty array
        }

        const generatedId = new ObjectId().toHexString(); // generated id for all questions
        const createdQuestions = await prisma.question.createMany({
            data: questions.map(questionData => ({
                ...questionData,
                examId: generatedId,
            })),
        });

        res.status(200).json({ message: 'Questions created successfully', data: createdQuestions });
    } catch (err) {
        console.error('Error creating questions:', err);
        res.status(500).json({ err: 'Internal Server Error' });
    }
}


export default { parseCSV, createQuestionFromCSV }









