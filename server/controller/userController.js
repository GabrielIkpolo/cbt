import prisma from '../helpers/prisma.js';
import authHelpers from '../helpers/authHelpers.js'
import { validate } from 'email-validator';


// Create a User 
const createUser = async (req, res) => {
    const { name, email, password, registrationNumber, department, role, takenExam } = req.body;

    try {
        await prisma.$transaction(async (prisma) => {

            // Perform some validations
            if (!name) {
                return res.json({ error: "Name is required" });
            }

            if (!email || !validate(email)) {
                return res.json({ error: "Email required and must follow the email partern" });
            }

            if (!password || password.length < 6) {
                return res.json({ error: "password must be at least 6 characters long" });
            }

            // Checks if email is taken
            const existingUser = await prisma.user.findUnique({
                where: { email: email },
            });

            if (existingUser) {
                return res.json({ error: "Email is already taken" });
            }

            //Validate registrationNumber

            const existingRegNumber = await prisma.user.findUnique({
                where: { registrationNumber: registrationNumber },
            });

            if (existingRegNumber) {
                return res.json({ error: "Registration Number already exists" });
            }

            // Hash the password before saving it
            const hashedPassword = await authHelpers.hashPassword(password);

            //create the user
            const newUser = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    registrationNumber,
                    department,
                    role,
                    takenExam,
                },
            });

            return res.status(200).json(newUser);
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server Error" });
    }

}

//Get User by Id
const getUserById = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.json({ error: "User not found!" });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

// Get User by Email
const getUserByEmail = async (req, res) => {
    const { email } = req.query;

    try {
        const user = await prisma.user.findUnique({
            where: { email: email },
        });

        if (!user) {
            return res.json({ error: "User not found!" });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}


// Update a User 
const updateUser = async (req, res) => {
    const userId = req.params.id;
    const { name, email, password, registrationNumber, department, role, takenExam,
        enableUpdate } = req.body;
    try {

        await prisma.$transaction(async (prisma) => {


            // If password is provided, hash it
            let hashedPassword = undefined;
            if (password) {
                if (password.length < 6) {
                    return res.json({ error: "Password must be at least 6 characters long" });
                }
                hashedPassword = await authHelpers.hashPassword(password);
            }

            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    registrationNumber,
                    department,
                    role,
                    takenExam,
                    enableUpdate
                },
            });

            return res.status(200).json(updatedUser);
        }, { timeout: 30000 });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ Error: "Internal Server Error" });
    }
}

// Delete User 
const deleteUser = async (req, res) => {
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

            // Delete the user
            const deletedUser = await prisma.user.delete({
                where: { id: userId },
            });

            return res.status(200).json(deletedUser);
        }, { timeout: 30000 });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}



//Get All Users
const getAllUsers = async (req, res) => {
    try {

        const allUsers = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                registrationNumber: true,
                department: true,
                role: true,
                takenExam: true,
                createdAt: true
            }, // Specified the fileds that I wanted. I omitted password.
        });

        if (!allUsers) {
            return res.json({ Error: "No user was found" });
        }

        return res.json(allUsers);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}



// Get All Users with Pagination and Search
// Get All Users with Pagination and Search
const getAllUsersPaginated = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // defaults to page 1
        const pageSize = parseInt(req.query.pageSize) || 50; // defaults to 50 items per page
        const search = req.query.search || ''; // defaults to an empty search
        const skip = (page - 1) * pageSize;

        const users = await prisma.user.findMany({
            skip,
            take: pageSize,
            where: {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                    { registrationNumber: { contains: search, mode: 'insensitive' } },
                    { department: { contains: search, mode: 'insensitive' } },
                ],
            },
            select: {
                id: true,
                name: true,
                email: true,
                registrationNumber: true,
                department: true,
                role: true,
                takenExam: true,
                createdAt: true
            },
            // orderBy: {
            //     createdAt: 'desc',
            // },
        });

        const total = await prisma.user.count({
            where: {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                    { registrationNumber: { contains: search, mode: 'insensitive' } },
                    { department: { contains: search, mode: 'insensitive' } },
                ],
            },
        });

        const totalPages = Math.ceil(total / pageSize);

        return res.json({
            data: users,
            page,
            pageSize,
            total,
            totalPages,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}




// Reset all Exams 
const resetAllExams = async (req, res) => {

    try {
        await prisma.user.updateMany({
            data: { takenExam: 0 },
        });
        return res.status(200).json({ message: "All exams reset sucessfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// exports all the functions
export default {
    createUser, getUserById, updateUser, deleteUser,
    getAllUsers, resetAllExams, getUserByEmail, getAllUsersPaginated
}