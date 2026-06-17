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
      <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
        <div className="grid grid-cols-3 divide-x divide-[var(--color-border)]/70 sm:divide-x-0 sm:gap-8">
          {items.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="flex flex-col items-center px-1.5 text-center first:pl-0 last:pr-0 sm:flex-row sm:items-center sm:gap-4 sm:px-0 sm:text-left"
            >
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] sm:size-12">
                <Icon className="size-5" />
              </div>
              <div className="mt-2 min-w-0 sm:mt-0">
                <p className="text-[11px] font-semibold leading-tight sm:text-sm">{title}</p>
                <p className="mt-1 hidden text-xs leading-snug text-[var(--color-muted)] sm:block">
                  {text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
