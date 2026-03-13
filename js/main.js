/* ============================================================
   ADPULSE LTD — MAIN JAVASCRIPT
   ============================================================ */

'use strict';

/* ============================================================
   1. PARTICLE CANVAS
   ============================================================ */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], mouse = { x: null, y: null };
  const NUM = Math.min(100, Math.floor(window.innerWidth / 14));

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();

  class Particle {
    constructor() { this.reset(true); }
    reset(initial) {
      this.x  = Math.random() * W;
      this.y  = initial ? Math.random() * H : H + 10;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -(Math.random() * 0.4 + 0.1);
      this.r  = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? '0,212,255' : '0,255,136';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (mouse.x !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          this.vx += (dx / dist) * force * 0.03;
          this.vy += (dy / dist) * force * 0.03;
        }
      }
      this.vx *= 0.99;
      this.vy = Math.max(this.vy, -(Math.random() * 0.4 + 0.2));
      if (this.y < -10 || this.x < -10 || this.x > W + 10) this.reset(false);
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < NUM; i++) particles.push(new Particle());

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 100) {
          const alpha = (1 - d / 100) * 0.08;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,212,255,${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener('resize', () => { resize(); });
  document.getElementById('hero').addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  document.getElementById('hero').addEventListener('mouseleave', () => {
    mouse.x = null; mouse.y = null;
  });
})();

/* ============================================================
   2. NAVBAR
   ============================================================ */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  // Scroll: add .scrolled class
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  const links    = navLinks.querySelectorAll('a[href^="#"]');

  const highlightNav = () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    links.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === `#${current}`);
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });
})();

/* ============================================================
   3. SCROLL REVEAL
   ============================================================ */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const io  = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

  els.forEach(el => io.observe(el));
})();

/* ============================================================
   4. COUNTER ANIMATION
   ============================================================ */
(function initCounters() {
  const counters = document.querySelectorAll('[data-target]');
  const countIO  = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target);
      const dur    = 1800;
      const step   = 16;
      const inc    = target / (dur / step);
      let current  = 0;

      const tick = setInterval(() => {
        current = Math.min(current + inc, target);
        el.textContent = Math.floor(current);
        if (current >= target) clearInterval(tick);
      }, step);

      countIO.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => countIO.observe(c));
})();

/* ============================================================
   5. TESTIMONIAL CAROUSEL
   ============================================================ */
(function initTestimonials() {
  const track   = document.getElementById('testimonialsTrack');
  const dotsEl  = document.getElementById('tDots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  if (!track) return;

  const cards   = track.querySelectorAll('.t-card');
  const total   = cards.length;
  let current   = 0;
  let autoTimer;

  // Build dots
  for (let i = 0; i < total; i++) {
    const d = document.createElement('div');
    d.className = 't-dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(d);
  }

  function goTo(n) {
    current = (n + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsEl.querySelectorAll('.t-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
    resetAuto();
  }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 5500);
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Swipe support
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
  track.addEventListener('touchend',   e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
  });

  resetAuto();
})();

/* ============================================================
   6. CONTACT FORM
   ============================================================ */
(function initForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = '<span>Sending&hellip;</span>';
    btn.disabled = true;

    // Simulate a small delay (replace with real fetch to your API)
    await new Promise(r => setTimeout(r, 1200));

    // Show success (hook up to real backend POST /api/contact)
    form.style.display = 'none';
    success.classList.add('show');

    // Reset after 5s
    setTimeout(() => {
      form.reset();
      form.style.display = 'flex';
      success.classList.remove('show');
      btn.innerHTML = orig;
      btn.disabled = false;
    }, 5000);
  });
})();

/* ============================================================
   7. PRICING TOGGLE (Monthly / Yearly)
   ============================================================ */
(function initPricingToggle() {
  const toggle   = document.getElementById('pricingToggle');
  const priceEls = document.querySelectorAll('[data-monthly][data-yearly]');
  if (!toggle) return;

  toggle.addEventListener('change', () => {
    const yearly = toggle.checked;
    priceEls.forEach(el => {
      el.textContent = yearly ? el.dataset.yearly : el.dataset.monthly;
    });

    // Update billing period labels
    document.querySelectorAll('.billing-period').forEach(el => {
      el.textContent = yearly ? '/yr' : '/mo';
    });

    // Show/hide savings badge
    document.querySelectorAll('.yearly-save').forEach(el => {
      el.style.display = yearly ? 'inline-flex' : 'none';
    });
  });
})();

/* ============================================================
   8. SMOOTH ANCHOR SCROLL (fallback for older browsers)
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ============================================================
   9. CURSOR GLOW (desktop only)
   ============================================================ */
(function initCursorGlow() {
  if (window.matchMedia('(hover: none)').matches) return;
  const glow = document.createElement('div');
  glow.id = 'cursorGlow';
  glow.style.cssText = `
    position:fixed; pointer-events:none; z-index:9999;
    width:400px; height:400px; border-radius:50%;
    background:radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 70%);
    transform:translate(-50%,-50%);
    transition:opacity 0.3s ease;
    top:0; left:0;
  `;
  document.body.appendChild(glow);
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { glow.style.opacity = '1'; });
})();
