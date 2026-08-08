/* ==========================================================================
   Antigravity Portfolio Interactive Logic 4.0 - K.M.Y.S. Kulathunga
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initNavigation();
  initScrollAnimations();
  initProjectFilters();
  initModals();
  initContactForm();
  initCopyButtons();
  init3DTilt();
  initCommandPalette();
  initThemeSwitcher();
});

/* --------------------------------------------------------------------------
   1. Canvas Background Effect
   -------------------------------------------------------------------------- */
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const particles = [];
  const particleCount = Math.floor(width < 768 ? 30 : 65);

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 1.8 + 0.6;
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(99, 102, 241, ${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(6, 182, 212, ${0.15 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
}

/* --------------------------------------------------------------------------
   2. Navigation & Sticky Scroll Spy
   -------------------------------------------------------------------------- */
function initNavigation() {
  const header = document.querySelector('.header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  mobileToggle?.addEventListener('click', () => {
    navLinks?.classList.toggle('open');
    const icon = mobileToggle.querySelector('i');
    if (icon) {
      icon.className = navLinks?.classList.contains('open') ? 'ri-close-line' : 'ri-menu-line';
    }
  });

  navItems.forEach(link => {
    link.addEventListener('click', () => {
      navLinks?.classList.remove('open');
      const icon = mobileToggle?.querySelector('i');
      if (icon) icon.className = 'ri-menu-line';
    });
  });

  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');
      const link = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        link?.classList.add('active');
      } else {
        link?.classList.remove('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   3. Scroll Animations & Progress Meters
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const skillBars = document.querySelectorAll('.skill-progress-fill');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const targetWidth = fill.style.width || fill.getAttribute('data-percentage') || '85%';
        fill.style.width = targetWidth;
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.1 });

  skillBars.forEach(bar => observer.observe(bar));
}

/* --------------------------------------------------------------------------
   4. Filterable Projects
   -------------------------------------------------------------------------- */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      playClickSound();

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => card.style.opacity = '1', 50);
        } else {
          card.style.opacity = '0';
          setTimeout(() => card.style.display = 'none', 300);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. Modals & Drawer Triggers
   -------------------------------------------------------------------------- */
const projectData = {
  sports: {
    title: "University Sports Portal",
    subtitle: "Full-Stack Sports Management Platform",
    image: "assets/sports_portal.jpg",
    category: "MERN Stack / Full-Stack",
    tech: ["Next.js", "React", "Node.js", "Express.js", "MongoDB", "Tailwind CSS", "JWT", "Bcrypt", "Framer Motion"],
    description: `A comprehensive full-stack web application designed for university sports administration. It manages sports clubs, athlete registration, tournament scheduling, and training program tracking with secure role-based permissions (Students, Coaches, Administrators).`,
    features: [
      "Role-Based Access Control (JWT & Password hashing with Bcrypt)",
      "Dynamic Tournament & Match Fixture Scheduler",
      "Athlete Performance & Membership Tracking",
      "Framer Motion Micro-animations and responsive Tailwind UI dashboard"
    ]
  },
  internship: {
    title: "Internship Management System",
    subtitle: "Web Placement & Application Pipeline",
    image: "assets/internship_system.jpg",
    category: "PHP & MySQL",
    tech: ["PHP", "MySQL", "Tailwind CSS", "JavaScript", "HTML5", "CSS3"],
    description: `A specialized web portal built to bridge undergraduate students, university coordinators, and hiring companies. Automates application submission, interview tracking, placement approvals, and periodic evaluation logs.`,
    features: [
      "Student Resume & Application Tracking System",
      "Company Portal for Listing Open Positions & Reviewing Applicants",
      "Admin Approval Workflow & Progress Report Generation",
      "Relational MySQL Schema with optimized query performance"
    ]
  },
  suit: {
    title: "Wedding Suit Collection Management System",
    subtitle: "Rental & Purchasing Ecommerce Suite",
    image: "assets/wedding_suit.jpg",
    category: "MERN Stack / Full-Stack",
    tech: ["Next.js", "React", "Node.js", "Express.js", "MongoDB", "Tailwind CSS", "JWT", "Bcrypt", "Framer Motion"],
    description: `Full-stack commercial management platform tailored for modern wedding suit rental and sales businesses. Supports suit collection management, custom size fitting logs, customer rental booking calendars, and invoice management.`,
    features: [
      "Interactive Suit Catalog & Rental Availability Calendar",
      "Custom Order Fitting & Measurement Tracking",
      "Customer Order Status & Payment Logging",
      "Responsive Executive Dashboard for Store Owners"
    ]
  }
};

function initModals() {
  const projectModal = document.getElementById('project-modal');
  const cvModal = document.getElementById('cv-modal');
  const allModals = document.querySelectorAll('.modal-backdrop');
  const closeBtns = document.querySelectorAll('.modal-close');

  document.querySelectorAll('.open-drawer').forEach(card => {
    card.addEventListener('click', () => {
      playClickSound();
      const targetId = card.getAttribute('data-target');
      const targetModal = document.getElementById(targetId);
      if (targetModal) {
        targetModal.classList.add('active');
      }
    });
  });

  document.querySelectorAll('.open-project-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      playClickSound();
      const id = btn.getAttribute('data-project-id');
      const data = projectData[id];
      if (!data) return;

      const titleEl = document.getElementById('modal-project-title');
      const categoryEl = document.getElementById('modal-project-category');
      const imgEl = document.getElementById('modal-project-img');
      const descEl = document.getElementById('modal-project-desc');
      const techEl = document.getElementById('modal-project-tech');
      const featuresEl = document.getElementById('modal-project-features');

      if (titleEl) titleEl.innerText = data.title;
      if (categoryEl) categoryEl.innerText = data.category;
      if (imgEl) imgEl.src = data.image;
      if (descEl) descEl.innerText = data.description;

      if (techEl) {
        techEl.innerHTML = data.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');
      }

      if (featuresEl) {
        featuresEl.innerHTML = data.features.map(f => `<li><i class="ri-checkbox-circle-line" style="color: var(--cyan); margin-right: 8px;"></i>${f}</li>`).join('');
      }

      projectModal?.classList.add('active');
    });
  });

  document.querySelectorAll('.open-cv-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      playClickSound();
      cvModal?.classList.add('active');
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      allModals.forEach(m => m.classList.remove('active'));
    });
  });

  allModals.forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   6. 3D Tilt Effect on Cards
   -------------------------------------------------------------------------- */
function init3DTilt() {
  const tiltCards = document.querySelectorAll('.tilt-card');
  
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });
}

/* --------------------------------------------------------------------------
   7. Command Palette & Quick Search (Ctrl + K)
   -------------------------------------------------------------------------- */
function initCommandPalette() {
  const palette = document.getElementById('command-palette');
  const trigger = document.querySelector('.open-command-palette');
  const input = document.getElementById('command-input');
  const items = document.querySelectorAll('.command-item');

  const togglePalette = () => {
    playClickSound();
    palette?.classList.toggle('active');
    if (palette?.classList.contains('active')) {
      setTimeout(() => input?.focus(), 100);
    }
  };

  trigger?.addEventListener('click', togglePalette);

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      togglePalette();
    }
    if (e.key === 'Escape' && palette?.classList.contains('active')) {
      palette.classList.remove('active');
    }
  });

  palette?.addEventListener('click', (e) => {
    if (e.target === palette) palette.classList.remove('active');
  });

  input?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    items.forEach(item => {
      const text = item.innerText.toLowerCase();
      item.style.display = text.includes(query) ? 'flex' : 'none';
    });
  });

  items.forEach(item => {
    item.addEventListener('click', () => {
      palette?.classList.remove('active');
    });
  });
}

/* --------------------------------------------------------------------------
   8. Dynamic Theme Color Switcher
   -------------------------------------------------------------------------- */
function initThemeSwitcher() {
  const btn = document.querySelector('.toggle-theme');
  const themes = ['', 'theme-violet', 'theme-emerald'];
  let currentIdx = 0;

  btn?.addEventListener('click', () => {
    playClickSound();
    document.body.classList.remove(themes[currentIdx]);
    currentIdx = (currentIdx + 1) % themes.length;
    if (themes[currentIdx]) {
      document.body.classList.add(themes[currentIdx]);
    }
    showToast(`Color Accent Changed!`);
  });
}

/* --------------------------------------------------------------------------
   9. Web Audio API Synthetic Click Sound Effect
   -------------------------------------------------------------------------- */
function playClickSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (err) {
    // Ignore audio restrictions
  }
}

/* --------------------------------------------------------------------------
   10. Contact Form Handler
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    if (!btn) return;

    const originalText = btn.innerHTML;
    btn.innerHTML = `<i class="ri-loader-4-line ri-spin"></i> Sending...`;
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = `<i class="ri-check-line"></i> Message Sent!`;
      showToast("Thank you! Your message has been sent successfully.");
      form.reset();

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }, 3000);
    }, 1200);
  });
}

/* --------------------------------------------------------------------------
   11. Copy Buttons & Toast
   -------------------------------------------------------------------------- */
function initCopyButtons() {
  document.querySelectorAll('[data-copy]').forEach(el => {
    el.addEventListener('click', () => {
      const textToCopy = el.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy);
        playClickSound();
        showToast(`Copied to clipboard: ${textToCopy}`);
      }
    });
  });
}

function showToast(message) {
  let toast = document.querySelector('.toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="ri-checkbox-circle-fill" style="color: var(--emerald); font-size: 1.25rem;"></i> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
