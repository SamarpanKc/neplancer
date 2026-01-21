"use client"

import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Plus, Trash2, DollarSign, Calendar, Download, Filter, CheckCircle2, AlertCircle } from "lucide-react";

export default function PaymentInformation() {
  const { user } = useAuth();
  const [isAddingCard, setIsAddingCard] = useState(false);

  // Payment methods (for clients)
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: "Visa",
      last4: "4242",
      expiry: "12/25",
      isDefault: true
    },
    {
      id: 2,
      type: "Mastercard",
      last4: "5555",
      expiry: "08/24",
      isDefault: false
    }
  ]);

  // Bank details (for freelancers)
  const [bankDetails] = useState({
    accountName: "John Doe",
    accountNumber: "****1234",
    bankName: "Standard Bank",
    swiftCode: "SWIFT123",
    verified: true
  });

  // Withdrawal settings (for freelancers)
  const [withdrawalSettings, setWithdrawalSettings] = useState({
    minimumBalance: 50,
    autoWithdraw: false,
    autoWithdrawThreshold: 100
  });

  // Transaction history with filters
  const [transactionFilter, setTransactionFilter] = useState("all");
  const [transactions] = useState([
    {
      id: 1,
      type: user?.role === 'freelancer' ? 'payment_received' : 'payment_sent',
      amount: 350.00,
      description: user?.role === 'freelancer' ? "Payment for Web Development Project" : "Payment to John Doe",
      date: "2024-01-15",
      status: "completed",
      invoiceId: "INV-001"
    },
    {
      id: 2,
      type: user?.role === 'freelancer' ? 'withdrawal' : 'payment_sent',
      amount: 200.00,
      description: user?.role === 'freelancer' ? "Withdrawal to bank account" : "Payment to Jane Smith",
      date: "2024-01-14",
      status: "completed",
      invoiceId: "INV-002"
    },
    {
      id: 3,
      type: user?.role === 'freelancer' ? 'payment_received' : 'refund',
      amount: 450.00,
      description: user?.role === 'freelancer' ? "Payment for Logo Design" : "Refund for cancelled project",
      date: "2024-01-12",
      status: "pending",
      invoiceId: "INV-003"
    },
    {
      id: 4,
      type: "fee",
      amount: -15.50,
      description: "Platform service fee",
      date: "2024-01-10",
      status: "completed",
      invoiceId: "FEE-001"
    }
  ]);

  const filteredTransactions = transactions.filter(transaction => {
    if (transactionFilter === "all") return true;
    return transaction.type === transactionFilter;
  });

  const handleAddCard = () => {
    setIsAddingCard(true);
  };

  const handleDeleteCard = (cardId: number) => {
    if (confirm("Are you sure you want to remove this payment method?")) {
      setPaymentMethods(paymentMethods.filter(card => card.id !== cardId));
    }
  };

  const handleSetDefaultCard = (cardId: number) => {
    setPaymentMethods(paymentMethods.map(card => ({
      ...card,
      isDefault: card.id === cardId
    })));
  };

  const handleWithdraw = () => {
    // TODO: Implement withdrawal
    alert("Withdrawal request submitted");
  };

  const downloadInvoice = (invoiceId: string) => {
    // TODO: Implement invoice download
    alert(`Downloading invoice ${invoiceId}`);
  };

  return (
    <div className="space-y-6">
      {/* For Freelancers - Bank Account Details */}
      {user?.role === 'freelancer' && (
        <>
          {/* Bank Details */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Bank Account</h2>
              {bankDetails.verified ? (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Verified</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-full">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Pending Verification</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Holder Name
                  </label>
                  <p className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900">
                    {bankDetails.accountName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number
                  </label>
                  <p className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900 font-mono">
                    {bankDetails.accountNumber}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name
                  </label>
                  <p className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900">
                    {bankDetails.bankName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SWIFT/BIC Code
                  </label>
                  <p className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900 font-mono">
                    {bankDetails.swiftCode}
                  </p>
                </div>
              </div>

              <Button variant="outline">Edit Bank Details</Button>
            </div>
          </Card>

          {/* Withdrawal Settings */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Withdrawal Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">Available Balance</h3>
                  <p className="text-3xl font-bold text-gray-900">$1,250.00</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Minimum withdrawal: ${withdrawalSettings.minimumBalance}
                  </p>
                </div>
                <Button onClick={handleWithdraw} className="bg-foreground hover:bg-gray-800">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Withdraw
                </Button>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <h3 className="font-medium text-gray-900">Auto Withdrawal</h3>
                  <p className="text-sm text-gray-500">Automatically withdraw when balance reaches threshold</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={withdrawalSettings.autoWithdraw}
                    onChange={(e) => setWithdrawalSettings({...withdrawalSettings, autoWithdraw: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-[#0CF574]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0CF574]"></div>
                </label>
              </div>

              {withdrawalSettings.autoWithdraw && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Auto Withdrawal Threshold (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={withdrawalSettings.autoWithdrawThreshold}
                      onChange={(e) => setWithdrawalSettings({...withdrawalSettings, autoWithdrawThreshold: Number(e.target.value)})}
                      min={withdrawalSettings.minimumBalance}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Withdrawal Amount (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={withdrawalSettings.minimumBalance}
                    onChange={(e) => setWithdrawalSettings({...withdrawalSettings, minimumBalance: Number(e.target.value)})}
                    min={1}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent"
                  />
                </div>
              </div>

              <Button className="bg-foreground hover:bg-gray-800">Save Settings</Button>
            </div>
          </Card>
        </>
      )}

      {/* For Clients - Payment Methods */}
      {user?.role === 'client' && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Payment Methods</h2>
            <Button onClick={handleAddCard} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Card
            </Button>
          </div>

          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div 
                key={method.id}
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
              >
                <div className="p-3 bg-gray-100 rounded-lg">
                  <CreditCard className="w-6 h-6 text-gray-600" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900">
                      {method.type} •••• {method.last4}
                    </h3>
                    {method.isDefault && (
                      <span className="px-2 py-0.5 bg-[#0CF574]/20 text-xs font-medium rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">Expires {method.expiry}</p>
                </div>

                <div className="flex gap-2">
                  {!method.isDefault && (
                    <Button 
                      onClick={() => handleSetDefaultCard(method.id)}
                      variant="outline" 
                      size="sm"
                    >
                      Set Default
                    </Button>
                  )}
                  <Button 
                    onClick={() => handleDeleteCard(method.id)}
                    variant="outline" 
                    size="sm"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Card Form */}
          {isAddingCard && (
            <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="font-medium text-gray-900 mb-4">Add New Card</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      maxLength={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="setDefault" className="rounded" />
                  <label htmlFor="setDefault" className="text-sm text-gray-700">
                    Set as default payment method
                  </label>
                </div>

                <div className="flex gap-2">
                  <Button className="bg-foreground hover:bg-gray-800">Add Card</Button>
                  <Button onClick={() => setIsAddingCard(false)} variant="outline">Cancel</Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Transaction History (for both) */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Transaction History</h2>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select 
              value={transactionFilter}
              onChange={(e) => setTransactionFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0CF574] focus:border-transparent"
            >
              <option value="all">All Transactions</option>
              {user?.role === 'freelancer' ? (
                <>
                  <option value="payment_received">Payments Received</option>
                  <option value="withdrawal">Withdrawals</option>
                  <option value="fee">Fees</option>
                </>
              ) : (
                <>
                  <option value="payment_sent">Payments Sent</option>
                  <option value="refund">Refunds</option>
                  <option value="fee">Fees</option>
                </>
              )}
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredTransactions.map((transaction) => (
            <div 
              key={transaction.id}
              className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className={`p-2 rounded-lg ${
                transaction.amount < 0 ? 'bg-red-100' : 
                transaction.status === 'pending' ? 'bg-yellow-100' : 
                'bg-green-100'
              }`}>
                <DollarSign className={`w-5 h-5 ${
                  transaction.amount < 0 ? 'text-red-600' : 
                  transaction.status === 'pending' ? 'text-yellow-600' : 
                  'text-green-600'
                }`} />
              </div>

              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{transaction.description}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <p className="text-sm text-gray-600">{transaction.date}</p>
                  <span className="text-gray-400">•</span>
                  <span className={`text-sm px-2 py-0.5 rounded-full ${
                    transaction.status === 'completed' ? 'bg-green-100 text-green-700' :
                    transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <p className={`text-lg font-bold ${transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
                </p>
                {transaction.invoiceId && (
                  <button
                    onClick={() => downloadInvoice(transaction.invoiceId)}
                    className="text-xs text-blue-600 hover:underline mt-1 flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    Invoice
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No transactions found
          </div>
        )}

        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </p>
          <Button variant="outline">View All</Button>
        </div>
      </Card>

      {/* Billing History Download */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Export History</h2>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-700 mb-1">Download your complete transaction history</p>
            <p className="text-sm text-gray-500">Export as CSV or PDF for your records</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
