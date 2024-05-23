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


router.post('/', examResultController.submitExamResult);
router.post('/', examResultController.getExamResultBySelectedUserIdAndExamId );

//router.get()examreslult by userid and selectedExam

router.delete('/', examResultController.deleteAllUserExamResults);
router.delete('/', examResultController.deleteUserExamResultById);

//Get All users with their exam result
router.get('/', examResultController.getAllUsersWithExamScores);

//Get single User and exam result 
router.get('/collate-single-user-result/:id', examResultController.getUserDetailsWithExamScores)


export default router;