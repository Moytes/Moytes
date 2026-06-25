/* =================================================================
   MOISE GODINEZ — PORTFOLIO · Interactions
   Vanilla JS, zero dependencies.
   ================================================================= */
(function () {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- PRELOADER ---------- */
  const preloader = $('#preloader');
  const bar = $('.preloader__bar span');
  let progress = 0;
  const tick = setInterval(() => {
    progress += Math.random() * 22;
    if (progress >= 100) { progress = 100; clearInterval(tick); }
    if (bar) bar.style.width = progress + '%';
  }, 130);

  window.addEventListener('load', () => {
    setTimeout(() => {
      if (bar) bar.style.width = '100%';
      preloader && preloader.classList.add('is-done');
      document.body.style.overflow = '';
    }, 600);
  });
  document.body.style.overflow = 'hidden';

  /* ---------- CUSTOM CURSOR ---------- */
  const dot = $('#cursor');
  const ring = $('#cursorRing');
  if (dot && ring && !reduceMotion && window.matchMedia('(hover: hover)').matches) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    });
    const loop = () => {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    };
    loop();
    $$('[data-cursor="link"], a, button').forEach((el) => {
      el.addEventListener('mouseenter', () => { ring.classList.add('is-hover'); dot.classList.add('is-hover'); });
      el.addEventListener('mouseleave', () => { ring.classList.remove('is-hover'); dot.classList.remove('is-hover'); });
    });
    document.addEventListener('mouseleave', () => { dot.style.opacity = ring.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { dot.style.opacity = ring.style.opacity = '1'; });
  }

  /* ---------- NAV: scroll state + progress ---------- */
  const nav = $('#nav');
  const progressBar = $('#scrollProgress');
  const onScroll = () => {
    const y = window.scrollY;
    nav && nav.classList.toggle('is-scrolled', y > 40);
    if (progressBar) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- MOBILE MENU ---------- */
  const toggle = $('#navToggle');
  const links = $('#navLinks');
  const closeMenu = () => { toggle.classList.remove('is-open'); links.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); };
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('is-open');
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    $$('.nav__link, .nav__cta', links).forEach((l) => l.addEventListener('click', closeMenu));
  }

  /* ---------- ACTIVE NAV LINK ON SCROLL ---------- */
  const sections = $$('section[id]');
  const navLinks = $$('.nav__link');
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const id = e.target.id;
        navLinks.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === '#' + id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => spy.observe(s));

  /* ---------- REVEAL ON SCROLL ---------- */
  const reveals = $$('[data-reveal]');
  reveals.forEach((el) => {
    const d = el.getAttribute('data-delay');
    if (d) el.style.setProperty('--reveal-delay', d + 'ms');
  });
  const revObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  reveals.forEach((el) => revObserver.observe(el));

  /* ---------- COUNTERS ---------- */
  const counters = $$('[data-count]');
  const countObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.getAttribute('data-count'));
      const suffix = el.getAttribute('data-suffix') || '';
      const dur = 1600; const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach((c) => countObserver.observe(c));

  /* ---------- MAGNETIC BUTTONS ---------- */
  if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
    $$('.magnetic').forEach((el) => {
      const strength = 22;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width - 0.5) * strength;
        const y = ((e.clientY - r.top) / r.height - 0.5) * strength;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- 3D TILT ---------- */
  if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
    $$('[data-tilt]').forEach((el) => {
      const max = 8;
      el.style.transformStyle = 'preserve-3d';
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateY(${px * max}deg) rotateX(${-py * max}deg) translateY(-4px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- HERO PARALLAX ---------- */
  if (!reduceMotion) {
    const visual = $('.hero__visual');
    const badges = $$('.floating-badge');
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5);
      const y = (e.clientY / window.innerHeight - 0.5);
      if (visual) visual.style.transform = `translate(${x * 18}px, ${y * 18}px)`;
      badges.forEach((b, i) => {
        const f = (i + 1) * 8;
        b.style.transform = `translate(${x * f}px, ${y * f}px)`;
      });
    });
  }

  /* ---------- YEAR ---------- */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

})();
