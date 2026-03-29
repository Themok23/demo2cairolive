import {
  UtensilsCrossed,
  Sparkles,
  Coffee,
  Dumbbell,
  Waves,
  Flame,
  MapPin,
  type LucideProps,
} from 'lucide-react';

const iconMap: Record<string, React.FC<LucideProps>> = {
  UtensilsCrossed,
  Sparkles,
  Coffee,
  Dumbbell,
  Waves,
  Flame,
  MapPin,
};

interface CategoryIconProps {
  name: string;
  size?: number;
  className?: string;
}

export default function CategoryIcon({ name, size = 28, className }: CategoryIconProps) {
  const Icon = iconMap[name];

  if (Icon) {
    return <Icon size={size} className={className} strokeWidth={1.8} />;
  }

  // Fallback: if it's an emoji or unknown string, render as text
  return <span className={`text-2xl ${className || ''}`}>{name}</span>;
}
