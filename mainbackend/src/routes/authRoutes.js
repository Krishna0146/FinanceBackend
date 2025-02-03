import express from "express";
import { register, login, sendOtpLogin, resetPassword,resetSendOtp,getScenarioById,getAllScenarios } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/send-otp", sendOtpLogin);
router.post("/login", login);
router.post("/forgot-password", resetPassword);
router.post("/resetotp", resetSendOtp);
router.get("/scenarios", getAllScenarios);
router.get("/scenarios/:id", getScenarioById);

export default router;
