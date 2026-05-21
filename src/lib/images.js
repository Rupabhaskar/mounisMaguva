/**
 * Verified fashion / ethnic-wear image URLs (Pexels + stable Unsplash).
 * @param {number} id Pexels photo id
 * @param {number} [w=1200]
 */
export function pexels(id, w = 1200) {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
}

/** @param {string} slug Unsplash photo slug (id-suffix) */
export function unsplash(slug, w = 1200) {
  return `https://images.unsplash.com/photo-${slug}?auto=format&fit=crop&w=${w}&q=85`;
}

/** Curated pool — all URLs return 200 */
export const fashionImages = {
  sareeRed: pexels(6311658),
  sareeDrape: pexels(1926769),
  sareeGold: unsplash("1601924994987-69e26d50dc26"),
  sareePink: unsplash("1566174053879-31528523f8ae"),
  sareeLavender: pexels(6311392),
  lehengaBridal: pexels(1485031),
  lehengaFestive: pexels(7671166),
  lehengaParty: pexels(994523),
  dressGown: pexels(1536619),
  dressAnarkali: pexels(1183266),
  kurtiIndigo: pexels(1126994),
  kurtiPeach: pexels(985635),
  dupatta: pexels(267280),
  fashionEditorial: unsplash("1490481651871-ab68de25d43d"),
  hero: pexels(6311658, 1400),
  collectionsBanner: pexels(1926769, 1600),
};
