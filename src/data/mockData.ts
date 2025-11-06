// Mock Data for Demo Mode
import { User, Job, Proposal, Contract, Message, Conversation, Client, Freelancer } from '@/types';

// Mock Users (Both Clients and Freelancers)
export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'demo.client@neplancer.com',
    name: 'Ramesh Bhandari',
    role: 'client',
    avatar: 'https://i.pravatar.cc/150?img=11',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'user-2',
    email: 'samarpann.kc@neplancer.com',
    name: 'Samarpann KC',
    role: 'freelancer',
    avatar: 'https://i.pravatar.cc/150?img=1',
    createdAt: new Date('2024-02-20'),
  },
  {
    id: 'user-3',
    email: 'bikash.thapa@neplancer.com',
    name: 'Bikash Thapa',
    role: 'freelancer',
    avatar: 'https://i.pravatar.cc/150?img=12',
    createdAt: new Date('2024-03-10'),
  },
];

// Mock Clients
export const mockClients: Client[] = [
  {
    id: 'user-1',
    email: 'demo.client@neplancer.com',
    name: 'Ramesh Bhandari',
    role: 'client',
    avatar: 'https://i.pravatar.cc/150?img=11',
    company: 'Himalayan Tech Solutions',
    jobsPosted: 12,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'client-2',
    email: 'sarah.johnson@neplancer.com',
    name: 'Sarah Johnson',
    role: 'client',
    avatar: 'https://i.pravatar.cc/150?img=45',
    company: 'Global Ventures Nepal',
    jobsPosted: 8,
    createdAt: new Date('2024-02-01'),
  },
];

// Mock Freelancers with Enhanced Profiles
export const mockFreelancers: Freelancer[] = [
  {
    id: 'user-2',
    email: 'anjali.sharma@neplancer.com',
    name: 'Anjali Sharma',
    role: 'freelancer',
    avatar: 'https://i.pravatar.cc/150?img=1',
    skills: ['UI/UX Design', 'Figma', 'Illustration', 'Prototyping', 'User Research'],
    hourlyRate: 2500,
    rating: 4.9,
    completedJobs: 47,
    title: 'Senior UI/UX Designer',
    badges: ['Top Rated', 'Fast Responder', 'Quality Work'],
    totalEarned: 850000,
    portfolio: 'https://anjali-designs.com',
    createdAt: new Date('2024-02-20'),
  },
  {
    id: 'user-3',
    email: 'bikash.thapa@neplancer.com',
    name: 'Bikash Thapa',
    role: 'freelancer',
    avatar: 'https://i.pravatar.cc/150?img=12',
    skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'Next.js', 'GraphQL'],
    hourlyRate: 3000,
    rating: 4.8,
    completedJobs: 62,
    title: 'Full Stack Developer',
    badges: ['Top Rated', 'Expert Verified', 'Rising Talent'],
    totalEarned: 1250000,
    portfolio: 'https://bikash-dev.com',
    createdAt: new Date('2024-03-10'),
  },
  {
    id: 'freelancer-3',
    email: 'kritika.gurung@neplancer.com',
    name: 'Kritika Gurung',
    role: 'freelancer',
    avatar: 'https://i.pravatar.cc/150?img=5',
    skills: ['Content Writing', 'SEO', 'Copywriting', 'Blog Writing', 'Technical Writing'],
    hourlyRate: 1800,
    rating: 5.0,
    completedJobs: 89,
    title: 'Content Strategist & Writer',
    badges: ['Top Rated', 'Quality Work', '100% Success Rate'],
    totalEarned: 650000,
    portfolio: 'https://kritika-writes.com',
    createdAt: new Date('2024-01-05'),
  },
  {
    id: 'freelancer-4',
    email: 'dipesh.rai@neplancer.com',
    name: 'Dipesh Rai',
    role: 'freelancer',
    avatar: 'https://i.pravatar.cc/150?img=13',
    skills: ['Digital Marketing', 'Social Media', 'Google Ads', 'SEO', 'Analytics'],
    hourlyRate: 2200,
    rating: 4.7,
    completedJobs: 34,
    title: 'Digital Marketing Specialist',
    badges: ['Rising Talent', 'Fast Responder'],
    totalEarned: 420000,
    portfolio: 'https://dipesh-marketing.com',
    createdAt: new Date('2024-04-12'),
  },
  {
    id: 'freelancer-5',
    email: 'srijana.maharjan@neplancer.com',
    name: 'Srijana Maharjan',
    role: 'freelancer',
    avatar: 'https://i.pravatar.cc/150?img=9',
    skills: ['Video Editing', 'After Effects', 'Premiere Pro', 'Motion Graphics', 'Color Grading'],
    hourlyRate: 2800,
    rating: 4.9,
    completedJobs: 56,
    title: 'Professional Video Editor',
    badges: ['Top Rated', 'Quality Work', 'Expert Verified'],
    totalEarned: 890000,
    portfolio: 'https://srijana-video.com',
    createdAt: new Date('2024-02-25'),
  },
];

// Mock Jobs
export const mockJobs: Job[] = [
  {
    id: 'job-1',
    title: 'Modern E-Commerce Website Development',
    description: 'Looking for an experienced full-stack developer to build a modern e-commerce platform for selling Nepali handicrafts. The website should include payment integration (eSewa, Khalti), inventory management, and admin dashboard. Must have experience with Next.js and MongoDB.',
    budget: 180000,
    category: 'Web Development',
    skills: ['React', 'Node.js', 'MongoDB', 'Next.js', 'Payment Integration'],
    clientId: 'user-1',
    status: 'open',
    createdAt: new Date('2025-10-15'),
    deadline: new Date('2025-12-30'),
  },
  {
    id: 'job-2',
    title: 'Mobile App UI/UX Design for Food Delivery',
    description: 'Need a talented UI/UX designer to create beautiful and intuitive designs for a food delivery app targeting Nepali restaurants. Should include user flow, wireframes, high-fidelity mockups, and a design system. Experience with Figma is required.',
    budget: 95000,
    category: 'UI/UX Design',
    skills: ['Figma', 'UI Design', 'UX Design', 'Mobile App Design', 'Prototyping'],
    clientId: 'client-2',
    status: 'open',
    createdAt: new Date('2025-10-20'),
    deadline: new Date('2025-11-30'),
  },
  {
    id: 'job-3',
    title: 'Content Writer for Travel Blog',
    description: 'Seeking an experienced content writer to create engaging blog posts about travel destinations in Nepal. Must have excellent English writing skills, SEO knowledge, and understanding of Nepal\'s tourism industry. 10 articles per month required.',
    budget: 45000,
    category: 'Content Writing',
    skills: ['Content Writing', 'SEO', 'Blog Writing', 'Travel Writing', 'Research'],
    clientId: 'user-1',
    status: 'in_progress',
    createdAt: new Date('2025-09-05'),
    deadline: new Date('2025-12-05'),
  },
  {
    id: 'job-4',
    title: 'Social Media Marketing Campaign',
    description: 'Looking for a digital marketing expert to run comprehensive social media campaigns for our clothing brand. Should include content strategy, post creation, community management, and monthly analytics reports. Experience with Facebook, Instagram, and TikTok required.',
    budget: 75000,
    category: 'Digital Marketing',
    skills: ['Social Media Marketing', 'Content Strategy', 'Facebook Ads', 'Instagram Marketing', 'Analytics'],
    clientId: 'client-2',
    status: 'open',
    createdAt: new Date('2025-10-25'),
    deadline: new Date('2025-12-15'),
  },
  {
    id: 'job-5',
    title: 'Corporate Video Production',
    description: 'Need a professional video editor to create a 3-minute corporate video showcasing our company\'s achievements and culture. Must include motion graphics, color grading, and sound design. Raw footage will be provided.',
    budget: 65000,
    category: 'Video Production',
    skills: ['Video Editing', 'Motion Graphics', 'Color Grading', 'Sound Design', 'Premiere Pro'],
    clientId: 'user-1',
    status: 'completed',
    createdAt: new Date('2025-08-10'),
    deadline: new Date('2025-09-10'),
  },
  {
    id: 'job-6',
    title: 'Logo Design for Tech Startup',
    description: 'Seeking a creative logo designer to create a modern, professional logo for our tech startup. Should include 3 initial concepts, unlimited revisions, and final files in all formats. Brand guidelines would be a plus.',
    budget: 35000,
    category: 'Graphic Design',
    skills: ['Logo Design', 'Branding', 'Adobe Illustrator', 'Vector Graphics', 'Brand Identity'],
    clientId: 'client-2',
    status: 'open',
    createdAt: new Date('2025-10-28'),
    deadline: new Date('2025-11-20'),
  },
];

// Mock Proposals
export const mockProposals: Proposal[] = [
  {
    id: 'proposal-1',
    jobId: 'job-1',
    freelancerId: 'user-3',
    coverLetter: 'Hello! I am a senior full-stack developer with 5+ years of experience building e-commerce platforms. I have successfully delivered similar projects for Nepali businesses and I\'m familiar with local payment gateways like eSewa and Khalti. I would love to help bring your vision to life. My portfolio includes several successful e-commerce sites.',
    proposedBudget: 175000,
    estimatedDuration: '6 weeks',
    status: 'pending',
    createdAt: new Date('2025-10-16'),
  },
  {
    id: 'proposal-2',
    jobId: 'job-2',
    freelancerId: 'user-2',
    coverLetter: 'Hi there! As a UI/UX designer specializing in mobile app design, I have created intuitive interfaces for multiple food delivery and restaurant apps. I understand the unique challenges of designing for the Nepali market and can deliver beautiful, user-friendly designs that will make your app stand out.',
    proposedBudget: 90000,
    estimatedDuration: '4 weeks',
    status: 'accepted',
    createdAt: new Date('2025-10-21'),
  },
  {
    id: 'proposal-3',
    jobId: 'job-3',
    freelancerId: 'freelancer-3',
    coverLetter: 'Namaste! As a content writer with extensive experience in travel writing, I have written numerous articles about Nepal\'s beautiful destinations. I combine SEO best practices with engaging storytelling to create content that ranks well and captivates readers. I\'d be honored to contribute to your travel blog.',
    proposedBudget: 45000,
    estimatedDuration: '3 months',
    status: 'accepted',
    createdAt: new Date('2025-09-06'),
  },
  {
    id: 'proposal-4',
    jobId: 'job-4',
    freelancerId: 'freelancer-4',
    coverLetter: 'Hello! I specialize in social media marketing for fashion and lifestyle brands. I have successfully managed campaigns that increased engagement by 300% and sales by 150%. I can create compelling content and run targeted ads to help your clothing brand reach its target audience effectively.',
    proposedBudget: 72000,
    estimatedDuration: '3 months',
    status: 'pending',
    createdAt: new Date('2025-10-26'),
  },
  {
    id: 'proposal-5',
    jobId: 'job-5',
    freelancerId: 'freelancer-5',
    coverLetter: 'Hi! I am a professional video editor with experience in corporate video production. I have created similar videos for several companies in Nepal and internationally. I excel at storytelling through video and will ensure your corporate video looks polished and professional with excellent motion graphics and color grading.',
    proposedBudget: 63000,
    estimatedDuration: '2 weeks',
    status: 'accepted',
    createdAt: new Date('2025-08-11'),
  },
];

// Mock Contracts
export const mockContracts: Contract[] = [
  {
    id: 'contract-1',
    jobId: 'job-3',
    clientId: 'user-1',
    freelancerId: 'freelancer-3',
    budget: 45000,
    terms: 'Monthly payment for 10 articles. Each article should be 1000-1500 words with SEO optimization. Client retains all rights to the content. Payment within 7 days of article approval.',
    status: 'active',
    startDate: new Date('2025-09-10'),
    createdAt: new Date('2025-09-08'),
  },
  {
    id: 'contract-2',
    jobId: 'job-5',
    clientId: 'user-1',
    freelancerId: 'freelancer-5',
    budget: 63000,
    terms: '3-minute corporate video with motion graphics, color grading, and sound design. 2 rounds of revisions included. Final delivery in 4K resolution with all source files.',
    status: 'completed',
    startDate: new Date('2025-08-15'),
    endDate: new Date('2025-09-08'),
    createdAt: new Date('2025-08-12'),
  },
  {
    id: 'contract-3',
    jobId: 'job-2',
    clientId: 'client-2',
    freelancerId: 'user-2',
    budget: 90000,
    terms: 'Complete UI/UX design for food delivery mobile app including user research, wireframes, high-fidelity mockups, and design system. Unlimited revisions until client satisfaction. Figma source files included.',
    status: 'active',
    startDate: new Date('2025-10-25'),
    createdAt: new Date('2025-10-23'),
  },
];

// Mock Messages and Conversations
export const mockMessages: Message[] = [
  {
    id: 'msg-1',
    conversationId: 'conv-1',
    senderId: 'user-1',
    content: 'Hi Anjali, I reviewed your portfolio and I\'m impressed! Would you be available to discuss the food delivery app design project?',
    createdAt: new Date('2025-10-24T10:30:00'),
    read: true,
  },
  {
    id: 'msg-2',
    conversationId: 'conv-1',
    senderId: 'user-2',
    content: 'Hello! Thank you so much. Yes, I\'m very interested in this project. I have experience designing similar apps. When would be a good time to discuss the requirements?',
    createdAt: new Date('2025-10-24T11:15:00'),
    read: true,
  },
  {
    id: 'msg-3',
    conversationId: 'conv-1',
    senderId: 'user-1',
    content: 'Great! How about we schedule a video call tomorrow at 2 PM? I\'d like to go over the user flows and design expectations.',
    createdAt: new Date('2025-10-24T11:45:00'),
    read: true,
  },
  {
    id: 'msg-4',
    conversationId: 'conv-2',
    senderId: 'user-3',
    content: 'Hi, I submitted a proposal for your e-commerce website project. I have extensive experience with Next.js and payment gateway integration. Would love to discuss further!',
    createdAt: new Date('2025-10-16T14:20:00'),
    read: true,
  },
  {
    id: 'msg-5',
    conversationId: 'conv-2',
    senderId: 'user-1',
    content: 'Hello Bikash, thanks for your proposal! Your experience with local payment gateways is exactly what we need. Can you share examples of similar e-commerce projects?',
    createdAt: new Date('2025-10-16T16:30:00'),
    read: true,
  },
];

export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    participants: ['user-1', 'user-2'],
    lastMessage: mockMessages[2],
    updatedAt: new Date('2025-10-24T11:45:00'),
  },
  {
    id: 'conv-2',
    participants: ['user-1', 'user-3'],
    lastMessage: mockMessages[4],
    updatedAt: new Date('2025-10-16T16:30:00'),
  },
];

// Helper function to get user by ID
export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

// Helper function to get freelancer by ID
export const getFreelancerById = (id: string): Freelancer | undefined => {
  return mockFreelancers.find(freelancer => freelancer.id === id);
};

// Helper function to get client by ID
export const getClientById = (id: string): Client | undefined => {
  return mockClients.find(client => client.id === id);
};

// Helper function to get jobs by client
export const getJobsByClient = (clientId: string): Job[] => {
  return mockJobs.filter(job => job.clientId === clientId);
};

// Helper function to get proposals by freelancer
export const getProposalsByFreelancer = (freelancerId: string): Proposal[] => {
  return mockProposals.filter(proposal => proposal.freelancerId === freelancerId);
};

// Helper function to get proposals by job
export const getProposalsByJob = (jobId: string): Proposal[] => {
  return mockProposals.filter(proposal => proposal.jobId === jobId);
};

// Helper function to get contracts by user
export const getContractsByUser = (userId: string): Contract[] => {
  return mockContracts.filter(
    contract => contract.clientId === userId || contract.freelancerId === userId
  );
};

// Helper function to get messages by conversation
export const getMessagesByConversation = (conversationId: string): Message[] => {
  return mockMessages.filter(message => message.conversationId === conversationId);
};

// Helper function to get conversations by user
export const getConversationsByUser = (userId: string): Conversation[] => {
  return mockConversations.filter(conversation => 
    conversation.participants.includes(userId)
  );
};

// Demo user for quick login
export const demoClientUser: User = mockUsers[0];
export const demoFreelancerUser: User = mockUsers[1];

// ============= Portfolio Items =============
import { PortfolioItem, Review } from '@/types';

export const mockPortfolioItems: PortfolioItem[] = [
  // Amit's portfolio
  {
    id: 'port-1',
    freelancerId: 'fl-1',
    title: 'E-commerce Platform Redesign',
    description: 'Complete redesign and development of a modern e-commerce platform with responsive design, shopping cart, payment integration, and admin panel.',
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800',
    url: 'https://example.com/project1',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Tailwind CSS'],
    createdAt: new Date('2024-08-15'),
  },
  {
    id: 'port-2',
    freelancerId: 'fl-1',
    title: 'Restaurant Booking App',
    description: 'Mobile-first web application for restaurant table bookings with real-time availability, notifications, and customer reviews.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    url: 'https://example.com/project2',
    technologies: ['Next.js', 'Firebase', 'React Native', 'Google Maps API'],
    createdAt: new Date('2024-09-20'),
  },
  {
    id: 'port-3',
    freelancerId: 'fl-1',
    title: 'Corporate Website',
    description: 'Professional corporate website with CMS integration, blog, career portal, and multi-language support.',
    technologies: ['WordPress', 'PHP', 'MySQL', 'JavaScript'],
    createdAt: new Date('2024-10-05'),
  },
  // Priya's portfolio
  {
    id: 'port-4',
    freelancerId: 'fl-2',
    title: 'Brand Identity for Tech Startup',
    description: 'Complete brand identity design including logo, color palette, typography, business cards, and brand guidelines.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
    technologies: ['Adobe Illustrator', 'Photoshop', 'Figma'],
    createdAt: new Date('2024-07-10'),
  },
  {
    id: 'port-5',
    freelancerId: 'fl-2',
    title: 'Social Media Campaign',
    description: 'Social media graphics and templates for a 3-month marketing campaign including posts, stories, and ads.',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
    technologies: ['Canva', 'Adobe Creative Suite', 'Figma'],
    createdAt: new Date('2024-09-01'),
  },
  // Raj's portfolio
  {
    id: 'port-6',
    freelancerId: 'fl-3',
    title: 'Mobile Banking App',
    description: 'Secure mobile banking application with biometric authentication, fund transfers, bill payments, and transaction history.',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800',
    url: 'https://example.com/banking-app',
    technologies: ['Flutter', 'Firebase', 'REST API', 'SQLite'],
    createdAt: new Date('2024-06-15'),
  },
  {
    id: 'port-7',
    freelancerId: 'fl-3',
    title: 'Fitness Tracking App',
    description: 'Cross-platform fitness app with workout tracking, nutrition logging, progress charts, and social features.',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
    technologies: ['React Native', 'Node.js', 'MongoDB', 'HealthKit'],
    createdAt: new Date('2024-08-22'),
  },
];

// ============= Reviews =============
export const mockReviews: Review[] = [
  // Reviews for Amit (fl-1)
  {
    id: 'rev-1',
    freelancerId: 'fl-1',
    clientId: 'cl-1',
    clientName: 'Rajesh Kumar',
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh',
    rating: 5,
    comment: 'Amit is an exceptional developer! He delivered the e-commerce platform ahead of schedule and the quality exceeded my expectations. His communication was excellent throughout the project.',
    projectTitle: 'E-commerce Platform Development',
    date: '2 weeks ago',
    createdAt: new Date('2024-10-20'),
  },
  {
    id: 'rev-2',
    freelancerId: 'fl-1',
    clientId: 'cl-2',
    clientName: 'Sarah Johnson',
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    rating: 5,
    comment: 'Outstanding work! The restaurant booking app works flawlessly. Amit is very professional and responsive to feedback. Highly recommended!',
    projectTitle: 'Restaurant Booking Application',
    date: '1 month ago',
    createdAt: new Date('2024-10-01'),
  },
  {
    id: 'rev-3',
    freelancerId: 'fl-1',
    clientId: 'cl-1',
    clientName: 'Rajesh Kumar',
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh',
    rating: 4,
    comment: 'Great developer with strong technical skills. The corporate website looks professional and functions well. Minor delays in delivery but overall very satisfied.',
    projectTitle: 'Corporate Website',
    date: '2 months ago',
    createdAt: new Date('2024-09-01'),
  },
  // Reviews for Priya (fl-2)
  {
    id: 'rev-4',
    freelancerId: 'fl-2',
    clientId: 'cl-1',
    clientName: 'Rajesh Kumar',
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh',
    rating: 5,
    comment: 'Priya created a stunning brand identity for our startup! Her creativity and attention to detail are remarkable. The brand guidelines she provided are comprehensive and easy to follow.',
    projectTitle: 'Brand Identity Design',
    date: '3 weeks ago',
    createdAt: new Date('2024-10-15'),
  },
  {
    id: 'rev-5',
    freelancerId: 'fl-2',
    clientId: 'cl-2',
    clientName: 'Michael Chen',
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    rating: 5,
    comment: 'Excellent work on the social media campaign! The graphics are eye-catching and perfectly aligned with our brand. Priya is a talented designer.',
    projectTitle: 'Social Media Graphics',
    date: '1 month ago',
    createdAt: new Date('2024-10-01'),
  },
  // Reviews for Raj (fl-3)
  {
    id: 'rev-6',
    freelancerId: 'fl-3',
    clientId: 'cl-1',
    clientName: 'Rajesh Kumar',
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh',
    rating: 5,
    comment: 'Raj built an incredible mobile banking app! The security features are robust and the UX is smooth. His expertise in mobile development is evident.',
    projectTitle: 'Mobile Banking App',
    date: '6 weeks ago',
    createdAt: new Date('2024-09-20'),
  },
  {
    id: 'rev-7',
    freelancerId: 'fl-3',
    clientId: 'cl-2',
    clientName: 'David Wilson',
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    rating: 4,
    comment: 'Very skilled mobile developer. The fitness app has great features and runs smoothly on both iOS and Android. Would work with Raj again!',
    projectTitle: 'Fitness Tracking App',
    date: '2 months ago',
    createdAt: new Date('2024-09-01'),
  },
];

// Helper functions for portfolio and reviews
export const getFreelancerPortfolio = (freelancerId: string): PortfolioItem[] => {
  return mockPortfolioItems.filter(item => item.freelancerId === freelancerId);
};

export const getFreelancerReviews = (freelancerId: string): Review[] => {
  return mockReviews.filter(review => review.freelancerId === freelancerId);
};
