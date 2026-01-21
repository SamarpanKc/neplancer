"use client"

import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2, Download, Lock } from "lucide-react";

export default function DeleteAccount() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [additionalFeedback, setAdditionalFeedback] = useState("");

  const deleteReasons = [
    "I found another platform",
    "Not getting enough work/clients",
    "Too expensive",
    "Difficult to use",
    "Privacy concerns",
    "No longer need the service",
    "Other"
  ];

  const handleDeleteAccount = async () => {
    if (confirmText !== "DELETE") {
      alert("Please type DELETE to confirm");
      return;
    }

    if (!selectedReason) {
      alert("Please select a reason for deleting your account");
      return;
    }

    setIsDeleting(true);
    try {
      // TODO: Call API to delete account
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Log out and redirect
      await signOut();
      router.push('/');
      alert("Your account has been deleted successfully");
    } catch (error) {
      console.error("Failed to delete account:", error);
      alert("Failed to delete account. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownloadData = () => {
    // TODO: Implement data download before deletion
    alert("Your data download will begin shortly. Please wait for the email.");
  };

  return (
    <div className="space-y-6">
      {/* Warning Card */}
      <Card className="p-6 bg-red-50 border-red-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-red-900 mb-2">Delete Account</h2>
            <p className="text-sm text-red-800">
              This action is permanent and cannot be undone. Once deleted, all your data will be removed from our servers.
            </p>
          </div>
        </div>
      </Card>

      {/* What will be deleted */}
      <Card className="p-6">
        <h3 className="font-bold text-gray-900 mb-4">What will be deleted:</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Trash2 className="w-3 h-3 text-red-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Profile Information</h4>
              <p className="text-sm text-gray-600">Your name, bio, profile picture, and all personal details</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Trash2 className="w-3 h-3 text-red-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Work History</h4>
              <p className="text-sm text-gray-600">
                {user?.role === 'freelancer' 
                  ? 'All your proposals, completed projects, and reviews' 
                  : 'All posted jobs, hired freelancers, and project history'}
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Trash2 className="w-3 h-3 text-red-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Messages</h4>
              <p className="text-sm text-gray-600">All conversations and attachments</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Trash2 className="w-3 h-3 text-red-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Payment Information</h4>
              <p className="text-sm text-gray-600">
                {user?.role === 'freelancer' 
                  ? 'Bank account details and transaction history' 
                  : 'Saved payment methods and billing history'}
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Trash2 className="w-3 h-3 text-red-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Account Settings</h4>
              <p className="text-sm text-gray-600">All preferences and customizations</p>
            </div>
          </li>
        </ul>
      </Card>

      {/* Before you go */}
      <Card className="p-6">
        <h3 className="font-bold text-gray-900 mb-4">Before you go...</h3>
        
        <div className="space-y-4">
          {/* Download Data */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1">Download Your Data</h4>
                <p className="text-sm text-gray-600">
                  Get a copy of all your data before deleting your account. This includes your profile, projects, messages, and more.
                </p>
              </div>
              <Button onClick={handleDownloadData} variant="outline" className="ml-4">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>

          {/* Alternative: Deactivate */}
          <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
            <h4 className="font-medium text-gray-900 mb-1">Consider Deactivating Instead</h4>
            <p className="text-sm text-gray-700 mb-3">
              If you&apos;re not sure about deleting, you can deactivate your account temporarily. Your data will be preserved and you can reactivate anytime.
            </p>
            <Button variant="outline" className="bg-white">
              Deactivate Account
            </Button>
          </div>

          {/* Contact Support */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-1">Need Help?</h4>
            <p className="text-sm text-gray-600 mb-3">
              If you&apos;re experiencing issues, our support team is here to help. Contact us before deleting your account.
            </p>
            <Button variant="outline">
              Contact Support
            </Button>
          </div>
        </div>
      </Card>

      {/* Deletion Process */}
      {!showConfirmation ? (
        <Card className="p-6">
          <h3 className="font-bold text-gray-900 mb-4">Start Account Deletion</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Why are you deleting your account? *
              </label>
              <select
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent"
              >
                <option value="">Select a reason</option>
                {deleteReasons.map((reason) => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Feedback (Optional)
              </label>
              <textarea
                value={additionalFeedback}
                onChange={(e) => setAdditionalFeedback(e.target.value)}
                rows={4}
                placeholder="Help us improve by sharing more details..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent"
              />
            </div>

            <div className="pt-4">
              <Button 
                onClick={() => setShowConfirmation(true)}
                disabled={!selectedReason}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Continue to Delete Account
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-6 border-2 border-red-300">
          <div className="flex items-start gap-3 mb-6">
            <div className="p-2 bg-red-100 rounded-lg">
              <Lock className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-bold text-red-900 mb-1">Final Confirmation</h3>
              <p className="text-sm text-red-800">
                This is your last chance. Are you absolutely sure you want to delete your account?
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Checklist */}
            <div className="p-4 bg-gray-50 rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="understand1" className="rounded" />
                <label htmlFor="understand1" className="text-sm text-gray-700">
                  I understand this action is permanent and cannot be undone
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="understand2" className="rounded" />
                <label htmlFor="understand2" className="text-sm text-gray-700">
                  I have downloaded my data or don&apos;t need it
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="understand3" className="rounded" />
                <label htmlFor="understand3" className="text-sm text-gray-700">
                  I understand all my {user?.role === 'freelancer' ? 'work history and earnings' : 'posted jobs and payments'} will be deleted
                </label>
              </div>
            </div>

            {/* Confirmation Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type <span className="font-bold text-red-600">DELETE</span> to confirm
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Type DELETE here"
                className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleDeleteAccount}
                disabled={confirmText !== "DELETE" || isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isDeleting ? "Deleting..." : "Delete My Account Permanently"}
              </Button>
              <Button
                onClick={() => {
                  setShowConfirmation(false);
                  setConfirmText("");
                }}
                variant="outline"
                disabled={isDeleting}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Legal Notice */}
      <Card className="p-6 bg-gray-50">
        <h3 className="font-medium text-gray-900 mb-2">Legal Notice</h3>
        <p className="text-sm text-gray-600">
          After account deletion, we may retain certain information as required by law or for legitimate business purposes. 
          Any outstanding payments or contractual obligations must be settled before deletion. 
          For more information, please review our <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a> and <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>.
        </p>
      </Card>
    </div>
  );
}
