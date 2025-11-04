"use client";

import React from 'react';
import { Star } from "lucide-react";
import Image from "next/image";

interface FreelancerCardProps {
  name: string;
  title: string;
  avatar: string;
  bio: string;
  rating?: number;
  onClick?: () => void;
}

export default function FreelancerCard({
  name,
  title,
  avatar,
  bio,
  rating = 4.0,
  onClick,
}: FreelancerCardProps) {
  return (
    <div className="relative w-[392px] bg-white rounded-[32px] p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      {/* Profile Image with Rating Badge */}
      <div className="relative w-full aspect-square rounded-[32px] overflow-hidden mb-6 bg-gradient-to-br from-gray-100 to-gray-50">
        <Image
          src={avatar}
          alt={name}
          fill
          className="object-cover"
          sizes="392px"
          priority
        />
        
        {/* Rating Badge - Top Right */}
        <div className="absolute top-4 right-4 bg-white rounded-full px-4 py-2 shadow-lg flex items-center gap-1.5">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <Star className="w-4 h-4 fill-gray-300 text-gray-300" />
        </div>
        
        {/* Rating Text - Bottom of Badge */}
        <div className="absolute top-[60px] right-4 bg-white rounded-full px-3 py-1 shadow-lg">
          <span className="text-xs font-semibold text-gray-900">{rating.toFixed(1)} Rating</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="space-y-4">
        {/* Name and Title */}
        <div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1 leading-tight">
            {name}
          </h3>
          <p className="text-lg text-gray-900 font-medium">{title}</p>
        </div>

        {/* Bio Text */}
        <p className="text-sm text-gray-900 leading-relaxed line-clamp-3">
          {bio}
        </p>

        {/* Hire Now Button */}
        <button 
          onClick={onClick}
          className="w-auto px-6 py-2.5 bg-black hover:bg-gray-900 text-white text-sm font-bold rounded-full transition-all duration-200 hover:shadow-lg uppercase tracking-wide"
        >
          HIRE NOW
        </button>
      </div>
    </div>
  );
}