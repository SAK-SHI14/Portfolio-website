/* ═══════════════════════════════════════════════
   SAKSHI VERMA — CINEMATIC PORTFOLIO
   Interactive JavaScript Engine
════════════════════════════════════════════════ */

'use strict';

// ─── DOM READY ───────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNeuralCanvas();
  initScrollProgress();
  initNavbar();
  initThemeToggle();
  initTypewriter();
  initCursorGlow();
  initRevealAnimations();
  initTiltCards();
  initProgressBars();
  initCounters();
  initBackToTop();
  initHamburger();
  initKonamiCode();
  initConfetti();
  initParallax();
  initContactForm();
  initCTAEffects();
});

// ═══════════════════════════════════════════════
// 1. NEURAL NETWORK CANVAS
// ═══════════════════════════════════════════════
function initNeuralCanvas() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;
  let nodes = [];
  const NODE_COUNT = Math.min(60, Math.floor(W * H / 16000));
  const MAX_DIST = 160;

  class Node {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2 + 1;
      this.alpha = Math.random() * 0.5 + 0.2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(192,132,252,${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < NODE_COUNT; i++) nodes.push(new Node());

  let mouseX = W / 2, mouseY = H / 2;
  window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

  function animate() {
    ctx.clearRect(0, 0, W, H);
    nodes.forEach(n => { n.update(); n.draw(); });

    // connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.25;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(168,85,247,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // mouse-node connections
    nodes.forEach(n => {
      const dx = mouseX - n.x;
      const dy = mouseY - n.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MAX_DIST * 1.5) {
        const alpha = (1 - dist / (MAX_DIST * 1.5)) * 0.4;
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(mouseX, mouseY);
        ctx.strokeStyle = `rgba(244,114,182,${alpha})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    });

    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });
}

// ═══════════════════════════════════════════════
// 2. SCROLL PROGRESS BAR
// ═══════════════════════════════════════════════
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (scrollTop / docHeight * 100) + '%';
  }, { passive: true });
}

// ═══════════════════════════════════════════════
// 3. NAVBAR SCROLL EFFECT
// ═══════════════════════════════════════════════
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // Active link highlighting
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => observer.observe(s));
}

// ═══════════════════════════════════════════════
// 4. THEME TOGGLE
// ═══════════════════════════════════════════════
function initThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  const html = document.documentElement;
  const saved = localStorage.getItem('sv-theme') || 'dark';
  html.setAttribute('data-theme', saved);

  btn?.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('sv-theme', next);
  });
}

// ═══════════════════════════════════════════════
// 5. TYPEWRITER EFFECT
// ═══════════════════════════════════════════════
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const phrases = [
    'AI Engineer',
    'Data Engineer',
    'Full-Stack Developer',
    'ML Enthusiast',
    'Open Source Builder'
  ];
  let phraseIdx = 0, charIdx = 0, isDeleting = false, delay = 100;

  function type() {
    const phrase = phrases[phraseIdx];
    if (isDeleting) {
      el.textContent = phrase.substring(0, charIdx--);
      delay = 50;
    } else {
      el.textContent = phrase.substring(0, charIdx++);
      delay = 110;
    }

    if (!isDeleting && charIdx === phrase.length + 1) {
      isDeleting = true;
      delay = 1600;
    } else if (isDeleting && charIdx === -1) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      charIdx = 0;
      delay = 400;
    }
    setTimeout(type, delay);
  }
  setTimeout(type, 800);
}

// ═══════════════════════════════════════════════
// 6. CURSOR GLOW TRAIL
// ═══════════════════════════════════════════════
function initCursorGlow() {
  const glow = document.getElementById('cursor-glow');
  if (!glow) return;
  let mx = 0, my = 0, cx = 0, cy = 0;

  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
  }, { passive: true });

  function animCursor() {
    cx += (mx - cx) * 0.08;
    cy += (my - cy) * 0.08;
    glow.style.left = cx + 'px';
    glow.style.top = cy + 'px';
    requestAnimationFrame(animCursor);
  }
  animCursor();
}

// ═══════════════════════════════════════════════
// 7. REVEAL ON SCROLL (IntersectionObserver)
// ═══════════════════════════════════════════════
function initRevealAnimations() {
  const elements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  elements.forEach(el => observer.observe(el));

  // Also reveal child cards with stagger
  const cards = document.querySelectorAll('.project-card, .cert-card, .skill-card, .counter-card, .github-stat-card');
  const cardObs = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 80);
        cardObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  cards.forEach(c => {
    c.style.opacity = '0';
    c.style.transform = 'translateY(30px)';
    c.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    cardObs.observe(c);
  });
}

// ═══════════════════════════════════════════════
// 8. 3D TILT CARDS
// ═══════════════════════════════════════════════
function initTiltCards() {
  const cards = document.querySelectorAll('.tilt-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -8;
      const rotY = ((x - cx) / cx) * 8;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
      card.style.boxShadow = `${-rotY * 2}px ${rotX * 2}px 30px rgba(168,85,247,0.2)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
}

// ═══════════════════════════════════════════════
// 9. PROGRESS BARS
// ═══════════════════════════════════════════════
function initProgressBars() {
  const bars = document.querySelectorAll('.progress-fill');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const w = entry.target.getAttribute('data-width');
        setTimeout(() => { entry.target.style.width = w + '%'; }, 200);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  bars.forEach(b => observer.observe(b));
}

// ═══════════════════════════════════════════════
// 10. ANIMATED COUNTERS
// ═══════════════════════════════════════════════
function initCounters() {
  const counters = document.querySelectorAll('.stat-number, .counter-num');
  const fired = new Set();

  function runCounter(el) {
    if (fired.has(el)) return;
    fired.add(el);
    const target = parseInt(el.getAttribute('data-target'));
    animateCounter(el, target);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  counters.forEach(c => observer.observe(c));

  // Fallback: fire any counters that haven't triggered after 3 seconds
  // (handles edge cases where elements are off-screen on small viewports)
  setTimeout(() => {
    counters.forEach(c => runCounter(c));
  }, 3000);
}

function animateCounter(el, target) {
  const duration = 1800;
  const start = performance.now();
  const easeOut = t => 1 - Math.pow(1 - t, 3);

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    el.textContent = Math.round(easeOut(progress) * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

// ═══════════════════════════════════════════════
// 11. BACK TO TOP
// ═══════════════════════════════════════════════
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ═══════════════════════════════════════════════
// 12. HAMBURGER MENU
// ═══════════════════════════════════════════════
function initHamburger() {
  const burger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  if (!burger || !navLinks) return;

  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });
}

// ═══════════════════════════════════════════════
// 13. KONAMI CODE EASTER EGG
// ═══════════════════════════════════════════════
function initKonamiCode() {
  const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let pos = 0;
  const egg = document.getElementById('easter-egg');

  document.addEventListener('keydown', e => {
    if (e.key === KONAMI[pos]) {
      pos++;
      if (pos === KONAMI.length) {
        pos = 0;
        if (egg) {
          egg.classList.remove('hidden');
          launchConfetti(150);
        }
      }
    } else {
      pos = e.key === KONAMI[0] ? 1 : 0;
    }
  });
}

// ═══════════════════════════════════════════════
// 14. CONFETTI EFFECT
// ═══════════════════════════════════════════════
function initConfetti() {
  // Confetti on CTA buttons
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', () => launchConfetti(30));
  });
}

function launchConfetti(count = 40) {
  const container = document.getElementById('confetti-container');
  if (!container) return;
  const colors = ['#A855F7','#F472B6','#FFD700','#60A5FA','#34D399','#C084FC','#FB923C'];

  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.style.cssText = `
      position:absolute;
      width:${Math.random()*10+4}px;
      height:${Math.random()*6+3}px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      left:${Math.random()*100}%;
      top:-20px;
      border-radius:${Math.random()>0.5?'50%':'2px'};
      transform:rotate(${Math.random()*360}deg);
      opacity:${Math.random()*0.8+0.2};
      animation:confFall ${Math.random()*2+1.5}s ease-out forwards;
      animation-delay:${Math.random()*0.5}s;
    `;
    container.appendChild(piece);
    setTimeout(() => piece.remove(), 3500);
  }
}

// Inject confetti keyframes
const confStyle = document.createElement('style');
confStyle.textContent = `
@keyframes confFall {
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(110vh) rotate(${Math.random()*720}deg); opacity: 0; }
}`;
document.head.appendChild(confStyle);

// ═══════════════════════════════════════════════
// 15. PARALLAX ON HERO
// ═══════════════════════════════════════════════
function initParallax() {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const blobs = document.querySelectorAll('.blob');
    blobs.forEach((blob, i) => {
      const speed = 0.05 + i * 0.02;
      blob.style.transform = `translateY(${scrollY * speed}px)`;
    });
    const canvas = document.getElementById('neural-canvas');
    if (canvas) canvas.style.transform = `translateY(${scrollY * 0.3}px)`;
  }, { passive: true });
}

// ═══════════════════════════════════════════════
// 16. CONTACT FORM — FormSubmit.co → Gmail
// ═══════════════════════════════════════════════
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('send-btn');
    const success = document.getElementById('form-success');
    const error = document.getElementById('form-error');

    // Loading state
    btn.disabled = true;
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Sending...`;

    const data = new FormData(form);

    try {
      const res = await fetch('https://formsubmit.co/ajax/vermasakshi0514@gmail.com', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: data
      });

      if (res.ok) {
        btn.style.display = 'none';
        success.classList.remove('hidden');
        error.classList.add('hidden');
        form.reset();
        launchConfetti(60);
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (err) {
      btn.disabled = false;
      btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Send Message`;
      error.classList.remove('hidden');
      success.classList.add('hidden');
    }
  });
}

// ═══════════════════════════════════════════════
// 17. CTA HOVER CONFETTI
// ═══════════════════════════════════════════════
function initCTAEffects() {
  const btns = document.querySelectorAll('#view-projects-btn, #download-resume-btn');
  let lastConf = 0;
  btns.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      const now = Date.now();
      if (now - lastConf > 500) {
        launchConfetti(15);
        lastConf = now;
      }
    });
  });
}

// ═══════════════════════════════════════════════
// 18. NAV ACTIVE STYLE
// ═══════════════════════════════════════════════
const navStyle = document.createElement('style');
navStyle.textContent = `
  .nav-link.active { color: var(--lavender) !important; }
  .nav-link.active::after { width: 60% !important; }
`;
document.head.appendChild(navStyle);

// ═══════════════════════════════════════════════
// 19. SMOOTH STAGGER FOR SKILL TAGS
// ═══════════════════════════════════════════════
document.querySelectorAll('.skill-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    const tags = card.querySelectorAll('.skill-tag');
    tags.forEach((tag, i) => {
      tag.style.transitionDelay = `${i * 30}ms`;
      tag.style.transform = 'scale(1.05)';
    });
  });
  card.addEventListener('mouseleave', () => {
    const tags = card.querySelectorAll('.skill-tag');
    tags.forEach(tag => {
      tag.style.transitionDelay = '0ms';
      tag.style.transform = '';
    });
  });
});
