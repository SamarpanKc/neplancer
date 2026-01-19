import { createClient } from '@/lib/supabse/server';

// Notification types and their icons/colors
export const NOTIFICATION_TYPES = {
  // Contract related
  contract_received: { icon: '📄', color: 'blue' },
  contract_signed: { icon: '✍️', color: 'green' },
  contract_active: { icon: '🎉', color: 'green' },
  contract_edited: { icon: '📝', color: 'amber' },
  work_submitted: { icon: '📋', color: 'blue' },
  work_rejected: { icon: '🔄', color: 'yellow' },
  payment_released: { icon: '💰', color: 'green' },
  
  // Milestone related
  milestone_submitted: { icon: '📋', color: 'blue' },
  milestone_approved: { icon: '💰', color: 'green' },
  milestone_rejected: { icon: '🔄', color: 'yellow' },
  
  // Job related
  job_posted: { icon: '📢', color: 'blue' },
  job_application: { icon: '👤', color: 'green' },
  application_accepted: { icon: '✅', color: 'green' },
  application_rejected: { icon: '❌', color: 'red' },
  deadline_approaching: { icon: '⏰', color: 'yellow' },
  
  // Proposal related
  proposal_received: { icon: '📝', color: 'blue' },
  proposal_accepted: { icon: '🎉', color: 'green' },
  proposal_rejected: { icon: '❌', color: 'red' },
  
  // Profile & Settings
  bank_details_updated: { icon: '✅', color: 'green' },
  profile_updated: { icon: '✅', color: 'green' },
  
  // Communication
  new_message: { icon: '💬', color: 'blue' },
  
  // System
  system_alert: { icon: '⚠️', color: 'red' },
};

/**
 * Send a notification to a user
 */
export async function sendNotification(params: {
  user_id: string;
  type: keyof typeof NOTIFICATION_TYPES;
  title: string;
  message: string;
  link?: string;
}) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: params.user_id,
        type: params.type,
        title: params.title,
        message: params.message,
        link: params.link || null,
        read: false,
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error sending notification:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending notification:', error);
    return false;
  }
}

/**
 * Send notification when a job is posted
 */
export async function notifyJobPosted(jobId: string, jobTitle: string, clientId: string, clientProfileId: string) {
  // This could be sent to all freelancers in the future
  // For now, just notify the client
  return sendNotification({
    user_id: clientProfileId,
    type: 'job_posted',
    title: 'Job Posted Successfully! 📢',
    message: `Your job "${jobTitle}" has been posted and is now visible to freelancers.`,
    link: `/client/jobs/${jobId}`
  });
}

/**
 * Send notification when someone applies to a job
 */
export async function notifyJobApplication(params: {
  clientProfileId: string;
  freelancerName: string;
  jobTitle: string;
  jobId: string;
  proposalId: string;
}) {
  return sendNotification({
    user_id: params.clientProfileId,
    type: 'job_application',
    title: 'New Application Received! 👤',
    message: `${params.freelancerName} has applied to your job "${params.jobTitle}".`,
    link: `/client/jobs/${params.jobId}/proposals`
  });
}

/**
 * Send notification when application is accepted
 */
export async function notifyApplicationAccepted(params: {
  freelancerProfileId: string;
  jobTitle: string;
  jobId: string;
}) {
  return sendNotification({
    user_id: params.freelancerProfileId,
    type: 'application_accepted',
    title: 'Application Accepted! 🎉',
    message: `Congratulations! Your application for "${params.jobTitle}" has been accepted.`,
    link: `/freelancer/proposals`
  });
}

/**
 * Send notification when application is rejected
 */
export async function notifyApplicationRejected(params: {
  freelancerProfileId: string;
  jobTitle: string;
}) {
  return sendNotification({
    user_id: params.freelancerProfileId,
    type: 'application_rejected',
    title: 'Application Update',
    message: `Your application for "${params.jobTitle}" was not selected this time.`,
  });
}

/**
 * Send notification for approaching deadline
 */
export async function notifyDeadlineApproaching(params: {
  userProfileId: string;
  contractTitle: string;
  contractId: string;
  daysLeft: number;
}) {
  return sendNotification({
    user_id: params.userProfileId,
    type: 'deadline_approaching',
    title: `Deadline Approaching! ⏰`,
    message: `Contract "${params.contractTitle}" is due in ${params.daysLeft} day${params.daysLeft > 1 ? 's' : ''}.`,
    link: `/contracts/${params.contractId}`
  });
}

/**
 * Send notification when proposal is received
 */
export async function notifyProposalReceived(params: {
  clientProfileId: string;
  freelancerName: string;
  jobTitle: string;
  proposalAmount: number;
  jobId: string;
}) {
  return sendNotification({
    user_id: params.clientProfileId,
    type: 'proposal_received',
    title: 'New Proposal Received! 📝',
    message: `${params.freelancerName} sent a proposal for "${params.jobTitle}" ($${params.proposalAmount}).`,
    link: `/client/jobs/${params.jobId}/proposals`
  });
}

/**
 * Send notification when proposal is accepted
 */
export async function notifyProposalAccepted(params: {
  freelancerProfileId: string;
  jobTitle: string;
  contractId: string;
}) {
  return sendNotification({
    user_id: params.freelancerProfileId,
    type: 'proposal_accepted',
    title: 'Proposal Accepted! 🎉',
    message: `Your proposal for "${params.jobTitle}" has been accepted! A contract has been created.`,
    link: `/contracts/${params.contractId}`
  });
}

/**
 * Send notification when proposal is rejected
 */
export async function notifyProposalRejected(params: {
  freelancerProfileId: string;
  jobTitle: string;
}) {
  return sendNotification({
    user_id: params.freelancerProfileId,
    type: 'proposal_rejected',
    title: 'Proposal Update',
    message: `Your proposal for "${params.jobTitle}" was not selected.`,
  });
}
