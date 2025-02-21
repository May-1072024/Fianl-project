import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Validate email configuration
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email configuration is missing in .env file');
}

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});


// Function to send verification email
export const sendVerificationEmail = async (email, verificationLink) => {
    if (!process.env.EMAIL_USER) {
        throw new Error('EMAIL_USER is not defined in environment variables');
    }
    
    const mailOptions = {
        from: `"Timeless Music" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Email Verification - Timeless Music',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #333;">Verify Your Email Address</h2>
                <p>Please click the button below to verify your email address:</p>
                <a href="${verificationLink}" 
                   style="display: inline-block; padding: 10px 20px; background-color: #1DB954; color: white; text-decoration: none; border-radius: 5px;">
                    Verify Email
                </a>
                <p style="margin-top: 20px; color: #666;">If you didn't create an account with Timeless Music, please ignore this email.</p>
            </div>
        `
    };


    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully');
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Failed to send verification email');
    }
};
