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




const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
// Activates dotenv for use
dotenv.config();
const port = process.env.PORT || 5000;
const allowedOrigins = process.env.ALLOWED_ORIGINS

// delcared some middleware used 
app.use([express.json(), morgan("dev")]);

app.use(cors({
    origin: [allowedOrigins,"http://localhost:5173"]
}));


// Running the routes 
app.use('/api', testRoute);
app.use('/api', questionRoutes );
app.use('/api', csvRoutes );
app.use('/api/exams', examRoutes);
app.use('/api', studentRoutes);
app.use('/api', examResultRoutes);
app.use('/api', candidateRoutes);
app.use('/api', examInProgressRoutes);
app.use('/api', userRoutes);
app.use('/api', registrationRoutes);
app.use('/api', loginRoutes);




// Return 404 for non accounted routes
app.all('*', (req, res) => {
    res.status(404).json({
        msg: "Requested resource does not exist"
    });
});

app.listen(port, () => {
    console.log(`app is running on ${port}`);
});













