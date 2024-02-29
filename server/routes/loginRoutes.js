import express from 'express';
import registrationController from "../controller/registrationController.js";
import authMiddleware from '../helpers/authMiddleware.js';


// Initialise the router 
const router = express.Router();

router.post('/login', registrationController.login);


export default router;

