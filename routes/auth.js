import express from 'express';
import {signup, login, sendOtp, verifyOtp} from '../controllers/auth.js';

const router = express.Router();

router.post('/sendotp', sendOtp);
router.post('/verifyotp', verifyOtp);

router.post('/signup', signup);
router.post('/login', login);

export default router;
