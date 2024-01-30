import express from 'express';
import candidateController from '../controller/candidateController.js'



// Initialize router 
const router = express.Router();

// Defined routes 
router.post('/candidates', candidateController.createCandidate);
router.get('/candidates/:id', candidateController.getCandidateById);
router.put('/candidates/:id', candidateController.updateCandidate);
router.delete('/candidates/:id', candidateController.deleteCandidate);
router.get('/candidates', candidateController.getALLCandidates);
router.delete('/candidates', candidateController.deleteAllCandidates);




export default router;