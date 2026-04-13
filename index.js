/* ============================================================
   NIMSANDU KOTTAGE v2 — index.js
   ============================================================ */
(() => {
  'use strict';

  // ── CUSTOM CURSOR ──────────────────────────────────────────
  // Skip entirely on touch / pointer-coarse devices
  const isTouch = window.matchMedia('(pointer: coarse)').matches
               || window.matchMedia('(hover: none)').matches;

  const cursor    = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');
  let mX = 0, mY = 0, cX = 0, cY = 0, dX = 0, dY = 0;

  if (!isTouch) {
    document.addEventListener('mousemove', e => { mX = e.clientX; mY = e.clientY; });

    (function tick() {
      cX += (mX - cX) * 0.11;
      cY += (mY - cY) * 0.11;
      dX += (mX - dX) * 0.52;
      dY += (mY - dY) * 0.52;
      if (cursor)    { cursor.style.left    = cX + 'px'; cursor.style.top    = cY + 'px'; }
      if (cursorDot) { cursorDot.style.left = dX + 'px'; cursorDot.style.top = dY + 'px'; }
      requestAnimationFrame(tick);
    })();

    // Hover state
    document.querySelectorAll('a, button, .proj-card, .cr-item, .c-tag, .bmc-btn, .rates-btn, .hero-fig').forEach(el => {
      el.addEventListener('mouseenter', () => { cursor?.classList.add('hov'); cursorDot?.classList.add('hov'); });
      el.addEventListener('mouseleave', () => { cursor?.classList.remove('hov'); cursorDot?.classList.remove('hov'); });
    });

    // Dark section cursor mode
    const darkEls = document.querySelectorAll('.section--ink, .footer, .mobile-menu, .marquee-band');
    function checkDark() {
      let onDark = false;
      darkEls.forEach(el => {
        const r = el.getBoundingClientRect();
        if (mX >= r.left && mX <= r.right && mY >= r.top && mY <= r.bottom) onDark = true;
      });
      cursor?.classList.toggle('dk', onDark);
    }
    document.addEventListener('mousemove', checkDark);
    document.addEventListener('mouseleave', () => { if(cursor) cursor.style.opacity = '0'; if(cursorDot) cursorDot.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { if(cursor) cursor.style.opacity = '1'; if(cursorDot) cursorDot.style.opacity = '1'; });
  }

  // ── NAV ────────────────────────────────────────────────────
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav?.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // ── ADAPTIVE NAV COLOUR ────────────────────────────────────
  // Toggle nav--light whenever a dark section occupies the nav strip
  (function() {
    if (!nav) return;
    const NAV_H = 68;
    // Shrink the observation root to just the nav-height band at the top
    const bottomInset = -(window.innerHeight - NAV_H);
    let darkCount = 0;

    const obs = new IntersectionObserver(entries => {
      entries.forEach(en => { darkCount += en.isIntersecting ? 1 : -1; });
      darkCount = Math.max(0, darkCount);
      nav.classList.toggle('nav--light', darkCount > 0);
    }, {
      rootMargin: `0px 0px ${bottomInset}px 0px`,
      threshold: 0
    });

    document.querySelectorAll('.section--ink, .footer, .marquee-band')
      .forEach(el => obs.observe(el));
  })();

  // ── MOBILE MENU ────────────────────────────────────────────
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  let open = false;

  function toggleMenu(force) {
    open = typeof force === 'boolean' ? force : !open;
    hamburger?.classList.toggle('open', open);
    mobileMenu?.classList.toggle('open', open);
    mobileMenu?.setAttribute('aria-hidden', String(!open));
    hamburger?.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }
  hamburger?.addEventListener('click', () => toggleMenu());
  document.querySelectorAll('.m-link').forEach(l => l.addEventListener('click', () => toggleMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && open) toggleMenu(false); });

  // ── SMOOTH SCROLL ──────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
      const t = document.querySelector(this.getAttribute('href'));
      if (!t) return;
      e.preventDefault();
      const off = 68;
      window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - off, behavior: 'smooth' });
    });
  });

  // ── SCROLL REVEAL ──────────────────────────────────────────
  const revealAll = document.querySelectorAll('.reveal, .reveal-img');
  new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('visible'); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }).observe
  // Individual observe
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('visible'); revealObs.unobserve(en.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  revealAll.forEach(el => revealObs.observe(el));

  // Grid stagger
  const gridObs = new IntersectionObserver((entries) => {
    const groups = new Map();
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const p = en.target.parentElement;
      if (!groups.has(p)) groups.set(p, []);
      groups.get(p).push(en.target);
    });
    groups.forEach(cards => {
      cards.forEach((c, i) => {
        setTimeout(() => c.classList.add('visible'), i * 75);
        gridObs.unobserve(c);
      });
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -24px 0px' });

  document.querySelectorAll('.proj-card, .cr-item').forEach(el => {
    revealObs.unobserve(el);
    el.classList.add('reveal');
    gridObs.observe(el);
  });

  // ── HERO NAME REVEAL ───────────────────────────────────────
  function letterReveal(el, delay = 0) {
    if (!el) return;
    const chars = [...el.textContent];
    el.innerHTML = '';
    el.style.display = 'inline-block';
    chars.forEach((ch, i) => {
      const s = document.createElement('span');
      s.textContent = ch === ' ' ? '\u00a0' : ch;
      s.style.cssText = `
        display:inline-block;
        opacity:0;
        transform:translateY(20px);
        transition:opacity .55s cubic-bezier(0.16,1,0.3,1) ${delay + i*22}ms,
                   transform .55s cubic-bezier(0.16,1,0.3,1) ${delay + i*22}ms;
      `;
      el.appendChild(s);
    });
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.querySelectorAll('span').forEach(s => { s.style.opacity='1'; s.style.transform='none'; });
    }));
  }

  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    setTimeout(() => {
      const h1 = document.querySelector('.hn-1');
      const h2 = document.querySelector('.hn-2');
      h1?.classList.add('visible');
      h2?.classList.add('visible');
      letterReveal(h1, 120);
      letterReveal(h2, 220);
    }, 60);
  });

  // ── PAGE FADE IN ───────────────────────────────────────────
  document.body.style.cssText += 'opacity:0;transition:opacity 0.45s ease';

// ── HERO PARALLAX ─────────────────────────────────────
const heroImg = document.querySelector('.hero-img');
const heroFig = document.querySelector('.hero-fig');

if (heroImg && heroFig && !isTouch) {
  let currentShift = 0;
  let targetShift = 0;
  const ease = 0.2;

  window.addEventListener('scroll', () => {
    const figRect = heroFig.getBoundingClientRect();
    const vh = window.innerHeight;

    if (figRect.bottom > 0 && figRect.top < vh) {
      const progress = (vh - figRect.top) / (vh + figRect.height);
      targetShift = (progress - 0.5) * 40;
    }
  }, { passive: true });

  function updateParallax() {
    currentShift += (targetShift - currentShift) * ease;

    heroImg.style.transform = `translate3d(0, ${currentShift}%, 0)`;

    requestAnimationFrame(updateParallax);
  }

  requestAnimationFrame(updateParallax);
}

  // ── ACTIVE NAV ─────────────────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        navLinks.forEach(l => {
          l.style.color = l.getAttribute('href') === `#${en.target.id}`
            ? 'var(--ink)' : 'var(--ink-mid)';
        });
      }
    });
  }, { threshold: 0.35 }).observe
  const secObs = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      navLinks.forEach(l => {
        l.style.color = l.getAttribute('href') === `#${en.target.id}`
          ? 'var(--ink)' : 'var(--ink-mid)';
      });
    });
  }, { threshold: 0.3 });
  sections.forEach(s => secObs.observe(s));

  // ── DISCIPLINE NODE ENTRANCE ANIMATION ─────────────────────
  const vizObs = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.querySelectorAll('.dv-node').forEach((node, i) => {
        node.style.opacity = '0';
        node.style.transform = 'translateY(16px)';
        node.style.transition = `opacity .6s cubic-bezier(0.16,1,0.3,1) ${i*140}ms, transform .6s cubic-bezier(0.16,1,0.3,1) ${i*140}ms`;
        requestAnimationFrame(() => requestAnimationFrame(() => {
          node.style.opacity = '1';
          node.style.transform = 'none';
        }));
      });
      vizObs.unobserve(en.target);
    });
  }, { threshold: 0.2 });
  const viz = document.querySelector('.disciplines-viz');
  if (viz) vizObs.observe(viz);

  // ── VISIONPROJECTS COMPLEXITY BAR REVEAL ───────────────────
  const vpCardObs = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('in-view');
        vpCardObs.unobserve(en.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.vp-card').forEach(card => vpCardObs.observe(card));

  // ── LIGHTBOX ───────────────────────────────────────────────
  const lightbox         = document.getElementById('lightbox');
  const lightboxImg      = document.getElementById('lightboxImg');
  const lightboxCaption  = document.getElementById('lightboxCaption');
  const lightboxClose    = document.getElementById('lightboxClose');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');

  function openLightbox(src, caption) {
    lightboxImg.src = src;
    lightboxImg.alt = caption || '';
    if (lightboxCaption) lightboxCaption.textContent = caption || '';
    lightbox?.classList.add('open');
    lightbox?.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox?.classList.remove('open');
    lightbox?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // Clear src after transition so it doesn't flash
    setTimeout(() => { if (lightboxImg) lightboxImg.src = ''; }, 400);
  }

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxBackdrop?.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && lightbox?.classList.contains('open')) closeLightbox(); });

  // Attach to photo items
  document.querySelectorAll('.cr-item--photo').forEach(item => {
    item.addEventListener('click', () => {
      const src     = item.dataset.lightbox;
      const caption = item.dataset.caption;
      if (src) openLightbox(src, caption);
    });
  });

  // ── VIDEO CLICK ────────────────────────────────────────────
  document.querySelectorAll('.cr-item--video').forEach(item => {
    item.addEventListener('click', () => {
      const url = item.dataset.videoUrl;
      if (url && url !== '#') {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    });
  });

})();