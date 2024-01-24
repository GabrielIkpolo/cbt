import express from 'express';
import examController from '../controller/examController.js';
import multer from 'multer';



// Initialize the express router 
const router = express.Router();

const nameOfFileToBeUploaded = 'examFile';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Defined routes 
router.post('/raw-post', examController.createExam);
router.get('/:id', examController.getExamById);
router.put('/:id', examController.updateExam);
router.delete('/:id', examController.deleteExam);

// To create exam form file uplaod
router.post('/upload', upload.single(nameOfFileToBeUploaded), async (req, res) => {
    try {
        const examsBuffer = req.file.buffer;
        console.log('Parsed exams (before create):', await examController.parseCSV(examsBuffer));
        await examController.createExamFromCSV(req, res);
    } catch (err) {
        console.error('Error in route:', err);
        res.status(500).json({ err: 'Failed to upload CSV' });
    }
});


export default router;














