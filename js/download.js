// ============================================================
// download.js - Récupère le .exe de la dernière release
// ============================================================

(function() {
  
  const GITHUB_REPO = 'vivaeur08/supernova-launcher-releases';
  const API_URL = `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`;
  
  let downloadUrl = null;
  let latestVersion = null;
  let fileSize = null;
  
  // ===== RÉCUPÉRER LA DERNIÈRE RELEASE =====
  async function fetchLatestRelease() {
    try {
      console.log('🔄 Récupération de la dernière release...');
      
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`API GitHub: ${response.status}`);
      
      const data = await response.json();
      
      // Trouver le fichier .exe
      const exeAsset = data.assets.find(asset => asset.name.endsWith('.exe'));
      
      if (!exeAsset) {
        throw new Error('Aucun .exe trouvé dans la dernière release');
      }
      
      downloadUrl = exeAsset.browser_download_url;
      latestVersion = data.tag_name.replace(/^v/, '');
      fileSize = (exeAsset.size / 1024 / 1024).toFixed(1); // MB
      
      console.log(`✅ Version ${latestVersion} trouvée (${fileSize} MB)`);
      console.log(`📥 URL: ${downloadUrl}`);
      
      updateDownloadButtons();
      updateVersionBadge();
      updateFileSize();
      
    } catch (error) {
      console.warn('⚠️ Impossible de récupérer la release:', error.message);
      // Fallback : utiliser le lien classique vers la page releases
      useFallbackLinks();
    }
  }
  
  // ===== METTRE À JOUR LES BOUTONS =====
  function updateDownloadButtons() {
    // Tous les boutons / liens qui ont href="#download" ou data-download="true"
    const buttons = document.querySelectorAll('a[href*="releases"], a[href="#download"], [data-download="true"]');
    
    buttons.forEach(btn => {
      // On garde les liens qui pointent vers la page Releases (genre "Voir toutes les versions")
      if (btn.href && btn.href.includes('/releases') && !btn.href.includes('/latest')) {
        return; // ne pas toucher
      }
      
      // Sinon, on remplace par le lien direct du .exe
      btn.href = downloadUrl;
      btn.removeAttribute('target'); // Téléchargement direct
      btn.setAttribute('download', ''); // Force le téléchargement
      
      // Ajouter event au clic pour feedback visuel
      btn.addEventListener('click', handleDownloadClick);
    });
    
    console.log(`✅ ${buttons.length} boutons de téléchargement mis à jour`);
  }
  
  // ===== FEEDBACK VISUEL AU CLIC =====
  function handleDownloadClick(e) {
    const btn = e.currentTarget;
    const originalContent = btn.innerHTML;
    
    // Animation : "Téléchargement..."
    btn.innerHTML = `
      <i class="fas fa-circle-notch fa-spin"></i>
      <span>Téléchargement...</span>
    `;
    
    // Afficher toast
    showDownloadToast();
    
    // Restaurer le bouton après 3 secondes
    setTimeout(() => {
      btn.innerHTML = originalContent;
    }, 3000);
  }
  
  // ===== TOAST DE TÉLÉCHARGEMENT =====
  function showDownloadToast() {
    // Supprimer ancien toast
    const oldToast = document.querySelector('.download-toast');
    if (oldToast) oldToast.remove();
    
    const toast = document.createElement('div');
    toast.className = 'download-toast';
    toast.innerHTML = `
      <div class="download-toast-icon">
        <i class="fas fa-download"></i>
      </div>
      <div class="download-toast-content">
        <div class="download-toast-title">Téléchargement lancé !</div>
        <div class="download-toast-desc">SuperNova v${latestVersion} (${fileSize} MB)</div>
      </div>
    `;
    
    document.body.appendChild(toast);
    
    // Animation entrée
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Disparition après 5s
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 5000);
  }
  
  // ===== METTRE À JOUR LE BADGE VERSION =====
  function updateVersionBadge() {
    const badges = document.querySelectorAll('.hero-badge span');
    badges.forEach(badge => {
      if (badge.textContent.includes('Version')) {
        badge.textContent = `Version ${latestVersion} disponible`;
      }
    });
  }
  
  // ===== METTRE À JOUR LA TAILLE DU FICHIER =====
  function updateFileSize() {
    const sizeElements = document.querySelectorAll('[data-file-size]');
    sizeElements.forEach(el => {
      el.textContent = `~${fileSize} MB`;
    });
    
    // Mettre à jour aussi dans le CTA Final si présent
    const ctaInfoItems = document.querySelectorAll('.cta-info-item');
    ctaInfoItems.forEach(item => {
      const text = item.textContent;
      if (text.includes('MB') || text.includes('Mo')) {
        const icon = item.querySelector('i');
        const iconHTML = icon ? icon.outerHTML : '';
        item.innerHTML = `${iconHTML}<span>~${fileSize} MB</span>`;
      }
    });
  }
  
  // ===== FALLBACK SI API GITHUB DOWN =====
  function useFallbackLinks() {
    const fallbackUrl = `https://github.com/${GITHUB_REPO}/releases/latest`;
    console.log(`⚠️ Utilisation du lien fallback: ${fallbackUrl}`);
    
    const buttons = document.querySelectorAll('a[href*="releases/latest"]');
    buttons.forEach(btn => {
      btn.href = fallbackUrl;
    });
  }
  
  // ===== INIT =====
  document.addEventListener('DOMContentLoaded', () => {
    fetchLatestRelease();
  });
  
})();