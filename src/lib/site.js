/** @typedef {'sarees' | 'lehengas' | 'dresses' | 'kurtis' | 'dupattas' | 'new-arrivals'} CategorySlug */

export const site = {
  name: "Maguva Ethnics",
  tagline: "Premium Indian Ethnic Wear for Women",
  description:
    "Discover handpicked sarees, lehengas, dresses and kurtis. Curated collections inspired by timeless Indian craftsmanship.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://maguvaethnics.com",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918500947079",
  instagram: "https://www.instagram.com/maguva_ethinics",
  instagramHandle: "@maguva_ethinics",
  email: "hello@maguvaethnics.com",
  phone: "+91 85009 47079",
  address: "Hyderabad, Telangana, India",
  currency: "INR",
  locale: "en-IN",
};

export const announcements = [
  "Free shipping on all orders across India",
  "WhatsApp us for international shipping",
  "24/7 customer support on WhatsApp",
];

/** Featured category promos for homepage banner grid */
export const categoryPromos = [
  {
    slug: "sarees",
    href: "/shop/sarees",
    discount: "Get 30% off",
    title: "Women's Latest Saree Collection",
    image:
      "https://images.unsplash.com/photo-1583391733981-5b1502099ba3?w=800&q=80",
    layout: "horizontal",
  },
  {
    slug: "kurtis",
    href: "/shop/kurtis",
    discount: "Get 40% off",
    title: "Women's Latest Kurti Collection",
    image:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e3510?w=800&q=80",
    layout: "horizontal",
  },
  {
    slug: "lehengas",
    href: "/shop/lehengas",
    discount: "Get 30% off",
    title: "Best Collection for Festive & Bridal",
    image:
      "https://images.unsplash.com/photo-1610030469983-7bf46ee832b8?w=800&q=80",
    layout: "featured",
  },
];

export const categories = [
  {
    slug: "sarees",
    name: "Sarees",
    description: "Silk, cotton & designer drapes",
    image:
      "https://images.unsplash.com/photo-1583391733981-5b1502099ba3?w=800&q=80",
    count: 48,
  },
  {
    slug: "lehengas",
    name: "Lehengas",
    description: "Festive & bridal ensembles",
    image:
      "https://images.unsplash.com/photo-1610030469983-7bf46ee832b8?w=800&q=80",
    count: 21,
  },
  {
    slug: "dresses",
    name: "Dresses",
    description: "Indo-western & ethnic gowns",
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b1?w=800&q=80",
    count: 23,
  },
  {
    slug: "kurtis",
    name: "Kurtis",
    description: "Everyday elegance",
    image:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e3510?w=800&q=80",
    count: 32,
  },
  {
    slug: "dupattas",
    name: "Dupattas",
    description: "Complete your look",
    image:
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&q=80",
    count: 15,
  },
  {
    slug: "new-arrivals",
    name: "New Arrivals",
    description: "Fresh from our studio",
    image:
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80",
    count: 12,
  },
];

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/about", label: "Our Story" },
  { href: "/contact", label: "Contact" },
];
