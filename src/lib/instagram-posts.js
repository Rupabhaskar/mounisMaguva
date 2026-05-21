/**
 * Manual Instagram posts (fallback when API token is not set).
 *
 * How to add a post:
 * 1. Open the post on Instagram → ⋯ → Copy link
 * 2. Paste permalink below
 * 3. Optional: right-click the post image → copy image address → imageUrl
 *    (or leave imageUrl empty and use a shop image path)
 *
 * @typedef {Object} CuratedPost
 * @property {string} id
 * @property {string} permalink Full post URL
 * @property {string} imageUrl Image shown in the grid
 * @property {string} [caption]
 */

/** @type {CuratedPost[]} */
export const curatedInstagramPosts = [
  // Example — replace with your real posts from @maguva_ethinics:
  // {
  //   id: "post-1",
  //   permalink: "https://www.instagram.com/p/XXXXXXXX/",
  //   imageUrl: "https://images.pexels.com/photos/6311658/pexels-photo-6311658.jpeg?auto=compress&cs=tinysrgb&w=800",
  //   caption: "New Banarasi drop",
  // },
];
