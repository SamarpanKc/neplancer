       "use client";

import { Star, Bookmark } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Freelancer } from "@/types";

interface ProfileCardProps {
  freelancer: Freelancer;
  onGetInTouch?: () => void;
  onBookmark?: () => void;
}

export default function ProfileCard({
  freelancer,
  onGetInTouch,
  onBookmark,
}: ProfileCardProps) {
  const {
    name,
    avatar,
    title,
    badges = [],
    rating = 0,
    totalEarned = 0,
    hourlyRate = 0,
  } = freelancer;

  const formatCurrency = (amount: number) => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}k+`;
    }
    return `$${amount}`;
  };

  return (
    <Card className="relative w-full max-w-[320px] overflow-hidden rounded-[32px] border-0 shadow-2xl transition-all duration-300 hover:shadow-3xl hover:-translate-y-2">
      {/* Background Image */}
      <div className="absolute inset-0 h-[280px]">
        <Image
          src="https://images.unsplash.com/photo-1634295912158-9c847b6b3a40?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHwzRCUyMHNoYXBlcyUyMGFic3RyYWN0JTIwZ3JhZGllbnQlMjBnZW9tZXRyaWMlMjBjb2xvcmZ1bHxlbnwwfDF8fHB1cnBsZXwxNzYwNzc4NzI3fDA&ixlib=rb-4.1.0&q=85"
          alt="Pawel Czerwinski on Unsplash"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/20 to-purple-900/90" />
      </div>

      <CardContent className="relative p-6 pt-[200px]">
        {/* Avatar */}
        <div className="absolute left-6 top-[160px]">
          <Avatar className="h-20 w-20 border-4 border-white shadow-xl">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-2xl font-bold">
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Name and Title */}
        <div className="mb-4 text-white">
          <h3 className="text-xl font-bold mb-1">{name}</h3>
          <p className="text-sm text-white/80">{title || "Professional"}</p>
        </div>

        {/* Badges */}
        {badges.length > 0 && (
          <div className="flex items-center gap-2 mb-6">
            <Badge className="bg-purple-600 hover:bg-purple-700 text-white border-0 rounded-full px-3 py-1.5 text-xs font-semibold">
              {badges[0]}
            </Badge>
            {badges.length > 1 && (
              <Badge
                variant="secondary"
                className="bg-white/20 hover:bg-white/30 text-white border-0 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-sm"
              >
                +{badges.length - 1}
              </Badge>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6 text-white">
          <div>
            <div className="flex items-center gap-1 mb-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-lg font-bold">{rating.toFixed(1)}</span>
            </div>
            <p className="text-xs text-white/70">rating</p>
          </div>
          <div>
            <div className="text-lg font-bold mb-1">
              {formatCurrency(totalEarned)}
            </div>
            <p className="text-xs text-white/70">earned</p>
          </div>
          <div>
            <div className="text-lg font-bold mb-1">
              ${hourlyRate}/hr
            </div>
            <p className="text-xs text-white/70">rate</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20"
            onClick={onBookmark}
          >
            <Bookmark className="h-5 w-5" />
          </Button>
          <Button
            className="flex-1 h-12 bg-white hover:bg-white/90 text-purple-900 font-semibold rounded-full shadow-lg transition-all duration-200 hover:shadow-xl"
            onClick={onGetInTouch}
          >
            Get In Touch
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}