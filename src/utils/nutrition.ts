// Nutrition estimator — ประมาณการแคลอรี่และสารอาหารจาก ingredients (กรณีที่ไม่ได้ใส่ในไฟล์ .md)

export interface NutritionEstimate {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sodium: number;
  fiber: number;
  isEstimated: true;
}

// ประมาณการ kcal/100g ของวัตถุดิบทั่วไป (ค่าโดยประมาณ, ใช้สำหรับ estimate)
const NUTRITION_DB: Record<string, { kcal: number; protein: number; carbs: number; fat: number; sodium: number; fiber: number }> = {
  // เนื้อสัตว์ (ต่อ 100 กรัม)
  'หมูสับ':       { kcal: 250, protein: 20, carbs: 0,  fat: 18, sodium: 60,  fiber: 0 },
  'หมูสามชั้น':   { kcal: 540, protein: 14, carbs: 0,  fat: 53, sodium: 50,  fiber: 0 },
  'หมูสันใน':     { kcal: 145, protein: 22, carbs: 0,  fat: 5,  sodium: 50,  fiber: 0 },
  'หมูสันคอ':     { kcal: 220, protein: 19, carbs: 0,  fat: 16, sodium: 55,  fiber: 0 },
  'ไก่':          { kcal: 165, protein: 25, carbs: 0,  fat: 7,  sodium: 70,  fiber: 0 },
  'สะโพกไก่':     { kcal: 175, protein: 22, carbs: 0,  fat: 9,  sodium: 80,  fiber: 0 },
  'เนื้อ':        { kcal: 200, protein: 26, carbs: 0,  fat: 11, sodium: 60,  fiber: 0 },
  'กุ้ง':         { kcal: 99,  protein: 24, carbs: 0,  fat: 0.3,sodium: 110, fiber: 0 },
  'ปลาหมึก':      { kcal: 92,  protein: 16, carbs: 3,  fat: 1.4,sodium: 44,  fiber: 0 },
  'ปลา':          { kcal: 130, protein: 22, carbs: 0,  fat: 5,  sodium: 50,  fiber: 0 },
  'ไข่':          { kcal: 155, protein: 13, carbs: 1,  fat: 11, sodium: 124, fiber: 0 },
  'หอย':          { kcal: 86,  protein: 12, carbs: 4,  fat: 2,  sodium: 286, fiber: 0 },

  // ผัก
  'ผัก':          { kcal: 30,  protein: 2,  carbs: 6,  fat: 0,  sodium: 20,  fiber: 2 },
  'ใบกะเพรา':     { kcal: 23,  protein: 3,  carbs: 3,  fat: 0,  sodium: 4,   fiber: 1.6 },
  'ใบโหระพา':     { kcal: 22,  protein: 3,  carbs: 3,  fat: 0,  sodium: 4,   fiber: 1.6 },
  'ใบมะกรูด':     { kcal: 47,  protein: 4,  carbs: 11, fat: 0.5,sodium: 5,   fiber: 4 },
  'ตะไคร้':       { kcal: 99,  protein: 1.8,carbs: 25, fat: 0.5,sodium: 6,   fiber: 0.6 },
  'ข่า':          { kcal: 71,  protein: 2,  carbs: 16, fat: 0.7,sodium: 2,   fiber: 4 },
  'พริก':         { kcal: 40,  protein: 2,  carbs: 9,  fat: 0.4,sodium: 3,   fiber: 1.5 },
  'หอมแดง':       { kcal: 72,  protein: 2.5,carbs: 17, fat: 0.1,sodium: 12,  fiber: 3 },
  'หอมใหญ่':      { kcal: 40,  protein: 1.1,carbs: 9,  fat: 0.1,sodium: 4,   fiber: 1.7 },
  'กระเทียม':     { kcal: 149, protein: 6,  carbs: 33, fat: 0.5,sodium: 17,  fiber: 2 },
  'ขิง':          { kcal: 80,  protein: 1.8,carbs: 18, fat: 0.8,sodium: 13,  fiber: 2 },
  'มะเขือ':       { kcal: 25,  protein: 1,  carbs: 6,  fat: 0.2,sodium: 2,   fiber: 3 },
  'ถั่วฝักยาว':   { kcal: 47,  protein: 2.8,carbs: 8,  fat: 0.4,sodium: 4,   fiber: 4 },
  'แครอท':        { kcal: 41,  protein: 0.9,carbs: 10, fat: 0.2,sodium: 69,  fiber: 2.8 },
  'ผักบุ้ง':      { kcal: 19,  protein: 2.6,carbs: 3.1,fat: 0.2,sodium: 113, fiber: 2.1 },
  'คะน้า':        { kcal: 35,  protein: 2.7,carbs: 6,  fat: 0.6,sodium: 53,  fiber: 4 },

  // เครื่องปรุง (ต่อ ~15g = 1 ช้อนโต๊ะ)
  'น้ำปลา':       { kcal: 35,  protein: 5,  carbs: 4,  fat: 0,  sodium: 1413,fiber: 0 },
  'น้ำมันหอย':    { kcal: 51,  protein: 1,  carbs: 11, fat: 0,  sodium: 492, fiber: 0 },
  'ซีอิ๊วขาว':    { kcal: 56,  protein: 5,  carbs: 7,  fat: 0.1,sodium: 4583,fiber: 0.7 },
  'ซีอิ๊วดำ':     { kcal: 56,  protein: 5,  carbs: 9,  fat: 0,  sodium: 3000,fiber: 0 },
  'พริกแกง':      { kcal: 110, protein: 3,  carbs: 12, fat: 6,  sodium: 1500,fiber: 4 },
  'กะทิ':         { kcal: 230, protein: 2.3,carbs: 6,  fat: 24, sodium: 15,  fiber: 2.2 },
  'น้ำตาลปี๊บ':   { kcal: 380, protein: 1,  carbs: 95, fat: 0,  sodium: 30,  fiber: 0 },
  'น้ำตาล':       { kcal: 387, protein: 0,  carbs: 100,fat: 0,  sodium: 1,   fiber: 0 },
  'น้ำมัน':       { kcal: 884, protein: 0,  carbs: 0,  fat: 100,sodium: 0,   fiber: 0 },
  'มะนาว':        { kcal: 29,  protein: 1.1,carbs: 9,  fat: 0.3,sodium: 2,   fiber: 2.8 },

  // เส้น/แป้ง
  'ข้าว':         { kcal: 130, protein: 3,  carbs: 28, fat: 0.3,sodium: 1,   fiber: 0.4 },
  'ข้าวสวย':      { kcal: 130, protein: 3,  carbs: 28, fat: 0.3,sodium: 1,   fiber: 0.4 },
  'เส้น':         { kcal: 109, protein: 2,  carbs: 25, fat: 0.2,sodium: 4,   fiber: 1 },
  'บะหมี่':       { kcal: 138, protein: 5,  carbs: 25, fat: 2,  sodium: 5,   fiber: 1.2 },
  'วุ้นเส้น':     { kcal: 86,  protein: 0,  carbs: 21, fat: 0,  sodium: 4,   fiber: 0.5 },
  'แป้ง':         { kcal: 364, protein: 10, carbs: 76, fat: 1,  sodium: 2,   fiber: 2.7 },
  'ขนมจีน':       { kcal: 109, protein: 2.7,carbs: 25, fat: 0.5,sodium: 5,   fiber: 0.6 },

  // อื่นๆ
  'ถั่วลิสง':     { kcal: 567, protein: 26, carbs: 16, fat: 49, sodium: 18,  fiber: 8.5 },
  'ถั่วงอก':      { kcal: 30,  protein: 3,  carbs: 6,  fat: 0.2,sodium: 6,   fiber: 1.8 },
  'เห็ด':         { kcal: 22,  protein: 3.1,carbs: 3.3,fat: 0.3,sodium: 5,   fiber: 1 },
  'เต้าหู้':      { kcal: 76,  protein: 8,  carbs: 1.9,fat: 4.8,sodium: 7,   fiber: 0.3 },
};

// แปลง amount เช่น "300 กรัม", "2 ช้อนโต๊ะ", "1 ฟอง" เป็นกรัมโดยประมาณ
function parseAmountToGrams(amount: string): number {
  if (!amount) return 0;
  const a = amount.toLowerCase();
  const numMatch = a.match(/(\d+(?:\.\d+)?)/);
  const num = numMatch ? parseFloat(numMatch[1]) : 1;

  if (/กิโล|กก|kg/.test(a)) return num * 1000;
  if (/กรัม|g\b/.test(a)) return num;
  if (/ช้อนโต๊ะ|tbsp/.test(a)) return num * 15;
  if (/ช้อนชา|tsp/.test(a)) return num * 5;
  if (/ถ้วย|cup/.test(a)) return num * 240;
  if (/ฟอง/.test(a)) return num * 50;       // ไข่
  if (/ตัว/.test(a)) return num * 30;        // กุ้ง/ปลา (ประมาณ)
  if (/ลูก/.test(a)) return num * 100;
  if (/หัว/.test(a)) return num * 30;        // หอม
  if (/กลีบ/.test(a)) return num * 5;        // กระเทียม
  if (/แว่น/.test(a)) return num * 5;
  if (/ใบ/.test(a)) return num * 1;
  if (/ต้น/.test(a)) return num * 20;
  if (/เม็ด/.test(a)) return num * 1;
  if (/ดอก/.test(a)) return num * 5;
  if (/กำ|กำมือ/.test(a)) return num * 30;
  // default
  return num * 50;
}

function findNutritionMatch(ingredientName: string): typeof NUTRITION_DB[string] | null {
  const name = ingredientName.toLowerCase();
  // หา match แบบ longest-first
  const keys = Object.keys(NUTRITION_DB).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    if (name.includes(key.toLowerCase())) return NUTRITION_DB[key];
  }
  return null;
}

export function estimateNutrition(
  ingredients: Array<{ name: string; amount: string }>,
  servings: number
): NutritionEstimate {
  const total = { kcal: 0, protein: 0, carbs: 0, fat: 0, sodium: 0, fiber: 0 };

  for (const ing of ingredients) {
    const match = findNutritionMatch(ing.name);
    if (!match) continue;
    const grams = parseAmountToGrams(ing.amount);
    const factor = grams / 100;
    total.kcal += match.kcal * factor;
    total.protein += match.protein * factor;
    total.carbs += match.carbs * factor;
    total.fat += match.fat * factor;
    total.sodium += match.sodium * factor;
    total.fiber += match.fiber * factor;
  }

  const s = Math.max(1, servings);
  return {
    calories: Math.round(total.kcal / s),
    protein: Math.round(total.protein / s),
    carbs: Math.round(total.carbs / s),
    fat: Math.round(total.fat / s),
    sodium: Math.round(total.sodium / s),
    fiber: Math.round((total.fiber / s) * 10) / 10,
    isEstimated: true,
  };
}

export function getDailyValuePercent(nutrient: string, value: number): number {
  // % Daily Value (อิงค่าแนะนำคนไทยเฉลี่ย 2000 kcal/วัน)
  const DV: Record<string, number> = {
    calories: 2000,
    protein: 50,
    carbs: 300,
    fat: 65,
    sodium: 2300,
    fiber: 25,
  };
  return Math.round((value / DV[nutrient]) * 100);
}
