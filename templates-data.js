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

// Helper engine for modular ATS resume construction
const RenderHelpers = {
  header: (data, font, accentColor, centered = false) => {
    return `
      <div class="resume-header" style="margin-bottom: 18px; text-align: ${centered ? 'center' : 'left'}; border-bottom: 2px solid ${accentColor}; padding-bottom: 10px;">
        <h1 class="resume-name" style="font-family: ${font}; font-size: 24px; font-weight: bold; margin: 0 0 4px 0; color: #111; text-transform: uppercase; letter-spacing: -0.5px;">${data.personal.name || ""}</h1>
        <p class="resume-title" style="font-family: ${font}; font-size: 12px; font-weight: 700; color: ${accentColor}; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 0.8px;">${data.personal.title || ""}</p>
        <div class="resume-contact" style="font-family: Arial, sans-serif; font-size: 10.5px; color: #333; display: flex; flex-wrap: wrap; justify-content: ${centered ? 'center' : 'flex-start'}; gap: 6px 12px; margin-top: 5px; line-height: 1.4;">
          ${data.personal.email ? `<span><strong>Email:</strong> ${data.personal.email}</span>` : ""}
          ${data.personal.phone ? `<span><strong>Phone:</strong> ${data.personal.phone}</span>` : ""}
          ${data.personal.location ? `<span><strong>Location:</strong> ${data.personal.location}</span>` : ""}
          ${data.personal.website ? `<span><strong>Web:</strong> ${data.personal.website}</span>` : ""}
          ${data.personal.linkedin ? `<span><strong>LinkedIn:</strong> ${data.personal.linkedin}</span>` : ""}
        </div>
      </div>
    `;
  },
  
  summary: (data, font, title, accentColor, leftBorder = false) => {
    if (!data.summary) return '';
    return `
      <div class="resume-section" style="margin-bottom: 16px;">
        <h2 class="section-title" style="font-family: ${font}; font-size: 12.5px; font-weight: bold; text-transform: uppercase; ${leftBorder ? 'border-left: 3px solid ' + accentColor + '; padding-left: 8px;' : 'border-bottom: 1px solid ' + accentColor + '; padding-bottom: 3px;'} margin: 0 0 8px 0; color: #111; letter-spacing: 0.5px;">${title}</h2>
        <p style="font-family: Arial, sans-serif; font-size: 10.5px; line-height: 1.5; color: #333; margin: 0; text-align: justify;">${data.summary}</p>
      </div>
    `;
  },

  skills: (data, font, title, accentColor, layoutType = 'bullets') => {
    if (!data.skills || data.skills.length === 0) return '';
    let skillsContent = '';
    
    if (layoutType === 'badges') {
      skillsContent = `<div style="display: flex; flex-wrap: wrap; gap: 5px; margin-top: 6px;">`;
      data.skills.forEach(skill => {
        skillsContent += `<span style="font-family: Arial, sans-serif; font-size: 9.5px; padding: 3px 8px; background-color: #f3f6f5; border-radius: 4px; border: 1px solid #dce4e1; color: #2e4c44; font-weight: 500;">${skill}</span>`;
      });
      skillsContent += `</div>`;
    } else if (layoutType === 'grid') {
      skillsContent = `<div style="font-family: Arial, sans-serif; font-size: 10px; color: #222; line-height: 1.5; display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px 10px; margin-top: 4px;">`;
      data.skills.forEach(skill => {
        skillsContent += `<div>&bull; ${skill}</div>`;
      });
      skillsContent += `</div>`;
    } else { // bullets
      skillsContent = `<p style="font-family: Arial, sans-serif; font-size: 10.5px; line-height: 1.5; color: #333; margin: 0;"><strong>Core Skills:</strong> ${data.skills.join(" &bull; ")}</p>`;
    }

    return `
      <div class="resume-section" style="margin-bottom: 16px;">
        <h2 class="section-title" style="font-family: ${font}; font-size: 12.5px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #eee; padding-bottom: 3px; margin: 0 0 8px 0; color: #111; letter-spacing: 0.5px;">${title}</h2>
        ${skillsContent}
      </div>
    `;
  },

  experience: (data, font, title, accentColor) => {
    if (!data.experience || data.experience.length === 0) return '';
    let html = `
      <div class="resume-section" style="margin-bottom: 16px;">
        <h2 class="section-title" style="font-family: ${font}; font-size: 12.5px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #eee; padding-bottom: 3px; margin: 0 0 8px 0; color: #111; letter-spacing: 0.5px;">${title}</h2>
    `;
    data.experience.forEach(exp => {
      html += `
        <div class="resume-item" style="margin-bottom: 10px; page-break-inside: avoid;">
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10.5px; margin-bottom: 3px;">
            <tr>
              <td style="font-weight: bold; text-align: left; color: #111; font-size: 11px;">${exp.role || ""} <span style="font-weight: normal; color: #555;">at ${exp.company || ""}</span></td>
              <td style="font-weight: bold; text-align: right; color: ${accentColor};">${exp.dates || ""}</td>
            </tr>
            <tr>
              <td style="font-style: italic; color: #666; text-align: left; font-size: 9.5px;">${exp.location || ""}</td>
              <td></td>
            </tr>
          </table>
          <ul style="margin: 0; padding-left: 16px; font-family: Arial, sans-serif; font-size: 10.5px; color: #333; line-height: 1.45;">
      `;
      if (exp.descriptions) {
        exp.descriptions.forEach(desc => {
          html += `<li style="margin-bottom: 2px; text-align: justify;">${desc}</li>`;
        });
      }
      html += `
          </ul>
        </div>
      `;
    });
    html += `</div>`;
    return html;
  },

  projects: (data, font, title, accentColor, showMonoTech = false) => {
    if (!data.projects || data.projects.length === 0) return '';
    let html = `
      <div class="resume-section" style="margin-bottom: 16px;">
        <h2 class="section-title" style="font-family: ${font}; font-size: 12.5px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #eee; padding-bottom: 3px; margin: 0 0 8px 0; color: #111; letter-spacing: 0.5px;">${title}</h2>
    `;
    data.projects.forEach(proj => {
      html += `
        <div class="resume-item" style="margin-bottom: 10px; page-break-inside: avoid;">
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10.5px; margin-bottom: 3px;">
            <tr>
              <td style="font-weight: bold; text-align: left; color: #111;">${proj.title || ""} ${proj.link ? `<span style="font-weight: normal; font-size: 9.5px; color: #666;">(${proj.link})</span>` : ""}</td>
              <td style="font-style: italic; text-align: right; color: ${accentColor}; font-weight: bold; ${showMonoTech ? 'font-family: monospace; font-size: 9.5px;' : ''}">${proj.technologies || ""}</td>
            </tr>
          </table>
          <p style="font-family: Arial, sans-serif; font-size: 10.5px; color: #333; line-height: 1.4; margin: 0 0 0 4px; text-align: justify;">${proj.description || ""}</p>
        </div>
      `;
    });
    html += `</div>`;
    return html;
  },

  education: (data, font, title, accentColor) => {
    if (!data.education || data.education.length === 0) return '';
    let html = `
      <div class="resume-section" style="margin-bottom: 16px;">
        <h2 class="section-title" style="font-family: ${font}; font-size: 12.5px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #eee; padding-bottom: 3px; margin: 0 0 8px 0; color: #111; letter-spacing: 0.5px;">${title}</h2>
    `;
    data.education.forEach(edu => {
      html += `
        <div class="resume-item" style="margin-bottom: 8px; page-break-inside: avoid;">
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10.5px; margin-bottom: 2px;">
            <tr>
              <td style="font-weight: bold; text-align: left; color: #111;">${edu.degree || ""}</td>
              <td style="font-weight: bold; text-align: right; color: ${accentColor};">${edu.dates || ""}</td>
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
    return html;
  },

  certifications: (data, font, title, accentColor) => {
    if (!data.certifications || data.certifications.length === 0) return '';
    let html = `
      <div class="resume-section" style="margin-bottom: 0;">
        <h2 class="section-title" style="font-family: ${font}; font-size: 12.5px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #eee; padding-bottom: 3px; margin: 0 0 8px 0; color: #111; letter-spacing: 0.5px;">${title}</h2>
        <ul style="margin: 0; padding-left: 16px; font-family: Arial, sans-serif; font-size: 10.5px; color: #333; line-height: 1.45;">
    `;
    data.certifications.forEach(cert => {
      html += `<li style="margin-bottom: 2px;">${cert}</li>`;
    });
    html += `
        </ul>
      </div>
    `;
    return html;
  }
};

const TEMPLATE_STYLES = {
  // === SOFTWARE INDUSTRY ===
  software_fresher_minimalist: {
    id: "software_fresher_minimalist",
    name: "Developer Minimalist",
    description: "Ultra-clean single column layout showcasing technical skills and software engineering projects prominently.",
    industry: "software",
    experience: "fresher",
    render: (data) => {
      const font = "'Inter', Arial, sans-serif";
      const accent = "#2d3748";
      let html = '';
      html += RenderHelpers.header(data, font, accent, true); // centered header
      html += RenderHelpers.summary(data, font, "Professional Profile", accent);
      html += RenderHelpers.skills(data, font, "Core Technologies & Skills", accent, "badges");
      html += RenderHelpers.education(data, font, "Academic History", accent);
      html += RenderHelpers.projects(data, font, "Technical Development Projects", accent, true);
      html += RenderHelpers.experience(data, font, "Engineering Internships & Intern Work", accent);
      html += RenderHelpers.certifications(data, font, "Verified Certifications & Credentials", accent);
      return html;
    }
  },
  software_fresher_tech_mono: {
    id: "software_fresher_tech_mono",
    name: "Technical Mono Clean",
    description: "Sleek software engineering style highlighting languages and open-source contributions. Compact text.",
    industry: "software",
    experience: "fresher",
    render: (data) => {
      const font = "Courier New, monospace";
      const accent = "#334e68";
      let html = '';
      html += RenderHelpers.header(data, font, accent, false);
      html += RenderHelpers.skills(data, font, "Skills Directory", accent, "bullets");
      html += RenderHelpers.projects(data, font, "Code Repositories & Prototypes", accent, true);
      html += RenderHelpers.education(data, font, "Education & Credentials", accent);
      html += RenderHelpers.experience(data, font, "Experience History", accent);
      html += RenderHelpers.certifications(data, font, "Technical Badges & Courses", accent);
      return html;
    }
  },
  software_experienced_enterprise: {
    id: "software_experienced_enterprise",
    name: "Enterprise Systems Architect",
    description: "High-density single-column format emphasizing production scaling, microservices, cloud systems, and engineering metrics.",
    industry: "software",
    experience: "experienced",
    render: (data) => {
      const font = "Arial, sans-serif";
      const accent = "#0f2d4a"; // Deep navy
      let html = '';
      html += RenderHelpers.header(data, font, accent, false);
      html += RenderHelpers.summary(data, font, "Executive Summary", accent, true); // left border summary
      html += RenderHelpers.experience(data, font, "Professional History & System Outcomes", accent);
      html += RenderHelpers.skills(data, font, "Enterprise Technology Stack", accent, "grid");
      html += RenderHelpers.projects(data, font, "Key Software Engineering Initiatives", accent);
      html += RenderHelpers.education(data, font, "Academic Credentials", accent);
      html += RenderHelpers.certifications(data, font, "Professional Licenses & Cloud Badges", accent);
      return html;
    }
  },
  software_experienced_sleek: {
    id: "software_experienced_sleek",
    name: "Sleek Tech Director",
    description: "Modern, professional design optimized for experienced managers and tech leads. Clean dividers and serif headers.",
    industry: "software",
    experience: "experienced",
    render: (data) => {
      const font = "Georgia, serif";
      const accent = "#2A3F3A"; // Charcoal/Sage
      let html = '';
      html += RenderHelpers.header(data, font, accent, true);
      html += RenderHelpers.summary(data, font, "Professional Statement", accent);
      html += RenderHelpers.experience(data, font, "Employment Background", accent);
      html += RenderHelpers.skills(data, font, "Domain Competencies", accent, "bullets");
      html += RenderHelpers.projects(data, font, "Selected Architectural Projects", accent, true);
      html += RenderHelpers.education(data, font, "Education", accent);
      html += RenderHelpers.certifications(data, font, "Certifications", accent);
      return html;
    }
  },

  // === DATA SCIENCE & AI ===
  data_science_fresher_analytical: {
    id: "data_science_fresher_analytical",
    name: "Analytical Scholar",
    description: "Designed for aspiring data scientists. Puts statistical tools, ML models, and Jupyter projects first.",
    industry: "data_science",
    experience: "fresher",
    render: (data) => {
      const font = "'Inter', Arial, sans-serif";
      const accent = "#2A4E44"; // Forest accent
      let html = '';
      html += RenderHelpers.header(data, font, accent, false);
      html += RenderHelpers.summary(data, font, "Data Science Statement", accent);
      html += RenderHelpers.skills(data, font, "Machine Learning & Quantitative Directory", accent, "badges");
      html += RenderHelpers.projects(data, font, "Data Modeling & Analytical Projects", accent);
      html += RenderHelpers.education(data, font, "Academic Record", accent);
      html += RenderHelpers.experience(data, font, "Internships & Research Work", accent);
      html += RenderHelpers.certifications(data, font, "Verified Analytics Credentials", accent);
      return html;
    }
  },
  data_science_fresher_quant: {
    id: "data_science_fresher_quant",
    name: "Quantitative Minimalist",
    description: "Tabular, left-aligned standard math/statistics style highlighting programming skills first. Highly structured.",
    industry: "data_science",
    experience: "fresher",
    render: (data) => {
      const font = "Trebuchet MS, sans-serif";
      const accent = "#486581";
      let html = '';
      html += RenderHelpers.header(data, font, accent, true);
      html += RenderHelpers.skills(data, font, "Core Analytics Toolkit", accent, "bullets");
      html += RenderHelpers.education(data, font, "Academic Foundations", accent);
      html += RenderHelpers.projects(data, font, "Quantitative & Kaggle Portfolios", accent, true);
      html += RenderHelpers.experience(data, font, "Relevant Internships", accent);
      html += RenderHelpers.certifications(data, font, "Certifications", accent);
      return html;
    }
  },
  data_science_experienced_mlops: {
    id: "data_science_experienced_mlops",
    name: "MLOps Systems Principal",
    description: "High-density MLOps lead layout detailing deep learning architectures, big data scaling, and business optimization.",
    industry: "data_science",
    experience: "experienced",
    render: (data) => {
      const font = "Arial, sans-serif";
      const accent = "#8a1515"; // Deep crimson
      let html = '';
      html += RenderHelpers.header(data, font, accent, false);
      html += RenderHelpers.summary(data, font, "Executive Summary", accent, true);
      html += RenderHelpers.experience(data, font, "Professional AI & ML Experience", accent);
      html += RenderHelpers.skills(data, font, "MLOps & Cloud Infrastructure Stack", accent, "grid");
      html += RenderHelpers.projects(data, font, "Deployments & Scaled Initiatives", accent);
      html += RenderHelpers.education(data, font, "Education", accent);
      html += RenderHelpers.certifications(data, font, "Professional AI Certifications", accent);
      return html;
    }
  },
  data_science_experienced_principal: {
    id: "data_science_experienced_principal",
    name: "AI Research Director",
    description: "Traditional elegant layout designed for principal scientists. Incorporates paper publications and patents.",
    industry: "data_science",
    experience: "experienced",
    render: (data) => {
      const font = "Georgia, serif";
      const accent = "#4A6B62"; // Sage
      let html = '';
      html += RenderHelpers.header(data, font, accent, true);
      html += RenderHelpers.summary(data, font, "Executive Profile", accent);
      html += RenderHelpers.experience(data, font, "Leading Research & Model Engineering History", accent);
      html += RenderHelpers.skills(data, font, "Statistical & Scientific Competencies", accent, "bullets");
      html += RenderHelpers.projects(data, font, "Key Scientific Publications & Patents", accent);
      html += RenderHelpers.education(data, font, "Academic History", accent);
      html += RenderHelpers.certifications(data, font, "Credentials", accent);
      return html;
    }
  },

  // === ELECTRICAL INDUSTRY ===
  electrical_fresher_hardware: {
    id: "electrical_fresher_hardware",
    name: "Hardware Prototyper",
    description: "Highlights simulation tools, laboratory devices, microcontrollers, and university circuit projects.",
    industry: "electrical",
    experience: "fresher",
    render: (data) => {
      const font = "Arial, sans-serif";
      const accent = "#a05a2c"; // Copper
      let html = '';
      html += RenderHelpers.header(data, font, accent, true);
      html += RenderHelpers.summary(data, font, "Career Summary", accent);
      html += RenderHelpers.skills(data, font, "Hardware & Software Competencies", accent, "badges");
      html += RenderHelpers.education(data, font, "Academic Education", accent);
      html += RenderHelpers.projects(data, font, "Academic Circuit & IoT Projects", accent);
      html += RenderHelpers.experience(data, font, "Industrial Training & Internships", accent);
      html += RenderHelpers.certifications(data, font, "Verified Credentials & CAD Licences", accent);
      return html;
    }
  },
  electrical_fresher_lab: {
    id: "electrical_fresher_lab",
    name: "Lab Systems Clean",
    description: "Minimalist formatting for electrical engineers, emphasizing board designs, sensors, and basic coursework.",
    industry: "electrical",
    experience: "fresher",
    render: (data) => {
      const font = "Trebuchet MS, sans-serif";
      const accent = "#3182ce"; // Blue
      let html = '';
      html += RenderHelpers.header(data, font, accent, false);
      html += RenderHelpers.skills(data, font, "Laboratory Instrument proficiencies", accent, "bullets");
      html += RenderHelpers.projects(data, font, "Electrical Prototype Designs", accent);
      html += RenderHelpers.education(data, font, "Education Foundations", accent);
      html += RenderHelpers.experience(data, font, "Workshop Training History", accent);
      html += RenderHelpers.certifications(data, font, "Courses & Licensing", accent);
      return html;
    }
  },
  electrical_experienced_grid: {
    id: "electrical_experienced_grid",
    name: "Power Grid Systems Specialist",
    description: "Highly structured for senior power engineers. Details SCADA, switchgears, and utility-scale substation work.",
    industry: "electrical",
    experience: "experienced",
    render: (data) => {
      const font = "Georgia, serif";
      const accent = "#0f3c5f"; // Royal
      let html = '';
      html += RenderHelpers.header(data, font, accent, false);
      html += RenderHelpers.summary(data, font, "Executive Profile", accent, true);
      html += RenderHelpers.experience(data, font, "Power Grid Operations & Design History", accent);
      html += RenderHelpers.skills(data, font, "HV Switchgear & Protection Systems", accent, "grid");
      html += RenderHelpers.projects(data, font, "Substation Design Projects & ETAP Analyses", accent);
      html += RenderHelpers.education(data, font, "Education Credentials", accent);
      html += RenderHelpers.certifications(data, font, "Professional Engineering (PE) Licensing", accent);
      return html;
    }
  },
  electrical_experienced_automation: {
    id: "electrical_experienced_automation",
    name: "Automation Project Director",
    description: "Sleek industrial formatting optimized for site supervisors, PLC programmers, and electrical consultants.",
    industry: "electrical",
    experience: "experienced",
    render: (data) => {
      const font = "'Inter', Arial, sans-serif";
      const accent = "#1a202c"; // Charcoal
      let html = '';
      html += RenderHelpers.header(data, font, accent, true);
      html += RenderHelpers.summary(data, font, "Executive Summary", accent);
      html += RenderHelpers.experience(data, font, "Automation Engineering & Site Management History", accent);
      html += RenderHelpers.skills(data, font, "PLC & SCADA Programming Directories", accent, "bullets");
      html += RenderHelpers.projects(data, font, "Key Automated Deployments & Commissions", accent);
      html += RenderHelpers.education(data, font, "Formal Education", accent);
      html += RenderHelpers.certifications(data, font, "Certifications & Standard Compliances", accent);
      return html;
    }
  },

  // === MECHANICAL INDUSTRY ===
  mechanical_fresher_cad: {
    id: "mechanical_fresher_cad",
    name: "CAD Design Engineer",
    description: "Perfect for entry-level mechanical designs. Emphasizes SolidWorks 3D drafting, GD&T, and FSAE racing work.",
    industry: "mechanical",
    experience: "fresher",
    render: (data) => {
      const font = "Arial, sans-serif";
      const accent = "#2c5282"; // Deep blue
      let html = '';
      html += RenderHelpers.header(data, font, accent, true);
      html += RenderHelpers.summary(data, font, "Professional Objective", accent);
      html += RenderHelpers.skills(data, font, "SolidWorks, CAD & Modeling tools", accent, "badges");
      html += RenderHelpers.education(data, font, "Mechanical Education History", accent);
      html += RenderHelpers.projects(data, font, "Academic Design & FSAE Racing Projects", accent);
      html += RenderHelpers.experience(data, font, "Internships & Industrial Apprenticeships", accent);
      html += RenderHelpers.certifications(data, font, "Verified CAD Credentials", accent);
      return html;
    }
  },
  mechanical_fresher_machining: {
    id: "mechanical_fresher_machining",
    name: "Manufacturing & CNC Clean",
    description: "Focuses on shopfloor machining, CNC tooling, thermodynamics, and physical prototypes.",
    industry: "mechanical",
    experience: "fresher",
    render: (data) => {
      const font = "'Inter', sans-serif";
      const accent = "#4a5568";
      let html = '';
      html += RenderHelpers.header(data, font, accent, false);
      html += RenderHelpers.skills(data, font, "CNC Tooling & Lab Skills", accent, "bullets");
      html += RenderHelpers.projects(data, font, "Prototype Assemblies & Machining Lab Projects", accent);
      html += RenderHelpers.education(data, font, "Academic Foundations", accent);
      html += RenderHelpers.experience(data, font, "Workshop Training History", accent);
      html += RenderHelpers.certifications(data, font, "Six Sigma & Engineering Courses", accent);
      return html;
    }
  },
  mechanical_experienced_rd: {
    id: "mechanical_experienced_rd",
    name: "R&D Product Design Director",
    description: "Optimized for consumer and automotive product designers. High density detail for injection molding and DFMEA.",
    industry: "mechanical",
    experience: "experienced",
    render: (data) => {
      const font = "Arial, sans-serif";
      const accent = "#2d3748";
      let html = '';
      html += RenderHelpers.header(data, font, accent, false);
      html += RenderHelpers.summary(data, font, "Executive Statement", accent, true);
      html += RenderHelpers.experience(data, font, "Product Development & R&D Design History", accent);
      html += RenderHelpers.skills(data, font, "DFMEA & Injection Tooling Design directories", accent, "grid");
      html += RenderHelpers.projects(data, font, "Core Design Initiatives & Product Deployments", accent);
      html += RenderHelpers.education(data, font, "Academic Qualifications", accent);
      html += RenderHelpers.certifications(data, font, "Professional CAD Specialist Credentials", accent);
      return html;
    }
  },
  mechanical_experienced_automotive: {
    id: "mechanical_experienced_automotive",
    name: "Automotive Engineering Lead",
    description: "Premium automotive design layout emphasizing crash test analyses, fatigue diagnostics, and factory tooling.",
    industry: "mechanical",
    experience: "experienced",
    render: (data) => {
      const font = "Trebuchet MS, sans-serif";
      const accent = "#9b2c2c"; // Automotive Red
      let html = '';
      html += RenderHelpers.header(data, font, accent, true);
      html += RenderHelpers.summary(data, font, "Professional Executive Summary", accent);
      html += RenderHelpers.experience(data, font, "Automotive Engineering & Vehicle Testing History", accent);
      html += RenderHelpers.skills(data, font, "Fatigue Diagnostics & GD&T Competencies", accent, "bullets");
      html += RenderHelpers.projects(data, font, "Key Vehicle Design & Tooling Programs", accent);
      html += RenderHelpers.education(data, font, "Education History", accent);
      html += RenderHelpers.certifications(data, font, "Specialty Engineering Certifications", accent);
      return html;
    }
  },

  // === CIVIL INDUSTRY ===
  civil_fresher_surveyor: {
    id: "civil_fresher_surveyor",
    name: "Site Surveyor & Estimator",
    description: "Great for site work. Highlights concrete mix labs, surveying instruments, and site reports.",
    industry: "civil",
    experience: "fresher",
    render: (data) => {
      const font = "Arial, sans-serif";
      const accent = "#22543d"; // Deep Green
      let html = '';
      html += RenderHelpers.header(data, font, accent, true);
      html += RenderHelpers.summary(data, font, "Professional Summary", accent);
      html += RenderHelpers.skills(data, font, "Site & Estimating Competencies", accent, "badges");
      html += RenderHelpers.education(data, font, "Civil Education", accent);
      html += RenderHelpers.projects(data, font, "Concrete Technology & Surveying Projects", accent);
      html += RenderHelpers.experience(data, font, "Civil Site Internships", accent);
      html += RenderHelpers.certifications(data, font, "AutoCAD & Revit Certifications", accent);
      return html;
    }
  },
  civil_fresher_structural: {
    id: "civil_fresher_structural",
    name: "Concrete & Revit Scholar",
    description: "Emphasizes Revit modeling, structural analysis calculations, concrete logs, and site training.",
    industry: "civil",
    experience: "fresher",
    render: (data) => {
      const font = "'Inter', sans-serif";
      const accent = "#4a5568";
      let html = '';
      html += RenderHelpers.header(data, font, accent, false);
      html += RenderHelpers.skills(data, font, "Revit & Revit modeling tools", accent, "bullets");
      html += RenderHelpers.projects(data, font, "Structural Analysis Capstone designs", accent);
      html += RenderHelpers.education(data, font, "Foundational Education", accent);
      html += RenderHelpers.experience(data, font, "Apprenticeship & On-site logs", accent);
      html += RenderHelpers.certifications(data, font, "STAAD.Pro & Surveying Credentials", accent);
      return html;
    }
  },
  civil_experienced_pm: {
    id: "civil_experienced_pm",
    name: "Infrastructure Project Manager",
    description: "Slate green accents optimized for high-rise commercial structures, municipal flyovers, and building safety.",
    industry: "civil",
    experience: "experienced",
    render: (data) => {
      const font = "Arial, sans-serif";
      const accent = "#2f5c4b"; // Sage Green
      let html = '';
      html += RenderHelpers.header(data, font, accent, false);
      html += RenderHelpers.summary(data, font, "Executive Summary", accent, true);
      html += RenderHelpers.experience(data, font, "Infrastructure Construction & Project Management History", accent);
      html += RenderHelpers.skills(data, font, "Building Safety & Estimating Competencies", accent, "grid");
      html += RenderHelpers.projects(data, font, "Key Infrastructure & Building Completions", accent);
      html += RenderHelpers.education(data, font, "Academic History", accent);
      html += RenderHelpers.certifications(data, font, "Chartered Engineering Licenses", accent);
      return html;
    }
  },
  civil_experienced_structural: {
    id: "civil_experienced_structural",
    name: "Principal Structural Specialist",
    description: "Traditional styling focusing on seismic dynamic checks, SAFE slab analysis, and bridge foundations.",
    industry: "civil",
    experience: "experienced",
    render: (data) => {
      const font = "Times New Roman, serif";
      const accent = "#1a202c"; // Black
      let html = '';
      html += RenderHelpers.header(data, font, accent, true);
      html += RenderHelpers.summary(data, font, "Professional Profile", accent);
      html += RenderHelpers.experience(data, font, "Seismic Analysis & Structural Design History", accent);
      html += RenderHelpers.skills(data, font, "Structural Standards & SAFE Analysis directories", accent, "bullets");
      html += RenderHelpers.projects(data, font, "High-Rise modeling & Bridge Foundation Projects", accent);
      html += RenderHelpers.education(data, font, "Academic Timeline", accent);
      html += RenderHelpers.certifications(data, font, "Professional Structural Registrations", accent);
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

