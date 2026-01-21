"use client"

import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Upload, FileText, Shield, Mail, Phone, CreditCard, Award } from "lucide-react";

export default function Verification() {
  const { user } = useAuth();
  const [verificationStatus] = useState({
    email: true,
    phone: false,
    identity: false,
    payment: user?.role === 'client' ? true : false,
    skills: false
  });

  const handleVerifyEmail = () => {
    // TODO: Send verification email
    alert("Verification email sent! Please check your inbox.");
  };

  const handleVerifyPhone = () => {
    // TODO: Send verification SMS
    alert("Verification code sent to your phone!");
  };

  const handleUploadDocument = () => {
    // TODO: Implement document upload
    alert("Document upload functionality will be implemented");
  };

  const handleVerifyPayment = () => {
    // TODO: Implement payment verification
    alert("Payment method verification initiated");
  };

  const handleTakeSkillTest = (skill: string) => {
    // TODO: Implement skill test
    alert(`Starting ${skill} skill test...`);
  };

  return (
    <div className="space-y-6">
      {/* Verification Overview */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Shield className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Account Verification</h2>
            <p className="text-sm text-gray-600">Verify your identity to build trust and unlock features</p>
          </div>
        </div>

        {/* Verification Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Verification Progress</span>
            <span className="text-sm font-bold text-gray-900">
              {Object.values(verificationStatus).filter(Boolean).length} / {Object.keys(verificationStatus).length}
            </span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#0CF574] transition-all duration-300"
              style={{ 
                width: `${(Object.values(verificationStatus).filter(Boolean).length / Object.keys(verificationStatus).length) * 100}%` 
              }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Complete all verifications to increase your profile credibility
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle2 className="w-5 h-5 text-green-600 mb-2" />
            <h3 className="font-medium text-gray-900 mb-1">Build Trust</h3>
            <p className="text-sm text-gray-600">Verified profiles get more attention</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Award className="w-5 h-5 text-blue-600 mb-2" />
            <h3 className="font-medium text-gray-900 mb-1">Stand Out</h3>
            <p className="text-sm text-gray-600">Show your verified badge</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <Shield className="w-5 h-5 text-purple-600 mb-2" />
            <h3 className="font-medium text-gray-900 mb-1">Security</h3>
            <p className="text-sm text-gray-600">Protect your account</p>
          </div>
        </div>
      </Card>

      {/* Email Verification */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${verificationStatus.email ? 'bg-green-100' : 'bg-gray-100'}`}>
              <Mail className={`w-5 h-5 ${verificationStatus.email ? 'text-green-600' : 'text-gray-600'}`} />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Email Verification</h3>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
          </div>
          {verificationStatus.email ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm font-medium">Verified</span>
            </div>
          ) : (
            <Button onClick={handleVerifyEmail} variant="outline">
              Verify Email
            </Button>
          )}
        </div>
        
        {!verificationStatus.email && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              Click &quot;Verify Email&quot; to receive a verification link at your email address.
            </p>
          </div>
        )}
      </Card>

      {/* Phone Verification */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${verificationStatus.phone ? 'bg-green-100' : 'bg-gray-100'}`}>
              <Phone className={`w-5 h-5 ${verificationStatus.phone ? 'text-green-600' : 'text-gray-600'}`} />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Phone Verification</h3>
              <p className="text-sm text-gray-600">+977 98XXXXXXXX</p>
            </div>
          </div>
          {verificationStatus.phone ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm font-medium">Verified</span>
            </div>
          ) : (
            <Button onClick={handleVerifyPhone} variant="outline">
              Verify Phone
            </Button>
          )}
        </div>
        
        {!verificationStatus.phone && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              We&apos;ll send a verification code via SMS to confirm your phone number.
            </p>
          </div>
        )}
      </Card>

      {/* Identity Verification */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${verificationStatus.identity ? 'bg-green-100' : 'bg-gray-100'}`}>
              <FileText className={`w-5 h-5 ${verificationStatus.identity ? 'text-green-600' : 'text-gray-600'}`} />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Identity Verification</h3>
              <p className="text-sm text-gray-600">Verify your government ID</p>
            </div>
          </div>
          {verificationStatus.identity ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm font-medium">Verified</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-full">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Not Verified</span>
            </div>
          )}
        </div>

        {!verificationStatus.identity && (
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-700 mb-3">
                Upload a clear photo of your government-issued ID (Passport, National ID, or Citizenship Certificate).
              </p>
              <ul className="text-sm text-gray-600 space-y-1 mb-4">
                <li>• Ensure all text is readable</li>
                <li>• Photo must be in color</li>
                <li>• Accepted formats: JPG, PNG, PDF</li>
                <li>• Maximum file size: 5MB</li>
              </ul>
              <Button onClick={handleUploadDocument} variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Upload ID Document
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Payment Verification */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${verificationStatus.payment ? 'bg-green-100' : 'bg-gray-100'}`}>
              <CreditCard className={`w-5 h-5 ${verificationStatus.payment ? 'text-green-600' : 'text-gray-600'}`} />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Payment Verification</h3>
              <p className="text-sm text-gray-600">
                {user?.role === 'freelancer' ? 'Verify your bank account' : 'Verify your payment method'}
              </p>
            </div>
          </div>
          {verificationStatus.payment ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm font-medium">Verified</span>
            </div>
          ) : (
            <Button onClick={handleVerifyPayment} variant="outline">
              Verify Payment
            </Button>
          )}
        </div>

        {!verificationStatus.payment && (
          <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-sm text-purple-800">
              {user?.role === 'freelancer' 
                ? 'Verify your bank account to receive payments securely.' 
                : 'Add and verify a payment method to hire freelancers.'}
            </p>
          </div>
        )}
      </Card>

      {/* Skills Verification (Freelancers only) */}
      {user?.role === 'freelancer' && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${verificationStatus.skills ? 'bg-green-100' : 'bg-gray-100'}`}>
                <Award className={`w-5 h-5 ${verificationStatus.skills ? 'text-green-600' : 'text-gray-600'}`} />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Skills Verification</h3>
                <p className="text-sm text-gray-600">Take tests to prove your expertise</p>
              </div>
            </div>
            {verificationStatus.skills ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm font-medium">Verified</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full">
                <span className="text-sm font-medium">0 Skills Verified</span>
              </div>
            )}
          </div>

          {!verificationStatus.skills && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-4">
                Take skill tests to showcase your abilities and stand out to clients.
              </p>

              <div className="space-y-2">
                {['JavaScript', 'React', 'Node.js', 'Python', 'UI/UX Design'].map((skill) => (
                  <div key={skill} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">{skill}</span>
                    <Button onClick={() => handleTakeSkillTest(skill)} variant="outline" size="sm">
                      Take Test
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Verification Tips */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="font-medium text-gray-900 mb-3">Verification Tips</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <span>Complete all verifications to increase your profile visibility by up to 70%</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <span>Identity verification is required for withdrawals over $500</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <span>Verified profiles receive 3x more job invitations</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <span>Your documents are encrypted and stored securely</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}
