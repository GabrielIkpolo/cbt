import express from 'express';
import examController from '../controller/examController.js';
import multer from 'multer';
import authMiddleware from '../helpers/authMiddleware.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';



// Initialize the express router 
const router = express.Router();

// cleanup to use __direname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nameOfFileToBeUploaded = 'examFile';
const imageStoragePath = path.join(__dirname, '..', 'fileStorage', 'images');

// Ensure the directory exists
if (!fs.existsSync(imageStoragePath)) {
    fs.mkdirSync(imageStoragePath, { recursive: true });
}

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Image  uplaod function
const imageUpload = multer({ storage: multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, imageStoragePath);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})});

// Defined routes 
router.post('/raw-post', examController.createExam);
router.get('/', examController.getAllExams);   
router.get('/:id', examController.getExamById);
router.put('/:id', examController.updateExam);
router.delete('/:id', examController.deleteExam);


// To create exam form file uplaod
router.post('/upload', upload.single(nameOfFileToBeUploaded), async (req, res) => {
    try {
        // const originalFileName = req.file.originalname;
        const examsBuffer = req.file.buffer;
        console.log('Parsed exams (before create):', await examController.parseCSV(examsBuffer));
        await examController.createExamFromCSV(req, res);
    } catch (err) {
        console.error('Error in route:', err);
        res.status(500).json({ err: 'Failed to upload CSV' });
    }
});


// Endpoint for uploading images
router.post('/upload-images', imageUpload.array('images', 100), (req, res) => {
    try {
        // Files are saved by multer, so we return success response
        res.status(200).json({ message: 'Images uploaded successfully' });
    } catch (err) {
        console.error('Error uploading images:', err);
        res.status(500).json({ err: 'Failed to upload images' });
    }
});


export default router;














