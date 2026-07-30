
(function() {
    let scriptsLoaded = false;
    
    function loadHeavyScripts() {
        if (scriptsLoaded) return;
        scriptsLoaded = true;

        // 1. Load Google Analytics
        const gtagScript = document.createElement("script");
        gtagScript.src = "https://www.googletagmanager.com/gtag/js?id=G-61BHT3KZL6";
        gtagScript.async = true;
        document.head.appendChild(gtagScript);

        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag("js", new Date());
        gtag("config", "G-61BHT3KZL6");

        // 2. Load Google AdSense
        const adsenseScript = document.createElement("script");
        adsenseScript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1993051486567311";
        adsenseScript.async = true;
        adsenseScript.crossOrigin = "anonymous";
        document.head.appendChild(adsenseScript);

        // Remove event listeners
        const events = ["scroll", "mousemove", "touchstart", "keydown", "wheel"];
        events.forEach(e => window.removeEventListener(e, loadHeavyScripts));
    }

    // Trigger on interaction
    const events = ["scroll", "mousemove", "touchstart", "keydown", "wheel"];
    events.forEach(e => window.addEventListener(e, loadHeavyScripts, { once: true, passive: true }));
    
    // Fallback: Trigger after 4 seconds regardless of interaction
    setTimeout(loadHeavyScripts, 4000);
})();

