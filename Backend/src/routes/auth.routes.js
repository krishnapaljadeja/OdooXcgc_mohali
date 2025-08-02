import express from "express"
import { getProfile, loginUser, logoutUser, signup } from "../controllers/auth.controller.js";

const router = express.Router();

router.post('/login', loginUser);
router.post('/signup' , signup);
router.post('/logout' , logoutUser);
router.get('/get-profile/:userId' , getProfile);

export default router