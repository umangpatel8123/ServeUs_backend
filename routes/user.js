import express from 'express';
import {} from '../controllers/user.js';
import {isAuthenticated} from '../middlewares/auth.js';
import {storeLocation, nearByService} from '../controllers/user.js';

const router = express.Router();

router.put('/userLocation', isAuthenticated, storeLocation);
router.post('/nearestService', nearByService);

router.post('/sendRequest');

export default router;
