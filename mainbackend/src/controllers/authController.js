import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOTP } from "../config/mailer.js";
import { generateOTP } from "../utils/otpGenerator.js";

// 1. Register user
export const register = async (req, res) => {
    try {
        const {
            username,
            email,
            password,
            age,
            gender,
            location,
            occupation,
            education // education here is a value like "school", "highSchool", etc.
        } = req.body;
        // Validate the education field (it should be one of the predefined values)
        const validEducationValues = ['school', 'highSchool', 'underGraduate', 'postGraduate'];

        if (!validEducationValues.includes(education)) {
            return res.status(400).json({
                message: "Invalid education level. It must be one of: school, highSchool, underGraduate, postGraduate."
            });
        }

        // Validate the gender field (it should be one of the predefined values)
        const validGenderValues = ['male', 'female', 'others'];

        if (!validGenderValues.includes(gender)) {
            return res.status(400).json({
                message: "Invalid gender. It must be one of: male, female, others."
            });
        }
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        // Encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user object with the provided data
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            age,
            gender, // Save gender directly
            location,
            occupation,
            education // Save the education level directly
        });

        // Save the new user in the database
        await newUser.save();
        res.status(201).json({ message: "User registered successfully",username });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Send OTP after email and password verification
export const sendOtpLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });
        // Verify password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid password" });
        }
        // Generate OTP and send to email
        const otp = generateOTP();
        user.otp = otp;
        user.otpExpires = Date.now() + 300000; // OTP expires in 5 minutes
        await user.save();
        await sendOTP(email, otp); // Send OTP to email
        res.json({ message: "OTP sent to email" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Login with OTP
export const login = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        console.log(otp)
        if (!user) return res.status(400).json({ message: "User not found" });

        // Verify OTP
        if (!user.otp || user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Clear OTP fields
        user.otpExpires = null;
        await user.save();

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "Login successful", token, user: {
            email: user.email,
            username: user.username,  // Assuming 'username' is a field in your User model
            // You can add more fields as needed (e.g., 'fullName', 'profilePic', etc.)
        } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. Forgot Password - Reset via OTP
export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.otp !== otp || user.otpExpires < Date.now())
            return res.status(400).json({ message: "Invalid or expired OTP" });

        user.password = await bcrypt.hash(newPassword, 10);
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        res.json({ message: "Password reset successful" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 5. Reset Send OTP (for forgot password)
export const resetSendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        // Find the user based on the provided email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        // Generate a new OTP for password reset
        const otp = generateOTP();
        user.otp = otp;
        user.otpExpires = Date.now() + 300000; // OTP expires in 5 minutes
        await user.save();
        // Send the OTP to the user's email
        await sendOTP(email, otp); // You may need to configure your mailer to send OTP
        res.json({ message: "OTP sent to email for password reset" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};