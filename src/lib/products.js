/** @typedef {import('./site').CategorySlug} CategorySlug */

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} slug
 * @property {string} sku
 * @property {string} name
 * @property {string} description
 * @property {number} price
 * @property {number} [originalPrice]
 * @property {CategorySlug} category
 * @property {string[]} images
 * @property {string} fabric
 * @property {string} color
 * @property {string[]} sizes
 * @property {boolean} isNew
 * @property {boolean} isBestSeller
 * @property {boolean} inStock
 * @property {string[]} tags
 */

/** @type {Product[]} */
export const products = [
  {
    id: "1",
    slug: "banarasi-silk-saree-royal-maroon",
    sku: "ME-S001",
    name: "Banarasi Silk Saree — Royal Maroon",
    description:
      "Luxurious Banarasi weave with zari border. Perfect for weddings and festive occasions. Includes matching blouse piece.",
    price: 4500,
    originalPrice: 5200,
    category: "sarees",
    images: [
      "https://images.unsplash.com/photo-1583391733981-5b1502099ba3?w=1200&q=85",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e3510?w=1200&q=85",
    ],
    fabric: "Pure Silk",
    color: "Maroon & Gold",
    sizes: ["Free Size"],
    isNew: true,
    isBestSeller: true,
    inStock: true,
    tags: ["wedding", "silk", "festive"],
  },
  {
    id: "2",
    slug: "kanjivaram-gold-border-green",
    sku: "ME-S002",
    name: "Kanjivaram Saree — Temple Gold Border",
    description:
      "Classic Kanjivaram with rich temple border and contrast pallu. Handloom finish with premium drape.",
    price: 6800,
    category: "sarees",
    images: [
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=1200&q=85",
    ],
    fabric: "Kanjivaram Silk",
    color: "Emerald Green",
    sizes: ["Free Size"],
    isNew: true,
    isBestSeller: false,
    inStock: true,
    tags: ["handloom", "wedding"],
  },
  {
    id: "3",
    slug: "organza-floral-saree-blush",
    sku: "ME-S003",
    name: "Organza Floral Saree — Blush Pink",
    description:
      "Lightweight organza with delicate floral embroidery. Ideal for receptions and daytime celebrations.",
    price: 3200,
    originalPrice: 3800,
    category: "sarees",
    images: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1200&q=85",
    ],
    fabric: "Organza",
    color: "Blush Pink",
    sizes: ["Free Size"],
    isNew: false,
    isBestSeller: true,
    inStock: true,
    tags: ["lightweight", "party"],
  },
  {
    id: "4",
    slug: "bridal-lehenga-crimson-gold",
    sku: "ME-L001",
    name: "Bridal Lehenga Set — Crimson & Gold",
    description:
      "Heavy embroidered lehenga with dupatta and blouse. Intricate zardozi work for your special day.",
    price: 18500,
    originalPrice: 22000,
    category: "lehengas",
    images: [
      "https://images.unsplash.com/photo-1610030469983-7bf46ee832b8?w=1200&q=85",
    ],
    fabric: "Velvet & Net",
    color: "Crimson Red",
    sizes: ["S", "M", "L", "XL"],
    isNew: true,
    isBestSeller: true,
    inStock: true,
    tags: ["bridal", "wedding"],
  },
  {
    id: "5",
    slug: "festive-lehenga-teal-mirror",
    sku: "ME-L002",
    name: "Festive Lehenga — Teal Mirror Work",
    description:
      "Vibrant teal lehenga with mirror embellishments. Lightweight and comfortable for sangeet nights.",
    price: 8900,
    category: "lehengas",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b1?w=1200&q=85",
    ],
    fabric: "Georgette",
    color: "Teal Blue",
    sizes: ["S", "M", "L", "XL", "XXL"],
    isNew: true,
    isBestSeller: false,
    inStock: true,
    tags: ["festive", "party"],
  },
  {
    id: "6",
    slug: "indo-western-gown-ivory",
    sku: "ME-D001",
    name: "Indo-Western Gown — Ivory Pearl",
    description:
      "Flowing A-line gown with pearl detailing. A modern ethnic look for cocktail events.",
    price: 4200,
    category: "dresses",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b1?w=1200&q=85",
    ],
    fabric: "Georgette",
    color: "Ivory",
    sizes: ["S", "M", "L"],
    isNew: true,
    isBestSeller: true,
    inStock: true,
    tags: ["indo-western", "party"],
  },
  {
    id: "7",
    slug: "anarkali-dress-mustard",
    sku: "ME-D002",
    name: "Anarkali Dress — Mustard Gold",
    description:
      "Floor-length anarkali with gold gota work. Paired look ready with matching dupatta.",
    price: 3500,
    originalPrice: 4100,
    category: "dresses",
    images: [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e3510?w=1200&q=85",
    ],
    fabric: "Cotton Silk",
    color: "Mustard",
    sizes: ["S", "M", "L", "XL"],
    isNew: false,
    isBestSeller: true,
    inStock: true,
    tags: ["anarkali", "festive"],
  },
  {
    id: "8",
    slug: "cotton-kurti-block-print",
    sku: "ME-K001",
    name: "Block Print Cotton Kurti — Indigo",
    description:
      "Breathable cotton kurti with traditional block print. Perfect for daily wear and casual outings.",
    price: 1299,
    category: "kurtis",
    images: [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e3510?w=1200&q=85",
    ],
    fabric: "Cotton",
    color: "Indigo White",
    sizes: ["S", "M", "L", "XL", "XXL"],
    isNew: false,
    isBestSeller: true,
    inStock: true,
    tags: ["daily-wear", "cotton"],
  },
  {
    id: "9",
    slug: "embroidered-kurti-peach",
    sku: "ME-K002",
    name: "Embroidered Kurti — Peach Blossom",
    description:
      "Soft peach kurti with thread embroidery on neckline and sleeves. Office-to-evening versatile.",
    price: 1899,
    category: "kurtis",
    images: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1200&q=85",
    ],
    fabric: "Rayon",
    color: "Peach",
    sizes: ["S", "M", "L", "XL"],
    isNew: true,
    isBestSeller: false,
    inStock: true,
    tags: ["embroidered", "office"],
  },
  {
    id: "10",
    slug: "banarasi-dupatta-gold",
    sku: "ME-DP001",
    name: "Banarasi Dupatta — Gold Brocade",
    description:
      "Rich brocade dupatta to elevate any outfit. Versatile pairing with sarees and lehengas.",
    price: 1499,
    category: "dupattas",
    images: [
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=1200&q=85",
    ],
    fabric: "Brocade",
    color: "Gold",
    sizes: ["Free Size"],
    isNew: true,
    isBestSeller: false,
    inStock: true,
    tags: ["accessory"],
  },
  {
    id: "11",
    slug: "chiffon-saree-lavender",
    sku: "ME-S004",
    name: "Chiffon Saree — Lavender Ombre",
    description:
      "Gradient lavender chiffon with sequin border. Easy drape for parties and pujas.",
    price: 2500,
    category: "sarees",
    images: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1200&q=85",
    ],
    fabric: "Chiffon",
    color: "Lavender",
    sizes: ["Free Size"],
    isNew: true,
    isBestSeller: false,
    inStock: true,
    tags: ["party", "lightweight"],
  },
  {
    id: "12",
    slug: "party-lehenga-rose-gold",
    sku: "ME-L003",
    name: "Party Lehenga — Rose Gold Sequin",
    description:
      "Glamorous rose gold lehenga with all-over sequins. Turn heads at every celebration.",
    price: 7200,
    originalPrice: 8500,
    category: "lehengas",
    images: [
      "https://images.unsplash.com/photo-1610030469983-7bf46ee832b8?w=1200&q=85",
    ],
    fabric: "Net",
    color: "Rose Gold",
    sizes: ["S", "M", "L"],
    isNew: true,
    isBestSeller: true,
    inStock: true,
    tags: ["party", "sequin"],
  },
];

/**
 * @param {string} slug
 * @returns {Product | undefined}
 */
export function getProductBySlug(slug) {
  return products.find((p) => p.slug === slug);
}

/**
 * @param {CategorySlug | 'all'} category
 * @returns {Product[]}
 */
export function getProductsByCategory(category) {
  if (category === "all" || category === "new-arrivals") {
    if (category === "new-arrivals") {
      return products.filter((p) => p.isNew);
    }
    return products;
  }
  return products.filter((p) => p.category === category);
}

export function getNewArrivals(limit = 8) {
  return products.filter((p) => p.isNew).slice(0, limit);
}

export function getBestSellers(limit = 8) {
  return products.filter((p) => p.isBestSeller).slice(0, limit);
}

export function getRelatedProducts(product, limit = 4) {
  return products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
}
