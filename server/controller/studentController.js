import { PrismaClient } from "@prisma/client";
import pkg from 'bson-objectid';
import * as fastcsv from 'fast-csv';
const { default: ObjectId } = pkg;

// Initialise Prisma 
const prisma = new PrismaClient();


const createStudent = async (req, res) => {
    const { name, registrationNumber, department } = req.body;
    try {
        const createdStudent = await prisma.student.create({
            data: {
                name,
                registrationNumber,
                department,
            },
        });
        return res.status(200).json(createdStudent);
    } catch (error) {
        console.error({ error });
        return res.status(500).json({ error: "Internal Server Error" });

    }finally {
        await prisma.$disconnect();
    }

}

// Get a unique student by student

const getStudentById = async (req, res) => {
    const studentId = req.params.id;

    try {
        const student = await prisma.student.findUnique({
            where: { id: studentId },
        });

        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        return res.status(200).json(student);

    } catch (error) {
        console.log(error)
        return res.status(500).res.json({ error: "Internal server Error" });
    }finally {
        await prisma.$disconnect();
    }
}


// Update Student
const updateStudent = async (req, res) => {
    const studentId = req.params.id;
    const { name, registrationNumber, department } = req.body;

    try {
        const student = await prisma.student.update({
            where: { id: studentId },
            data: {
                name,
                registrationNumber,
                department,
            },
        });

        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        return res.status(200).json(student);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }finally {
        await prisma.$disconnect();
    }

}

// Delete a student 
const deleteStudent = async (req, res) => {
    const studentId = req.params.id;

    try {
        const deletedStudent = await prisma.student.delete({
            where: { id: studentId },
        });

        if (!deletedStudent) {
            return res.status(404).json({ error: "Student not found" });
        }

        return res.status(200).json(deletedStudent);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

// Get all students 
const getAllStudents = async (req, res) => {
    try {
        const allStudents = await prisma.student.findMany();

        if (!allStudents) {
            return res.status(404).json({ error: "Could not find any student" });
        }
        return res.status(200).json(allStudents);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });

    }

}

// Delete all Students 
const deleteAllStudents = async (req, res) => {
    try {

        const deletedStudents = await prisma.student.deleteMany();
        if (!deletedStudents) {
            return res.status(404).json({ error: "Could not find students" });
        }

        return res.status(200).json(deletedStudents);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}


// Implimenting bulk apload of student record
const parseStudentCSV = async (buffer) => {

    try {
        const students = [];
        const csvStream = fastcsv.parseString(buffer.toString(), { headers: true });
        for await (const row of csvStream) {
            const studentData = {
                name: row.name,
                registrationNumber: row.registrationNumber,
                department: row.department,
            }
            students.push(studentData)
        }
        console.log("Parsed student data", students);
        return students;
    } catch (error) {
        console.log("Error parsing CSV", error);
        throw error;
    }

}

// Create bulk record from csv
const createStudentsFromCSV = async (req, res) => {
    const studentBuffer = req.file.buffer;
    try {
        const students = await parseStudentCSV(studentBuffer);

        if (students.length === 0) {
            throw new Error("No student parsed from CSV");
        }

        const createdStudents = await prisma.student.createMany({
            data: students.map((student)=>({
                ...student,
                id: new ObjectId().toHexString(),
            }))
        });

        return res.status(200).json({message: "Students created sucessfully"});

    } catch (error) {
        console.log("Error creating students", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}



export default {
    createStudent, getStudentById, updateStudent, deleteStudent, getAllStudents,
    deleteAllStudents, parseStudentCSV, createStudentsFromCSV,
}