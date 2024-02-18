import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import authHelpers from "../helpers/authHelpers.js";
import { validate } from "email-validator";

// Initialise Prisma 
const prisma = new PrismaClient();

// Registers a User
const register = async (req, res) => {
    const { name, email, password, registrationNumber, department, role } = req.body;

    try {
        // Perform input validations
        if (!name.trim) {
            return res.json({ Error: "Name is required" });
        }

        if (!email.trim || !validate(email)) {
            return res.json({ Error: "Real email required" });
        }

        if (!password.trim || password.trim().length < 6) {
            return res.json({ error: "Passsword must be at least 6 characters long" });
        }

        // Check if email is already taken 
        const existingEmail = await prisma.user.findUnique({
            where: { email: email },
        });

        if (existingEmail) {
            return res.json({ Error: "Email aready exists" });
        }

        // Checks if registration number already exists 
        const existingRegNumber = await prisma.user.findUnique({
            where: { registrationNumber: registrationNumber },
        });

        if (existingRegNumber) {
            return res.json({ Error: "Registration number already exists" });
        }

        // Hash the password before saving it 
        const hashedPassword = await authHelpers.hashPassword(password);

        // create the user 
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

        // Generate JWT token 
        const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRETE, { expiresIn: '1d' }); //userId is from jwt token

        // Return the token and user information 
        return res.status(200).json({ token, user: newUser });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ Error: "Internal Server Error" });

    }
}

//Login
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Validate the inputs 
        if (!email.trim || !validate(email)) {
            return res.json({ error: "email is required" });
        }

        if (!password || password.length < 6) {
            return res.json({ error: "password is required and must be at least 6 character's long" });
        }

        //Find user by email
        const user = await prisma.user.findUnique({
            where: { email: email },
        });

        // If user not found or password incorrect, return error 
        if (!user || !(await authHelpers.comparePassword(password, user.password))) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Generate JWT token 
        const token = jwt.sign({userId: user.id}, process.env.JWT_SECRETE, {expiresIn: '1d'});

        // Return the token and user information 
        return res.status(200).json({token, user});

    } catch (error) {
        console.error(error);
        return res.status(500).json({ Error: "Internal Server Error" });
    }
}

export default { register, login }