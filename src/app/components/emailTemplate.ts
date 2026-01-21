// emailTemplate.ts



export function verificationEmail(username: string, token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2>Hello ${username},</h2>
      <p>Thanks for signing up for NepLancer! Please verify your email by clicking the link below:</p>
      <a href="${baseUrl}/check?token=${token}" 
         style="display:inline-block;padding:12px 24px;background:#0CF574;color:#000;text-decoration:none;border-radius:5px;font-weight:bold;margin:20px 0;">
        Verify Email
      </a>
      <p style="color: #666;">Or copy this link: ${baseUrl}/check?token=${token}</p>
      <p style="color: #666; font-size: 14px;">If you did not sign up, please ignore this email.</p>
    </div>
  `;
}

export function forgotPasswordEmailTemplate(username: string, token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>Hello ${username},</h2>
      <p>We received a request to reset your password. Click the link below:</p>
      <a href="${baseUrl}/reset-password?token=${token}" 
         style="display:inline-block;padding:10px 20px;background:#FF5722;color:white;text-decoration:none;border-radius:5px;">
        Reset Password
      </a>
      <p>If you did not request a password reset, please ignore this email.</p>
    </div>
  `;
}
