"use client";

import FreelancerCard from "@/app/components/FreelancerCard";

export default function ProfileDemoPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-8">
      <FreelancerCard
        name="Samarpann KC"
        title="Designer"
        avatar="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&h=800&fit=crop"
        bio="I'm a Dynamic graphic designer with 3 years of professional experience, specializing in Adobe Photoshop and motion design, with some coding stuffs including frontend, with a proven ............"
        rating={4.0}
        onClick={() => console.log('Hire Now clicked')}
      />
    </div>
  );
}