'use server';

import { getMaxListeners } from 'events';
import nodemailer from 'nodemailer';

// 1. Create a transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,       // your Gmail address
    pass: process.env.GMAIL_APP_PASSWORD // Gmail App Password
  }
});

// 2. Send an email
export async function sendEmail(to: string, subject: string, htmlContent: string) {
  try {
    await transporter.sendMail({
      from: `"NepLancer" <${process.env.GMAIL_USER}>`,
      to,               
      subject,           
      html: htmlContent,
    });
    console.log(`Email sent to ${to}`); // Fixed syntax error here
  } catch (err) {
    console.error('Error sending email:', err);
    throw err; // Throw error so it can be caught by caller
  }
}

