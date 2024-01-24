import express, { Router } from "express";
import testController from "../controller/testController.js";

// Initialise express router 
const router = express.Router()


router.post('/users', testController.firstTest);


export default router;