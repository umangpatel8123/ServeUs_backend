import express from 'express';
import {
  createProvider,
  getProvider,
  acceptRequest,
  rejectRequest,
  getRequests,
} from '../controllers/provider.js';

const router = express.Router();

router.post('/create-provider', createProvider);
router.post('/get-provider', getProvider);

router.post('/acceptRequest', acceptRequest);
router.post('/rejectRequest', rejectRequest);
router.post('/getRequests', getRequests);

export default router;
