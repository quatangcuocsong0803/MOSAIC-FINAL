"use client";

import React from "react";
import {
  Users,
  ClipboardList,
  Brain,
  Target,
  Compass,
  Hourglass,
  CalendarDays,
  Calendar,
  Sparkle,
  Sparkles,
  Sprout,
  BookOpen,
  Zap,
  Trash2,
  Eye,
  Info,
  Heart,
  MessageCircle,
  Edit,
  Edit3,
  Globe,
  Link2,
  UserPlus,
  Check,
  Search,
  X,
  Cake,
  MapPin,
  AlertCircle,
  ArrowRight,
  Star,
  Camera,
  type LucideProps,
} from "lucide-react";

export {
  Users,
  ClipboardList,
  Brain,
  Target,
  Compass,
  Hourglass,
  CalendarDays,
  Calendar,
  Sparkle,
  Sparkles,
  Sprout,
  BookOpen,
  Zap,
  Trash2,
  Eye,
  Info,
  Heart,
  MessageCircle,
  Edit,
  Edit3,
  Globe,
  Link2,
  UserPlus,
  Check,
  Search,
  X,
  Cake,
  MapPin,
  AlertCircle,
  ArrowRight,
  Star,
  Camera,
};

// Component tiện ích bọc icon trong ô tròn viền mảnh 1px màu nâu chuẩn Light Art Nouveau
export function CircleIcon({
  icon: Icon,
  className = "w-8 h-8",
  iconClassName = "w-4 h-4 text-[#8B6B4A]",
  strokeWidth = 1.5,
}: {
  icon: React.ComponentType<LucideProps>;
  className?: string;
  iconClassName?: string;
  strokeWidth?: number;
}) {
  return (
    <span
      className={`rounded-full bg-[#FCFBF8] border border-[#8B6B4A]/50 flex items-center justify-center shrink-0 ${className}`}
    >
      <Icon className={iconClassName} strokeWidth={strokeWidth} />
    </span>
  );
}
