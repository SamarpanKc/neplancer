'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Send, Loader2, Check, CheckCheck, FileText, Clock, DollarSign, CheckCircle, XCircle, Briefcase, FileSignature } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read: boolean;
  created_at: string;
  sender?: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
}

interface ProposalData {
  isProposal: boolean;
  proposalId?: string;
  jobTitle?: string;
  budget?: string;
  duration?: string;
  coverLetter?: string;
}

interface ChatBoxProps {
  conversationId: string;
  recipientId: string;
  recipientName: string;
  recipientAvatar?: string;
  jobId?: string;
  isOnline?: boolean;
}

export default function ChatBox({
  conversationId: initialConversationId,
  recipientId,
  recipientName,
  recipientAvatar,
  jobId,
  isOnline = false,
}: ChatBoxProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [conversationId, setConversationId] = useState(initialConversationId);
  const [processingProposal, setProcessingProposal] = useState<string | null>(null);
  const [showContractOptions, setShowContractOptions] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Parse proposal message to extract data
  const parseProposalMessage = (content: string): ProposalData => {
    if (!content.includes('📝 **New Proposal Submitted**')) {
      return { isProposal: false };
    }

    const proposalIdMatch = content.match(/View full proposal: \/client\/proposals\/([a-f0-9-]+)/);
    const jobTitleMatch = content.match(/job: \*\*(.+?)\*\*/);
    const budgetMatch = content.match(/\*\*Proposed Budget:\*\* NPR ([\d,]+)/);
    const durationMatch = content.match(/\*\*Estimated Duration:\*\* (.+?)\n/);
    const coverLetterMatch = content.match(/\*\*Cover Letter:\*\*[\s\S]*?([\s\S]+?)\n\nView full proposal:/);

    return {
      isProposal: true,
      proposalId: proposalIdMatch?.[1],
      jobTitle: jobTitleMatch?.[1],
      budget: budgetMatch?.[1],
      duration: durationMatch?.[1],
      coverLetter: coverLetterMatch?.[1],
    };
  };

  // Handle proposal approval
  const handleApproveProposal = async (proposalId: string) => {
    setShowContractOptions(proposalId);
  };

  // Handle proposal rejection
  const handleRejectProposal = async (proposalId: string) => {
    if (!confirm('Are you sure you want to reject this proposal?')) {
      return;
    }

    setProcessingProposal(proposalId);
    try {
      const response = await fetch(`/api/proposals/${proposalId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' }),
      });

      if (!response.ok) {
        throw new Error('Failed to reject proposal');
      }

      toast.success('Proposal rejected');
      // Optionally send a message to the freelancer
      await sendSystemMessage('Your proposal has been declined. Thank you for your interest.');
    } catch (error) {
      console.error('Error rejecting proposal:', error);
      toast.error('Failed to reject proposal');
    } finally {
      setProcessingProposal(null);
    }
  };

  // Handle contract creation
  const handleCreateContract = (proposalId: string, type: 'quick' | 'custom') => {
    if (type === 'quick') {
      // Quick contract with default terms
      router.push(`/client/contracts/create?proposal=${proposalId}&type=quick`);
    } else {
      // Custom contract with detailed options
      router.push(`/client/contracts/create?proposal=${proposalId}&type=custom`);
    }
  };

  // Send system message
  const sendSystemMessage = async (content: string) => {
    if (!conversationId || !user) return;

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          content,
          senderId: user.id,
        }),
      });
    } catch (error) {
      console.error('Error sending system message:', error);
    }
  };

  // Update conversation ID when prop changes (when switching conversations)
  useEffect(() => {
    if (initialConversationId !== conversationId) {
      setConversationId(initialConversationId);
      setMessages([]); // Clear old messages
      setLoading(true); // Show loading state
    }
  }, [initialConversationId, conversationId]);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch messages
  const fetchMessages = async () => {
    if (!conversationId) return;

    try {
      const response = await fetch(`/api/messages?conversationId=${conversationId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch messages');
      }

      setMessages(data.messages || []);
      
      // Mark messages as read
      await fetch('/api/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId }),
      });
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Send message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    if (!user) {
      toast.error('You must be logged in to send messages');
      return;
    }

    setSending(true);

    try {
      const payload: {
        content: string;
        conversationId?: string;
        recipient_id?: string;
        job_id?: string;
      } = {
        content: newMessage.trim(),
      };

      if (conversationId) {
        payload.conversationId = conversationId;
      } else {
        payload.recipient_id = recipientId;
        if (jobId) {
          payload.job_id = jobId;
        }
      }

      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      // If we didn't have a conversation ID, set it now
      if (!conversationId && data.conversationId) {
        setConversationId(data.conversationId);
      }

      setNewMessage('');
      
      // Add message optimistically to UI
      if (data.message) {
        setMessages(prev => [...prev, {
          ...data.message,
          sender: {
            id: user.id,
            full_name: user.fullName || 'You',
            avatar_url: user.avatarUrl || '',
          }
        }]);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      console.error('Error sending message:', error);
      toast.error(errorMessage);
    } finally {
      setSending(false);
    }
  };

  // Set up realtime subscription
  useEffect(() => {
    if (!conversationId) return;

    fetchMessages();

    // Subscribe to new messages and updates
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          const newMsg = payload.new as Message;
          
          // Don't add if it's from current user (already added optimistically)
          if (newMsg.sender_id !== user?.id) {
            // Fetch sender details
            const { data: senderData } = await supabase
              .from('profiles')
              .select('id, full_name, avatar_url')
              .eq('id', newMsg.sender_id)
              .single();

            setMessages(prev => [...prev, {
              ...newMsg,
              sender: senderData ? {
                ...senderData,
                avatar_url: senderData.avatar_url || ''
              } : undefined,
            }]);

            // Automatically mark as read since user is viewing this conversation
            await fetch('/api/messages', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ conversationId }),
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          // Update message read status in real-time
          const updatedMsg = payload.new as Message;
          setMessages(prev => 
            prev.map(msg => 
              msg.id === updatedMsg.id 
                ? { ...msg, read: updatedMsg.read } 
                : msg
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, user?.id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    // Use setTimeout to ensure DOM has updated before scrolling
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [messages]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="relative">
            {recipientAvatar ? (
              <Image
                src={recipientAvatar}
                alt={recipientName}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-semibold">
                  {recipientName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            {/* Online Status Indicator */}
            {isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{recipientName}</h3>
            <p className="text-xs text-gray-500">
              {isOnline ? (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Online
                </span>
              ) : (
                'Offline'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-4"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-500 mb-2">No messages yet</p>
              <p className="text-sm text-gray-400">
                Start the conversation by sending a message
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => {
              const isOwn = message.sender_id === user?.id;
              const messageDate = new Date(message.created_at);
              const timeString = messageDate.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              });

              const proposalData = parseProposalMessage(message.content);

              // Render proposal message with special UI
              if (proposalData.isProposal && !isOwn) {
                return (
                  <div key={message.id} className="w-full">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 shadow-md">
                      {/* Proposal Header */}
                      <div className="flex items-start gap-3 mb-4">
                        <div className="p-2 bg-blue-500 rounded-lg">
                          <FileText className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-900 mb-1">
                            New Proposal Received
                          </h3>
                          <p className="text-sm text-gray-600">
                            {message.sender?.full_name || 'Freelancer'} wants to work on your project
                          </p>
                        </div>
                      </div>

                      {/* Job Title */}
                      {proposalData.jobTitle && (
                        <div className="mb-4 p-3 bg-white rounded-lg border border-blue-100">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Briefcase className="h-4 w-4 text-blue-500" />
                            <span className="font-semibold text-sm">Project:</span>
                            <span className="text-sm">{proposalData.jobTitle}</span>
                          </div>
                        </div>
                      )}

                      {/* Proposal Details */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {proposalData.budget && (
                          <div className="p-3 bg-white rounded-lg border border-blue-100">
                            <div className="flex items-center gap-2 mb-1">
                              <DollarSign className="h-4 w-4 text-green-600" />
                              <span className="text-xs font-semibold text-gray-600">Budget</span>
                            </div>
                            <p className="text-lg font-bold text-gray-900">
                              NPR {proposalData.budget}
                            </p>
                          </div>
                        )}
                        {proposalData.duration && (
                          <div className="p-3 bg-white rounded-lg border border-blue-100">
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="h-4 w-4 text-blue-600" />
                              <span className="text-xs font-semibold text-gray-600">Duration</span>
                            </div>
                            <p className="text-lg font-bold text-gray-900">
                              {proposalData.duration}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Cover Letter Preview */}
                      {proposalData.coverLetter && (
                        <div className="mb-4 p-4 bg-white rounded-lg border border-blue-100">
                          <p className="text-xs font-semibold text-gray-600 mb-2">Cover Letter</p>
                          <p className="text-sm text-gray-700 line-clamp-3">
                            {proposalData.coverLetter}
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      {showContractOptions === proposalData.proposalId ? (
                        <div className="space-y-3">
                          <div className="p-4 bg-blue-100 rounded-lg border-2 border-blue-300">
                            <div className="flex items-center gap-2 mb-3">
                              <FileSignature className="h-5 w-5 text-blue-600" />
                              <h4 className="font-bold text-gray-900">Choose Contract Type</h4>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {/* Quick Contract Option */}
                              <button
                                onClick={() => handleCreateContract(proposalData.proposalId!, 'quick')}
                                className="p-4 bg-white border-2 border-blue-300 rounded-lg hover:border-blue-500 hover:shadow-md transition-all group text-left"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-500 transition-colors">
                                    <CheckCircle className="h-5 w-5 text-blue-600 group-hover:text-white" />
                                  </div>
                                  <div className="flex-1">
                                    <h5 className="font-bold text-gray-900 mb-1">Quick Contract</h5>
                                    <p className="text-xs text-gray-600">
                                      Use proposal terms with standard agreement
                                    </p>
                                    <p className="text-xs text-blue-600 mt-1 font-semibold">
                                      ⚡ Faster setup
                                    </p>
                                  </div>
                                </div>
                              </button>

                              {/* Custom Contract Option */}
                              <button
                                onClick={() => handleCreateContract(proposalData.proposalId!, 'custom')}
                                className="p-4 bg-white border-2 border-blue-300 rounded-lg hover:border-blue-500 hover:shadow-md transition-all group text-left"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-500 transition-colors">
                                    <FileSignature className="h-5 w-5 text-purple-600 group-hover:text-white" />
                                  </div>
                                  <div className="flex-1">
                                    <h5 className="font-bold text-gray-900 mb-1">Custom Contract</h5>
                                    <p className="text-xs text-gray-600">
                                      Set milestones, payment terms & details
                                    </p>
                                    <p className="text-xs text-purple-600 mt-1 font-semibold">
                                      🎯 More control
                                    </p>
                                  </div>
                                </div>
                              </button>
                            </div>
                            <button
                              onClick={() => setShowContractOptions(null)}
                              className="mt-3 w-full py-2 text-sm text-gray-600 hover:text-gray-800 font-medium"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleApproveProposal(proposalData.proposalId!)}
                            disabled={processingProposal === proposalData.proposalId}
                            className="flex-1 py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                          >
                            {processingProposal === proposalData.proposalId ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle className="h-5 w-5" />
                                <span>Approve & Create Contract</span>
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleRejectProposal(proposalData.proposalId!)}
                            disabled={processingProposal === proposalData.proposalId}
                            className="py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                          >
                            {processingProposal === proposalData.proposalId ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              <XCircle className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      )}

                      {/* Timestamp */}
                      <div className="mt-4 pt-3 border-t border-blue-200">
                        <p className="text-xs text-gray-500">{timeString}</p>
                      </div>
                    </div>
                  </div>
                );
              }

              // Regular message
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] ${
                      isOwn
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-900'
                    } rounded-lg px-4 py-2 shadow-sm`}
                  >
                    {!isOwn && message.sender && (
                      <p className="text-xs font-semibold mb-1 opacity-70">
                        {message.sender.full_name}
                      </p>
                    )}
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                    <div
                      className={`flex items-center gap-1 mt-1 ${
                        isOwn ? 'text-white/70' : 'text-gray-500'
                      }`}
                    >
                      <span className="text-xs">{timeString}</span>
                      {isOwn && (
                        <span className="ml-1">
                          {message.read ? (
                            <CheckCheck className="h-3 w-3 text-blue-400" />
                          ) : (
                            <Check className="h-3 w-3" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="px-6 py-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {sending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Send className="h-5 w-5" />
                <span className="hidden sm:inline">Send</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
