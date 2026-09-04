/**
 * ZenResume - Dynamic Adaptive UI/UX & CSS Engine (v1.0)
 * 
 * Automatically detects device profile, screen geometry, orientation, touch capabilities,
 * and safe-areas in real time. Dynamically injects CSS variables, adaptive attributes,
 * and component layout constraints across Mobile, Tablet, Laptop, Desktop, and 4K screens.
 */

(function(window, document) {
  'use strict';

  // Device Breakpoint Standards (px)
  const BREAKPOINTS = {
    MOBILE_XS: 360,     // Ultra-compact phones (Fold cover, legacy SE)
    MOBILE: 640,        // Standard modern phones (iPhone 14/15, Galaxy S24, Pixel 8)
    TABLET_PORTRAIT: 768, // iPad Mini, small tablets
    TABLET_LANDSCAPE: 1024, // iPad Air / Pro, small Chromebooks
    LAPTOP: 1440,       // Standard 13-15" laptops & 1080p desktop windows
    DESKTOP_2K: 2000,   // QHD 2K Monitors
    WORKSTATION_4K: 3840 // 4K / Ultrawide Workstations
  };

  class AdaptiveEngine {
    constructor() {
      this.currentProfile = {};
      this.resizeTimeout = null;
      this.isInitialized = false;
    }

    getProfile() {
      const width = window.visualViewport ? Math.round(window.visualViewport.width) : window.innerWidth;
      const height = window.visualViewport ? Math.round(window.visualViewport.height) : window.innerHeight;
      const dpr = window.devicePixelRatio || 1;
      const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.matchMedia('(pointer: coarse)').matches;
      const orientation = width >= height ? 'landscape' : 'portrait';

      let deviceCategory = 'desktop';
      let screenTier = 'lg';
      let gridColumns = 3;

      if (width <= BREAKPOINTS.MOBILE_XS) {
        deviceCategory = 'mobile-xs';
        screenTier = 'xs';
        gridColumns = 1;
      } else if (width <= BREAKPOINTS.MOBILE) {
        deviceCategory = 'mobile';
        screenTier = 'sm';
        gridColumns = 1;
      } else if (width <= BREAKPOINTS.TABLET_PORTRAIT) {
        deviceCategory = 'tablet-portrait';
        screenTier = 'md';
        gridColumns = 2;
      } else if (width <= BREAKPOINTS.TABLET_LANDSCAPE) {
        deviceCategory = 'tablet-landscape';
        screenTier = 'lg';
        gridColumns = 2;
      } else if (width <= BREAKPOINTS.LAPTOP) {
        deviceCategory = 'laptop';
        screenTier = 'xl';
        gridColumns = 3;
      } else if (width <= BREAKPOINTS.DESKTOP_2K) {
        deviceCategory = 'desktop-2k';
        screenTier = '2xl';
        gridColumns = 3;
      } else {
        deviceCategory = 'workstation-4k';
        screenTier = '4k';
        gridColumns = 4;
      }

      return {
        width,
        height,
        dpr,
        isTouch,
        orientation,
        deviceCategory,
        screenTier,
        gridColumns
      };
    }

    applyProfile(profile) {
      const root = document.documentElement;
      const body = document.body;
      if (!root || !body) return;

      root.style.setProperty('--vh', `${profile.height * 0.01}px`);
      root.style.setProperty('--vw', `${profile.width * 0.01}px`);
      root.style.setProperty('--adaptive-screen-width', `${profile.width}px`);
      root.style.setProperty('--adaptive-screen-height', `${profile.height}px`);
      root.style.setProperty('--adaptive-grid-columns', `${profile.gridColumns}`);
      root.style.setProperty('--adaptive-dpr', `${profile.dpr}`);

      root.setAttribute('data-device-category', profile.deviceCategory);
      root.setAttribute('data-screen-tier', profile.screenTier);
      root.setAttribute('data-orientation', profile.orientation);
      root.setAttribute('data-pointer-type', profile.isTouch ? 'touch' : 'mouse');

      body.classList.toggle('is-mobile-device', profile.width <= BREAKPOINTS.MOBILE);
      body.classList.toggle('is-tablet-device', profile.width > BREAKPOINTS.MOBILE && profile.width <= BREAKPOINTS.TABLET_LANDSCAPE);
      body.classList.toggle('is-desktop-device', profile.width > BREAKPOINTS.TABLET_LANDSCAPE);
      body.classList.toggle('is-touch-screen', profile.isTouch);
    }

    recalibrateComponents(profile) {
      const templateControls = document.querySelector('.template-unified-controls');
      if (templateControls) {
        templateControls.style.maxWidth = profile.width > 1440 ? '1360px' : '1200px';
      }

      const templatesGrid = document.getElementById('templates-grid');
      if (templatesGrid) {
        if (profile.width <= BREAKPOINTS.MOBILE) {
          templatesGrid.style.gridTemplateColumns = '1fr';
        } else if (profile.width <= BREAKPOINTS.TABLET_LANDSCAPE) {
          templatesGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
        } else if (profile.width <= BREAKPOINTS.DESKTOP_2K) {
          templatesGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
        } else {
          templatesGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
        }
      }

      const mobileTabs = document.getElementById('mobile-workspace-tabs');
      if (mobileTabs && document.body) {
        const inEditor = document.body.classList.contains('in-editor');
        if (!inEditor || profile.width > BREAKPOINTS.TABLET_LANDSCAPE) {
          mobileTabs.style.display = 'none';
        } else {
          mobileTabs.style.display = 'flex';
        }
      }

      if (typeof window.adjustPreviewScale === 'function') {
        window.adjustPreviewScale();
      }

      const mobileIndustrySelect = document.getElementById('mobile-industry-select');
      if (mobileIndustrySelect && window.state && window.state.selectedInd) {
        if (mobileIndustrySelect.value !== window.state.selectedInd) {
          mobileIndustrySelect.value = window.state.selectedInd;
        }
      }
    }

    adapt() {
      const profile = this.getProfile();
      this.currentProfile = profile;
      this.applyProfile(profile);
      this.recalibrateComponents(profile);
    }

    debouncedAdapt() {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        this.adapt();
      }, 50);
    }

    init() {
      if (this.isInitialized) return;
      this.isInitialized = true;

      this.adapt();

      window.addEventListener('resize', () => this.debouncedAdapt(), { passive: true });
      window.addEventListener('orientationchange', () => {
        setTimeout(() => this.adapt(), 100);
      }, { passive: true });

      if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', () => this.debouncedAdapt(), { passive: true });
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.adapt(), { once: true });
      }
      window.addEventListener('load', () => this.adapt(), { once: true });

      console.log('[ZenResume] Dynamic Adaptive UI/UX & CSS Engine Active 🚀');
    }
  }

  const engine = new AdaptiveEngine();
  window.ZenAdaptiveEngine = engine;
  engine.init();

})(window, document);
