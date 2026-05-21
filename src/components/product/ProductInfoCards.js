import {
  AlertTriangle,
  BadgeCheck,
  Clock,
  HeartHandshake,
  RotateCcw,
  Truck,
} from "lucide-react";
import { productInfoCards } from "@/lib/product-details";
import { cn } from "@/lib/utils";

const icons = {
  truck: Truck,
  clock: Clock,
  alert: AlertTriangle,
  return: RotateCcw,
  quality: BadgeCheck,
  satisfaction: HeartHandshake,
};

export default function ProductInfoCards() {
  return (
    <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {productInfoCards.map((card) => {
        const Icon = icons[card.icon];
        return (
          <div
            key={card.id}
            className={cn(
              "flex gap-3 rounded-xl border p-4",
              card.className,
            )}
          >
            <Icon className="size-5 shrink-0" />
            <div>
              <p className="text-sm font-semibold">{card.title}</p>
              <p className="mt-0.5 text-xs opacity-90">{card.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
