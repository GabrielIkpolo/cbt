import express, { application } from 'express';
import studentController from '../controller/studentController.js';
import multer from 'multer';

// Initializes the router 
const router = express.Router();


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const nameOfFileToBeUploaded = 'studentFile';




router.post('/students', studentController.createStudent);
router.get('/students/:id', studentController.getStudentById);
router.put('/students/:id', studentController.updateStudent);
router.delete('/students/:id', studentController.deleteStudent);
router.get('/students', studentController.getAllStudents);
router.delete('/students', studentController.deleteAllStudents);

// To create Student from file upload 
router.post('/students/upload', upload.single(nameOfFileToBeUploaded), async (req, res) => {
    try {
        const studentBuffer = req.file.buffer;
        console.log("Parse students (before create)",
            await studentController.parseStudentCSV(studentBuffer));
        await studentController.createStudentsFromCSV(req, res); // Fix typo here
    } catch (error) {
        console.error("Error in route:", error);
        return res.status(500).json({ error: "Failed to upload CSV" });
    }
});



export default router;




