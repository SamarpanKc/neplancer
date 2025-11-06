'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Send, 
  Paperclip, 
  Search, 
  MoreVertical,
  ArrowLeft,
  Check,
  CheckCheck,
  Phone,
  Video,
  Info,
  Image as ImageIcon,
  Smile
} from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { demoApi } from '@/lib/demoApi';
import { Conversation, Message, User } from '@/types';

export default function CommunicationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProjectInquiry, setShowProjectInquiry] = useState(false);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  
  // Project inquiry form state
  const [projectTitle, setProjectTitle] = useState('');
  const [projectCategory, setProjectCategory] = useState('');
  const [projectBudget, setProjectBudget] = useState('');
  const [projectDeadline, setProjectDeadline] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  useEffect(() => {
    async function initializeUser() {
      const user = await getCurrentUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setCurrentUser(user);
    }
    
    initializeUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadConversations();
      
      // Check if we need to start a new conversation with a freelancer
      const freelancerId = searchParams.get('freelancer');
      if (freelancerId) {
        handleStartConversation(freelancerId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, searchParams]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
      loadOtherUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const convos = await demoApi.getConversationsByUserId(currentUser.id);
      setConversations(convos);
      
      if (convos.length > 0 && !selectedConversation) {
        setSelectedConversation(convos[0]);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const msgs = await demoApi.getMessagesByConversationId(conversationId);
      setMessages(msgs);
      
      // Mark messages as read
      msgs.forEach(msg => {
        if (msg.senderId !== currentUser?.id && !msg.read) {
          demoApi.markMessageAsRead(msg.id);
        }
      });
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const loadOtherUser = async () => {
    if (!selectedConversation || !currentUser) return;
    
    const otherUserId = selectedConversation.participants.find(id => id !== currentUser.id);
    if (otherUserId) {
      const user = await demoApi.getUserById(otherUserId);
      setOtherUser(user);
    }
  };

  const handleStartConversation = async (freelancerId: string) => {
    if (!currentUser) return;
    
    // Check if conversation already exists
    const existingConvo = conversations.find(c => 
      c.participants.includes(freelancerId) && c.participants.includes(currentUser.id)
    );
    
    if (existingConvo) {
      setSelectedConversation(existingConvo);
      setShowProjectInquiry(false);
    } else {
      // Show project inquiry form for new conversations
      const freelancer = await demoApi.getUserById(freelancerId);
      setOtherUser(freelancer);
      setShowProjectInquiry(true);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !currentUser || !selectedConversation) return;
    
    try {
      const message = await demoApi.createMessage({
        conversationId: selectedConversation.id,
        senderId: currentUser.id,
        content: newMessage.trim(),
        read: false,
      });
      
      setMessages([...messages, message]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleSubmitProjectInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser || !otherUser) return;
    
    try {
      // Create new conversation
      const conversation = await demoApi.createConversation([currentUser.id, otherUser.id]);
      
      // Send project inquiry as first message
      const inquiryMessage = `
📋 **New Project Inquiry**

**Project**: ${projectTitle}
**Category**: ${projectCategory}
**Budget**: ₹${projectBudget}
**Deadline**: ${projectDeadline}

**Description**:
${projectDescription}

I'm interested in discussing this project with you. Let me know if you're available!
      `.trim();
      
      await demoApi.createMessage({
        conversationId: conversation.id,
        senderId: currentUser.id,
        content: inquiryMessage,
        read: false,
      });
      
      // Update state
      setConversations([conversation, ...conversations]);
      setSelectedConversation(conversation);
      setShowProjectInquiry(false);
      
      // Clear form
      setProjectTitle('');
      setProjectCategory('');
      setProjectBudget('');
      setProjectDeadline('');
      setProjectDescription('');
    } catch (error) {
      console.error('Error submitting project inquiry:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const filteredConversations = conversations.filter(() => {
    if (!searchQuery) return true;
    // Search by participant name (simplified for demo)
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading conversations...</p>
        </div>
      </div>
    );
  }

  // Project Inquiry Form Modal
  if (showProjectInquiry && otherUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={() => {
                setShowProjectInquiry(false);
                router.back();
              }}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b">
              <img
                src={otherUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUser.name}`}
                alt={otherUser.name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Contact {otherUser.name}</h1>
                <p className="text-gray-600">Start a conversation by sharing your project details</p>
              </div>
            </div>

            <form onSubmit={handleSubmitProjectInquiry} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g., E-commerce Website Development"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={projectCategory}
                    onChange={(e) => setProjectCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile Apps">Mobile Apps</option>
                    <option value="Design">Design</option>
                    <option value="Content Writing">Content Writing</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Video Editing">Video Editing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Budget Range (NPR) *
                  </label>
                  <input
                    type="text"
                    required
                    value={projectBudget}
                    onChange={(e) => setProjectBudget(e.target.value)}
                    placeholder="e.g., 50,000 - 100,000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Expected Deadline *
                </label>
                <input
                  type="date"
                  required
                  value={projectDeadline}
                  onChange={(e) => setProjectDeadline(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Project Description *
                </label>
                <textarea
                  required
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  rows={6}
                  placeholder="Provide detailed information about your project requirements, goals, and any specific features you need..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
                <p className="mt-2 text-sm text-gray-500">
                  {projectDescription.length} / 500 characters
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowProjectInquiry(false);
                    router.back();
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary text-gray-900 rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                >
                  Send Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="lg:hidden"
            >
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Messages</h1>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden max-w-7xl mx-auto w-full">
        {/* Conversations List */}
        <div className={`w-full lg:w-96 bg-white border-r flex flex-col ${selectedConversation ? 'hidden lg:flex' : 'flex'}`}>
          {/* Search */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Send className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations yet</h3>
                <p className="text-gray-600 text-sm">
                  Start a conversation by contacting a freelancer
                </p>
              </div>
            ) : (
              filteredConversations.map((conversation) => {
                const lastMessage = conversation.lastMessage;
                const isSelected = selectedConversation?.id === conversation.id;
                
                return (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b ${
                      isSelected ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                    }`}
                  >
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${conversation.id}`}
                      alt="User"
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900">Conversation</h3>
                        <span className="text-xs text-gray-500">
                          {lastMessage ? formatTime(lastMessage.createdAt) : ''}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {lastMessage?.content || 'No messages yet'}
                      </p>
                    </div>
                    {lastMessage && !lastMessage.read && lastMessage.senderId !== currentUser?.id && (
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        {selectedConversation ? (
          <div className={`flex-1 flex flex-col bg-white ${selectedConversation ? 'flex' : 'hidden lg:flex'}`}>
            {/* Chat Header */}
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="lg:hidden"
                >
                  <ArrowLeft className="h-6 w-6 text-gray-600" />
                </button>
                {otherUser && (
                  <>
                    <img
                      src={otherUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUser.name}`}
                      alt={otherUser.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h2 className="font-semibold text-gray-900">{otherUser.name}</h2>
                      <p className="text-sm text-gray-500">
                        {otherUser.role === 'freelancer' ? 'Freelancer' : 'Client'}
                      </p>
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Phone className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Video className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Info className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {messages.map((message, index) => {
                const isOwnMessage = message.senderId === currentUser?.id;
                const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId;
                
                return (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {showAvatar ? (
                      <img
                        src={
                          isOwnMessage 
                            ? (currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`)
                            : (otherUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUser?.name}`)
                        }
                        alt="Avatar"
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8"></div>
                    )}
                    
                    <div className={`flex flex-col max-w-md ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                      <div
                        className={`px-4 py-2 rounded-2xl ${
                          isOwnMessage
                            ? 'bg-primary text-gray-900'
                            : 'bg-white border border-gray-200 text-gray-900'
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">{message.content}</p>
                      </div>
                      <div className="flex items-center gap-1 mt-1 px-2">
                        <span className="text-xs text-gray-500">
                          {formatTime(message.createdAt)}
                        </span>
                        {isOwnMessage && (
                          message.read ? (
                            <CheckCheck className="h-3 w-3 text-primary" />
                          ) : (
                            <Check className="h-3 w-3 text-gray-400" />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
              <div className="flex items-end gap-2">
                <button
                  type="button"
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Paperclip className="h-5 w-5 text-gray-600" />
                </button>
                <button
                  type="button"
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ImageIcon className="h-5 w-5 text-gray-600" />
                </button>
                
                <div className="flex-1 relative">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                    placeholder="Type a message..."
                    rows={1}
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    style={{ minHeight: '48px', maxHeight: '120px' }}
                  />
                  <button
                    type="button"
                    className="absolute right-3 bottom-3 p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Smile className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
                
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-3 bg-primary text-gray-900 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 ml-2">
                Press Enter to send, Shift + Enter for new line
              </p>
            </form>
          </div>
        ) : (
          <div className="flex-1 hidden lg:flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-600">
                Choose a conversation from the list to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
