import express from 'express';
import {createProvider, getProvider} from '../controllers/provider.js';

const router = express.Router();

router.post('/create-provider', createProvider);
router.post('/get-provider', getProvider);

export default router;
