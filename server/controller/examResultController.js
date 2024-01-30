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
    }finally {
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
    }finally {
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
    }finally {
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
    }finally {
        await prisma.$disconnect();
    }
}


// Get all ExamResult 

const getAllExamResults = async (req, res)=>{
    try{
        const allExamResults = await prisma.examResult.findMany();

        if (! allExamResults){
            return res.status(404).json({error: "ExamResults not found"});
        }

        return res.status(200).json(allExamResults);

    }catch(error){
        console.error(error);
        return res.status(500).json({error: "Internal Server Error"});
    }finally {
        await prisma.$disconnect();
    }

}

export default {
    createExamResult, getExamResultById, updateExamResult,
    deleteExamResult, getAllExamResults,
}