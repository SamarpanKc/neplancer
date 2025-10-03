"use client"
import React, { useState, useRef, useEffect } from "react";
import { Krona_One, Manrope } from "next/font/google";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

const kronaOne = Krona_One({
  subsets: ["latin"],
  weight: ["400"],
  style: "normal",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: "normal",
});

interface DropdownSection {
  title: string;
  description: string;
}

interface DropdownContent {
  title: string;
  icon: string;
  sections: DropdownSection[];
  footer?: {
    title: string;
    description: string;
  };
}

const Navbar = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout, isAuthenticated, isClient, isFreelancer } = useAuth();
  const router = useRouter();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    router.push('/');
  };

  const independentsContent = {
    title: "GROW YOUR CAREER",
    icon: "😊",
    sections: [
      {
        title: "Manage freelance projects",
        description: "Let Neplancer handle the admin, so you can focus on what you do best"
      },
      {
        title: "Get verified as an expert",
        description: "Grow your reputation getting verified by your favorite tools"
      }
    ],
    footer: {
      title: "Supercharge your earnings with Neplancer Pro",
      description: "Our most powerful tools to build your career on your terms"
    }
  };

  const companiesContent = {
    title: "GET DISCOVERED",
    icon: "🔍",
    sections: [
      {
        title: "Find jobs",
        description: "Explore opportunities from the world's most innovative companies"
      },
      {
        title: "Get discovered",
        description: "Get featured on Neplancer's network of expert talent"
      }
    ]
  };

  const invoiceContent = {
    title: "INVOICE AND BILL CLIENTS",
    icon: "💰",
    sections: [
      {
        title: "Sign contracts",
        description: "Compliant & custom contracts"
      },
      {
        title: "Send invoices",
        description: "All your client invoices in one place"
      },
      {
        title: "Commission-free payments",
        description: "Keep 94% of what you earn"
      }
    ]
  };

  const getDropdownContent = (item: string) => {
    switch (item) {
      case "Independents":
        return independentsContent;
      case "Companies":
        return companiesContent;
      case "Creator tools":
        return invoiceContent;
      default:
        return null;
    }
  };

  const renderDropdown = (content: DropdownContent | null) => {
    if (!content) return null;

    return (
      <div className="absolute top-full left- w-full bg-white shadow-lg z-50 py-8">
        <div className={`${manrope.className} max-w-7xl mx-auto px-8`}>
          <div className="grid grid-cols-3 gap-8">
            {/* First Column */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                {/* <span className="text-lg">{content.icon}</span> */}
                  <span className="bg-[#0CF574]/80 py-1 px-3 rounded-2xl text-sm font-semibold text-foreground tracking-wide">{content.title}</span>
              </div>
              {content.sections.map((section: DropdownSection, index: number) => (
                <div key={index} className="mb-6">
                  <h3 className="font-semibold text-foreground mb-2">{section.title}</h3>
                  <Link href={""} className="text-gray-600 text-sm leading-relaxed">{section.description}</Link>
                </div>
              ))}
            </div>

            {/* Second Column - Additional content could go here */}
            <div></div>

            {/* Third Column - Pro section */}
            {content.footer && (
              <div>
                <div className="flex items-center gap-2 mb-6 ">
                  {/* <span className="text-lg">💰</span> */}
                  <span className="bg-[#0CF574]/80 py-1 px-3 rounded-2xl text-sm font-semibold text-gray-800 tracking-wide">INVOICE AND BILL CLIENTS</span>
                </div>
                {invoiceContent.sections.map((section: DropdownSection, index: number) => (
                  <div key={index} className="mb-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{section.title}</h3>
                    <p className="text-gray-600 text-sm">{section.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Pro Section */}
          {content.footer && (
            <div className="mt-8 pt-6">
              <div className="flex items-center justify-between bg-gray-100 hover:bg-[#3cf790] hover:text-2xl transition-all duration-400 cursor-pointer rounded-lg p-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{content.footer.title}</h3>
                  <p className="text-gray-600 text-sm">{content.footer.description}</p>
                </div>
                <div className="flex items-center">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="sticky top-0 z-50">
      <nav className="w-full bg-white px-18 py-3 flex items-center justify-between relative z-10 border-b border-gray-100">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold flex items-center gap-2 select-none">
            <Link className={`${kronaOne.className} font-bold`} href={"./"}>Neplancer</Link>
          </span>
        </div>

        {/* Nav Links */}
        <div className={`${manrope.className} hidden md:flex gap-8 text-base font-semibold text-gray-800`}>
          {!isAuthenticated ? (
            // Public navigation
            ["Independents", "Companies", "Creator tools"].map((item) => (
              <a
                key={item}
                href="#"
                className="hover:text-black/30 transition py-2"
                onMouseEnter={() => setHoveredItem(item)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {item}
              </a>
            ))
          ) : (
            // Authenticated navigation
            <>
              <Link href="/dashboard" className="hover:text-black/30 transition py-2">
                Dashboard
              </Link>
              
              {isFreelancer && (
                <>
                  <Link href="/freelancer/browse-jobs" className="hover:text-black/30 transition py-2">
                    Browse Jobs
                  </Link>
                  <Link href="/freelancer/my-proposals" className="hover:text-black/30 transition py-2">
                    My Proposals
                  </Link>
                </>
              )}
              
              {isClient && (
                <>
                  <Link href="/client/post-job" className="hover:text-black/30 transition py-2">
                    Post a Job
                  </Link>
                  <Link href="/client/jobs" className="hover:text-black/30 transition py-2">
                    My Jobs
                  </Link>
                </>
              )}
              
              <Link href="/communication" className="hover:text-black/30 transition py-2">
                Messages
              </Link>
              <Link href="/contracts" className="hover:text-black/30 transition py-2">
                Contracts
              </Link>
            </>
          )}
        </div>

        {/* CTA Buttons / User Menu */}
        <div className={`${manrope.className} flex items-center gap-4`}>
          {!isAuthenticated ? (
            // Not logged in - show signup/login
            <>
              <Link 
                href="/register" 
                className="px-6 py-2 rounded-full bg-foreground text-white font-semibold hover:bg-gray-800 cursor-pointer transition-colors duration-200"
              >
                Sign up
              </Link>
              <Link 
                href="/login" 
                className="text-gray-900 font-semibold hover:text-gray-600 transition-colors duration-200"
              >
                Log in
              </Link>
            </>
          ) : (
            // Logged in - show user menu
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              >
                <div className="w-8 h-8 rounded-full bg-[#0CF574] flex items-center justify-center text-foreground font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold text-gray-900">{user?.name}</span>
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold bg-[#0CF574]/20 text-foreground rounded">
                      {user?.role === 'client' ? 'Client' : 'Freelancer'}
                    </span>
                  </div>
                  
                  <Link 
                    href="/dashboard" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Dashboard
                  </Link>
                  
                  {isFreelancer && (
                    <>
                      <Link 
                        href="/freelancer/browse-jobs" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Browse Jobs
                      </Link>
                      <Link 
                        href="/freelancer/my-proposals" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        My Proposals
                      </Link>
                    </>
                  )}
                  
                  {isClient && (
                    <>
                      <Link 
                        href="/client/post-job" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Post a Job
                      </Link>
                      <Link 
                        href="/client/jobs" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        My Jobs
                      </Link>
                    </>
                  )}
                  
                  <Link 
                    href="/communication" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Messages
                  </Link>
                  <Link 
                    href="/contracts" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Contracts
                  </Link>
                  
                  <div className="border-t border-gray-200 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Dropdown Menu */}
      {hoveredItem && (
        <div
          onMouseEnter={() => setHoveredItem(hoveredItem)}
          onMouseLeave={() => setHoveredItem(null)}
        >
          {renderDropdown(getDropdownContent(hoveredItem))}
        </div>
      )}
    </div>
  );
};


export default Navbar;
