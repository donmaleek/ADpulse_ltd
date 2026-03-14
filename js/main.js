/* ============================================================
   ADPULSE LTD — MAIN JAVASCRIPT
   ============================================================ */

'use strict';

/* ============================================================
   0. VIEWPORT HEIGHT
   ============================================================ */
(function initViewportHeight() {
  let rafId = null;

  const setViewportHeight = () => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const height = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      document.documentElement.style.setProperty('--viewport-h', `${Math.round(height)}px`);
    });
  };

  setViewportHeight();
  window.addEventListener('resize', setViewportHeight, { passive: true });
  window.addEventListener('orientationchange', setViewportHeight, { passive: true });
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', setViewportHeight, { passive: true });
  }
})();

/* ============================================================
   0. CUSTOM BOOKING WIZARD
   ============================================================ */
(function initBookingWizard() {
  const TIME_SLOTS = [
    '9:00 AM', '10:00 AM', '11:00 AM',
    '2:00 PM',  '3:00 PM',  '4:00 PM', '5:00 PM',
  ];
  const MONTH_NAMES = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December',
  ];

  const state = {
    service: null, date: null, time: null,
    name: '', email: '', phone: '', company: '', message: '',
    calYear: 0, calMonth: 0,
  };

  let modal = null;

  function init() {
    modal = document.getElementById('bookingModal');
    if (!modal) return;

    const now = new Date();
    state.calYear  = now.getFullYear();
    state.calMonth = now.getMonth();

    // Service card selection
    modal.querySelectorAll('.book-service-card').forEach(card => {
      card.addEventListener('click', () => {
        modal.querySelectorAll('.book-service-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        state.service = card.dataset.service;
        document.getElementById('bookNext1').disabled = false;
      });
    });

    // Details form live validation
    ['bfName', 'bfEmail'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', validateDetails);
    });

    renderCalendar();

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal && !modal.hidden) closeBookingModal();
    });
  }

  // ---- Step navigation ----
  window.bookGoTo = function(step) {
    if (!modal) return;
    if (step === 4) buildReview();

    modal.querySelectorAll('.book-step').forEach(s => { s.hidden = true; });
    const target = modal.querySelector(step === 'success' ? '#bookStepSuccess' : `#bookStep${step}`);
    if (target) target.hidden = false;

    const pct = typeof step === 'number' ? (step / 4) * 100 : 100;
    const bar = document.getElementById('bookProgressBar');
    if (bar) bar.style.width = pct + '%';

    ['bsl1','bsl2','bsl3','bsl4'].forEach((id, i) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.classList.toggle('active', i + 1 === step);
      el.classList.toggle('done',   typeof step === 'number' && i + 1 < step);
    });

    const box = modal.querySelector('.bmodal-box');
    if (box) box.scrollTop = 0;
  };

  // ---- Calendar ----
  function renderCalendar() {
    const label  = document.getElementById('bookCalMonthLabel');
    const daysEl = document.getElementById('bookCalDays');
    if (!label || !daysEl) return;

    const y = state.calYear, m = state.calMonth;
    label.textContent = `${MONTH_NAMES[m]} ${y}`;

    const today    = new Date(); today.setHours(0,0,0,0);
    const firstDay = new Date(y, m, 1).getDay();
    const total    = new Date(y, m + 1, 0).getDate();

    let html = '';
    for (let i = 0; i < firstDay; i++) html += '<span class="book-cal-day empty"></span>';
    for (let d = 1; d <= total; d++) {
      const date   = new Date(y, m, d);
      const isPast = date < today;
      const isSun  = date.getDay() === 0;
      const isSel  = state.date && date.toDateString() === state.date.toDateString();
      const off    = isPast || isSun;
      html += `<button class="book-cal-day${off ? ' disabled' : ''}${isSel ? ' selected' : ''}"
        ${off ? 'disabled' : `onclick="bookPickDate(${y},${m},${d})"`}
        aria-label="${MONTH_NAMES[m]} ${d}">${d}</button>`;
    }
    daysEl.innerHTML = html;
  }

  window.bookCalPrev = function() {
    const now = new Date();
    if (state.calMonth === 0) { state.calYear--; state.calMonth = 11; }
    else state.calMonth--;
    if (state.calYear < now.getFullYear() ||
       (state.calYear === now.getFullYear() && state.calMonth < now.getMonth())) {
      state.calYear = now.getFullYear(); state.calMonth = now.getMonth();
    }
    renderCalendar();
  };

  window.bookCalNext = function() {
    if (state.calMonth === 11) { state.calYear++; state.calMonth = 0; }
    else state.calMonth++;
    renderCalendar();
  };

  window.bookPickDate = function(y, m, d) {
    state.date = new Date(y, m, d);
    state.time = null;
    renderCalendar();
    renderSlots();
    document.getElementById('bookSlotsWrap').hidden = false;
    document.getElementById('bookNext2').disabled = true;
  };

  function renderSlots() {
    const el = document.getElementById('bookSlots');
    if (!el) return;
    el.innerHTML = TIME_SLOTS.map(t =>
      `<button class="book-slot${state.time === t ? ' selected' : ''}" onclick="bookPickTime('${t}')">${t}</button>`
    ).join('');
  }

  window.bookPickTime = function(t) {
    state.time = t;
    renderSlots();
    document.getElementById('bookNext2').disabled = false;
  };

  // ---- Details validation ----
  function validateDetails() {
    const name  = (document.getElementById('bfName')?.value  || '').trim();
    const email = (document.getElementById('bfEmail')?.value || '').trim();
    const btn   = document.getElementById('bookNext3');
    const ok    = name.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (btn) btn.disabled = !ok;
  }

  // ---- Build review ----
  function buildReview() {
    state.name    = (document.getElementById('bfName')?.value    || '').trim();
    state.email   = (document.getElementById('bfEmail')?.value   || '').trim();
    state.phone   = (document.getElementById('bfPhone')?.value   || '').trim();
    state.company = (document.getElementById('bfCompany')?.value || '').trim();
    state.message = (document.getElementById('bfMessage')?.value || '').trim();

    const dateStr = state.date
      ? state.date.toLocaleDateString('en-KE', { weekday:'long', year:'numeric', month:'long', day:'numeric' })
      : '';
    const rows = [
      ['Service', state.service],
      ['Date',    dateStr],
      ['Time',    state.time],
      ['Name',    state.name],
      ['Email',   state.email],
      state.phone   ? ['Phone',   state.phone]   : null,
      state.company ? ['Company', state.company] : null,
      state.message ? ['Message', state.message] : null,
    ].filter(Boolean);

    const el = document.getElementById('bookReview');
    if (el) el.innerHTML = rows.map(([k, v]) =>
      `<div class="book-review-row"><span>${k}</span><strong>${v}</strong></div>`
    ).join('');
  }

  // ---- Submit (mailto) ----
  window.submitBooking = function() {
    const dateStr = state.date
      ? state.date.toLocaleDateString('en-KE', { weekday:'long', year:'numeric', month:'long', day:'numeric' })
      : '';
    const subject = encodeURIComponent(`Consultation Booking: ${state.service} — ${state.name}`);
    const body = encodeURIComponent(
      `New Booking via Adpulse Website\n` +
      `===================================\n\n` +
      `Service : ${state.service}\n` +
      `Date    : ${dateStr}\n` +
      `Time    : ${state.time}\n\n` +
      `Name    : ${state.name}\n` +
      `Email   : ${state.email}\n` +
      `Phone   : ${state.phone   || 'Not provided'}\n` +
      `Company : ${state.company || 'Not provided'}\n\n` +
      `Message :\n${state.message || 'None'}\n\n` +
      `---\nSent from adpulse-ltd.vercel.app`
    );
    window.location.href = `mailto:adpulseindustries@gmail.com?subject=${subject}&body=${body}`;

    // Success screen
    const shortDate = state.date
      ? state.date.toLocaleDateString('en-KE', { weekday:'short', month:'short', day:'numeric' })
      : '';
    const detail = document.getElementById('bookSuccessDetail');
    if (detail) {
      detail.innerHTML =
        `<span>📅 ${shortDate} at ${state.time}</span>` +
        `<span>📧 Confirmation to ${state.email}</span>`;
    }
    bookGoTo('success');
  };

  // ---- Reset on re-open ----
  function resetWizard() {
    Object.assign(state, {
      service: null, date: null, time: null,
      name: '', email: '', phone: '', company: '', message: '',
    });
    const now = new Date();
    state.calYear = now.getFullYear(); state.calMonth = now.getMonth();

    if (!modal) return;
    modal.querySelectorAll('.book-step').forEach(s => { s.hidden = true; });
    const s1 = document.getElementById('bookStep1');
    if (s1) s1.hidden = false;

    modal.querySelectorAll('.book-service-card').forEach(c => c.classList.remove('selected'));
    document.getElementById('bookNext1').disabled = true;

    ['bfName','bfEmail','bfPhone','bfCompany','bfMessage'].forEach(id => {
      const el = document.getElementById(id); if (el) el.value = '';
    });
    document.getElementById('bookNext3').disabled = true;

    renderCalendar();
    const slotsWrap = document.getElementById('bookSlotsWrap');
    if (slotsWrap) slotsWrap.hidden = true;
    document.getElementById('bookNext2').disabled = true;

    const bar = document.getElementById('bookProgressBar');
    if (bar) bar.style.width = '25%';
    ['bsl1','bsl2','bsl3','bsl4'].forEach((id, i) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.classList.toggle('active', i === 0);
      el.classList.remove('done');
    });
  }
  window._resetBookingWizard = resetWizard;

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

function openBookingModal() {
  const modal = document.getElementById('bookingModal');
  if (!modal) return;
  if (window._resetBookingWizard) window._resetBookingWizard();
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeBookingModal() {
  const modal = document.getElementById('bookingModal');
  if (!modal) return;
  modal.hidden = true;
  document.body.style.overflow = '';
}

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
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const overlay   = document.getElementById('navOverlay');

  // Scroll: add .scrolled class
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Open / close helpers
  function openMenu() {
    hamburger.classList.add('open');
    navLinks.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  }
  function closeMenu() {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  }

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('open') ? closeMenu() : openMenu();
  });

  // Close on overlay click
  if (overlay) overlay.addEventListener('click', closeMenu);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu when resizing to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMenu();
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  const links    = navLinks.querySelectorAll('.nav-link[href^="#"]');

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
   8b. NEWSLETTER FORM
   ============================================================ */
(function initNewsletter() {
  const form    = document.getElementById('newsletterForm');
  const success = document.getElementById('newsletterSuccess');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    const btn   = form.querySelector('button');
    btn.disabled = true;
    btn.innerHTML = 'Subscribing&hellip;';

    let apiOk = false;
    // 1. Try the backend API first
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) apiOk = true;
    } catch (_) { /* api not running — fall through */ }

    // 2. Fallback: open a pre-filled mailto so the subscription never silently drops
    if (!apiOk) {
      const subject = encodeURIComponent('Newsletter Subscription — ' + email);
      const body    = encodeURIComponent('Please subscribe me to the Adpulse newsletter.\n\nEmail: ' + email);
      window.open('mailto:adpulseindustries@gmail.com?subject=' + subject + '&body=' + body);
    }

    form.style.display = 'none';
    success.classList.add('show');
  });
})();

/* ============================================================
   9. FAQ ACCORDION
   ============================================================ */
(function initFAQ() {
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen  = btn.getAttribute('aria-expanded') === 'true';
      const answer  = btn.nextElementSibling;

      // Close all
      document.querySelectorAll('.faq-q').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling.classList.remove('open');
      });

      // Toggle current
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
      }
    });
  });
})();

/* ============================================================
   10. BACK TO TOP
   ============================================================ */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  const updateBackToTop = () => {
    const scrollTop = window.scrollY;
    const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const progress = Math.min(scrollTop / scrollable, 1);

    btn.classList.toggle('visible', scrollTop > 220);
    btn.style.setProperty('--scroll-progress', `${Math.max(progress * 360, 8)}deg`);
  };

  window.addEventListener('scroll', updateBackToTop, { passive: true });
  updateBackToTop();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ============================================================
   11. PAGE LOADER
   ============================================================ */
(function initLoader() {
  const loader   = document.getElementById('pageLoader');
  const progress = document.getElementById('loaderProgress');
  if (!loader) return;

  let p = 0;
  const tick = setInterval(() => {
    p = Math.min(p + Math.random() * 25, 90);
    progress.style.width = p + '%';
  }, 120);

  window.addEventListener('load', () => {
    clearInterval(tick);
    progress.style.width = '100%';
    setTimeout(() => loader.classList.add('hidden'), 400);
  });
})();

/* ============================================================
   12. HERO TYPEWRITER
   ============================================================ */
(function initTypewriter() {
  const subtitle = document.querySelector('.hero-subtitle');
  if (!subtitle) return;
  const text = subtitle.textContent.trim();
  subtitle.textContent = '';
  subtitle.style.visibility = 'visible';
  let i = 0;

  // Delay to start after hero animates in
  setTimeout(() => {
    const type = () => {
      if (i < text.length) {
        subtitle.textContent += text[i++];
        setTimeout(type, 18);
      }
    };
    type();
  }, 800);
})();

/* ============================================================
   13. SCROLL PROGRESS BAR
   ============================================================ */
(function initScrollProgress() {
  const bar = document.getElementById('scrollProgressBar');
  if (!bar) return;
  const update = () => {
    const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    bar.style.width = Math.min((window.scrollY / scrollable) * 100, 100) + '%';
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ============================================================
   14. COOKIE CONSENT
   ============================================================ */
(function initCookieBanner() {
  const banner = document.getElementById('cookieBanner');
  if (!banner) return;
  if (localStorage.getItem('adp_cookie_consent')) return; // already decided

  // Show after 2 seconds so it doesn't clash with the page loader
  setTimeout(() => { banner.hidden = false; }, 2000);

  window.cookieAccept = function() {
    localStorage.setItem('adp_cookie_consent', 'accepted');
    banner.hidden = true;
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'granted' });
    }
  };
  window.cookieDecline = function() {
    localStorage.setItem('adp_cookie_consent', 'declined');
    banner.hidden = true;
  };
})();

/* ============================================================
   15. GA4 EVENT TRACKING
   ============================================================ */
(function initGA4Events() {
  function track(event, params) {
    if (typeof gtag !== 'undefined') gtag('event', event, params);
  }

  // Contact form submission
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', () => {
      track('generate_lead', { event_category: 'Contact Form', event_label: 'Contact Form Submit' });
    });
  }

  // Newsletter subscription
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', () => {
      track('sign_up', { event_category: 'Newsletter', event_label: 'Newsletter Subscribe' });
    });
  }

  // WhatsApp float button
  const waFloat = document.querySelector('.whatsapp-float');
  if (waFloat) {
    waFloat.addEventListener('click', () => {
      track('contact', { event_category: 'WhatsApp', event_label: 'Floating WhatsApp Click' });
    });
  }

  // Booking modal open
  const origOpen = window.openBookingModal;
  window.openBookingModal = function() {
    track('begin_checkout', { event_category: 'Booking', event_label: 'Booking Modal Opened' });
    if (origOpen) origOpen();
  };

  // Booking submit
  const origSubmit = window.submitBooking;
  window.submitBooking = function() {
    track('purchase', { event_category: 'Booking', event_label: 'Booking Submitted' });
    if (origSubmit) origSubmit();
  };
})();

/* ============================================================
   16. CURSOR GLOW (desktop only)
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
