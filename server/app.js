
import prisma from "./helpers/prisma.js";

// Error handling for uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('There was an uncaught error', err);
  process.exit(1); // Exiting the process is often recommended to avoid undefined behavior
});

// Error handling for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1); // Exiting the process is often recommended to avoid undefined behavior
});

// When ctrl C is presses to terminate the application 
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Process terminated');
  await prisma.$disconnect(); // Perform clean-up tasks here if necessary
  process.exit(0);
});

import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import testRoute from "./routes/testRoute.js";
import questionRoutes from './routes/questionRoutes.js';
import csvRoutes from './routes/csvRoute.js';
import examRoutes from './routes/examRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import examResultRoutes from './routes/examResultRoutes.js';
import candidateRoutes from './routes/candidateRoutes.js';
import examInProgressRoutes from './routes/examInProgressRoutes.js';
import userRoutes from "./routes/userRoutes.js";
import registrationRoutes from "./routes/registrationRoutes.js";
import loginRoutes from './routes/loginRoutes.js';
import answerdQuestionsRoutes from "./routes/answeredQuestionsRoutes.js"
import oneUserManagementRoutes from "./routes/oneUserManagementRoutes.js";
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
// Activates dotenv for use
dotenv.config();
const port = process.env.PORT || 5000;
const allowedOrigins = process.env.ALLOWED_ORIGINS

// delcared some middleware used 
app.use([express.json(), morgan("dev")]);


// Static files configuration
const imageStoragePath = path.join(__dirname, 'fileStorage', 'images');

// Ensure the directory exists

if (!fs.existsSync(imageStoragePath)) {
  fs.mkdirSync(imageStoragePath, { recursive: true });
}

app.use(cors("*"));


// Running the routes 
app.use('/api', testRoute);
app.use('/api', questionRoutes);
app.use('/api', csvRoutes);
app.use('/api/exams', examRoutes);
app.use('/api', studentRoutes);
app.use('/api', examResultRoutes);
app.use('/api/submit-final-exam-result', examResultRoutes);
app.use('/api', candidateRoutes);
app.use('/api', examInProgressRoutes);
app.use('/api/check-answer', examInProgressRoutes); // special route for checking answer
app.use('/api', userRoutes);
app.use('/api/resetAllExam', userRoutes);  // for the reset takenExam
app.use('/api/get-the-users', userRoutes); // query route here. See userRoutes for surfix 

app.use('/api', registrationRoutes);
app.use('/api', loginRoutes);
app.use('/api/save-user-response', examInProgressRoutes); // special route for saving examInProgress
app.use('/api/user-exam-result', examResultRoutes);
app.use('/api/delete-all-user-exam-results', examResultRoutes);
app.use('/api/user-exam-results/:id', examResultRoutes);
app.use('/api/delete-all-exam-in-progress', examInProgressRoutes);
app.use('/api', answerdQuestionsRoutes);
app.use('/api/collate-all-users-result', examResultRoutes); // gets all users and their result
app.use('/api', examResultRoutes); // gets single user result
app.use('/api', oneUserManagementRoutes);


// Serve static image files
app.use('/api/images', express.static(imageStoragePath));



// Return 404 for non accounted routes
app.all('*', (req, res) => {
  res.status(404).json({
    msg: "Requested resource does not exist"
  });
});

app.listen(port, () => {
  console.log(`app is running on ${port}`);
});













