"use client"

import React, { Suspense } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import SettingsLayout from "@/components/settings/SettingsLayout";
import ProfileInformation from "@/components/settings/ProfileInformation";
import AccountSettings from "@/components/settings/AccountSettings";
import PaymentInformation from "@/components/settings/PaymentInformation";
import PrivacySecurity from "@/components/settings/PrivacySecurity";
import NotificationPreferences from "@/components/settings/NotificationPreferences";
import Verification from "@/components/settings/Verification";
import DeleteAccount from "@/components/settings/DeleteAccount";

function SettingsContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';

  if (!user) {
    router.push('/login');
    return null;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileInformation />;
      case 'account':
        return <AccountSettings />;
      case 'payment':
        return <PaymentInformation />;
      case 'privacy':
        return <PrivacySecurity />;
      case 'notifications':
        return <NotificationPreferences />;
      case 'verification':
        return <Verification />;
      case 'delete':
        return <DeleteAccount />;
      default:
        return <ProfileInformation />;
    }
  };

  return (
    <SettingsLayout>
      {renderContent()}
    </SettingsLayout>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <SettingsContent />
    </Suspense>
  );
}
