import express from "express";
import examInProgressController from "../controller/examInProgressController.js";



// Initialise the router 
const router = express.Router();

// Defined routes 
router.post('/exam-in-progress', examInProgressController.createExamInProgress);
router.get('/exam-in-progress/:id', examInProgressController.getExamInProgressById);
router.put('/exam-in-progress/:id', examInProgressController.updateExamInProgress);



export default router;


