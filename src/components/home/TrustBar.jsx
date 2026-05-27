import { IconShield, IconSparkles, IconTruck } from "@/components/icons";

const items = [
  {
    icon: IconTruck,
    title: "Free Shipping",
    text: "On all orders across India",
  },
  {
    icon: IconShield,
    title: "Authentic Quality",
    text: "Handpicked fabrics & craftsmanship",
  },
  {
    icon: IconSparkles,
    title: "WhatsApp Orders",
    text: "Easy checkout & personal support",
  },
];

export default function TrustBar() {
  return (
    <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {items.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-4 justify-center sm:justify-start">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] shrink-0">
                <Icon />
              </div>
              <div>
                <p className="font-semibold text-sm">{title}</p>
                <p className="text-xs text-[var(--color-muted)] mt-0.5">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
