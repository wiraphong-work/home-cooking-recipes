import { defineConfig } from 'astro/config';

// ========================================================
//  ตั้งค่าสำหรับ GitHub Pages
//  URL ปลายทาง: https://wiraphong-work.github.io/home-cooking-recipes/
// ========================================================
//
//  ถ้าวันหลังเปลี่ยนเป็น custom domain (เช่น kruabaanban.com):
//    1. ลบบรรทัด `base:` ออก
//    2. เปลี่ยน `site:` เป็น URL ของ domain
//    3. สร้างไฟล์ public/CNAME ที่มีชื่อ domain
//
export default defineConfig({
  site: 'https://wiraphong-work.github.io',
  base: '/home-cooking-recipes',
  trailingSlash: 'always',
  build: {
    format: 'directory'
  }
});
