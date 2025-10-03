"use client";

import React from "react";
import Image from "next/image";
import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

interface FreelancerCardProps {
  name: string;
  username: string;
  avatar: string;
  status: "online" | "offline" | "connecting";
  lastSeen?: string;
  skills?: string[];
  rating?: number;
}

export default function FreelancerCard({
  name,
  username,
  avatar,
  status,
  skills,
}: FreelancerCardProps) {
  const getStatusText = () => {
    switch (status) {
      case "online":
        return "Active Now";
      case "connecting":
        return "Connecting";
      default:
        return "Away";
    }
  };

  return (
    <div className={`${manrope.className} w-full max-w-sm mx-auto`}>
      {/* Main Card Container - White background with rounded corners */}
      <div className="bg-white rounded-[32px] p-3 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
        
        {/* Image Container with Rounded Corners */}
        <div className="relative w-full aspect-square rounded-[24px] overflow-hidden bg-gray-100 mb-4">
          <Image
            src={avatar}
            alt={name}
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>

        {/* Skills Tags */}
        {skills && skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full hover:bg-gray-200 transition-colors duration-200"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Username and Status */}
        <div className="footer flex items-center gap-14">
        <div className="mb-5">
          <h3 className="text-x font-bold text-gray-900 mb-1">
            {username}
          </h3>
          <p className="text-sm font-medium text-gray-500">
            {getStatusText()}
          </p>
        </div>

        {/* Hire Button */}
        <button className="w-2/3 h-8 bg-black hover:bg-gray-800 text-white font-semibold text-xs rounded-full transition-all  duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95 cursor-pointer">
          <span className="text-lg">+</span>
          <span>Hire Now</span>
        </button>
      </div>
      </div>
    </div>
  );
}
