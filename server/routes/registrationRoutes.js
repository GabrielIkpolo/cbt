import express from 'express';
import registrationController from "../controller/registrationController.js";


// Initialise the router 
const router = express.Router();

router.post('/register', registrationController.register);






export default router;