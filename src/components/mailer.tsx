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

export const verificationEmail = (name: string, verificationLink: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f7; padding: 0; margin: 0; }
    .container { max-width: 600px; margin: 50px auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);}
    h1 { color: #4CAF50; }
    p { line-height: 1.6; }
    .button { display: inline-block; padding: 12px 20px; margin-top: 20px; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold; }
    .footer { margin-top: 30px; font-size: 12px; color: #888; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Hello ${name},</h1>
    <p>Thanks for signing up! Please verify your email by clicking the button below:</p>
    <a href="${verificationLink}" class="button">Verify Email</a>
    <p>If the button doesn't work, copy and paste the following link into your browser:</p>
    <p><a href="${verificationLink}">${verificationLink}</a></p>
    <p class="footer">NepLancer Team</p>
  </div>
</body>
</html>
`;

export const resetPasswordEmail = (name: string, resetLink: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f7; padding: 0; margin: 0; }
    .container { max-width: 600px; margin: 50px auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);}
    h1 { color: #FF5722; }
    p { line-height: 1.6; }
    .button { display: inline-block; padding: 12px 20px; margin-top: 20px; background-color: #FF5722; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold; }
    .footer { margin-top: 30px; font-size: 12px; color: #888; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Hello ${name},</h1>
    <p>We received a request to reset your password. Click the button below to reset it:</p>
    <a href="${resetLink}" class="button">Reset Password</a>
    <p>If you didn't request this, you can safely ignore this email.</p>
    <p class="footer">NepLancer Team</p>
  </div>
</body>
</html>
`;
