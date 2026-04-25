import { defineCollection, z } from 'astro:content';

// Schema สำหรับ recipe
const recipes = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
    prepTime: z.string(),        // เช่น "PT10M" = 10 นาที
    cookTime: z.string(),        // เช่น "PT20M" = 20 นาที
    totalTime: z.string(),       // เช่น "PT30M"
    servings: z.number(),
    category: z.string(),        // เช่น "อาหารจานเดียว", "ของหวาน"
    publishDate: z.date(),
    ingredients: z.array(z.object({
      name: z.string(),
      amount: z.string(),
      buyUrl: z.string().optional(),   // ลิงก์ Shopee/Lazada affiliate
    })),
    steps: z.array(z.string()),
    tools: z.array(z.object({
      name: z.string(),
      image: z.string(),
      url: z.string(),
      note: z.string().optional(),
    })).optional(),
    tips: z.string().optional(),
  }),
});

export const collections = { recipes };
