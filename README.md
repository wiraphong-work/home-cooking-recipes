# ครัวบ้านๆ · Thai Recipe Affiliate Site 🍜

เว็บไซต์สูตรอาหารไทยสำเร็จรูป พร้อม Affiliate Link สำหรับ Shopee/Lazada
สร้างด้วย **Astro** + deploy ฟรี 100% บน **Cloudflare Pages** หรือ **GitHub Pages**

## สิ่งที่ได้

- เว็บสวยๆ responsive ใช้ได้ทั้งมือถือและคอมพ์
- รองรับ **Google Recipe Schema** (รูปดาว เวลาทำ แสดงบนหน้าค้นหา Google)
- ใส่ Affiliate Link ได้ 2 จุดต่อสูตร: ลิงก์วัตถุดิบ + ลิงก์อุปกรณ์
- SEO พื้นฐานครบ (Open Graph, Canonical URL, Sitemap พร้อม)
- เว็บเร็วมาก (Static HTML คะแนน PageSpeed 95+)
- โหลดเว็บฟรีตลอดชีพ ไม่มีโฆษณาของแพลตฟอร์ม

---

## วิธีติดตั้ง (ทำครั้งเดียว ~30 นาที)

### 1. ลงโปรแกรมที่ต้องใช้ (ฟรีหมด)

- **Node.js** (เวอร์ชัน 18 ขึ้นไป) → ดาวน์โหลด https://nodejs.org
- **VS Code** (โปรแกรมเขียนโค้ด) → ดาวน์โหลด https://code.visualstudio.com
- **Git** → ดาวน์โหลด https://git-scm.com
- สมัคร **GitHub** (ฟรี) → https://github.com

### 2. ทดลองรันเว็บบนเครื่องตัวเอง

เปิด Terminal (หรือ Command Prompt) ที่โฟลเดอร์นี้แล้วพิมพ์:

```bash
npm install
npm run dev
```

เปิดเบราว์เซอร์ไปที่ `http://localhost:4321` จะเห็นเว็บแล้ว ✨

### 3. แก้ไข site URL

เปิดไฟล์ `astro.config.mjs` แล้วแก้บรรทัด `site:` เป็น URL ของเว็บคุณ (จะได้หลัง deploy)

---

## วิธี Deploy เว็บขึ้นออนไลน์ (ฟรี)

### ตัวเลือก A: Cloudflare Pages (แนะนำ — ง่ายและเร็วที่สุด)

1. สมัคร Cloudflare ฟรีที่ https://dash.cloudflare.com/sign-up
2. สร้าง repository ใหม่บน GitHub แล้ว push โค้ดนี้ขึ้นไป
3. ใน Cloudflare Dashboard เลือก **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
4. เลือก repository ของคุณ
5. ตั้งค่า build:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
6. กด **Save and Deploy**
7. รอ 1-2 นาที จะได้ URL แบบ `yourname.pages.dev`

ทุกครั้งที่ push โค้ดใหม่ขึ้น GitHub เว็บจะอัพเดทอัตโนมัติ

### ตัวเลือก B: GitHub Pages

1. push โค้ดขึ้น GitHub repository
2. สร้างไฟล์ `.github/workflows/deploy.yml` (ดูตัวอย่างใน https://docs.astro.build/en/guides/deploy/github)
3. ใน repository ไปที่ **Settings → Pages** เลือก source เป็น **GitHub Actions**
4. รอ build เสร็จ จะได้ URL แบบ `username.github.io/repo-name`

---

## วิธีเพิ่มสูตรใหม่

1. ไปที่โฟลเดอร์ `src/content/recipes/`
2. สร้างไฟล์ใหม่ เช่น `pad-thai.md`
3. ก๊อป template จากไฟล์สูตรที่มีอยู่ (เช่น `pad-krapow-moo.md`) แล้วแก้เนื้อหา
4. บันทึก → รีเฟรชเบราว์เซอร์ → สูตรใหม่จะขึ้นบนหน้าแรกทันที

**โครงสร้าง Markdown แต่ละสูตร:**

```markdown
---
title: "ชื่อเมนู"
description: "คำอธิบายสั้นๆ"
image: "URL รูปภาพ"
prepTime: "PT10M"    # 10 นาที (ISO 8601 format)
cookTime: "PT20M"    # 20 นาที
totalTime: "PT30M"   # 30 นาที
servings: 2
category: "อาหารจานเดียว"
publishDate: 2026-04-25
ingredients:
  - name: "วัตถุดิบ"
    amount: "ปริมาณ"
    buyUrl: "ลิงก์ affiliate ถ้าต้องการ"
steps:
  - "ขั้นตอนที่ 1"
  - "ขั้นตอนที่ 2"
tools:
  - name: "ชื่ออุปกรณ์"
    image: "รูปสินค้า"
    url: "ลิงก์ affiliate"
    note: "คำอธิบายสั้นๆ"
tips: "เคล็ดลับ (optional)"
---

เนื้อหาบทความเพิ่มเติมเขียนตรงนี้ (optional)
```

---

## วิธีใส่ Shopee/Lazada Affiliate Link

### Shopee Affiliate

1. สมัครที่ https://affiliate.shopee.co.th/
2. เข้าสู่ระบบแล้วไปที่ **"สร้างลิงก์"** (Shortlink)
3. วาง URL สินค้า → ได้ลิงก์สั้น เช่น `https://shope.ee/ABC123`
4. ก๊อปไปใส่ในช่อง `buyUrl` หรือ `url` ในไฟล์สูตร

### Lazada Affiliate

1. สมัครที่ https://www.lazada.co.th/affiliate/
2. ใช้ Link Builder สร้าง affiliate link
3. ก๊อปไปใส่ในไฟล์สูตร

---

## วิธีปรับแต่ง

| ต้องการ | ไฟล์ที่แก้ |
|---|---|
| เปลี่ยนชื่อเว็บ/โลโก้ | `src/components/Header.astro` |
| เปลี่ยนสีหลัก | `src/styles/global.css` → `--color-primary` |
| เพิ่มหน้าใหม่ | สร้างไฟล์ใหม่ใน `src/pages/` |
| แก้ข้อความ Footer | `src/components/Footer.astro` |
| แก้ About | `src/pages/about.astro` |

---

## Checklist ก่อนเริ่มหารายได้

- [ ] สมัคร Shopee Affiliate / Lazada Affiliate
- [ ] เปลี่ยน Affiliate Link placeholder ในไฟล์สูตรให้เป็นลิงก์จริงของคุณ
- [ ] เปลี่ยนชื่อเว็บ/โลโก้ให้เป็นของคุณเอง
- [ ] เปลี่ยน email ติดต่อในหน้า About
- [ ] Deploy ขึ้น Cloudflare Pages
- [ ] สมัคร Google Search Console แล้ว submit sitemap
- [ ] เริ่มเขียนสูตรเพิ่ม อย่างน้อยเดือนละ 8-10 สูตร

---

## โครงสร้างโฟลเดอร์

```
recipe-site/
├── public/              # ไฟล์ static (favicon, รูป og:image)
├── src/
│   ├── components/      # ส่วนประกอบเล็กๆ (Header, Card, ฯลฯ)
│   ├── content/
│   │   └── recipes/     # ไฟล์ .md ของแต่ละสูตร
│   ├── layouts/         # Layout หลักของเว็บ
│   ├── pages/           # หน้าเว็บแต่ละหน้า
│   │   └── recipes/
│   │       └── [...slug].astro  # หน้ารายละเอียดสูตร
│   └── styles/          # CSS
├── astro.config.mjs     # ตั้งค่า Astro
├── package.json         # dependencies
└── README.md            # ไฟล์นี้
```

---

## ติดปัญหา?

- **`npm install` ไม่ผ่าน?** → ลงเวอร์ชัน Node.js 18+ ใหม่
- **เว็บขึ้นแต่รูปไม่ขึ้น?** → URL รูปในไฟล์ .md ต้องเป็น https:// เต็มๆ
- **Deploy แล้วลิงก์เสีย?** → เช็ก `site:` ใน `astro.config.mjs` ให้ตรงกับ URL จริง

ถามผมได้ตลอด — สู้ๆ ครับ! 🔥
