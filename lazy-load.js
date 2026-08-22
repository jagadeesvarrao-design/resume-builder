
(function() {
    let scriptsLoaded = false;
    
    function loadHeavyScripts() {
        if (scriptsLoaded) return;
        scriptsLoaded = true;

        // 1. Load Google Analytics
        const gtagScript = document.createElement("script");
        gtagScript.src = "https://www.googletagmanager.com/gtag/js?id=G-Z90HSSD2P2";
        gtagScript.async = true;
        document.head.appendChild(gtagScript);

        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag("js", new Date());
        gtag("config", "G-Z90HSSD2P2");
        gtag("config", "G-61BHT3KZL6");

        // Global Helper for GA4 Event Tracking
        window.trackGAEvent = function(eventName, params = {}) {
            try {
                if (typeof window.gtag === 'function') {
                    window.gtag('event', eventName, params);
                    console.log(`[GA4 Event] ${eventName}:`, params);
                } else if (window.dataLayer) {
                    window.dataLayer.push({ event: eventName, ...params });
                    console.log(`[DataLayer Event] ${eventName}:`, params);
                }
            } catch (err) {
                console.warn(`[GA4 Event Error] ${eventName}:`, err);
            }
        };

        // Remove event listeners
        const events = ["scroll", "mousemove", "touchstart", "keydown", "wheel"];
        events.forEach(e => window.removeEventListener(e, loadHeavyScripts));
    }

    // Trigger on interaction
    const events = ["scroll", "mousemove", "touchstart", "keydown", "wheel"];
    events.forEach(e => window.addEventListener(e, loadHeavyScripts, { once: true, passive: true }));
    
    // Mobile Menu Toggle & Auto-Close Controller
    window.toggleMobileMenu = function(forceClose = false) {
        const drawer = document.getElementById('mobile-drawer-menu');
        const btn = document.getElementById('btn-mobile-menu');
        if (!drawer) return;
        
        if (forceClose || drawer.classList.contains('open')) {
            drawer.classList.remove('open');
            if (btn) btn.innerHTML = '<i class="fas fa-bars"></i>';
        } else {
            drawer.classList.add('open');
            if (btn) btn.innerHTML = '<i class="fas fa-times"></i>';
        }
    };

    document.addEventListener('click', function(e) {
        const drawer = document.getElementById('mobile-drawer-menu');
        const btn = document.getElementById('btn-mobile-menu');
        if (drawer && drawer.classList.contains('open')) {
            if (!drawer.contains(e.target) && !btn?.contains(e.target)) {
                window.toggleMobileMenu(true);
            }
        }
    });
})();

