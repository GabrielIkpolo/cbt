import express from "express";
import examInProgressController from "../controller/examInProgressController.js";
import authMiddleware from "../helpers/authMiddleware.js";



// Initialise the router 
const router = express.Router();

// Defined routes 
router.post('/exam-in-progress', examInProgressController.createExamInProgress);
router.get('/exam-in-progress/:id', examInProgressController.getExamInProgressById);
router.put('/exam-in-progress/:id', examInProgressController.updateExamInProgress);
router.delete('/exam-in-progress/:id', examInProgressController.deleteExamInProgressById);
router.get('/exam-in-progress', authMiddleware.requireSignin, examInProgressController.getAllExamInProgress);

router.put('/', examInProgressController.checkAnswer);
router.post('/', examInProgressController.saveUserResponse);
router.delete('/', examInProgressController.deleteAllExamInProgress);


// The NowGetAllExam in progress other route
router.get('/all-exams-in-progress', 
    examInProgressController.nowGetAllExamInProgress);


export default router;


