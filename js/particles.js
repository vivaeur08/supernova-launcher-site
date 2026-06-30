// ============================================================
// PARTICULES & ÉTOILES
// ============================================================

(function() {
  
  // ===== ÉTOILES =====
  function createStars() {
    const container = document.getElementById('stars-bg');
    if (!container) return;
    
    const starCount = 150;
    
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      const sizeRand = Math.random();
      
      if (sizeRand < 0.7) star.className = 'star small';
      else if (sizeRand < 0.95) star.className = 'star medium';
      else star.className = 'star large';
      
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 5}s`;
      star.style.animationDuration = `${2 + Math.random() * 4}s`;
      
      container.appendChild(star);
    }
  }
  
  // ===== PARTICULES VIOLETTES =====
  function createParticles() {
    const container = document.getElementById('particles-bg');
    if (!container) return;
    
    const particleCount = 40;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      const size = 2 + Math.random() * 4;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${100 + Math.random() * 20}%`;
      
      const duration = 15 + Math.random() * 25;
      const delay = Math.random() * 15;
      particle.style.animation = `particleFloat ${duration}s linear ${delay}s infinite`;
      
      // Variations de couleur
      if (i % 3 === 0) {
        particle.style.background = '#c084fc';
        particle.style.boxShadow = '0 0 10px rgba(192, 132, 252, 0.7)';
      } else if (i % 5 === 0) {
        particle.style.background = '#d8b4fe';
        particle.style.boxShadow = '0 0 6px rgba(216, 180, 254, 0.5)';
      }
      
      container.appendChild(particle);
    }
  }
  
  // Init
  document.addEventListener('DOMContentLoaded', () => {
    createStars();
    createParticles();
  });
})();