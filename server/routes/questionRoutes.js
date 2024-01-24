import express from 'express';
import questionController from '../controller/questionController.js';


// Initialise the Router 
const router = express.Router();


router.post('/questions', questionController.createQuestion);
router.get('/questions', questionController.getQuestions);
router.put('/questions/:id', questionController.updateQuestion);
router.delete('/questions/:id', questionController.deleteQuestion);

// Delete all questions by exam 
router.delete('/questions/exam/:examId', questionController.deleteAllQuestions);




export default router;




