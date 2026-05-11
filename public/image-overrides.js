/**
 * Image Configuration
 *
 * 1. RECIPE_FORCE_SVG = false → ใช้รูปจริงจาก URL (default)
 *    ตั้งเป็น true ถ้าอยากให้ทุกสูตรใช้ SVG เฉพาะตัว
 *
 * 2. RECIPE_IMAGE_OVERRIDES = { slug: url } → กำหนดรูปเฉพาะให้บางสูตร
 *    - 'slug': 'URL'  → ใช้รูปจาก URL นั้น
 *    - 'slug': ''     → ใช้ SVG fallback (เฉพาะสูตรนั้น)
 */

window.RECIPE_FORCE_SVG = false;

window.RECIPE_IMAGE_OVERRIDES = {
  // ใส่ slug ที่อยาก override:
  // 'pad-krapow-moo': 'https://images.unsplash.com/photo-XXXX?w=1200&q=80',
  // 'som-tam-thai': '',  // empty = ใช้ SVG fallback

  // 5 สูตรใหม่ (2026-05-04) — ใช้ SVG fallback จนกว่าจะหารูปจริงที่ตรงเมนูได้
  'khanom-mor-gaeng-phueak': '',
  'khao-niao-moo-ping': '',
  'gai-pad-king': '',
  'miang-kham': '',
  'nam-krachiap-yen': '',
};
