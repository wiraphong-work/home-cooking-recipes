# 🔥 ตั้งค่า Firebase สำหรับระบบ Comment + ดาว + อัพโหลดรูป

ตอนนี้ระบบ Comment ทำงานในโหมด **localStorage** (เห็นเฉพาะ browser ตัวเอง) เพื่อใช้งานจริงให้ comment เห็นทุกคน + อัพโหลดรูปจริง ทำตามขั้นตอนนี้

---

## 1. สร้าง Firebase project (ใช้เวลา ~5 นาที)

1. เปิด https://console.firebase.google.com
2. ล็อกอินด้วย Google account ของคุณ
3. กด **Add project** → ตั้งชื่อ เช่น `kruabaanban` → Continue
4. **ปิด Google Analytics** (ไม่จำเป็นสำหรับโปรเจกต์นี้) → Create project
5. รอประมาณ 30 วินาที

---

## 2. เพิ่ม Web App ในโปรเจกต์

1. ในหน้า Firebase Console กด icon `</>` (Web)
2. ตั้งชื่อ App เช่น `recipe-site`
3. **ไม่ต้องติ๊ก** "Also set up Firebase Hosting"
4. กด Register app
5. **คัดลอก firebaseConfig** ที่ Firebase แสดงให้ จะหน้าตาประมาณนี้

```js
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "kruabaanban.firebaseapp.com",
  projectId: "kruabaanban",
  storageBucket: "kruabaanban.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abc123"
};
```

> **ปลอดภัย:** apiKey ของ Firebase Web เปิดเผยได้ ไม่ใช่ secret ความปลอดภัยควบคุมด้วย Security Rules

---

## 3. เปิดใช้ Firestore (เก็บ comment)

1. ที่ sidebar กด **Build** → **Firestore Database**
2. กด **Create database** → เลือก **Start in production mode** → Next
3. เลือก location: `asia-southeast1 (Singapore)` (ใกล้ไทยที่สุด) → Enable
4. ไปที่ tab **Rules** วาง rules นี้แล้วกด **Publish**

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /comments/{commentId} {
      // ใครก็อ่านได้
      allow read: if true;
      // เขียนได้ถ้า login (anonymous ได้) + ข้อมูลถูกต้อง
      allow create: if request.auth != null
        && request.resource.data.slug is string
        && request.resource.data.slug.size() <= 100
        && request.resource.data.name is string
        && request.resource.data.name.size() <= 60
        && request.resource.data.rating is number
        && request.resource.data.rating >= 1
        && request.resource.data.rating <= 5
        && (request.resource.data.text == null
            || (request.resource.data.text is string
                && request.resource.data.text.size() <= 1000))
        && (request.resource.data.images == null
            || request.resource.data.images.size() <= 4);
      // แก้/ลบไม่ได้ (ป้องกัน spam edit)
      allow update, delete: if false;
    }
  }
}
```

---

## 4. เปิดใช้ Storage (เก็บรูป)

1. ที่ sidebar กด **Build** → **Storage**
2. กด **Get started** → **Start in production mode** → Next
3. เลือก location เดียวกัน (`asia-southeast1`) → Done
4. ไปที่ tab **Rules** วาง rules นี้แล้ว Publish

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /comments/{file} {
      // ใครก็ดูได้
      allow read: if true;
      // อัพได้ถ้า login + เป็น webp + < 2MB
      allow write: if request.auth != null
        && request.resource.size < 2 * 1024 * 1024
        && request.resource.contentType == 'image/webp';
    }
  }
}
```

---

## 5. เปิดใช้ Anonymous Authentication

1. ที่ sidebar กด **Build** → **Authentication**
2. กด **Get started**
3. ใน tab **Sign-in method** หา **Anonymous** → กดเปิด → Save

---

## 6. ใส่ Config ในเว็บ

แก้ไฟล์ `src/layouts/BaseLayout.astro` เพิ่ม script ก่อน `</body>`

```html
<script is:inline>
  window.FIREBASE_CONFIG = {
    apiKey: "AIza...",                                  // จาก step 2
    authDomain: "kruabaanban.firebaseapp.com",
    projectId: "kruabaanban",
    storageBucket: "kruabaanban.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abc123"
  };
  window.COMMENTS_BACKEND = 'firebase';
</script>
```

> **หมายเหตุ:** เอาค่า `firebaseConfig` ของคุณจริงๆ มาแทนตัวอย่างข้างบน

---

## 7. ทดสอบ

1. รัน `npm run dev`
2. เปิดสูตรไหนก็ได้
3. **ถ้าทำสำเร็จ** กล่องเหลือง "โหมดทดสอบ" จะหายไป
4. ลองเขียน comment + อัพโหลดรูป
5. กลับไปดูที่ Firebase Console → Firestore → จะเห็น comment เข้ามา

---

## 8. Deploy

`deploy-github.bat` เหมือนเดิม Cloudflare Pages จะ deploy ให้อัตโนมัติ

---

## ⚠️ Spam Protection

Firebase Free tier ป้องกัน spam ผ่าน:
- **Anonymous auth** = ทุก comment มี user ID → block ได้ในอนาคต
- **Security rules** = จำกัดขนาด string + จำนวนรูป
- **Rate limit** = Firebase จำกัด writes 100K/day สำหรับ free tier

ถ้าโดน spam หนัก เพิ่ม reCAPTCHA หรือ Cloud Functions filter ทีหลังได้

---

## 💰 ค่าใช้จ่าย

Firebase Free tier (Spark plan)
- Firestore: 50,000 reads/day · 20,000 writes/day · 1 GB storage
- Storage: 5 GB · 1 GB downloads/day
- Anonymous auth: ฟรีไม่จำกัด

สำหรับเว็บที่มี comment ~100 อัน/วัน + คนอ่าน ~5,000 คน/วัน ใช้ฟรีตลอดไป

ถ้าเกิน free tier (traffic หลายแสนคน/วัน) ค่าใช้ประมาณ $1-5/เดือน

---

## 🔧 ถ้าเจอ Error

**"Permission denied"** → Security rules ผิด ตรวจ rules ใน Firestore/Storage

**"Firebase: Error (auth/admin-restricted-operation)"** → ยังไม่เปิด Anonymous Auth (step 5)

**Comment โหลดไม่ขึ้น** → เปิด DevTools (F12) → Console → ดู error → คัดลอกข้อความมาถาม Claude

**รูปอัพไม่ขึ้น** → ตรวจ Storage rules + content-type ต้องเป็น `image/webp`

---

## 🔄 กลับไปใช้ localStorage

ถ้าอยากกลับไปโหมดทดสอบ ลบบรรทัด `window.COMMENTS_BACKEND = 'firebase';` ออก
