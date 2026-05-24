import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the root .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// In-memory store for OTPs (In a real app, use Redis or a database)
// Format: { 'email@example.com': { otp: '123456', expiresAt: 1234567890 } }
const otpStore = {};

// Create Nodemailer transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

app.post('/api/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('⚠️ WARNING: EMAIL_USER or EMAIL_PASS not set in .env. Faking OTP send.');
      // For development when email isn't set up yet, still generate the OTP
      const otp = generateOTP();
      otpStore[email] = {
        otp,
        expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      };
      console.log(`[DEV MODE] OTP for ${email} is: ${otp}`);
      return res.json({ success: true, message: 'OTP sent (Dev Mode)' });
    }

    const otp = generateOTP();
    
    // Store OTP
    otpStore[email] = {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    };

    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Campus Pass" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Campus Pass Login Code',
      text: `Your login code is: ${otp}\n\nThis code will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #4f46e5;">Campus Pass</h2>
          <p>Hello,</p>
          <p>Your one-time password (OTP) for login is:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #1f2937;">
            ${otp}
          </div>
          <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">This code will expire in 10 minutes. If you didn't request this code, you can safely ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Successfully sent OTP to ${email}`);
    
    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
});

app.post('/api/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  
  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and OTP are required' });
  }
  
  const storedData = otpStore[email];
  
  if (!storedData) {
    return res.status(400).json({ success: false, message: 'No OTP requested for this email' });
  }
  
  if (Date.now() > storedData.expiresAt) {
    delete otpStore[email];
    return res.status(400).json({ success: false, message: 'OTP has expired' });
  }
  
  if (storedData.otp === otp) {
    // Success! Clean up the used OTP
    delete otpStore[email];
    return res.json({ success: true, message: 'OTP verified successfully' });
  } else {
    return res.status(400).json({ success: false, message: 'Invalid OTP' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
