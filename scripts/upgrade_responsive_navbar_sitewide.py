import os
import re

INDEX_HEADER = """  <!-- Global Top Header with Responsive Navigation -->
  <header class="no-print stitch-nav">
    <div class="stitch-nav-container">
      <a href="/" id="logo-link" class="header-logo-link">
        <img src="https://www.zenresume.online/favicon-96x96.png" alt="ZenResume Logo" class="brand-logo-img">
        <span class="brand-logo-text">ZenResume</span>
      </a>
      
      <!-- Desktop Navigation Links -->
      <nav class="desktop-nav-links">
        <a href="#" id="nav-app-link" class="active-link" onclick="window.enterApp && window.enterApp(); return false;">App</a>
        <a href="/role/" id="nav-roles-link">Templates (63 Roles)</a>
        <a href="/blog/" id="nav-resources-link">Career Guides</a>
        <a href="/methodology.html">Methodology</a>
        <a href="/about.html">About</a>
      </nav>

      <!-- Right Action Controls -->
      <div class="header-right-actions">
        <button id="btn-theme-toggle" class="btn-theme-toggle" aria-label="Toggle Theme">
          <i class="fas fa-moon"></i>
        </button>
        <button type="button" class="stitch-nav-cta" id="btn-header-cta" onclick="window.handleHeaderCTAClick && window.handleHeaderCTAClick();" style="border: none; cursor: pointer;">
          Create My Resume
        </button>
        <button type="button" class="mobile-menu-toggle" id="btn-mobile-menu" onclick="window.toggleMobileMenu && window.toggleMobileMenu();" aria-label="Toggle Navigation Menu">
          <i class="fas fa-bars"></i>
        </button>
      </div>
    </div>

    <!-- Mobile Slide-Down Drawer Menu -->
    <div class="mobile-drawer-menu" id="mobile-drawer-menu">
      <a href="#" class="mobile-nav-link" onclick="window.enterApp && window.enterApp(); window.toggleMobileMenu(true); return false;">
        <i class="fas fa-file-invoice"></i> Builder App
      </a>
      <a href="/role/" class="mobile-nav-link" onclick="window.toggleMobileMenu(true);">
        <i class="fas fa-layer-group"></i> Templates (63 Roles)
      </a>
      <a href="/blog/" class="mobile-nav-link" onclick="window.toggleMobileMenu(true);">
        <i class="fas fa-book-open"></i> Career Guides
      </a>
      <a href="/methodology.html" class="mobile-nav-link" onclick="window.toggleMobileMenu(true);">
        <i class="fas fa-flask"></i> ATS Methodology
      </a>
      <a href="/editorial-policy.html" class="mobile-nav-link" onclick="window.toggleMobileMenu(true);">
        <i class="fas fa-shield-alt"></i> Editorial Policy
      </a>
      <a href="/about.html" class="mobile-nav-link" onclick="window.toggleMobileMenu(true);">
        <i class="fas fa-info-circle"></i> About Us
      </a>
      <a href="/contact.html" class="mobile-nav-link" onclick="window.toggleMobileMenu(true);">
        <i class="fas fa-envelope"></i> Contact Support
      </a>
    </div>
  </header>"""

SUBPAGE_HEADER = """  <!-- Global Top Header with Responsive Navigation -->
  <header class="no-print stitch-nav">
    <div class="stitch-nav-container">
      <a href="/" id="logo-link" class="header-logo-link">
        <img src="https://www.zenresume.online/favicon-96x96.png" alt="ZenResume Logo" class="brand-logo-img">
        <span class="brand-logo-text">ZenResume</span>
      </a>
      
      <!-- Desktop Navigation Links -->
      <nav class="desktop-nav-links">
        <a href="/">App</a>
        <a href="/role/">Templates (63 Roles)</a>
        <a href="/blog/">Career Guides</a>
        <a href="/methodology.html">Methodology</a>
        <a href="/about.html">About</a>
      </nav>

      <!-- Right Action Controls -->
      <div class="header-right-actions">
        <button id="btn-theme-toggle" class="btn-theme-toggle" aria-label="Toggle Theme">
          <i class="fas fa-moon"></i>
        </button>
        <a href="/" class="stitch-nav-cta" id="btn-header-cta">
          Build Resume
        </a>
        <button type="button" class="mobile-menu-toggle" id="btn-mobile-menu" onclick="window.toggleMobileMenu && window.toggleMobileMenu();" aria-label="Toggle Navigation Menu">
          <i class="fas fa-bars"></i>
        </button>
      </div>
    </div>

    <!-- Mobile Slide-Down Drawer Menu -->
    <div class="mobile-drawer-menu" id="mobile-drawer-menu">
      <a href="/" class="mobile-nav-link" onclick="window.toggleMobileMenu(true);">
        <i class="fas fa-file-invoice"></i> Builder App
      </a>
      <a href="/role/" class="mobile-nav-link" onclick="window.toggleMobileMenu(true);">
        <i class="fas fa-layer-group"></i> Templates (63 Roles)
      </a>
      <a href="/blog/" class="mobile-nav-link" onclick="window.toggleMobileMenu(true);">
        <i class="fas fa-book-open"></i> Career Guides
      </a>
      <a href="/methodology.html" class="mobile-nav-link" onclick="window.toggleMobileMenu(true);">
        <i class="fas fa-flask"></i> ATS Methodology
      </a>
      <a href="/editorial-policy.html" class="mobile-nav-link" onclick="window.toggleMobileMenu(true);">
        <i class="fas fa-shield-alt"></i> Editorial Policy
      </a>
      <a href="/about.html" class="mobile-nav-link" onclick="window.toggleMobileMenu(true);">
        <i class="fas fa-info-circle"></i> About Us
      </a>
      <a href="/contact.html" class="mobile-nav-link" onclick="window.toggleMobileMenu(true);">
        <i class="fas fa-envelope"></i> Contact Support
      </a>
    </div>
  </header>"""

def replace_header_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Pattern to find existing header
    # We want to replace <header ...>...</header> that is the top nav
    pattern = r'<header\b[^>]*>.*?</header>'
    
    if os.path.basename(filepath) == 'index.html' and os.path.dirname(filepath) == '.':
        # Replace only the first header
        m = re.search(pattern, content, flags=re.DOTALL)
        if m:
            content = content[:m.start()] + INDEX_HEADER + content[m.end():]
    else:
        m = re.search(pattern, content, flags=re.DOTALL)
        if m:
            content = content[:m.start()] + SUBPAGE_HEADER + content[m.end():]

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    dirs = ['.', 'blog', 'role']
    count = 0
    for d in dirs:
        for f in os.listdir(d):
            if f.endswith('.html') and not f.startswith('google'):
                p = os.path.join(d, f)
                replace_header_in_file(p)
                count += 1
    print(f"Successfully upgraded responsive navbar across {count} HTML pages!")

if __name__ == '__main__':
    main()
