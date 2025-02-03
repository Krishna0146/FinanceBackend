import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Set up the transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,             // Your Gmail address
    pass: process.env.EMAIL_PASSWORD     // Your Gmail App Password or regular password
  }
});

// Function to send OTP email
export const sendOTP = async (email, otp) => {
    console.log(otp)
  const mailOptions = {
    from: process.env.EMAIL,               // Sender's email
    to: email,                             // Recipient's email
    subject: 'Your OTP Code',              // Email subject
    text: `Your OTP for authentication is: ${otp}. It is valid for 5 minutes.` // Email content
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP sent successfully to", email);  // Log success
  } catch (error) {
    console.error("Error sending OTP:", error);      // Log errors
  }
};