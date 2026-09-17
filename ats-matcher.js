/**
 * ZenSuite ATS Job Description Matcher Engine v1.0
 * 
 * HOW IT WORKS:
 * 1. User pastes a Job Description (JD) text into the modal textarea
 * 2. We extract keywords from the JD using local regex (zero API cost)
 * 3. We extract keywords from the user's current resume in the editor
 * 4. We compute a match score and show:
 *    - FREE: Overall score + matched keywords + 1 free missing keyword fix
 *    - PREMIUM (blurred): Remaining missing keywords + AI bullet rewrites
 * 5. Premium unlock triggers payment flow, then calls /api/ats-tailor for AI rewrites
 */

// ═══════════════════════════════════════════════════════════════
// UNIFIED SESSION JOB DESCRIPTION (JD) MANAGEMENT
// Stored in sessionStorage so it persists across all features for the
// active session and is automatically purged when the user closes the site.
// ═══════════════════════════════════════════════════════════════

const SESSION_JD_KEY = 'zenresume_session_jd';

function getSessionJD() {
  try {
    const jd = sessionStorage.getItem(SESSION_JD_KEY) || sessionStorage.getItem('zen_pending_jd') || (window.state && window.state.targetJobDescription) || '';
    return typeof jd === 'string' ? jd.trim() : '';
  } catch (e) {
    return (window.state && window.state.targetJobDescription) || '';
  }
}

function setSessionJD(jdText) {
  const text = (typeof jdText === 'string') ? jdText.trim() : '';
  try {
    if (text) {
      sessionStorage.setItem(SESSION_JD_KEY, text);
      sessionStorage.setItem('zen_pending_jd', text);
    } else {
      sessionStorage.removeItem(SESSION_JD_KEY);
      sessionStorage.removeItem('zen_pending_jd');
    }
  } catch (e) {}

  if (window.state) {
    window.state.targetJobDescription = text;
  }

  // Synchronize across all active JD input fields
  const atsJd = document.getElementById('ats-jd-input');
  if (atsJd && atsJd.value !== text) atsJd.value = text;

  const clJd = document.getElementById('cover-letter-jd-input');
  if (clJd && clJd.value !== text) clJd.value = text;

  const heroJd = document.getElementById('hero-ats-jd-input');
  if (heroJd && heroJd.value !== text) heroJd.value = text;

  const aiJd = document.getElementById('input-job-description');
  if (aiJd && aiJd.value !== text) aiJd.value = text;

  return text;
}

// ═══════════════════════════════════════════════════════════════
// KEYWORD EXTRACTION ENGINE (Local Regex - Zero Server Cost)
// ═══════════════════════════════════════════════════════════════

const ATS_SKILL_DICTIONARY = [
  // Programming Languages
  'javascript','typescript','python','java','c\\+\\+','c#','ruby','go','golang','rust','swift','kotlin',
  'php','scala','r','matlab','perl','dart','objective-c','sql','nosql','graphql','html','css','sass','less',
  // Frontend
  'react','reactjs','react.js','angular','vue','vuejs','vue.js','next.js','nextjs','nuxt','svelte',
  'tailwind','bootstrap','material ui','redux','webpack','vite','jquery',
  // Backend
  'node.js','nodejs','express','expressjs','django','flask','fastapi','spring','spring boot','springboot',
  'asp.net','.net','laravel','rails','ruby on rails','gin','fiber','nestjs',
  // Cloud & DevOps
  'aws','amazon web services','azure','gcp','google cloud','docker','kubernetes','k8s','terraform',
  'ansible','jenkins','ci/cd','cicd','github actions','gitlab ci','circleci','cloudformation',
  'lambda','ec2','s3','rds','dynamodb','cloudfront','ecs','eks','fargate',
  // Databases
  'mysql','postgresql','postgres','mongodb','redis','elasticsearch','cassandra','firebase','firestore',
  'oracle','sql server','sqlite','supabase','cockroachdb','neo4j',
  // Data & AI/ML
  'machine learning','deep learning','nlp','natural language processing','computer vision',
  'tensorflow','pytorch','keras','scikit-learn','pandas','numpy','spark','hadoop','kafka',
  'data engineering','data pipeline','etl','airflow','dbt','snowflake','bigquery','databricks',
  'generative ai','llm','large language model','rag','langchain','openai','gemini',
  // Testing
  'jest','mocha','pytest','junit','selenium','cypress','playwright','testng','cucumber',
  'unit testing','integration testing','e2e testing','tdd','bdd',
  // Architecture & Patterns
  'microservices','rest','restful','rest api','grpc','soap','graphql','event-driven',
  'serverless','monolith','cqrs','event sourcing','domain-driven design','ddd',
  // Tools & Practices
  'git','github','gitlab','bitbucket','jira','confluence','agile','scrum','kanban',
  'linux','unix','bash','powershell','nginx','apache','rabbitmq','sqs','sns',
  // Soft Skills & Process
  'leadership','communication','teamwork','problem solving','critical thinking',
  'project management','stakeholder management','cross-functional','mentoring',
  // Certifications
  'aws certified','azure certified','gcp certified','pmp','scrum master','csm',
  'comptia','cissp','cka','ckad',
];

function extractJDKeywords(jdText) {
  const text = jdText.toLowerCase();
  const found = [];
  
  for (const skill of ATS_SKILL_DICTIONARY) {
    const regex = new RegExp('\\b' + skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
    if (regex.test(text)) {
      found.push(skill.replace(/\\\+/g, '+'));
    }
  }
  
  // Also extract years of experience patterns
  const expMatch = text.match(/(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp)/i);
  if (expMatch) {
    found.push(`${expMatch[1]}+ years experience`);
  }
  
  return [...new Set(found)];
}

function extractResumeKeywords() {
  // Pull text from the live resume editor state
  const resumeText = [];
  
  // Try to get text from the resume print/preview area
  const previewEl = document.getElementById('resume-print-area') || document.querySelector('.resume-preview') || document.querySelector('#resume-content');
  if (previewEl) {
    resumeText.push(previewEl.innerText || previewEl.textContent || '');
  }

  // Try extractCurrentFormData if available
  if (typeof window.extractCurrentFormData === 'function') {
    try {
      const data = window.extractCurrentFormData();
      if (data) {
        if (data.skills) resumeText.push(data.skills);
        if (data.summary) resumeText.push(data.summary);
        if (Array.isArray(data.experience)) {
          data.experience.forEach(exp => {
            if (exp.role) resumeText.push(exp.role);
            if (exp.company) resumeText.push(exp.company);
            if (exp.description) resumeText.push(exp.description);
            if (Array.isArray(exp.descriptions)) resumeText.push(exp.descriptions.join(' '));
          });
        }
        if (Array.isArray(data.projects)) {
          data.projects.forEach(p => {
            if (p.title) resumeText.push(p.title);
            if (p.technologies) resumeText.push(p.technologies);
            if (p.description) resumeText.push(p.description);
          });
        }
      }
    } catch(e) {}
  }
  
  // Also try to get from form inputs
  const inputs = document.querySelectorAll('#resume-form input, #resume-form textarea, #editor-form input, #editor-form textarea, .section-content input, .section-content textarea');
  inputs.forEach(el => {
    if (el.value) resumeText.push(el.value);
  });
  
  // Also try window.state if available
  if (window.state) {
    if (window.state.skills) resumeText.push(window.state.skills);
    if (window.state.summary) resumeText.push(window.state.summary);
    if (window.state.experience) {
      (Array.isArray(window.state.experience) ? window.state.experience : [window.state.experience]).forEach(exp => {
        if (typeof exp === 'string') resumeText.push(exp);
        else if (exp && exp.description) resumeText.push(exp.description);
        if (exp && exp.bullets) resumeText.push(exp.bullets.join(' '));
      });
    }
    if (window.state.projects) {
      (Array.isArray(window.state.projects) ? window.state.projects : [window.state.projects]).forEach(proj => {
        if (typeof proj === 'string') resumeText.push(proj);
        else if (proj && proj.description) resumeText.push(proj.description);
      });
    }
  }
  
  const fullText = resumeText.join(' ').toLowerCase();
  const found = [];
  
  for (const skill of ATS_SKILL_DICTIONARY) {
    const regex = new RegExp('\\b' + skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
    if (regex.test(fullText)) {
      found.push(skill.replace(/\\\+/g, '+'));
    }
  }
  
  return [...new Set(found)];
}



// ═══════════════════════════════════════════════════════════════
// QUANTIFIABLE METRICS & WEAK BULLETS SCANNER
// ═══════════════════════════════════════════════════════════════

function analyzeBulletMetrics() {
  const bullets = [];
  const textareas = document.querySelectorAll('.input-exp-desc, .input-proj-desc, .item-bullets-textarea, textarea[placeholder*="metric"], textarea[class*="desc"], .experience-item-card textarea, .project-item-card textarea');
  textareas.forEach(ta => {
    if (ta.value && ta.value.trim()) {
      ta.value.split('\n').forEach(line => {
        const clean = line.replace(/^[•\-\*]\s*/, '').trim();
        if (clean.length > 15) bullets.push(clean);
      });
    }
  });

  if (bullets.length === 0) {
    const previewBullets = document.querySelectorAll('.resume-preview li, #resume-content li');
    previewBullets.forEach(li => {
      const text = (li.textContent || '').trim();
      if (text.length > 15) bullets.push(text);
    });
  }

  if (bullets.length === 0 && window.state && window.state.experience) {
    (Array.isArray(window.state.experience) ? window.state.experience : [window.state.experience]).forEach(exp => {
      if (exp && exp.bullets && Array.isArray(exp.bullets)) {
        exp.bullets.forEach(b => {
          if (b && b.trim().length > 15) bullets.push(b.trim());
        });
      }
    });
  }

  const metricRegex = /\b\d+%(?:\s+growth|\s+increase|\s+reduction|\s+boost)?\b|\b\d+\+?\s*(?:k|m|million|lakh|crore|users|requests|req\/s|rps|ms|seconds|minutes|hours|days|engineers|clients|customers|downloads)\b|[\$₹€£]\s*\d+|\b(?:reduced|increased|improved|scaled|accelerated|slashed|saved|boosted)\s+by\s+\d+/i;

  let metricCount = 0;
  const weakBullets = [];

  bullets.forEach(b => {
    if (metricRegex.test(b)) {
      metricCount++;
    } else {
      weakBullets.push(b);
    }
  });

  const total = Math.max(bullets.length, 1);
  const metricScore = Math.round((metricCount / total) * 100);

  return {
    total: bullets.length,
    metricCount,
    weakCount: weakBullets.length,
    metricScore,
    weakBullets: weakBullets.slice(0, 3)
  };
}

function renderBulletMetricsReview(analysis) {
  const container = document.getElementById('ats-bullet-metrics-review');
  if (!container) return;

  if (analysis.total === 0) {
    container.innerHTML = `
      <div class="ats-metric-card ats-metric-card-neutral">
        <div class="ats-metric-header">
          <span class="ats-metric-badge">Google XYZ Metric Health</span>
          <strong style="font-size: 12.5px;">No experience bullets detected</strong>
        </div>
        <p style="font-size: 12px; color: #64748B; margin: 6px 0 10px;">Add bullet points with measurable metrics (e.g. <em>"Reduced latency by 40%"</em>) to pass recruiter screening.</p>
        <button type="button" class="ats-btn-open-bullet-bank" onclick="closeATSMatcher(); window.openBulletBank && window.openBulletBank('experience');">
          ⚡ Browse Metric Bullet Bank
        </button>
      </div>
    `;
    return;
  }

  const isHealthy = analysis.weakCount === 0 || analysis.metricScore >= 70;
  const statusClass = isHealthy ? 'ats-metric-card-good' : 'ats-metric-card-warning';

  container.innerHTML = `
    <div class="ats-metric-card ${statusClass}">
      <div class="ats-metric-header">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="ats-metric-score-pill">${analysis.metricScore}% Quantified</span>
          <strong style="font-size: 13px;">Google XYZ Metric Health (${analysis.metricCount}/${analysis.total} Bullets)</strong>
        </div>
        <span style="font-size: 11px; font-weight: 700; color: ${isHealthy ? '#16A34A' : '#D97706'};">
          ${isHealthy ? '✓ Recruiter-Grade' : '⚠️ Gaps Detected'}
        </span>
      </div>

      ${analysis.weakCount > 0 ? `
        <div class="ats-metric-warning-box">
          <p style="margin: 0 0 6px 0; font-weight: 700; font-size: 12.5px; color: #B45309;">
            <i class="fas fa-triangle-exclamation"></i> ${analysis.weakCount} of your bullets lack measurable numbers or scale metrics!
          </p>
          <p style="margin: 0 0 8px 0; font-size: 11.5px; color: #78350F; line-height: 1.4;">
            Bullets with quantifiable metrics (%, ₹, users, latency) achieve a <strong>3.8x higher interview callback rate</strong>.
          </p>
          ${analysis.weakBullets.length > 0 ? `
            <div style="background: rgba(255, 255, 255, 0.85); border: 1px dashed rgba(217, 119, 6, 0.4); border-radius: 6px; padding: 6px 10px; margin-bottom: 8px; font-size: 11.5px; color: #92400E; font-style: italic;">
              Weak example: "${analysis.weakBullets[0].slice(0, 85)}..."
            </div>
          ` : ''}
          <button type="button" class="ats-btn-open-bullet-bank" onclick="closeATSMatcher(); window.openBulletBank && window.openBulletBank('experience');">
            ⚡ Fix Weak Bullets with Metric Bank (Free)
          </button>
        </div>
      ` : `
        <p style="margin: 6px 0 0 0; font-size: 12px; color: #15803D;">
          🎉 Outstanding! Your bullet points demonstrate quantifiable achievements using numbers, percentages, and scale metrics.
        </p>
      `}
    </div>
  `;
}

// ═══════════════════════════════════════════════════════════════
// SAMPLE TECH JDS FOR INSTANT 1-CLICK TESTING
// ═══════════════════════════════════════════════════════════════

const SAMPLE_JDS = {
  swiggy: `We are looking for a Software Development Engineer (SDE-1) to join our Consumer Tech team at Swiggy in Bangalore.

Role Responsibilities:
- Build high-scale, responsive web applications using React, TypeScript, and modern JavaScript.
- Collaborate with backend engineers to design RESTful APIs and integrate Redis caching layers.
- Optimize web application performance, core web vitals, and asset bundles.
- Work with Docker containers, CI/CD pipelines, and AWS cloud infrastructure.

Required Skills:
- 1-3 years experience in JavaScript, TypeScript, React, Node.js, and Redis.
- Solid understanding of REST APIs, Docker, microservices, and PostgreSQL/MySQL.
- Hands-on experience with unit testing (Jest/Cypress) and Git version control.`,
  
  tcs: `Tata Consultancy Services (TCS) is hiring Graduate Engineer Trainees via TCS NQT across pan-India offices.

Job Requirements:
- BE/B.Tech/MCA freshers with strong foundation in Object-Oriented Programming (OOPs) and Data Structures.
- Hands-on coding proficiency in Java, Python, and SQL database querying.
- Fundamental knowledge of HTML5, CSS3, JavaScript, REST APIs, and Git.
- Demonstrated problem-solving capabilities and excellent written and verbal communication.`
};

function trySampleJD(type) {
  const jd = SAMPLE_JDS[type] || SAMPLE_JDS.swiggy;
  const input = document.getElementById('ats-jd-input');
  if (input) {
    input.value = jd;
  }
  setSessionJD(jd);

  const banner = document.getElementById('ats-cover-letter-redirect-banner');
  const isCoverLetterMode = banner && banner.style.display !== 'none';
  if (isCoverLetterMode) {
    if (typeof window.showToast === 'function') {
      window.showToast(`🎯 Loaded ${type === 'swiggy' ? 'Swiggy SDE-1' : 'TCS NQT'} Job Description! Click generate below.`, 'success');
    }
  } else {
    runATSScan();
  }
}

// ═══════════════════════════════════════════════════════════════
// MODAL CONTROL FUNCTIONS
// ═══════════════════════════════════════════════════════════════

// Safe Event Dispatcher (GA4 & DataLayer Fallback)
function trackATSEvent(eventName, params = {}) {
  try {
    if (typeof window.trackGAEvent === 'function') {
      window.trackGAEvent(eventName, params);
    } else if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    } else if (window.dataLayer && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: eventName, ...params });
    }
  } catch (err) {
    console.warn('[ATS Event Error]', err);
  }
}

function updateATSActiveResumeName() {
  const label = document.getElementById('ats-active-resume-name');
  if (!label) return;
  const nameInput = document.getElementById('input-name');
  if (nameInput && nameInput.value.trim()) {
    label.textContent = `${nameInput.value.trim()}'s Resume`;
  } else if (window.state && window.state.fullName) {
    label.textContent = `${window.state.fullName}'s Resume`;
  } else {
    label.textContent = 'Current Editor Resume';
  }
}

function triggerResumeImport(type = 'pdf') {
  if (type === 'json') {
    const jsonInput = document.getElementById('input-import-file');
    if (jsonInput) jsonInput.click();
    return;
  }
  const pdfInput = document.getElementById('input-magic-pdf');
  if (pdfInput) {
    pdfInput.click();
  } else {
    window.showToast && window.showToast('Please upload your resume in the editor.', 'info');
  }
}

function openATSMatcher(options = null) {
  const modal = document.getElementById('ats-matcher-modal');
  if (!modal) return;
  
  let presetJD = null;
  let isCoverLetterRedirect = false;

  if (typeof options === 'string') {
    presetJD = options;
  } else if (options && typeof options === 'object') {
    presetJD = options.presetJD || null;
    isCoverLetterRedirect = options.purpose === 'cover_letter';
  }

  // Reset to Step 1
  const stepInput = document.getElementById('ats-matcher-step-input');
  const stepResults = document.getElementById('ats-matcher-step-results');
  const stepPremium = document.getElementById('ats-matcher-step-premium');
  if (stepInput) stepInput.style.display = 'block';
  if (stepResults) stepResults.style.display = 'none';
  if (stepPremium) stepPremium.style.display = 'none';

  const banner = document.getElementById('ats-cover-letter-redirect-banner');
  const clBtn = document.getElementById('btn-ats-generate-cover-letter');
  const scanBtn = document.getElementById('btn-run-ats-scan');

  if (isCoverLetterRedirect) {
    if (banner) banner.style.display = 'block';
    if (clBtn) clBtn.style.display = 'flex';
  } else {
    if (banner) banner.style.display = 'none';
    if (clBtn) clBtn.style.display = 'none';
  }
  if (scanBtn) scanBtn.style.display = 'flex';

  const jdInput = document.getElementById('ats-jd-input');
  if (jdInput) {
    if (presetJD && typeof presetJD === 'string') {
      jdInput.value = presetJD;
      setSessionJD(presetJD);
    } else {
      const sessJD = getSessionJD();
      if (sessJD) {
        jdInput.value = sessJD;
      }
    }
  }

  updateATSActiveResumeName();
  
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  
  if (jdInput) {
    setTimeout(() => jdInput.focus(), 150);
  }

  // Track event
  trackATSEvent(isCoverLetterRedirect ? 'cover_letter_jd_prompt_opened' : 'ats_matcher_opened', { 
    event_category: isCoverLetterRedirect ? 'outreach' : 'monetization' 
  });
}

function closeATSMatcher() {
  const modal = document.getElementById('ats-matcher-modal');
  if (modal) modal.style.display = 'none';
  document.body.style.overflow = '';

  const banner = document.getElementById('ats-cover-letter-redirect-banner');
  if (banner) banner.style.display = 'none';
  const clBtn = document.getElementById('btn-ats-generate-cover-letter');
  if (clBtn) clBtn.style.display = 'none';
}

function confirmJDForCoverLetter() {
  const atsJd = document.getElementById('ats-jd-input');
  const jdText = atsJd ? atsJd.value.trim() : '';

  if (!jdText || jdText.length < 15) {
    if (typeof window.showToast === 'function') {
      window.showToast('⚠️ Please paste a Job Description first (at least 15 characters).', 'warning');
    }
    if (atsJd) atsJd.focus();
    return;
  }

  setSessionJD(jdText);
  closeATSMatcher();
  openCoverLetterModal();

  if (typeof window.showToast === 'function') {
    window.showToast('🎯 Target Job Description saved for this session! Generated tailored Cover Letter & InMail.', 'success');
  }
}

// Auto-update when a resume is imported via Magic PDF or JSON
document.addEventListener('resume_imported', () => {
  updateATSActiveResumeName();
  const modal = document.getElementById('ats-matcher-modal');
  const jdInput = document.getElementById('ats-jd-input');
  if (modal && modal.style.display === 'flex' && jdInput && jdInput.value.trim().length >= 20) {
    setTimeout(() => {
      runATSScan();
      if (typeof window.showToast === 'function') {
        window.showToast('🎯 Analyzed match score for your imported resume!', 'success');
      }
    }, 400);
  }
});


// ═══════════════════════════════════════════════════════════════
// THE CORE SCAN FUNCTION (Local Regex - $0 Cost)
// ═══════════════════════════════════════════════════════════════

function runATSScan() {
  const jdText = document.getElementById('ats-jd-input').value.trim();
  if (!jdText || jdText.length < 50) {
    window.showToast && window.showToast('Please paste a complete job description (at least 50 characters).');
    return;
  }
  
  const jdKeywords = extractJDKeywords(jdText);
  const resumeKeywords = extractResumeKeywords();
  
  if (jdKeywords.length === 0) {
    window.showToast && window.showToast('Could not extract keywords. Try pasting the full job description with requirements.');
    return;
  }
  
  // Compute match
  const matched = jdKeywords.filter(k => resumeKeywords.includes(k));
  const missing = jdKeywords.filter(k => !resumeKeywords.includes(k));
  const score = Math.round((matched.length / jdKeywords.length) * 100);
  
  // Switch to results step
  document.getElementById('ats-matcher-step-input').style.display = 'none';
  document.getElementById('ats-matcher-step-results').style.display = 'block';
  
  // Animate score ring
  const scoreEl = document.getElementById('ats-score-number');
  const ringEl = document.getElementById('ats-score-ring');
  const labelEl = document.getElementById('ats-score-label');
  
  // Color coding
  let ringColor = '#e74c3c'; // Red
  let labelText = '🔴 High Risk of ATS Rejection';
  if (score >= 80) { ringColor = '#27ae60'; labelText = '🟢 Strong Match — Likely to Pass ATS'; }
  else if (score >= 60) { ringColor = '#f39c12'; labelText = '🟡 Moderate Match — Missing Critical Keywords'; }
  else if (score >= 40) { ringColor = '#e67e22'; labelText = '🟠 Weak Match — Significant Gaps Detected'; }
  
  ringEl.style.background = `conic-gradient(${ringColor} ${score * 3.6}deg, #e0e0e0 ${score * 3.6}deg)`;
  scoreEl.textContent = score + '%';
  labelEl.textContent = labelText;

  // Analyze experience bullet metrics (Google XYZ formula check)
  const metricAnalysis = analyzeBulletMetrics();
  renderBulletMetricsReview(metricAnalysis);

  // Check user tier & quotas
  const subManager = window.SubscriptionManager;
  const userTier = subManager ? subManager.getUserTier() : 'free';

  // Render matched keywords
  const matchedContainer = document.getElementById('ats-matched-keywords');
  if (matchedContainer) {
    matchedContainer.innerHTML = matched.map(k => 
      `<span class="ats-chip ats-chip-matched">✓ ${k}</span>`
    ).join('');
  }
  
  const freeMissingBox = document.getElementById('ats-free-missing');
  const premiumSection = document.getElementById('ats-premium-section');

  if (userTier === 'free') {
    // FREE TIER: Strictly ONE (1) Free Missing Keyword Fix!
    const freeKwClaimed = localStorage.getItem('zen_free_kw_claimed');
    const curSymbol = subManager && subManager.getCurrency() === 'USD' ? '$' : '₹';
    const dayPrice = subManager && subManager.getCurrency() === 'USD' ? '$4.99' : '₹49';

    if (missing.length === 0) {
      freeMissingBox.innerHTML = '<p style="color:#27ae60;font-weight:600;">🎉 Perfect! No critical keywords missing.</p>';
      if (premiumSection) premiumSection.style.display = 'none';
    } else if (!freeKwClaimed) {
      const freeKeyword = missing[0];
      freeMissingBox.innerHTML = `
        <div class="ats-free-fix-card">
          <p>Your resume is missing: <strong class="ats-highlight-keyword">${freeKeyword}</strong></p>
          <p class="ats-free-fix-hint">Free tier includes 1 instant keyword fix. Add it to your Skills section to improve your score.</p>
          <button class="ats-btn-free-fix" onclick="localStorage.setItem('zen_free_kw_claimed', '${freeKeyword.replace(/'/g, "\\'")}'); injectFreeKeyword('${freeKeyword.replace(/'/g, "\\'")}');">
            ✨ Auto-Add "${freeKeyword}" to My Resume (Free)
          </button>
        </div>
      `;

      const remainingCount = Math.max(0, missing.length - 1);
      const remEl = document.getElementById('ats-remaining-count');
      if (remEl) remEl.textContent = remainingCount;
      
      if (premiumSection) {
        if (remainingCount > 0) {
          premiumSection.style.display = 'block';
          const promoMsg = document.getElementById('ats-premium-teaser-msg');
          if (promoMsg) {
            promoMsg.innerHTML = `🔒 <strong>+${remainingCount} more critical keywords hidden.</strong> Find &amp; paste more keywords manually, or unlock full ATS Keyword Gap Analysis &amp; AI Tailoring with 1-Day (${dayPrice}) or 7-Day Sprint!`;
          }
        } else {
          premiumSection.style.display = 'none';
        }
      }
    } else {
      // Free fix ALREADY used: Lock completely
      freeMissingBox.innerHTML = `
        <div class="ats-free-fix-card" style="border-left: 4px solid #476550;">
          <p style="margin: 0 0 4px 0; font-weight: 700; color: #476550;"><i class="fas fa-check-circle"></i> 1 Free Keyword Fix Applied ("${freeKwClaimed}")</p>
          <p style="margin: 0; font-size: 12px; color: #64748B;">You have used your 1 free keyword fix. Remaining ${missing.length} missing keywords are locked behind Pro.</p>
        </div>
      `;
      if (premiumSection) {
        premiumSection.style.display = 'block';
        const remEl = document.getElementById('ats-remaining-count');
        if (remEl) remEl.textContent = missing.length;
        const promoMsg = document.getElementById('ats-premium-teaser-msg');
        if (promoMsg) {
          promoMsg.innerHTML = `🔒 <strong>+${missing.length} more critical keywords hidden.</strong> Unlock full ATS Keyword Gap Analysis &amp; AI Tailoring with 1-Day (${dayPrice}) or 7-Day Sprint!`;
        }
      }
    }
  } else {
    // PAID TIERS: 1-Day = 3 resumes, 7-Day / ZenSuite = 4 resumes per day
    const maxQuota = userTier === 'day' ? 3 : 4;
    const currentUsage = subManager ? subManager.getDailyUsage('kw_review') : 0;

    if (currentUsage >= maxQuota) {
      if (freeMissingBox) {
        const quotaNotice = userTier === 'day'
          ? `You have completed your 3 resume keyword reviews on your 1-Day Sprint pass.`
          : `You have completed your daily quota of 4 resume keyword reviews for today. Your daily allocation resets at midnight!`;
        freeMissingBox.innerHTML = `
          <div class="ats-free-fix-card" style="border-left: 4px solid #F59E0B; background: rgba(245, 158, 11, 0.08);">
            <p style="margin: 0 0 6px 0; font-weight: 700; color: #B45309;">⚠️ Keyword Review Quota Reached (${maxQuota}/${maxQuota} Resumes)</p>
            <p style="margin: 0; font-size: 12.5px; color: #78350F;">${quotaNotice}</p>
          </div>
        `;
      }
      if (premiumSection) premiumSection.style.display = 'none';
    } else {
      if (subManager) subManager.incrementDailyUsage('kw_review');
      const newUsage = currentUsage + 1;
      const usageLabel = userTier === 'day' ? `${newUsage}/3 Resumes` : `${newUsage}/4 Today`;

      // Show ALL missing keywords with auto-add buttons
      if (freeMissingBox) {
        if (missing.length > 0) {
          freeMissingBox.innerHTML = `
            <div style="background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 12px; padding: 14px; margin-bottom: 12px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <span style="font-weight: 800; font-size: 13px; color: #DC2626;"><i class="fas fa-circle-exclamation"></i> All ${missing.length} Missing Keywords (Tap to Auto-Add):</span>
                <span style="font-size: 11px; font-weight: 700; color: #476550; background: rgba(0, 104, 86, 0.1); padding: 3px 8px; border-radius: 9999px;">${usageLabel}</span>
              </div>
              <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                ${missing.map(k => `
                  <button type="button" class="ats-chip ats-chip-missing" onclick="injectFreeKeyword('${k.replace(/'/g, "\\'")}')" style="cursor: pointer; border: 1px solid rgba(220, 38, 38, 0.3); background: #FEF2F2; color: #DC2626; padding: 4px 10px; border-radius: 8px; font-size: 12px; font-weight: 600;">
                    + ${k}
                  </button>
                `).join('')}
              </div>
            </div>
          `;
        } else {
          freeMissingBox.innerHTML = '<p style="color:#27ae60;font-weight:600;">🎉 Perfect! No critical keywords missing.</p>';
        }
      }
      if (premiumSection) premiumSection.style.display = 'none';
    }
  }
  
  // Store scan results & save target JD for subsequent tailoring
  window._atsScanResults = { jdText, jdKeywords, resumeKeywords, matched, missing, score };
  setSessionJD(jdText);
  
  // Track event
  trackATSEvent('ats_scan_completed', {
    event_category: 'monetization',
    event_label: `score_${score}`,
    value: score
  });
}

function resetATSScan() {
  const stepInput = document.getElementById('ats-matcher-step-input');
  const stepResults = document.getElementById('ats-matcher-step-results');
  const stepPremium = document.getElementById('ats-matcher-step-premium');
  if (stepInput) stepInput.style.display = 'block';
  if (stepResults) stepResults.style.display = 'none';
  if (stepPremium) stepPremium.style.display = 'none';
  const jdInput = document.getElementById('ats-jd-input');
  if (jdInput) jdInput.focus();
}

// ═══════════════════════════════════════════════════════════════
// STANDALONE COVER LETTER & RECRUITER INMAIL MODAL HANDLERS
// ═══════════════════════════════════════════════════════════════

function openCoverLetterModal() {
  const currentJD = getSessionJD();
  
  // If no JD has been given in this session yet (or too short to be a valid JD)
  if (!currentJD || currentJD.length < 15) {
    if (typeof window.showToast === 'function') {
      window.showToast('🎯 Please paste your target Job Description first to tailor your Cover Letter & InMail!', 'info');
    }
    openATSMatcher({ purpose: 'cover_letter' });
    return;
  }

  const modal = document.getElementById('modal-cover-letter');
  if (!modal) return;
  
  const jdInput = document.getElementById('cover-letter-jd-input');
  if (jdInput) {
    jdInput.value = currentJD;
  }

  generateCoverLetterMaterials();
  switchCoverLetterTab('cover');

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  trackATSEvent('cover_letter_modal_opened', { event_category: 'outreach' });
}

function closeCoverLetterModal() {
  const modal = document.getElementById('modal-cover-letter');
  if (modal) modal.style.display = 'none';
  document.body.style.overflow = '';
}

function loadCoverLetterSample(sampleType) {
  const jdInput = document.getElementById('cover-letter-jd-input');
  if (jdInput && SAMPLE_JDS[sampleType]) {
    const jd = SAMPLE_JDS[sampleType];
    jdInput.value = jd;
    setSessionJD(jd);
    generateCoverLetterMaterials();
    if (typeof window.showToast === 'function') {
      window.showToast(`🎯 Loaded ${sampleType === 'swiggy' ? 'Swiggy SDE-1' : 'TCS NQT'} Job Description!`, 'success');
    }
  }
}

function generateCoverLetterMaterials() {
  const jdInput = document.getElementById('cover-letter-jd-input');
  const jdText = (jdInput && jdInput.value) || getSessionJD() || '';
  if (!window.CoverLetterEngine) return;

  const clData = window.CoverLetterEngine.generateCoverLetter(jdText);
  const inmailData = window.CoverLetterEngine.generateRecruiterInMail(jdText);

  // Standalone modal fields
  const clTextarea = document.getElementById('standalone-cover-letter-text') || document.getElementById('ats-cover-letter-text');
  if (clTextarea) {
    clTextarea.value = clData.fullText;
  }

  const inmailSubject = document.getElementById('standalone-inmail-subject') || document.getElementById('ats-inmail-subject');
  if (inmailSubject) {
    inmailSubject.value = inmailData.subject;
  }

  const inmailBody = document.getElementById('standalone-inmail-body') || document.getElementById('ats-inmail-body');
  if (inmailBody) {
    inmailBody.value = inmailData.body;
  }

  // Update target JD state
  if (jdText) {
    setSessionJD(jdText);
  }
}

function switchCoverLetterTab(tab) {
  const tabCover = document.getElementById('tab-btn-cover-letter');
  const tabInmail = document.getElementById('tab-btn-inmail');
  const paneCover = document.getElementById('pane-cover-letter');
  const paneInmail = document.getElementById('pane-inmail');

  if (tab === 'inmail') {
    if (tabCover) {
      tabCover.style.background = 'rgba(2, 132, 199, 0.05)';
      tabCover.style.color = '#0284C7';
      tabCover.style.border = '1px solid rgba(2, 132, 199, 0.25)';
    }
    if (tabInmail) {
      tabInmail.style.background = '#0284C7';
      tabInmail.style.color = '#FFFFFF';
      tabInmail.style.border = 'none';
    }
    if (paneCover) paneCover.style.display = 'none';
    if (paneInmail) paneInmail.style.display = 'block';
  } else {
    if (tabCover) {
      tabCover.style.background = '#0284C7';
      tabCover.style.color = '#FFFFFF';
      tabCover.style.border = 'none';
    }
    if (tabInmail) {
      tabInmail.style.background = 'rgba(2, 132, 199, 0.05)';
      tabInmail.style.color = '#0284C7';
      tabInmail.style.border = '1px solid rgba(2, 132, 199, 0.25)';
    }
    if (paneCover) paneCover.style.display = 'block';
    if (paneInmail) paneInmail.style.display = 'none';
  }
}

function copyCoverLetterText() {
  const ta = document.getElementById('standalone-cover-letter-text') || document.getElementById('ats-cover-letter-text');
  if (!ta || !ta.value) return;
  navigator.clipboard.writeText(ta.value).then(() => {
    if (typeof window.showToast === 'function') {
      window.showToast('📋 Copied Tailored Cover Letter to clipboard!', 'success');
    }
  });
}

function copyInMailText() {
  const subj = document.getElementById('standalone-inmail-subject') || document.getElementById('ats-inmail-subject');
  const body = document.getElementById('standalone-inmail-body') || document.getElementById('ats-inmail-body');
  const full = (subj ? 'Subject: ' + subj.value + '\n\n' : '') + (body ? body.value : '');
  navigator.clipboard.writeText(full).then(() => {
    if (typeof window.showToast === 'function') {
      window.showToast('📋 Copied Recruiter InMail script to clipboard!', 'success');
    }
  });
}

function downloadCoverLetterPDF() {
  const ta = document.getElementById('standalone-cover-letter-text') || document.getElementById('ats-cover-letter-text');
  if (!ta || !ta.value) return;

  const candidate = (window.CoverLetterEngine && window.CoverLetterEngine.getCandidateData()) || { name: 'Applicant' };
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    if (typeof window.showToast === 'function') window.showToast('Please allow popups to download Cover Letter PDF');
    return;
  }

  const paragraphs = ta.value.split('\n\n').map(p => `<p style="margin: 0 0 16px 0; line-height: 1.6; font-size: 14px; color: #1E293B;">${p.replace(/\n/g, '<br>')}</p>`).join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Cover Letter - ${candidate.name}</title>
      <style>
        @page { size: letter; margin: 24mm 20mm; }
        body { font-family: 'Inter', -apple-system, sans-serif; color: #0F172A; max-width: 750px; margin: 0 auto; padding: 30px; }
        .header { border-bottom: 2px solid #0284C7; padding-bottom: 16px; margin-bottom: 24px; }
        .name { font-size: 24px; font-weight: 800; color: #0284C7; margin: 0 0 4px 0; }
        .contact { font-size: 12px; color: #64748B; margin: 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 class="name">${candidate.name}</h1>
        <p class="contact">${[candidate.title, candidate.email, candidate.phone, candidate.linkedin].filter(Boolean).join(' • ')}</p>
      </div>
      <div class="content">${paragraphs}</div>
      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

function switchATSTab(tabName) {
  // Backwards compatibility shim: if anything calls switchATSTab, open the right modal
  if (tabName === 'coverletter') {
    closeATSMatcher();
    openCoverLetterModal();
  }
}

function handleHeroJDScan(sampleType) {
  let jd = '';
  if (sampleType && SAMPLE_JDS[sampleType]) {
    jd = SAMPLE_JDS[sampleType];
  } else {
    const heroInput = document.getElementById('hero-ats-jd-input');
    jd = heroInput ? heroInput.value.trim() : '';
  }

  if (jd) {
    setSessionJD(jd);
  }

  // Check if we need to load a starter template if form is empty
  const saved = localStorage.getItem('zenresume_state');
  if (!saved && typeof RESUME_PROFILES !== 'undefined' && RESUME_PROFILES.software_fresher) {
    if (typeof loadProfileIntoForm === 'function') {
      loadProfileIntoForm(RESUME_PROFILES.software_fresher);
    }
  }

  // REDIRECT DIRECTLY TO BUILDER WORKSPACE (EDITOR PAGE - NOT TEMPLATE SELECTION!)
  if (typeof window.enterBuilderDirectly === 'function') {
    window.enterBuilderDirectly();
  } else {
    document.body.classList.add('in-editor');
    const landingScreen = document.getElementById('landing-screen');
    const appContainer = document.getElementById('app-container');
    const selectionScreen = document.getElementById('selection-screen');
    const builderWorkspace = document.getElementById('builder-workspace');
    const welcomeHeader = document.getElementById('app-header-welcome');
    if (landingScreen) landingScreen.style.display = 'none';
    if (appContainer) appContainer.style.display = 'flex';
    if (selectionScreen) selectionScreen.style.display = 'none';
    if (welcomeHeader) welcomeHeader.style.display = 'none';
    if (builderWorkspace) builderWorkspace.style.display = 'grid';
    if (typeof syncFormToPreview === 'function') syncFormToPreview();
  }

  // In the editor, open the ATS Matcher modal
  setTimeout(() => {
    openATSMatcher(jd || null);
    if (jd && jd.length >= 20) {
      runATSScan();
    } else {
      const modalInput = document.getElementById('ats-jd-input');
      if (modalInput) {
        modalInput.value = '';
        modalInput.focus();
      }
    }
  }, 350);
}


// ═══════════════════════════════════════════════════════════════
// FREE KEYWORD INJECTION (The Dopamine Hook)
// ═══════════════════════════════════════════════════════════════

function injectFreeKeyword(keyword) {
  // Try to add the keyword to the Skills section
  const skillsInput = document.querySelector('#skills-input') || document.querySelector('[data-field="skills"]') || document.querySelector('#input-skills');
  if (skillsInput) {
    const currentSkills = skillsInput.value || '';
    if (!currentSkills.toLowerCase().includes(keyword.toLowerCase())) {
      skillsInput.value = currentSkills ? currentSkills + ', ' + keyword : keyword;
      skillsInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
  
  // Also update window.state if available
  if (window.state && window.state.skills !== undefined) {
    const currentSkills = window.state.skills || '';
    if (!currentSkills.toLowerCase().includes(keyword.toLowerCase())) {
      window.state.skills = currentSkills ? currentSkills + ', ' + keyword : keyword;
    }
  }
  
  // Trigger preview refresh
  if (typeof renderPreview === 'function') renderPreview();
  if (typeof updatePreview === 'function') updatePreview();
  if (typeof syncFormToPreview === 'function') syncFormToPreview();
  
  window.showToast && window.showToast(`✨ "${keyword}" added to your resume! Your ATS score just improved.`);
  
  // Track conversion
  trackATSEvent('ats_free_keyword_injected', {
    event_category: 'monetization',
    event_label: keyword
  });
}


// ═══════════════════════════════════════════════════════════════
// PRICING TABS & GEO-DETECTION
// ═══════════════════════════════════════════════════════════════

const PRICING_TIERS = {
  INR: {
    day:   { amount: '₹49',  period: '/ 24 hours',  value: 49 },
    week:  { amount: '₹199', period: '/ 7 days',    value: 199 },
    month: { amount: '₹599', period: '/ 1 month',   value: 599 }
  },
  USD: {
    day:   { amount: '$4.99',  period: '/ 24 hours',  value: 499 },
    week:  { amount: '$11.99', period: '/ 7 days',    value: 1199 },
    month: { amount: '$49.99', period: '/ 1 month',   value: 4999 }
  }
};

let selectedTier = 'day';
let detectedCurrency = 'INR'; // Default to India

// Auto-detect currency from locale/timezone
(function detectGeo() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const lang = navigator.language || '';
    if (tz.startsWith('Asia/Kolkata') || tz.startsWith('Asia/Calcutta') || lang.startsWith('hi') || lang.startsWith('en-IN')) {
      detectedCurrency = 'INR';
    } else {
      detectedCurrency = 'USD';
    }
  } catch (e) {
    detectedCurrency = 'INR';
  }
})();

function updatePriceDisplay() {
  const tier = PRICING_TIERS[detectedCurrency][selectedTier];
  document.getElementById('ats-price-amount').textContent = tier.amount;
  document.getElementById('ats-price-period').textContent = tier.period;
}

// Price tab click handler
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.ats-price-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.ats-price-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      selectedTier = tab.dataset.tier;
      updatePriceDisplay();
    });
  });
  updatePriceDisplay();
});


// ═══════════════════════════════════════════════════════════════
// PAYMENT INITIATION (Razorpay / UPI for INR / Stripe for USD)
// ═══════════════════════════════════════════════════════════════

function initiatePayment() {
  const planKey = selectedTier === 'week' ? 'sprint' : (selectedTier === 'month' ? 'suite' : 'day');
  const tier = (PRICING_TIERS[detectedCurrency] && PRICING_TIERS[detectedCurrency][selectedTier]) || {};
  
  trackATSEvent('payment_initiated', {
    event_category: 'monetization',
    event_label: `${selectedTier}_${detectedCurrency}`,
    value: tier.value || 49
  });

  // Open unified Pro Payment modal with selected tier pre-selected
  if (typeof window.openProPaymentModal === 'function') {
    window.openProPaymentModal(planKey);
  } else if (typeof window.openUPIPaymentModal === 'function') {
    window.openUPIPaymentModal(planKey);
  } else {
    window.showToast && window.showToast('Select a plan to upgrade.', 'info');
  }
}


// ═══════════════════════════════════════════════════════════════
// SOCIAL PROOF TICKER ROTATION
// ═══════════════════════════════════════════════════════════════

const SOCIAL_PROOF_MESSAGES = [
  '🎓 <strong>Rahul K.</strong> (CSE Fresher, Hyderabad) unlocked this, achieved 98% ATS match, and got shortlisted at Cognizant.',
  '💻 <strong>Priya S.</strong> (Junior Developer, Pune) matched her resume for an AWS role and got interview call from TCS.',
  '📊 <strong>Arjun M.</strong> (Data Analyst, Bangalore) improved his score from 45% to 96% and landed a placement at Wipro.',
  '🎯 <strong>Sneha R.</strong> (MBA Fresher, Chennai) used ZenPass to tailor her resume and received 3 interview calls in one week.',
  '⚡ <strong>Vikram P.</strong> (Full Stack Dev, Delhi) auto-matched 12 missing keywords and got shortlisted at Amazon.',
];

let proofIndex = 0;
setInterval(() => {
  const el = document.getElementById('ats-social-proof');
  if (el && el.offsetParent !== null) {
    proofIndex = (proofIndex + 1) % SOCIAL_PROOF_MESSAGES.length;
    el.style.opacity = '0';
    setTimeout(() => {
      el.innerHTML = '<p>' + SOCIAL_PROOF_MESSAGES[proofIndex] + '</p>';
      el.style.opacity = '1';
    }, 300);
  }
}, 5000);


// ═══════════════════════════════════════════════════════════════
// PREMIUM FEATURE PREVIEWS & VALUE EXPLANATION POPUP
// ═══════════════════════════════════════════════════════════════

const FEATURE_PREVIEWS = {
  missing_keywords: {
    icon: '🔍',
    badge: '95%+ ATS PASS RATE',
    title: 'Full ATS Missing Keywords Deep-Scan',
    whatItDoes: 'Extracts 100% of hard & soft skill keywords, tools, protocols, and certifications directly from your target Job Description.',
    whyItMatters: 'Corporate ATS parsers (Workday, Taleo, Greenhouse) automatically discard resumes with low keyword match density before a human recruiter ever sees them. Unlocking all missing keywords boosts your match rate from ~45% to 95%+, guaranteeing your resume lands on the recruiter’s desk.',
    metric: '+3.8x Higher Recruiter Callback Rate',
    example: 'Identifies missing niche terms like <code>Docker</code>, <code>Kubernetes</code>, <code>REST APIs</code>, <code>CI/CD Pipelines</code>, and indicates their exact placement priority.'
  },
  ai_rewrites: {
    icon: '✨',
    badge: 'GOOGLE XYZ FORMULA',
    title: 'AI-Powered Bullet Point Rewriter',
    whatItDoes: 'Automatically rewrites your past experience and project bullet points into high-impact Google XYZ metrics (<em>"Accomplished [X], as measured by [Y], by doing [Z]"</em>) with target keywords injected.',
    whyItMatters: 'Hiring managers spend only 6 seconds scanning each resume. Bullet points written with concrete metric formulas (e.g. <em>"Reduced latency by 40%"</em>) prove real competency and pass both machine parsers and senior engineering leads.',
    metric: '99% Recruiter Readability Score',
    example: 'Transforms <em>"Built backend services"</em> → <strong>"Architected scalable microservices using Node.js & Redis, reducing API response times by 35% across 1M+ daily active requests."</strong>'
  },
  zenscout: {
    icon: '🤖',
    badge: '10x APPLICATION VELOCITY',
    title: 'ZenScout AI — Automated Job Hunter',
    whatItDoes: 'Autonomous AI job-hunting agent that scans tech portals and automatically submits your tailored resume to 200+ matched openings.',
    whyItMatters: 'Job hunting is a numbers game. Applying to jobs manually takes 15–20 hours a week and causes burnout. ZenScout handles repetitive form fills and applications for you 24/7 so you focus solely on attending interviews.',
    metric: 'Save 15+ Hours of Tedious Applying Every Week',
    example: 'Auto-detects matching jobs on company career boards, tailors your profile on the fly, and tracks all submissions in a single live dashboard.'
  },
  zendoc: {
    icon: '🎤',
    badge: '88% INTERVIEW PASS RATE',
    title: 'ZenDoc AI — Mock Interview Simulator',
    whatItDoes: 'Generates tailored technical and HR interview questions based on your exact resume projects and the company’s job description.',
    whyItMatters: 'Over 80% of candidates who pass the ATS screening fail the first two interview rounds due to lack of prep on their own project details. ZenDoc drills you on counter-questions, edge cases, and behavioral scenarios with instant grading.',
    metric: '88% First-Round Technical Pass Rate',
    example: 'Asks targeted questions like: <em>"In project X, why did you pick MongoDB over PostgreSQL for caching?"</em> and coaches your answer in real-time.'
  }
};

function showFeaturePreview(featureKey) {
  const data = FEATURE_PREVIEWS[featureKey];
  if (!data) return;

  const popup = document.getElementById('ats-feature-preview-popup');
  const body = document.getElementById('ats-feature-popup-body');
  if (!popup || !body) return;

  body.innerHTML = `
    <div class="ats-feature-popup-header">
      <span class="ats-feature-popup-badge">${data.badge}</span>
      <h3>${data.icon} ${data.title}</h3>
    </div>

    <div class="ats-feature-popup-section">
      <h4><i class="fas fa-cogs"></i> What This Feature Does:</h4>
      <p>${data.whatItDoes}</p>
    </div>

    <div class="ats-feature-popup-section ats-feature-popup-impact">
      <h4><i class="fas fa-chart-line"></i> How It Increases Your Selection Chances:</h4>
      <p>${data.whyItMatters}</p>
      <div class="ats-feature-metric-pill">
        🏆 <strong>Impact:</strong> ${data.metric}
      </div>
    </div>

    <div class="ats-feature-popup-section ats-feature-popup-example">
      <h4><i class="fas fa-lightbulb"></i> Real Example:</h4>
      <div class="ats-example-box">${data.example}</div>
    </div>
  `;

  popup.style.display = 'flex';

  // Track event
  trackATSEvent('feature_preview_clicked', {
    event_category: 'monetization',
    event_label: featureKey
  });
}

function closeFeaturePreview() {
  const popup = document.getElementById('ats-feature-preview-popup');
  if (popup) popup.style.display = 'none';
}

function scrollToPlanSelection() {
  closeFeaturePreview();
  const cta = document.querySelector('.ats-pricing-cta');
  if (cta) {
    cta.scrollIntoView({ behavior: 'smooth', block: 'center' });
    cta.classList.add('ats-pricing-highlight');
    setTimeout(() => cta.classList.remove('ats-pricing-highlight'), 2000);
  }
}

// ═══════════════════════════════════════════════════════════════
// TRIGGER POINTS: Post-Download & Editor Toolbar
// ═══════════════════════════════════════════════════════════════

// Listen for PDF download events to show the matcher drawer
document.addEventListener('resume_downloaded', () => {
  setTimeout(() => {
    openATSMatcher();
  }, 1500);
});

// Expose globally
window.SAMPLE_JDS = SAMPLE_JDS;
window.ATS_SKILL_DICTIONARY = ATS_SKILL_DICTIONARY;
window.extractJDKeywords = extractJDKeywords;
window.extractResumeKeywords = extractResumeKeywords;
window.openATSMatcher = openATSMatcher;
window.closeATSMatcher = closeATSMatcher;
window.runATSScan = runATSScan;
window.injectFreeKeyword = injectFreeKeyword;
window.initiatePayment = initiatePayment;
window.showFeaturePreview = showFeaturePreview;
window.closeFeaturePreview = closeFeaturePreview;
window.scrollToPlanSelection = scrollToPlanSelection;
window.trySampleJD = trySampleJD;
window.switchATSTab = switchATSTab;
window.copyCoverLetterText = copyCoverLetterText;
window.copyInMailText = copyInMailText;
window.downloadCoverLetterPDF = downloadCoverLetterPDF;
window.openCoverLetterModal = openCoverLetterModal;
window.handleHeroJDScan = handleHeroJDScan;
window.analyzeBulletMetrics = analyzeBulletMetrics;
window.triggerResumeImport = triggerResumeImport;
window.updateATSActiveResumeName = updateATSActiveResumeName;
window.resetATSScan = resetATSScan;
window.closeCoverLetterModal = closeCoverLetterModal;
window.loadCoverLetterSample = loadCoverLetterSample;
window.generateCoverLetterMaterials = generateCoverLetterMaterials;
window.switchCoverLetterTab = switchCoverLetterTab;
window.getSessionJD = getSessionJD;
window.setSessionJD = setSessionJD;
window.confirmJDForCoverLetter = confirmJDForCoverLetter;

// Live Two-Way Sync for Session JD Across all Inputs
function initJDSessionSync() {
  const atsJd = document.getElementById('ats-jd-input');
  if (atsJd) {
    atsJd.addEventListener('input', () => setSessionJD(atsJd.value));
  }
  const clJd = document.getElementById('cover-letter-jd-input');
  if (clJd) {
    clJd.addEventListener('input', () => setSessionJD(clJd.value));
  }
  const heroJd = document.getElementById('hero-ats-jd-input');
  if (heroJd) {
    heroJd.addEventListener('input', () => setSessionJD(heroJd.value));
  }
  const aiJd = document.getElementById('input-job-description');
  if (aiJd) {
    aiJd.addEventListener('input', () => setSessionJD(aiJd.value));
  }

  const initialJD = getSessionJD();
  if (initialJD) {
    setSessionJD(initialJD);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initJDSessionSync);
} else {
  initJDSessionSync();
}
