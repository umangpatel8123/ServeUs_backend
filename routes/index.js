import express from 'express';
import userRouter from './user.js';
import authRouter from './auth.js';
import providerRouter from './provider.js';

const router = express.Router();

router.use(userRouter, authRouter, providerRouter);

export default router;
