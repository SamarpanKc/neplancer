'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  User,
  Settings,
  CreditCard,
  Shield,
  Bell,
  BadgeCheck,
  Trash2,
  ChevronRight,
} from 'lucide-react';

interface SettingsTab {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
}

const SETTINGS_TABS: SettingsTab[] = [
  {
    id: 'profile',
    label: 'Profile Information',
    icon: User,
    description: 'Manage your personal and professional details',
  },
  {
    id: 'account',
    label: 'Account Settings',
    icon: Settings,
    description: 'Password, email, and security settings',
  },
  {
    id: 'payment',
    label: 'Payment Information',
    icon: CreditCard,
    description: 'Manage payment methods and billing',
  },
  {
    id: 'privacy',
    label: 'Privacy & Security',
    icon: Shield,
    description: 'Control your privacy and data settings',
  },
  {
    id: 'notifications',
    label: 'Notification Preferences',
    icon: Bell,
    description: 'Customize your notification settings',
  },
  {
    id: 'verification',
    label: 'Verification',
    icon: BadgeCheck,
    description: 'Verify your identity and credentials',
  },
  {
    id: 'delete',
    label: 'Delete Account',
    icon: Trash2,
    description: 'Permanently delete your account',
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';

  const handleTabChange = (tabId: string) => {
    router.push(`/settings?tab=${tabId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-1">
                Manage your account settings and preferences
              </p>
            </div>
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3">
            <nav className="space-y-1 sticky top-8">
              {SETTINGS_TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                const isDanger = tab.id === 'delete';

                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all
                      ${
                        isActive
                          ? 'bg-[#0CF574] text-white shadow-md'
                          : isDanger
                          ? 'hover:bg-red-50 text-red-600'
                          : 'hover:bg-gray-100 text-gray-700'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">
                        {tab.label}
                      </div>
                      <div
                        className={`text-xs mt-0.5 truncate ${
                          isActive
                            ? 'text-white/80'
                            : isDanger
                            ? 'text-red-500'
                            : 'text-gray-500'
                        }`}
                      >
                        {tab.description}
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 flex-shrink-0 ${
                        isActive ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9 mt-8 lg:mt-0">
            <div className="bg-white rounded-xl shadow-sm">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
