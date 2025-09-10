"use client"
import React, { useState } from "react";
import { Krona_One, Manrope } from "next/font/google";
import Link from "next/link";
import Signin from "./signin";

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
        description: "Keep 100% of what you earn"
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
                  <p className="text-gray-600 text-sm leading-relaxed">{section.description}</p>
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
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
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
            <span className={`${kronaOne.className} font-bold`}>Neplancer</span>
          </span>
        </div>

        {/* Nav Links */}
        <div className={`${manrope.className} hidden md:flex gap-8 text-base font-semibold text-gray-800`}>
          {["Independents", "Companies", "Creator tools", "Human in the loop"].map((item) => (
            <a
              key={item}
              href="#"
              className="hover:text-black/30 transition py-2"
              onMouseEnter={() => setHoveredItem(item)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className={`${manrope.className} flex items-center gap-4`}>
          {/* Sign up Button */}
          <button className="px-6 py-2 rounded-full bg-foreground text-white font-semibold hover:bg-foreground/80 transition cursor-pointer">Sign up</button>
          {/* Log in Link */}
          {/* <a href="#" className="text-gray-900 font-medium hover:underline"></a> */}
          <Link href="/signin" className="text-gray-900 font-medium hover:underline"> Log in </Link>
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
