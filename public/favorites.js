/**
 * Favorites — เก็บสูตรที่ชอบใน localStorage
 */
(function () {
  'use strict';
  const KEY = 'favorites';

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
    catch { return []; }
  }
  function write(list) {
    localStorage.setItem(KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('favorites-changed'));
  }

  window.Favorites = {
    add(recipe) {
      const list = read();
      if (list.some((r) => r.slug === recipe.slug)) return false;
      list.unshift({ ...recipe, addedAt: Date.now() });
      write(list);
      return true;
    },
    remove(slug) { write(read().filter((r) => r.slug !== slug)); },
    has(slug) { return read().some((r) => r.slug === slug); },
    get() { return read(); },
    count() { return read().length; },
    toggle(recipe) {
      if (this.has(recipe.slug)) { this.remove(recipe.slug); return false; }
      this.add(recipe); return true;
    },
  };
})();
