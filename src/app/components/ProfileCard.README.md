# ProfileCard Component

A clean and professional profile card component with responsive design, featuring a 3D gradient background, avatar, badges, stats, and action buttons.

## Features

- ✨ Modern glassmorphism design with 3D background
- 📱 Fully responsive layout
- 🎨 Customizable with shadcn/ui components
- 🔄 Smooth hover animations
- 📊 Stats display (rating, earnings, hourly rate)
- 🏷️ Badge system for expertise
- 💾 Bookmark functionality
- 📞 Call-to-action button

## Usage

```tsx
import ProfileCard from "@/app/components/ProfileCard";
import type { Freelancer } from "@/types";

const freelancer: Freelancer = {
  id: "1",
  email: "john@example.com",
  name: "John Doe",
  role: "freelancer",
  avatar: "https://i.pravatar.cc/150?img=1",
  title: "Motion Designer",
  skills: ["Motion Design", "3D Animation"],
  hourlyRate: 45,
  rating: 4.9,
  completedJobs: 127,
  badges: ["Expert", "Top Rated"],
  totalEarned: 35000,
  createdAt: new Date(),
};

<ProfileCard
  freelancer={freelancer}
  onGetInTouch={() => console.log("Contact clicked")}
  onBookmark={() => console.log("Bookmarked")}
/>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `freelancer` | `Freelancer` | Freelancer data object |
| `onGetInTouch` | `() => void` | Optional callback for "Get In Touch" button |
| `onBookmark` | `() => void` | Optional callback for bookmark button |

## Demo

Visit `/profile-demo` to see the component in action with multiple variants.

## Customization

The component uses shadcn/ui components and can be customized through:
- Tailwind CSS classes
- Theme variables in `globals.css`
- Component props

## Dependencies

- Next.js 15+
- React 19+
- shadcn/ui (Card, Avatar, Badge, Button)
- lucide-react (icons)
- Tailwind CSS v4