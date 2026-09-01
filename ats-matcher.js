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
  
  // Try to get text from the resume preview panel
  const previewEl = document.querySelector('.resume-preview') || document.querySelector('#resume-content');
  if (previewEl) {
    resumeText.push(previewEl.innerText || previewEl.textContent || '');
  }
  
  // Also try to get from form inputs
  const inputs = document.querySelectorAll('#editor-form input, #editor-form textarea, .section-content input, .section-content textarea');
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
// MODAL CONTROL FUNCTIONS
// ═══════════════════════════════════════════════════════════════

function openATSMatcher() {
  const modal = document.getElementById('ats-matcher-modal');
  if (!modal) return;
  
  // Reset to Step 1
  document.getElementById('ats-matcher-step-input').style.display = 'block';
  document.getElementById('ats-matcher-step-results').style.display = 'none';
  document.getElementById('ats-matcher-step-premium').style.display = 'none';
  document.getElementById('ats-jd-input').value = '';
  
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  
  // Track event
  if (typeof gtag === 'function') gtag('event', 'ats_matcher_opened', { event_category: 'monetization' });
}

function closeATSMatcher() {
  const modal = document.getElementById('ats-matcher-modal');
  if (modal) modal.style.display = 'none';
  document.body.style.overflow = '';
}


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
  
  // Render matched keywords (all free)
  const matchedContainer = document.getElementById('ats-matched-keywords');
  matchedContainer.innerHTML = matched.map(k => 
    `<span class="ats-chip ats-chip-matched">✓ ${k}</span>`
  ).join('');
  
  // Render 1 free missing keyword (The Dopamine Taste)
  const freeMissingBox = document.getElementById('ats-free-missing');
  if (missing.length > 0) {
    const freeKeyword = missing[0];
    freeMissingBox.innerHTML = `
      <div class="ats-free-fix-card">
        <p>Your resume is missing: <strong class="ats-highlight-keyword">${freeKeyword}</strong></p>
        <p class="ats-free-fix-hint">This keyword appears in the job description but is not in your resume. Add it to your Skills section to improve your score.</p>
        <button class="ats-btn-free-fix" onclick="injectFreeKeyword('${freeKeyword.replace(/'/g, "\\'")}')">
          ✨ Auto-Add "${freeKeyword}" to My Resume (Free)
        </button>
      </div>
    `;
  } else {
    freeMissingBox.innerHTML = '<p style="color:#27ae60;font-weight:600;">🎉 Perfect! No critical keywords missing.</p>';
  }
  
  // Update remaining count for blurred section
  const remainingCount = Math.max(0, missing.length - 1);
  document.getElementById('ats-remaining-count').textContent = remainingCount;
  
  // Show/hide premium blur section
  const premiumSection = document.getElementById('ats-premium-section');
  if (remainingCount > 0) {
    premiumSection.style.display = 'block';
  } else {
    premiumSection.style.display = 'none';
  }
  
  // Store scan results for premium unlock
  window._atsScanResults = { jdText, jdKeywords, resumeKeywords, matched, missing, score };
  
  // Track event
  if (typeof gtag === 'function') {
    gtag('event', 'ats_scan_completed', {
      event_category: 'monetization',
      event_label: `score_${score}`,
      value: score
    });
  }
}


// ═══════════════════════════════════════════════════════════════
// FREE KEYWORD INJECTION (The Dopamine Hook)
// ═══════════════════════════════════════════════════════════════

function injectFreeKeyword(keyword) {
  // Try to add the keyword to the Skills section
  const skillsInput = document.querySelector('#skills-input') || document.querySelector('[data-field="skills"]');
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
  
  window.showToast && window.showToast(`✨ "${keyword}" added to your resume! Your ATS score just improved.`);
  
  // Track conversion
  if (typeof gtag === 'function') {
    gtag('event', 'ats_free_keyword_injected', {
      event_category: 'monetization',
      event_label: keyword
    });
  }
}


// ═══════════════════════════════════════════════════════════════
// PRICING TABS & GEO-DETECTION
// ═══════════════════════════════════════════════════════════════

const PRICING_TIERS = {
  INR: {
    day:   { amount: '₹99',  period: '/ 24 hours',  value: 99 },
    week:  { amount: '₹199', period: '/ 7 days',    value: 199 },
    month: { amount: '₹599', period: '/ 30 days',   value: 599 }
  },
  USD: {
    day:   { amount: '$4.99',  period: '/ 24 hours',  value: 499 },
    week:  { amount: '$9.99',  period: '/ 7 days',    value: 999 },
    month: { amount: '$24.99', period: '/ 30 days',   value: 2499 }
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
// PAYMENT INITIATION (Razorpay for INR / Stripe for USD)
// ═══════════════════════════════════════════════════════════════

function initiatePayment() {
  // Check if user is logged in
  if (!firebase.auth().currentUser) {
    window.showToast && window.showToast('Please sign in first to unlock premium features.');
    return;
  }
  
  const tier = PRICING_TIERS[detectedCurrency][selectedTier];
  
  if (detectedCurrency === 'INR') {
    // Razorpay Integration (placeholder - needs API key configuration)
    window.showToast && window.showToast('Payment gateway integration in progress. Contact support.zenresume@gmail.com for early access.');
    
    if (typeof gtag === 'function') {
      gtag('event', 'payment_initiated', {
        event_category: 'monetization',
        event_label: `${selectedTier}_${detectedCurrency}`,
        value: tier.value
      });
    }
  } else {
    // Stripe Integration (placeholder)
    window.showToast && window.showToast('International payment gateway coming soon. Contact support.zenresume@gmail.com for early access.');
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
// TRIGGER POINTS: Post-Download & Editor Toolbar
// ═══════════════════════════════════════════════════════════════

// Listen for PDF download events to show the matcher drawer
document.addEventListener('resume_downloaded', () => {
  setTimeout(() => {
    openATSMatcher();
  }, 1500);
});

// Expose globally
window.openATSMatcher = openATSMatcher;
window.closeATSMatcher = closeATSMatcher;
window.runATSScan = runATSScan;
window.injectFreeKeyword = injectFreeKeyword;
window.initiatePayment = initiatePayment;
