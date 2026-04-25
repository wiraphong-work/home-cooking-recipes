/**
 * Comments Client — รองรับ 2 backend
 *
 * 1. localStorage (default)  — ใช้ทันที comment เห็นเฉพาะใน browser ตัวเอง
 *                              เหมาะสำหรับทดสอบ/dev
 * 2. Firebase                 — comment เห็นทุกคน + อัพรูปจริง
 *                              ต้องตั้งค่า Firebase ตามคู่มือ FIREBASE_SETUP.md
 *
 * วิธีเปลี่ยน backend: แก้ window.COMMENTS_BACKEND = 'firebase' ในไฟล์ที่เรียก
 */

(function () {
  'use strict';

  // ============ WebP Conversion (ฝั่ง browser) ============
  /**
   * แปลงรูปเป็น WebP โดยลดขนาดไม่ให้กว้างเกิน maxWidth
   * คืนค่า { blob: Blob, dataURL: string }
   */
  async function convertToWebP(file, opts = {}) {
    const maxWidth = opts.maxWidth || 1200;
    const quality = opts.quality || 0.85;

    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url);
            if (!blob) {
              reject(new Error('แปลงรูปไม่สำเร็จ'));
              return;
            }
            const reader = new FileReader();
            reader.onload = () =>
              resolve({ blob, dataURL: reader.result, width, height });
            reader.onerror = () => reject(new Error('อ่านรูปไม่สำเร็จ'));
            reader.readAsDataURL(blob);
          },
          'image/webp',
          quality
        );
      };
      img.onerror = () => reject(new Error('โหลดรูปไม่สำเร็จ'));
      img.src = url;
    });
  }

  // ============ localStorage Backend ============
  const LocalBackend = {
    async getComments(slug) {
      try {
        const raw = localStorage.getItem(`comments:${slug}`);
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    },
    async addComment(slug, comment) {
      const list = await this.getComments(slug);
      const newComment = {
        ...comment,
        id: crypto.randomUUID
          ? crypto.randomUUID()
          : Date.now().toString(36) + Math.random().toString(36).slice(2),
        createdAt: new Date().toISOString(),
      };
      list.unshift(newComment);
      localStorage.setItem(`comments:${slug}`, JSON.stringify(list));
      return newComment;
    },
    async uploadImage(file) {
      // localStorage: เก็บเป็น dataURL (base64)
      const { dataURL } = await convertToWebP(file);
      return dataURL;
    },
  };

  // ============ Firebase Backend (ตั้งค่าตาม FIREBASE_SETUP.md ก่อนใช้) ============
  // ลบ comment 4 บรรทัดนี้ออกหลังตั้งค่า Firebase
  const FirebaseBackend = {
    _initialized: false,
    async _init() {
      if (this._initialized) return;
      // import Firebase SDK แบบ ES module จาก CDN
      const { initializeApp } = await import(
        'https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js'
      );
      const fs = await import(
        'https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js'
      );
      const st = await import(
        'https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js'
      );
      const auth = await import(
        'https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js'
      );

      // window.FIREBASE_CONFIG ตั้งจาก HTML script
      if (!window.FIREBASE_CONFIG) {
        throw new Error('ยังไม่ได้ตั้ง window.FIREBASE_CONFIG ดู FIREBASE_SETUP.md');
      }
      const app = initializeApp(window.FIREBASE_CONFIG);
      this._db = fs.getFirestore(app);
      this._storage = st.getStorage(app);
      this._auth = auth.getAuth(app);
      this._fs = fs;
      this._st = st;
      // anonymous sign-in (ไม่ต้องล็อกอิน)
      await auth.signInAnonymously(this._auth);
      this._initialized = true;
    },
    async getComments(slug) {
      await this._init();
      const { collection, query, where, orderBy, getDocs } = this._fs;
      const q = query(
        collection(this._db, 'comments'),
        where('slug', '==', slug),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    },
    async addComment(slug, comment) {
      await this._init();
      const { collection, addDoc, serverTimestamp } = this._fs;
      const docRef = await addDoc(collection(this._db, 'comments'), {
        ...comment,
        slug,
        createdAt: serverTimestamp(),
      });
      return { id: docRef.id, ...comment, createdAt: new Date().toISOString() };
    },
    async uploadImage(file) {
      await this._init();
      const { ref, uploadBytes, getDownloadURL } = this._st;
      const { blob } = await convertToWebP(file);
      const filename = `comments/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.webp`;
      const r = ref(this._storage, filename);
      await uploadBytes(r, blob, { contentType: 'image/webp' });
      return await getDownloadURL(r);
    },
  };

  // ============ Public API ============
  function getBackend() {
    return window.COMMENTS_BACKEND === 'firebase' ? FirebaseBackend : LocalBackend;
  }

  window.CommentsAPI = {
    convertToWebP,
    async getComments(slug) {
      try {
        return await getBackend().getComments(slug);
      } catch (e) {
        console.error('getComments error:', e);
        return [];
      }
    },
    async addComment(slug, comment) {
      return await getBackend().addComment(slug, comment);
    },
    async uploadImage(file) {
      return await getBackend().uploadImage(file);
    },
    isLocalMode() {
      return window.COMMENTS_BACKEND !== 'firebase';
    },
  };
})();
