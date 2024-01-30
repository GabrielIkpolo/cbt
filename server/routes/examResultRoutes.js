import express from 'express';
import examResultController from '../controller/examResultController.js';



// Initialize Router 
const router = express.Router();


// Define the routes 
router.post('/exam-results', examResultController.createExamResult);
router.get('/exam-results/:id', examResultController.getExamResultById);
router.put('/exam-results/:id', examResultController.updateExamResult);
router.delete('/exam-results/:id', examResultController.deleteExamResult);
router.get('/exam-results', examResultController.getAllExamResults);







export default router;