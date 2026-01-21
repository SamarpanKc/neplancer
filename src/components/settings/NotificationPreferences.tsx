"use client"

import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Mail, Briefcase, Star } from "lucide-react";

export default function NotificationPreferences() {
  const { user } = useAuth();
  
  const [emailNotifications, setEmailNotifications] = useState({
    accountActivity: true,
    newMessages: true,
    projectUpdates: true,
    paymentAlerts: true,
    weeklyDigest: false,
    marketingEmails: false
  });

  const [pushNotifications, setPushNotifications] = useState({
    newMessages: true,
    projectUpdates: true,
    paymentAlerts: true,
    proposals: true
  });

  // Role-specific notifications
  const [freelancerNotifications, setFreelancerNotifications] = useState({
    newJobMatches: true,
    invitationToApply: true,
    proposalViewed: true,
    proposalAccepted: true,
    proposalRejected: false,
    contractStarted: true,
    milestoneCompleted: true,
    reviewReceived: true
  });

  const [clientNotifications, setClientNotifications] = useState({
    newProposals: true,
    freelancerAvailable: false,
    milestoneSubmitted: true,
    workDelivered: true,
    contractCompleted: true,
    reminderToReview: true
  });

  const handleSaveEmail = () => {
    // TODO: Save email notification preferences
    alert("Email notification preferences saved");
  };

  const handleSavePush = () => {
    // TODO: Save push notification preferences
    alert("Push notification preferences saved");
  };

  const handleSaveRoleSpecific = () => {
    // TODO: Save role-specific notification preferences
    alert("Notification preferences saved");
  };

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Mail className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Email Notifications</h2>
            <p className="text-sm text-gray-600">Manage email notifications you receive</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <h3 className="font-medium text-gray-900">Account Activity</h3>
              <p className="text-sm text-gray-500">Security alerts, password changes, login notifications</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={emailNotifications.accountActivity}
                onChange={(e) => setEmailNotifications({...emailNotifications, accountActivity: e.target.checked})}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-[#0CF574]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0CF574]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <h3 className="font-medium text-gray-900">New Messages</h3>
              <p className="text-sm text-gray-500">Get notified when you receive a new message</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={emailNotifications.newMessages}
                onChange={(e) => setEmailNotifications({...emailNotifications, newMessages: e.target.checked})}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-[#0CF574]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0CF574]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <h3 className="font-medium text-gray-900">Project Updates</h3>
              <p className="text-sm text-gray-500">Updates about your active projects and contracts</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={emailNotifications.projectUpdates}
                onChange={(e) => setEmailNotifications({...emailNotifications, projectUpdates: e.target.checked})}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-[#0CF574]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0CF574]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <h3 className="font-medium text-gray-900">Payment Alerts</h3>
              <p className="text-sm text-gray-500">Notifications about payments, withdrawals, and invoices</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={emailNotifications.paymentAlerts}
                onChange={(e) => setEmailNotifications({...emailNotifications, paymentAlerts: e.target.checked})}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-[#0CF574]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0CF574]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <h3 className="font-medium text-gray-900">Weekly Digest</h3>
              <p className="text-sm text-gray-500">Weekly summary of your activity and opportunities</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={emailNotifications.weeklyDigest}
                onChange={(e) => setEmailNotifications({...emailNotifications, weeklyDigest: e.target.checked})}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-[#0CF574]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0CF574]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <h3 className="font-medium text-gray-900">Marketing Emails</h3>
              <p className="text-sm text-gray-500">Tips, feature updates, and special offers from Neplancer</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={emailNotifications.marketingEmails}
                onChange={(e) => setEmailNotifications({...emailNotifications, marketingEmails: e.target.checked})}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-[#0CF574]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0CF574]"></div>
            </label>
          </div>
        </div>

        <div className="mt-6">
          <Button onClick={handleSaveEmail} className="bg-foreground hover:bg-gray-800">
            Save Email Preferences
          </Button>
        </div>
      </Card>

      {/* Push Notifications */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Bell className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Push Notifications</h2>
            <p className="text-sm text-gray-600">Real-time browser and mobile notifications</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <h3 className="font-medium text-gray-900">New Messages</h3>
              <p className="text-sm text-gray-500">Instant notification when you receive a message</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={pushNotifications.newMessages}
                onChange={(e) => setPushNotifications({...pushNotifications, newMessages: e.target.checked})}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-[#0CF574]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0CF574]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <h3 className="font-medium text-gray-900">Project Updates</h3>
              <p className="text-sm text-gray-500">Important updates about your projects</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={pushNotifications.projectUpdates}
                onChange={(e) => setPushNotifications({...pushNotifications, projectUpdates: e.target.checked})}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-[#0CF574]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0CF574]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <h3 className="font-medium text-gray-900">Payment Alerts</h3>
              <p className="text-sm text-gray-500">Instant notifications for payments and transactions</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={pushNotifications.paymentAlerts}
                onChange={(e) => setPushNotifications({...pushNotifications, paymentAlerts: e.target.checked})}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-[#0CF574]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0CF574]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <h3 className="font-medium text-gray-900">Proposals</h3>
              <p className="text-sm text-gray-500">Notifications about proposal updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={pushNotifications.proposals}
                onChange={(e) => setPushNotifications({...pushNotifications, proposals: e.target.checked})}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-[#0CF574]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0CF574]"></div>
            </label>
          </div>
        </div>

        <div className="mt-6">
          <Button onClick={handleSavePush} className="bg-foreground hover:bg-gray-800">
            Save Push Preferences
          </Button>
        </div>
      </Card>

      {/* Freelancer-specific notifications */}
      {user?.role === 'freelancer' && (
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <Briefcase className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Job & Project Notifications</h2>
              <p className="text-sm text-gray-600">Manage freelancer-specific notifications</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <h3 className="font-medium text-gray-900">New Job Matches</h3>
                <p className="text-sm text-gray-500">Jobs matching your skills and preferences</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={freelancerNotifications.newJobMatches}
                  onChange={(e) => setFreelancerNotifications({...freelancerNotifications, newJobMatches: e.target.checked})}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-[#0CF574]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0CF574]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <h3 className="font-medium text-gray-900">Invitation to Apply</h3>
                <p className="text-sm text-gray-500">Clients inviting you to apply for their jobs</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={freelancerNotifications.invitationToApply}
                  onChange={(e) => setFreelancerNotifications({...freelancerNotifications, invitationToApply: e.target.checked})}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-[#0CF574]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0CF574]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <h3 className="font-medium text-gray-900">Proposal Viewed</h3>
                <p className="text-sm text-gray-500">When a client views your proposal</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={freelancerNotifications.proposalViewed}
                  onChange={(e) => setFreelancerNotifications({...freelancerNotifications, proposalViewed: e.target.checked})}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-[#0CF574]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0CF574]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <h3 className="font-medium text-gray-900">Proposal Accepted</h3>
                <p className="text-sm text-gray-500">When your proposal is accepted</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={freelancerNotifications.proposalAccepted}
                  onChange={(e) => setFreelancerNotifications({...freelancerNotifications, proposalAccepted: e.target.checked})}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-[#0CF574]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0CF574]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <h3 className="font-medium text-gray-900">Proposal Rejected</h3>
                <p className="text-sm text-gray-500">When your proposal is declined</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={freelancerNotifications.proposalRejected}
                  onChange={(e) => setFreelancerNotifications({...freelancerNotifications, proposalRejected: e.target.checked})}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-[#0CF574]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0CF574]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <h3 className="font-medium text-gray-900">Review Received</h3>
                <p className="text-sm text-gray-500">When a client leaves you a review</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={freelancerNotifications.reviewReceived}
                  onChange={(e) => setFreelancerNotifications({...freelancerNotifications, reviewReceived: e.target.checked})}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-[#0CF574]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0CF574]"></div>
              </label>
            </div>
          </div>

          <div className="mt-6">
            <Button onClick={handleSaveRoleSpecific} className="bg-foreground hover:bg-gray-800">
              Save Preferences
            </Button>
          </div>
        </Card>
      )}

      {/* Client-specific notifications */}
      {user?.role === 'client' && (
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Star className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Project Notifications</h2>
              <p className="text-sm text-gray-600">Manage client-specific notifications</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <h3 className="font-medium text-gray-900">New Proposals</h3>
                <p className="text-sm text-gray-500">When freelancers submit proposals to your jobs</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={clientNotifications.newProposals}
                  onChange={(e) => setClientNotifications({...clientNotifications, newProposals: e.target.checked})}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-[#0CF574]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0CF574]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <h3 className="font-medium text-gray-900">Freelancer Available</h3>
                <p className="text-sm text-gray-500">Recommended freelancers become available for hire</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={clientNotifications.freelancerAvailable}
                  onChange={(e) => setClientNotifications({...clientNotifications, freelancerAvailable: e.target.checked})}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-[#0CF574]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0CF574]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <h3 className="font-medium text-gray-900">Milestone Submitted</h3>
                <p className="text-sm text-gray-500">Freelancer submits work for milestone approval</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={clientNotifications.milestoneSubmitted}
                  onChange={(e) => setClientNotifications({...clientNotifications, milestoneSubmitted: e.target.checked})}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-[#0CF574]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0CF574]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <h3 className="font-medium text-gray-900">Work Delivered</h3>
                <p className="text-sm text-gray-500">Freelancer delivers completed work</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={clientNotifications.workDelivered}
                  onChange={(e) => setClientNotifications({...clientNotifications, workDelivered: e.target.checked})}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-[#0CF574]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0CF574]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <h3 className="font-medium text-gray-900">Reminder to Review</h3>
                <p className="text-sm text-gray-500">Reminders to leave feedback after project completion</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={clientNotifications.reminderToReview}
                  onChange={(e) => setClientNotifications({...clientNotifications, reminderToReview: e.target.checked})}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-[#0CF574]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0CF574]"></div>
              </label>
            </div>
          </div>

          <div className="mt-6">
            <Button onClick={handleSaveRoleSpecific} className="bg-foreground hover:bg-gray-800">
              Save Preferences
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
