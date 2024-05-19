import express from 'express';
import answeredQuestionsController from '../controller/answeredQuestionsController.js';

// Initialize Router 
const router = express.Router();

//Define the endpoints
router.delete('/delete-all-answered-questions', answeredQuestionsController.deleteAllAnsweredQuestions);
router.delete('/answered-questions/:id', answeredQuestionsController.deleteAnsweredQuestionsByExamInProgressId);

export default router;