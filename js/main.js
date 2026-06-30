// ============================================================
// MAIN.JS — Logique principale
// ============================================================

(function() {
  
  // ===== NAVBAR SCROLL EFFECT =====
  function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      
      if (currentScroll > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      
      lastScroll = currentScroll;
    });
  }
  
  // ===== SMOOTH SCROLL =====
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;
        
        e.preventDefault();
        
        const navbarHeight = 80;
        const offsetTop = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;
        
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      });
    });
  }
  
  // ===== COMPTEURS ANIMÉS =====
  function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
      const target = parseInt(counter.dataset.target);
      if (isNaN(target)) return;
      
      const duration = 2000;
      const steps = 60;
      const stepValue = target / steps;
      let current = 0;
      let step = 0;
      
      const timer = setInterval(() => {
        step++;
        current = Math.min(current + stepValue, target);
        counter.textContent = Math.floor(current);
        
        if (step >= steps || current >= target) {
          counter.textContent = target;
          clearInterval(timer);
        }
      }, duration / steps);
    });
  }
  
  // ===== REVEAL AU SCROLL =====
  function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.15 });
    
    elements.forEach(el => observer.observe(el));
  }
  
  // ===== INIT =====
  document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 SuperNova Site loaded');
    
    initNavbar();
    initSmoothScroll();
    initScrollReveal();
    
    // Compteurs après 1.5s (laisse le temps aux animations CSS)
    setTimeout(animateCounters, 1500);
  });
})();