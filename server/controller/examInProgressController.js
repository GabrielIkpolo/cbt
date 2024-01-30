import { PrismaClient } from "@prisma/client";


// Initialise Prisma client 
const prisma = new PrismaClient();


//Create ExamInProgress 
const createExamInProgress = async (req, res) => {
    const { candidateId, examId, currentQuestionIndex } = req.body;
    try {
        await prisma.$transaction(async (prisma) => {
            const createdExamInProgress = await prisma.examInProgress.create({
                data: {
                    candidate: { connect: { id: candidateId } },
                    exam: { connect: { id: examId } },
                    currentQuestionIndex,
                },
            });

            return res.status(200).json(createdExamInProgress);
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    } finally {
        await prisma.$disconnect();
    }
}

// Get Exam in Progress by id

const getExamInProgressById = async (req, res) => {
    const examInProgressId = req.params.id;
    try {
        const gottenExamInProgressById = await prisma.examInProgress.findUnique({
            where: { id: examInProgressId },
            include: {
                candidate: true,
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
    } finally {
        await prisma.$disconnect();
    }
}

// Update exam in Progress
const updateExamInProgress = async (req, res) => {
    const examInProgressId = req.params.id;
    const { currentQuestionIndex } = req.body;

    try {
        await prisma.$transaction(async (prisma) => {
            const updatedExamInProgress = await prisma.examInProgress.update({
                where: { id: examInProgressId },
                data: { currentQuestionIndex },
            });

            if (!updatedExamInProgress) {
                return res.status(404).json({ Error: " Exam in progress not found" });
            }

            return res.status(200).json({ updatedExamInProgress });
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ Error: "Internal Server Error" });
    } finally {
        await prisma.$disconnect();
    }
}





export default {
    createExamInProgress, getExamInProgressById,
    updateExamInProgress
}