// Helper สำหรับเดามื้ออาหารจากชื่อ/หมวด ในกรณีที่สูตรไม่ได้ระบุ field meal
export type Meal = 'เช้า' | 'กลางวัน' | 'เย็น' | 'ของว่าง';

export const MEALS: Meal[] = ['เช้า', 'กลางวัน', 'เย็น', 'ของว่าง'];

export const MEAL_INFO: Record<Meal, { emoji: string; label: string; hint: string }> = {
  'เช้า': { emoji: '🌅', label: 'มื้อเช้า', hint: 'อาหารเช้าเบาๆ ไม่หนักท้อง' },
  'กลางวัน': { emoji: '☀️', label: 'มื้อกลางวัน', hint: 'จานเดียวอิ่มท้อง ทำได้รวดเร็ว' },
  'เย็น': { emoji: '🌙', label: 'มื้อเย็น', hint: 'กับข้าวจัดเต็ม รวมแกงและผัด' },
  'ของว่าง': { emoji: '🍰', label: 'ของว่าง', hint: 'ของกินเล่น ของหวาน เครื่องดื่ม' },
};

interface RecipeLike {
  title: string;
  category: string;
  meal?: Meal[];
}

/**
 * ระบุมื้อของสูตร — ถ้ามี field meal กำหนดไว้ ใช้อันนั้น ถ้าไม่มี เดาจากชื่อ/หมวด
 */
export function getMeals(recipe: RecipeLike): Meal[] {
  if (recipe.meal && recipe.meal.length > 0) return recipe.meal;

  const t = recipe.title;
  const c = recipe.category;

  // มื้อเช้าโดยเฉพาะ
  if (/โจ๊ก|ข้าวต้ม|ปาท่องโก๋|ติ่มซำ|ไข่กระทะ|ขนมปัง|ซีเรียล|ซุป.*เช้า/.test(t)) {
    return ['เช้า'];
  }

  // ของว่าง / ของหวาน / เครื่องดื่ม
  if (
    c.includes('ของหวาน') ||
    c.includes('ของว่าง') ||
    c.includes('เครื่องดื่ม') ||
    c.includes('ขนม') ||
    /ทอดกรอบ|ปีกไก่ทอด|ปอเปี๊ยะ|ลูกชิ้น|ขนม|ของว่าง/.test(t)
  ) {
    return ['ของว่าง'];
  }

  // ยำ/น้ำพริก — กลางวัน + เย็น
  if (/^ยำ|น้ำพริก|เมี่ยง/.test(t)) {
    return ['กลางวัน', 'เย็น'];
  }

  // อาหารจานเดียว — กลางวันเป็นหลัก แต่ทานเย็นก็ได้
  if (c.includes('จานเดียว') || /ก๋วยเตี๋ยว|ข้าวมัน|ข้าวหมู|ผัดไทย|ผัดซีอิ๊ว/.test(t)) {
    return ['กลางวัน', 'เย็น'];
  }

  // แกง/ต้ม/ผัด — เป็นกับข้าว เน้นเย็น
  if (/แกง|ต้ม|ผัด|ทอด|นึ่ง|อบ/.test(t)) {
    return ['กลางวัน', 'เย็น'];
  }

  // default
  return ['กลางวัน', 'เย็น'];
}

/**
 * เลือกสูตรประจำวัน — deterministic ตามวันที่ (เปลี่ยนทุก 00:00)
 * ใช้ได้ทั้ง server side (Astro build) และ client side
 */
export function pickRecipeOfTheDay<T>(items: T[], date: Date = new Date()): T {
  if (items.length === 0) throw new Error('No recipes available');
  // วันที่ของปี (1-366) เป็นเลขสุ่มที่เปลี่ยนทุกวัน
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const diff = date.getTime() - start;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  // ผสมกับ year เพื่อให้ปีต่อๆ ไปไม่ซ้ำ pattern
  const seed = (dayOfYear * 31 + date.getUTCFullYear() * 7) % items.length;
  return items[seed];
}
