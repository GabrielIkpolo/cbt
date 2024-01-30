import { PrismaClient } from "@prisma/client";
import pkg from 'bson-objectid';
import { json } from "express";
const { default: ObjectId } = pkg;


// Initialize prisma 

const prisma = new PrismaClient();



const createCandidate = async (req, res) => {
    const { name, registrationNumber, department } = req.body;

    try {

        await prisma.$transaction(async (prisma) => {
            const registrationNumberExists = await prisma.candidate.findUnique({
                where: { registrationNumber: registrationNumber }
            });

            if (registrationNumberExists) {
                return res.status(409).json({ error: "Registration Number already exist" });
            }

            const createdCandidate = await prisma.candidate.create({
                data: {
                    name,
                    registrationNumber,
                    department,
                },
            });

            if (!createdCandidate) {
                return res.status(500).json({ error: "Candidate could not be created" });
            }

            return res.status(200).json(createdCandidate);

        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    } finally {
        await prisma.$disconnect();
    }
}


// Get candidate by Id 
const getCandidateById = async (req, res) => {

    const candidateId = req.params.id;

    try {

        const candidate = await prisma.candidate.findUnique({
            where: { id: candidateId },
        });

        if (!candidate) {
            return res.staus(404).json({ error: "Candidate not Found!" });
        }

        return res.status(200).json(candidate);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }finally {
        await prisma.$disconnect();
    }

}


// Update Candidate 
const updateCandidate = async (req, res) => {

    const candidateId = req.params.id;
    const { name, registrationNumber, department } = req.body;

    try {
        const updatedCandidate = await prisma.candidate.update({
            where: { id: candidateId },
            data: {
                name,
                registrationNumber,
                department,
            },
        });

        if (!updatedCandidate) {
            return res.status(404).json({ error: "Candidate not found!" })
        }

        return res.status(200).json(updatedCandidate);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server Error" });
    }finally {
        await prisma.$disconnect();
    }

}


// Delete candidate 
const deleteCandidate = async (req, res) => {
    const candidateId = req.params.id;

    try {
        const deletedCandidate = await prisma.candidate.delete({
            where: { id: candidateId },
        });

        if (!deletedCandidate) {
            return res.status(404).json({ error: "Candidate not found" });
        }

        return res.status(200).json(deletedCandidate)
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }finally {
        await prisma.$disconnect();
    }
}


// Get all Candidates 
const getALLCandidates = async (req, res) => {

    try {
        const allCandidates = await prisma.candidate.findMany();

        if (!allCandidates) {
            return res.status(404).json({ error: " Candidate not Found!" });
        }

        return res.status(200).json(allCandidates);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }finally {
        await prisma.$disconnect();
    }

}


// To delete all candidates 
const deleteAllCandidates = async (req, res) => {
    try {
        const deletedCandidates = await prisma.candidate.deleteMany();

        if (!deletedCandidates) {
            return res.status(404).json({ error: "Candidates were not found" });
        }

        return res.status(200).json(deletedCandidates);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }finally {
        await prisma.$disconnect();
    }
}

export default {
    createCandidate, getCandidateById, updateCandidate,
    deleteCandidate, getALLCandidates, deleteAllCandidates,
}
