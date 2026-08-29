/**
 * ZenResume - Interactive Hero Editor Playground Engine
 * Powers live typing, instant role switching, template restyling,
 * accent customization, and smart motivational transfer triggers.
 */

(function() {
  'use strict';

  let interactionCount = 0;
  let hasShownMotivation = false;

  const PLAYGROUND_PRESETS = {
    software: {
      name: 'Alex Rivera',
      title: 'Full-Stack Software Engineer',
      location: 'San Francisco, CA',
      expTitle: 'Software Engineer • TechCorp Solutions',
      bullet1: 'Architected distributed microservices utilizing Node.js and TypeScript, handling 2M+ daily active requests with 99.9% uptime.',
      bullet2: 'Optimized PostgreSQL queries and Redis caching layer, decreasing database response latency by 45%.',
      skills: ['React', 'Node.js', 'Python', 'TypeScript', 'Docker', 'PostgreSQL', 'AWS']
    },
    tcs: {
      name: 'Aditya Sharma',
      title: 'TCS NQT Candidate / Java Developer',
      location: 'Bengaluru, India',
      expTitle: 'Java Software Intern • Enterprise Cloud Labs',
      bullet1: 'Engineered RESTful banking backend microservices using Spring Boot & Java 17, processing 15,000+ daily transaction records.',
      bullet2: 'Implemented JWT-based role authentication and automated JUnit test suites achieving 92% code coverage.',
      skills: ['Java', 'Spring Boot', 'SQL', 'Hibernate', 'Git', 'REST APIs', 'JUnit']
    },
    data: {
      name: 'Priya Patel',
      title: 'Data Analyst & BI Specialist',
      location: 'Hyderabad, India',
      expTitle: 'Junior Data Analyst • Quant Analytics',
      bullet1: 'Constructed automated SQL ETL pipelines across 500K+ transaction rows, reducing weekly reporting cycles from 8 hours to 20 minutes.',
      bullet2: 'Designed interactive Power BI executive dashboards tracking revenue KPIs with statistical cohort analysis.',
      skills: ['Python', 'SQL', 'Pandas', 'Power BI', 'Tableau', 'Excel (VBA)', 'Statistics']
    },
    cloud: {
      name: 'David Kim',
      title: 'AWS Cloud & DevOps Engineer',
      location: 'Austin, TX',
      expTitle: 'Cloud Solutions Associate • NextGen DevOps',
      bullet1: 'Deployed infrastructure-as-code using Terraform & AWS ECS, cutting server provisioning turnaround from 3 days to 15 minutes.',
      bullet2: 'Constructed multi-region GitHub Actions CI/CD deployment pipelines with zero-downtime blue/green rollouts.',
      skills: ['AWS (ECS, S3, IAM)', 'Docker', 'Terraform', 'Kubernetes', 'CI/CD', 'Linux', 'Python']
    }
  };

  let currentRole = 'software';
  let currentStyle = 'emerald';
  let currentAccent = '#476550';

  function renderPlaygroundPreview() {
    const nameInput = document.getElementById('playground-input-name');
    const titleInput = document.getElementById('playground-input-title');
    const expTitleInput = document.getElementById('playground-input-company');
    const bulletInput = document.getElementById('playground-input-bullet');
    const skillsInput = document.getElementById('playground-input-skills');

    const name = nameInput ? nameInput.value : PLAYGROUND_PRESETS[currentRole].name;
    const title = titleInput ? titleInput.value : PLAYGROUND_PRESETS[currentRole].title;
    const expTitle = expTitleInput ? expTitleInput.value : PLAYGROUND_PRESETS[currentRole].expTitle;
    const bullet = bulletInput ? bulletInput.value : PLAYGROUND_PRESETS[currentRole].bullet1;
    const skills = skillsInput ? skillsInput.value.split(',').map(s => s.trim()).filter(Boolean) : PLAYGROUND_PRESETS[currentRole].skills;

    // Elements in preview card
    const prevName = document.getElementById('mockup-preview-name');
    const prevTitle = document.getElementById('mockup-preview-title');
    const prevExpTitle = document.getElementById('mockup-preview-exptitle');
    const prevBullet = document.getElementById('mockup-preview-bullet');
    const prevSkills = document.getElementById('mockup-preview-skills');
    const prevHeader = document.getElementById('mockup-preview-header');

    if (prevName) prevName.textContent = name.toUpperCase();
    if (prevTitle) prevTitle.textContent = title;
    if (prevExpTitle) prevExpTitle.textContent = expTitle;
    if (prevBullet) prevBullet.innerHTML = '&bull; ' + bullet + '<br>&bull; Streamlined recruitment pipeline throughput by 65% using cloud automation.';
    
    if (prevSkills) {
      prevSkills.innerHTML = skills.map(s => `<span class="mockup-skill-chip">${s}</span>`).join('');
    }

    // Apply color accent
    if (prevHeader) {
      prevHeader.style.borderBottomColor = currentAccent;
    }
    const sectionHeaders = document.querySelectorAll('.mockup-preview-section-title');
    sectionHeaders.forEach(el => {
      el.style.color = currentAccent;
    });
    if (prevTitle) {
      prevTitle.style.color = currentAccent;
    }
  }

  function handlePlaygroundInteraction() {
    interactionCount++;
    renderPlaygroundPreview();

    // Trigger motivational prompt on 2nd or 3rd interaction
    if (interactionCount >= 2 && !hasShownMotivation) {
      hasShownMotivation = true;
      showPlaygroundMotivationPrompt();
    }
  }

  function showPlaygroundMotivationPrompt() {
    let promptEl = document.getElementById('playground-motivation-toast');
    if (!promptEl) {
      promptEl = document.createElement('div');
      promptEl.id = 'playground-motivation-toast';
      promptEl.className = 'playground-motivation-toast no-print';
      promptEl.innerHTML = `
        <div class="prompt-glow-dot"></div>
        <div class="prompt-content">
          <div class="prompt-title">
            <i class="fas fa-sparkles" style="color: #F59E0B;"></i>
            <span>Loved your edits? Build your full ATS Resume!</span>
          </div>
          <p class="prompt-subtitle">Transfer your playground customizations into the full recruiter-verified ATS builder in 1 click.</p>
        </div>
        <div class="prompt-actions">
          <button type="button" class="btn-prompt-transfer" onclick="window.transferPlaygroundToBuilder()">
            ⚡ Open Full Builder
          </button>
          <button type="button" class="btn-prompt-close" onclick="window.closePlaygroundPrompt()" aria-label="Dismiss">&times;</button>
        </div>
      `;
      const mockupSection = document.querySelector('.stitch-mockup-section');
      if (mockupSection) {
        mockupSection.appendChild(promptEl);
      } else {
        document.body.appendChild(promptEl);
      }
    }

    setTimeout(() => {
      promptEl.classList.add('visible');
    }, 100);
  }

  window.closePlaygroundPrompt = function() {
    const promptEl = document.getElementById('playground-motivation-toast');
    if (promptEl) {
      promptEl.classList.remove('visible');
    }
  };

  window.transferPlaygroundToBuilder = function() {
    const nameInput = document.getElementById('playground-input-name');
    const titleInput = document.getElementById('playground-input-title');
    const bulletInput = document.getElementById('playground-input-bullet');
    const skillsInput = document.getElementById('playground-input-skills');

    const name = nameInput ? nameInput.value : '';
    const title = titleInput ? titleInput.value : '';
    const bullet = bulletInput ? bulletInput.value : '';
    const skills = skillsInput ? skillsInput.value : '';

    // Load matching base profile
    let presetKey = 'software_fresher';
    if (currentRole === 'tcs') presetKey = 'tcs_fresher';
    else if (currentRole === 'data') presetKey = 'data_science_fresher';
    else if (currentRole === 'cloud') presetKey = 'cloud_fresher';

    if (typeof window.loadPreset === 'function') {
      window.loadPreset(presetKey);
    }

    // Override with custom user edits from playground
    if (name) {
      const el = document.getElementById('input-name');
      if (el) el.value = name;
    }
    if (title) {
      const el = document.getElementById('input-title');
      if (el) el.value = title;
    }
    if (skills) {
      const el = document.getElementById('input-technical-skills');
      if (el) el.value = skills;
    }

    if (typeof window.syncFormToPreview === 'function') {
      window.syncFormToPreview();
    }

    if (typeof window.enterApp === 'function') {
      window.enterApp();
    }

    window.closePlaygroundPrompt();
  };

  window.switchPlaygroundRole = function(roleKey) {
    if (!PLAYGROUND_PRESETS[roleKey]) return;
    currentRole = roleKey;

    const preset = PLAYGROUND_PRESETS[roleKey];
    const nameInput = document.getElementById('playground-input-name');
    const titleInput = document.getElementById('playground-input-title');
    const expTitleInput = document.getElementById('playground-input-company');
    const bulletInput = document.getElementById('playground-input-bullet');
    const skillsInput = document.getElementById('playground-input-skills');

    if (nameInput) nameInput.value = preset.name;
    if (titleInput) titleInput.value = preset.title;
    if (expTitleInput) expTitleInput.value = preset.expTitle;
    if (bulletInput) bulletInput.value = preset.bullet1;
    if (skillsInput) skillsInput.value = preset.skills.join(', ');

    // Update active tab buttons
    document.querySelectorAll('.playground-role-tab').forEach(tab => {
      tab.classList.toggle('active', tab.getAttribute('data-role') === roleKey);
    });

    handlePlaygroundInteraction();
  };

  window.setPlaygroundAccent = function(hexColor) {
    currentAccent = hexColor;
    document.querySelectorAll('.playground-color-dot').forEach(dot => {
      dot.classList.toggle('active', dot.getAttribute('data-color') === hexColor);
    });
    handlePlaygroundInteraction();
  };

  window.initHeroPlayground = function() {
    const inputs = [
      'playground-input-name',
      'playground-input-title',
      'playground-input-company',
      'playground-input-bullet',
      'playground-input-skills'
    ];

    inputs.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', handlePlaygroundInteraction);
      }
    });

    renderPlaygroundPreview();
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initHeroPlayground);
  } else {
    window.initHeroPlayground();
  }

})();
