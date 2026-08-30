/**
 * ZenResume - Interactive Role Blueprint & ATS Keyword Matcher (Strategy 3 & 4)
 */

(function() {
  'use strict';

  const ROLE_DATABASE = {
    "software_engineer": {
      title: "Full-Stack Software Engineer",
      category: "tech",
      matchScore: "99% ATS Match",
      badge: "High Demand",
      icon: "💻",
      guideUrl: "/blog/software-engineer-resume-guide.html",
      keywords: ["React", "TypeScript", "Node.js", "Microservices", "Docker", "AWS", "REST APIs", "CI/CD"],
      bullet: "Architected scalable microservices with Node.js and TypeScript, handling 2M+ daily active requests with 99.9% uptime."
    },
    "tcs_fresher": {
      title: "TCS NQT / IT Fresher",
      category: "freshers",
      matchScore: "100% ATS Match",
      badge: "Campus Placement",
      icon: "🎓",
      guideUrl: "/blog/resume-tips-for-freshers.html",
      keywords: ["Java", "SQL", "Data Structures", "OOPs", "Spring Boot", "Git", "Problem Solving", "Agile"],
      bullet: "Engineered full-stack academic portal using Java and MySQL, reducing student registration processing time by 40%."
    },
    "data_engineer": {
      title: "Data Engineer / Analytics",
      category: "data",
      matchScore: "98% ATS Match",
      badge: "Data & Cloud",
      icon: "📊",
      guideUrl: "/blog/ats-resume-format-2026.html",
      keywords: ["Python", "SQL", "Apache Spark", "Airflow", "Kafka", "Snowflake", "ETL Pipelines", "AWS S3"],
      bullet: "Constructed automated ETL data pipelines in Apache Spark and Python, processing 10TB+ daily telemetry data."
    },
    "data_scientist": {
      title: "Data Scientist & ML Engineer",
      category: "data",
      matchScore: "97% ATS Match",
      badge: "AI / ML",
      icon: "🤖",
      guideUrl: "/blog/ats-resume-format-2026.html",
      keywords: ["PyTorch", "TensorFlow", "Pandas", "Scikit-Learn", "NLP", "LLM Fine-Tuning", "Regression", "Tableau"],
      bullet: "Trained transformer-based classification models achieving 94.2% accuracy, decreasing customer churn by 18%."
    },
    "cloud_devops": {
      title: "Cloud & DevOps Engineer",
      category: "cloud",
      matchScore: "99% ATS Match",
      badge: "Infrastructure",
      icon: "☁️",
      guideUrl: "/blog/software-engineer-resume-guide.html",
      keywords: ["Kubernetes", "Terraform", "Docker", "AWS ECS", "GitHub Actions", "Prometheus", "Linux", "IaC"],
      bullet: "Implemented multi-region Kubernetes clusters with automated Terraform IaC, slashing deployment downtime to zero."
    },
    "frontend_dev": {
      title: "Frontend React / UI Developer",
      category: "tech",
      matchScore: "98% ATS Match",
      badge: "UI / Web",
      icon: "🎨",
      guideUrl: "/blog/software-engineer-resume-guide.html",
      keywords: ["React.js", "Next.js", "Tailwind CSS", "JavaScript ES6+", "Redux Toolkit", "Web Vitals", "Jest"],
      bullet: "Redesigned consumer checkout flow in Next.js, boosting conversion rate by 24% and achieving 98+ Google Lighthouse score."
    },
    "campus_fresher": {
      title: "B.Tech / MCA Campus Placement",
      category: "freshers",
      matchScore: "100% ATS Match",
      badge: "Zero Experience",
      icon: "🏫",
      guideUrl: "/blog/resume-tips-for-freshers.html",
      keywords: ["C++", "Java", "Python", "DBMS", "Computer Networks", "Operating Systems", "Web Development"],
      bullet: "Developed real-time IoT weather monitoring system using Arduino & Python, presenting findings at National Tech Symposium."
    },
    "product_manager": {
      title: "Product Manager / Business Analyst",
      category: "business",
      matchScore: "96% ATS Match",
      badge: "Leadership",
      icon: "💼",
      guideUrl: "/blog/ats-resume-format-2026.html",
      keywords: ["Agile/Scrum", "Product Roadmap", "User Stories", "A/B Testing", "SQL Analytics", "Jira", "Stakeholder Management"],
      bullet: "Led cross-functional sprint team of 8 engineers to launch mobile payments feature, acquiring 50K+ new active users in Q2."
    }
  };

  let activeCategory = 'all';

  window.filterRoleHub = function(category) {
    activeCategory = category;
    
    // Update active tab buttons
    const tabs = document.querySelectorAll('.role-hub-tab-btn');
    tabs.forEach(t => {
      if (t.getAttribute('data-category') === category) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });

    renderRoleCards();
  };

  window.selectRoleForScanner = function(roleKey) {
    const role = ROLE_DATABASE[roleKey];
    if (!role) return;

    const titleEl = document.getElementById('scanner-active-title');
    const scoreEl = document.getElementById('scanner-active-score');
    const kwContainer = document.getElementById('scanner-keywords-list');
    const bulletEl = document.getElementById('scanner-sample-bullet');
    const launchBtn = document.getElementById('btn-scanner-launch');

    if (titleEl) titleEl.innerHTML = `${role.icon} ${role.title}`;
    if (scoreEl) scoreEl.textContent = role.matchScore;
    if (bulletEl) bulletEl.textContent = role.bullet;

    if (kwContainer) {
      kwContainer.innerHTML = role.keywords.map(kw => `<span class="scanner-kw-chip"><i class="fas fa-check"></i> ${kw}</span>`).join('');
    }

    if (launchBtn) {
      launchBtn.onclick = function() {
        if (typeof window.loadPreset === 'function') {
          window.loadPreset(roleKey);
        }
        if (typeof window.enterBuilderDirectly === 'function') {
          window.enterBuilderDirectly();
        }
      };
    }

    // Highlight selected card
    const cards = document.querySelectorAll('.role-blueprint-card');
    cards.forEach(c => {
      if (c.getAttribute('data-role') === roleKey) {
        c.classList.add('selected-role-card');
      } else {
        c.classList.remove('selected-role-card');
      }
    });
  };

  function renderRoleCards() {
    const grid = document.getElementById('role-blueprints-grid');
    if (!grid) return;

    grid.innerHTML = '';

    Object.keys(ROLE_DATABASE).forEach(key => {
      const role = ROLE_DATABASE[key];
      if (activeCategory !== 'all' && role.category !== activeCategory) {
        return;
      }

      const card = document.createElement('div');
      card.className = 'role-blueprint-card';
      card.setAttribute('data-role', key);
      card.onclick = function() { window.selectRoleForScanner(key); };

      card.innerHTML = `
        <div class="role-card-top">
          <div class="role-icon-box">${role.icon}</div>
          <div class="role-badge-pill">${role.badge}</div>
        </div>
        <h4 class="role-card-title">${role.title}</h4>
        <div class="role-card-score"><i class="fas fa-circle-check"></i> ${role.matchScore}</div>
        <div class="role-keywords-row">
          ${role.keywords.slice(0, 4).map(k => `<span class="mini-kw-tag">${k}</span>`).join('')}
        </div>
        <div class="role-card-actions">
          <button type="button" class="btn-role-load" onclick="event.stopPropagation(); if (typeof window.loadPreset === 'function') window.loadPreset('${key}'); if (typeof window.enterBuilderDirectly === 'function') window.enterBuilderDirectly();">
            <span>⚡ Use Blueprint</span>
          </button>
          <a href="${role.guideUrl}" class="role-guide-link" onclick="event.stopPropagation();">
            <span>Guide &rarr;</span>
          </a>
        </div>
      `;

      grid.appendChild(card);
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    renderRoleCards();
    window.selectRoleForScanner('software_engineer');
  });

})();
