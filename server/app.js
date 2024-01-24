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




const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
// Activates dotenv for use
dotenv.config();
const port = process.env.PORT || 5000;

// delcared some middleware used 
app.use([express.json(), morgan("dev")]);

app.use(cors({
    origin: ["http://localhost:5000", "*"]
}));


// Running the routes 
app.use('/api', testRoute);
app.use('/api', questionRoutes );
app.use('/api', csvRoutes );
app.use('/api/exams', examRoutes);
app.use('/api', studentRoutes);




// Return 404 for non accounted routes
app.all('*', (req, res) => {
    res.status(404).json({
        msg: "Requested resource does not exist"
    });
});

app.listen(port, () => {
    console.log(`app is running on ${port}`);
});













