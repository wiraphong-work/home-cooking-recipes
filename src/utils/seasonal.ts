// Seasonal/festival mapping — keyword ที่ตรงกับ title/description ของสูตร
export interface SeasonalCollection {
  slug: string;
  title: string;
  emoji: string;
  description: string;
  matchKeywords: string[];   // คำที่ค้นใน title/description/category
  monthsActive?: number[];   // 1-12 (เดือนที่ relevant — สำหรับ recommend ใน hero)
}

export const SEASONAL_COLLECTIONS: SeasonalCollection[] = [
  {
    slug: 'songkran',
    title: 'เมนูสงกรานต์',
    emoji: '💦',
    description: 'อาหารเย็นๆ ดับร้อน เหมาะกับสงกรานต์เดือนเมษายน — ส้มตำ ลาบ น้ำพริก ของหวานเย็น',
    matchKeywords: ['ส้มตำ', 'ลาบ', 'น้ำพริก', 'ยำ', 'แกงส้ม', 'ทับทิม', 'ลอดช่อง', 'ขนมเย็น', 'ข้าวเหนียวมะม่วง'],
    monthsActive: [4, 5],
  },
  {
    slug: 'rainy-season',
    title: 'เมนูหน้าฝน อุ่นท้อง',
    emoji: '🌧️',
    description: 'อากาศชื้นเย็น อยากกินอะไรร้อนๆ ซดน้ำซุปคล่องคอ — ต้มยำ ต้มข่า โจ๊ก แกงเผ็ด',
    matchKeywords: ['ต้มยำ', 'ต้มข่า', 'แกง', 'ต้ม', 'โจ๊ก', 'ซุป', 'บะหมี่', 'เกี๊ยว', 'ก๋วยเตี๋ยว'],
    monthsActive: [6, 7, 8, 9, 10],
  },
  {
    slug: 'winter',
    title: 'เมนูหน้าหนาว ของอุ่น',
    emoji: '❄️',
    description: 'หน้าหนาวอยากกินอะไรร้อนๆ — สุกี้ ต้มจืด แกงจืด ของอุ่นๆ',
    matchKeywords: ['สุกี้', 'ต้ม', 'แกง', 'ชาบู', 'หม้อไฟ', 'น้ำขิง', 'บัวลอย', 'อบ'],
    monthsActive: [11, 12, 1, 2],
  },
  {
    slug: 'lazy-day',
    title: 'เมนูทำง่าย 15 นาที',
    emoji: '⚡',
    description: 'วันขี้เกียจ อยากทำเร็วๆ ไม่อยากยืนหน้าเตาเป็นชั่วโมง — เมนูเสร็จใน 15 นาที',
    matchKeywords: ['ผัด', 'ไข่เจียว', 'ไข่ดาว', 'ทอด', 'ลวก'],
  },
  {
    slug: 'family-feast',
    title: 'เมนูพร้อมเสิร์ฟทั้งครอบครัว',
    emoji: '👨‍👩‍👧‍👦',
    description: 'รวมญาติ จัดสำรับใหญ่ — แกง ต้ม ยำ ผัด ของหวาน ครบเครื่อง',
    matchKeywords: ['แกง', 'ต้ม', 'ยำ', 'ทอด', 'อบ', 'นึ่ง', 'ราด', 'หมูสะเต๊ะ', 'ปอเปี๊ยะ'],
  },
  {
    slug: 'street-food',
    title: 'เมนูสตรีทฟู้ดอร่อยติดดาว',
    emoji: '🛺',
    description: 'อาหารริมทางที่คนไทยรักที่สุด — ผัดกะเพรา ก๋วยเตี๋ยว ผัดไทย หมูปิ้ง',
    matchKeywords: ['กะเพรา', 'ผัดไทย', 'ก๋วยเตี๋ยว', 'หมูปิ้ง', 'หมูสะเต๊ะ', 'ข้าวมัน', 'ข้าวขาหมู', 'บะหมี่'],
  },
  {
    slug: 'kids-friendly',
    title: 'เมนูเด็กกินได้ ไม่เผ็ด',
    emoji: '👶',
    description: 'รสชาติอ่อน ไม่เผ็ด เหมาะกับเด็กและผู้สูงอายุ — ไข่เจียว ผัดน้ำมันหอย ของหวาน',
    matchKeywords: ['ไข่เจียว', 'ไข่ดาว', 'น้ำมันหอย', 'ข้าวมันไก่', 'แกงจืด', 'นึ่ง', 'ขนม', 'ของหวาน'],
  },
  {
    slug: 'office-lunch',
    title: 'เมนูข้าวกล่องไปออฟฟิศ',
    emoji: '🍱',
    description: 'อาหารทำไว้ตอนเช้า เก็บได้ทั้งวัน อุ่นง่าย — ผัด ทอด แกงข้น',
    matchKeywords: ['ผัด', 'ทอด', 'หมูสับ', 'ไก่', 'ข้าวผัด', 'พะโล้'],
  },
];

export function getSeasonalCollection(slug: string): SeasonalCollection | undefined {
  return SEASONAL_COLLECTIONS.find((c) => c.slug === slug);
}

export function isCollectionActiveNow(c: SeasonalCollection, now = new Date()): boolean {
  if (!c.monthsActive) return true;
  return c.monthsActive.includes(now.getMonth() + 1);
}

export function recipeMatchesCollection(
  recipe: { title: string; description: string; category: string },
  c: SeasonalCollection
): boolean {
  const text = (recipe.title + ' ' + recipe.description + ' ' + recipe.category).toLowerCase();
  return c.matchKeywords.some((kw) => text.includes(kw.toLowerCase()));
}
