/**
 * ZenResume 1-Click Tailored Cover Letter & Recruiter InMail Engine v3.0
 * 
 * Generates:
 * 1. 3-Paragraph High-Converting Cover Letter tailored to target company & JD keywords.
 * 2. 75-Word Punchy LinkedIn Recruiter InMail / Cold Email asking for a chat/referral.
 * 
 * 100% Client-Side, Instant Zero-Latency,  API/Token Cost.
 */

const CoverLetterEngine = (() => {

  function extractCompany(jdText) {
    if (!jdText) return 'the Hiring Team';
    const text = jdText.trim();
    
    const patterns = [
      /(?:at|join|about)\s+([A-Z][A-Za-z0-9&]{2,20}(?:\s+[A-Z][A-Za-z0-9&]{2,20})?)/,
      /([A-Z][A-Za-z0-9&]{2,20})\s+is\s+looking\s+for/i,
      /([A-Z][A-Za-z0-9&]{2,20})\s+is\s+hiring/i,
      /welcome\s+to\s+([A-Z][A-Za-z0-9&]{2,20})/i,
      /company:\s*([A-Za-z0-9&]{2,25})/i
    ];
    
    for (const pat of patterns) {
      const match = text.match(pat);
      if (match && match[1]) {
        const clean = match[1].trim();
        const generic = ['the', 'this', 'our', 'a', 'an', 'we', 'full', 'part', 'senior', 'junior', 'lead', 'software'];
        if (!generic.includes(clean.toLowerCase())) {
          return clean;
        }
      }
    }
    
    return 'Your Organization';
  }

  function extractRole(jdText, candidateTitle) {
    if (!jdText) return candidateTitle || 'Software Engineer';
    const patterns = [
      /(?:looking for|seeking|hiring|role:?|title:?)\s+(?:a|an)?\s*([A-Za-z0-9\s\/\-]{3,35}(?:Engineer|Developer|Analyst|Designer|Manager|Intern|Architect|Consultant|Specialist))/i,
      /([A-Za-z\s]{3,30}(?:Engineer|Developer|Analyst|Manager|Intern))\s*(?:position|opening|role)/i
    ];

    for (const pat of patterns) {
      const match = jdText.match(pat);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    return candidateTitle || 'Software Engineer';
  }

  function getCandidateData() {
    let name = 'Job Applicant';
    let title = 'Software Engineer';
    let email = '';
    let phone = '';
    let linkedin = '';
    let skills = ['JavaScript', 'Python', 'React', 'Problem Solving'];
    let topBullet = '';

    const nameInput = document.getElementById('input-name');
    if (nameInput && nameInput.value.trim()) name = nameInput.value.trim();

    const titleInput = document.getElementById('input-title');
    if (titleInput && titleInput.value.trim()) title = titleInput.value.trim();

    const emailInput = document.getElementById('input-email');
    if (emailInput && emailInput.value.trim()) email = emailInput.value.trim();

    const phoneInput = document.getElementById('input-phone');
    if (phoneInput && phoneInput.value.trim()) phone = phoneInput.value.trim();

    const linkedinInput = document.getElementById('input-linkedin');
    if (linkedinInput && linkedinInput.value.trim()) linkedin = linkedinInput.value.trim();

    const skillsInput = document.getElementById('input-skills') || document.querySelector('#skills-input');
    if (skillsInput && skillsInput.value.trim()) {
      skills = skillsInput.value.split(',').map(s => s.trim()).filter(Boolean);
    }

    const expTextareas = document.querySelectorAll('.item-bullets-textarea, textarea[placeholder*="metric"]');
    if (expTextareas.length > 0) {
      for (const ta of expTextareas) {
        if (ta.value && ta.value.trim()) {
          const lines = ta.value.split('\n').filter(l => l.trim().length > 20);
          if (lines.length > 0) {
            topBullet = lines[0].replace(/^[•\-\*]\s*/, '').trim();
            break;
          }
        }
      }
    }

    if (window.state && window.state.formData) {
      const fd = window.state.formData;
      if (fd.personal) {
        if (fd.personal.name) name = fd.personal.name;
        if (fd.personal.title) title = fd.personal.title;
        if (fd.personal.email) email = fd.personal.email;
        if (fd.personal.phone) phone = fd.personal.phone;
        if (fd.personal.linkedin) linkedin = fd.personal.linkedin;
      }
      if (fd.skills && Array.isArray(fd.skills) && fd.skills.length > 0) {
        skills = fd.skills;
      }
    }

    return { name, title, email, phone, linkedin, skills, topBullet };
  }

  function generateCoverLetter(jdText, customCompany, customRole) {
    const candidate = getCandidateData();
    const company = customCompany || extractCompany(jdText);
    const role = customRole || extractRole(jdText, candidate.title);
    
    let matchedKeywords = [];
    if (window._atsScanResults && Array.isArray(window._atsScanResults.matched) && window._atsScanResults.matched.length > 0) {
      matchedKeywords = window._atsScanResults.matched.slice(0, 4);
    } else {
      matchedKeywords = candidate.skills.slice(0, 4);
    }

    const skillsString = matchedKeywords.length > 0 ? matchedKeywords.join(', ') : 'software engineering, scalable architecture, and iterative problem solving';
    
    const p1 = "Dear Hiring Team at " + company + ",\n\nI am writing to express my strong enthusiasm for the " + role + " position. With a strong foundation in " + skillsString + ", and a dedication to writing clean, maintainable, and high-performance solutions, I am eager to contribute directly to " + company + "'s core technical initiatives and engineering roadmap.";

    const proofSentence = candidate.topBullet
      ? "Throughout my recent projects, I have maintained a strong focus on measurable outcomes. For example, " + candidate.topBullet.charAt(0).toLowerCase() + candidate.topBullet.slice(1) + "."
      : "Throughout my work, I have consistently applied the Google XYZ framework to solve complex engineering bottlenecks—translating business requirements into scalable, thoroughly-tested software architectures.";

    const p2 = "My technical background aligns closely with the competencies highlighted in your job description. " + proofSentence + " Having built hands-on solutions leveraging " + skillsString + ", I understand how to design robust features that reduce friction, scale efficiently under high load, and deliver tangible end-user value.";

    const p3 = "I have attached my resume for your review and would welcome the opportunity to discuss how my technical skill set and disciplined execution can support your team's upcoming milestones. Thank you for your time and consideration—I look forward to the possibility of speaking with you soon.\n\nWarm regards,\n\n" + candidate.name + (candidate.phone ? "\n" + candidate.phone : "") + (candidate.email ? "\n" + candidate.email : "") + (candidate.linkedin ? "\n" + candidate.linkedin : "");

    return {
      company,
      role,
      candidate,
      fullText: p1 + "\n\n" + p2 + "\n\n" + p3,
      paragraphs: [p1, p2, p3]
    };
  }

  function generateRecruiterInMail(jdText, customCompany, customRole) {
    const candidate = getCandidateData();
    const company = customCompany || extractCompany(jdText);
    const role = customRole || extractRole(jdText, candidate.title);

    let topSkills = candidate.skills.slice(0, 3);
    if (window._atsScanResults && Array.isArray(window._atsScanResults.matched) && window._atsScanResults.matched.length > 0) {
      topSkills = window._atsScanResults.matched.slice(0, 3);
    }
    const skillPill = topSkills.join(' | ');

    const subject = "Application: " + role + " - " + candidate.name + " (" + topSkills.slice(0, 2).join(' / ') + ")";

    const achievementLine = candidate.topBullet
      ? candidate.topBullet.replace(/^[•\-\*]\s*/, '').slice(0, 110) + '...'
      : "Delivered high-performance features utilizing " + topSkills.join(', ') + ".";

    const body = "Hi [Hiring Manager/Recruiter],\n\nI noticed you are leading talent acquisition for the " + role + " opening at " + company + " and wanted to reach out directly.\n\nI bring proven, hands-on experience in " + skillPill + ":\n• " + achievementLine + "\n• Dedicated to clean architecture, fast release cycles, and measurable impact.\n\nI would love to learn more about the team's upcoming goals. Would you be open to a brief 5-minute introductory chat this week?\n\nBest regards,\n" + candidate.name + "\n" + (candidate.linkedin || candidate.email || '');

    return {
      subject,
      body,
      company,
      role
    };
  }

  return {
    extractCompany,
    extractRole,
    getCandidateData,
    generateCoverLetter,
    generateRecruiterInMail
  };

})();

window.CoverLetterEngine = CoverLetterEngine;
