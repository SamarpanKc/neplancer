import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('Missing RESEND_API_KEY environment variable');
}

export const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@neplancer.com';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Email templates
export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
}

// Welcome email for new users
export function getWelcomeEmail(name: string, email: string): EmailTemplate {
  return {
    to: email,
    subject: 'Welcome to Neplancer! 🎉',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0CF574 0%, #00D9A3 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #0CF574; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Neplancer!</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>Thank you for joining Neplancer - the premier freelancing platform connecting talented professionals with exciting opportunities.</p>
              <p>Here's what you can do next:</p>
              <ul>
                <li>Complete your profile to stand out</li>
                <li>Browse available projects</li>
                <li>Connect with clients or freelancers</li>
                <li>Start building your reputation</li>
              </ul>
              <a href="${APP_URL}/dashboard" class="button">Go to Dashboard</a>
              <p>If you have any questions, feel free to reach out to our support team.</p>
              <p>Best regards,<br>The Neplancer Team</p>
            </div>
            <div class="footer">
              <p>© 2025 Neplancer. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };
}

// Proposal received email for clients
export function getProposalReceivedEmail(
  clientName: string,
  clientEmail: string,
  jobTitle: string,
  freelancerName: string,
  proposalId: string
): EmailTemplate {
  return {
    to: clientEmail,
    subject: `New Proposal for "${jobTitle}"`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #0CF574; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #0CF574; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            .highlight { background: #fff; padding: 15px; border-left: 4px solid #0CF574; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>📨 New Proposal Received!</h2>
            </div>
            <div class="content">
              <p>Hi ${clientName},</p>
              <p>Good news! <strong>${freelancerName}</strong> has submitted a proposal for your job posting.</p>
              <div class="highlight">
                <strong>Job:</strong> ${jobTitle}
              </div>
              <p>Review their proposal to see if they're the right fit for your project.</p>
              <a href="${APP_URL}/jobs/proposals/${proposalId}" class="button">View Proposal</a>
              <p>Best regards,<br>The Neplancer Team</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };
}

// Proposal accepted email for freelancers
export function getProposalAcceptedEmail(
  freelancerName: string,
  freelancerEmail: string,
  jobTitle: string,
  contractId: string
): EmailTemplate {
  return {
    to: freelancerEmail,
    subject: `🎉 Your Proposal Was Accepted!`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0CF574 0%, #00D9A3 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #0CF574; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            .success { background: #e8f8f0; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Congratulations!</h1>
            </div>
            <div class="content">
              <p>Hi ${freelancerName},</p>
              <div class="success">
                <h2 style="color: #0CF574; margin: 0;">Your proposal was accepted!</h2>
              </div>
              <p>The client has accepted your proposal for <strong>"${jobTitle}"</strong>.</p>
              <p>Next steps:</p>
              <ul>
                <li>Review the contract details</li>
                <li>Set up milestones with the client</li>
                <li>Start working on the project</li>
                <li>Communicate regularly with your client</li>
              </ul>
              <a href="${APP_URL}/contracts/${contractId}" class="button">View Contract</a>
              <p>Good luck with your project!</p>
              <p>Best regards,<br>The Neplancer Team</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };
}

// Milestone approved email
export function getMilestoneApprovedEmail(
  freelancerName: string,
  freelancerEmail: string,
  milestoneTitle: string,
  amount: number,
  milestoneId: string
): EmailTemplate {
  return {
    to: freelancerEmail,
    subject: `💰 Milestone Approved: ${milestoneTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #0CF574; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .amount { font-size: 36px; color: #0CF574; font-weight: bold; text-align: center; margin: 20px 0; }
            .button { display: inline-block; padding: 12px 30px; background: #0CF574; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>💰 Milestone Approved!</h2>
            </div>
            <div class="content">
              <p>Hi ${freelancerName},</p>
              <p>Great work! Your milestone <strong>"${milestoneTitle}"</strong> has been approved.</p>
              <div class="amount">$${amount.toFixed(2)}</div>
              <p style="text-align: center; color: #666;">Payment will be released to your account within 2-3 business days.</p>
              <a href="${APP_URL}/milestones/${milestoneId}" class="button">View Milestone</a>
              <p>Keep up the excellent work!</p>
              <p>Best regards,<br>The Neplancer Team</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };
}

// Password reset email
export function getPasswordResetEmail(
  email: string,
  resetToken: string
): EmailTemplate {
  const resetUrl = `${APP_URL}/auth/reset-password?token=${resetToken}`;

  return {
    to: email,
    subject: 'Reset Your Password',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #333; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #0CF574; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            .warning { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🔐 Password Reset Request</h2>
            </div>
            <div class="content">
              <p>You requested to reset your password for your Neplancer account.</p>
              <p>Click the button below to reset your password:</p>
              <a href="${resetUrl}" class="button">Reset Password</a>
              <div class="warning">
                <strong>Security Notice:</strong> This link expires in 1 hour. If you didn't request this reset, please ignore this email.
              </div>
              <p>For security reasons, never share this link with anyone.</p>
              <p>Best regards,<br>The Neplancer Team</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };
}

// Send email function
export async function sendEmail(template: EmailTemplate) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      ...template,
    });

    if (error) {
      console.error('Email send error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email send exception:', error);
    return { success: false, error };
  }
}

// Batch send emails
export async function sendBulkEmails(templates: EmailTemplate[]) {
  try {
    const results = await Promise.allSettled(
      templates.map(template => sendEmail(template))
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    return {
      total: templates.length,
      successful,
      failed,
      results,
    };
  } catch (error) {
    console.error('Bulk email send error:', error);
    return { success: false, error };
  }
}
