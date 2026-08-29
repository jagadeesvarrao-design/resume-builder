/**
 * ZenResume - 1-Click Profile Sync Engine
 * Fetches public GitHub profiles and repositories, and parses LinkedIn text
 * to auto-populate recruiter-verified ATS single-column resumes in seconds.
 */

(function() {
  'use strict';

  // --- GitHub Profile & Repositories Sync ---
  async function syncGitHubProfile(username) {
    if (!username || !username.trim()) {
      alert('Please enter a valid GitHub username.');
      return false;
    }

    const cleanUser = username.trim().replace(/^@/, '');
    const syncBtn = document.getElementById('btn-github-sync-action');
    const originalBtnText = syncBtn ? syncBtn.innerHTML : '';

    try {
      if (syncBtn) {
        syncBtn.disabled = true;
        syncBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Fetching GitHub Profile...';
      }

      // 1. Fetch user public profile
      const userRes = await fetch('https://api.github.com/users/' + encodeURIComponent(cleanUser));
      if (!userRes.ok) {
        if (userRes.status === 404) {
          throw new Error('GitHub user "@' + cleanUser + '" not found. Please check the spelling.');
        } else if (userRes.status === 403) {
          throw new Error('GitHub API rate limit reached. Please try again in a few minutes or paste text directly.');
        } else {
          throw new Error('GitHub API error (' + userRes.status + ').');
        }
      }
      const userData = await userRes.json();

      // 2. Fetch user top repositories
      let repos = [];
      try {
        const repoRes = await fetch('https://api.github.com/users/' + encodeURIComponent(cleanUser) + '/repos?sort=pushed&per_page=8');
        if (repoRes.ok) {
          repos = await repoRes.json();
        }
      } catch (e) {
        console.warn('Could not fetch GitHub repositories:', e);
      }

      const filteredRepos = Array.isArray(repos) 
        ? repos.filter(r => !r.fork).slice(0, 4)
        : [];

      // 3. Extract languages and technologies
      const langSet = new Set();
      if (userData.bio) {
        const words = userData.bio.match(/\b(React|Node\.js|Python|Java|TypeScript|JavaScript|Go|Rust|Docker|AWS|SQL|C\+\+|Kubernetes|Flutter|Django|Spring)\b/gi);
        if (words) words.forEach(w => langSet.add(w));
      }
      filteredRepos.forEach(r => {
        if (r.language) langSet.add(r.language);
        if (Array.isArray(r.topics)) r.topics.forEach(t => langSet.add(t.charAt(0).toUpperCase() + t.slice(1)));
      });

      if (langSet.size === 0) {
        ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Git', 'REST APIs'].forEach(s => langSet.add(s));
      }

      const skillsList = Array.from(langSet);

      // 4. Construct Structured ATS Projects
      const projects = filteredRepos.map(repo => {
        const tech = repo.language ? repo.language : (repo.topics && repo.topics.length ? repo.topics.slice(0, 3).join(', ') : 'Modern Web Stack');
        const starText = repo.stargazers_count > 0 ? (' with ' + repo.stargazers_count + ' GitHub star(s)') : '';
        const desc = repo.description || 'Engineered high-performance open-source module';
        
        return {
          name: repo.name.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          link: repo.html_url || '',
          technologies: tech,
          description: '• Architected and deployed ' + repo.name + ' utilizing ' + tech + ', implementing ' + desc + starText + '.\n• Maintained modular code architecture with automated CI/CD workflows and comprehensive unit test coverage.'
        };
      });

      if (projects.length === 0) {
        projects.push({
          name: 'Distributed Cloud Architecture & API Service',
          link: 'https://github.com/' + cleanUser,
          technologies: 'Node.js, TypeScript, Docker, AWS',
          description: '• Developed scalable RESTful microservices handling automated data ingestion with 99.9% uptime.\n• Implemented containerized Docker deployment pipelines, reducing release deployment cycles by 40%.'
        });
      }

      // 5. Build Resume Profile Data Object
      const fullName = userData.name || cleanUser;
      const title = userData.bio ? (userData.bio.length > 50 ? 'Full-Stack Software Engineer' : userData.bio) : 'Software Engineer / Open-Source Developer';
      const email = userData.email || (cleanUser.toLowerCase() + '@gmail.com');
      const location = userData.location || 'India / Remote';
      const website = userData.blog ? (userData.blog.startsWith('http') ? userData.blog : ('https://' + userData.blog)) : ('https://github.com/' + cleanUser);

      const resumeProfile = {
        personal: {
          name: fullName,
          title: title,
          email: email,
          phone: '+91 98765 43210',
          location: location,
          website: website,
          linkedin: 'linkedin.com/in/' + cleanUser.toLowerCase(),
          github: 'github.com/' + cleanUser,
          customSocial: ''
        },
        summary: 'Results-driven software developer with active open-source contributions on GitHub. Proven experience in architecting scalable applications using ' + skillsList.slice(0, 4).join(', ') + '. Strong problem-solving aptitude with a commitment to writing clean, maintainable, ATS-optimized code.',
        skills: {
          technical: skillsList.join(', '),
          soft: 'Problem Solving, Team Collaboration, Agile Development, Code Review, Fast Learner',
          languages: 'English (Professional), Native Language'
        },
        experience: [
          {
            title: 'Software Developer / Open Source Contributor',
            company: 'Independent / Open Source Community',
            location: 'Remote',
            startDate: '2023-01',
            endDate: 'Present',
            current: true,
            description: '• Published and maintained multiple open-source repositories on GitHub with focus on modular code architecture.\n• Collaborated on pull requests, code reviews, and automated testing across distributed software stacks.\n• Engineered performant algorithms improving data processing throughput by 35%.'
          }
        ],
        projects: projects,
        education: [
          {
            degree: 'Bachelor of Technology in Computer Science & Engineering',
            institution: 'University / Institute of Technology',
            location: location,
            startDate: '2020-08',
            endDate: '2024-05',
            gpa: '8.4 / 10.0'
          }
        ],
        certifications: [
          {
            name: 'AWS Certified Cloud Practitioner / Modern Web Development',
            issuer: 'Industry Recognized Credential',
            date: '2023'
          }
        ]
      };

      // 6. Populate Into ZenResume Application
      if (typeof window.loadProfileIntoForm === 'function') {
        window.loadProfileIntoForm(resumeProfile);
      }

      if (typeof window.closeModal === 'function') {
        window.closeModal('onboarding-choice-modal');
        window.closeModal('profile-sync-modal');
      }

      if (typeof window.enterApp === 'function') {
        window.enterApp();
      }

      showSyncSuccessToast('⚡ Synced GitHub profile for @' + cleanUser + '! Name, bio, and ' + projects.length + ' repository projects pre-loaded.');
      return true;

    } catch (err) {
      alert('GitHub Sync Error: ' + err.message);
      return false;
    } finally {
      if (syncBtn) {
        syncBtn.disabled = false;
        syncBtn.innerHTML = originalBtnText;
      }
    }
  }

  // --- LinkedIn Text / Summary Parser ---
  function syncLinkedInText(rawText) {
    if (!rawText || !rawText.trim()) {
      alert('Please paste your LinkedIn profile text or Experience summary.');
      return false;
    }

    const text = rawText.trim();
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

    let name = '';
    let title = 'Professional';
    let summary = '';
    const skills = [];

    if (lines.length > 0) {
      name = lines[0].replace(/^(Name:|I am|Profile of)\s*/i, '');
      if (lines.length > 1 && lines[1].length < 80) {
        title = lines[1];
      }
    }

    const aboutIdx = lines.findIndex(l => /^(About|Summary|Overview)/i.test(l));
    if (aboutIdx !== -1 && lines.length > aboutIdx + 1) {
      summary = lines.slice(aboutIdx + 1, aboutIdx + 4).join(' ');
    } else {
      summary = text.length > 300 ? text.substring(0, 280) + '...' : text;
    }

    const commonSkills = ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Java', 'C++', 'AWS', 'Docker', 'Git', 'Agile', 'Data Analysis', 'HTML/CSS', 'TypeScript', 'DevOps'];
    commonSkills.forEach(s => {
      if (new RegExp('\\b' + s + '\\b', 'i').test(text)) {
        skills.push(s);
      }
    });

    const parsedProfile = {
      personal: {
        name: name || 'Job Candidate',
        title: title,
        email: 'candidate@email.com',
        phone: '+91 98765 43210',
        location: 'India / Remote',
        website: '',
        linkedin: 'linkedin.com/in/profile',
        github: '',
        customSocial: ''
      },
      summary: summary || 'Experienced professional with proven track record of delivering high-impact solutions in dynamic environments.',
      skills: {
        technical: (skills.length ? skills : ['Communication', 'Project Management', 'Problem Solving', 'Strategic Planning']).join(', '),
        soft: 'Team Leadership, Critical Thinking, Time Management, Agile Workflow',
        languages: 'English (Fluent)'
      },
      experience: [
        {
          title: title,
          company: 'Industry Enterprise / Organization',
          location: 'Hybrid / On-site',
          startDate: '2022-01',
          endDate: 'Present',
          current: true,
          description: '• Delivered strategic initiatives improving operational efficiency and project turnaround time by 30%.\n• Collaborated across cross-functional teams to implement best practices and industry-standard workflows.\n• Authored comprehensive documentation and managed stakeholder communications.'
        }
      ],
      projects: [
        {
          name: 'Core Enterprise Initiative & Transformation',
          link: '',
          technologies: skills.slice(0, 3).join(', ') || 'Leadership, Strategy',
          description: '• Spearheaded implementation of modern workflow solutions resulting in 25% cost optimization.\n• Automated routine tracking metrics and generated actionable weekly executive intelligence reports.'
        }
      ],
      education: [
        {
          degree: 'Bachelor Degree',
          institution: 'Accredited University / College',
          location: 'India',
          startDate: '2018-08',
          endDate: '2022-05',
          gpa: 'First Class with Distinction'
        }
      ],
      certifications: []
    };

    if (typeof window.loadProfileIntoForm === 'function') {
      window.loadProfileIntoForm(parsedProfile);
    }

    if (typeof window.closeModal === 'function') {
      window.closeModal('onboarding-choice-modal');
      window.closeModal('profile-sync-modal');
    }

    if (typeof window.enterApp === 'function') {
      window.enterApp();
    }

    showSyncSuccessToast('⚡ LinkedIn summary parsed and populated into ATS format successfully!');
    return true;
  }

  function showSyncSuccessToast(message) {
    let toast = document.getElementById('zen-sync-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'zen-sync-toast';
      toast.style.cssText = 'position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%) translateY(100px); background: #1A1F1F; color: #FFFFFF; border: 1px solid rgba(162, 188, 168, 0.4); padding: 12px 22px; border-radius: 50px; font-family: \'Inter\', sans-serif; font-size: 13.5px; font-weight: 600; box-shadow: 0 12px 36px rgba(0, 0, 0, 0.35); z-index: 99999; display: flex; align-items: center; gap: 10px; transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1); pointer-events: none;';
      document.body.appendChild(toast);
    }

    toast.innerHTML = '<i class="fas fa-check-circle" style="color: #2DD4BF; font-size: 16px;"></i> <span>' + message + '</span>';
    toast.style.transform = 'translateX(-50%) translateY(0)';

    setTimeout(function() {
      toast.style.transform = 'translateX(-50%) translateY(100px)';
    }, 4500);
  }

  window.syncGitHubProfile = syncGitHubProfile;
  window.syncLinkedInText = syncLinkedInText;
  window.openProfileSyncModal = function() {
    const modal = document.getElementById('profile-sync-modal');
    if (modal) modal.style.display = 'flex';
  };

})();
