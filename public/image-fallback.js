/**
 * Smart Image Fallback + Unique SVG Generator
 */
(function () {
  'use strict';

  function hashStr(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = ((h << 5) - h) + str.charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h);
  }

  const PALETTES = {
    spicy:    [['#fee2e2', '#fca5a5', '#ef4444'], '#7f1d1d'],
    curry:    [['#fed7aa', '#fb923c', '#ea580c'], '#7c2d12'],
    fresh:    [['#dcfce7', '#86efac', '#22c55e'], '#14532d'],
    soup:     [['#fef3c7', '#fbbf24', '#d97706'], '#78350f'],
    sweet:    [['#fce7f3', '#f9a8d4', '#ec4899'], '#831843'],
    drink:    [['#dbeafe', '#93c5fd', '#3b82f6'], '#1e3a8a'],
    rice:     [['#fef9c3', '#fde047', '#facc15'], '#713f12'],
    noodle:   [['#ffedd5', '#fed7aa', '#fb923c'], '#9a3412'],
    seafood:  [['#cffafe', '#67e8f9', '#06b6d4'], '#164e63'],
    breakfast:[['#f3e8ff', '#d8b4fe', '#a855f7'], '#581c87'],
    snack:    [['#fef3c7', '#fcd34d', '#f59e0b'], '#78350f'],
    default:  [['#fed7aa', '#fdba74', '#fb923c'], '#9a3412'],
  };

  function detectCategoryKey(text) {
    const t = (text || '').toLowerCase();
    if (/ส้มตำ|^ยำ|ลาบ|น้ำตก|ก้อย/.test(t)) return 'fresh';
    if (/ผัดเผ็ด|พริกเผา|เผ็ด|ผัดฉ่า|ผัดขี้เมา/.test(t)) return 'spicy';
    if (/แกง|พะแนง|มัสมั่น|ผัดพริกแกง/.test(t)) return 'curry';
    if (/ต้มยำ|ต้มข่า|ต้ม.*ซุป|^ต้ม|ซุป|พะโล้/.test(t)) return 'soup';
    if (/ขนม|ของหวาน|ลอดช่อง|บัวลอย|ทับทิม|ข้าวเหนียว.*มะม่วง|มะม่วง.*ข้าวเหนียว|สังขยา|ฝอยทอง/.test(t)) return 'sweet';
    if (/ชา|กาแฟ|น้ำ.*สมุนไพร|น้ำผลไม้|น้ำขิง/.test(t)) return 'drink';
    if (/ก๋วยเตี๋ยว|บะหมี่|เกี๊ยว|ข้าวซอย|เส้น|ราดหน้า|ผัดซีอิ๊ว|ผัดไทย|มาม่า/.test(t)) return 'noodle';
    if (/หอย|กุ้ง|ปลาหมึก|ทะเล|ปลา/.test(t)) return 'seafood';
    if (/โจ๊ก|ข้าวต้ม|ไข่กระทะ|ปาท่องโก๋/.test(t)) return 'breakfast';
    if (/ทอดมัน|ปอเปี๊ยะ|สะเต๊ะ|ลูกชิ้น|กะหรี่ปั๊บ/.test(t)) return 'snack';
    if (/ข้าวมันไก่|ข้าวขาหมู|ข้าวคลุกกะปิ|ข้าวผัด|ข้าวหมก/.test(t)) return 'rice';
    return 'default';
  }

  function detectEmojis(text) {
    const t = (text || '').toLowerCase();
    const emojis = [];
    let hero = '🍜';
    if (/ส้มตำ/.test(t)) hero = '🥗';
    else if (/^ยำ|ยำ.*ทะเล|ยำ.*สด/.test(t)) hero = '🥗';
    else if (/ลาบ|น้ำตก|ก้อย/.test(t)) hero = '🥬';
    else if (/ผัดกะเพรา/.test(t)) hero = '🌿';
    else if (/ผัดไทย/.test(t)) hero = '🍝';
    else if (/ผัดซีอิ๊ว|ราดหน้า|ผัดขี้เมา/.test(t)) hero = '🍝';
    else if (/ก๋วยเตี๋ยว|บะหมี่|เกี๊ยว|ข้าวซอย|มาม่า/.test(t)) hero = '🍜';
    else if (/ผัด/.test(t)) hero = '🥘';
    else if (/ต้มยำ|ต้มข่า/.test(t)) hero = '🍲';
    else if (/แกง|พะแนง|มัสมั่น|กะหรี่/.test(t)) hero = '🍛';
    else if (/ต้ม|ซุป|พะโล้/.test(t)) hero = '🍲';
    else if (/ทอด/.test(t)) hero = '🍳';
    else if (/นึ่ง|อบ/.test(t)) hero = '♨️';
    else if (/ย่าง|ปิ้ง|สะเต๊ะ/.test(t)) hero = '🍢';
    else if (/ข้าวมันไก่|ข้าวขาหมู|ข้าวคลุกกะปิ|ข้าวผัด|ข้าวหมก/.test(t)) hero = '🍚';
    else if (/ข้าวเหนียว.*มะม่วง|มะม่วง.*ข้าวเหนียว/.test(t)) hero = '🥭';
    else if (/โจ๊ก|ข้าวต้ม/.test(t)) hero = '🥣';
    else if (/ขนม|ของหวาน|สังขยา|ฝอยทอง/.test(t)) hero = '🍮';
    else if (/ลอดช่อง|บัวลอย|ทับทิม/.test(t)) hero = '🍡';
    else if (/น้ำพริก/.test(t)) hero = '🌶️';
    else if (/ปอเปี๊ยะ|กะหรี่ปั๊บ|ทอดมัน/.test(t)) hero = '🥟';
    else if (/ชา|กาแฟ/.test(t)) hero = '🍵';
    emojis.push(hero);
    if (/หมู/.test(t) && !emojis.includes('🥓')) emojis.push('🥓');
    if (/ไก่/.test(t) && !emojis.includes('🍗')) emojis.push('🍗');
    if (/กุ้ง/.test(t) && !emojis.includes('🦐')) emojis.push('🦐');
    if (/ปลาหมึก|^หมึก|หมึก /.test(t) && !emojis.includes('🦑')) emojis.push('🦑');
    if (/ปลา/.test(t) && !emojis.includes('🐟') && !emojis.includes('🦑')) emojis.push('🐟');
    if (/(เนื้อ.*วัว|สเต๊ก)/.test(t) && !emojis.includes('🥩')) emojis.push('🥩');
    if (/ไข่/.test(t) && !emojis.includes('🥚')) emojis.push('🥚');
    if (/หอย/.test(t) && !emojis.includes('🦪')) emojis.push('🦪');
    if (/พริก|เผ็ด/.test(t) && !emojis.includes('🌶️')) emojis.push('🌶️');
    if (/มะนาว/.test(t) && !emojis.includes('🍋')) emojis.push('🍋');
    if (/มะม่วง/.test(t) && !emojis.includes('🥭')) emojis.push('🥭');
    if (/มะเขือ/.test(t) && !emojis.includes('🍆')) emojis.push('🍆');
    return emojis.slice(0, 4);
  }

  function xmlEscape(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
  }

  function buildRecipeSVG(slug, title) {
    const catKey = detectCategoryKey(title);
    const [colors, textColor] = PALETTES[catKey] || PALETTES.default;
    const emojis = detectEmojis(title);
    const hero = emojis[0];
    const accents = emojis.slice(1);
    const seed = hashStr(slug || title);
    const gradDir = seed % 4;
    const gradCoords = [
      { x1: 0, y1: 0, x2: 1, y2: 1 },
      { x1: 0, y1: 0, x2: 1, y2: 0 },
      { x1: 0, y1: 0, x2: 0, y2: 1 },
      { x1: 1, y1: 0, x2: 0, y2: 1 },
    ][gradDir];
    const heroRot = ((seed >> 2) % 17) - 8;
    const corners = [
      { x: 100, y: 90 }, { x: 500, y: 90 }, { x: 80, y: 280 }, { x: 520, y: 280 },
    ];
    const startCorner = (seed >> 4) % 4;
    const patOff = (seed >> 6) % 25;
    const dispTitle = title.length > 28 ? title.slice(0, 28) + '…' : title;

    const accentSvg = accents.map((emoji, i) => {
      const idx = (startCorner + i) % 4;
      const c = corners[idx];
      const rot = (((seed >> (8 + i * 2)) % 31) - 15);
      const opacity = 0.35 + ((seed >> (12 + i)) % 30) / 100;
      return '<text x="' + c.x + '" y="' + c.y + '" font-size="56" text-anchor="middle" opacity="' + opacity.toFixed(2) + '" transform="rotate(' + rot + ' ' + c.x + ' ' + c.y + ')">' + xmlEscape(emoji) + '</text>';
    }).join('');

    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice">' +
      '<defs>' +
        '<linearGradient id="g' + seed + '" x1="' + gradCoords.x1 + '" y1="' + gradCoords.y1 + '" x2="' + gradCoords.x2 + '" y2="' + gradCoords.y2 + '">' +
          '<stop offset="0%" stop-color="' + colors[0] + '"/>' +
          '<stop offset="50%" stop-color="' + colors[1] + '"/>' +
          '<stop offset="100%" stop-color="' + colors[2] + '"/>' +
        '</linearGradient>' +
        '<pattern id="p' + seed + '" x="' + patOff + '" y="' + patOff + '" width="50" height="50" patternUnits="userSpaceOnUse">' +
          '<circle cx="25" cy="25" r="2" fill="white" opacity="0.18"/>' +
          '<circle cx="0" cy="0" r="1" fill="white" opacity="0.12"/>' +
          '<circle cx="50" cy="0" r="1" fill="white" opacity="0.12"/>' +
        '</pattern>' +
      '</defs>' +
      '<rect width="600" height="400" fill="url(#g' + seed + ')"/>' +
      '<rect width="600" height="400" fill="url(#p' + seed + ')"/>' +
      '<g font-family="-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif">' +
        accentSvg +
        '<text x="300" y="220" font-size="160" text-anchor="middle" transform="rotate(' + heroRot + ' 300 200)">' + xmlEscape(hero) + '</text>' +
        '<rect x="40" y="320" width="520" height="50" rx="25" fill="' + textColor + '" opacity="0.85"/>' +
        '<text x="300" y="353" font-size="22" text-anchor="middle" fill="white" font-weight="700">' + xmlEscape(dispTitle) + '</text>' +
      '</g>' +
      '</svg>';
  }

  function svgToDataURL(svg) {
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  function getOverrides() {
    const staticOv = window.RECIPE_IMAGE_OVERRIDES || {};
    let adminOv = {};
    try { adminOv = JSON.parse(localStorage.getItem('admin_overrides') || '{}'); } catch (e) {}
    return Object.assign({}, staticOv, adminOv);
  }

  function isForceAll() { return window.RECIPE_FORCE_SVG === true; }

  function applyToImage(img) {
    if (img.dataset.svgApplied) return;
    const slug = img.dataset.recipeSlug || '';
    const title = img.alt || img.dataset.fallbackText || slug || 'อาหารไทย';
    img.src = svgToDataURL(buildRecipeSVG(slug, title));
    img.dataset.svgApplied = '1';
    img.style.objectFit = 'cover';
    img.style.background = 'transparent';
    img.removeAttribute('srcset');
  }

  function handleError(img) {
    if (!img || img.dataset.svgApplied) return;
    applyToImage(img);
  }

  function applyOverrides() {
    const ov = getOverrides();
    const forceAll = isForceAll();
    document.querySelectorAll('img[data-recipe-slug]').forEach((img) => {
      const slug = img.dataset.recipeSlug;
      if (slug in ov) {
        const url = ov[slug];
        if (url) img.src = url;
        else applyToImage(img);
      } else if (forceAll) {
        applyToImage(img);
      }
    });
  }

  document.addEventListener('error', (e) => {
    const t = e.target;
    if (t && t.tagName === 'IMG') handleError(t);
  }, true);

  function scan() {
    document.querySelectorAll('img').forEach((img) => {
      if (img.complete && img.naturalWidth === 0 && !img.dataset.svgApplied) handleError(img);
    });
  }

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((m) => {
      m.addedNodes.forEach((node) => {
        if (node.nodeType !== 1) return;
        const imgs = node.tagName === 'IMG' ? [node] : (node.querySelectorAll ? node.querySelectorAll('img') : []);
        imgs.forEach((img) => {
          const slug = img.dataset.recipeSlug;
          if (slug) {
            const ov = getOverrides();
            const forceAll = isForceAll();
            if (slug in ov) {
              const url = ov[slug];
              if (url) img.src = url;
              else applyToImage(img);
            } else if (forceAll) {
              applyToImage(img);
            }
          }
          if (img.complete && img.naturalWidth === 0) handleError(img);
        });
      });
    });
  });

  function init() {
    applyOverrides();
    scan();
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  window.addEventListener('load', scan);

  window.ImageFallback = { buildRecipeSVG, svgToDataURL, handleError, applyToImage, detectCategoryKey, detectEmojis };
})();
