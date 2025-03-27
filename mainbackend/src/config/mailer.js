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
  console.log(otp);
  const mailOptions = {
      from: process.env.EMAIL,              
      to: email,                             
      subject: 'InvestBot OTP Verification',              
      text: `Dear User, 
      
Your one-time password (OTP) for InvestBot authentication is: ${otp}.

For security reasons, this OTP is valid for only 5 minutes. Please do not share this code with anyone.

If you did not request this, please ignore this email.

Best regards,  
InvestBot Security Team`
  };
  try {
      await transporter.sendMail(mailOptions);
      console.log("OTP sent successfully to", email);
  } catch (error) {
      console.error("Error sending OTP:", error);
  }
};
