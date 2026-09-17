/**
 * ZenResume Metric Bullet Bank Engine v3.0
 * Provides battle-tested Google XYZ metric-driven bullet points by tech role.
 * Formula: Accomplished [X], measured by [Y], by doing [Z].
 */

const ZenBulletBank = (() => {
  const CATEGORIES = {
    backend: {
      name: 'Backend & APIs',
      icon: 'fa-server',
      bullets: [
        'Architected scalable microservices using Node.js & Redis, reducing API p99 latency by 42% across 1.5M daily active requests.',
        'Engineered robust RESTful APIs with Express and PostgreSQL, handling 25,000+ concurrent requests with 99.98% system uptime.',
        'Implemented automated Redis caching and database query indexing, slashing average page load times from 2.8s to 450ms.',
        'Designed distributed event-driven message queue using Apache Kafka, processing 500,000+ real-time event streams daily with zero data loss.',
        'Integrated secure JWT and OAuth 2.0 multi-factor authentication, protecting user sessions against CSRF and replay attacks.',
        'Optimized PostgreSQL database schemas and connection pooling, reducing slow query execution times by 55% during peak traffic.'
      ]
    },
    frontend: {
      name: 'Frontend & UI/UX',
      icon: 'fa-palette',
      bullets: [
        'Engineered responsive single-page web applications using React, TypeScript, and Tailwind CSS, achieving 98+ Lighthouse performance score.',
        'Refactored legacy state management to Redux Toolkit & React Query, cutting unnecessary re-renders by 35% and bundle size by 40KB.',
        'Implemented client-side code-splitting, lazy loading, and responsive asset pipelines, decreasing First Contentful Paint by 1.4 seconds.',
        'Constructed accessible WCAG 2.1 AA compliant UI component library adopted across 14 enterprise web pages.',
        'Integrated real-time WebSocket notifications and live dashboard visualizations for 10,000+ active users with 60 FPS smooth rendering.'
      ]
    },
    fullstack: {
      name: 'Full-Stack Engineering',
      icon: 'fa-laptop-code',
      bullets: [
        'Developed full-stack web application with Next.js, Node.js, and Supabase, scaling from 0 to 45,000 monthly active users.',
        'Built end-to-end automated payment workflows using Razorpay & Stripe webhooks, successfully transacting ₹12.5L+ with 100% reconciliation.',
        'Containerized full-stack services using Docker and Docker Compose, reducing developer local environment onboarding from 4 hours to 10 minutes.',
        'Created real-time collaboration canvas with HTML5 Canvas and WebSockets, enabling low-latency multi-user interaction with sub-50ms sync.',
        'Authored comprehensive unit and integration test suites using Jest and Cypress, elevating automated code coverage to 88%.'
      ]
    },
    devops: {
      name: 'Cloud & DevOps',
      icon: 'fa-cloud',
      bullets: [
        'Architected multi-region AWS infrastructure (EC2, S3, RDS, CloudFront) using Terraform, achieving 99.99% system availability.',
        'Built automated CI/CD deployment pipelines using GitHub Actions & Docker, reducing deployment cycle times from 45 min to 4 min.',
        'Configured Kubernetes clusters with auto-scaling pods on AWS EKS, dynamically optimizing cloud compute spend by 28%.',
        'Implemented Prometheus & Grafana telemetry monitoring dashboards with PagerDuty alerts, reducing Mean Time to Detection (MTTD) by 60%.',
        'Hardened Linux production servers with automated SSL renewal, fail2ban rules, and strict AWS IAM least-privilege security policies.'
      ]
    },
    data: {
      name: 'Data & AI / ML',
      icon: 'fa-chart-pie',
      bullets: [
        'Developed automated ETL data pipelines in Python and Apache Spark, processing 80GB+ of daily raw logs into PostgreSQL warehouse.',
        'Built machine learning classification pipeline with Scikit-learn and Pandas, predicting customer churn with 91.4% precision.',
        'Designed executive PowerBI & Tableau operational dashboards used weekly by leadership to drive key strategic decisions.',
        'Optimized complex SQL aggregation queries across 10M+ transaction records, reducing reporting query runtimes by 75%.',
        'Automated web data ingestion pipelines with Scrapy and Selenium, scraping and cleaning 50,000+ product catalog items weekly.'
      ]
    },
    fresher: {
      name: 'Fresher & Campus',
      icon: 'fa-graduation-cap',
      bullets: [
        'Solved 250+ Data Structures & Algorithmic challenges across LeetCode and HackerRank, mastering dynamic programming, graphs, and OOPs.',
        'Built full-stack capstone project using Java, Spring Boot, and MySQL, implementing complete CRUD workflows and input validations.',
        'Collaborated in a team of 4 during 36-hour college hackathon, building an AI resume evaluator that won 2nd place out of 65 teams.',
        'Led technical club workshops on Git, GitHub, and Linux fundamentals, training 120+ junior undergraduate students.',
        'Developed responsive campus event management portal using HTML5, CSS3, and JavaScript with 1,200+ registered student attendees.'
      ]
    },
    qa: {
      name: 'QA & Testing',
      icon: 'fa-vial',
      bullets: [
        'Developed automated regression and end-to-end test suites using Cypress & Playwright, catching 45+ critical bugs prior to production release.',
        'Formulated detailed test plans, boundary value matrices, and test cases, achieving 95%+ requirements traceability across sprint cycles.',
        'Conducted REST API performance and stress testing with Postman and JMeter, identifying concurrency bottlenecks under 5,000 virtual users.'
      ]
    }
  };

  let activeTargetSection = 'experience';
  let activeCategory = 'backend';

  function openBulletBank(sectionType = 'experience') {
    activeTargetSection = sectionType;
    const modal = document.getElementById('bullet-bank-modal');
    if (!modal) return;
    
    renderCategories();
    renderBullets(activeCategory);
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeBulletBank() {
    const modal = document.getElementById('bullet-bank-modal');
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  function selectCategory(catKey) {
    activeCategory = catKey;
    renderCategories();
    renderBullets(catKey);
  }

  function renderCategories() {
    const container = document.getElementById('bullet-bank-tabs');
    if (!container) return;

    container.innerHTML = Object.keys(CATEGORIES).map(k => {
      const cat = CATEGORIES[k];
      const isActive = k === activeCategory;
      return '<button type="button" class="bullet-bank-tab ' + (isActive ? 'active' : '') + '" onclick="ZenBulletBank.selectCategory(\'' + k + '\')"><i class="fas ' + cat.icon + '"></i> ' + cat.name + '</button>';
    }).join('');
  }

  function renderBullets(catKey) {
    const listEl = document.getElementById('bullet-bank-list');
    if (!listEl) return;

    const cat = CATEGORIES[catKey] || CATEGORIES.backend;
    listEl.innerHTML = cat.bullets.map((bullet, idx) => {
      const escaped = bullet.replace(/'/g, "\\'");
      return '<div class="bullet-bank-item">' +
        '<div class="bullet-bank-text">' +
          '<span class="bullet-metric-badge"><i class="fas fa-chart-line"></i> Google XYZ Metric</span>' +
          '<p>' + bullet + '</p>' +
        '</div>' +
        '<button type="button" class="btn-insert-bullet" onclick="ZenBulletBank.insertBullet(\'' + escaped + '\')">' +
          '<i class="fas fa-plus"></i> Add to Resume' +
        '</button>' +
      '</div>';
    }).join('');
  }

  function insertBullet(bulletText) {
    // Find active experience or project textarea
    let targetTextarea = null;

    if (activeTargetSection === 'projects') {
      let projTextareas = document.querySelectorAll('.input-proj-desc, #projects-list-container textarea, .project-item-card textarea');
      if (projTextareas.length === 0 && typeof window.addProjectCard === 'function') {
        window.addProjectCard();
        projTextareas = document.querySelectorAll('.input-proj-desc, #projects-list-container textarea, .project-item-card textarea');
      }
      if (projTextareas.length > 0) {
        targetTextarea = projTextareas[projTextareas.length - 1];
      }
    } else {
      let expTextareas = document.querySelectorAll('.input-exp-desc, #experience-list-container textarea, .experience-item-card textarea');
      if (expTextareas.length === 0 && typeof window.addExperienceCard === 'function') {
        window.addExperienceCard();
        expTextareas = document.querySelectorAll('.input-exp-desc, #experience-list-container textarea, .experience-item-card textarea');
      }
      if (expTextareas.length > 0) {
        targetTextarea = expTextareas[0];
      }
    }

    if (targetTextarea) {
      const current = targetTextarea.value.trim();
      targetTextarea.value = current ? current + '\n• ' + bulletText : '• ' + bulletText;
      targetTextarea.dispatchEvent(new Event('input', { bubbles: true }));
      
      if (typeof window.syncFormToPreview === 'function') {
        window.syncFormToPreview();
      }
      if (typeof window.showToast === 'function') {
        window.showToast('🎯 Added metric bullet to ' + (activeTargetSection === 'projects' ? 'Project' : 'Experience') + '!', 'success');
      }

      // Close modal and focus textarea
      closeBulletBank();
      targetTextarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
      targetTextarea.focus();
    } else {
      // Fallback: copy to clipboard
      if (navigator.clipboard) {
        navigator.clipboard.writeText('• ' + bulletText);
        if (typeof window.showToast === 'function') {
          window.showToast('📋 Copied bullet to clipboard! Paste it into your experience.', 'success');
        }
      }
      closeBulletBank();
    }
  }

  return {
    openBulletBank,
    closeBulletBank,
    selectCategory,
    insertBullet
  };

})();

window.ZenBulletBank = ZenBulletBank;
window.openBulletBank = ZenBulletBank.openBulletBank;
