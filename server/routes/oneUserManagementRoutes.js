import express from 'express';
import oneUserManagementController from '../controller/oneUserManagementController.js';


const router = express.Router();

// router.delete('/answered-questions/:id', oneUserManagementController.deleteAnsweredQuestionsByUserId);

// router.delete('/exam-in-progress/:id', oneUserManagementController.deleteExamInProgressByUserId);

// router.delete('/user-exam-results/:id', oneUserManagementController.deleteUserExamResultsByUserId);

router.delete('/remove-user-exam-details/:id', oneUserManagementController.deleteUserExamDetails);

export default router;