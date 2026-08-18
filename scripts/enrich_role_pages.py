import os
import json
import re

# Comprehensive Master SEO Matrix for all 63 roles
ROLE_DATA = {
    "software-engineer-resume": {
        "title": "Software Engineer",
        "category": "Technology & Software",
        "tools": ["React", "Node.js", "Python", "Docker", "Kubernetes", "PostgreSQL", "AWS / GCP", "Git & GitHub", "REST / GraphQL APIs", "CI/CD Pipelines"],
        "competencies": ["Distributed Systems", "Full-Stack Development", "System Architecture", "Microservices", "Agile / Scrum", "Test-Driven Development (TDD)", "Algorithm Optimization"],
        "bullets": [
            "Architected and deployed a microservices-based payment gateway using Node.js and Docker, processing 1.2M daily transactions with 99.98% uptime.",
            "Reduced API response latency by 42% across 15 core endpoints by implementing Redis caching and optimizing PostgreSQL indexing strategies.",
            "Led a cross-functional team of 6 engineers to migrate legacy monolith architecture to AWS Kubernetes (EKS), slashing cloud hosting costs by $35,000/year."
        ],
        "faq": [
            ("What are the essential skills for a Software Engineer resume in 2026?", "Top Software Engineer resumes highlight proficiency in modern languages (Python, TypeScript, Go, Java), cloud platforms (AWS, Azure, GCP), containerization (Docker, Kubernetes), and CI/CD automation."),
            ("How do I show impact on a Software Engineering resume?", "Use quantifiable engineering metrics: latency reduction (%), throughput (RPS), uptime (99.9%), cloud cost savings ($), and user scale (DAU/MAU).")
        ],
        "template": "grid"
    },
    "data-engineer-resume": {
        "title": "Data Engineer",
        "category": "Data & Analytics",
        "tools": ["Apache Spark", "Airflow", "Snowflake", "SQL", "dbt", "Kafka", "AWS Redshift", "Python / PySpark", "Databricks", "BigQuery"],
        "competencies": ["ETL / ELT Pipeline Design", "Data Warehousing", "Stream Processing", "Data Modeling & Governance", "Database Optimization", "Data Lake Architecture"],
        "bullets": [
            "Designed and automated end-to-end ETL data pipelines using Apache Spark and Airflow, ingesting 4TB+ of daily streaming event data with zero data loss.",
            "Migrated on-premise relational data warehouse to Snowflake and dbt, reducing nightly batch query processing times from 6.5 hours to 45 minutes.",
            "Implemented data quality validation suites using Great Expectations, catching 99.4% of upstream schema drift before reaching production analytics dashboards."
        ],
        "faq": [
            ("What tools should be on a 2026 Data Engineer resume?", "Recruiters and ATS scanners look for modern data stack tools: Apache Spark, Airflow, Snowflake, dbt, Kafka, SQL, Python, and cloud data warehouses (BigQuery/Redshift)."),
            ("How do Data Engineers quantify resume achievements?", "Focus on data volume (TB/PB processed), pipeline runtime reductions, query latency improvements, and uptime percentages.")
        ],
        "template": "grid"
    },
    "frontend-developer-resume": {
        "title": "Frontend Developer",
        "category": "Technology & Software",
        "tools": ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vue.js", "Webpack / Vite", "Redux Toolkit", "GraphQL", "Figma", "Jest & Cypress"],
        "competencies": ["Responsive Web Design", "Web Performance Optimization (Core Web Vitals)", "Single Page Applications (SPA)", "Cross-Browser Compatibility", "Accessibility (WCAG 2.1)", "State Management"],
        "bullets": [
            "Engineered high-performance web applications using Next.js and TypeScript, improving Google Core Web Vitals (LCP) from 3.8s to 1.1s and boosting conversion by 18%.",
            "Built a modular, accessible UI component library in React and Tailwind CSS adopted across 4 product teams, cutting feature development cycle time by 30%.",
            "Integrated complex client-side state management using Redux Toolkit and GraphQL queries, reducing redundant API roundtrips by 45%."
        ],
        "faq": [
            ("What makes a strong Frontend Developer resume in 2026?", "Highlight modern frontend frameworks (React, Next.js, Vue), TypeScript proficiency, Core Web Vitals optimization, and live demo links/GitHub repositories."),
            ("How can a Frontend Developer stand out to recruiters?", "Showcase measurable user-experience metrics: page load speed improvements, lighthouse scores, accessibility compliance, and mobile responsive engagement.")
        ],
        "template": "modern"
    },
    "backend-developer-resume": {
        "title": "Backend Developer",
        "category": "Technology & Software",
        "tools": ["Node.js / Express", "Go (Golang)", "Python (Django/FastAPI)", "PostgreSQL", "MongoDB", "Redis", "Docker", "RabbitMQ / Kafka", "GraphQL / gRPC", "AWS"],
        "competencies": ["RESTful & gRPC API Design", "Database Sharding & Indexing", "Authentication & JWT/OAuth2", "Microservices Architecture", "Caching Strategies", "Scalability & Load Balancing"],
        "bullets": [
            "Engineered resilient backend REST and gRPC microservices in Go and Node.js, handling 18,000 requests per second at peak traffic with sub-50ms latency.",
            "Designed and partitioned PostgreSQL relational databases with Redis caching layers, scaling active user capacity from 50k to 500k without infrastructure overhead.",
            "Secured API endpoints implementing OAuth 2.0, role-based access control (RBAC), and rate limiting, preventing DDoS vulnerabilities and zero unauthorized breaches."
        ],
        "faq": [
            ("What keywords do ATS scanners seek on Backend Developer resumes?", "High-ranking keywords include: API Design, Microservices, SQL/NoSQL Databases, Caching (Redis), Message Queues (Kafka/RabbitMQ), and Cloud Infrastructure (AWS/Docker)."),
            ("Should Backend Developers include database optimization metrics?", "Yes! Highlight query execution time reductions, TPS (transactions per second), and database scalability milestones.")
        ],
        "template": "grid"
    },
    "ai-engineer-resume": {
        "title": "AI Engineer",
        "category": "Artificial Intelligence & ML",
        "tools": ["PyTorch", "TensorFlow", "LangChain / LlamaIndex", "Hugging Face", "OpenAI / Gemini API", "Python", "Vector Databases (Pinecone/Chroma)", "vLLM", "CUDA", "FastAPI"],
        "competencies": ["Large Language Models (LLM)", "RAG (Retrieval-Augmented Generation)", "Fine-Tuning (LoRA / QLoRA)", "Model Quantization & Inference", "Computer Vision", "NLP Pipelines"],
        "bullets": [
            "Developed an enterprise Retrieval-Augmented Generation (RAG) agent using LangChain and Pinecone, improving document retrieval accuracy to 94.2% across 2M+ records.",
            "Fine-tuned open-source LLMs (Llama 3, Mistral) using QLoRA for domain-specific customer support tasks, cutting proprietary API operational costs by 68%.",
            "Optimized deep learning model inference using vLLM and TensorRT-LLM on NVIDIA GPUs, tripling token throughput from 35 tok/s to 110 tok/s."
        ],
        "faq": [
            ("What should an AI Engineer highlight on a resume in 2026?", "Feature hands-on experience with LLM orchestration (LangChain/LlamaIndex), vector databases, model fine-tuning, RAG pipelines, and PyTorch production deployment."),
            ("How do I demonstrate practical AI engineering impact?", "Quantify model accuracy (F1 score/BLEU), latency (ms/token), API cost reductions (%), and data throughput.")
        ],
        "template": "grid"
    },
    "cloud-engineer-resume": {
        "title": "Cloud Engineer",
        "category": "Cloud & Infrastructure",
        "tools": ["AWS", "Azure", "GCP", "Terraform", "Kubernetes", "Ansible", "Docker", "Prometheus & Grafana", "Linux / Bash", "CloudFormation"],
        "competencies": ["Infrastructure as Code (IaC)", "Multi-Cloud Architecture", "Cost Optimization (FinOps)", "Cloud Security & IAM", "High Availability & Disaster Recovery", "Serverless Computing"],
        "bullets": [
            "Automated multi-region cloud infrastructure provisioning using Terraform and AWS CloudFormation, reducing environment deployment times from 4 days to 25 minutes.",
            "Executed comprehensive FinOps cloud cost audits across 120 AWS accounts, identifying idle compute resources and slashing monthly spend by $42,000 (31%).",
            "Designed automated disaster recovery (DR) failover systems with automated RPO < 5 mins and RTO < 15 mins across hybrid cloud environments."
        ],
        "faq": [
            ("What certifications matter most for a Cloud Engineer resume?", "AWS Certified Solutions Architect, Azure Solutions Architect Expert, and Google Cloud Professional Cloud Architect are industry gold standards."),
            ("How to format a Cloud Engineer resume for ATS systems?", "Include specific cloud services (AWS EC2, S3, IAM, VPC, EKS), Terraform IaC experience, and measurable cloud cost savings.")
        ],
        "template": "grid"
    },
    "devops-engineer-resume": {
        "title": "DevOps Engineer",
        "category": "Cloud & Infrastructure",
        "tools": ["Kubernetes", "Docker", "Jenkins / GitHub Actions", "Terraform", "ArgoCD", "Prometheus & Grafana", "Linux", "Helm", "GitLab CI", "AWS"],
        "competencies": ["GitOps & CI/CD Pipelines", "Container Orchestration", "Site Reliability & Monitoring", "Automated Testing Integration", "Release Management", "Zero-Downtime Deployments"],
        "bullets": [
            "Built automated end-to-end CI/CD release pipelines using GitHub Actions and ArgoCD, accelerating software deployment frequency from bi-weekly to 14+ daily deploys.",
            "Managed production Kubernetes clusters across 80+ nodes with zero unplanned downtime and 99.99% service availability over 18 consecutive months.",
            "Implemented centralized observability and alerting with Prometheus, Grafana, and Alertmanager, decreasing Mean Time to Detection (MTTD) by 55%."
        ],
        "faq": [
            ("What are key keywords for a DevOps Engineer resume?", "Essential keywords include CI/CD, Kubernetes, Docker, Terraform, ArgoCD, Helm, GitOps, Monitoring, and Zero-Downtime Deployment."),
            ("How do I quantify DevOps impact?", "Highlight deployment frequency, Mean Time to Recovery (MTTR), rollback rate reductions, and build time optimizations.")
        ],
        "template": "grid"
    },
    "cybersecurity-analyst-resume": {
        "title": "Cybersecurity Analyst",
        "category": "Security & IT",
        "tools": ["SIEM (Splunk / QRadar)", "Wireshark", "Nessus", "CrowdStrike Falcon", "Metasploit", "Python / Bash", "Burp Suite", "Firewalls / IDS / IPS", "MITRE ATT&CK", "Kali Linux"],
        "competencies": ["Incident Response & Triage", "Vulnerability Assessment", "Threat Hunting", "SOC Monitoring", "Network Traffic Analysis", "Security Compliance (ISO 27001 / SOC 2 / GDPR)"],
        "bullets": [
            "Monitored and triaged 5,000+ daily security alerts in Splunk SIEM, identifying and neutralizing 14 critical advanced persistent threat (APT) intrusion attempts.",
            "Conducted quarterly vulnerability scans across 450 corporate endpoints using Nessus, partnering with DevOps to remediate 98% of high-severity CVEs within SLA.",
            "Led incident response drills and automated SOAR containment playbooks, slashing incident containment time (MTTC) from 120 minutes to 18 minutes."
        ],
        "faq": [
            ("What certifications help a Cybersecurity resume rank higher?", "CompTIA Security+, CEH, CISSP, and GIAC certifications dramatically boost recruiter visibility and ATS match rates."),
            ("What should be on a Cybersecurity Analyst resume?", "Specify your SIEM tools (Splunk, Sentinel), vulnerability scanners (Nessus), compliance frameworks (NIST, SOC 2), and incident mitigation metrics.")
        ],
        "template": "executive"
    },
    "data-scientist-resume": {
        "title": "Data Scientist",
        "category": "Data & Analytics",
        "tools": ["Python (NumPy/Pandas/Scikit-Learn)", "SQL", "R", "Tableau / Power BI", "XGBoost", "TensorFlow", "Jupyter", "A/B Testing", "Spark", "AWS SageMaker"],
        "competencies": ["Machine Learning Modeling", "Predictive Analytics", "Statistical Hypothesis Testing", "Feature Engineering", "Data Storytelling & Visualization", "Customer Lifetime Value (CLV)"],
        "bullets": [
            "Developed and deployed an end-to-end customer churn prediction model using XGBoost, identifying at-risk accounts with 89% precision and retaining $1.4M in annual ARR.",
            "Designed and evaluated 40+ rigorous A/B experiments on pricing and landing page funnels, delivering an incremental 6.8% lift in checkout conversion.",
            "Created automated executive KPI dashboards in Tableau and SQL, delivering actionable business insights that reduced supply chain turnaround times by 14%."
        ],
        "faq": [
            ("How to structure a Data Scientist resume in 2026?", "Balance statistical modeling, machine learning frameworks, data wrangling, and direct business ROI (revenue gained, churn reduced)."),
            ("What are the best keywords for Data Scientist ATS scans?", "Feature Engineering, Predictive Modeling, A/B Testing, Machine Learning, Python, Scikit-Learn, SQL, and Business Impact.")
        ],
        "template": "grid"
    },
    "senior-software-developer-resume": {
        "title": "Senior Software Developer",
        "category": "Technology & Software",
        "tools": ["Java / Spring Boot", "TypeScript / React", "Go", "PostgreSQL", "Kafka", "Docker & Kubernetes", "AWS", "GraphQL", "Redis", "Git"],
        "competencies": ["Technical Leadership & Mentorship", "System Architecture & Scalability", "Code Reviews & Engineering Standards", "High-Concurrency Systems", "Cross-Team Collaboration"],
        "bullets": [
            "Spearheaded the technical architecture and redesign of a high-throughput SaaS platform, scaling concurrent user capacity by 400% while maintaining sub-80ms p99 latency.",
            "Mentored and leveled up 8 mid-level and junior developers, conducting bi-weekly code review workshops and establishing automated unit test coverage standards (>90%).",
            "Designed event-driven streaming architecture with Apache Kafka and Spring Boot, reducing cross-service communication delays by 60%."
        ],
        "faq": [
            ("What separates a Senior Developer resume from a Junior Developer resume?", "Senior resumes focus on system architecture, engineering trade-offs, team mentorship, and organizational business impact rather than just ticket execution."),
            ("How long should a Senior Software Developer resume be?", "A focused 1-page to maximum 2-page resume highlighting the last 5–8 years of major technical accomplishments.")
        ],
        "template": "executive"
    },
    "product-manager-resume": {
        "title": "Product Manager",
        "category": "Management & Leadership",
        "tools": ["Jira", "Figma", "Mixpanel / Amplitude", "SQL", "Google Analytics", "Notion", "Postman", "Tableau", "UserTesting", "A/B Testing Tools"],
        "competencies": ["Product Strategy & Roadmap", "User Research & PRD Writing", "Go-To-Market (GTM) Strategy", "Agile Product Ownership", "Data-Driven Prioritization", "Stakeholder Alignment"],
        "bullets": [
            "Led product strategy and discovery for a core mobile onboarding overhaul, increasing 30-day user retention by 24% and generating $850k in new subscription ARR.",
            "Authored 30+ comprehensive Product Requirement Documents (PRDs) and partnered with 14 engineers and designers to deliver 5 major product features on time.",
            "Conducted 50+ user interviews and analyzed in-app telemetry in Amplitude to eliminate checkout friction, increasing checkout completion rates by 16%."
        ],
        "faq": [
            ("What do recruiters look for on a Product Manager resume?", "Clear evidence of product outcome ownership: user growth, conversion lift, retention metrics, and successful cross-functional leadership."),
            ("Should Product Managers include technical skills?", "Yes! Mentioning SQL, API understanding, analytics tools (Mixpanel/Amplitude), and UX frameworks boosts credibility.")
        ],
        "template": "executive"
    },
    "ui-ux-designer-resume": {
        "title": "UI/UX Designer",
        "category": "Design & Creative",
        "tools": ["Figma", "Adobe XD", "Sketch", "Protopie", "Framer", "Illustrator", "Miro", "Design Systems", "UsabilityHub", "HTML/CSS Basics"],
        "competencies": ["Wireframing & Prototyping", "User Journey Mapping", "Usability Testing & User Research", "Responsive Design Systems", "Information Architecture", "Micro-Interactions"],
        "bullets": [
            "Redesigned the core SaaS dashboard in Figma with an accessible design system, decreasing user task completion time by 38% and winning internal UX excellence awards.",
            "Conducted 25 remote usability testing sessions and translated qualitative feedback into high-fidelity interactive prototypes that boosted activation rates by 22%.",
            "Created and maintained a 150+ component design system in Figma adopted by 12 cross-functional product designers and 30 frontend developers."
        ],
        "faq": [
            ("How to format a UI/UX Designer resume for ATS software?", "Keep the text clean and single-column so ATS parsers read your content, and always include a clickable link to your online portfolio (Figma / Behance / Web)."),
            ("What metrics should a UI/UX Designer include?", "Mention usability test score improvements, task completion time reductions, conversion rate lifts, and design system adoption.")
        ],
        "template": "modern"
    }
}

# Generic fallback builder for other 51 roles to guarantee unique domain-specific keywords
DEFAULT_TEMPLATES_BY_CATEGORY = {
    "Engineering": ("grid", ["AutoCAD", "MATLAB", "SolidWorks", "Project Management", "Quality Assurance", "Root Cause Analysis", "Lean Six Sigma", "Safety Standards"]),
    "Finance": ("executive", ["Financial Modeling", "Excel (VBA/Macros)", "QuickBooks", "SAP / Oracle ERP", "GAAP Compliance", "Budget Forecasting", "Variance Analysis", "Tax Planning"]),
    "Healthcare": ("classic", ["Patient Care", "EMR / EHR Systems", "HIPAA Compliance", "Clinical Assessment", "Vital Signs Monitoring", "Treatment Planning", "CPR / BLS Certified"]),
    "Marketing": ("modern", ["SEO / SEM", "Google Analytics 4", "Meta Ads Manager", "Content Strategy", "Email Marketing (HubSpot)", "A/B Testing", "Copywriting", "Campaign ROI"]),
    "Education": ("academic", ["Curriculum Development", "Classroom Management", "Lesson Planning", "Student Assessment", "Differentiated Instruction", "EdTech Tools", "Parent Communication"]),
    "Business": ("executive", ["Strategic Planning", "KPI Tracking", "Stakeholder Management", "Operations Management", "Contract Negotiation", "Cross-Functional Leadership", "CRM Systems (Salesforce)"])
}

def generate_role_data_if_missing(role_slug):
    title = " ".join([word.capitalize() for word in role_slug.replace("-resume", "").split("-")])
    
    # Categorize
    cat = "Business"
    if any(k in role_slug for k in ["engineer", "developer", "architect", "draftsman"]):
        cat = "Engineering"
    elif any(k in role_slug for k in ["finance", "account", "banker", "auditor", "bookkeeper", "tax", "officer"]):
        cat = "Finance"
    elif any(k in role_slug for k in ["health", "nurse", "medical", "pharm", "therapist", "dental", "clinical"]):
        cat = "Healthcare"
    elif any(k in role_slug for k in ["market", "content", "copywriter", "social", "seo", "relations", "animator", "director", "editor"]):
        cat = "Marketing"
    elif any(k in role_slug for k in ["teacher", "professor", "education", "counselor", "instructional", "tutor"]):
        cat = "Education"

    template, tools = DEFAULT_TEMPLATES_BY_CATEGORY[cat]
    
    return {
        "title": title,
        "category": f"{cat} & Professional",
        "tools": tools,
        "competencies": ["Strategic Planning", "Problem Solving", "Quality Control", "Compliance & Reporting", "Team Leadership", "Data Analysis"],
        "bullets": [
            f"Managed key operational initiatives as a {title}, exceeding annual performance objectives by 22% through structured process optimization.",
            f"Reduced turnaround time on core deliverable workflows by 35% by implementing automated tracking tools and standardized operating procedures.",
            f"Partnered with cross-functional leadership teams to deliver 10+ high-impact projects on schedule and 12% under allocated budget constraints."
        ],
        "faq": [
            (f"What is the best resume format for a {title} in 2026?", f"The recommended format for a {title} is a clean, single-column reverse-chronological layout with prominent skills, quantifiable accomplishments, and ATS-compliant headings."),
            (f"How long should a {title} resume be?", "A 1-page resume is optimal for professionals with under 7 years of experience. Keep bullet points concise and results-driven.")
        ],
        "template": template
    }

def get_role_details(slug):
    if slug in ROLE_DATA:
        return ROLE_DATA[slug]
    return generate_role_data_if_missing(slug)

def build_role_page_html(slug, data, all_roles):
    title = data["title"]
    category = data["category"]
    tools = data["tools"]
    competencies = data["competencies"]
    bullets = data["bullets"]
    faq = data["faq"]
    template = data["template"]

    # Select 4 related roles from same category or list
    related_slugs = [s for s in all_roles if s != slug][:4]

    faq_json_entities = []
    for q, a in faq:
        faq_json_entities.append(f"""      {{
        "@type": "Question",
        "name": "{q}",
        "acceptedAnswer": {{
          "@type": "Answer",
          "text": "{a}"
        }}
      }}""")
    
    faq_json_str = ",\n".join(faq_json_entities)

    tools_chips = "".join([f'<span class="role-keyword-chip tool-chip"><i class="fas fa-check"></i> {t}</span>' for t in tools])
    comp_chips = "".join([f'<span class="role-keyword-chip comp-chip"><i class="fas fa-star"></i> {c}</span>' for c in competencies])
    
    bullets_html = "".join([f'''
      <div class="role-bullet-card">
        <div class="bullet-badge"><i class="fas fa-chart-line"></i> XYZ Formula Example</div>
        <p class="bullet-text">"{b}"</p>
      </div>''' for b in bullets])

    faq_html = "".join([f'''
      <div class="role-faq-item">
        <h3 class="role-faq-question"><i class="fas fa-circle-question" style="color: #006856; margin-right: 8px;"></i> {q}</h3>
        <p class="role-faq-answer">{a}</p>
      </div>''' for q, a in faq])

    related_cards = ""
    for r_slug in related_slugs:
        r_title = " ".join([w.capitalize() for w in r_slug.replace("-resume", "").split("-")])
        related_cards += f'''
          <a href="/role/{r_slug}.html" class="related-role-card">
            <div class="related-role-icon"><i class="fas fa-file-invoice"></i></div>
            <div class="related-role-info">
              <span class="related-role-title">{r_title}</span>
              <span class="related-role-action">View Template &rarr;</span>
            </div>
          </a>'''

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta name="google-adsense-account" content="ca-pub-1993051486567311">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1993051486567311" crossorigin="anonymous"></script>
  <script>
    (function() {{
      const theme = localStorage.getItem('theme') || 'light';
      document.documentElement.setAttribute('data-theme', theme);
    }})();
  </script>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title} Resume Format [2026 ATS Template + Free PDF] | ZenResume</title>
  <meta name="description" content="Free ATS-compliant {title} resume format & examples for 2026. Recruiter-approved skills, measurable impact bullet points, and instant vector PDF download.">
  <link rel="canonical" href="https://www.zenresume.online/role/{slug}.html">
  
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;600;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../styles.css">

  <!-- Schema.org FAQPage for Google Rich Snippets -->
  <script type="application/ld+json">
  {{
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
{faq_json_str}
    ]
  }}
  </script>
  <script src="/lazy-load.js" defer></script>
  <meta property="og:image" content="https://www.zenresume.online/og-image.png">
  <meta name="twitter:image" content="https://www.zenresume.online/og-image.png">

  <style>
    .role-keyword-grid {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin: 24px 0;
    }}
    .role-keyword-box {{
      background: rgba(0, 104, 86, 0.03);
      border: 1.5px solid rgba(0, 104, 86, 0.15);
      border-radius: 14px;
      padding: 20px;
    }}
    .role-keyword-title {{
      font-size: 14px;
      font-weight: 800;
      color: #006856;
      font-family: 'Outfit', sans-serif;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
    }}
    .role-chips-wrap {{
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }}
    .role-keyword-chip {{
      font-size: 12px;
      font-weight: 600;
      padding: 5px 10px;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }}
    .tool-chip {{
      background: rgba(0, 104, 86, 0.1);
      color: #006856;
      border: 1px solid rgba(0, 104, 86, 0.2);
    }}
    .comp-chip {{
      background: rgba(52, 152, 219, 0.1);
      color: #2980b9;
      border: 1px solid rgba(52, 152, 219, 0.2);
    }}
    .role-bullet-card {{
      background: #FFFFFF;
      border: 1px solid rgba(0, 0, 0, 0.08);
      border-left: 4px solid #006856;
      border-radius: 10px;
      padding: 16px;
      margin-bottom: 14px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.03);
    }}
    [data-theme="dark"] .role-bullet-card {{
      background: #1e2625;
      border-color: #2e3b38;
      border-left-color: #82F7D8;
    }}
    .bullet-badge {{
      font-size: 11px;
      font-weight: 800;
      color: #006856;
      text-transform: uppercase;
      margin-bottom: 6px;
    }}
    [data-theme="dark"] .bullet-badge {{
      color: #82F7D8;
    }}
    .bullet-text {{
      font-size: 14px;
      color: var(--text-main);
      line-height: 1.55;
      margin: 0;
    }}
    .role-faq-item {{
      background: rgba(0, 104, 86, 0.02);
      border: 1px solid var(--border-glass);
      border-radius: 12px;
      padding: 18px;
      margin-bottom: 14px;
    }}
    .role-faq-question {{
      margin: 0 0 8px 0;
      font-size: 16px;
      font-weight: 700;
      color: var(--text-main);
    }}
    .role-faq-answer {{
      margin: 0;
      font-size: 14px;
      color: var(--text-sub);
      line-height: 1.6;
    }}
    @media (max-width: 650px) {{
      .role-keyword-grid {{
        grid-template-columns: 1fr;
      }}
    }}
  </style>
</head>
<body>
  
  <!-- Global Top Header -->
  <header style="width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 15px 30px; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(74, 107, 98, 0.1); position: sticky; top: 0; z-index: 100;">
    <a href="/" style="display: flex; align-items: center; gap: 10px; text-decoration: none; cursor: pointer;">
      <div style="background: linear-gradient(135deg, var(--primary-calm), var(--primary-light)); width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-family: 'Outfit', sans-serif;">Z</div>
      <span style="font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 20px; color: var(--primary-dark); letter-spacing: -0.5px;">ZenResume</span>
    </a>
    
    <div style="display: flex; gap: 20px; align-items: center;">
      <a href="/" style="font-size: 14px; font-weight: 600; color: var(--text-main); text-decoration: none;">App</a>
      <a href="/role/" style="font-size: 14px; font-weight: 600; color: var(--primary-calm); text-decoration: none;">All Roles</a>
      <a href="/blog/" style="font-size: 14px; font-weight: 600; color: var(--text-main); text-decoration: none;">Resources</a>
      <button id="btn-theme-toggle" class="btn-theme-toggle" aria-label="Toggle Theme" style="background: none; border: none; cursor: pointer; color: var(--text-main); font-size: 16px; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
        <i class="fas fa-moon"></i>
      </button>
    </div>
  </header>

  <div class="app-container" style="max-width: 840px; padding-top: 50px; padding-bottom: 60px;">
    
    <article style="background: var(--bg-card); padding: 40px; border-radius: var(--radius-lg); border: 1px solid var(--border-glass); box-shadow: var(--shadow-peaceful);">
      
      <!-- Article Header -->
      <div style="margin-bottom: 25px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
          <span style="font-size: 11px; background: rgba(0, 104, 86, 0.1); color: #006856; font-weight: 800; padding: 3px 8px; border-radius: 4px; text-transform: uppercase;">2026 ATS FORMAT</span>
          <span style="font-size: 12px; color: var(--text-sub); font-weight: 600;">• {category}</span>
        </div>
        <h1 style="font-size: 34px; color: var(--primary-dark); font-weight: 800; margin-bottom: 12px; line-height: 1.25; font-family: 'Outfit', sans-serif;">
          The Best {title} Resume Format for 2026
        </h1>
        <p style="font-size: 15.5px; color: var(--text-sub); line-height: 1.6;">
          Targeting a <strong>{title}</strong> position? Learn how to pass Applicant Tracking Systems (ATS) with role-tested keywords, quantifiable achievements, and a 1-click editable template.
        </p>
      </div>

      <!-- High-Conversion 1-Click Launch Callout -->
      <div style="margin: 30px 0; padding: 26px; background: linear-gradient(135deg, rgba(0, 104, 86, 0.08), rgba(88, 214, 141, 0.12)); border-radius: 14px; text-align: center; border: 1.5px solid rgba(0, 104, 86, 0.25);">
        <h3 style="font-size: 20px; color: #006856; font-weight: 800; margin-bottom: 8px; font-family: 'Outfit', sans-serif;">
          Build Your {title} Resume in 30 Seconds
        </h3>
        <p style="font-size: 13.5px; color: var(--text-main); margin-bottom: 18px; max-width: 540px; margin-left: auto; margin-right: auto;">
          Open our free builder with <strong>{title}</strong> skills, layout, and achievements pre-loaded. 100% free vector PDF export with zero account needed.
        </p>
        <a href="/?role={slug}" class="btn-primary" style="display: inline-flex; align-items: center; gap: 8px; text-decoration: none; padding: 13px 26px; font-size: 14.5px; font-weight: 700; border-radius: 9999px; box-shadow: 0 4px 15px rgba(0, 104, 86, 0.3);">
          <i class="fas fa-rocket"></i> Launch {title} Template in Editor &rarr;
        </a>
      </div>

      <div class="blog-content" style="line-height: 1.7; font-size: 15.5px; color: var(--text-main);">
        
        <h2 style="font-size: 22px; color: var(--primary-dark); margin: 30px 0 10px 0; font-family: 'Outfit', sans-serif;">
          1. Essential ATS Keywords &amp; Core Competencies
        </h2>
        <p>
          Recruiter screening software searches your resume for specific technical tools and industry terminology before a human ever reviews it. Include these verified <strong>{title}</strong> keywords:
        </p>

        <!-- 2-Column Keywords Matrix -->
        <div class="role-keyword-grid">
          <div class="role-keyword-box">
            <div class="role-keyword-title"><i class="fas fa-toolbox"></i> Tools &amp; Technologies</div>
            <div class="role-chips-wrap">
              {tools_chips}
            </div>
          </div>
          <div class="role-keyword-box">
            <div class="role-keyword-title"><i class="fas fa-brain"></i> Core Competencies</div>
            <div class="role-chips-wrap">
              {comp_chips}
            </div>
          </div>
        </div>

        <h2 style="font-size: 22px; color: var(--primary-dark); margin: 35px 0 10px 0; font-family: 'Outfit', sans-serif;">
          2. High-Impact {title} Bullet Point Examples
        </h2>
        <p>
          Hiring managers look for concrete business impact. Structure your bullet points using the <strong>Google XYZ Formula</strong>: <em>Accomplished [X] as measured by [Y], by doing [Z].</em>
        </p>

        <!-- Dynamic Role-Specific Bullet Cards -->
        <div style="margin: 20px 0;">
          {bullets_html}
        </div>

        <h2 style="font-size: 22px; color: var(--primary-dark); margin: 35px 0 10px 0; font-family: 'Outfit', sans-serif;">
          3. ATS Formatting Rules for {title}
        </h2>
        <ul style="margin-left: 20px; margin-bottom: 25px; line-height: 1.8;">
          <li><strong>Single-Column Hierarchy:</strong> Keep headers standard (<em>Work Experience, Skills, Education</em>) so automated parsers read in chronological order.</li>
          <li><strong>Quantifiable Metrics:</strong> Include percentages, dollar values, or scale numbers in at least 70% of your experience bullets.</li>
          <li><strong>Pure Vector Export:</strong> Export your resume as a clean selectable-text PDF rather than a scanned image to ensure 100% keyword indexing.</li>
        </ul>

        <h2 style="font-size: 22px; color: var(--primary-dark); margin: 35px 0 10px 0; font-family: 'Outfit', sans-serif;">
          Frequently Asked Questions
        </h2>
        
        {faq_html}

      </div>

      <!-- Related Role Templates Silo (SEO & Navigation) -->
      <div class="related-roles-section" style="margin-top: 40px;">
        <h3 class="related-roles-heading"><i class="fas fa-layer-group" style="color: #006856;"></i> Related 2026 Resume Templates</h3>
        <p class="related-roles-sub">Explore tailored ATS templates for related job titles and career paths:</p>
        <div class="related-roles-grid">
          {related_cards}
        </div>
      </div>

    </article>
  </div>

  <footer style="margin-top: 60px; text-align: center; padding: 40px 20px; border-top: 1px solid var(--border-glass);">
    <div style="font-size: 13px; color: var(--text-light); margin-bottom: 10px;">
      <a href="/" style="color: inherit; text-decoration: none; margin: 0 10px;">App</a>
      <a href="/role/" style="color: inherit; text-decoration: none; margin: 0 10px;">All Roles</a>
      <a href="/blog/" style="color: inherit; text-decoration: none; margin: 0 10px;">Blog</a>
      <a href="/about.html" style="color: inherit; text-decoration: none; margin: 0 10px;">About</a>
      <a href="/privacy.html" style="color: inherit; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
      <a href="/terms.html" style="color: inherit; text-decoration: none; margin: 0 10px;">Terms</a>
    </div>
    <div style="font-size: 12px; color: var(--text-light);">
      &copy; 2026 ZenResume. All rights reserved.
    </div>
  </footer>

  <script>
    const btn = document.getElementById('btn-theme-toggle');
    if (btn) {{
      const icon = btn.querySelector('i');
      const updateIcon = (theme) => {{
        if (theme === 'dark') {{
          icon.className = 'fas fa-sun';
          icon.style.color = '#F59E0B';
        }} else {{
          icon.className = 'fas fa-moon';
          icon.style.color = '';
        }}
      }};
      updateIcon(document.documentElement.getAttribute('data-theme'));
      btn.addEventListener('click', () => {{
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateIcon(newTheme);
      }});
    }}
  </script>
</body>
</html>
"""

def main():
    role_dir = 'role'
    all_files = [f for f in os.listdir(role_dir) if f.endswith('.html') and f != 'index.html']
    all_slugs = [f.replace('.html', '') for f in all_files]
    
    print(f"Enriching {len(all_slugs)} role pages with unique SEO content...")
    
    for slug in all_slugs:
        data = get_role_details(slug)
        html_content = build_role_page_html(slug, data, all_slugs)
        out_path = os.path.join(role_dir, f"{slug}.html")
        with open(out_path, 'w', encoding='utf-8') as f:
            f.write(html_content)
            
    print(f"Successfully generated and enriched {len(all_slugs)} role pages!")

if __name__ == "__main__":
    main()
