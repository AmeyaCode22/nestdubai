/* NestDubai — main.js */

document.addEventListener('DOMContentLoaded', () => {

  // ─── NAVBAR SCROLL ──────────────────────────────────────────
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  // ─── MOBILE MENU ────────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ─── ACTIVE NAV LINK ────────────────────────────────────────
  const path = window.location.pathname;
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href !== '/' && path.startsWith(href)) link.classList.add('active');
    if (href === '/' && path === '/') link.classList.add('active');
  });

  // ─── VACANCY BAR ANIMATION ──────────────────────────────────
  const initVacancyBars = () => {
    document.querySelectorAll('.vacancy-bar').forEach(bar => {
      const fill = bar.querySelector('.vacancy-fill');
      if (!fill) return;
      const pct = parseFloat(bar.dataset.pct || 0);
      const wrap = bar.closest('[class*="vacancy-"]') || bar;
      setTimeout(() => {
        fill.style.width = pct + '%';
        if (pct > 50) wrap.classList.add('vacancy-high');
        else if (pct > 20) wrap.classList.add('vacancy-mid');
        else wrap.classList.add('vacancy-low');
      }, 200);
    });
  };
  initVacancyBars();

  // ─── SCROLL REVEAL ──────────────────────────────────────────
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.why-card, .prop-card, .prop-list-card').forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s`;
      io.observe(el);
    });
  }

  // ─── PROPERTY FILTER PILLS ──────────────────────────────────
  document.querySelectorAll('.filter-pill[data-filter]').forEach(pill => {
    pill.addEventListener('click', () => {
      const filterType = pill.dataset.filter;
      const filterGroup = pill.dataset.group;

      // Update active state within same group
      document.querySelectorAll(`.filter-pill[data-group="${filterGroup}"]`).forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      filterProperties();
    });
  });

  function filterProperties() {
    const typePill = document.querySelector('.filter-pill[data-group="type"].active');
    const areaPill = document.querySelector('.filter-pill[data-group="area"].active');
    const typeVal = typePill ? typePill.dataset.filter : 'all';
    const areaVal = areaPill ? areaPill.dataset.filter : 'all';

    document.querySelectorAll('.prop-list-card[data-area], .prop-card[data-area]').forEach(card => {
      const cardArea = card.dataset.area || '';
      const cardTypes = (card.dataset.types || '').split(',');
      const areaMatch = areaVal === 'all' || cardArea === areaVal;
      const typeMatch = typeVal === 'all' || cardTypes.includes(typeVal);
      card.style.display = (areaMatch && typeMatch) ? '' : 'none';
    });
  }

  // ─── BOOKING FORM — ROOM SELECTION ──────────────────────────
  document.querySelectorAll('.room-select-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.room-select-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        radio.dispatchEvent(new Event('change', { bubbles: true }));
      }
      updateBookingSummary();
    });
  });

  document.querySelectorAll('.prop-select-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.prop-select-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  // ─── BOOKING SUMMARY UPDATE ─────────────────────────────────
  function updateBookingSummary() {
    const selected = document.querySelector('.room-select-card.selected');
    const durationSel = document.getElementById('duration_months');
    if (!selected || !durationSel) return;

    const price = parseFloat(selected.dataset.price || 0);
    const months = parseInt(durationSel.value || 1);
    const total = price * months;

    const summaryPrice = document.getElementById('summary-price');
    const summaryMonths = document.getElementById('summary-months');
    const summaryTotal = document.getElementById('summary-total');
    const summaryRoom = document.getElementById('summary-room');

    if (summaryPrice) summaryPrice.textContent = 'AED ' + price.toLocaleString();
    if (summaryMonths) summaryMonths.textContent = months + ' month' + (months > 1 ? 's' : '');
    if (summaryTotal) summaryTotal.textContent = 'AED ' + total.toLocaleString();
    if (summaryRoom) summaryRoom.textContent = selected.querySelector('.room-select-name')?.textContent || '';
  }

  const durationSel = document.getElementById('duration_months');
  if (durationSel) {
    durationSel.addEventListener('change', updateBookingSummary);
    updateBookingSummary();
  }

  // ─── PASSWORD TOGGLE ────────────────────────────────────────
  document.querySelectorAll('.password-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.closest('.password-toggle-wrap').querySelector('input');
      const isPass = input.type === 'password';
      input.type = isPass ? 'text' : 'password';
      btn.innerHTML = isPass
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
    });
  });

  // ─── FLASH MESSAGES AUTO-DISMISS ────────────────────────────
  document.querySelectorAll('.alert[data-autodismiss]').forEach(alert => {
    setTimeout(() => {
      alert.style.transition = 'opacity 0.4s';
      alert.style.opacity = '0';
      setTimeout(() => alert.remove(), 400);
    }, 4000);
  });

  // ─── PROPERTY DETAIL IMAGE GALLERY ──────────────────────────
  const heroImg = document.querySelector('.property-hero-main');
  document.querySelectorAll('.gallery-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      if (heroImg) heroImg.src = thumb.src;
    });
  });

  // ─── LIVE VACANCY POLL ──────────────────────────────────────
  if (document.querySelector('[data-live-vacancy]')) {
    const updateVacancies = async () => {
      try {
        const res = await fetch('/api/vacancies');
        const data = await res.json();
        data.forEach(prop => {
          prop.roomTypes.forEach(rt => {
            const el = document.querySelector(`[data-vacancy-id="${rt.id}"]`);
            if (el) {
              el.textContent = rt.available + ' available';
              el.dataset.count = rt.available;
              if (rt.available === 0) el.className = 'badge badge-danger';
              else if (rt.available <= 2) el.className = 'badge badge-warning';
              else el.className = 'badge badge-success';
            }
            const bar = document.querySelector(`[data-bar-id="${rt.id}"]`);
            if (bar) {
              const fill = bar.querySelector('.vacancy-fill');
              const pct = rt.total > 0 ? (rt.available / rt.total) * 100 : 0;
              if (fill) fill.style.width = pct + '%';
            }
          });
        });
      } catch (e) { /* silent fail */ }
    };
    updateVacancies();
    setInterval(updateVacancies, 30000);
  }

});
