'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface BankDetails {
  account_holder_name: string;
  bank_name: string;
  account_number: string;
  routing_number: string;
  swift_code?: string;
  country: string;
}

export default function BankDetailsSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    account_holder_name: '',
    bank_name: '',
    account_number: '',
    routing_number: '',
    swift_code: '',
    country: 'US'
  });
  const [hasDetails, setHasDetails] = useState(false);

  useEffect(() => {
    fetchBankDetails();
  }, []);

  const fetchBankDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/profile/bank-details', {
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok && data.bank_details) {
        setBankDetails(data.bank_details);
        setHasDetails(true);
      }
    } catch (error) {
      console.error('Error fetching bank details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      const response = await fetch('/api/profile/bank-details', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bank_details: bankDetails })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save bank details');
      }

      toast.success('Bank details saved successfully!');
      setHasDetails(true);
    } catch (error) {
      console.error('Error saving bank details:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save bank details');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <CreditCard className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Bank Details</h2>
          <p className="text-sm text-gray-600">
            Manage your bank account for receiving payments
          </p>
        </div>
      </div>

      {hasDetails && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-green-800">
            <p className="font-medium">Bank details saved</p>
            <p>Payments will be transferred to this account</p>
          </div>
        </div>
      )}

      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
        <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-medium">Important Information</p>
          <ul className="mt-1 list-disc list-inside space-y-1">
            <li>Platform charges 7% fee on all payments</li>
            <li>You&apos;ll receive the net amount after fee deduction</li>
            <li>Payments processed within 3-5 business days</li>
            <li>Bank details are encrypted and secure</li>
          </ul>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account Holder Name *
          </label>
          <input
            type="text"
            value={bankDetails.account_holder_name}
            onChange={(e) => setBankDetails({ ...bankDetails, account_holder_name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bank Name *
          </label>
          <input
            type="text"
            value={bankDetails.bank_name}
            onChange={(e) => setBankDetails({ ...bankDetails, bank_name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Example Bank"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Number *
            </label>
            <input
              type="text"
              value={bankDetails.account_number}
              onChange={(e) => setBankDetails({ ...bankDetails, account_number: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="1234567890"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Routing Number *
            </label>
            <input
              type="text"
              value={bankDetails.routing_number}
              onChange={(e) => setBankDetails({ ...bankDetails, routing_number: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="123456789"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SWIFT/BIC Code (Optional)
            </label>
            <input
              type="text"
              value={bankDetails.swift_code}
              onChange={(e) => setBankDetails({ ...bankDetails, swift_code: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="EXAMPXXX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country *
            </label>
            <select
              value={bankDetails.country}
              onChange={(e) => setBankDetails({ ...bankDetails, country: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="AU">Australia</option>
              <option value="NP">Nepal</option>
              <option value="IN">India</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-5 w-5" />
            {saving ? 'Saving...' : hasDetails ? 'Update Bank Details' : 'Save Bank Details'}
          </button>
        </div>
      </form>
    </div>
  );
}
