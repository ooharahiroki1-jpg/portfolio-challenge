import {
  Atom,
  BadgeJapaneseYen,
  Building2,
  Car,
  CircuitBoard,
  Cloud,
  Cpu,
  Cross,
  Flame,
  Gamepad2,
  Globe2,
  HardHat,
  Landmark,
  Plane,
  RadioTower,
  ShieldCheck,
  Ship,
  ShoppingBag,
  Truck,
  Utensils,
  Wheat,
  Zap,
  type LucideIcon
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Atom,
  BadgeJapaneseYen,
  Building2,
  Car,
  CircuitBoard,
  Cloud,
  Cpu,
  Cross,
  Flame,
  Gamepad2,
  Globe2,
  HardHat,
  Landmark,
  Plane,
  RadioTower,
  ShieldCheck,
  Ship,
  ShoppingBag,
  Truck,
  Utensils,
  Wheat,
  Zap
};

export function AssetIcon({
  icon,
  color,
  className = 'h-6 w-6'
}: {
  icon: string;
  color?: string;
  className?: string;
}) {
  const Icon = iconMap[icon] ?? Globe2;
  return <Icon className={className} style={{ color }} strokeWidth={2.3} />;
}
