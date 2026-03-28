/* =========================================================
   SIDERAL BAR — Main Script
   ========================================================= */

// ── Starfield Canvas ───────────────────────────────────────
(function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let stars = [];
  let shootingStars = [];
  let W, H;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createStar() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.4 + 0.2,
      alpha: Math.random(),
      speed: Math.random() * 0.002 + 0.001,
      phase: Math.random() * Math.PI * 2,
      color: Math.random() > 0.85
        ? `rgba(232,184,75,`
        : Math.random() > 0.7
          ? `rgba(180,195,255,`
          : `rgba(230,230,255,`
    };
  }

  function createShootingStar() {
    return {
      x: Math.random() * W * 0.7,
      y: Math.random() * H * 0.4,
      vx: 5 + Math.random() * 8,
      vy: 2 + Math.random() * 4,
      alpha: 1,
      trail: []
    };
  }

  function init() {
    resize();
    stars = Array.from({ length: 280 }, createStar);
    window.addEventListener('resize', () => { resize(); });
    setInterval(() => {
      if (shootingStars.length < 2 && Math.random() > 0.7) {
        shootingStars.push(createShootingStar());
      }
    }, 3000);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw stars
    stars.forEach(s => {
      const t = performance.now() * s.speed;
      const alpha = 0.3 + Math.abs(Math.sin(t + s.phase)) * 0.7;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.color + alpha + ')';
      ctx.fill();
    });

    // Draw shooting stars
    shootingStars.forEach((ss, i) => {
      ss.trail.push({ x: ss.x, y: ss.y, alpha: ss.alpha });
      if (ss.trail.length > 20) ss.trail.shift();

      ss.trail.forEach((tp, ti) => {
        const a = tp.alpha * (ti / ss.trail.length) * 0.5;
        ctx.beginPath();
        ctx.arc(tp.x, tp.y, 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232,184,75,${a})`;
        ctx.fill();
      });

      ss.x += ss.vx;
      ss.y += ss.vy;
      ss.alpha -= 0.025;

      if (ss.alpha <= 0 || ss.x > W) {
        shootingStars.splice(i, 1);
      }
    });

    requestAnimationFrame(draw);
  }

  init();
  draw();
})();

// ── Navbar Scroll ──────────────────────────────────────────
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
})();

// ── Mobile Menu ────────────────────────────────────────────
(function initMobileMenu() {
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const closeBtn = document.querySelector('.mobile-close');

  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  function closeMenu() {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
})();

// ── Scroll Reveal + Stagger + Gold lines ──────────────────
(function initScrollReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Gold lines
        entry.target.querySelectorAll('.gold-line').forEach(l => l.classList.add('visible-line'));
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  const revealClasses = ['.reveal', '.reveal-left', '.reveal-right', '.reveal-scale', '.stagger-children'];
  revealClasses.forEach(sel => document.querySelectorAll(sel).forEach(el => obs.observe(el)));

  // Also observe standalone gold-lines
  document.querySelectorAll('.gold-line').forEach(line => {
    const lineObs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { line.classList.add('visible-line'); lineObs.unobserve(line); }
    }, { threshold: 0.5 });
    lineObs.observe(line);
  });
})();

// ── Parallax on scroll ────────────────────────────────────
(function initParallax() {
  const targets = document.querySelectorAll('[data-parallax]');
  if (!targets.length) return;

  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    targets.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.15;
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const offset = (window.innerHeight / 2 - center) * speed;
      el.style.transform = `translateY(${offset}px)`;
    });
  }, { passive: true });
})();

// ── CountUp animation ─────────────────────────────────────
function countUp(el, target, duration = 1500) {
  const start = performance.now();
  const isFloat = target % 1 !== 0;
  const step = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = eased * target;
    el.textContent = isFloat ? value.toFixed(1) : Math.floor(value);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = isFloat ? target.toFixed(1) : target;
  };
  requestAnimationFrame(step);
}

function initCountUps() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.countup);
        if (!isNaN(target)) countUp(el, target);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-countup]').forEach(el => obs.observe(el));
}

// ── Render Menu ────────────────────────────────────────────
function renderMenu() {
  const data = getMenuData();
  const tabsContainer = document.getElementById('menu-tabs');
  const categoriesContainer = document.getElementById('menu-categories');

  if (!tabsContainer || !categoriesContainer) return;

  tabsContainer.innerHTML = '';
  categoriesContainer.innerHTML = '';

  data.categorias.forEach((cat, idx) => {
    // Tab
    const tab = document.createElement('button');
    tab.className = `menu-tab${idx === 0 ? ' active' : ''}`;
    tab.dataset.category = cat.id;
    tab.innerHTML = `${cat.emoji} ${cat.nombre}`;
    tab.addEventListener('click', () => switchCategory(cat.id));
    tabsContainer.appendChild(tab);

    // Category
    const section = document.createElement('div');
    section.className = `menu-category${idx === 0 ? ' active' : ''}`;
    section.id = `cat-${cat.id}`;

    const desc = document.createElement('p');
    desc.className = 'category-desc';
    desc.textContent = cat.descripcion;
    section.appendChild(desc);

    const grid = document.createElement('div');
    grid.className = 'menu-grid';

    cat.platos.filter(p => p.disponible).forEach(plato => {
      grid.appendChild(createMenuCard(plato));
    });

    section.appendChild(grid);
    categoriesContainer.appendChild(section);
  });
}

function createMenuCard(plato) {
  const card = document.createElement('div');
  card.className = 'menu-card';

  const badgeClasses = {
    'Top Chef': 'badge-chef',
    'Especial Chef': 'badge-chef',
    'Fan Favorito': 'badge-fan',
    'Ibérico': 'badge-iberico',
    'Vegano': 'badge-vegano',
  };
  const badgeClass = plato.badge ? (badgeClasses[plato.badge] || '') : '';

  const stars = ratingToStars(plato.rating);

  card.innerHTML = `
    <div class="card-image">
      <img src="${plato.imagen}" alt="${plato.nombre}" loading="lazy">
      <div class="card-overlay"></div>
      ${plato.badge ? `<span class="card-badge ${badgeClass}">${plato.badge}</span>` : ''}
    </div>
    <div class="card-body">
      <h3 class="card-name">${plato.nombre}</h3>
      <p class="card-desc">${plato.descripcion}</p>
      <div class="card-footer">
        <div>
          <span class="card-price">${plato.precio}€</span>
          <span class="card-price-unit">${plato.unidad}</span>
        </div>
        <div class="card-rating">
          <span class="stars">${stars}</span>
          <span class="rating-num">(${plato.numResenas})</span>
        </div>
      </div>
    </div>
  `;
  return card;
}

function ratingToStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '⯨' : '') + '☆'.repeat(empty);
}

function switchCategory(id) {
  document.querySelectorAll('.menu-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.category === id);
  });
  document.querySelectorAll('.menu-category').forEach(c => {
    c.classList.toggle('active', c.id === `cat-${id}`);
  });
}

// ── Render Chef Recommendations ────────────────────────────
function renderRecommendations() {
  const data = getMenuData();
  const container = document.getElementById('chef-recs');
  if (!container) return;

  // Pick top-rated dishes with chef badges
  const starred = [];
  data.categorias.forEach(cat => {
    cat.platos.forEach(p => {
      if (p.disponible && (p.badge === 'Especial Chef' || p.badge === 'Top Chef' || p.badge === 'Estrella de la Carta' || p.badge === 'Best Seller')) {
        starred.push({ ...p, categoria: cat.nombre });
      }
    });
  });

  // Take top 3 by rating
  const top3 = starred.sort((a, b) => b.rating - a.rating).slice(0, 3);

  container.innerHTML = top3.map(p => `
    <div class="chef-card reveal">
      <img class="chef-card-img" src="${p.imagen}" alt="${p.nombre}" loading="lazy">
      <div class="chef-card-overlay"></div>
      <div class="chef-card-content">
        <span class="chef-badge">${p.badge}</span>
        <h3 class="chef-card-name">${p.nombre}</h3>
        <p class="chef-card-desc">${p.descripcion}</p>
        <span class="chef-card-price">${p.precio}€ <small style="font-size:0.65em;color:var(--cream-muted)">${p.unidad}</small></span>
      </div>
    </div>
  `).join('');

  // Re-init scroll reveal for new elements
  container.querySelectorAll('.reveal').forEach(el => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    observer.observe(el);
  });
}

// ── Media carousel data (fotos + vídeos IG estilo) ────────
const MEDIA_SLIDES = [
  { tipo: 'foto', imagen: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=600&fit=crop&q=80', label: 'Ambiente', tag: 'Local' },
  { tipo: 'video', imagen: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600&h=600&fit=crop&q=80', label: 'Tacos de atún', tag: 'Vídeo' },
  { tipo: 'foto', imagen: 'https://images.unsplash.com/photo-1484980972926-edee96e0960d?w=600&h=600&fit=crop&q=80', label: 'Croquetas caseras', tag: 'Plato' },
  { tipo: 'video', imagen: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&h=600&fit=crop&q=80', label: 'Cócteles de autor', tag: 'Vídeo' },
  { tipo: 'foto', imagen: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=600&h=600&fit=crop&q=80', label: 'Sashimi flambeado', tag: 'Plato' },
  { tipo: 'video', imagen: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&h=600&fit=crop&q=80', label: 'Noche en Sideral', tag: 'Vídeo' },
  { tipo: 'foto', imagen: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=600&h=600&fit=crop&q=80', label: 'Tabla de quesos', tag: 'Plato' },
  { tipo: 'foto', imagen: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=600&h=600&fit=crop&q=80', label: 'Gin tonic especial', tag: 'Cocktail' },
  { tipo: 'video', imagen: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=600&fit=crop&q=80', label: 'Solomillo de vaca', tag: 'Vídeo' },
  { tipo: 'foto', imagen: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=600&fit=crop&q=80', label: 'Pinchos de cordero', tag: 'Plato' },
  { tipo: 'video', imagen: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&h=600&fit=crop&q=80', label: 'Presa ibérica', tag: 'Vídeo' },
  { tipo: 'foto', imagen: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&h=600&fit=crop&q=80', label: 'Bagel de Pastrami', tag: 'Plato' },
];

// ── Render Media Carousel ──────────────────────────────────
function renderGallery() {
  renderMediaCarousel();
  renderMiniGrid();
}

function renderMediaCarousel() {
  const track = document.getElementById('media-track');
  const dotsContainer = document.getElementById('media-dots');
  if (!track) return;

  let current = 0;
  let isDragging = false;
  let dragStartX = 0;
  let autoTimer;

  const cpv = () => window.innerWidth < 600 ? 1 : window.innerWidth < 900 ? 2 : 3;

  function build() {
    track.innerHTML = MEDIA_SLIDES.map((s, i) => `
      <div class="media-slide${s.tipo === 'video' ? ' is-video' : ''}" data-idx="${i}">
        <img src="${s.imagen}" alt="${s.label}" loading="${i < 4 ? 'eager' : 'lazy'}">
        ${s.tipo === 'video' ? '<div class="video-play-btn"></div>' : ''}
        <div class="media-slide-overlay">
          <span class="media-slide-label">
            ${s.tipo === 'video' ? '▶' : '📷'} ${s.label}
          </span>
        </div>
        <span class="ig-badge">${s.tag}</span>
      </div>
    `).join('');

    // Slides: open IG on click
    track.querySelectorAll('.media-slide').forEach(sl => {
      sl.addEventListener('click', () => {
        window.open('https://www.instagram.com/sideralbar/', '_blank');
      });
    });

    buildDots();
    goTo(0, false);
  }

  function buildDots() {
    if (!dotsContainer) return;
    const pages = Math.ceil(MEDIA_SLIDES.length / cpv());
    dotsContainer.innerHTML = Array.from({ length: pages }, (_, i) =>
      `<div class="media-dot${i === 0 ? ' active' : ''}" data-page="${i}"></div>`
    ).join('');
    dotsContainer.querySelectorAll('.media-dot').forEach(d => {
      d.addEventListener('click', () => goTo(parseInt(d.dataset.page)));
    });
  }

  function goTo(page, animate = true) {
    const c = cpv();
    const pages = Math.ceil(MEDIA_SLIDES.length / c);
    current = (page + pages) % pages;
    const slideW = track.parentElement.offsetWidth / c;
    const gap = 19.2; // ~1.2rem in px
    track.style.transition = animate ? 'transform 0.55s cubic-bezier(0.4,0,0.2,1)' : 'none';
    track.style.transform = `translateX(-${current * (slideW + gap)}px)`;
    dotsContainer?.querySelectorAll('.media-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => goTo(current + 1), 4000);
  }

  function stopAuto() { clearInterval(autoTimer); }

  // Touch / mouse drag
  track.addEventListener('pointerdown', e => {
    isDragging = true;
    dragStartX = e.clientX;
    stopAuto();
    track.setPointerCapture(e.pointerId);
  });

  track.addEventListener('pointermove', e => {
    if (!isDragging) return;
    const diff = e.clientX - dragStartX;
    const c = cpv();
    const slideW = track.parentElement.offsetWidth / c;
    const base = current * (slideW + 19.2);
    track.style.transition = 'none';
    track.style.transform = `translateX(-${base - diff}px)`;
  });

  track.addEventListener('pointerup', e => {
    if (!isDragging) return;
    isDragging = false;
    const diff = e.clientX - dragStartX;
    if (diff < -50) goTo(current + 1);
    else if (diff > 50) goTo(current - 1);
    else goTo(current);
    startAuto();
  });

  document.getElementById('media-prev')?.addEventListener('click', () => { goTo(current - 1); stopAuto(); startAuto(); });
  document.getElementById('media-next')?.addEventListener('click', () => { goTo(current + 1); stopAuto(); startAuto(); });

  window.addEventListener('resize', () => { buildDots(); goTo(Math.min(current, Math.ceil(MEDIA_SLIDES.length / cpv()) - 1), false); });

  build();
  startAuto();
}

function renderMiniGrid() {
  const container = document.getElementById('gallery-grid');
  if (!container) return;
  container.innerHTML = GALERIA_FOTOS.map(foto => `
    <div class="gallery-item">
      <img src="${foto.imagen}" alt="${foto.alt}" loading="lazy">
      <div class="gallery-overlay">
        <span class="gallery-icon">${foto.tipo === 'cocktail' ? '🍸' : foto.tipo === 'ambiente' ? '✨' : '🍽️'}</span>
        <span class="gallery-label">${foto.tipo === 'cocktail' ? 'Cocktail' : foto.tipo === 'ambiente' ? 'Ambiente' : 'Plato'}</span>
      </div>
    </div>
  `).join('');
}

// ── Render Reviews ─────────────────────────────────────────
function renderReviews() {
  const track = document.getElementById('reviews-track');
  const dotsContainer = document.getElementById('reviews-dots');
  if (!track) return;

  let currentSlide = 0;
  const cardsPerView = () => window.innerWidth < 768 ? 1 : window.innerWidth < 900 ? 2 : 3;

  function getTranslate() {
    const cw = track.parentElement.offsetWidth / cardsPerView();
    return currentSlide * (cw + 24); // 24 = gap in px
  }

  function render() {
    track.innerHTML = RESENAS_GOOGLE.map(r => `
      <div class="review-card">
        <span class="review-quote">"</span>
        <div class="review-header">
          <div class="review-avatar">${r.avatar}</div>
          <div class="review-meta">
            <div class="review-author">${r.autor}</div>
            <div class="review-date">${r.fecha}</div>
          </div>
        </div>
        <div class="review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
        <p class="review-text">${r.texto}</p>
      </div>
    `).join('');

    const total = RESENAS_GOOGLE.length;
    const pages = Math.ceil(total / cardsPerView());
    if (dotsContainer) {
      dotsContainer.innerHTML = Array.from({ length: pages }, (_, i) =>
        `<div class="review-dot${i === 0 ? ' active' : ''}" data-page="${i}"></div>`
      ).join('');
      dotsContainer.querySelectorAll('.review-dot').forEach(dot => {
        dot.addEventListener('click', () => goTo(parseInt(dot.dataset.page)));
      });
    }
  }

  function goTo(page) {
    const total = RESENAS_GOOGLE.length;
    const cpv = cardsPerView();
    const pages = Math.ceil(total / cpv);
    currentSlide = Math.max(0, Math.min(page, pages - 1));
    const cardWidth = track.parentElement.offsetWidth / cpv;
    track.style.transform = `translateX(-${currentSlide * (cardWidth + 24)}px)`;
    document.querySelectorAll('.review-dot').forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  }

  render();

  document.getElementById('reviews-prev')?.addEventListener('click', () => goTo(currentSlide - 1));
  document.getElementById('reviews-next')?.addEventListener('click', () => goTo(currentSlide + 1));

  // Auto-slide
  setInterval(() => {
    const cpv = cardsPerView();
    const pages = Math.ceil(RESENAS_GOOGLE.length / cpv);
    goTo((currentSlide + 1) % pages);
  }, 5000);

  window.addEventListener('resize', () => {
    currentSlide = 0;
    track.style.transform = 'translateX(0)';
    render();
  });
}

// ── Smooth Scroll for Hero CTA ─────────────────────────────
document.addEventListener('click', e => {
  const target = e.target.closest('[data-scroll]');
  if (!target) return;
  const dest = document.querySelector(target.dataset.scroll);
  if (dest) {
    e.preventDefault();
    dest.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

// ── Init All ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderMenu();
  renderRecommendations();
  renderGallery();
  renderReviews();
  initCountUps();
});
