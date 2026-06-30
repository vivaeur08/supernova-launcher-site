(function() {
  
  const GITHUB_REPO = 'vivaeur08/zenra-launcher-releases';
  const API_URL = `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`;
  
  let downloadUrl = null;
  let latestVersion = null;
  let fileSize = null;
  
  async function fetchLatestRelease() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`API GitHub: ${response.status}`);
      const data = await response.json();
      
      const exeAsset = data.assets.find(asset => asset.name.endsWith('.exe'));
      if (!exeAsset) throw new Error('Aucun .exe trouvé');
      
      downloadUrl = exeAsset.browser_download_url;
      latestVersion = data.tag_name.replace(/^v/, '');
      fileSize = (exeAsset.size / 1024 / 1024).toFixed(1);
      
      updateDownloadButtons();
      updateVersionBadge();
      updateFileSize();
    } catch (error) {
      console.warn('Fallback:', error.message);
      useFallbackLinks();
    }
  }
  
  function updateDownloadButtons() {
    const buttons = document.querySelectorAll('a[href*="releases"], a[href="#download"], [data-download="true"]');
    buttons.forEach(btn => {
      if (btn.href && btn.href.includes('/releases') && !btn.href.includes('/latest')) return;
      btn.href = downloadUrl;
      btn.removeAttribute('target');
      btn.setAttribute('download', '');
      btn.addEventListener('click', handleDownloadClick);
    });
  }
  
  function handleDownloadClick(e) {
    const btn = e.currentTarget;
    const originalContent = btn.innerHTML;
    btn.innerHTML = `<i class="fas fa-circle-notch fa-spin"></i><span>Téléchargement...</span>`;
    showDownloadToast();
    setTimeout(() => { btn.innerHTML = originalContent; }, 3000);
  }
  
  function showDownloadToast() {
    const oldToast = document.querySelector('.download-toast');
    if (oldToast) oldToast.remove();
    
    const toast = document.createElement('div');
    toast.className = 'download-toast';
    toast.innerHTML = `
      <div class="download-toast-icon"><i class="fas fa-download"></i></div>
      <div class="download-toast-content">
        <div class="download-toast-title">Téléchargement lancé !</div>
        <div class="download-toast-desc">Zenra v${latestVersion} (${fileSize} MB)</div>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 5000);
  }
  
  function updateVersionBadge() {
    const badges = document.querySelectorAll('.hero-badge span');
    badges.forEach(badge => {
      if (badge.textContent.includes('Version')) {
        badge.textContent = `Version ${latestVersion} disponible`;
      }
    });
  }
  
  function updateFileSize() {
    const ctaInfoItems = document.querySelectorAll('[data-file-size]');
    ctaInfoItems.forEach(item => {
      const icon = item.querySelector('i');
      const iconHTML = icon ? icon.outerHTML : '';
      item.innerHTML = `${iconHTML}<span>~${fileSize} MB</span>`;
    });
  }
  
  function useFallbackLinks() {
    const fallbackUrl = `https://github.com/${GITHUB_REPO}/releases/latest`;
    const buttons = document.querySelectorAll('a[href*="releases/latest"]');
    buttons.forEach(btn => { btn.href = fallbackUrl; });
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    fetchLatestRelease();
  });
})();