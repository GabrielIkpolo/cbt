import express from 'express';
import userController from '../controller/userController.js';


// Initialise Express Router 

const router = express.Router();



router.post('/the-users', userController.createUser);
router.get('/the-users/:id', userController.getUserById);
router.put('/the-users/:id', userController.updateUser);
router.delete('/the-users/:id', userController.deleteUser);
router.get('/the-users', userController.getAllUsers);







export default router;