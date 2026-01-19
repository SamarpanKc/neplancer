"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Plus, Trash2, Calendar, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface Milestone {
  title: string;
  description: string;
  amount: number;
  deadline: string;
}

interface ContractEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  contract: {
    id: string;
    title: string;
    description: string;
    total_amount: number;
    deadline?: string;
    payment_type?: string;
    milestones?: Array<{
      title: string;
      description: string;
      amount: number;
      deadline?: string;
      due_date?: string;
    }>;
  };
}

export default function ContractEditModal({
  isOpen,
  onClose,
  onSuccess,
  contract
}: ContractEditModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: contract.title || '',
    description: contract.description || '',
    total_amount: contract.total_amount || 0,
    deadline: contract.deadline?.split('T')[0] || '',
    payment_type: contract.payment_type || 'full',
  });
  const [milestones, setMilestones] = useState<Milestone[]>(
    contract.milestones?.map((m) => ({
      title: m.title,
      description: m.description,
      amount: m.amount,
      deadline: (m.deadline || m.due_date)?.split('T')[0] || '',
    })) || []
  );

  if (!isOpen) return null;

  const handleAddMilestone = () => {
    setMilestones([
      ...milestones,
      { title: '', description: '', amount: 0, deadline: '' }
    ]);
  };

  const handleRemoveMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const handleMilestoneChange = (index: number, field: keyof Milestone, value: string | number) => {
    const updated = [...milestones];
    updated[index] = { ...updated[index], [field]: value };
    setMilestones(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate form
      if (!formData.title || !formData.description || !formData.total_amount || !formData.deadline) {
        toast.error('Please fill in all required fields');
        setIsLoading(false);
        return;
      }

      if (formData.payment_type === 'milestone' && milestones.length === 0) {
        toast.error('Please add at least one milestone');
        setIsLoading(false);
        return;
      }

      // Calculate milestone total
      if (formData.payment_type === 'milestone') {
        const milestoneTotal = milestones.reduce((sum, m) => sum + Number(m.amount), 0);
        if (milestoneTotal !== Number(formData.total_amount)) {
          toast.error(`Milestone total ($${milestoneTotal}) must equal contract total ($${formData.total_amount})`);
          setIsLoading(false);
          return;
        }
      }

      const response = await fetch(`/api/contracts/${contract.id}/edit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          milestones: formData.payment_type === 'milestone' ? milestones : [],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update contract');
      }

      toast.success('Contract updated successfully');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating contract:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update contract');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-3xl w-full my-8 shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Contract</h2>
            <p className="text-sm text-gray-500 mt-1">Update contract details before freelancer signs</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contract Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent"
              placeholder="e.g., Website Development Project"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent"
              placeholder="Describe the work to be done..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Total Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Amount ($) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={formData.total_amount}
                  onChange={(e) => setFormData({ ...formData, total_amount: Number(e.target.value) })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deadline <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.payment_type}
              onChange={(e) => setFormData({ ...formData, payment_type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0CF574] focus:border-transparent"
            >
              <option value="full">Full Payment</option>
              <option value="milestone">Milestone-Based</option>
            </select>
          </div>

          {/* Milestones */}
          {formData.payment_type === 'milestone' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Milestones <span className="text-red-500">*</span>
                </label>
                <Button
                  type="button"
                  onClick={handleAddMilestone}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Milestone
                </Button>
              </div>

              {milestones.map((milestone, index) => (
                <div key={index} className="border border-gray-300 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Milestone {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMilestone(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={milestone.title}
                    onChange={(e) => handleMilestoneChange(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Milestone title"
                    required
                  />

                  <textarea
                    value={milestone.description}
                    onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Milestone description"
                    required
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      value={milestone.amount}
                      onChange={(e) => handleMilestoneChange(index, 'amount', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Amount ($)"
                      min="0"
                      step="0.01"
                      required
                    />
                    <input
                      type="date"
                      value={milestone.deadline}
                      onChange={(e) => handleMilestoneChange(index, 'deadline', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      required
                    />
                  </div>
                </div>
              ))}

              {milestones.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-900">
                    Total: ${milestones.reduce((sum, m) => sum + Number(m.amount), 0).toFixed(2)} / 
                    ${Number(formData.total_amount).toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> The freelancer will be notified of these changes. 
              Once the freelancer signs the contract, it can no longer be edited.
            </p>
          </div>
        </form>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 flex gap-3">
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            className="flex-1"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-foreground hover:bg-gray-800"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </>
            ) : (
              'Update Contract'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
