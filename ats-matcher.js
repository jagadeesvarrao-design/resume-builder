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
  
  if (typeof gtag === 'function') {
    const tier = PRICING_TIERS[detectedCurrency][selectedTier] || {};
    gtag('event', 'payment_initiated', {
      event_category: 'monetization',
      event_label: `${selectedTier}_${detectedCurrency}`,
      value: tier.value || 49
    });
  }

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
  if (typeof gtag === 'function') {
    gtag('event', 'feature_preview_clicked', {
      event_category: 'monetization',
      event_label: featureKey
    });
  }
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
window.openATSMatcher = openATSMatcher;
window.closeATSMatcher = closeATSMatcher;
window.runATSScan = runATSScan;
window.injectFreeKeyword = injectFreeKeyword;
window.initiatePayment = initiatePayment;
window.showFeaturePreview = showFeaturePreview;
window.closeFeaturePreview = closeFeaturePreview;
window.scrollToPlanSelection = scrollToPlanSelection;
