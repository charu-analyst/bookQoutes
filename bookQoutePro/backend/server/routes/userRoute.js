// server/routes/userRoute.js
import express from 'express';
import userController from '../api/controller/userController.js';
import authMiddleware from '../common/auth.js';

const router = express.Router();

// Public routes
router.post('/signup', userController.userSignup);
router.post('/login', userController.userLogin);

// Protected routes
router.use(authMiddleware.verifyToken); 
router.get('/profile', userController.getProfile);

export default router;
