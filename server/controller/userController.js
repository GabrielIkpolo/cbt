import { PrismaClient } from "@prisma/client";
import authHelpers from '../helpers/authHelpers.js'
import { validate } from 'email-validator';


// Initializes the prisma client 
const prisma = new PrismaClient();

// Create a User 
const createUser = async (req, res) => {
    const { name, email, password, registrationNumber, department, role } = req.body;

    try {
        await prisma.$transaction(async (prisma) => {

            // Perform some validations
            if (!name.trim) {
                return res.json({ error: "Name is required" });
            }

            if (!email.trim || !validate(email)) {
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
                },
            });

            return res.status(200).json(newUser);
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server Error" });
    } finally {
        await prisma.$disconnect();
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
            return res.status(404).json({ error: "User not found!" });
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
    const { name, email, registrationNumber, department, role } = req.body;
    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name,
                email,
                registrationNumber,
                department,
                role
            },
        });

        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ Error: "Internal Server Error" });
    }
}

// Delete User 
const deleteUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const deletedUser = await prisma.user.delete({
            where: { id: userId },
        });

        if (!deleteUser) {
            return res.status(404).json({ Error: "User not found" });
        }

        return res.status(200).json(deletedUser);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}


//Get All Users
const getAllUsers = async(req, res)=>{
    try{

        const allUsers = await prisma.user.findMany();

        if(!allUsers){
            return res.status(404).json({Error: "No user was found"});
        }

        return res.status(200).json(allUsers);

    }catch(error){
        console.error(error);
        return res.status(500).json({error: "Internal Server Error"});
    }
}


export default { createUser, getUserById, updateUser, deleteUser, getAllUsers }