declare module 'lucide-react' {
  import React from 'react';

  export interface LucideProps extends React.SVGProps<SVGSVGElement> {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
    className?: string;
  }

  export type LucideIcon = React.ForwardRefExoticComponent<
    LucideProps & React.RefAttributes<SVGSVGElement>
  >;

  export const Search: LucideIcon;
  export const X: LucideIcon;
  export const Sparkle: LucideIcon;
  export const Sparkles: LucideIcon;
  export const Compass: LucideIcon;
  export const Link2: LucideIcon;
  export const UserPlus: LucideIcon;
  export const Check: LucideIcon;
  export const Feather: LucideIcon;
  export const Users: LucideIcon;
  export const BookOpen: LucideIcon;
  export const Globe: LucideIcon;
  export const Brain: LucideIcon;
  export const Target: LucideIcon;
  export const ClipboardList: LucideIcon;
  export const Hourglass: LucideIcon;
  export const CalendarDays: LucideIcon;
  export const Calendar: LucideIcon;
  export const Zap: LucideIcon;
  export const Trash2: LucideIcon;
  export const Sprout: LucideIcon;
  export const Cake: LucideIcon;
  export const Heart: LucideIcon;
  export const MapPin: LucideIcon;
  export const Info: LucideIcon;
  export const MessageCircle: LucideIcon;
  export const Edit: LucideIcon;
  export const Edit3: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const Star: LucideIcon;
  export const Flame: LucideIcon;
  export const Eye: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const ChevronUp: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const RefreshCw: LucideIcon;
  export const HelpCircle: LucideIcon;
  export const ThumbsUp: LucideIcon;
  export const Pin: LucideIcon;
  export const Award: LucideIcon;
  export const Shield: LucideIcon;
  export const Lightbulb: LucideIcon;
  export const Activity: LucideIcon;
  export const AlertCircle: LucideIcon;
  export const Camera: LucideIcon;
  export const BarChart2: LucideIcon;
  export const BarChart3: LucideIcon;
  export const PieChart: LucideIcon;

  const icons: { [key: string]: LucideIcon };
  export default icons;
}
