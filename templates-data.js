/**
 * ATS Resume Templates Data & Renderers
 * Contains pre-populated realistic datasets and HTML rendering layouts
 */

// Helper to escape HTML to prevent parsing issues & HTML injection
function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Helper to recursively escape all string values inside a nested object/array structure
function deepEscapeHTML(obj) {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (typeof obj === 'string') {
    return escapeHTML(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepEscapeHTML(item));
  }
  
  if (typeof obj === 'object') {
    return new Proxy(obj, {
      get(target, prop) {
        const val = target[prop];
        if (typeof val === 'function') {
          return val.bind(target);
        }
        return deepEscapeHTML(val);
      }
    });
  }
  
  return obj;
}

const RESUME_PROFILES = {
  software_fresher: {
    personal: {
      name: "Rohan Das",
      title: "Frontend Developer & UI Designer",
      email: "rohan.das@email.com",
      phone: "+91 98765 43210",
      location: "Bangalore, India",
      website: "rohandas.dev",
      linkedin: "linkedin.com/in/rohandas-dev"
    },
    summary: "Enthusiastic and details-oriented Frontend Developer with solid knowledge of JavaScript (ES6+), React, and semantic HTML5/CSS3. Experienced in building clean, responsive web user interfaces and integrating RESTful APIs. Possesses strong analytical thinking and enjoys collaborating in fast-paced software development environments.",
    skills: ["HTML5 & CSS3", "JavaScript (ES6+)", "React.js", "Tailwind CSS", "Git & Version Control", "Node.js & Express", "SQL (PostgreSQL)", "Responsive Design", "Data Structures & Algorithms"],
    experience: [
      {
        role: "Software Engineering Intern",
        company: "InnovateTech Solutions",
        location: "Bangalore, India",
        dates: "Jan 2026 - May 2026",
        descriptions: [
          "Developed reusable React UI components, improving page loading performance by 18%.",
          "Assisted in refactoring legacy CSS to modern Tailwind codebases, ensuring cross-browser consistency.",
          "Participated actively in daily scrum stand-ups, code reviews, and API design sessions."
        ]
      }
    ],
    projects: [
      {
        title: "ZenFinance - Personal Wealth Dashboard",
        technologies: "React, HSL Styling, Chart.js",
        description: "Built a fully responsive financial dashboard featuring premium animations, customizable interactive charts, and local storage data persistence.",
        link: "github.com/rohandas/zenfinance"
      },
      {
        title: "Node.js CollabTask API",
        technologies: "Node.js, Express, MongoDB, JWT",
        description: "Created a robust REST API for collaborative project management with user authentication, role assignment, and comprehensive unit tests.",
        link: "github.com/rohandas/collabtask-api"
      }
    ],
    education: [
      {
        degree: "Bachelor of Technology in Computer Science",
        institution: "PES University",
        location: "Bangalore, India",
        dates: "2022 - 2026",
        gpa: "8.7/10.0 CGPA"
      }
    ],
    certifications: [
      "Meta Front-End Developer Professional Certificate (Coursera)",
      "Advanced React and Redux certification (Udemy)"
    ]
  },
  software_experienced: {
    personal: {
      name: "Siddharth Mehta",
      title: "Senior Full Stack Engineer",
      email: "siddharth.mehta@email.com",
      phone: "+91 99887 76655",
      location: "Hyderabad, India",
      website: "sidmehta.io",
      linkedin: "linkedin.com/in/sidmehta-fs"
    },
    summary: "Senior Software Engineer with 6+ years of experience designing, building, and deploying highly scalable web applications. Expert in React, Node.js, and cloud systems (AWS). Proven track record of spearheading cross-functional teams, optimizing database queries for high traffic, and migrating legacy architectures to microservices.",
    skills: ["React & Next.js", "Node.js (TypeScript)", "AWS (S3, EC2, Lambda)", "PostgreSQL & Redis", "Docker & Kubernetes", "CI/CD (GitHub Actions)", "System Design", "Agile Leadership", "RESTful & GraphQL APIs"],
    experience: [
      {
        role: "Lead Full Stack Developer",
        company: "ApexCloud Technologies",
        location: "Hyderabad, India",
        dates: "Mar 2023 - Present",
        descriptions: [
          "Architected and migrated legacy monolith portal to a Next.js and microservices backend, boosting load times by 42%.",
          "Supervised a high-performing team of 6 engineers, managing sprints, system architecture, and tech stack decisions.",
          "Optimized PostgreSQL database indexes and Redis caching, cutting average API response latency from 450ms to 95ms."
        ]
      },
      {
        role: "Senior Software Engineer",
        company: "OmniRetail Global",
        location: "Hyderabad, India",
        dates: "Jul 2020 - Feb 2023",
        descriptions: [
          "Engineered a scalable payment gateway integration using Node.js and AWS Lambda, processing 10k+ daily transactions.",
          "Maintained and enhanced core UI features in React, driving an increase of 15% in user conversion rate.",
          "Designed comprehensive CI/CD pipelines, automating unit testing and reducing deployment errors by 30%."
        ]
      }
    ],
    projects: [
      {
        title: "ScaleSync - Microservice Monitoring Platform",
        technologies: "Next.js, Node.js, WebSockets, Docker",
        description: "Built a real-time cluster health monitoring dashboard displaying CPU/memory load and API latency streams with low overhead.",
        link: "github.com/sidmehta/scalesync"
      }
    ],
    education: [
      {
        degree: "B.Tech in Information Technology",
        institution: "IIT Hyderabad",
        location: "Hyderabad, India",
        dates: "2016 - 2020",
        gpa: "9.2/10.0 CGPA"
      }
    ],
    certifications: [
      "AWS Certified Solutions Architect – Associate",
      "Certified ScrumMaster (CSM)"
    ]
  },
  electrical_fresher: {
    personal: {
      name: "Anjali Nair",
      title: "Graduate Electrical Engineer",
      email: "anjali.nair@email.com",
      phone: "+91 94460 12345",
      location: "Kochi, India",
      website: "anjalinair.tech",
      linkedin: "linkedin.com/in/anjalinair-ee"
    },
    summary: "Motivated and analytical Graduate Electrical Engineer with academic foundations in power electronics, circuit analysis, and digital logic design. Proficient in engineering software like MATLAB/Simulink and AutoCAD. Practical experience gained through hands-on university projects and industrial training in substation operations.",
    skills: ["Power System Analysis", "MATLAB & Simulink", "AutoCAD Electrical", "Circuit Design", "Power Electronics", "Microcontrollers (Arduino, STM32)", "C Programming", "Technical Documentation"],
    experience: [
      {
        role: "Industrial Trainee",
        company: "Kerala State Electricity Board (KSEB)",
        location: "Kochi, India",
        dates: "Nov 2025 - Dec 2025",
        descriptions: [
          "Gained practical knowledge in standard substation operations, transformers maintenance, and grid distribution mechanics.",
          "Observed safety protocols and assisted technicians in troubleshooting switchgear and circuit breaker relays.",
          "Compiled a detailed 40-page technical report on system upgrades that was commended by substation supervisors."
        ]
      }
    ],
    projects: [
      {
        title: "Smart Grid Simulation & Load Forecasting",
        technologies: "MATLAB, Simulink, ANN Tools",
        description: "Simulated load flows within an active mini-grid and applied artificial neural networks to forecast electricity demand with 94.5% accuracy.",
        link: "github.com/anjalinair/smartgrid-forecast"
      },
      {
        title: "IoT-Based Transformer Health Monitoring System",
        technologies: "Arduino, Temperature Sensors, ESP8266, ThingsPeak",
        description: "Designed a functional prototype that reads transformer core temperature and oil levels, streaming real-time alerts to a remote cloud interface.",
        link: "github.com/anjalinair/transformer-iot"
      }
    ],
    education: [
      {
        degree: "B.Tech in Electrical and Electronics Engineering",
        institution: "Cochin University of Science and Technology",
        location: "Kochi, India",
        dates: "2022 - 2026",
        gpa: "8.4/10.0 CGPA"
      }
    ],
    certifications: [
      "Power Systems Engineering Professional Course (NPTEL)",
      "AutoCAD Electrical Certified User (Autodesk)"
    ]
  },
  electrical_experienced: {
    personal: {
      name: "Vikram Malhotra",
      title: "Senior Power Systems Engineer",
      email: "vikram.malhotra@email.com",
      phone: "+91 91234 56789",
      location: "Pune, India",
      website: "vikram-ee.in",
      linkedin: "linkedin.com/in/vikram-ee-pune"
    },
    summary: "Senior Electrical Engineer with over 7 years of professional experience in substation design, power distribution networks, and industrial automation. Proven expertise leading multi-million rupee electrical infrastructure projects, executing grid load flow studies using ETAP, and implementing complex PLC/SCADA configurations.",
    skills: ["ETAP (Load Flow, Short Circuit)", "SCADA & PLC Programming", "Substation Design (up to 132kV)", "High-Voltage Equipment (GIS/AIS)", "Project Management", "IEC/IEEE Standards", "AutoCAD & Revit", "Team Management"],
    experience: [
      {
        role: "Project Manager - Electrical Systems",
        company: "Sterling & Wilson Solar Division",
        location: "Pune, India",
        dates: "May 2022 - Present",
        descriptions: [
          "Overseeing electrical package designs for a 100MW utility-scale solar PV power plant, completing execution 3 weeks ahead of schedule.",
          "Leading a team of 4 design engineers to execute ETAP simulations, ensuring total compliance with global grid protection regulations.",
          "Spearheading technical negotiations with high-voltage switchgear suppliers, driving down procurement costs by 12%."
        ]
      },
      {
        role: "Electrical Design Engineer",
        company: "L&T Infrastructure Projects",
        location: "Mumbai, India",
        dates: "Jul 2019 - Apr 2022",
        descriptions: [
          "Authored single-line diagrams, cable schedules, and substation protection layouts for 3 municipal grid expansions.",
          "Programmed and tested Allen-Bradley PLC panels and SCADA screen elements, securing operational acceptance on-site.",
          "Conducted detailed thermal calculations and sizing for busbars, power cables, and grounding grids."
        ]
      }
    ],
    projects: [
      {
        title: "132/33kV Substation Modernization",
        technologies: "ETAP, AutoCAD, SCADA integration",
        description: "Led the complete protective relay coordination and equipment redesign for a major municipal substation, enhancing grid reliability by 20%.",
        link: "github.com/vmalhotra/substation-re-coord"
      }
    ],
    education: [
      {
        degree: "M.Tech in Power Systems Engineering",
        institution: "COEP Technological University",
        location: "Pune, India",
        dates: "2017 - 2019",
        gpa: "9.1/10.0 CGPA"
      },
      {
        degree: "B.Tech in Electrical Engineering",
        institution: "VJTI Mumbai",
        location: "Mumbai, India",
        dates: "2013 - 2017",
        gpa: "8.6/10.0 CGPA"
      }
    ],
    certifications: [
      "Project Management Professional (PMP) – PMI",
      "Certified ETAP Power System Analyst"
    ]
  },
  mechanical_fresher: {
    personal: {
      name: "Kabir Sen",
      title: "Graduate Mechanical Engineer",
      email: "kabir.sen@email.com",
      phone: "+91 88776 65544",
      location: "Chennai, India",
      website: "kabirsen.me",
      linkedin: "linkedin.com/in/kabir-sen-mech"
    },
    summary: "Dedicated Mechanical Engineering Graduate with deep interests in computer-aided design (CAD), finite element analysis (FEA), and thermal sciences. Highly skilled in SolidWorks, AutoCAD, and ANSYS Workbench. Possesses valuable hands-on experience in manufacturing processes and mechanical system design through competitive college projects.",
    skills: ["SolidWorks (3D Modeling & Drafting)", "ANSYS (FEA Static Structural)", "AutoCAD (2D Design)", "GD&T Principles", "Manufacturing Processes (CNC)", "Thermodynamics & Heat Transfer", "Python (Engineering calculations)"],
    experience: [
      {
        role: "SAE Formula Student Project Coordinator",
        company: "SRM Racing Team",
        location: "Chennai, India",
        dates: "Jun 2025 - Mar 2026",
        descriptions: [
          "Designed and optimized the rear suspension assembly of a formula-style student race car using SolidWorks.",
          "Conducted structural static analysis on the wheel hubs using ANSYS, reducing unsprung weight by 14% while retaining structural integrity.",
          "Coordinated directly with local CNC machinists for part fabrication, ensuring tight dimensional tolerances."
        ]
      }
    ],
    projects: [
      {
        title: "Design of a Lightweight Planetary Gearbox",
        technologies: "SolidWorks, AGMA Standards, MATLAB",
        description: "Designed a compact 3:1 ratio planetary gear system for robotics usage, calculating gear stresses, tooth wear, and shaft fatigue profiles.",
        link: "github.com/kabirsen/planetary-gearbox"
      },
      {
        title: "FEA of a Quadcopter Frame Under Impact Loads",
        technologies: "ANSYS Workbench, Mechanical APDL",
        description: "Modeled drop tests of a carbon fiber quadcopter frame to discover structural stress nodes and suggested frame rib reinforcements.",
        link: "github.com/kabirsen/quadcopter-fea"
      }
    ],
    education: [
      {
        degree: "B.Tech in Mechanical Engineering",
        institution: "SRM Institute of Science and Technology",
        location: "Chennai, India",
        dates: "2022 - 2026",
        gpa: "8.8/10.0 CGPA"
      }
    ],
    certifications: [
      "SolidWorks Associate in Mechanical Design (CSWA)",
      "Ansys Workbench Certified Specialist (Udemy)"
    ]
  },
  mechanical_experienced: {
    personal: {
      name: "Priyanka Roy",
      title: "Senior Product Design Engineer",
      email: "priyanka.roy@email.com",
      phone: "+91 90001 90002",
      location: "Pune, India",
      website: "priyankaroy.design",
      linkedin: "linkedin.com/in/priyanka-roy-product"
    },
    summary: "Innovative Product Design Engineer with over 8 years of experience leading consumer electronics and automotive styling projects. Advanced expert in CAD modeling (CATIA, SolidWorks), plastic injection molding design, sheet metal, and GD&T. Proven track record of reducing production scrap and optimizing product weight using FEA simulations.",
    skills: ["CATIA V5 & SolidWorks", "ANSYS & Abaqus (FEA)", "Plastic Injection Molding Design", "Sheet Metal Fabrication", "GD&T (ASME Y14.5)", "DFMEA & Design for Manufacturing", "Project Management", "Rapid Prototyping"],
    experience: [
      {
        role: "Senior Design Engineer (R&D)",
        company: "Tata Motors Engineering Research Centre",
        location: "Pune, India",
        dates: "Nov 2021 - Present",
        descriptions: [
          "Supervising the product development lifecycle for interior dashboard panels, successfully lowering tooling weight by 10%.",
          "Conducting comprehensive static, dynamic, and thermal FEA simulations in ANSYS to predict material deformation patterns.",
          "Authoring and reviewing DFMEA files and cross-collaborating with tooling manufacturers to guarantee seamless assembly."
        ]
      },
      {
        role: "Product Design Specialist",
        company: "Whirlpool R&D Center",
        location: "Pune, India",
        dates: "Aug 2018 - Oct 2021",
        descriptions: [
          "Designed 12 injection-molded plastic enclosures for high-end refrigerator lines, ensuring aesthetic and structural alignment.",
          "Applied rigorous GD&T systems, lowering production assembly defects and fit-issues by 22% in manufacturing plants.",
          "Tested physical components using rapid 3D printing prototypes, conducting stress checks to prove stress thresholds."
        ]
      }
    ],
    projects: [
      {
        title: "Automobile Dashboard Trim Assembly Design",
        technologies: "CATIA V5, DFMEA, Moldflow Analysis",
        description: "Re-engineered a standard console dashboard component, resolving molding sink marks and reducing resin consumption by 8%.",
        link: "github.com/proy-design/dashboard-molding"
      }
    ],
    education: [
      {
        degree: "M.Tech in Mechanical Design Engineering",
        institution: "IIT Bombay",
        location: "Mumbai, India",
        dates: "2016 - 2018",
        gpa: "9.3/10.0 CGPA"
      },
      {
        degree: "B.E. in Mechanical Engineering",
        institution: "Jadavpur University",
        location: "Kolkata, India",
        dates: "2012 - 2016",
        gpa: "8.9/10.0 CGPA"
      }
    ],
    certifications: [
      "SolidWorks Professional in Mechanical Design (CSWP)",
      "Six Sigma Green Belt Certification"
    ]
  },
  civil_fresher: {
    personal: {
      name: "Amit Varma",
      title: "Graduate Civil Engineer",
      email: "amit.varma@email.com",
      phone: "+91 96543 21098",
      location: "New Delhi, India",
      website: "amitvarma-civil.tech",
      linkedin: "linkedin.com/in/amitvarma-civil"
    },
    summary: "Detail-oriented Graduate Civil Engineer with theoretical and practical foundations in structural analysis, concrete technology, and geotechnical surveying. Highly competent in AutoCAD, STAAD.Pro, and Revit. Eager to contribute to a progressive construction or infrastructure consulting firm in an entry-level structural engineering role.",
    skills: ["AutoCAD (2D Drafting)", "STAAD.Pro (Structural Analysis)", "Revit Architecture", "Concrete Technology", "Geotechnical Surveying", "MS Excel (Engineering spreadsheets)", "Estimating & Costing", "On-Site Management Support"],
    experience: [
      {
        role: "Civil Site Intern",
        company: "DLF Home Developers",
        location: "Gurugram, India",
        dates: "Dec 2025 - Jan 2026",
        descriptions: [
          "Supervised concrete pouring and steel reinforcement bar (rebar) placement checks under guidance of senior site engineers.",
          "Cross-referenced on-site progress with construction blueprint drawings in AutoCAD, noting structural offsets.",
          "Maintained exact daily log spreadsheets tracking materials delivery, safety inspections, and labor levels."
        ]
      }
    ],
    projects: [
      {
        title: "Structural Design of a Multi-Storey Residential Complex",
        technologies: "STAAD.Pro, IS 456 Standards, AutoCAD",
        description: "Modeled and analyzed a G+5 reinforced concrete framed building, detailing column alignments, slab reinforcement curves, and foundation footing designs.",
        link: "github.com/amitvarma/rcc-design-staad"
      },
      {
        title: "Experimental Analysis of Eco-Friendly Concrete Mixes",
        technologies: "Fly Ash mixes, Compressive Testing Machines",
        description: "Researched concrete mixes substituting 20% cement with industrial fly ash, proving structural strength targets were met at 28 days.",
        link: "github.com/amitvarma/flyash-concrete"
      }
    ],
    education: [
      {
        degree: "B.Tech in Civil Engineering",
        institution: "Delhi Technological University (DTU)",
        location: "New Delhi, India",
        dates: "2022 - 2026",
        gpa: "8.5/10.0 CGPA"
      }
    ],
    certifications: [
      "STAAD.Pro V8i Structural Analysis Specialist (Bentley)",
      "Autodesk Revit Architecture Professional Certificate (Coursera)"
    ]
  },
  civil_experienced: {
    personal: {
      name: "Sandeep Rao",
      title: "Senior Structural & Construction Project Engineer",
      email: "sandeep.rao@email.com",
      phone: "+91 97766 55443",
      location: "Chennai, India",
      website: "sandeeprao-civil.in",
      linkedin: "linkedin.com/in/sandeeprao-structural"
    },
    summary: "Accomplished Senior Structural Engineer with 8+ years of expertise in design, analysis, and site inspection of high-rise commercial structures and municipal flyovers. Highly skilled in ETABS, SAFE, and Tekla Structures. Extensive track record leading structural validation tasks, implementing IS/ACI codes, and coordinating contractors to deliver safe systems.",
    skills: ["ETABS (High-rise Structural Design)", "SAFE (Slab and Footing Analysis)", "Tekla Structures & AutoCAD", "IS 456 / IS 1893 (Seismic Design)", "Reinforced & Pre-stressed Concrete", "Contractor Coordination", "Project Estimating & Cost Control", "Team Leadership"],
    experience: [
      {
        role: "Senior Structural Engineer",
        company: "L&T Construction - Buildings & Factories",
        location: "Chennai, India",
        dates: "Oct 2021 - Present",
        descriptions: [
          "Lead structural designer for a 22-storey commercial corporate IT park, executing comprehensive 3D seismic dynamic analyses in ETABS.",
          "Managing a design cell of 3 assistant structural engineers, approving bar-bending schedules and foundational layouts.",
          "Resolving structural site problems by collaborating with project managers, ensuring progress remains on track."
        ]
      },
      {
        role: "Structural Design Engineer",
        company: "Shapoorji Pallonji Group",
        location: "Mumbai, India",
        dates: "Jun 2018 - Sep 2021",
        descriptions: [
          "Engineered column, shear-wall, and pile foundation layouts for residential high-rises in high-risk seismic zones.",
          "Conducted detailed concrete slab analyses using SAFE, lowering reinforcement steel requirements by 8% with smart design.",
          "Represented the company in engineering review meetings with municipal regulatory officers to secure design safety approvals."
        ]
      }
    ],
    projects: [
      {
        title: "22-Storey Commercial IT Tower Design",
        technologies: "ETABS, SAFE, Tekla Structures",
        description: "Headed structural modeling and optimization of structural frames against heavy wind and high seismic shocks, complying with IS 1893.",
        link: "github.com/srao-civil/22-storey-it-tower"
      }
    ],
    education: [
      {
        degree: "M.Tech in Structural Engineering",
        institution: "IIT Madras",
        location: "Chennai, India",
        dates: "2016 - 2018",
        gpa: "9.4/10.0 CGPA"
      },
      {
        degree: "B.Tech in Civil Engineering",
        institution: "NIT Trichy",
        location: "Tiruchirappalli, India",
        dates: "2012 - 2016",
        gpa: "9.0/10.0 CGPA"
      }
    ],
    certifications: [
      "Chartered Structural Engineer – Institution of Engineers (India)",
      "Certified Project Management Associate (IPMA Level D)"
    ]
  },
  data_science_fresher: {
    personal: {
      name: "Aditya Sharma",
      title: "Aspiring Data Scientist & Analyst",
      email: "aditya.sharma@email.com",
      phone: "+91 98760 12345",
      location: "Mumbai, India",
      website: "adityasharma.info",
      linkedin: "linkedin.com/in/aditya-ds"
    },
    summary: "Detail-oriented and analytical Graduate Data Scientist with strong foundational skills in statistical analysis, machine learning algorithms, and data visualization. Proficient in Python, SQL, and data science libraries like Pandas, NumPy, and Scikit-Learn. Passionate about uncovering data-driven insights and building predictive models to solve complex real-world business challenges.",
    skills: ["Python (Pandas, NumPy, Scikit-Learn)", "SQL (MySQL, PostgreSQL)", "Data Visualization (Tableau, PowerBI)", "Machine Learning (Regression, Classification)", "Statistical Modeling & Hypothesis Testing", "Git & Version Control", "Data Wrangling & Cleaning", "Jupyter Notebooks"],
    experience: [
      {
        role: "Data Analyst Intern",
        company: "Quantum Analytics Lab",
        location: "Mumbai, India",
        dates: "Dec 2025 - Apr 2026",
        descriptions: [
          "Cleaned and pre-processed over 50,000 rows of customer transaction data using Python, reducing analysis preparation time by 25%.",
          "Built interactive Tableau dashboards tracking key operational KPIs, enabling executive teams to identify $15k in monthly overhead savings.",
          "Wrote optimized SQL queries to extract data from relational databases, boosting reporting efficiency by 15%."
        ]
      }
    ],
    projects: [
      {
        title: "E-Commerce Customer Segmentation Analysis",
        technologies: "Python, Scikit-Learn, K-Means, Matplotlib",
        description: "Applied unsupervised K-Means clustering algorithm on customer behavior datasets to segment users into distinct purchasing personas for targeted marketing campaigns.",
        link: "github.com/aditya/customer-segmentation"
      },
      {
        title: "House Price Predictive Model",
        technologies: "Python, Pandas, Linear Regression, XGBoost",
        description: "Developed and optimized a regression model forecasting housing market valuations with an R-squared metric of 0.89.",
        link: "github.com/aditya/house-price-prediction"
      }
    ],
    education: [
      {
        degree: "B.Tech in Computer Science & Data Science",
        institution: "NMIMS University",
        location: "Mumbai, India",
        dates: "2022 - 2026",
        gpa: "8.9/10.0 CGPA"
      }
    ],
    certifications: [
      "Google Advanced Data Analytics Professional Certificate",
      "IBM Data Science Professional Certificate (Coursera)"
    ]
  },
  data_science_experienced: {
    personal: {
      name: "Dr. Meera Krishnan",
      title: "Senior Data Scientist & ML Engineer",
      email: "meera.krishnan@email.com",
      phone: "+91 99000 88000",
      location: "Bangalore, India",
      website: "meerakrishnan.ai",
      linkedin: "linkedin.com/in/meera-k-ds"
    },
    summary: "Senior Data Scientist with 6+ years of expertise delivering high-impact machine learning systems, deep learning architectures, and analytics strategies. Highly skilled in Python, PyTorch, SQL, Spark, and AWS cloud solutions. Proven track record of scaling predictive modeling systems to millions of active users, mentoring data science teams, and driving significant business KPI improvements.",
    skills: ["Machine Learning & Deep Learning", "Python (PyTorch, TensorFlow)", "Big Data (Apache Spark, Hadoop)", "AWS Cloud (S3, SageMaker, EC2)", "SQL & NoSQL (MongoDB, Cassandra)", "Large Language Models (LLMs) & NLP", "A/B Testing & Statistical Analysis", "MLOps & CI/CD Pipelines"],
    experience: [
      {
        role: "Senior Data Scientist",
        company: "TargetIntel Global",
        location: "Bangalore, India",
        dates: "Jan 2023 - Present",
        descriptions: [
          "Architected and deployed a deep-learning recommendation engine using PyTorch and AWS SageMaker, lifting sales conversion rates by 22%.",
          "Designed robust ML pipelines processing 5TB+ of daily log data using Apache Spark, slashing query latency by 45%.",
          "Spearheaded comprehensive A/B testing methodologies on primary user flows, directly increasing customer retention metrics by 14%."
        ]
      },
      {
        role: "Machine Learning Engineer",
        company: "Fintech Decisions Inc.",
        location: "Bangalore, India",
        dates: "Oct 2020 - Dec 2022",
        descriptions: [
          "Developed and launched real-time fraud detection classification models, preventing an estimated $120,000 in monthly transaction losses.",
          "Containerized ML models using Docker and Kubernetes, reducing model deployment cycles from 2 weeks to under 3 hours.",
          "Collaborated directly with product teams to design credit-risk scoring algorithms matching strict regulatory requirements."
        ]
      }
    ],
    projects: [
      {
        title: "Enterprise LLM Sentiment Analyst",
        technologies: "HuggingFace Transformers, PyTorch, Docker, AWS",
        description: "Fine-tuned open-source Llama-3 models on customer feedback data to automate sentiment routing for support tickets with 96% accuracy.",
        link: "github.com/mkrishnan/llm-sentiment"
      }
    ],
    education: [
      {
        degree: "M.S. in Data Science & Machine Learning",
        institution: "IIIT Bangalore",
        location: "Bangalore, India",
        dates: "2018 - 2020",
        gpa: "9.5/10.0 CGPA"
      },
      {
        degree: "B.Tech in Computer Science Engineering",
        institution: "VIT Vellore",
        location: "Vellore, India",
        dates: "2014 - 2018",
        gpa: "9.1/10.0 CGPA"
      }
    ],
    certifications: [
      "AWS Certified Machine Learning – Specialty",
      "TensorFlow Developer Certificate (Google)"
    ]
  }
};

/**
 * -------------------------------------------------------------
 * ATS TEMPLATE LAYOUT RENDERERS
 * -------------------------------------------------------------
 */

const TEMPLATE_STYLES = {
  classic: {
    id: "classic",
    name: "Minimalist Classic",
    description: "Highly approved, standard single-column ATS resume layout with clean typography.",
    render: (data) => {
      // 1. Personal Header
      let html = `
        <div class="resume-header text-center" style="margin-bottom: 20px;">
          <h1 class="resume-name" style="font-family: Arial, Helvetica, sans-serif; font-size: 26px; font-weight: bold; margin: 0 0 5px 0; color: #111;">${data.personal.name || ""}</h1>
          <p class="resume-title" style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-style: italic; font-weight: 600; color: #555; margin: 0 0 10px 0;">${data.personal.title || ""}</p>
          <div class="resume-contact" style="font-family: Arial, Helvetica, sans-serif; font-size: 11px; color: #333; display: flex; flex-wrap: wrap; justify-content: center; gap: 8px 12px; margin-top: 5px;">
            ${data.personal.email ? `<span>Email: ${data.personal.email}</span>` : ""}
            ${data.personal.phone ? `<span>Phone: ${data.personal.phone}</span>` : ""}
            ${data.personal.location ? `<span>Location: ${data.personal.location}</span>` : ""}
            ${data.personal.website ? `<span>Portfolio: ${data.personal.website}</span>` : ""}
            ${data.personal.linkedin ? `<span>LinkedIn: ${data.personal.linkedin}</span>` : ""}
          </div>
        </div>
      `;

      // 2. Summary
      if (data.summary) {
        html += `
          <div class="resume-section" style="margin-bottom: 18px;">
            <h2 class="section-title" style="font-family: Arial, Helvetica, sans-serif; font-size: 13px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #111; padding-bottom: 3px; margin: 0 0 8px 0; color: #111; letter-spacing: 0.5px;">Professional Summary</h2>
            <p style="font-family: Arial, Helvetica, sans-serif; font-size: 11px; line-height: 1.5; color: #333; margin: 0; text-align: justify;">${data.summary}</p>
          </div>
        `;
      }

      // 3. Skills
      if (data.skills && data.skills.length > 0) {
        html += `
          <div class="resume-section" style="margin-bottom: 18px;">
            <h2 class="section-title" style="font-family: Arial, Helvetica, sans-serif; font-size: 13px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #111; padding-bottom: 3px; margin: 0 0 8px 0; color: #111; letter-spacing: 0.5px;">Skills</h2>
            <p style="font-family: Arial, Helvetica, sans-serif; font-size: 11px; line-height: 1.5; color: #333; margin: 0;"><strong>Technical & Professional:</strong> ${data.skills.join(" &bull; ")}</p>
          </div>
        `;
      }

      // 4. Experience
      if (data.experience && data.experience.length > 0) {
        html += `
          <div class="resume-section" style="margin-bottom: 18px;">
            <h2 class="section-title" style="font-family: Arial, Helvetica, sans-serif; font-size: 13px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #111; padding-bottom: 3px; margin: 0 0 8px 0; color: #111; letter-spacing: 0.5px;">Work Experience</h2>
        `;
        data.experience.forEach((exp) => {
          html += `
            <div class="resume-item" style="margin-bottom: 12px; page-break-inside: avoid;">
              <table style="width: 100%; border-collapse: collapse; font-family: Arial, Helvetica, sans-serif; font-size: 11px; margin-bottom: 4px;">
                <tr>
                  <td style="font-weight: bold; text-align: left; color: #111;">${exp.role || ""} - <span style="font-weight: normal; color: #333;">${exp.company || ""}</span></td>
                  <td style="font-weight: bold; text-align: right; color: #111;">${exp.dates || ""}</td>
                </tr>
                <tr>
                  <td style="font-style: italic; color: #555; text-align: left;">${exp.location || ""}</td>
                  <td></td>
                </tr>
              </table>
              <ul style="margin: 0; padding-left: 18px; font-family: Arial, Helvetica, sans-serif; font-size: 11px; color: #333; line-height: 1.45;">
          `;
          if (exp.descriptions) {
            exp.descriptions.forEach((desc) => {
              html += `<li style="margin-bottom: 3px; text-align: justify;">${desc}</li>`;
            });
          }
          html += `
              </ul>
            </div>
          `;
        });
        html += `</div>`;
      }

      // 5. Projects
      if (data.projects && data.projects.length > 0) {
        html += `
          <div class="resume-section" style="margin-bottom: 18px;">
            <h2 class="section-title" style="font-family: Arial, Helvetica, sans-serif; font-size: 13px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #111; padding-bottom: 3px; margin: 0 0 8px 0; color: #111; letter-spacing: 0.5px;">Key Projects</h2>
        `;
        data.projects.forEach((proj) => {
          html += `
            <div class="resume-item" style="margin-bottom: 10px; page-break-inside: avoid;">
              <table style="width: 100%; border-collapse: collapse; font-family: Arial, Helvetica, sans-serif; font-size: 11px; margin-bottom: 3px;">
                <tr>
                  <td style="font-weight: bold; text-align: left; color: #111;">${proj.title || ""} ${proj.link ? `<span style="font-weight: normal; font-size: 10px; color: #555;">(${proj.link})</span>` : ""}</td>
                  <td style="font-style: italic; text-align: right; color: #555;">${proj.technologies || ""}</td>
                </tr>
              </table>
              <p style="font-family: Arial, Helvetica, sans-serif; font-size: 11px; color: #333; line-height: 1.4; margin: 0 0 0 5px; text-align: justify;">${proj.description || ""}</p>
            </div>
          `;
        });
        html += `</div>`;
      }

      // 6. Education
      if (data.education && data.education.length > 0) {
        html += `
          <div class="resume-section" style="margin-bottom: 18px;">
            <h2 class="section-title" style="font-family: Arial, Helvetica, sans-serif; font-size: 13px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #111; padding-bottom: 3px; margin: 0 0 8px 0; color: #111; letter-spacing: 0.5px;">Education</h2>
        `;
        data.education.forEach((edu) => {
          html += `
            <div class="resume-item" style="margin-bottom: 8px; page-break-inside: avoid;">
              <table style="width: 100%; border-collapse: collapse; font-family: Arial, Helvetica, sans-serif; font-size: 11px; margin-bottom: 2px;">
                <tr>
                  <td style="font-weight: bold; text-align: left; color: #111;">${edu.degree || ""}</td>
                  <td style="font-weight: bold; text-align: right; color: #111;">${edu.dates || ""}</td>
                </tr>
                <tr>
                  <td style="font-style: italic; color: #333; text-align: left;">${edu.institution || ""}, <span style="font-weight: normal; color: #555;">${edu.location || ""}</span></td>
                  <td style="text-align: right; font-weight: bold; color: #111;">${edu.gpa ? `Grade: ${edu.gpa}` : ""}</td>
                </tr>
              </table>
            </div>
          `;
        });
        html += `</div>`;
      }

      // 7. Certifications
      if (data.certifications && data.certifications.length > 0) {
        html += `
          <div class="resume-section" style="margin-bottom: 0;">
            <h2 class="section-title" style="font-family: Arial, Helvetica, sans-serif; font-size: 13px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #111; padding-bottom: 3px; margin: 0 0 8px 0; color: #111; letter-spacing: 0.5px;">Certifications</h2>
            <ul style="margin: 0; padding-left: 18px; font-family: Arial, Helvetica, sans-serif; font-size: 11px; color: #333; line-height: 1.45;">
        `;
        data.certifications.forEach((cert) => {
          html += `<li style="margin-bottom: 2px;">${cert}</li>`;
        });
        html += `
            </ul>
          </div>
        `;
      }

      return html;
    }
  },
  modern: {
    id: "modern",
    name: "Serene Modern",
    description: "Premium serif header with clean section rules, perfect for a striking elegant profile.",
    render: (data) => {
      // 1. Personal Header
      let html = `
        <div class="resume-header" style="margin-bottom: 25px; border-bottom: 2px solid #4A6B62; padding-bottom: 12px;">
          <h1 class="resume-name" style="font-family: 'Playfair Display', Georgia, serif; font-size: 28px; font-weight: bold; margin: 0 0 4px 0; color: #1b332d; text-align: left;">${data.personal.name || ""}</h1>
          <p class="resume-title" style="font-family: Arial, sans-serif; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold; color: #4A6B62; margin: 0 0 10px 0; text-align: left;">${data.personal.title || ""}</p>
          <div class="resume-contact" style="font-family: Arial, sans-serif; font-size: 11px; color: #444; display: flex; flex-wrap: wrap; justify-content: flex-start; gap: 6px 16px; margin-top: 5px;">
            ${data.personal.email ? `<span><strong>Email:</strong> ${data.personal.email}</span>` : ""}
            ${data.personal.phone ? `<span><strong>Phone:</strong> ${data.personal.phone}</span>` : ""}
            ${data.personal.location ? `<span><strong>Location:</strong> ${data.personal.location}</span>` : ""}
            ${data.personal.website ? `<span><strong>Web:</strong> ${data.personal.website}</span>` : ""}
            ${data.personal.linkedin ? `<span><strong>LinkedIn:</strong> ${data.personal.linkedin}</span>` : ""}
          </div>
        </div>
      `;

      // 2. Summary
      if (data.summary) {
        html += `
          <div class="resume-section" style="margin-bottom: 20px;">
            <h2 class="section-title" style="font-family: 'Playfair Display', Georgia, serif; font-size: 14px; font-weight: bold; border-left: 3px solid #4A6B62; padding-left: 8px; margin: 0 0 8px 0; color: #1b332d;">About Me</h2>
            <p style="font-family: Georgia, serif; font-size: 11px; line-height: 1.6; color: #333; margin: 0; text-align: justify; font-style: italic;">"${data.summary}"</p>
          </div>
        `;
      }

      // 3. Skills
      if (data.skills && data.skills.length > 0) {
        html += `
          <div class="resume-section" style="margin-bottom: 20px;">
            <h2 class="section-title" style="font-family: 'Playfair Display', Georgia, serif; font-size: 14px; font-weight: bold; border-left: 3px solid #4A6B62; padding-left: 8px; margin: 0 0 8px 0; color: #1b332d;">Core Competencies</h2>
            <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px;">
        `;
        data.skills.forEach((skill) => {
          html += `<span style="font-family: Arial, sans-serif; font-size: 10px; padding: 3px 8px; background-color: #f1f5f3; border-radius: 4px; border: 1px solid #dbe5e1; color: #2e4c44; font-weight: 500;">${skill}</span>`;
        });
        html += `
            </div>
          </div>
        `;
      }

      // 4. Experience
      if (data.experience && data.experience.length > 0) {
        html += `
          <div class="resume-section" style="margin-bottom: 20px;">
            <h2 class="section-title" style="font-family: 'Playfair Display', Georgia, serif; font-size: 14px; font-weight: bold; border-left: 3px solid #4A6B62; padding-left: 8px; margin: 0 0 8px 0; color: #1b332d;">Professional Timeline</h2>
        `;
        data.experience.forEach((exp) => {
          html += `
            <div class="resume-item" style="margin-bottom: 15px; page-break-inside: avoid;">
              <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 11px; margin-bottom: 4px;">
                <tr>
                  <td style="font-weight: bold; font-size: 12px; text-align: left; color: #1b332d;">${exp.role || ""}</td>
                  <td style="font-weight: bold; text-align: right; color: #4A6B62;">${exp.dates || ""}</td>
                </tr>
                <tr>
                  <td style="font-weight: 600; color: #555; text-align: left;">${exp.company || ""} <span style="font-weight: normal; font-style: italic;">- ${exp.location || ""}</span></td>
                  <td></td>
                </tr>
              </table>
              <ul style="margin: 0; padding-left: 15px; font-family: Arial, sans-serif; font-size: 11px; color: #333; line-height: 1.5;">
          `;
          if (exp.descriptions) {
            exp.descriptions.forEach((desc) => {
              html += `<li style="margin-bottom: 4px; text-align: justify;">${desc}</li>`;
            });
          }
          html += `
              </ul>
            </div>
          `;
        });
        html += `</div>`;
      }

      // 5. Projects
      if (data.projects && data.projects.length > 0) {
        html += `
          <div class="resume-section" style="margin-bottom: 20px;">
            <h2 class="section-title" style="font-family: 'Playfair Display', Georgia, serif; font-size: 14px; font-weight: bold; border-left: 3px solid #4A6B62; padding-left: 8px; margin: 0 0 8px 0; color: #1b332d;">Selected Projects</h2>
        `;
        data.projects.forEach((proj) => {
          html += `
            <div class="resume-item" style="margin-bottom: 12px; page-break-inside: avoid;">
              <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 11px; margin-bottom: 3px;">
                <tr>
                  <td style="font-weight: bold; text-align: left; color: #1b332d;">${proj.title || ""}</td>
                  <td style="font-style: italic; text-align: right; color: #4A6B62; font-weight: bold;">${proj.technologies || ""}</td>
                </tr>
              </table>
              <p style="font-family: Arial, sans-serif; font-size: 11px; color: #333; line-height: 1.4; margin: 0 0 3px 0; text-align: justify;">${proj.description || ""}</p>
              ${proj.link ? `<p style="font-family: Arial, sans-serif; font-size: 10px; color: #666; margin: 0;">Code/Demo: <a href="https://${proj.link}" target="_blank" style="color: #4A6B62; text-decoration: none;">${proj.link}</a></p>` : ""}
            </div>
          `;
        });
        html += `</div>`;
      }

      // 6. Education
      if (data.education && data.education.length > 0) {
        html += `
          <div class="resume-section" style="margin-bottom: 20px;">
            <h2 class="section-title" style="font-family: 'Playfair Display', Georgia, serif; font-size: 14px; font-weight: bold; border-left: 3px solid #4A6B62; padding-left: 8px; margin: 0 0 8px 0; color: #1b332d;">Academic Credentials</h2>
        `;
        data.education.forEach((edu) => {
          html += `
            <div class="resume-item" style="margin-bottom: 10px; page-break-inside: avoid;">
              <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 11px; margin-bottom: 2px;">
                <tr>
                  <td style="font-weight: bold; text-align: left; color: #1b332d;">${edu.degree || ""}</td>
                  <td style="font-weight: bold; text-align: right; color: #4A6B62;">${edu.dates || ""}</td>
                </tr>
                <tr>
                  <td style="color: #555; text-align: left;">${edu.institution || ""}, <span style="font-style: italic;">${edu.location || ""}</span></td>
                  <td style="text-align: right; font-weight: bold; color: #111;">${edu.gpa ? `Grade: ${edu.gpa}` : ""}</td>
                </tr>
              </table>
            </div>
          `;
        });
        html += `</div>`;
      }

      // 7. Certifications
      if (data.certifications && data.certifications.length > 0) {
        html += `
          <div class="resume-section" style="margin-bottom: 0;">
            <h2 class="section-title" style="font-family: 'Playfair Display', Georgia, serif; font-size: 14px; font-weight: bold; border-left: 3px solid #4A6B62; padding-left: 8px; margin: 0 0 8px 0; color: #1b332d;">Professional Licensing & Certifications</h2>
            <ul style="margin: 0; padding-left: 15px; font-family: Arial, sans-serif; font-size: 11px; color: #333; line-height: 1.5;">
        `;
        data.certifications.forEach((cert) => {
          html += `<li style="margin-bottom: 3px;">${cert}</li>`;
        });
        html += `
            </ul>
          </div>
        `;
      }

      return html;
    }
  },
  grid: {
    id: "grid",
    name: "Technical Grid",
    description: "Highly structured engineering layout featuring slate lines, optimized for complex data.",
    render: (data) => {
      // 1. Personal Header
      let html = `
        <div class="resume-header" style="margin-bottom: 20px; border-bottom: 3px double #334e68; padding-bottom: 10px; display: flex; justify-content: space-between; align-items: flex-end;">
          <div>
            <h1 class="resume-name" style="font-family: 'Trebuchet MS', sans-serif; font-size: 26px; font-weight: bold; margin: 0 0 3px 0; color: #102a43; letter-spacing: -0.5px;">${data.personal.name || ""}</h1>
            <p class="resume-title" style="font-family: 'Trebuchet MS', sans-serif; font-size: 13px; font-weight: bold; color: #334e68; margin: 0; text-transform: uppercase;">${data.personal.title || ""}</p>
          </div>
          <div class="resume-contact" style="font-family: 'Trebuchet MS', sans-serif; font-size: 10px; color: #334e68; text-align: right; line-height: 1.4;">
            ${data.personal.email ? `<div><strong>Email:</strong> ${data.personal.email}</div>` : ""}
            ${data.personal.phone ? `<div><strong>Phone:</strong> ${data.personal.phone}</div>` : ""}
            ${data.personal.location ? `<div><strong>Loc:</strong> ${data.personal.location}</div>` : ""}
            ${data.personal.website ? `<div><strong>Web:</strong> ${data.personal.website}</div>` : ""}
            ${data.personal.linkedin ? `<div><strong>IN:</strong> ${data.personal.linkedin}</div>` : ""}
          </div>
        </div>
      `;

      // 2. Summary
      if (data.summary) {
        html += `
          <div class="resume-section" style="margin-bottom: 18px;">
            <h2 class="section-title" style="font-family: 'Trebuchet MS', sans-serif; font-size: 13px; font-weight: bold; text-transform: uppercase; background-color: #f0f4f8; padding: 4px 8px; margin: 0 0 8px 0; color: #102a43; border-radius: 2px;">Professional Profile</h2>
            <p style="font-family: Arial, sans-serif; font-size: 11px; line-height: 1.5; color: #333; margin: 0; text-align: justify;">${data.summary}</p>
          </div>
        `;
      }

      // 3. Skills
      if (data.skills && data.skills.length > 0) {
        html += `
          <div class="resume-section" style="margin-bottom: 18px;">
            <h2 class="section-title" style="font-family: 'Trebuchet MS', sans-serif; font-size: 13px; font-weight: bold; text-transform: uppercase; background-color: #f0f4f8; padding: 4px 8px; margin: 0 0 8px 0; color: #102a43; border-radius: 2px;">Technical Skills Directory</h2>
            <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10.5px;">
              <tr>
                <td style="padding: 2px 0; line-height: 1.5; color: #333;">
                  ${data.skills.map((skill, index) => {
                    return `<strong>${skill}</strong>${index < data.skills.length - 1 ? ' <span style="color:#bcccdc;">|</span> ' : ''}`;
                  }).join('')}
                </td>
              </tr>
            </table>
          </div>
        `;
      }

      // 4. Experience
      if (data.experience && data.experience.length > 0) {
        html += `
          <div class="resume-section" style="margin-bottom: 18px;">
            <h2 class="section-title" style="font-family: 'Trebuchet MS', sans-serif; font-size: 13px; font-weight: bold; text-transform: uppercase; background-color: #f0f4f8; padding: 4px 8px; margin: 0 0 8px 0; color: #102a43; border-radius: 2px;">Engineering Experience</h2>
        `;
        data.experience.forEach((exp) => {
          html += `
            <div class="resume-item" style="margin-bottom: 12px; page-break-inside: avoid;">
              <table style="width: 100%; border-collapse: collapse; font-family: 'Trebuchet MS', sans-serif; font-size: 11px; margin-bottom: 3px;">
                <tr style="background-color: #f9fafb;">
                  <td style="font-weight: bold; padding: 3px; color: #102a43; text-align: left;">${exp.role || ""}</td>
                  <td style="font-weight: bold; padding: 3px; color: #334e68; text-align: right;">${exp.dates || ""}</td>
                </tr>
                <tr>
                  <td style="font-style: italic; padding: 2px 3px; color: #486581; text-align: left;">${exp.company || ""} &bull; ${exp.location || ""}</td>
                  <td></td>
                </tr>
              </table>
              <ul style="margin: 0; padding-left: 18px; font-family: Arial, sans-serif; font-size: 10.5px; color: #333; line-height: 1.45;">
          `;
          if (exp.descriptions) {
            exp.descriptions.forEach((desc) => {
              html += `<li style="margin-bottom: 3px; text-align: justify;">${desc}</li>`;
            });
          }
          html += `
              </ul>
            </div>
          `;
        });
        html += `</div>`;
      }

      // 5. Projects
      if (data.projects && data.projects.length > 0) {
        html += `
          <div class="resume-section" style="margin-bottom: 18px;">
            <h2 class="section-title" style="font-family: 'Trebuchet MS', sans-serif; font-size: 13px; font-weight: bold; text-transform: uppercase; background-color: #f0f4f8; padding: 4px 8px; margin: 0 0 8px 0; color: #102a43; border-radius: 2px;">Technical Projects</h2>
        `;
        data.projects.forEach((proj) => {
          html += `
            <div class="resume-item" style="margin-bottom: 10px; page-break-inside: avoid;">
              <table style="width: 100%; border-collapse: collapse; font-family: 'Trebuchet MS', sans-serif; font-size: 11px; margin-bottom: 3px;">
                <tr>
                  <td style="font-weight: bold; text-align: left; color: #102a43;">${proj.title || ""}</td>
                  <td style="font-style: italic; text-align: right; color: #486581;">${proj.technologies || ""}</td>
                </tr>
              </table>
              <p style="font-family: Arial, sans-serif; font-size: 10.5px; color: #333; line-height: 1.4; margin: 0 0 2px 4px; text-align: justify;">${proj.description || ""}</p>
              ${proj.link ? `<div style="font-family: 'Trebuchet MS', sans-serif; font-size: 9.5px; margin-left: 4px; color: #627d98;">Repository: ${proj.link}</div>` : ""}
            </div>
          `;
        });
        html += `</div>`;
      }

      // 6. Education
      if (data.education && data.education.length > 0) {
        html += `
          <div class="resume-section" style="margin-bottom: 18px;">
            <h2 class="section-title" style="font-family: 'Trebuchet MS', sans-serif; font-size: 13px; font-weight: bold; text-transform: uppercase; background-color: #f0f4f8; padding: 4px 8px; margin: 0 0 8px 0; color: #102a43; border-radius: 2px;">Academic History</h2>
        `;
        data.education.forEach((edu) => {
          html += `
            <div class="resume-item" style="margin-bottom: 8px; page-break-inside: avoid;">
              <table style="width: 100%; border-collapse: collapse; font-family: 'Trebuchet MS', sans-serif; font-size: 11px;">
                <tr>
                  <td style="font-weight: bold; text-align: left; color: #102a43;">${edu.degree || ""}</td>
                  <td style="font-weight: bold; text-align: right; color: #334e68;">${edu.dates || ""}</td>
                </tr>
                <tr>
                  <td style="color: #486581; text-align: left;">${edu.institution || ""} &bull; <span style="font-size: 10px;">${edu.location || ""}</span></td>
                  <td style="text-align: right; font-weight: bold; color: #102a43;">${edu.gpa ? `Grade: ${edu.gpa}` : ""}</td>
                </tr>
              </table>
            </div>
          `;
        });
        html += `</div>`;
      }

      // 7. Certifications
      if (data.certifications && data.certifications.length > 0) {
        html += `
          <div class="resume-section" style="margin-bottom: 0;">
            <h2 class="section-title" style="font-family: 'Trebuchet MS', sans-serif; font-size: 13px; font-weight: bold; text-transform: uppercase; background-color: #f0f4f8; padding: 4px 8px; margin: 0 0 8px 0; color: #102a43; border-radius: 2px;">Professional Certifications</h2>
            <ul style="margin: 0; padding-left: 18px; font-family: Arial, sans-serif; font-size: 10.5px; color: #333; line-height: 1.45;">
        `;
        data.certifications.forEach((cert) => {
          html += `<li style="margin-bottom: 2px;">${cert}</li>`;
        });
        html += `
            </ul>
          </div>
        `;
      }

      return html;
    }
  },
  executive: {
    id: "executive",
    name: "Bold Executive",
    description: "Sleek slate borders with deep navy highlights, optimized for established leaders.",
    render: (data) => {
      // 1. Personal Header
      let html = `
        <div class="resume-header text-center" style="margin-bottom: 22px; border-bottom: 2px solid #0f2d4a; padding-bottom: 12px;">
          <h1 class="resume-name" style="font-family: 'Georgia', serif; font-size: 28px; font-weight: bold; margin: 0 0 4px 0; color: #0f2d4a; text-transform: uppercase; letter-spacing: 0.5px;">${data.personal.name || ""}</h1>
          <p class="resume-title" style="font-family: 'Georgia', serif; font-size: 13px; font-weight: bold; color: #0f2d4a; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 1px;">${data.personal.title || ""}</p>
          <div class="resume-contact" style="font-family: Arial, sans-serif; font-size: 10.5px; color: #333; display: flex; flex-wrap: wrap; justify-content: center; gap: 8px 16px;">
            ${data.personal.email ? `<span><strong>EMAIL:</strong> ${data.personal.email}</span>` : ""}
            ${data.personal.phone ? `<span><strong>TEL:</strong> ${data.personal.phone}</span>` : ""}
            ${data.personal.location ? `<span><strong>LOC:</strong> ${data.personal.location}</span>` : ""}
            ${data.personal.website ? `<span><strong>WEB:</strong> ${data.personal.website}</span>` : ""}
            ${data.personal.linkedin ? `<span><strong>LI:</strong> ${data.personal.linkedin}</span>` : ""}
          </div>
        </div>
      `;

      // 2. Summary
      if (data.summary) {
        html += `
          <div class="resume-section" style="margin-bottom: 18px;">
            <h2 class="section-title" style="font-family: 'Georgia', serif; font-size: 13px; font-weight: bold; text-transform: uppercase; border-bottom: 1.5px solid #0f2d4a; padding-bottom: 2px; margin: 0 0 8px 0; color: #0f2d4a; letter-spacing: 0.5px;">Executive Profile</h2>
            <p style="font-family: Arial, sans-serif; font-size: 11px; line-height: 1.55; color: #222; margin: 0; text-align: justify;">${data.summary}</p>
          </div>
        `;
      }

      // 3. Skills
      if (data.skills && data.skills.length > 0) {
        html += `
          <div class="resume-section" style="margin-bottom: 18px;">
            <h2 class="section-title" style="font-family: 'Georgia', serif; font-size: 13px; font-weight: bold; text-transform: uppercase; border-bottom: 1.5px solid #0f2d4a; padding-bottom: 2px; margin: 0 0 8px 0; color: #0f2d4a; letter-spacing: 0.5px;">Expertise & Leadership</h2>
            <div style="font-family: Arial, sans-serif; font-size: 10.5px; color: #222; line-height: 1.5; display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px 10px;">
              ${data.skills.map(skill => `<div>&bull; ${skill}</div>`).join('')}
            </div>
          </div>
        `;
      }

      // 4. Experience
      if (data.experience && data.experience.length > 0) {
        html += `
          <div class="resume-section" style="margin-bottom: 18px;">
            <h2 class="section-title" style="font-family: 'Georgia', serif; font-size: 13px; font-weight: bold; text-transform: uppercase; border-bottom: 1.5px solid #0f2d4a; padding-bottom: 2px; margin: 0 0 8px 0; color: #0f2d4a; letter-spacing: 0.5px;">Leadership & Professional Experience</h2>
        `;
        data.experience.forEach((exp) => {
          html += `
            <div class="resume-item" style="margin-bottom: 12px; page-break-inside: avoid;">
              <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 11px; margin-bottom: 4px;">
                <tr>
                  <td style="font-weight: bold; font-size: 11.5px; text-align: left; color: #0f2d4a;">${exp.role || ""}</td>
                  <td style="font-weight: bold; text-align: right; color: #0f2d4a;">${exp.dates || ""}</td>
                </tr>
                <tr>
                  <td style="font-style: italic; font-weight: bold; color: #444; text-align: left;">${exp.company || ""} <span style="font-weight: normal; font-style: normal; color: #666;">- ${exp.location || ""}</span></td>
                  <td></td>
                </tr>
              </table>
              <ul style="margin: 0; padding-left: 15px; font-family: Arial, sans-serif; font-size: 10.5px; color: #222; line-height: 1.5;">
          `;
          if (exp.descriptions) {
            exp.descriptions.forEach((desc) => {
              html += `<li style="margin-bottom: 3.5px; text-align: justify;">${desc}</li>`;
            });
          }
          html += `
              </ul>
            </div>
          `;
        });
        html += `</div>`;
      }

      // 5. Projects
      if (data.projects && data.projects.length > 0) {
        html += `
          <div class="resume-section" style="margin-bottom: 18px;">
            <h2 class="section-title" style="font-family: 'Georgia', serif; font-size: 13px; font-weight: bold; text-transform: uppercase; border-bottom: 1.5px solid #0f2d4a; padding-bottom: 2px; margin: 0 0 8px 0; color: #0f2d4a; letter-spacing: 0.5px;">Key Initiatives & Projects</h2>
        `;
        data.projects.forEach((proj) => {
          html += `
            <div class="resume-item" style="margin-bottom: 10px; page-break-inside: avoid;">
              <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 11px; margin-bottom: 3px;">
                <tr>
                  <td style="font-weight: bold; text-align: left; color: #0f2d4a;">${proj.title || ""}</td>
                  <td style="font-style: italic; text-align: right; color: #555;">${proj.technologies || ""}</td>
                </tr>
              </table>
              <p style="font-family: Arial, sans-serif; font-size: 10.5px; color: #222; line-height: 1.45; margin: 0 0 2px 4px; text-align: justify;">${proj.description || ""}</p>
              ${proj.link ? `<div style="font-family: Arial, sans-serif; font-size: 9.5px; margin-left: 4px; color: #666;">Web/Rep: ${proj.link}</div>` : ""}
            </div>
          `;
        });
        html += `</div>`;
      }

      // 6. Education
      if (data.education && data.education.length > 0) {
        html += `
          <div class="resume-section" style="margin-bottom: 18px;">
            <h2 class="section-title" style="font-family: 'Georgia', serif; font-size: 13px; font-weight: bold; text-transform: uppercase; border-bottom: 1.5px solid #0f2d4a; padding-bottom: 2px; margin: 0 0 8px 0; color: #0f2d4a; letter-spacing: 0.5px;">Education</h2>
        `;
        data.education.forEach((edu) => {
          html += `
            <div class="resume-item" style="margin-bottom: 8px; page-break-inside: avoid;">
              <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 11px;">
                <tr>
                  <td style="font-weight: bold; text-align: left; color: #0f2d4a;">${edu.degree || ""}</td>
                  <td style="font-weight: bold; text-align: right; color: #0f2d4a;">${edu.dates || ""}</td>
                </tr>
                <tr>
                  <td style="color: #444; text-align: left;">${edu.institution || ""} &bull; <span style="font-size: 10px;">${edu.location || ""}</span></td>
                  <td style="text-align: right; font-weight: bold; color: #0f2d4a;">${edu.gpa ? `Grade: ${edu.gpa}` : ""}</td>
                </tr>
              </table>
            </div>
          `;
        });
        html += `</div>`;
      }

      // 7. Certifications
      if (data.certifications && data.certifications.length > 0) {
        html += `
          <div class="resume-section" style="margin-bottom: 0;">
            <h2 class="section-title" style="font-family: 'Georgia', serif; font-size: 13px; font-weight: bold; text-transform: uppercase; border-bottom: 1.5px solid #0f2d4a; padding-bottom: 2px; margin: 0 0 8px 0; color: #0f2d4a; letter-spacing: 0.5px;">Professional Credentials</h2>
            <ul style="margin: 0; padding-left: 15px; font-family: Arial, sans-serif; font-size: 10.5px; color: #222; line-height: 1.5;">
        `;
        data.certifications.forEach((cert) => {
          html += `<li style="margin-bottom: 2px;">${cert}</li>`;
        });
        html += `
            </ul>
          </div>
        `;
      }

      return html;
    }
  },
  academic: {
    id: "academic",
    name: "Academic Scholar",
    description: "Serif-focused, traditional, and elegant. Excellent for researchers, educators, and scholars.",
    render: (data) => {
      // 1. Personal Header
      let html = `
        <div class="resume-header text-center" style="margin-bottom: 24px; border-bottom: 1.5px solid #222; padding-bottom: 8px;">
          <h1 class="resume-name" style="font-family: 'Times New Roman', Times, serif; font-size: 28px; font-weight: normal; margin: 0 0 4px 0; color: #111;">${data.personal.name || ""}</h1>
          <p class="resume-title" style="font-family: 'Times New Roman', Times, serif; font-size: 13px; font-style: italic; color: #444; margin: 0 0 10px 0;">${data.personal.title || ""}</p>
          <div class="resume-contact" style="font-family: 'Times New Roman', Times, serif; font-size: 11px; color: #222; display: flex; flex-wrap: wrap; justify-content: center; gap: 6px 14px;">
            ${data.personal.email ? `<span>${data.personal.email}</span>` : ""}
            ${data.personal.phone ? `<span>&bull; ${data.personal.phone}</span>` : ""}
            ${data.personal.location ? `<span>&bull; ${data.personal.location}</span>` : ""}
            ${data.personal.website ? `<span>&bull; ${data.personal.website}</span>` : ""}
            ${data.personal.linkedin ? `<span>&bull; ${data.personal.linkedin}</span>` : ""}
          </div>
        </div>
      `;

      // 2. Summary
      if (data.summary) {
        html += `
          <div class="resume-section" style="margin-bottom: 20px;">
            <h2 class="section-title" style="font-family: 'Times New Roman', Times, serif; font-size: 14px; font-weight: bold; border-bottom: 1px dashed #333; padding-bottom: 2px; margin: 0 0 8px 0; color: #111; text-transform: uppercase; letter-spacing: 0.5px;">Biography</h2>
            <p style="font-family: 'Times New Roman', Times, serif; font-size: 11.5px; line-height: 1.55; color: #222; margin: 0; text-align: justify;">${data.summary}</p>
          </div>
        `;
      }

      // 3. Skills
      if (data.skills && data.skills.length > 0) {
        html += `
          <div class="resume-section" style="margin-bottom: 20px;">
            <h2 class="section-title" style="font-family: 'Times New Roman', Times, serif; font-size: 14px; font-weight: bold; border-bottom: 1px dashed #333; padding-bottom: 2px; margin: 0 0 8px 0; color: #111; text-transform: uppercase; letter-spacing: 0.5px;">Areas of Expertise</h2>
            <p style="font-family: 'Times New Roman', Times, serif; font-size: 11.5px; line-height: 1.5; color: #222; margin: 0;">${data.skills.join(", ")}</p>
          </div>
        `;
      }

      // 4. Experience
      if (data.experience && data.experience.length > 0) {
        html += `
          <div class="resume-section" style="margin-bottom: 20px;">
            <h2 class="section-title" style="font-family: 'Times New Roman', Times, serif; font-size: 14px; font-weight: bold; border-bottom: 1px dashed #333; padding-bottom: 2px; margin: 0 0 8px 0; color: #111; text-transform: uppercase; letter-spacing: 0.5px;">Professional Experience</h2>
        `;
        data.experience.forEach((exp) => {
          html += `
            <div class="resume-item" style="margin-bottom: 14px; page-break-inside: avoid;">
              <table style="width: 100%; border-collapse: collapse; font-family: 'Times New Roman', Times, serif; font-size: 11.5px; margin-bottom: 3px;">
                <tr>
                  <td style="font-weight: bold; text-align: left; color: #111;">${exp.role || ""}, <span style="font-weight: normal; font-style: italic;">${exp.company || ""}</span></td>
                  <td style="font-weight: bold; text-align: right; color: #111;">${exp.dates || ""}</td>
                </tr>
                <tr>
                  <td style="color: #555; text-align: left; font-size: 11px;">${exp.location || ""}</td>
                  <td></td>
                </tr>
              </table>
              <ul style="margin: 0; padding-left: 18px; font-family: 'Times New Roman', Times, serif; font-size: 11.5px; color: #222; line-height: 1.5;">
          `;
          if (exp.descriptions) {
            exp.descriptions.forEach((desc) => {
              html += `<li style="margin-bottom: 3.5px; text-align: justify;">${desc}</li>`;
            });
          }
          html += `
              </ul>
            </div>
          `;
        });
        html += `</div>`;
      }

      // 5. Projects
      if (data.projects && data.projects.length > 0) {
        html += `
          <div class="resume-section" style="margin-bottom: 20px;">
            <h2 class="section-title" style="font-family: 'Times New Roman', Times, serif; font-size: 14px; font-weight: bold; border-bottom: 1px dashed #333; padding-bottom: 2px; margin: 0 0 8px 0; color: #111; text-transform: uppercase; letter-spacing: 0.5px;">Key Publications & Research</h2>
        `;
        data.projects.forEach((proj) => {
          html += `
            <div class="resume-item" style="margin-bottom: 12px; page-break-inside: avoid;">
              <table style="width: 100%; border-collapse: collapse; font-family: 'Times New Roman', Times, serif; font-size: 11.5px; margin-bottom: 2px;">
                <tr>
                  <td style="font-weight: bold; text-align: left; color: #111;">${proj.title || ""}</td>
                  <td style="font-style: italic; text-align: right; color: #555;">${proj.technologies || ""}</td>
                </tr>
              </table>
              <p style="font-family: 'Times New Roman', Times, serif; font-size: 11.5px; color: #222; line-height: 1.45; margin: 0 0 2px 4px; text-align: justify;">${proj.description || ""}</p>
              ${proj.link ? `<div style="font-family: 'Times New Roman', Times, serif; font-size: 10.5px; margin-left: 4px; color: #555;">Reference: ${proj.link}</div>` : ""}
            </div>
          `;
        });
        html += `</div>`;
      }

      // 6. Education
      if (data.education && data.education.length > 0) {
        html += `
          <div class="resume-section" style="margin-bottom: 20px;">
            <h2 class="section-title" style="font-family: 'Times New Roman', Times, serif; font-size: 14px; font-weight: bold; border-bottom: 1px dashed #333; padding-bottom: 2px; margin: 0 0 8px 0; color: #111; text-transform: uppercase; letter-spacing: 0.5px;">Academic Timeline</h2>
        `;
        data.education.forEach((edu) => {
          html += `
            <div class="resume-item" style="margin-bottom: 8px; page-break-inside: avoid;">
              <table style="width: 100%; border-collapse: collapse; font-family: 'Times New Roman', Times, serif; font-size: 11.5px;">
                <tr>
                  <td style="font-weight: bold; text-align: left; color: #111;">${edu.degree || ""}</td>
                  <td style="font-weight: bold; text-align: right; color: #111;">${edu.dates || ""}</td>
                </tr>
                <tr>
                  <td style="color: #444; text-align: left;">${edu.institution || ""} &bull; <span style="font-size: 11px;">${edu.location || ""}</span></td>
                  <td style="text-align: right; font-weight: bold; color: #111;">${edu.gpa ? `Grade: ${edu.gpa}` : ""}</td>
                </tr>
              </table>
            </div>
          `;
        });
        html += `</div>`;
      }

      // 7. Certifications
      if (data.certifications && data.certifications.length > 0) {
        html += `
          <div class="resume-section" style="margin-bottom: 0;">
            <h2 class="section-title" style="font-family: 'Times New Roman', Times, serif; font-size: 14px; font-weight: bold; border-bottom: 1px dashed #333; padding-bottom: 2px; margin: 0 0 8px 0; color: #111; text-transform: uppercase; letter-spacing: 0.5px;">Academic Certifications</h2>
            <ul style="margin: 0; padding-left: 18px; font-family: 'Times New Roman', Times, serif; font-size: 11.5px; color: #222; line-height: 1.5;">
        `;
        data.certifications.forEach((cert) => {
          html += `<li style="margin-bottom: 2px;">${cert}</li>`;
        });
        html += `
            </ul>
          </div>
        `;
      }

      return html;
    }
  },
  minimalist: {
    id: "minimalist",
    name: "Minimalist Sans",
    description: "Ultra-sleek, clean sans-serif layout. Maximizes clean negative space for creative tech fields.",
    render: (data) => {
      // 1. Personal Header
      let html = `
        <div class="resume-header" style="margin-bottom: 24px;">
          <h1 class="resume-name" style="font-family: 'Inter', sans-serif; font-size: 24px; font-weight: 300; letter-spacing: 1px; margin: 0 0 3px 0; color: #111; text-transform: uppercase;">${data.personal.name || ""}</h1>
          <p class="resume-title" style="font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600; color: #777; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 1.5px;">${data.personal.title || ""}</p>
          <div class="resume-contact" style="font-family: 'Inter', sans-serif; font-size: 10px; color: #666; display: flex; flex-wrap: wrap; justify-content: flex-start; gap: 4px 16px;">
            ${data.personal.email ? `<span>${data.personal.email}</span>` : ""}
            ${data.personal.phone ? `<span>${data.personal.phone}</span>` : ""}
            ${data.personal.location ? `<span>${data.personal.location}</span>` : ""}
            ${data.personal.website ? `<span>${data.personal.website}</span>` : ""}
            ${data.personal.linkedin ? `<span>${data.personal.linkedin}</span>` : ""}
          </div>
        </div>
      `;

      // 2. Summary
      if (data.summary) {
        html += `
          <div class="resume-section" style="margin-bottom: 22px;">
            <p style="font-family: 'Inter', sans-serif; font-size: 11px; line-height: 1.6; color: #444; margin: 0; text-align: justify;">${data.summary}</p>
          </div>
        `;
      }

      // 3. Skills
      if (data.skills && data.skills.length > 0) {
        html += `
          <div class="resume-section" style="margin-bottom: 22px;">
            <h2 class="section-title" style="font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #111; border-bottom: 1px solid #eee; padding-bottom: 4px; margin: 0 0 10px 0;">Skills</h2>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${data.skills.map(skill => `<span style="font-family: 'Inter', sans-serif; font-size: 9.5px; color: #333; background: #f5f5f5; padding: 2px 8px; border-radius: 2px;">${skill}</span>`).join('')}
            </div>
          </div>
        `;
      }

      // 4. Experience
      if (data.experience && data.experience.length > 0) {
        html += `
          <div class="resume-section" style="margin-bottom: 22px;">
            <h2 class="section-title" style="font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #111; border-bottom: 1px solid #eee; padding-bottom: 4px; margin: 0 0 12px 0;">Experience</h2>
        `;
        data.experience.forEach((exp) => {
          html += `
            <div class="resume-item" style="margin-bottom: 14px; page-break-inside: avoid;">
              <table style="width: 100%; border-collapse: collapse; font-family: 'Inter', sans-serif; font-size: 10.5px; margin-bottom: 4px;">
                <tr>
                  <td style="font-weight: bold; text-align: left; color: #111;">${exp.role || ""} <span style="font-weight: normal; color: #666;">at ${exp.company || ""}</span></td>
                  <td style="font-weight: bold; text-align: right; color: #555; font-size: 10px;">${exp.dates || ""}</td>
                </tr>
                <tr>
                  <td style="color: #888; text-align: left; font-size: 9.5px;">${exp.location || ""}</td>
                  <td></td>
                </tr>
              </table>
              <ul style="margin: 0; padding-left: 14px; font-family: 'Inter', sans-serif; font-size: 10.5px; color: #444; line-height: 1.5;">
          `;
          if (exp.descriptions) {
            exp.descriptions.forEach((desc) => {
              html += `<li style="margin-bottom: 3px; text-align: justify;">${desc}</li>`;
            });
          }
          html += `
              </ul>
            </div>
          `;
        });
        html += `</div>`;
      }

      // 5. Projects
      if (data.projects && data.projects.length > 0) {
        html += `
          <div class="resume-section" style="margin-bottom: 22px;">
            <h2 class="section-title" style="font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #111; border-bottom: 1px solid #eee; padding-bottom: 4px; margin: 0 0 12px 0;">Projects</h2>
        `;
        data.projects.forEach((proj) => {
          html += `
            <div class="resume-item" style="margin-bottom: 12px; page-break-inside: avoid;">
              <table style="width: 100%; border-collapse: collapse; font-family: 'Inter', sans-serif; font-size: 10.5px; margin-bottom: 3px;">
                <tr>
                  <td style="font-weight: bold; text-align: left; color: #111;">${proj.title || ""}</td>
                  <td style="font-style: italic; text-align: right; color: #777; font-size: 10px;">${proj.technologies || ""}</td>
                </tr>
              </table>
              <p style="font-family: 'Inter', sans-serif; font-size: 10.5px; color: #444; line-height: 1.45; margin: 0 0 2px 0; text-align: justify;">${proj.description || ""}</p>
              ${proj.link ? `<div style="font-family: 'Inter', sans-serif; font-size: 9.5px; color: #777;">Link: ${proj.link}</div>` : ""}
            </div>
          `;
        });
        html += `</div>`;
      }

      // 6. Education
      if (data.education && data.education.length > 0) {
        html += `
          <div class="resume-section" style="margin-bottom: 22px;">
            <h2 class="section-title" style="font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #111; border-bottom: 1px solid #eee; padding-bottom: 4px; margin: 0 0 12px 0;">Education</h2>
        `;
        data.education.forEach((edu) => {
          html += `
            <div class="resume-item" style="margin-bottom: 8px; page-break-inside: avoid;">
              <table style="width: 100%; border-collapse: collapse; font-family: 'Inter', sans-serif; font-size: 10.5px;">
                <tr>
                  <td style="font-weight: bold; text-align: left; color: #111;">${edu.degree || ""}</td>
                  <td style="font-weight: bold; text-align: right; color: #555; font-size: 10px;">${edu.dates || ""}</td>
                </tr>
                <tr>
                  <td style="color: #666; text-align: left;">${edu.institution || ""} &bull; <span style="font-size: 9.5px;">${edu.location || ""}</span></td>
                  <td style="text-align: right; font-weight: bold; color: #333;">${edu.gpa ? `GPA: ${edu.gpa}` : ""}</td>
                </tr>
              </table>
            </div>
          `;
        });
        html += `</div>`;
      }

      // 7. Certifications
      if (data.certifications && data.certifications.length > 0) {
        html += `
          <div class="resume-section" style="margin-bottom: 0;">
            <h2 class="section-title" style="font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #111; border-bottom: 1px solid #eee; padding-bottom: 4px; margin: 0 0 10px 0;">Certifications</h2>
            <ul style="margin: 0; padding-left: 14px; font-family: 'Inter', sans-serif; font-size: 10.5px; color: #444; line-height: 1.5;">
        `;
        data.certifications.forEach((cert) => {
          html += `<li style="margin-bottom: 2px;">${cert}</li>`;
        });
        html += `
            </ul>
          </div>
        `;
      }

      return html;
    }
  },
  linear: {
    id: "linear",
    name: "Structured Linear",
    description: "Asymmetrical elegant layout featuring a clean, column-balanced tabular flow. Highly readable.",
    render: (data) => {
      // 1. Personal Header
      let html = `
        <div class="resume-header" style="margin-bottom: 22px; border-bottom: 2px solid #555; padding-bottom: 10px;">
          <h1 class="resume-name" style="font-family: Arial, sans-serif; font-size: 26px; font-weight: bold; margin: 0 0 4px 0; color: #222; text-transform: uppercase;">${data.personal.name || ""}</h1>
          <p class="resume-title" style="font-family: Arial, sans-serif; font-size: 12px; font-weight: bold; color: #4A6B62; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">${data.personal.title || ""}</p>
          <div class="resume-contact" style="font-family: Arial, sans-serif; font-size: 10.5px; color: #444; display: flex; flex-wrap: wrap; justify-content: flex-start; gap: 6px 14px;">
            ${data.personal.email ? `<span><strong>Email:</strong> ${data.personal.email}</span>` : ""}
            ${data.personal.phone ? `<span><strong>Phone:</strong> ${data.personal.phone}</span>` : ""}
            ${data.personal.location ? `<span><strong>Location:</strong> ${data.personal.location}</span>` : ""}
            ${data.personal.website ? `<span><strong>Web:</strong> ${data.personal.website}</span>` : ""}
            ${data.personal.linkedin ? `<span><strong>LI:</strong> ${data.personal.linkedin}</span>` : ""}
          </div>
        </div>
      `;

      const renderSectionTable = (title, contentHTML) => {
        return `
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; page-break-inside: avoid;">
            <tr>
              <td style="width: 25%; vertical-align: top; font-family: Arial, sans-serif; font-size: 11.5px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.8px; color: #4A6B62; padding-top: 2px;">
                ${title}
              </td>
              <td style="width: 75%; vertical-align: top; padding-left: 20px; border-left: 1px solid #ddd;">
                ${contentHTML}
              </td>
            </tr>
          </table>
        `;
      };

      // 2. Summary
      if (data.summary) {
        const content = `
          <p style="font-family: Arial, sans-serif; font-size: 11px; line-height: 1.55; color: #333; margin: 0; text-align: justify;">${data.summary}</p>
        `;
        html += renderSectionTable("Profile", content);
      }

      // 3. Skills
      if (data.skills && data.skills.length > 0) {
        const content = `
          <p style="font-family: Arial, sans-serif; font-size: 11px; line-height: 1.5; color: #333; margin: 0;">${data.skills.join(" &bull; ")}</p>
        `;
        html += renderSectionTable("Skills", content);
      }

      // 4. Experience
      if (data.experience && data.experience.length > 0) {
        let content = '';
        data.experience.forEach((exp, index) => {
          content += `
            <div style="margin-bottom: ${index < data.experience.length - 1 ? '14px' : '0'};">
              <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 11px; margin-bottom: 4px;">
                <tr>
                  <td style="font-weight: bold; text-align: left; color: #222;">${exp.role || ""}</td>
                  <td style="font-weight: bold; text-align: right; color: #4A6B62;">${exp.dates || ""}</td>
                </tr>
                <tr>
                  <td style="font-style: italic; color: #555; text-align: left;">${exp.company || ""} &bull; ${exp.location || ""}</td>
                  <td></td>
                </tr>
              </table>
              <ul style="margin: 0; padding-left: 15px; font-family: Arial, sans-serif; font-size: 11px; color: #333; line-height: 1.5;">
          `;
          if (exp.descriptions) {
            exp.descriptions.forEach((desc) => {
              content += `<li style="margin-bottom: 3px; text-align: justify;">${desc}</li>`;
            });
          }
          content += `
              </ul>
            </div>
          `;
        });
        html += renderSectionTable("Experience", content);
      }

      // 5. Projects
      if (data.projects && data.projects.length > 0) {
        let content = '';
        data.projects.forEach((proj, index) => {
          content += `
            <div style="margin-bottom: ${index < data.projects.length - 1 ? '12px' : '0'};">
              <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 11px; margin-bottom: 3px;">
                <tr>
                  <td style="font-weight: bold; text-align: left; color: #222;">${proj.title || ""}</td>
                  <td style="font-style: italic; text-align: right; color: #555; font-size: 10px;">${proj.technologies || ""}</td>
                </tr>
              </table>
              <p style="font-family: Arial, sans-serif; font-size: 11px; color: #333; line-height: 1.45; margin: 0 0 2px 0; text-align: justify;">${proj.description || ""}</p>
              ${proj.link ? `<div style="font-family: Arial, sans-serif; font-size: 9.5px; color: #666;">Link: ${proj.link}</div>` : ""}
            </div>
          `;
        });
        html += renderSectionTable("Projects", content);
      }

      // 6. Education
      if (data.education && data.education.length > 0) {
        let content = '';
        data.education.forEach((edu, index) => {
          content += `
            <div style="margin-bottom: ${index < data.education.length - 1 ? '10px' : '0'};">
              <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 11px;">
                <tr>
                  <td style="font-weight: bold; text-align: left; color: #222;">${edu.degree || ""}</td>
                  <td style="font-weight: bold; text-align: right; color: #555;">${edu.dates || ""}</td>
                </tr>
                <tr>
                  <td style="color: #666; text-align: left;">${edu.institution || ""} &bull; <span style="font-size: 10px;">${edu.location || ""}</span></td>
                  <td style="text-align: right; font-weight: bold; color: #222;">${edu.gpa ? `Grade: ${edu.gpa}` : ""}</td>
                </tr>
              </table>
            </div>
          `;
        });
        html += renderSectionTable("Education", content);
      }

      // 7. Certifications
      if (data.certifications && data.certifications.length > 0) {
        let content = `
          <ul style="margin: 0; padding-left: 15px; font-family: Arial, sans-serif; font-size: 11px; color: #333; line-height: 1.5;">
        `;
        data.certifications.forEach((cert) => {
          content += `<li style="margin-bottom: 2px;">${cert}</li>`;
        });
        content += `</ul>`;
        html += renderSectionTable("Credentials", content);
      }

      return html;
    }
  },
  sidebar: {
    id: "sidebar",
    name: "Split Sidebar",
    description: "Premium two-column layout with a sleek sage green sidebar and clean structured timeline.",
    render: (data) => {
      let html = `
        <div class="sidebar-container" style="display: flex; min-height: 297mm; font-family: 'Inter', Arial, sans-serif; box-sizing: border-box; background: #ffffff;">
          
          <!-- LEFT SIDEBAR COLUMN (Sage Green) -->
          <div class="left-sidebar" style="width: 32%; background-color: #4A6B62; color: #ffffff; padding: 25px 20px; box-sizing: border-box; display: flex; flex-direction: column; gap: 24px;">
            
            <!-- Contact Details -->
            <div>
              <h2 style="font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 700; text-transform: uppercase; border-bottom: 1.5px solid rgba(255,255,255,0.3); padding-bottom: 6px; margin: 0 0 12px 0; color: #ffffff; letter-spacing: 1px;">Contact</h2>
              <div style="font-size: 10.5px; line-height: 1.6; display: flex; flex-direction: column; gap: 6px;">
                ${data.personal.email ? `<div style="word-break: break-all;"><strong>Email:</strong><br>${data.personal.email}</div>` : ""}
                ${data.personal.phone ? `<div><strong>Phone:</strong><br>${data.personal.phone}</div>` : ""}
                ${data.personal.location ? `<div><strong>Location:</strong><br>${data.personal.location}</div>` : ""}
                ${data.personal.website ? `<div style="word-break: break-all;"><strong>Web:</strong><br>${data.personal.website}</div>` : ""}
                ${data.personal.linkedin ? `<div style="word-break: break-all;"><strong>LinkedIn:</strong><br>${data.personal.linkedin}</div>` : ""}
              </div>
            </div>

            <!-- Skills -->
            ${data.skills && data.skills.length > 0 ? `
              <div>
                <h2 style="font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 700; text-transform: uppercase; border-bottom: 1.5px solid rgba(255,255,255,0.3); padding-bottom: 6px; margin: 0 0 12px 0; color: #ffffff; letter-spacing: 1px;">Skills</h2>
                <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                  ${data.skills.map(skill => `
                    <span style="font-size: 9px; padding: 3px 6px; background-color: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25); border-radius: 4px; color: #ffffff;">${skill}</span>
                  `).join('')}
                </div>
              </div>
            ` : ""}

            <!-- Education -->
            ${data.education && data.education.length > 0 ? `
              <div>
                <h2 style="font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 700; text-transform: uppercase; border-bottom: 1.5px solid rgba(255,255,255,0.3); padding-bottom: 6px; margin: 0 0 12px 0; color: #ffffff; letter-spacing: 1px;">Education</h2>
                <div style="display: flex; flex-direction: column; gap: 12px;">
                  ${data.education.map(edu => `
                    <div style="font-size: 10px; line-height: 1.4;">
                      <div style="font-weight: bold; font-size: 10.5px;">${edu.degree}</div>
                      <div style="opacity: 0.9;">${edu.institution}</div>
                      <div style="opacity: 0.75; font-style: italic;">${edu.dates} &bull; ${edu.location}</div>
                      ${edu.gpa ? `<div style="font-weight: 600; margin-top: 2px;">Grade: ${edu.gpa}</div>` : ""}
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ""}

            <!-- Certifications -->
            ${data.certifications && data.certifications.length > 0 ? `
              <div>
                <h2 style="font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 700; text-transform: uppercase; border-bottom: 1.5px solid rgba(255,255,255,0.3); padding-bottom: 6px; margin: 0 0 12px 0; color: #ffffff; letter-spacing: 1px;">Credentials</h2>
                <ul style="margin: 0; padding-left: 12px; font-size: 10px; line-height: 1.45; display: flex; flex-direction: column; gap: 4px;">
                  ${data.certifications.map(cert => `<li>${cert}</li>`).join('')}
                </ul>
              </div>
            ` : ""}

          </div>

          <!-- RIGHT CONTENT COLUMN (Clean Slate/White) -->
          <div class="right-content" style="width: 68%; padding: 30px 25px; box-sizing: border-box; display: flex; flex-direction: column; gap: 24px;">
            
            <!-- Header Block -->
            <div style="border-bottom: 2px solid #eef2f0; padding-bottom: 15px;">
              <h1 style="font-family: 'Outfit', sans-serif; font-size: 28px; font-weight: 800; color: #2A3F3A; margin: 0 0 4px 0; letter-spacing: -0.5px;">${data.personal.name || ""}</h1>
              <p style="font-size: 13px; font-weight: 600; text-transform: uppercase; color: #4A6B62; margin: 0; letter-spacing: 1px;">${data.personal.title || ""}</p>
            </div>

            <!-- Professional Summary -->
            ${data.summary ? `
              <div>
                <h2 style="font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 700; text-transform: uppercase; color: #2A3F3A; border-left: 3px solid #4A6B62; padding-left: 8px; margin: 0 0 10px 0; letter-spacing: 0.8px;">Professional Profile</h2>
                <p style="font-size: 11px; line-height: 1.55; color: #333; margin: 0; text-align: justify;">${data.summary}</p>
              </div>
            ` : ""}

            <!-- Work Experience -->
            ${data.experience && data.experience.length > 0 ? `
              <div>
                <h2 style="font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 700; text-transform: uppercase; color: #2A3F3A; border-left: 3px solid #4A6B62; padding-left: 8px; margin: 0 0 14px 0; letter-spacing: 0.8px;">Work History</h2>
                <div style="display: flex; flex-direction: column; gap: 16px;">
                  ${data.experience.map(exp => `
                    <div style="page-break-inside: avoid;">
                      <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 4px;">
                        <tr>
                          <td style="font-weight: bold; text-align: left; color: #2A3F3A; font-size: 11.5px;">${exp.role} <span style="font-weight: normal; color: #666;">at ${exp.company}</span></td>
                          <td style="font-weight: bold; text-align: right; color: #4A6B62; font-size: 10.5px;">${exp.dates}</td>
                        </tr>
                        <tr>
                          <td style="font-style: italic; color: #777; font-size: 10px;">${exp.location}</td>
                          <td></td>
                        </tr>
                      </table>
                      <ul style="margin: 0; padding-left: 15px; font-size: 10.5px; color: #333; line-height: 1.45;">
                        ${(exp.descriptions || []).map(desc => `<li style="margin-bottom: 3px; text-align: justify;">${desc}</li>`).join('')}
                      </ul>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ""}

            <!-- Key Projects -->
            ${data.projects && data.projects.length > 0 ? `
              <div>
                <h2 style="font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 700; text-transform: uppercase; color: #2A3F3A; border-left: 3px solid #4A6B62; padding-left: 8px; margin: 0 0 14px 0; letter-spacing: 0.8px;">Projects</h2>
                <div style="display: flex; flex-direction: column; gap: 12px;">
                  ${data.projects.map(proj => `
                    <div style="page-break-inside: avoid;">
                      <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 3px;">
                        <tr>
                          <td style="font-weight: bold; text-align: left; color: #2A3F3A;">${proj.title}</td>
                          <td style="font-style: italic; text-align: right; color: #4A6B62; font-weight: bold; font-size: 10.5px;">${proj.technologies}</td>
                        </tr>
                      </table>
                      <p style="font-size: 10.5px; color: #333; line-height: 1.4; margin: 0 0 2px 0; text-align: justify;">${proj.description}</p>
                      ${proj.link ? `<div style="font-size: 9.5px; color: #666;">Code/Demo: <a href="https://${proj.link}" target="_blank" style="color: #4A6B62; text-decoration: none;">${proj.link}</a></div>` : ""}
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ""}

          </div>

        </div>
      `;
      return html;
    }
  }
};

// Automatically wrap all template renderers to deep escape HTML inputs
Object.keys(TEMPLATE_STYLES).forEach(key => {
  const originalRender = TEMPLATE_STYLES[key].render;
  TEMPLATE_STYLES[key].render = function(data) {
    return originalRender(deepEscapeHTML(data));
  };
});

