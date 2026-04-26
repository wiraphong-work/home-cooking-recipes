/**
 * Shopping List — เก็บใน localStorage
 * เก็บเป็น array ของ { slug, title, image, ingredients[] }
 */
(function () {
  'use strict';
  const KEY = 'shoppingList';

  function read() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '[]');
    } catch {
      return [];
    }
  }
  function write(list) {
    localStorage.setItem(KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('shopping-list-changed'));
  }

  window.ShoppingList = {
    /** เพิ่มสูตรเข้ารายการ */
    add(recipe) {
      const list = read();
      if (list.some((r) => r.slug === recipe.slug)) return false;
      list.push(recipe);
      write(list);
      return true;
    },
    remove(slug) {
      write(read().filter((r) => r.slug !== slug));
    },
    clear() {
      write([]);
    },
    has(slug) {
      return read().some((r) => r.slug === slug);
    },
    get() {
      return read();
    },
    count() {
      return read().length;
    },
    /** รวมวัตถุดิบจากทุกสูตร group ตามชื่อ */
    aggregate() {
      const list = read();
      const map = new Map();
      list.forEach((recipe) => {
        recipe.ingredients.forEach((ing) => {
          const key = ing.name.trim();
          if (!map.has(key)) {
            map.set(key, {
              name: ing.name,
              amounts: [],
              buyUrl: ing.buyUrl || '',
              fromRecipes: [],
            });
          }
          const entry = map.get(key);
          entry.amounts.push(ing.amount);
          entry.fromRecipes.push(recipe.title);
          // เก็บ buyUrl อันแรกที่ไม่ว่าง
          if (!entry.buyUrl && ing.buyUrl) entry.buyUrl = ing.buyUrl;
        });
      });
      return Array.from(map.values());
    },
  };
})();
