import Link from "next/link";
import { categories, navLinks, site } from "@/lib/site";
import { IconInstagram, IconWhatsApp } from "@/components/icons";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-text)] text-[var(--color-cream)]/90 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          <div className="lg:col-span-1">
            <p className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-cream)] mb-3">
              Maguva Ethnics
            </p>
            <p className="text-sm leading-relaxed text-[var(--color-cream)]/70 mb-6">
              {site.description}
            </p>
            <div className="flex gap-3">
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-[var(--color-primary)] transition-colors"
                aria-label="Instagram"
              >
                <IconInstagram className="w-5 h-5" />
              </a>
              <a
                href={`https://wa.me/${site.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-[#25D366] transition-colors"
                aria-label="WhatsApp"
              >
                <IconWhatsApp className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-[var(--color-gold)] mb-4 font-semibold">
              Shop
            </h3>
            <ul className="space-y-2.5 text-sm">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/shop/${cat.slug}`}
                    className="hover:text-[var(--color-gold)] transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/shop" className="hover:text-[var(--color-gold)] transition-colors">
                  View All
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-[var(--color-gold)] mb-4 font-semibold">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-[var(--color-gold)] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-[var(--color-gold)] mb-4 font-semibold">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-[var(--color-cream)]/70">
              <li>{site.address}</li>
              <li>
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-[var(--color-gold)]">
                  {site.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="hover:text-[var(--color-gold)]">
                  {site.email}
                </a>
              </li>
              <li className="pt-2">
                <span className="text-[var(--color-gold)]">{site.instagramHandle}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-4 text-xs text-[var(--color-cream)]/50">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p>Orders confirmed via WhatsApp · Pan-India shipping</p>
        </div>
      </div>
    </footer>
  );
}
