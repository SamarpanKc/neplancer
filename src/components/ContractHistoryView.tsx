"use client"

import React, { useState, useEffect } from 'react';
import { History, Clock, FileEdit, CheckCircle, XCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface HistoryEntry {
  id: string;
  change_type: string;
  change_summary: string;
  previous_data: Record<string, unknown>;
  new_data: Record<string, unknown>;
  created_at: string;
  edited_by_profile: {
    full_name: string;
    avatar_url: string;
  };
}

interface ContractHistoryViewProps {
  contractId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ContractHistoryView({
  contractId,
  isOpen,
  onClose
}: ContractHistoryViewProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && contractId) {
      fetchHistory();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, contractId]);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/contracts/${contractId}/edit`);
      const data = await response.json();
      
      if (response.ok) {
        setHistory(data.history || []);
      }
    } catch (error) {
      console.error('Error fetching contract history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'created':
        return <FileEdit className="w-5 h-5 text-blue-500" />;
      case 'edited':
        return <FileEdit className="w-5 h-5 text-amber-500" />;
      case 'signed_client':
      case 'signed_freelancer':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'activated':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-700" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <History className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderChanges = (entry: HistoryEntry) => {
    if (!entry.previous_data || !entry.new_data) return null;

    const changes: Array<{ field: string; old: unknown; new: unknown }> = [];

    // Compare fields
    Object.keys(entry.new_data).forEach(key => {
      if (entry.previous_data[key] !== entry.new_data[key]) {
        changes.push({
          field: key,
          old: entry.previous_data[key],
          new: entry.new_data[key]
        });
      }
    });

    if (changes.length === 0) return null;

    return (
      <div className="mt-3 space-y-2 text-sm">
        {changes.map((change, idx) => (
          <div key={idx} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="font-medium text-gray-700 mb-1 capitalize">
              {change.field.replace(/_/g, ' ')}
            </div>
            <div className="space-y-1">
              <div className="flex items-start gap-2">
                <span className="text-red-600 font-medium text-xs">OLD:</span>
                <span className="text-gray-600 flex-1">
                  {typeof change.old === 'object' ? JSON.stringify(change.old) : String(change.old)}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-medium text-xs">NEW:</span>
                <span className="text-gray-900 flex-1">
                  {typeof change.new === 'object' ? JSON.stringify(change.new) : String(change.new)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <History className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Contract History</h2>
                <p className="text-sm text-gray-500">View all changes and updates</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-12">
              <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No history available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((entry, index) => (
                <div
                  key={entry.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getChangeIcon(entry.change_type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={entry.edited_by_profile?.avatar_url} />
                              <AvatarFallback className="bg-[#0CF574] text-foreground text-xs">
                                {entry.edited_by_profile?.full_name?.charAt(0).toUpperCase() || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-gray-900 text-sm">
                              {entry.edited_by_profile?.full_name || 'Unknown User'}
                            </span>
                            <span className="text-gray-400 text-xs">•</span>
                            <span className="text-xs text-gray-500 capitalize">
                              {entry.change_type.replace(/_/g, ' ')}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-700 mb-2">
                            {entry.change_summary}
                          </p>

                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            {formatDate(entry.created_at)}
                          </div>

                          {/* Show changes for edited entries */}
                          {entry.change_type === 'edited' && expandedId === entry.id && (
                            renderChanges(entry)
                          )}

                          {entry.change_type === 'edited' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                              className="mt-2 text-xs h-7"
                            >
                              {expandedId === entry.id ? 'Hide Details' : 'Show Details'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline connector */}
                  {index < history.length - 1 && (
                    <div className="ml-2.5 mt-2 mb-2 h-8 w-0.5 bg-gray-200"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <Button onClick={onClose} className="w-full bg-foreground hover:bg-gray-800">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
