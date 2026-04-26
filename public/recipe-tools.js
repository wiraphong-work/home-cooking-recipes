/**
 * Recipe Tools
 * - Serving calculator (scale ingredient amounts)
 * - Cooking timer (parse step text for "X นาที" / "X ชั่วโมง")
 */
(function () {
  'use strict';

  // ============ Serving Calculator ============
  /** Scale numeric values inside an amount string */
  function scaleAmount(amount, factor) {
    if (!amount) return amount;
    return amount.replace(
      /(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)|(\d+)\s*\/\s*(\d+)|(\d+(?:\.\d+)?)/g,
      (m, rangeA, rangeB, fracA, fracB, plain) => {
        if (rangeA != null && rangeB != null) {
          return `${formatNum(parseFloat(rangeA) * factor)}-${formatNum(parseFloat(rangeB) * factor)}`;
        }
        if (fracA != null && fracB != null) {
          const v = (parseInt(fracA) / parseInt(fracB)) * factor;
          return formatFraction(v);
        }
        return formatNum(parseFloat(plain) * factor);
      }
    );
  }
  function formatFraction(v) {
    if (v === 0.25) return '1/4';
    if (v === 0.5) return '1/2';
    if (v === 0.75) return '3/4';
    if (v === 1.5) return '1 1/2';
    if (v < 1) return v.toFixed(2).replace(/\.?0+$/, '');
    return formatNum(v);
  }
  function formatNum(v) {
    if (Number.isFinite(v) === false) return String(v);
    if (v % 1 === 0) return v.toString();
    return (Math.round(v * 10) / 10).toString();
  }

  function initServingCalc() {
    const root = document.getElementById('servingCalc');
    if (!root) return;
    const baseServings = parseInt(root.dataset.baseServings || '2');
    const buttons = root.querySelectorAll('.serving-btn');
    const ingItems = document.querySelectorAll('[data-original-amount]');

    function apply(targetServings) {
      const factor = targetServings / baseServings;
      ingItems.forEach((el) => {
        const orig = el.dataset.originalAmount;
        el.textContent = scaleAmount(orig, factor);
      });
      buttons.forEach((b) => {
        b.classList.toggle('active', parseInt(b.dataset.serving) === targetServings);
      });
    }

    buttons.forEach((b) => {
      b.addEventListener('click', () => apply(parseInt(b.dataset.serving)));
    });
    apply(baseServings);
  }

  // ============ Cooking Timer ============
  /** Parse Thai step text and return total minutes (or null) */
  function parseMinutes(text) {
    let totalMinutes = 0;
    let found = false;

    // ชั่วโมง
    const hourMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:ชั่วโมง|ชม\.|hr|hour)/);
    if (hourMatch) {
      totalMinutes += parseFloat(hourMatch[1]) * 60;
      found = true;
    }

    // นาที — รับ range "5-7 นาที" → ใช้ค่ากลาง
    const minRange = text.match(/(\d+)\s*-\s*(\d+)\s*(?:นาที|min)/);
    if (minRange) {
      totalMinutes += (parseInt(minRange[1]) + parseInt(minRange[2])) / 2;
      found = true;
    } else {
      const minMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:นาที|min)/);
      if (minMatch) {
        totalMinutes += parseFloat(minMatch[1]);
        found = true;
      }
    }

    // วินาที
    const secMatch = text.match(/(\d+)\s*(?:วินาที|sec)/);
    if (secMatch) {
      totalMinutes += parseInt(secMatch[1]) / 60;
      found = true;
    }

    return found ? totalMinutes : null;
  }

  function formatTimer(secondsLeft) {
    const m = Math.floor(secondsLeft / 60);
    const s = Math.floor(secondsLeft % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  /** Play simple beep using AudioContext */
  function beep() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
      osc.start();
      osc.stop(ctx.currentTime + 1.5);
    } catch {}
  }

  function initTimers() {
    document.querySelectorAll('[data-step-text]').forEach((stepEl) => {
      const text = stepEl.dataset.stepText;
      const minutes = parseMinutes(text);
      if (minutes == null || minutes <= 0 || minutes > 240) return;

      const totalSec = Math.round(minutes * 60);
      const btn = document.createElement('button');
      btn.className = 'timer-btn';
      btn.type = 'button';
      btn.innerHTML = `⏱️ ตั้งจับเวลา <span class="timer-display">${formatTimer(totalSec)}</span>`;

      let intervalId = null;
      let remaining = totalSec;
      let running = false;

      btn.addEventListener('click', () => {
        const display = btn.querySelector('.timer-display');
        if (!running && remaining > 0) {
          // start
          running = true;
          btn.classList.add('running');
          btn.firstChild.textContent = '⏸️ หยุด · ';
          intervalId = setInterval(() => {
            remaining--;
            display.textContent = formatTimer(remaining);
            if (remaining <= 0) {
              clearInterval(intervalId);
              running = false;
              btn.classList.remove('running');
              btn.classList.add('done');
              btn.firstChild.textContent = '✅ เสร็จ! ';
              display.textContent = 'หมดเวลา';
              beep();
              // Notification (ถ้าได้รับอนุญาต)
              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('⏰ ครัวบ้านๆ', { body: 'หมดเวลาขั้นตอนนี้แล้ว!' });
              }
              setTimeout(() => {
                btn.classList.remove('done');
                btn.firstChild.textContent = '🔄 ตั้งใหม่ · ';
                display.textContent = formatTimer(totalSec);
                remaining = totalSec;
              }, 5000);
            }
          }, 1000);
        } else if (running) {
          // pause
          clearInterval(intervalId);
          running = false;
          btn.classList.remove('running');
          btn.firstChild.textContent = '▶️ ต่อ · ';
        }
      });

      stepEl.appendChild(btn);
    });

    // Request notification permission once
    if ('Notification' in window && Notification.permission === 'default') {
      // ขอเฉพาะตอน user click step ครั้งแรก ไม่ขอตอน load
      document.addEventListener('click', function once(e) {
        if (e.target.closest('.timer-btn')) {
          Notification.requestPermission();
          document.removeEventListener('click', once);
        }
      });
    }
  }

  // ============ Init ============
  function init() {
    initServingCalc();
    initTimers();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
