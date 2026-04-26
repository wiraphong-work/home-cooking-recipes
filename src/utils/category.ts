// Category slug mapping (Thai → URL-safe slug)
export const CATEGORY_SLUGS: Record<string, string> = {
  'อาหารจานเดียว': 'one-dish',
  'แกง/ต้ม': 'curry-soup',
  'ยำ': 'yum',
  'ของหวาน': 'dessert',
  'ของว่าง': 'snack',
  'อาหารทะเล': 'seafood',
  'อาหารเช้า': 'breakfast',
  'เครื่องดื่ม': 'drink',
  'ก๋วยเตี๋ยว': 'noodle',
  'น้ำพริก': 'namprik',
  'อาหารทานเล่น': 'finger-food',
};

export const CATEGORY_INFO: Record<string, { emoji: string; description: string }> = {
  'อาหารจานเดียว': { emoji: '🍚', description: 'อาหารจานเดียวอิ่มท้อง ทำง่าย เหมาะกับมื้อกลางวันและเย็น' },
  'แกง/ต้ม': { emoji: '🍲', description: 'แกงไทยและต้มสมุนไพรหอมเครื่อง น้ำซุปเข้มข้น' },
  'ยำ': { emoji: '🥗', description: 'ยำรสจัดจ้าน เปรี้ยวเค็มเผ็ด สมุนไพรหอม' },
  'ของหวาน': { emoji: '🍮', description: 'ขนมไทยและของหวานทำเองได้ที่บ้าน' },
  'ของว่าง': { emoji: '🍢', description: 'ของกินเล่น ของทอด ทานเล่นสนุก' },
  'อาหารทะเล': { emoji: '🦐', description: 'อาหารทะเลสดเด้ง รสชาติจัดจ้าน' },
  'อาหารเช้า': { emoji: '🥣', description: 'อาหารเช้าอุ่นท้อง เริ่มวันสดชื่น' },
  'เครื่องดื่ม': { emoji: '🥤', description: 'เครื่องดื่มสมุนไพรไทย น้ำผลไม้สด' },
  'ก๋วยเตี๋ยว': { emoji: '🍜', description: 'ก๋วยเตี๋ยวสไตล์ต่างๆ น้ำใส น้ำตก น้ำข้น' },
  'น้ำพริก': { emoji: '🌶️', description: 'น้ำพริกไทย รสจัด หอมกะปิ' },
  'อาหารทานเล่น': { emoji: '🍿', description: 'อาหารทานเล่น ของขบเคี้ยว' },
};

export function categoryToSlug(category: string): string {
  return CATEGORY_SLUGS[category] || category.replace(/[^a-zA-Z0-9ก-๙]/g, '-').toLowerCase();
}

export function slugToCategory(slug: string): string | undefined {
  return Object.entries(CATEGORY_SLUGS).find(([, s]) => s === slug)?.[0];
}
