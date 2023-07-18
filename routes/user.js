import express from 'express';
import {availableRoutes} from '../controllers/user.js';
// import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// router.get("/", isAuthenticated, availableRoutes);

export default router;
