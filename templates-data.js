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
  tcs_fresher: {
    personal: {
      name: "Aditya Sharma",
      title: "TCS NQT Candidate / Full-Stack Developer",
      email: "aditya.sharma@email.com",
      phone: "+91 98450 12345",
      location: "Hyderabad, India",
      website: "adityasharma.dev",
      linkedin: "linkedin.com/in/adityasharma-cs"
    },
    summary: "Aspiring Software Engineer & TCS NQT High-Scorer with strong fundamentals in Java, Data Structures, OOPs, and SQL. Hands-on experience developing full-stack web applications and optimizing relational database queries. Proven problem-solving skills with 200+ solved algorithmic challenges on LeetCode.",
    skills: ["Java (Core & OOPs)", "Python", "Data Structures & Algorithms", "SQL (MySQL/PostgreSQL)", "HTML5 / CSS3 / JavaScript", "Spring Boot Basics", "Git & GitHub", "REST APIs"],
    experience: [
      {
        role: "Software Engineering Intern",
        company: "Apex Tech Labs",
        location: "Hyderabad, India",
        dates: "Jun 2025 - Dec 2025",
        descriptions: [
          "Developed backend microservices using Java and Spring Boot, reducing API latency by 22% for student portal.",
          "Designed normalized database schemas in MySQL, improving query execution time across 50,000+ test records.",
          "Collaborated in an agile team of 5 to implement secure JWT token authentication with 100% test coverage."
        ]
      }
    ],
    projects: [
      {
        title: "Campus Placement Automation Portal",
        technologies: "React.js, Node.js, Express, PostgreSQL",
        description: "Engineered a centralized placement drive portal used by 800+ batchmates to track interview rounds and company eligibility.",
        link: "github.com/adityasharma/campus-portal"
      },
      {
        title: "Algorithmic Code Visualizer",
        technologies: "JavaScript, HTML5 Canvas, CSS Grid",
        description: "Built an interactive web tool visualizing sorting and pathfinding algorithms in real-time, receiving 1,200+ GitHub stars.",
        link: "github.com/adityasharma/algo-visualizer"
      }
    ],
    education: [
      {
        degree: "B.Tech in Computer Science & Engineering",
        institution: "JNTU College of Engineering",
        location: "Hyderabad, India",
        dates: "2022 - 2026",
        gpa: "8.7 / 10.0 CGPA"
      }
    ],
    certifications: [
      {
        name: "TCS NQT Certified (Top 10% Band)",
        issuer: "Tata Consultancy Services",
        date: "2026"
      },
      {
        name: "Oracle Certified Foundations Associate, Java",
        issuer: "Oracle University",
        date: "2025"
      }
    ]
  },
  cloud_fresher: {
    personal: {
      name: "Pooja Reddy",
      title: "AWS Cloud & DevOps Engineer",
      email: "pooja.reddy@email.com",
      phone: "+91 97012 34567",
      location: "Bengaluru, India",
      website: "poojareddy.cloud",
      linkedin: "linkedin.com/in/poojareddy-cloud"
    },
    summary: "Cloud & Infrastructure Engineer with hands-on expertise in AWS architectures (EC2, S3, RDS, Lambda), Infrastructure as Code (Terraform), and containerization with Docker. Certified AWS Solutions Architect with a track record of building automated CI/CD deployment pipelines.",
    skills: ["AWS (EC2, S3, RDS, Lambda, VPC, IAM)", "Terraform & CloudFormation", "Docker & Kubernetes Basics", "CI/CD (GitHub Actions, Jenkins)", "Linux Administration & Bash", "Python Scripting", "Monitoring (CloudWatch, Grafana)"],
    experience: [
      {
        role: "Cloud DevOps Intern",
        company: "CloudVantage Technologies",
        location: "Bengaluru, India",
        dates: "Aug 2025 - Feb 2026",
        descriptions: [
          "Provisioned multi-tier VPC network infrastructure across 3 AWS Availability Zones using modular Terraform scripts.",
          "Containerized monolithic Node.js microservices with Docker, reducing deployment cycle times from 45 mins to 6 mins.",
          "Implemented automated AWS CloudWatch metric alerts and IAM least-privilege security policies."
        ]
      }
    ],
    projects: [
      {
        title: "Serverless E-Commerce Event Pipeline",
        technologies: "AWS Lambda, API Gateway, DynamoDB, Python",
        description: "Architected a serverless order processing pipeline handling 10,000+ mock events daily with zero server provisioning overhead.",
        link: "github.com/poojareddy/aws-serverless-pipeline"
      }
    ],
    education: [
      {
        degree: "B.Tech in Information Technology",
        institution: "Vellore Institute of Technology (VIT)",
        location: "Vellore, India",
        dates: "2022 - 2026",
        gpa: "8.9 / 10.0 CGPA"
      }
    ],
    certifications: [
      {
        name: "AWS Certified Solutions Architect – Associate",
        issuer: "Amazon Web Services",
        date: "2025"
      }
    ]
  },
  campus_fresher: {
    personal: {
      name: "Siddharth Verma",
      title: "B.Tech Graduate / Software Engineer",
      email: "siddharth.verma@email.com",
      phone: "+91 99123 45678",
      location: "Pune, India",
      website: "siddharthv.dev",
      linkedin: "linkedin.com/in/siddharth-verma"
    },
    summary: "Goal-driven B.Tech Computer Science graduate with strong command of core CS fundamentals (Operating Systems, DBMS, Computer Networks) and modern full-stack development. Experienced in building responsive web applications, working in collaborative Git workflows, and solving algorithmic problems.",
    skills: ["C++ / Java / Python", "Data Structures & Algorithms", "SQL & Database Design", "React.js & Node.js", "Git & GitHub Version Control", "Linux Shell Scripting", "RESTful API Integration"],
    experience: [
      {
        role: "Full-Stack Web Development Intern",
        company: "CodeCraft Innovations",
        location: "Pune, India",
        dates: "May 2025 - Aug 2025",
        descriptions: [
          "Engineered responsive user dashboards using React.js and CSS Grid, improving user interaction speeds by 25%.",
          "Constructed CRUD REST APIs in Node.js connected to MongoDB, handling over 2,000 daily user requests.",
          "Participated in agile sprints, weekly retrospective reviews, and wrote automated unit tests."
        ]
      }
    ],
    projects: [
      {
        title: "Smart Attendance Management System",
        technologies: "Python, OpenCV, SQLite, Flask",
        description: "Developed a computer vision attendance tool reducing manual classroom roll-call time by 90%.",
        link: "github.com/siddharthv/smart-attendance"
      }
    ],
    education: [
      {
        degree: "Bachelor of Technology in CSE",
        institution: "College of Engineering Pune (COEP)",
        location: "Pune, India",
        dates: "2022 - 2026",
        gpa: "8.6 / 10.0 CGPA"
      }
    ],
    certifications: [
      {
        name: "5-Star Gold Badge in Problem Solving",
        issuer: "HackerRank",
        date: "2025"
      }
    ]
  },
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
  },
  medical_fresher: {
    personal: {
      name: "Dr. Ananya Reddy",
      title: "Junior Resident Medical Officer",
      email: "ananya.reddy@email.com",
      phone: "+91 98765 09876",
      location: "Hyderabad, India",
      website: "ananyareddy.med",
      linkedin: "linkedin.com/in/ananya-reddy-md"
    },
    summary: "Dedicated and compassionate medical graduate (MBBS) with hands-on clinical training during internship at major teaching hospitals. Strong foundations in patient triage, emergency care, and diagnostic analysis. Adept at collaborating in multidisciplinary medical teams to deliver high-quality patient care.",
    skills: ["Clinical Diagnostics", "Patient Care & Triage", "Emergency Medicine", "Basic Life Support (BLS)", "Electronic Health Records (EHR)", "Pharmacology Foundations", "Medical Documentation", "Suturing & Wound Care"],
    experience: [
      {
        role: "Medical Intern",
        company: "Osmania General Hospital",
        location: "Hyderabad, India",
        dates: "Mar 2025 - Mar 2026",
        descriptions: [
          "Completed rotations in General Medicine, Pediatrics, Surgery, and Obstetrics/Gynecology under consultant supervision.",
          "Triaged and assisted in treating 50+ patients daily in the emergency room, ensuring swift stabilizer care.",
          "Maintained detailed and accurate electronic patient charts and records (EHR) for daily consultant rounds."
        ]
      }
    ],
    projects: [
      {
        title: "Community Health Outreach Campaign",
        technologies: "Preventive Care, Public Health",
        description: "Organized a rural health screening camp that provided primary checkups and diabetes screening to 300+ underserved villagers.",
        link: ""
      }
    ],
    education: [
      {
        degree: "Bachelor of Medicine, Bachelor of Surgery (MBBS)",
        institution: "Osmania Medical College",
        location: "Hyderabad, India",
        dates: "2020 - 2025",
        gpa: "7.8/10.0 Grade"
      }
    ],
    certifications: [
      "Basic Life Support (BLS) - American Heart Association (AHA)",
      "Advanced Cardiovascular Life Support (ACLS) - AHA"
    ]
  },
  medical_experienced: {
    personal: {
      name: "Dr. Arshad Khan",
      title: "Consultant Cardiologist",
      email: "arshad.khan@email.com",
      phone: "+91 99000 88000",
      location: "Hyderabad, India",
      website: "arshadkhan-cardio.in",
      linkedin: "linkedin.com/in/arshad-khan-cardio"
    },
    summary: "Board-certified Cardiologist with 8+ years of extensive clinical and interventional cardiology experience. Proven track record in managing acute cardiac emergencies, performing diagnostic angiograms, and directing cardiac ICU departments. Dedicated to patient-centric care and clinical excellence.",
    skills: ["Interventional Cardiology", "Echocardiography (2D/3D)", "Acute Coronary Care", "Clinical Research & Trials", "Patient Diagnostics", "Medical Team Leadership", "ECG Interpretation"],
    experience: [
      {
        role: "Senior Consultant Cardiologist",
        company: "Care Hospitals",
        location: "Hyderabad, India",
        dates: "Jun 2021 - Present",
        descriptions: [
          "Lead the clinical cardiology department, overseeing 20+ resident doctors, nurses, and technicians.",
          "Perform 300+ diagnostic coronary angiograms and non-invasive cardiac procedures annually with 99.4% safety rates.",
          "Designed and implemented a rapid-response protocol for acute myocardial infarction, reducing door-to-balloon times by 15%."
        ]
      },
      {
        role: "Associate Cardiologist",
        company: "Apollo Hospitals",
        location: "Hyderabad, India",
        dates: "Aug 2018 - May 2021",
        descriptions: [
          "Managed daily outpatient clinics seeing 40+ cardiac patients per day and oversaw the 15-bed Cardiac ICU.",
          "Conducted non-invasive testing including stress tests (TMT), Holter monitoring, and transesophageal echoes."
        ]
      }
    ],
    projects: [
      {
        title: "Cardiac Rehabilitation Initiative",
        technologies: "Patient Care Protocols",
        description: "Created a comprehensive post-surgery rehabilitation program that lowered 30-day patient readmission rates by 12%.",
        link: ""
      }
    ],
    education: [
      {
        degree: "DM in Cardiology",
        institution: "Nizam's Institute of Medical Sciences (NIMS)",
        location: "Hyderabad, India",
        dates: "2015 - 2018",
        gpa: "Gold Medalist"
      },
      {
        degree: "MD in General Medicine",
        institution: "Kasturba Medical College",
        location: "Manipal, India",
        dates: "2012 - 2015",
        gpa: ""
      }
    ],
    certifications: [
      "Fellow of the Cardiological Society of India (FCSI)",
      "Board Certified in Internal Medicine and Cardiology"
    ]
  },
  law_fresher: {
    personal: {
      name: "Meera Sen",
      title: "Associate Attorney & Legal Researcher",
      email: "meera.sen@email.com",
      phone: "+91 91122 33445",
      location: "New Delhi, India",
      website: "meerasen-legal.in",
      linkedin: "linkedin.com/in/meera-sen-law"
    },
    summary: "Highly motivated Law Graduate (BA LLB Hons.) with strong legal research, drafting, and analytical writing skills. Practical internship experience in corporate legal departments and High Court litigation. Active participant in moot courts and chief editor of the university law journal.",
    skills: ["Legal Research (Manupatra, Westlaw)", "Drafting Contracts & Pleadings", "Corporate Law", "Litigation Support", "Case Analysis & Briefing", "Written & Verbal Advocacy", "Constitutional Law"],
    experience: [
      {
        role: "Legal Intern",
        company: "Shardul Amarchand Mangaldas & Co",
        location: "New Delhi, India",
        dates: "Jan 2026 - Mar 2026",
        descriptions: [
          "Drafted commercial lease agreements, NDA contracts, and vendor terms under corporate partner supervision.",
          "Conducted legal research on cross-border corporate mergers, compiling 10+ case-law advisory memos.",
          "Assisted in reviewing due diligence documents for a major Rs. 500 Crore acquisition deal."
        ]
      }
    ],
    projects: [
      {
        title: "Editor-in-Chief, NALSAR Law Review",
        technologies: "Legal Editing & Writing",
        description: "Managed the peer-review and editing process for 15+ academic articles on constitutional and environmental law.",
        link: ""
      }
    ],
    education: [
      {
        degree: "B.A. LL.B. (Hons.)",
        institution: "NALSAR University of Law",
        location: "Hyderabad, India",
        dates: "2021 - 2026",
        gpa: "8.2/10.0 CGPA"
      }
    ],
    certifications: [
      "All India Bar Examination (AIBE) Candidate",
      "Certificate Course in Intellectual Property Rights (WIPO)"
    ]
  },
  law_experienced: {
    personal: {
      name: "Rajesh Malhotra",
      title: "Senior Corporate Counsel",
      email: "rajesh.malhotra@email.com",
      phone: "+91 98888 77777",
      location: "Bangalore, India",
      website: "rajesh-law.io",
      linkedin: "linkedin.com/in/rajesh-malhotra-law"
    },
    summary: "Accomplished Corporate Attorney with 8+ years of experience advising Fortune 500 clients on complex mergers and acquisitions, compliance structures, and commercial contracts. Extensive background in negotiating joint ventures, handling corporate litigation, and managing cross-border transactions.",
    skills: ["Mergers & Acquisitions (M&A)", "Corporate Governance", "Contract Negotiation & Drafting", "Cross-Border Transactions", "Regulatory Compliance (FEMA, SEBI)", "Intellectual Property Management", "Commercial Litigation"],
    experience: [
      {
        role: "Senior Legal Counsel",
        company: "Infosys Legal Department",
        location: "Bangalore, India",
        dates: "Jul 2021 - Present",
        descriptions: [
          "Lead the international commercial contracting division, negotiating contracts valued at over $150M in value.",
          "Advise senior executives on SEBI regulations, compliance updates, and corporate dispute strategies.",
          "Standardized the company's NDA and software licensing templates, reducing average contract review cycles by 25%."
        ]
      },
      {
        role: "Associate Attorney",
        company: "AZB & Partners",
        location: "Mumbai, India",
        dates: "May 2018 - Jun 2021",
        descriptions: [
          "Drafted primary transaction documents for 12+ corporate M&A deals, conducting extensive due diligence reports.",
          "Represented corporate clients in regulatory hearings before the National Company Law Tribunal (NCLT)."
        ]
      }
    ],
    projects: [
      {
        title: "Global Compliance Framework Redesign",
        technologies: "Regulatory Compliance",
        description: "Oversaw the implementation of GDPR and data privacy compliance structures across 5 international business units.",
        link: ""
      }
    ],
    education: [
      {
        degree: "Master of Laws (LL.M.) in Corporate Law",
        institution: "New York University School of Law",
        location: "New York, USA",
        dates: "2017 - 2018",
        gpa: "Deans List"
      },
      {
        degree: "B.A. LL.B. (Hons.)",
        institution: "National Law School of India University (NLSIU)",
        location: "Bangalore, India",
        dates: "2012 - 2017",
        gpa: "Gold Medalist"
      }
    ],
    certifications: [
      "Admitted to the Bar Council of Maharashtra & Goa (2017)",
      "Admitted to the New York State Bar (2018)"
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
          ${data.personal.github ? `<span><strong>GitHub:</strong> ${data.personal.github}</span>` : ""}
          ${data.personal.customSocial ? `<span><strong>Portfolio:</strong> ${data.personal.customSocial}</span>` : ""}
        </div>
      </div>
    `;
  },
  
  summary: (data, font, title, accentColor, leftBorder = false) => {
    if (!data.summary) return '';
    return `
      <div class="resume-section" data-section="summary" style="margin-bottom: 16px;">
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
      <div class="resume-section" data-section="skills" style="margin-bottom: 16px;">
        <h2 class="section-title" style="font-family: ${font}; font-size: 12.5px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #eee; padding-bottom: 3px; margin: 0 0 8px 0; color: #111; letter-spacing: 0.5px;">${title}</h2>
        ${skillsContent}
      </div>
    `;
  },

  experience: (data, font, title, accentColor) => {
    if (!data.experience || data.experience.length === 0) return '';
    let html = `
      <div class="resume-section" data-section="experience" style="margin-bottom: 16px;">
        <h2 class="section-title" style="font-family: ${font}; font-size: 12.5px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #eee; padding-bottom: 3px; margin: 0 0 8px 0; color: #111; letter-spacing: 0.5px;">${title}</h2>
    `;
    data.experience.forEach(exp => {
      html += `
        <div class="resume-item" style="margin-bottom: 10px; page-break-inside: avoid;">
          <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10.5px; margin-bottom: 3px;">
            <tr>
              <td style="font-weight: bold; text-align: left; color: #111; font-size: 11px;">${exp.role || ""} <span style="font-weight: normal; color: #555;">${exp.company ? 'at ' + exp.company : ''}</span></td>
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
      <div class="resume-section" data-section="projects" style="margin-bottom: 16px;">
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
      <div class="resume-section" data-section="education" style="margin-bottom: 16px;">
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
              <td style="font-style: italic; color: #333; text-align: left;">
                ${edu.institution || ""}
                ${(edu.institution && edu.location) ? ', ' : ''}
                ${edu.location ? `<span style="font-weight: normal; color: #555;">${edu.location}</span>` : ''}
              </td>
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
      <div class="resume-section" data-section="certifications" style="margin-bottom: 0;">
        <h2 class="section-title" style="font-family: ${font}; font-size: 12.5px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #eee; padding-bottom: 3px; margin: 0 0 8px 0; color: #111; letter-spacing: 0.5px;">${title}</h2>
        <ul style="margin: 0; padding-left: 16px; font-family: Arial, sans-serif; font-size: 10.5px; color: #333; line-height: 1.45;">
    `;
    data.certifications.forEach(cert => {
      if (typeof cert === 'string') {
        html += `<li style="margin-bottom: 2px;">${cert}</li>`;
      } else {
        html += `<li style="margin-bottom: 6px;">`;
        if (cert.name) html += `<div style="font-weight: bold; color: #111;">${cert.name}</div>`;
        if (cert.issuer || cert.date) {
          html += `<div style="font-size: 9.5px; color: ${accentColor}; font-weight: 500; margin-bottom: 2px;">`;
          if (cert.issuer) html += `${cert.issuer}`;
          if (cert.issuer && cert.date) html += ` &bull; `;
          if (cert.date) html += `${cert.date}`;
          html += `</div>`;
        }
        if (cert.desc) {
          html += `<div style="color: #444; margin-top: 1px;">${cert.desc}</div>`;
        }
        html += `</li>`;
      }
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
      html += RenderHelpers.summary(data, font, "Professional Summary", accent);
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
      html += RenderHelpers.summary(data, font, "Professional Summary", accent);
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
      html += RenderHelpers.summary(data, font, "Professional Summary", accent);
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
      html += RenderHelpers.summary(data, font, "Professional Summary", accent);
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
      html += RenderHelpers.summary(data, font, "Professional Summary", accent);
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
  },

  // ==========================================================================
  // ADDED NEW TEMPLATES: 10 STRICT ATS & 5 CREATIVE PREMIUM LAYOUTS
  // ==========================================================================

  // --- 1. SOFTWARE INDUSTRY ---
  software_fresher_hybrid: {
    id: "software_fresher_hybrid",
    name: "Developer Hybrid ATS",
    description: "Skills-forward hybrid structure putting core technologies and capstone repositories in high-visibility blocks above the work timeline.",
    industry: "software",
    experience: "fresher",
    render: (data) => {
      const font = "'Outfit', sans-serif";
      const accent = "#2b6cb0"; // Slate Teal
      let html = '';
      html += RenderHelpers.header(data, font, accent, false);
      html += RenderHelpers.summary(data, font, "Professional Summary", accent);
      html += RenderHelpers.skills(data, font, "Technical Matrix & Core Skills", accent, "badges");
      html += RenderHelpers.projects(data, font, "Selected Engineering Projects", accent, true);
      html += RenderHelpers.experience(data, font, "Work History & Internships", accent);
      html += RenderHelpers.education(data, font, "Academic History", accent);
      html += RenderHelpers.certifications(data, font, "Licensing & Certifications", accent);
      return html;
    }
  },
  software_experienced_cloud: {
    id: "software_experienced_cloud",
    name: "Cloud Architect High-Density",
    description: "High-density technical format designed for senior engineers to fit massive system designs, microservices, and cloud credentials on one page.",
    industry: "software",
    experience: "experienced",
    render: (data) => {
      const font = "Arial, sans-serif";
      const accent = "#1a202c"; // Charcoal
      let html = '';
      html += RenderHelpers.header(data, font, accent, false);
      html += RenderHelpers.summary(data, font, "Professional Scope", accent, true);
      html += RenderHelpers.skills(data, font, "Technical Competency Stack", accent, "grid");
      html += RenderHelpers.experience(data, font, "Professional History & Architectural Outcomes", accent);
      html += RenderHelpers.projects(data, font, "Key Scale & Optimization Projects", accent, true);
      html += RenderHelpers.education(data, font, "Education", accent);
      html += RenderHelpers.certifications(data, font, "Cloud & Enterprise Certifications", accent);
      return html;
    }
  },

  // --- 2. DATA SCIENCE & AI ---
  data_science_fresher_academic: {
    id: "data_science_fresher_academic",
    name: "Academic Scholar ATS",
    description: "Highly structured academic format prioritizing research publications, Kaggle capstones, university degrees, and formal math coursework.",
    industry: "data_science",
    experience: "fresher",
    render: (data) => {
      const font = "Georgia, serif";
      const accent = "#2A4E44"; // Deep Forest Sage
      let html = '';
      html += RenderHelpers.header(data, font, accent, true);
      html += RenderHelpers.summary(data, font, "Research & Career Statement", accent);
      html += RenderHelpers.education(data, font, "Academic Foundations", accent);
      html += RenderHelpers.projects(data, font, "Quantitative & Capstone Portfolio", accent);
      html += RenderHelpers.skills(data, font, "Core Statistical & Programming Toolsets", accent, "bullets");
      html += RenderHelpers.experience(data, font, "Internships & Research Positions", accent);
      html += RenderHelpers.certifications(data, font, "Professional Accreditations", accent);
      return html;
    }
  },
  data_science_experienced_lead: {
    id: "data_science_experienced_lead",
    name: "AI Product Lead ATS",
    description: "Executive layout placing operational metrics, model deployment business outcomes, and MLOps system leadership first.",
    industry: "data_science",
    experience: "experienced",
    render: (data) => {
      const font = "'Inter', sans-serif";
      const accent = "#9b2c2c"; // Crimson Red
      let html = '';
      html += RenderHelpers.header(data, font, accent, false);
      html += RenderHelpers.summary(data, font, "Executive Summary", accent, true);
      html += RenderHelpers.experience(data, font, "Leading Model Engineering & AI Leadership History", accent);
      html += RenderHelpers.skills(data, font, "MLOps & Cloud Infrastructure Tools", accent, "grid");
      html += RenderHelpers.projects(data, font, "Deployed AI Systems & Business Impacts", accent);
      html += RenderHelpers.education(data, font, "Formal Education", accent);
      html += RenderHelpers.certifications(data, font, "Specialist Credentials", accent);
      return html;
    }
  },

  // --- 3. ELECTRICAL INDUSTRY ---
  electrical_fresher_field: {
    id: "electrical_fresher_field",
    name: "Field Operations Entry",
    description: "Practical layout highlighting laboratory tools, safety certifications, board-level testing, and manual instrumentation.",
    industry: "electrical",
    experience: "fresher",
    render: (data) => {
      const font = "Trebuchet MS, sans-serif";
      const accent = "#b7791f"; // Copper
      let html = '';
      html += RenderHelpers.header(data, font, accent, false);
      html += RenderHelpers.summary(data, font, "Professional Summary", accent);
      html += RenderHelpers.skills(data, font, "Laboratory & Instrumentation Competencies", accent, "bullets");
      html += RenderHelpers.projects(data, font, "Hardware Prototyping Projects", accent);
      html += RenderHelpers.education(data, font, "Formal Education", accent);
      html += RenderHelpers.experience(data, font, "Practical Workshop & Site Apprenticeships", accent);
      html += RenderHelpers.certifications(data, font, "Safety Certifications & Technical Badges", accent);
      return html;
    }
  },
  electrical_experienced_consultant: {
    id: "electrical_experienced_consultant",
    name: "Principal Grid Consultant",
    description: "Focused on substation commissioning grids, design consultancy audits, and project bid leadership.",
    industry: "electrical",
    experience: "experienced",
    render: (data) => {
      const font = "'Times New Roman', serif";
      const accent = "#2c5282"; // Royal Blue
      let html = '';
      html += RenderHelpers.header(data, font, accent, true);
      html += RenderHelpers.summary(data, font, "Executive Profile", accent);
      html += RenderHelpers.experience(data, font, "Power Systems & Project Consulting History", accent);
      html += RenderHelpers.skills(data, font, "Grid protection & ETAP Modeling Specialties", accent, "grid");
      html += RenderHelpers.projects(data, font, "Capital Grid Commissions & Protective Redesigns", accent);
      html += RenderHelpers.education(data, font, "Education History", accent);
      html += RenderHelpers.certifications(data, font, "PE Licensing & Advisory Certifications", accent);
      return html;
    }
  },

  // --- 4. MECHANICAL INDUSTRY ---
  mechanical_fresher_robotics: {
    id: "mechanical_fresher_robotics",
    name: "Robotics & Aero Prototyper",
    description: "Tailored for aerospace, automotive, or robotics grads. Prioritizes Formula SAE chassis/aerodynamics work, custom CAD prototypes, and rapid 3D printing checks.",
    industry: "mechanical",
    experience: "fresher",
    render: (data) => {
      const font = "Arial, sans-serif";
      const accent = "#3182ce"; // Steel Blue
      let html = '';
      html += RenderHelpers.header(data, font, accent, false);
      html += RenderHelpers.summary(data, font, "Career Profile", accent);
      html += RenderHelpers.skills(data, font, "CAD, Prototyping & Control Toolkits", accent, "badges");
      html += RenderHelpers.projects(data, font, "Rapid Hardware Design Projects", accent);
      html += RenderHelpers.education(data, font, "Academic Education", accent);
      html += RenderHelpers.experience(data, font, "SAE Design Teams & Workshop Internships", accent);
      html += RenderHelpers.certifications(data, font, "SolidWorks & ANSYS Certifications", accent);
      return html;
    }
  },
  mechanical_experienced_operations: {
    id: "mechanical_experienced_operations",
    name: "Factory Systems Director",
    description: "Focuses on shop floor tooling designs, Six Sigma operational pipelines, and assembly factory logistics.",
    industry: "mechanical",
    experience: "experienced",
    render: (data) => {
      const font = "Georgia, serif";
      const accent = "#2F5C4B"; // Dark Sage
      let html = '';
      html += RenderHelpers.header(data, font, accent, false);
      html += RenderHelpers.summary(data, font, "Executive Summary", accent, true);
      html += RenderHelpers.experience(data, font, "Manufacturing Plant Operations & CAD Design History", accent);
      html += RenderHelpers.skills(data, font, "Six Sigma, Tooling Design & Machining Specialties", accent, "grid");
      html += RenderHelpers.projects(data, font, "Key Automated Tooling & Plant Modernizations", accent);
      html += RenderHelpers.education(data, font, "Education Qualifications", accent);
      html += RenderHelpers.certifications(data, font, "Quality & Design Certifications", accent);
      return html;
    }
  },

  // --- 5. CIVIL INDUSTRY ---
  civil_fresher_infra: {
    id: "civil_fresher_infra",
    name: "Infrastructure Surveyor",
    description: "Highlighting highway and concrete survey camps, concrete mixing logs, and structural AutoCAD drafting assignments.",
    industry: "civil",
    experience: "fresher",
    render: (data) => {
      const font = "'Inter', sans-serif";
      const accent = "#22543d"; // Deep Green
      let html = '';
      html += RenderHelpers.header(data, font, accent, false);
      html += RenderHelpers.summary(data, font, "Professional Profile", accent);
      html += RenderHelpers.education(data, font, "Academic Education", accent);
      html += RenderHelpers.skills(data, font, "Site Surveying & CAD Drafting Competencies", accent, "bullets");
      html += RenderHelpers.experience(data, font, "Apprenticeships & Concrete Logging Logs", accent);
      html += RenderHelpers.projects(data, font, "On-site Projects & Soil Testing capstones", accent);
      html += RenderHelpers.certifications(data, font, "AutoCAD & Surveying Credentials", accent);
      return html;
    }
  },
  civil_experienced_consulting: {
    id: "civil_experienced_consulting",
    name: "Consulting Civil Engineer",
    description: "Optimized for construction contract bids, environmental impact licensing, and structural building auditing.",
    industry: "civil",
    experience: "experienced",
    render: (data) => {
      const font = "'Times New Roman', serif";
      const accent = "#000000"; // Deep Black
      let html = '';
      html += RenderHelpers.header(data, font, accent, false);
      html += RenderHelpers.summary(data, font, "Professional Statement", accent);
      html += RenderHelpers.experience(data, font, "Structural Bidding & Public Works Engineering", accent);
      html += RenderHelpers.skills(data, font, "Estimator Scheduling & Compliance Auditing", accent, "grid");
      html += RenderHelpers.projects(data, font, "Municipal Bridges & Capital Commercial Designs", accent);
      html += RenderHelpers.education(data, font, "Education History", accent);
      html += RenderHelpers.certifications(data, font, "Chartered Structural Engineering Licensing", accent);
      return html;
    }
  },

  // --- 6. PREMIUM HIGH-AESTHETIC CREATIVE (NON-ATS) LAYOUTS ---
  software_creative_dark: {
    id: "software_creative_dark",
    name: "Creative Dark Dev",
    description: "High-impact visual dashboard theme. Features a solid dark slate top header, double-column grid layout, visual horizontal skill bars, and a left-accented vertical timeline.",
    industry: "software",
    experience: "experienced",
    render: (data) => {
      const font = "'Inter', Arial, sans-serif";
      const darkBg = "#0f172a";
      const cardBg = "#1e293b";
      const neonTeal = "#06b6d4";
      const textLight = "#f1f5f9";
      const textSub = "#94a3b8";

      // Render Contact Info
      const email = data.personal.email ? `<span><strong style="color:${neonTeal}">Email:</strong> ${data.personal.email}</span>` : "";
      const phone = data.personal.phone ? `<span><strong style="color:${neonTeal}">Phone:</strong> ${data.personal.phone}</span>` : "";
      const loc = data.personal.location ? `<span><strong style="color:${neonTeal}">Location:</strong> ${data.personal.location}</span>` : "";
      const web = data.personal.website ? `<span><strong style="color:${neonTeal}">Web:</strong> ${data.personal.website}</span>` : "";
      const linkedin = data.personal.linkedin ? `<span><strong style="color:${neonTeal}">LinkedIn:</strong> ${data.personal.linkedin}</span>` : "";
      const github = data.personal.github ? `<span><strong style="color:${neonTeal}">GitHub:</strong> ${data.personal.github}</span>` : "";
      const customSocial = data.personal.customSocial ? `<span><strong style="color:${neonTeal}">Portfolio:</strong> ${data.personal.customSocial}</span>` : "";

      // Skills Visual Progress Bars
      let skillsHTML = '';
      if (data.skills && data.skills.length > 0) {
        data.skills.forEach((skill, i) => {
          // Fake decreasing percentage for premium look
          const pct = Math.max(55, 95 - (i * 6));
          skillsHTML += `
            <div style="margin-bottom: 8px;">
              <div style="display:flex; justify-content:space-between; font-size:9.5px; color:${textLight}; font-weight:600; margin-bottom:3px;">
                <span>${skill}</span>
                <span style="color:${neonTeal}">${pct}%</span>
              </div>
              <div style="background:#334155; height:6px; border-radius:3px;">
                <div style="background:${neonTeal}; height:100%; width:${pct}%; border-radius:3px; box-shadow:0 0 8px ${neonTeal}"></div>
              </div>
            </div>
          `;
        });
      }

      // Experience Timeline
      let expHTML = '';
      if (data.experience && data.experience.length > 0) {
        data.experience.forEach(exp => {
          expHTML += `
            <div style="position:relative; padding-left:18px; margin-bottom:14px; border-left:2px solid ${neonTeal};">
              <div style="position:absolute; left:-6px; top:3px; width:10px; height:10px; border-radius:50%; background:${darkBg}; border:2px solid ${neonTeal}"></div>
              <table style="width:100%; border-collapse:collapse; font-size:10.5px; margin-bottom:3px;">
                <tr>
                  <td style="font-weight:bold; color:${textLight}; font-size:11px;">${exp.role || ""} <span style="font-weight:normal; color:${textSub}">${exp.company ? 'at ' + exp.company : ''}</span></td>
                  <td style="font-weight:bold; text-align:right; color:${neonTeal}">${exp.dates || ""}</td>
                </tr>
                <tr>
                  <td style="font-style:italic; color:${textSub}; font-size:9px;">${exp.location || ""}</td>
                  <td></td>
                </tr>
              </table>
              <ul style="margin:0; padding-left:14px; font-size:10px; color:${textLight}; line-height:1.4;">
                ${exp.descriptions ? exp.descriptions.map(desc => `<li style="margin-bottom:2px;">${desc}</li>`).join('') : ''}
              </ul>
            </div>
          `;
        });
      }

      // Projects
      let projHTML = '';
      if (data.projects && data.projects.length > 0) {
        data.projects.forEach(proj => {
          projHTML += `
            <div style="background:${cardBg}; padding:10px 14px; border-radius:6px; border:1px solid #334155; margin-bottom:8px;">
              <table style="width:100%; border-collapse:collapse; font-size:10px; margin-bottom:3px;">
                <tr>
                  <td style="font-weight:bold; color:${neonTeal};">${proj.title || ""}</td>
                  <td style="font-style:italic; text-align:right; color:${textSub}; font-family:monospace;">${proj.technologies || ""}</td>
                </tr>
              </table>
              <p style="font-size:9.5px; color:${textLight}; line-height:1.35; margin:0;">${proj.description || ""}</p>
            </div>
          `;
        });
      }

      // Education
      let eduHTML = '';
      if (data.education && data.education.length > 0) {
        data.education.forEach(edu => {
          eduHTML += `
            <div style="margin-bottom:6px; font-size:10px;">
              <table style="width:100%; border-collapse:collapse; margin-bottom:2px;">
                <tr>
                  <td style="font-weight:bold; color:${textLight};">${edu.degree || ""}</td>
                  <td style="font-weight:bold; text-align:right; color:${neonTeal}">${edu.dates || ""}</td>
                </tr>
                <tr>
                  <td style="font-style:italic; color:${textSub};">
                    ${edu.institution || ""}
                    ${(edu.institution && edu.location) ? ', ' : ''}
                    ${edu.location || ""}
                  </td>
                  <td style="text-align:right; font-weight:bold; color:${textLight};">${edu.gpa ? `GPA: ${edu.gpa}` : ""}</td>
                </tr>
              </table>
            </div>
          `;
        });
      }

      return `
        <div style="background:${darkBg}; color:${textLight}; font-family:${font}; min-height:100%; box-sizing:border-box; border-radius:4px; overflow:hidden;">
          <!-- Top Creative Header Block -->
          <div style="background:#1e293b; border-bottom:3px solid ${neonTeal}; padding:20px; text-align:center;">
            <h1 style="font-size:26px; font-weight:bold; color:${textLight}; text-transform:uppercase; margin:0 0 2px 0; letter-spacing:1px; text-shadow: 0 0 10px rgba(6,182,212,0.3);">${data.personal.name || ""}</h1>
            <p style="font-size:12px; font-weight:700; color:${neonTeal}; text-transform:uppercase; letter-spacing:1.5px; margin:0 0 10px 0;">${data.personal.title || ""}</p>
            <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:6px 12px; font-size:10px; color:${textSub}; line-height:1.4;">
              ${email} ${phone} ${loc} ${web} ${linkedin} ${github} ${customSocial}
            </div>
          </div>
          
          <!-- Inner Split Column Layout -->
          <div style="display:grid; grid-template-columns:1fr 2fr; gap:16px; padding:18px;">
            <!-- Left Side Grid column (Summary, Skills, Education) -->
            <div>
              ${data.summary ? `
                <div style="margin-bottom:14px;">
                  <h3 style="font-size:11px; font-weight:bold; color:${neonTeal}; border-bottom:1px solid #334155; padding-bottom:3px; margin:0 0 6px 0; text-transform:uppercase;">Profile Summary</h3>
                  <p style="font-size:9.5px; color:${textLight}; line-height:1.45; text-align:justify; margin:0;">${data.summary}</p>
                </div>
              ` : ''}
              
              <div style="margin-bottom:14px;">
                <h3 style="font-size:11px; font-weight:bold; color:${neonTeal}; border-bottom:1px solid #334155; padding-bottom:3px; margin:0 0 6px 0; text-transform:uppercase;">Skill Progress</h3>
                ${skillsHTML}
              </div>

              <div>
                <h3 style="font-size:11px; font-weight:bold; color:${neonTeal}; border-bottom:1px solid #334155; padding-bottom:3px; margin:0 0 6px 0; text-transform:uppercase;">Education</h3>
                ${eduHTML}
              </div>
            </div>
            
            <!-- Right Side Grid column (Experience & Projects) -->
            <div>
              <div style="margin-bottom:14px;">
                <h3 style="font-size:11px; font-weight:bold; color:${neonTeal}; border-bottom:1px solid #334155; padding-bottom:3px; margin:0 0 8px 0; text-transform:uppercase;">Employment Timeline</h3>
                ${expHTML}
              </div>

              <div>
                <h3 style="font-size:11px; font-weight:bold; color:${neonTeal}; border-bottom:1px solid #334155; padding-bottom:3px; margin:0 0 8px 0; text-transform:uppercase;">Key Initiatives</h3>
                ${projHTML}
              </div>
            </div>
          </div>
        </div>
      `;
    }
  },
  data_science_creative_dashboard: {
    id: "data_science_creative_dashboard",
    name: "Creative DS Dashboard",
    description: "Premium visual analytics theme. Uses a solid left sidebar panel for contact & technical tools, visual circular competency badges, and clean grid card blocks.",
    industry: "data_science",
    experience: "experienced",
    render: (data) => {
      const font = "'Inter', sans-serif";
      const sidebarBg = "#1e293b";
      const accent = "#3b82f6"; // DS Analytics Blue
      const cardBorder = "#e2e8f0";
      const textMain = "#1e293b";
      const textSub = "#475569";

      // Render Contact Info
      const email = data.personal.email ? `<div style="margin-bottom:6px;"><strong>Email:</strong><br>${data.personal.email}</div>` : "";
      const phone = data.personal.phone ? `<div style="margin-bottom:6px;"><strong>Phone:</strong><br>${data.personal.phone}</div>` : "";
      const loc = data.personal.location ? `<div style="margin-bottom:6px;"><strong>Location:</strong><br>${data.personal.location}</div>` : "";
      const web = data.personal.website ? `<div style="margin-bottom:6px;"><strong>Web:</strong><br>${data.personal.website}</div>` : "";
      const linkedin = data.personal.linkedin ? `<div style="margin-bottom:6px;"><strong>LinkedIn:</strong><br>${data.personal.linkedin}</div>` : "";
      const github = data.personal.github ? `<div style="margin-bottom:6px;"><strong>GitHub:</strong><br>${data.personal.github}</div>` : "";
      const customSocial = data.personal.customSocial ? `<div style="margin-bottom:6px;"><strong>Portfolio:</strong><br>${data.personal.customSocial}</div>` : "";

      // Visual Bullet points for Skills
      let skillsHTML = '';
      if (data.skills && data.skills.length > 0) {
        skillsHTML = `<div style="display:flex; flex-direction:column; gap:4px; margin-top:4px;">`;
        data.skills.forEach(skill => {
          skillsHTML += `
            <div style="font-size:9.5px; color:#cbd5e1; display:flex; align-items:center; gap:5px;">
              <span style="width:5px; height:5px; border-radius:50%; background:${accent}; display:inline-block;"></span>
              <span>${skill}</span>
            </div>
          `;
        });
        skillsHTML += `</div>`;
      }

      // Experience Timeline
      let expHTML = '';
      if (data.experience && data.experience.length > 0) {
        data.experience.forEach(exp => {
          expHTML += `
            <div style="background:#ffffff; border:1px solid ${cardBorder}; padding:10px 14px; border-radius:8px; margin-bottom:8px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
              <table style="width:100%; border-collapse:collapse; font-size:10px; margin-bottom:3px;">
                <tr>
                  <td style="font-weight:bold; color:${textMain}; font-size:10.5px;">${exp.role || ""}${exp.company ? ` at <span style="color:${accent}">${exp.company}</span>` : ""}</td>
                  <td style="font-weight:bold; text-align:right; color:${accent}">${exp.dates || ""}</td>
                </tr>
                <tr>
                  <td style="font-style:italic; color:${textSub}; font-size:9px;">${exp.location || ""}</td>
                  <td></td>
                </tr>
              </table>
              <ul style="margin:0; padding-left:14px; font-size:9.5px; color:${textSub}; line-height:1.4;">
                ${exp.descriptions ? exp.descriptions.map(desc => `<li style="margin-bottom:2px;">${desc}</li>`).join('') : ''}
              </ul>
            </div>
          `;
        });
      }

      // Projects
      let projHTML = '';
      if (data.projects && data.projects.length > 0) {
        data.projects.forEach(proj => {
          projHTML += `
            <div style="border-left:3px solid ${accent}; background:#f8fafc; padding:8px 12px; margin-bottom:8px; font-size:9.5px;">
              <div style="display:flex; justify-content:space-between; font-weight:bold; color:${textMain}; margin-bottom:2px;">
                <span>${proj.title || ""}</span>
                <span style="color:${accent}; font-family:monospace; font-size:8.5px;">${proj.technologies || ""}</span>
              </div>
              <p style="margin:0 0 2px 0; color:${textSub};">${proj.description || ""}</p>
              ${proj.link ? `<div style="font-size:8.5px; color:${textSub};">Link: <span style="text-decoration:underline;">${proj.link}</span></div>` : ''}
            </div>
          `;
        });
      }

      // Education & Certifications
      let eduHTML = '';
      if (data.education && data.education.length > 0) {
        data.education.forEach(edu => {
          eduHTML += `
            <div style="margin-bottom:6px; font-size:9.5px; border-bottom:1px dashed ${cardBorder}; padding-bottom:4px;">
              <table style="width:100%; border-collapse:collapse; margin-bottom:1px;">
                <tr>
                  <td style="font-weight:bold; color:${textMain};">${edu.degree || ""}</td>
                  <td style="font-weight:bold; text-align:right; color:${accent}">${edu.dates || ""}</td>
                </tr>
              </table>
              <div style="color:${textSub}; font-size:9px;">
                ${edu.institution || ""}
                ${(edu.institution && edu.location) ? ', ' : ''}
                ${edu.location || ""}
                ${edu.gpa ? `| GPA: ${edu.gpa}` : ""}
              </div>
            </div>
          `;
        });
      }

      return `
        <div style="background:#ffffff; color:${textMain}; font-family:${font}; min-height:100%; display:grid; grid-template-columns:1fr 2.2fr; border-radius:4px; overflow:hidden;">
          <!-- Left Visual Sidebar -->
          <div style="background:${sidebarBg}; color:#f1f5f9; padding:22px 16px; display:flex; flex-direction:column; gap:16px;">
            <div style="text-align:center; border-bottom:1px solid #334155; padding-bottom:14px; margin-bottom:4px;">
              <h2 style="font-size:18px; font-weight:bold; margin:0 0 4px 0; color:#ffffff; text-transform:uppercase; letter-spacing:0.5px;">${data.personal.name || ""}</h2>
              <span style="font-size:9.5px; font-weight:700; color:${accent}; text-transform:uppercase; letter-spacing:1px; background:rgba(59,130,246,0.15); padding:3px 8px; border-radius:4px;">${data.personal.title || ""}</span>
            </div>
            
            <div style="font-size:9px; color:#94a3b8; display:flex; flex-direction:column; gap:8px;">
              <h3 style="font-size:10px; font-weight:bold; color:#ffffff; border-bottom:1px solid #334155; padding-bottom:3px; text-transform:uppercase; margin:0;">Contact Info</h3>
              ${email} ${phone} ${loc} ${web} ${linkedin} ${github} ${customSocial}
            </div>

            <div>
              <h3 style="font-size:10px; font-weight:bold; color:#ffffff; border-bottom:1px solid #334155; padding-bottom:3px; text-transform:uppercase; margin:0 0 6px 0;">Analytical Toolkit</h3>
              ${skillsHTML}
            </div>
          </div>
          
          <!-- Right Grid Area -->
          <div style="padding:22px; display:flex; flex-direction:column; gap:16px; background:#fafafa;">
            ${data.summary ? `
              <div>
                <h3 style="font-size:11px; font-weight:bold; color:${accent}; border-bottom:2px solid ${cardBorder}; padding-bottom:3px; margin:0 0 6px 0; text-transform:uppercase;">Data Science Profile</h3>
                <p style="font-size:10px; color:${textSub}; line-height:1.45; text-align:justify; margin:0;">${data.summary}</p>
              </div>
            ` : ''}

            <div>
              <h3 style="font-size:11px; font-weight:bold; color:${accent}; border-bottom:2px solid ${cardBorder}; padding-bottom:3px; margin:0 0 8px 0; text-transform:uppercase;">Model Development & History</h3>
              ${expHTML}
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
              <div>
                <h3 style="font-size:11px; font-weight:bold; color:${accent}; border-bottom:2px solid ${cardBorder}; padding-bottom:3px; margin:0 0 8px 0; text-transform:uppercase;">Kaggle & Portfolios</h3>
                ${projHTML}
              </div>
              <div>
                <h3 style="font-size:11px; font-weight:bold; color:${accent}; border-bottom:2px solid ${cardBorder}; padding-bottom:3px; margin:0 0 8px 0; text-transform:uppercase;">Education & Degrees</h3>
                ${eduHTML}
              </div>
            </div>
          </div>
        </div>
      `;
    }
  },
  electrical_creative_panel: {
    id: "electrical_creative_panel",
    name: "Creative EE Panel",
    description: "Circuit copper visual theme. Highlights microcontroller, board design, and safety licenses inside dedicated visual timeline panels.",
    industry: "electrical",
    experience: "experienced",
    render: (data) => {
      const font = "'Inter', sans-serif";
      const copper = "#d97706"; // EE Copper Accent
      const bgCard = "#fffbeb";
      const cardBorder = "#fcd34d";
      const textMain = "#1e293b";
      const textSub = "#4b5563";

      // Render Contact Info
      const email = data.personal.email ? `<span><strong>Email:</strong> ${data.personal.email}</span>` : "";
      const phone = data.personal.phone ? `<span><strong>Phone:</strong> ${data.personal.phone}</span>` : "";
      const loc = data.personal.location ? `<span><strong>Location:</strong> ${data.personal.location}</span>` : "";
      const web = data.personal.website ? `<span><strong>Web:</strong> ${data.personal.website}</span>` : "";
      const linkedin = data.personal.linkedin ? `<span><strong>LinkedIn:</strong> ${data.personal.linkedin}</span>` : "";
      const github = data.personal.github ? `<span><strong>GitHub:</strong> ${data.personal.github}</span>` : "";
      const customSocial = data.personal.customSocial ? `<span><strong>Portfolio:</strong> ${data.personal.customSocial}</span>` : "";

      // Skills Visual Progress Badges
      let skillsHTML = '';
      if (data.skills && data.skills.length > 0) {
        skillsHTML = `<div style="display:flex; flex-wrap:wrap; gap:5px; margin-top:4px;">`;
        data.skills.forEach(skill => {
          skillsHTML += `<span style="font-size:9.0px; font-weight:500; background:#fef3c7; border:1px solid ${cardBorder}; padding:3px 8px; border-radius:4px; color:${copper};">${skill}</span>`;
        });
        skillsHTML += `</div>`;
      }

      // Experience Timeline
      let expHTML = '';
      if (data.experience && data.experience.length > 0) {
        data.experience.forEach(exp => {
          expHTML += `
            <div style="position:relative; padding-left:20px; margin-bottom:12px; border-left:2px solid ${copper};">
              <div style="position:absolute; left:-7px; top:4px; width:12px; height:12px; border-radius:50%; background:#ffffff; border:3px solid ${copper}"></div>
              <table style="width:100%; border-collapse:collapse; font-size:10.5px; margin-bottom:2px;">
                <tr>
                  <td style="font-weight:bold; color:${textMain}; font-size:11px;">${exp.role || ""} <span style="font-weight:normal; color:${textSub}">${exp.company ? 'at ' + exp.company : ''}</span></td>
                  <td style="font-weight:bold; text-align:right; color:${copper}">${exp.dates || ""}</td>
                </tr>
                <tr>
                  <td style="font-style:italic; color:${textSub}; font-size:9.5px;">${exp.location || ""}</td>
                  <td></td>
                </tr>
              </table>
              <ul style="margin:0; padding-left:14px; font-size:10px; color:${textSub}; line-height:1.45;">
                ${exp.descriptions ? exp.descriptions.map(desc => `<li style="margin-bottom:1px;">${desc}</li>`).join('') : ''}
              </ul>
            </div>
          `;
        });
      }

      // Projects
      let projHTML = '';
      if (data.projects && data.projects.length > 0) {
        data.projects.forEach(proj => {
          projHTML += `
            <div style="background:${bgCard}; border:1px solid ${cardBorder}; padding:10px 14px; border-radius:8px; margin-bottom:8px;">
              <table style="width:100%; border-collapse:collapse; font-size:10px; margin-bottom:3px;">
                <tr>
                  <td style="font-weight:bold; color:${textMain};">${proj.title || ""}</td>
                  <td style="font-style:italic; text-align:right; color:${copper}; font-weight:bold;">${proj.technologies || ""}</td>
                </tr>
              </table>
              <p style="font-size:9.5px; color:${textSub}; margin:0;">${proj.description || ""}</p>
            </div>
          `;
        });
      }

      // Education & Certifications
      let eduHTML = '';
      if (data.education && data.education.length > 0) {
        data.education.forEach(edu => {
          eduHTML += `
            <div style="margin-bottom:6px; font-size:10px;">
              <table style="width:100%; border-collapse:collapse; margin-bottom:1px;">
                <tr>
                  <td style="font-weight:bold; color:${textMain};">${edu.degree || ""}</td>
                  <td style="font-weight:bold; text-align:right; color:${copper}">${edu.dates || ""}</td>
                </tr>
                <tr>
                  <td style="font-style:italic; color:${textSub};">
                    ${edu.institution || ""}
                    ${(edu.institution && edu.location) ? ', ' : ''}
                    ${edu.location || ""}
                  </td>
                  <td style="text-align:right; font-weight:bold; color:${textMain};">${edu.gpa ? `Grade: ${edu.gpa}` : ""}</td>
                </tr>
              </table>
            </div>
          `;
        });
      }

      return `
        <div style="background:#ffffff; color:${textMain}; font-family:${font}; padding:24px; min-height:100%; box-sizing:border-box; border-radius:4px; overflow:hidden;">
          <!-- Top Grid Board Header -->
          <div style="border-bottom:2px solid ${copper}; padding-bottom:12px; margin-bottom:16px;">
            <div style="display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:10px;">
              <div>
                <h1 style="font-size:28px; font-weight:bold; color:${textMain}; text-transform:uppercase; margin:0 0 2px 0;">${data.personal.name || ""}</h1>
                <p style="font-size:12px; font-weight:700; color:${copper}; text-transform:uppercase; letter-spacing:1px; margin:0;">${data.personal.title || ""}</p>
              </div>
              <div style="display:flex; flex-wrap:wrap; gap:4px 10px; font-size:10px; color:${textSub}; text-align:right;">
                ${email} ${phone} ${loc} ${web} ${linkedin} ${github} ${customSocial}
              </div>
            </div>
          </div>
          
          ${data.summary ? `
            <div style="margin-bottom:16px; background:#fffcf2; border-left:4px solid ${copper}; padding:10px 14px; border-radius: 0 6px 6px 0;">
              <h3 style="font-size:11px; font-weight:bold; color:${copper}; text-transform:uppercase; margin:0 0 4px 0;">Career Objective</h3>
              <p style="font-size:10px; color:${textSub}; line-height:1.45; text-align:justify; margin:0;">${data.summary}</p>
            </div>
          ` : ''}

          <!-- Grid Panels -->
          <div style="display:grid; grid-template-columns:1.8fr 1.2fr; gap:20px;">
            <!-- Left Panel (Timeline & Projects) -->
            <div>
              <div style="margin-bottom:16px;">
                <h3 style="font-size:11.5px; font-weight:bold; color:${copper}; border-bottom:1px solid ${cardBorder}; padding-bottom:3px; margin:0 0 8px 0; text-transform:uppercase;">Engineering Operations</h3>
                ${expHTML}
              </div>

              <div>
                <h3 style="font-size:11.5px; font-weight:bold; color:${copper}; border-bottom:1px solid ${cardBorder}; padding-bottom:3px; margin:0 0 8px 0; text-transform:uppercase;">Hardware Prototype Designs</h3>
                ${projHTML}
              </div>
            </div>

            <!-- Right Panel (Skills, Education, Certs) -->
            <div>
              <div style="margin-bottom:16px;">
                <h3 style="font-size:11.5px; font-weight:bold; color:${copper}; border-bottom:1px solid ${cardBorder}; padding-bottom:3px; margin:0 0 8px 0; text-transform:uppercase;">EE Instrument Toolkit</h3>
                ${skillsHTML}
              </div>

              <div style="margin-bottom:16px;">
                <h3 style="font-size:11.5px; font-weight:bold; color:${copper}; border-bottom:1px solid ${cardBorder}; padding-bottom:3px; margin:0 0 8px 0; text-transform:uppercase;">Education</h3>
                ${eduHTML}
              </div>

              ${data.certifications && data.certifications.length > 0 ? `
                <div>
                  <h3 style="font-size:11.5px; font-weight:bold; color:${copper}; border-bottom:1px solid ${cardBorder}; padding-bottom:3px; margin:0 0 8px 0; text-transform:uppercase;">Safety & PE Accreditations</h3>
                  <ul style="margin:0; padding-left:14px; font-size:10px; color:${textSub}; line-height:1.45;">
                    ${data.certifications.map(cert => typeof cert === 'string' ? `<li style="margin-bottom:2px;">${cert}</li>` : `<li style="margin-bottom:6px;">${cert.name ? `<strong>${cert.name}</strong>` : ''}${cert.issuer ? ` <span style="opacity:0.8">(${cert.issuer})</span>` : ''}${cert.desc ? `<br><span style="opacity:0.7">${cert.desc}</span>` : ''}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    }
  },
  mechanical_creative_blueprint: {
    id: "mechanical_creative_blueprint",
    name: "Creative ME Blueprint",
    description: "Premium blueprint design containing split-columns, visual geometric outlines, and CAD competency rating stars.",
    industry: "mechanical",
    experience: "experienced",
    render: (data) => {
      const font = "'Inter', sans-serif";
      const steelBlue = "#1e3a8a"; // Mechanical Steel Blue
      const bgCard = "#f0f4f8";
      const cardBorder = "#cbd5e1";
      const textMain = "#1e293b";
      const textSub = "#475569";

      // Render Contact Info
      const email = data.personal.email ? `<span><strong>Email:</strong> ${data.personal.email}</span>` : "";
      const phone = data.personal.phone ? `<span><strong>Phone:</strong> ${data.personal.phone}</span>` : "";
      const loc = data.personal.location ? `<span><strong>Location:</strong> ${data.personal.location}</span>` : "";
      const web = data.personal.website ? `<span><strong>Web:</strong> ${data.personal.website}</span>` : "";
      const linkedin = data.personal.linkedin ? `<span><strong>LinkedIn:</strong> ${data.personal.linkedin}</span>` : "";
      const github = data.personal.github ? `<span><strong>GitHub:</strong> ${data.personal.github}</span>` : "";
      const customSocial = data.personal.customSocial ? `<span><strong>Portfolio:</strong> ${data.personal.customSocial}</span>` : "";

      // Visual rating stars for Skills
      let skillsHTML = '';
      if (data.skills && data.skills.length > 0) {
        skillsHTML = `<div style="display:flex; flex-direction:column; gap:6px; margin-top:4px;">`;
        data.skills.forEach((skill, i) => {
          // Fake ratings
          const stars = i % 3 === 0 ? '★★★★★' : i % 2 === 0 ? '★★★★☆' : '★★★★☆';
          skillsHTML += `
            <div style="display:flex; justify-content:space-between; font-size:9.5px; color:${textMain}; font-weight:500;">
              <span>${skill}</span>
              <span style="color:${steelBlue}; letter-spacing:1px;">${stars}</span>
            </div>
          `;
        });
        skillsHTML += `</div>`;
      }

      // Experience Timeline
      let expHTML = '';
      if (data.experience && data.experience.length > 0) {
        data.experience.forEach(exp => {
          expHTML += `
            <div style="background:#ffffff; border:1px solid ${cardBorder}; border-radius:6px; padding:10px; margin-bottom:8px;">
              <table style="width:100%; border-collapse:collapse; font-size:10px; margin-bottom:3px;">
                <tr>
                  <td style="font-weight:bold; color:${textMain}; font-size:10.5px;">${exp.role || ""} <span style="font-weight:normal; color:${textSub}">${exp.company ? 'at ' + exp.company : ''}</span></td>
                  <td style="font-weight:bold; text-align:right; color:${steelBlue}">${exp.dates || ""}</td>
                </tr>
                <tr>
                  <td style="font-style:italic; color:${textSub}; font-size:9px;">${exp.location || ""}</td>
                  <td></td>
                </tr>
              </table>
              <ul style="margin:0; padding-left:14px; font-size:9.5px; color:${textSub}; line-height:1.4;">
                ${exp.descriptions ? exp.descriptions.map(desc => `<li style="margin-bottom:2px;">${desc}</li>`).join('') : ''}
              </ul>
            </div>
          `;
        });
      }

      // Projects
      let projHTML = '';
      if (data.projects && data.projects.length > 0) {
        data.projects.forEach(proj => {
          projHTML += `
            <div style="border-left:3px solid ${steelBlue}; background:${bgCard}; padding:8px 12px; margin-bottom:8px; font-size:9.5px;">
              <div style="display:flex; justify-content:space-between; font-weight:bold; color:${textMain}; margin-bottom:2px;">
                <span>${proj.title || ""}</span>
                <span style="color:${steelBlue}; font-family:monospace; font-size:8.5px;">${proj.technologies || ""}</span>
              </div>
              <p style="margin:0; color:${textSub};">${proj.description || ""}</p>
            </div>
          `;
        });
      }

      // Education & Certifications
      let eduHTML = '';
      if (data.education && data.education.length > 0) {
        data.education.forEach(edu => {
          eduHTML += `
            <div style="margin-bottom:6px; font-size:9.5px; border-bottom:1px dashed ${cardBorder}; padding-bottom:4px;">
              <table style="width:100%; border-collapse:collapse; margin-bottom:1px;">
                <tr>
                  <td style="font-weight:bold; color:${textMain};">${edu.degree || ""}</td>
                  <td style="font-weight:bold; text-align:right; color:${steelBlue}">${edu.dates || ""}</td>
                </tr>
              </table>
              <div style="color:${textSub}; font-size:9px;">
                ${edu.institution || ""}
                ${(edu.institution && edu.location) ? ', ' : ''}
                ${edu.location || ""}
                ${edu.gpa ? `| GPA: ${edu.gpa}` : ""}
              </div>
            </div>
          `;
        });
      }

      return `
        <div style="background:#ffffff; color:${textMain}; font-family:${font}; min-height:100%; box-sizing:border-box; border-radius:4px; overflow:hidden; border:2px solid ${steelBlue}">
          <!-- Top blueprint Block Banner -->
          <div style="background:${steelBlue}; color:#ffffff; padding:20px; text-align:center; border-bottom:4px solid #172554;">
            <h1 style="font-size:26px; font-weight:bold; text-transform:uppercase; margin:0 0 2px 0; letter-spacing:1px;">${data.personal.name || ""}</h1>
            <p style="font-size:12px; font-weight:700; color:#93c5fd; text-transform:uppercase; letter-spacing:1.5px; margin:0 0 10px 0;">${data.personal.title || ""}</p>
            <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:6px 12px; font-size:10px; color:#cbd5e1; line-height:1.4;">
              ${email} ${phone} ${loc} ${web} ${linkedin} ${github} ${customSocial}
            </div>
          </div>
          
          <!-- Inner blueprint split columns -->
          <div style="display:grid; grid-template-columns:1fr 2fr; gap:16px; padding:18px;">
            <!-- Left Side Grid Column (Summary, Skills, Education) -->
            <div>
              ${data.summary ? `
                <div style="margin-bottom:14px;">
                  <h3 style="font-size:11px; font-weight:bold; color:${steelBlue}; border-bottom:2px solid ${steelBlue}; padding-bottom:3px; margin:0 0 6px 0; text-transform:uppercase;">Objective</h3>
                  <p style="font-size:9.5px; color:${textSub}; line-height:1.45; text-align:justify; margin:0;">${data.summary}</p>
                </div>
              ` : ''}
              
              <div style="margin-bottom:14px;">
                <h3 style="font-size:11px; font-weight:bold; color:${steelBlue}; border-bottom:2px solid ${steelBlue}; padding-bottom:3px; margin:0 0 6px 0; text-transform:uppercase;">CAD & FEA Toolkit</h3>
                ${skillsHTML}
              </div>

              <div>
                <h3 style="font-size:11px; font-weight:bold; color:${steelBlue}; border-bottom:2px solid ${steelBlue}; padding-bottom:3px; margin:0 0 6px 0; text-transform:uppercase;">Education</h3>
                ${eduHTML}
              </div>
            </div>
            
            <!-- Right Side Grid Column (Experience & Projects) -->
            <div>
              <div style="margin-bottom:14px;">
                <h3 style="font-size:11px; font-weight:bold; color:${steelBlue}; border-bottom:2px solid ${steelBlue}; padding-bottom:3px; margin:0 0 8px 0; text-transform:uppercase;">Professional Design Timeline</h3>
                ${expHTML}
              </div>

              <div>
                <h3 style="font-size:11px; font-weight:bold; color:${steelBlue}; border-bottom:2px solid ${steelBlue}; padding-bottom:3px; margin:0 0 8px 0; text-transform:uppercase;">Key CAD & Prototype Projects</h3>
                ${projHTML}
              </div>
            </div>
          </div>
        </div>
      `;
    }
  },
  civil_creative_split: {
    id: "civil_creative_split",
    name: "Creative Civil Split",
    description: "Premium architectural design. Left 1/3 sidebar has a solid green block with white text for contact and circular progress competency indicators.",
    industry: "civil",
    experience: "experienced",
    render: (data) => {
      const font = "'Inter', sans-serif";
      const greenAccent = "#14532d"; // Architectural Green
      const cardBorder = "#cbd5e1";
      const textMain = "#1e293b";
      const textSub = "#4b5563";

      // Render Contact Info
      const email = data.personal.email ? `<div style="margin-bottom:8px;"><strong>Email:</strong><br>${data.personal.email}</div>` : "";
      const phone = data.personal.phone ? `<div style="margin-bottom:8px;"><strong>Phone:</strong><br>${data.personal.phone}</div>` : "";
      const loc = data.personal.location ? `<div style="margin-bottom:8px;"><strong>Location:</strong><br>${data.personal.location}</div>` : "";
      const web = data.personal.website ? `<div style="margin-bottom:8px;"><strong>Web:</strong><br>${data.personal.website}</div>` : "";
      const linkedin = data.personal.linkedin ? `<div style="margin-bottom:8px;"><strong>LinkedIn:</strong><br>${data.personal.linkedin}</div>` : "";
      const github = data.personal.github ? `<div style="margin-bottom:8px;"><strong>GitHub:</strong><br>${data.personal.github}</div>` : "";
      const customSocial = data.personal.customSocial ? `<div style="margin-bottom:8px;"><strong>Portfolio:</strong><br>${data.personal.customSocial}</div>` : "";

      // Visual circles for Skills
      let skillsHTML = '';
      if (data.skills && data.skills.length > 0) {
        skillsHTML = `<div style="display:flex; flex-direction:column; gap:6px; margin-top:4px;">`;
        data.skills.forEach(skill => {
          skillsHTML += `
            <div style="font-size:9.5px; color:#dcfce7; display:flex; align-items:center; gap:6px;">
              <span style="width:6px; height:6px; border-radius:50%; background:#86efac; display:inline-block; border:1px solid #ffffff;"></span>
              <span>${skill}</span>
            </div>
          `;
        });
        skillsHTML += `</div>`;
      }

      // Experience Timeline
      let expHTML = '';
      if (data.experience && data.experience.length > 0) {
        data.experience.forEach(exp => {
          expHTML += `
            <div style="position:relative; padding-left:18px; margin-bottom:12px; border-left:2px solid ${greenAccent};">
              <div style="position:absolute; left:-6px; top:4px; width:10px; height:10px; border-radius:50%; background:#ffffff; border:2.5px solid ${greenAccent}"></div>
              <table style="width:100%; border-collapse:collapse; font-size:10.5px; margin-bottom:2px;">
                <tr>
                  <td style="font-weight:bold; color:${textMain}; font-size:11px;">${exp.role || ""} <span style="font-weight:normal; color:${textSub}">${exp.company ? 'at ' + exp.company : ''}</span></td>
                  <td style="font-weight:bold; text-align:right; color:${greenAccent}">${exp.dates || ""}</td>
                </tr>
                <tr>
                  <td style="font-style:italic; color:${textSub}; font-size:9.5px;">${exp.location || ""}</td>
                  <td></td>
                </tr>
              </table>
              <ul style="margin:0; padding-left:14px; font-size:10px; color:${textSub}; line-height:1.45;">
                ${exp.descriptions ? exp.descriptions.map(desc => `<li style="margin-bottom:1px;">${desc}</li>`).join('') : ''}
              </ul>
            </div>
          `;
        });
      }

      // Projects
      let projHTML = '';
      if (data.projects && data.projects.length > 0) {
        data.projects.forEach(proj => {
          projHTML += `
            <div style="border-left:3px solid ${greenAccent}; background:#f4fbf7; padding:8px 12px; margin-bottom:8px; font-size:9.5px;">
              <div style="display:flex; justify-content:space-between; font-weight:bold; color:${textMain}; margin-bottom:2px;">
                <span>${proj.title || ""}</span>
                <span style="color:${greenAccent}; font-family:monospace; font-size:8.5px;">${proj.technologies || ""}</span>
              </div>
              <p style="margin:0; color:${textSub};">${proj.description || ""}</p>
            </div>
          `;
        });
      }

      // Education & Certifications
      let eduHTML = '';
      if (data.education && data.education.length > 0) {
        data.education.forEach(edu => {
          eduHTML += `
            <div style="margin-bottom:6px; font-size:9.5px; border-bottom:1px dashed ${cardBorder}; padding-bottom:4px;">
              <table style="width:100%; border-collapse:collapse; margin-bottom:1px;">
                <tr>
                  <td style="font-weight:bold; color:${textMain};">${edu.degree || ""}</td>
                  <td style="font-weight:bold; text-align:right; color:${greenAccent}">${edu.dates || ""}</td>
                </tr>
              </table>
              <div style="color:${textSub}; font-size:9px;">
                ${edu.institution || ""}
                ${(edu.institution && edu.location) ? ', ' : ''}
                ${edu.location || ""}
                ${edu.gpa ? `| GPA: ${edu.gpa}` : ""}
              </div>
            </div>
          `;
        });
      }

      return `
        <div style="background:#ffffff; color:${textMain}; font-family:${font}; min-height:100%; display:grid; grid-template-columns:1fr 2.2fr; border-radius:4px; overflow:hidden;">
          <!-- Left Visual Sidebar -->
          <div style="background:${greenAccent}; color:#f1f5f9; padding:22px 16px; display:flex; flex-direction:column; gap:16px;">
            <div style="text-align:center; border-bottom:1px solid rgba(255,255,255,0.15); padding-bottom:14px; margin-bottom:4px;">
              <h2 style="font-size:18px; font-weight:bold; margin:0 0 4px 0; color:#ffffff; text-transform:uppercase; letter-spacing:0.5px;">${data.personal.name || ""}</h2>
              <span style="font-size:9.5px; font-weight:700; color:#86efac; text-transform:uppercase; letter-spacing:1px; background:rgba(134,239,172,0.15); padding:3px 8px; border-radius:4px;">${data.personal.title || ""}</span>
            </div>
            
            <div style="font-size:9px; color:#dcfce7; display:flex; flex-direction:column; gap:8px;">
              <h3 style="font-size:10px; font-weight:bold; color:#ffffff; border-bottom:1px solid rgba(255,255,255,0.15); padding-bottom:3px; text-transform:uppercase; margin:0;">Contact Info</h3>
              ${email} ${phone} ${loc} ${web} ${linkedin} ${github} ${customSocial}
            </div>

            <div>
              <h3 style="font-size:10px; font-weight:bold; color:#ffffff; border-bottom:1px solid rgba(255,255,255,0.15); padding-bottom:3px; text-transform:uppercase; margin:0 0 6px 0;">Structural Competencies</h3>
              ${skillsHTML}
            </div>
          </div>
          
          <!-- Right Grid Area -->
          <div style="padding:22px; display:flex; flex-direction:column; gap:16px; background:#fafafa;">
            ${data.summary ? `
              <div>
                <h3 style="font-size:11px; font-weight:bold; color:${greenAccent}; border-bottom:2px solid ${cardBorder}; padding-bottom:3px; margin:0 0 6px 0; text-transform:uppercase;">Civil Profile Summary</h3>
                <p style="font-size:10px; color:${textSub}; line-height:1.45; text-align:justify; margin:0;">${data.summary}</p>
              </div>
            ` : ''}

            <div>
              <h3 style="font-size:11px; font-weight:bold; color:${greenAccent}; border-bottom:2px solid ${cardBorder}; padding-bottom:3px; margin:0 0 8px 0; text-transform:uppercase;">Infrastructure Timeline</h3>
              ${expHTML}
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
              <div>
                <h3 style="font-size:11px; font-weight:bold; color:${greenAccent}; border-bottom:2px solid ${cardBorder}; padding-bottom:3px; margin:0 0 8px 0; text-transform:uppercase;">Large Scale Works</h3>
                ${projHTML}
              </div>
              <div>
                <h3 style="font-size:11px; font-weight:bold; color:${greenAccent}; border-bottom:2px solid ${cardBorder}; padding-bottom:3px; margin:0 0 8px 0; text-transform:uppercase;">Education & Degrees</h3>
                ${eduHTML}
              </div>
            </div>
          </div>
        </div>
      `;
    }
  },
  software_experienced_split: {
    id: "software_experienced_split",
    name: "Modern Double-Column Split",
    description: "Sleek double-column layout designed for experienced developers. Places contact details, skills, and credentials in a left-accented column, leaving maximum vertical space for work experience in the main section.",
    industry: "software",
    experience: "experienced",
    render: (data) => {
      const font = "'Outfit', 'Inter', Arial, sans-serif";
      const primaryDark = "#0f172a";
      const secondaryDark = "#1e293b";
      const accent = "#2563eb"; // blue accent
      const sidebarBg = "#f8fafc";
      const textMain = "#334155";
      const textLight = "#64748b";

      // A. Sidebar Items (Left)
      const email = data.personal.email ? `<div style="margin-bottom:6px;"><strong>Email:</strong><div style="font-size:9.5px; word-break:break-all;">${data.personal.email}</div></div>` : "";
      const phone = data.personal.phone ? `<div style="margin-bottom:6px;"><strong>Phone:</strong><div style="font-size:9.5px;">${data.personal.phone}</div></div>` : "";
      const loc = data.personal.location ? `<div style="margin-bottom:6px;"><strong>Location:</strong><div style="font-size:9.5px;">${data.personal.location}</div></div>` : "";
      const web = data.personal.website ? `<div style="margin-bottom:6px;"><strong>Website:</strong><div style="font-size:9.5px; word-break:break-all;"><a href="${data.personal.website}" target="_blank" style="color:${accent}; text-decoration:none;">${data.personal.website.replace(/^https?:\/\//, '')}</a></div></div>` : "";
      const linkedin = data.personal.linkedin ? `<div style="margin-bottom:6px;"><strong>LinkedIn:</strong><div style="font-size:9.5px; word-break:break-all;"><a href="${data.personal.linkedin}" target="_blank" style="color:${accent}; text-decoration:none;">${data.personal.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</a></div></div>` : "";
      const github = data.personal.github ? `<div style="margin-bottom:6px;"><strong>GitHub:</strong><div style="font-size:9.5px; word-break:break-all;"><a href="${data.personal.github}" target="_blank" style="color:${accent}; text-decoration:none;">${data.personal.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}</a></div></div>` : "";
      const customSocial = data.personal.customSocial ? `<div style="margin-bottom:6px;"><strong>Portfolio:</strong><div style="font-size:9.5px; word-break:break-all;">${data.personal.customSocial}</div></div>` : "";

      // Skills HTML as elegant tags
      let skillsHTML = '';
      if (data.skills && data.skills.length > 0) {
        skillsHTML = `
          <div style="margin-top:16px;">
            <h3 style="font-size:10.5px; font-weight:bold; color:${primaryDark}; border-bottom:1.5px solid #cbd5e1; padding-bottom:3px; text-transform:uppercase; margin:0 0 8px 0; letter-spacing:0.5px;">Skills</h3>
            <div style="display:flex; flex-wrap:wrap; gap:4px;">
              ${data.skills.map(skill => `<span style="font-size:9px; background:#e2e8f0; color:${secondaryDark}; padding:3px 6px; border-radius:4px; font-weight:500;">${skill}</span>`).join('')}
            </div>
          </div>
        `;
      }

      // Certifications List
      let certsHTML = '';
      if (data.certifications && data.certifications.length > 0) {
        certsHTML = `
          <div style="margin-top:16px;">
            <h3 style="font-size:10.5px; font-weight:bold; color:${primaryDark}; border-bottom:1.5px solid #cbd5e1; padding-bottom:3px; text-transform:uppercase; margin:0 0 8px 0; letter-spacing:0.5px;">Certifications</h3>
            <div style="display:flex; flex-direction:column; gap:6px;">
              ${data.certifications.map(c => `
                <div style="font-size:9px; color:${textMain}; line-height:1.3;">
                  <strong style="color:${secondaryDark};">${c.name || ''}</strong>
                  ${c.issuer ? `<div style="color:${textLight};">${c.issuer}</div>` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }

      // Education List (Sidebar)
      let eduHTML = '';
      if (data.education && data.education.length > 0) {
        eduHTML = `
          <div style="margin-top:16px;">
            <h3 style="font-size:10.5px; font-weight:bold; color:${primaryDark}; border-bottom:1.5px solid #cbd5e1; padding-bottom:3px; text-transform:uppercase; margin:0 0 8px 0; letter-spacing:0.5px;">Education</h3>
            <div style="display:flex; flex-direction:column; gap:8px;">
              ${data.education.map(e => `
                <div style="font-size:9px; color:${textMain}; line-height:1.3;">
                  <strong style="color:${secondaryDark};">${e.degree || ''}</strong>
                  <div style="color:${textLight};">${e.school || ''}</div>
                  <div style="font-style:italic; color:${textLight};">${e.year || ''}</div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }

      // B. Main Area Items (Right)
      // Work Experience Timeline
      let expHTML = '';
      if (data.experience && data.experience.length > 0) {
        expHTML = data.experience.map(exp => `
          <div style="margin-bottom:12px; page-break-inside:avoid;">
            <div style="display:flex; justify-content:between; align-items:start; margin-bottom:2px;">
              <strong style="font-size:11px; color:${primaryDark};">${exp.role || ''}${exp.company ? ' @ ' + exp.company : ''}</strong>
              <span style="font-size:9.5px; font-weight:600; color:${accent}; white-space:nowrap; margin-left:auto;">${exp.duration || ''}</span>
            </div>
            ${exp.location ? `<div style="font-size:9px; color:${textLight}; margin-bottom:4px; font-style:italic;">${exp.location}</div>` : ''}
            <ul style="margin:0; padding-left:12px; font-size:9.5px; color:${textMain}; line-height:1.45;">
              ${(exp.description || '').split('\n').filter(Boolean).map(bullet => `<li style="margin-bottom:2px;">${bullet.replace(/^-\s*/, '')}</li>`).join('')}
            </ul>
          </div>
        `).join('');
      }

      // Key Projects
      let projHTML = '';
      if (data.projects && data.projects.length > 0) {
        projHTML = data.projects.map(proj => `
          <div style="margin-bottom:10px; page-break-inside:avoid;">
            <div style="display:flex; justify-content:between; align-items:start; margin-bottom:2px;">
              <strong style="font-size:11px; color:${primaryDark};">${proj.name || ''}</strong>
              ${proj.link ? `<a href="${proj.link}" target="_blank" style="font-size:9px; color:${accent}; text-decoration:none; margin-left:auto;">Project Link &rarr;</a>` : ''}
            </div>
            <p style="margin:0; font-size:9.5px; color:${textMain}; line-height:1.45; text-align:justify;">${proj.description || ''}</p>
          </div>
        `).join('');
      }

      return `
        <div style="font-family:${font}; width:794px; min-height:1122px; box-sizing:border-box; display:grid; grid-template-columns:230px 1fr; background:#ffffff; color:${textMain};">
          <!-- Sidebar column -->
          <div style="background:${sidebarBg}; border-right:1px solid #e2e8f0; padding:25px 20px; box-sizing:border-box; display:flex; flex-direction:column; gap:16px;">
            <div>
              <h1 style="font-size:18px; font-weight:800; color:${primaryDark}; margin:0 0 4px 0; line-height:1.2; letter-spacing:-0.5px;">${data.personal.name || ''}</h1>
              <div style="font-size:10px; font-weight:700; color:${accent}; text-transform:uppercase; letter-spacing:1px; margin-bottom:12px;">${data.personal.title || ''}</div>
            </div>
            
            <div style="font-size:9px; color:${textMain}; display:flex; flex-direction:column; gap:6px;">
              <h3 style="font-size:10.5px; font-weight:bold; color:${primaryDark}; border-bottom:1.5px solid #cbd5e1; padding-bottom:3px; text-transform:uppercase; margin:0 0 4px 0; letter-spacing:0.5px;">Contact</h3>
              ${email} ${phone} ${loc} ${web} ${linkedin} ${github} ${customSocial}
            </div>
            
            ${skillsHTML}
            ${eduHTML}
            ${certsHTML}
          </div>

          <!-- Main column -->
          <div style="padding:30px 25px; box-sizing:border-box; display:flex; flex-direction:column; gap:16px;">
            ${data.summary ? `
              <div>
                <h3 style="font-size:11px; font-weight:bold; color:${primaryDark}; border-bottom:2px solid ${primaryDark}; padding-bottom:3px; margin:0 0 6px 0; text-transform:uppercase; letter-spacing:0.5px;">Professional Summary</h3>
                <p style="font-size:9.5px; color:${textMain}; line-height:1.45; text-align:justify; margin:0;">${data.summary}</p>
              </div>
            ` : ''}

            ${expHTML ? `
              <div>
                <h3 style="font-size:11px; font-weight:bold; color:${primaryDark}; border-bottom:2px solid ${primaryDark}; padding-bottom:3px; margin:0 0 10px 0; text-transform:uppercase; letter-spacing:0.5px;">Work Experience</h3>
                ${expHTML}
              </div>
            ` : ''}

            ${projHTML ? `
              <div>
                <h3 style="font-size:11px; font-weight:bold; color:${primaryDark}; border-bottom:2px solid ${primaryDark}; padding-bottom:3px; margin:0 0 10px 0; text-transform:uppercase; letter-spacing:0.5px;">Key Projects</h3>
                ${projHTML}
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }
  },
  medical_fresher_minimalist: {
    id: "medical_fresher_minimalist",
    name: "Clinical Resident Minimalist",
    description: "Traditional single-column layout highlighting clinical rotations, patient triage experience, and emergency medical certifications.",
    industry: "medical",
    experience: "fresher",
    render: (data) => {
      const font = "'Inter', Arial, sans-serif";
      const accent = "#0f766e"; // Teal Medical Accent
      let html = '';
      html += RenderHelpers.header(data, font, accent, false);
      html += RenderHelpers.summary(data, font, "Professional Profile", accent);
      html += RenderHelpers.skills(data, font, "Clinical Competencies & Skills", accent, "badges");
      html += RenderHelpers.experience(data, font, "Clinical Rotations & Internship Details", accent);
      html += RenderHelpers.projects(data, font, "Community Outreach & Research", accent);
      html += RenderHelpers.education(data, font, "Medical Education", accent);
      html += RenderHelpers.certifications(data, font, "Medical Certifications & Licensing", accent);
      return html;
    }
  },
  medical_experienced_clinical: {
    id: "medical_experienced_clinical",
    name: "Consultant Physician Classic",
    description: "Highly structural design emphasizing specialty departments, board certifications, patient safety records, and clinical leadership outcomes.",
    industry: "medical",
    experience: "experienced",
    render: (data) => {
      const font = "Arial, sans-serif";
      const accent = "#0e7490"; // Deep Cyan Medical Accent
      let html = '';
      html += RenderHelpers.header(data, font, accent, true); // Centered
      html += RenderHelpers.summary(data, font, "Clinical Summary", accent);
      html += RenderHelpers.skills(data, font, "Specialty & Clinical Skills", accent, "grid");
      html += RenderHelpers.experience(data, font, "Professional Medical Appointments & Practice", accent);
      html += RenderHelpers.projects(data, font, "Medical Initiatives & Research Contributions", accent);
      html += RenderHelpers.education(data, font, "Medical Qualifications", accent);
      html += RenderHelpers.certifications(data, font, "Board Certifications & Memberships", accent);
      return html;
    }
  },
  law_fresher_legal: {
    id: "law_fresher_legal",
    name: "Classic Legal Apprentice",
    description: "Traditional black-and-white layout utilizing serif fonts, highlighting legal internships, moot court honors, and publication editing.",
    industry: "law",
    experience: "fresher",
    render: (data) => {
      const font = "'Times New Roman', Times, serif"; // Law standard
      const accent = "#111827"; // Formal Charcoal
      let html = '';
      html += RenderHelpers.header(data, font, accent, true); // Centered
      html += RenderHelpers.summary(data, font, "Professional Statement", accent);
      html += RenderHelpers.education(data, font, "Legal Education", accent);
      html += RenderHelpers.experience(data, font, "Legal Internships & Practice", accent);
      html += RenderHelpers.projects(data, font, "Moot Court & Publications", accent);
      html += RenderHelpers.skills(data, font, "Core Competencies", accent, "bullets");
      html += RenderHelpers.certifications(data, font, "Bar Status & Memberships", accent);
      return html;
    }
  },
  law_experienced_corporate: {
    id: "law_experienced_corporate",
    name: "Senior Counsel Traditional",
    description: "High-density legal layout optimized for corporate attorneys to detail bar admissions, deal highlights, and compliance experience.",
    industry: "law",
    experience: "experienced",
    render: (data) => {
      const font = "'Times New Roman', Times, serif"; // Law standard
      const accent = "#1e3a8a"; // Deep Navy
      let html = '';
      html += RenderHelpers.header(data, font, accent, false);
      html += RenderHelpers.summary(data, font, "Executive Scope", accent);
      html += RenderHelpers.experience(data, font, "Legal & Corporate Practice History", accent);
      html += RenderHelpers.education(data, font, "Education & Academics", accent);
      html += RenderHelpers.projects(data, font, "Selected M&A / Transaction Records", accent);
      html += RenderHelpers.skills(data, font, "Legal Competencies & Specialties", accent, "grid");
      html += RenderHelpers.certifications(data, font, "Bar Admissions & Credentials", accent);
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



// ==============================================================================
// 2026 FLAGSHIP ROLE BLUEPRINTS (INSTANT 1-CLICK EDITOR PRE-FILL ENGINE)
// ==============================================================================
window.ROLE_BLUEPRINTS = {
  "software-engineer": {
    "personal": {
      "name": "Sarah Chen",
      "title": "Software Engineer",
      "email": "sarah.chen@email.com",
      "phone": "(555) 019-2834",
      "location": "Seattle, WA",
      "website": "software-engineer-portfolio.dev",
      "linkedin": "linkedin.com/in/software-engineer",
      "github": "github.com/software-engineer"
    },
    "summary": "Results-driven Software Engineer with 4+ years of hands-on experience in Microservices, Distributed Systems, Go, TypeScript, PostgreSQL. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "Microservices",
      "Distributed Systems",
      "Go",
      "TypeScript",
      "PostgreSQL",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Software Engineer",
        "company": "Apex Solutions Inc.",
        "location": "Seattle, WA",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core software engineer initiatives utilizing Microservices and Distributed Systems, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Software Engineer Specialist",
        "company": "Vertex Global Group",
        "location": "Seattle, WA",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Software Engineer Architecture & Workflow Suite",
        "technologies": "Microservices, Distributed Systems, Go",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/software-engineer/enterprise-suite"
      },
      {
        "title": "High-Impact Software Engineer Performance Initiative",
        "technologies": "Distributed Systems, Go, TypeScript",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/software-engineer/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Software",
        "institution": "State University / Institute of Technology",
        "location": "Seattle, WA",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Software Engineer Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "senior-software-developer": {
    "personal": {
      "name": "Marcus Vance",
      "title": "Senior Software Developer",
      "email": "marcus.vance@email.com",
      "phone": "(555) 019-2834",
      "location": "San Francisco, CA",
      "website": "senior-software-developer-portfolio.dev",
      "linkedin": "linkedin.com/in/senior-software-developer",
      "github": "github.com/senior-software-developer"
    },
    "summary": "Results-driven Senior Software Developer with 4+ years of hands-on experience in System Architecture, High-Concurrency, Distributed Caching, Go/Java. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "System Architecture",
      "High-Concurrency",
      "Distributed Caching",
      "Go/Java",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Senior Software Developer",
        "company": "Apex Solutions Inc.",
        "location": "San Francisco, CA",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core senior software developer initiatives utilizing System Architecture and High-Concurrency, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Senior Software Developer Specialist",
        "company": "Vertex Global Group",
        "location": "San Francisco, CA",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Senior Software Developer Architecture & Workflow Suite",
        "technologies": "System Architecture, High-Concurrency, Distributed Caching",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/senior-software-developer/enterprise-suite"
      },
      {
        "title": "High-Impact Senior Software Developer Performance Initiative",
        "technologies": "High-Concurrency, Distributed Caching, Go/Java",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/senior-software-developer/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Senior",
        "institution": "State University / Institute of Technology",
        "location": "San Francisco, CA",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Senior Software Developer Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "backend-developer": {
    "personal": {
      "name": "Nathan Vance",
      "title": "Backend Developer",
      "email": "nathan.vance@email.com",
      "phone": "(555) 019-2834",
      "location": "San Francisco, CA",
      "website": "backend-developer-portfolio.dev",
      "linkedin": "linkedin.com/in/backend-developer",
      "github": "github.com/backend-developer"
    },
    "summary": "Results-driven Backend Developer with 4+ years of hands-on experience in Go, Java Spring Boot, PostgreSQL, Kafka, Redis, Distributed Systems. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "Go",
      "Java Spring Boot",
      "PostgreSQL",
      "Kafka",
      "Redis",
      "Distributed Systems",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Backend Developer",
        "company": "Apex Solutions Inc.",
        "location": "San Francisco, CA",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core backend developer initiatives utilizing Go and Java Spring Boot, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Backend Developer Specialist",
        "company": "Vertex Global Group",
        "location": "San Francisco, CA",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Backend Developer Architecture & Workflow Suite",
        "technologies": "Go, Java Spring Boot, PostgreSQL",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/backend-developer/enterprise-suite"
      },
      {
        "title": "High-Impact Backend Developer Performance Initiative",
        "technologies": "Java Spring Boot, PostgreSQL, Kafka",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/backend-developer/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Backend",
        "institution": "State University / Institute of Technology",
        "location": "San Francisco, CA",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Backend Developer Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "frontend-developer": {
    "personal": {
      "name": "Emily Zhao",
      "title": "Frontend Developer",
      "email": "emily.zhao@email.com",
      "phone": "(555) 019-2834",
      "location": "New York, NY",
      "website": "frontend-developer-portfolio.dev",
      "linkedin": "linkedin.com/in/frontend-developer",
      "github": "github.com/frontend-developer"
    },
    "summary": "Results-driven Frontend Developer with 4+ years of hands-on experience in TypeScript, React.js, Next.js, Core Web Vitals, Tailwind CSS. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "TypeScript",
      "React.js",
      "Next.js",
      "Core Web Vitals",
      "Tailwind CSS",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Frontend Developer",
        "company": "Apex Solutions Inc.",
        "location": "New York, NY",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core frontend developer initiatives utilizing TypeScript and React.js, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Frontend Developer Specialist",
        "company": "Vertex Global Group",
        "location": "New York, NY",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Frontend Developer Architecture & Workflow Suite",
        "technologies": "TypeScript, React.js, Next.js",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/frontend-developer/enterprise-suite"
      },
      {
        "title": "High-Impact Frontend Developer Performance Initiative",
        "technologies": "React.js, Next.js, Core Web Vitals",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/frontend-developer/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Frontend",
        "institution": "State University / Institute of Technology",
        "location": "New York, NY",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Frontend Developer Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "java-developer-2-years-experience": {
    "personal": {
      "name": "Karthik Verma",
      "title": "Java Developer (2+ Years)",
      "email": "karthik.verma@email.com",
      "phone": "(555) 019-2834",
      "location": "Bengaluru, India",
      "website": "java-developer-2-years-experience-portfolio.dev",
      "linkedin": "linkedin.com/in/java-developer-2-years-experience",
      "github": "github.com/java-developer-2-years-experience"
    },
    "summary": "Results-driven Java Developer (2+ Years) with 4+ years of hands-on experience in Core Java, Spring Boot, Microservices, Hibernate, REST APIs, MySQL. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "Core Java",
      "Spring Boot",
      "Microservices",
      "Hibernate",
      "REST APIs",
      "MySQL",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Java Developer (2+ Years)",
        "company": "Apex Solutions Inc.",
        "location": "Bengaluru, India",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core java developer (2+ years) initiatives utilizing Core Java and Spring Boot, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Java Developer (2+ Years) Specialist",
        "company": "Vertex Global Group",
        "location": "Bengaluru, India",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Java Developer (2+ Years) Architecture & Workflow Suite",
        "technologies": "Core Java, Spring Boot, Microservices",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/java-developer-2-years-experience/enterprise-suite"
      },
      {
        "title": "High-Impact Java Developer (2+ Years) Performance Initiative",
        "technologies": "Spring Boot, Microservices, Hibernate",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/java-developer-2-years-experience/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Java",
        "institution": "State University / Institute of Technology",
        "location": "Bengaluru, India",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Java Developer (2+ Years) Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "devops-engineer": {
    "personal": {
      "name": "Alexandre Dubois",
      "title": "DevOps Engineer",
      "email": "alexandre.dubois@email.com",
      "phone": "(555) 019-2834",
      "location": "Austin, TX",
      "website": "devops-engineer-portfolio.dev",
      "linkedin": "linkedin.com/in/devops-engineer",
      "github": "github.com/devops-engineer"
    },
    "summary": "Results-driven DevOps Engineer with 4+ years of hands-on experience in Kubernetes, Docker, Terraform, CI/CD, ArgoCD, Prometheus, AWS. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "Kubernetes",
      "Docker",
      "Terraform",
      "CI/CD",
      "ArgoCD",
      "Prometheus",
      "AWS",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead DevOps Engineer",
        "company": "Apex Solutions Inc.",
        "location": "Austin, TX",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core devops engineer initiatives utilizing Kubernetes and Docker, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "DevOps Engineer Specialist",
        "company": "Vertex Global Group",
        "location": "Austin, TX",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise DevOps Engineer Architecture & Workflow Suite",
        "technologies": "Kubernetes, Docker, Terraform",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/devops-engineer/enterprise-suite"
      },
      {
        "title": "High-Impact DevOps Engineer Performance Initiative",
        "technologies": "Docker, Terraform, CI/CD",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/devops-engineer/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in DevOps",
        "institution": "State University / Institute of Technology",
        "location": "Austin, TX",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified DevOps Engineer Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "aws-cloud-engineer": {
    "personal": {
      "name": "Jordan Hayes",
      "title": "AWS Cloud Engineer",
      "email": "jordan.hayes@email.com",
      "phone": "(555) 019-2834",
      "location": "Seattle, WA",
      "website": "aws-cloud-engineer-portfolio.dev",
      "linkedin": "linkedin.com/in/aws-cloud-engineer",
      "github": "github.com/aws-cloud-engineer"
    },
    "summary": "Results-driven AWS Cloud Engineer with 4+ years of hands-on experience in AWS EKS, Terraform, Lambda, Aurora, FinOps, Multi-Region IaC. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "AWS EKS",
      "Terraform",
      "Lambda",
      "Aurora",
      "FinOps",
      "Multi-Region IaC",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead AWS Cloud Engineer",
        "company": "Apex Solutions Inc.",
        "location": "Seattle, WA",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core aws cloud engineer initiatives utilizing AWS EKS and Terraform, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "AWS Cloud Engineer Specialist",
        "company": "Vertex Global Group",
        "location": "Seattle, WA",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise AWS Cloud Engineer Architecture & Workflow Suite",
        "technologies": "AWS EKS, Terraform, Lambda",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/aws-cloud-engineer/enterprise-suite"
      },
      {
        "title": "High-Impact AWS Cloud Engineer Performance Initiative",
        "technologies": "Terraform, Lambda, Aurora",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/aws-cloud-engineer/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in AWS",
        "institution": "State University / Institute of Technology",
        "location": "Seattle, WA",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified AWS Cloud Engineer Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "cloud-engineer": {
    "personal": {
      "name": "Samira Khan",
      "title": "Cloud Infrastructure Engineer",
      "email": "samira.khan@email.com",
      "phone": "(555) 019-2834",
      "location": "Chicago, IL",
      "website": "cloud-engineer-portfolio.dev",
      "linkedin": "linkedin.com/in/cloud-engineer",
      "github": "github.com/cloud-engineer"
    },
    "summary": "Results-driven Cloud Infrastructure Engineer with 4+ years of hands-on experience in Multi-Cloud, Kubernetes, Terraform, Docker, Cloud Security, SRE. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "Multi-Cloud",
      "Kubernetes",
      "Terraform",
      "Docker",
      "Cloud Security",
      "SRE",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Cloud Infrastructure Engineer",
        "company": "Apex Solutions Inc.",
        "location": "Chicago, IL",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core cloud infrastructure engineer initiatives utilizing Multi-Cloud and Kubernetes, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Cloud Infrastructure Engineer Specialist",
        "company": "Vertex Global Group",
        "location": "Chicago, IL",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Cloud Infrastructure Engineer Architecture & Workflow Suite",
        "technologies": "Multi-Cloud, Kubernetes, Terraform",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/cloud-engineer/enterprise-suite"
      },
      {
        "title": "High-Impact Cloud Infrastructure Engineer Performance Initiative",
        "technologies": "Kubernetes, Terraform, Docker",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/cloud-engineer/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Cloud",
        "institution": "State University / Institute of Technology",
        "location": "Chicago, IL",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Cloud Infrastructure Engineer Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "cybersecurity-analyst": {
    "personal": {
      "name": "Maya Patel",
      "title": "Cybersecurity Analyst",
      "email": "maya.patel@email.com",
      "phone": "(555) 019-2834",
      "location": "Washington, D.C.",
      "website": "cybersecurity-analyst-portfolio.dev",
      "linkedin": "linkedin.com/in/cybersecurity-analyst",
      "github": "github.com/cybersecurity-analyst"
    },
    "summary": "Results-driven Cybersecurity Analyst with 4+ years of hands-on experience in Splunk ES, Threat Hunting, MITRE ATT&CK, CrowdStrike, SOC2, NIST. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "Splunk ES",
      "Threat Hunting",
      "MITRE ATT&CK",
      "CrowdStrike",
      "SOC2",
      "NIST",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Cybersecurity Analyst",
        "company": "Apex Solutions Inc.",
        "location": "Washington, D.C.",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core cybersecurity analyst initiatives utilizing Splunk ES and Threat Hunting, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Cybersecurity Analyst Specialist",
        "company": "Vertex Global Group",
        "location": "Washington, D.C.",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Cybersecurity Analyst Architecture & Workflow Suite",
        "technologies": "Splunk ES, Threat Hunting, MITRE ATT&CK",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/cybersecurity-analyst/enterprise-suite"
      },
      {
        "title": "High-Impact Cybersecurity Analyst Performance Initiative",
        "technologies": "Threat Hunting, MITRE ATT&CK, CrowdStrike",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/cybersecurity-analyst/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Cybersecurity",
        "institution": "State University / Institute of Technology",
        "location": "Washington, D.C.",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Cybersecurity Analyst Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "prompt-engineer": {
    "personal": {
      "name": "Liam Torres",
      "title": "Prompt Engineer & LLM Evaluator",
      "email": "liam.torres@email.com",
      "phone": "(555) 019-2834",
      "location": "San Francisco, CA",
      "website": "prompt-engineer-portfolio.dev",
      "linkedin": "linkedin.com/in/prompt-engineer",
      "github": "github.com/prompt-engineer"
    },
    "summary": "Results-driven Prompt Engineer & LLM Evaluator with 4+ years of hands-on experience in Prompt Optimization, Few-Shot Engineering, Ragas, LLM Evals, LangChain. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "Prompt Optimization",
      "Few-Shot Engineering",
      "Ragas",
      "LLM Evals",
      "LangChain",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Prompt Engineer & LLM Evaluator",
        "company": "Apex Solutions Inc.",
        "location": "San Francisco, CA",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core prompt engineer & llm evaluator initiatives utilizing Prompt Optimization and Few-Shot Engineering, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Prompt Engineer & LLM Evaluator Specialist",
        "company": "Vertex Global Group",
        "location": "San Francisco, CA",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Prompt Engineer & LLM Evaluator Architecture & Workflow Suite",
        "technologies": "Prompt Optimization, Few-Shot Engineering, Ragas",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/prompt-engineer/enterprise-suite"
      },
      {
        "title": "High-Impact Prompt Engineer & LLM Evaluator Performance Initiative",
        "technologies": "Few-Shot Engineering, Ragas, LLM Evals",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/prompt-engineer/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Prompt",
        "institution": "State University / Institute of Technology",
        "location": "San Francisco, CA",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Prompt Engineer & LLM Evaluator Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "it-support-specialist": {
    "personal": {
      "name": "Brian Miller",
      "title": "IT Support Specialist",
      "email": "brian.miller@email.com",
      "phone": "(555) 019-2834",
      "location": "Dallas, TX",
      "website": "it-support-specialist-portfolio.dev",
      "linkedin": "linkedin.com/in/it-support-specialist",
      "github": "github.com/it-support-specialist"
    },
    "summary": "Results-driven IT Support Specialist with 4+ years of hands-on experience in Active Directory, Windows Server, ServiceNow, TCP/IP, Jamf, Office 365. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "Active Directory",
      "Windows Server",
      "ServiceNow",
      "TCP/IP",
      "Jamf",
      "Office 365",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead IT Support Specialist",
        "company": "Apex Solutions Inc.",
        "location": "Dallas, TX",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core it support specialist initiatives utilizing Active Directory and Windows Server, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "IT Support Specialist Specialist",
        "company": "Vertex Global Group",
        "location": "Dallas, TX",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise IT Support Specialist Architecture & Workflow Suite",
        "technologies": "Active Directory, Windows Server, ServiceNow",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/it-support-specialist/enterprise-suite"
      },
      {
        "title": "High-Impact IT Support Specialist Performance Initiative",
        "technologies": "Windows Server, ServiceNow, TCP/IP",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/it-support-specialist/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in IT",
        "institution": "State University / Institute of Technology",
        "location": "Dallas, TX",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified IT Support Specialist Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "ai-engineer": {
    "personal": {
      "name": "Alexander Reed",
      "title": "AI & Machine Learning Engineer",
      "email": "alexander.reed@email.com",
      "phone": "(555) 019-2834",
      "location": "San Francisco, CA",
      "website": "ai-engineer-portfolio.dev",
      "linkedin": "linkedin.com/in/ai-engineer",
      "github": "github.com/ai-engineer"
    },
    "summary": "Results-driven AI & Machine Learning Engineer with 4+ years of hands-on experience in LLM Fine-Tuning, vLLM, TensorRT, RAG, PyTorch, Qdrant, MLOps. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "LLM Fine-Tuning",
      "vLLM",
      "TensorRT",
      "RAG",
      "PyTorch",
      "Qdrant",
      "MLOps",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead AI & Machine Learning Engineer",
        "company": "Apex Solutions Inc.",
        "location": "San Francisco, CA",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core ai & machine learning engineer initiatives utilizing LLM Fine-Tuning and vLLM, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "AI & Machine Learning Engineer Specialist",
        "company": "Vertex Global Group",
        "location": "San Francisco, CA",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise AI & Machine Learning Engineer Architecture & Workflow Suite",
        "technologies": "LLM Fine-Tuning, vLLM, TensorRT",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/ai-engineer/enterprise-suite"
      },
      {
        "title": "High-Impact AI & Machine Learning Engineer Performance Initiative",
        "technologies": "vLLM, TensorRT, RAG",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/ai-engineer/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in AI",
        "institution": "State University / Institute of Technology",
        "location": "San Francisco, CA",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified AI & Machine Learning Engineer Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "data-scientist": {
    "personal": {
      "name": "Elena Rostova",
      "title": "Data Scientist",
      "email": "elena.rostova@email.com",
      "phone": "(555) 019-2834",
      "location": "Austin, TX",
      "website": "data-scientist-portfolio.dev",
      "linkedin": "linkedin.com/in/data-scientist",
      "github": "github.com/data-scientist"
    },
    "summary": "Results-driven Data Scientist with 4+ years of hands-on experience in Predictive Modeling, A/B Testing, XGBoost, Snowflake, SQL, Python. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "Predictive Modeling",
      "A/B Testing",
      "XGBoost",
      "Snowflake",
      "SQL",
      "Python",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Data Scientist",
        "company": "Apex Solutions Inc.",
        "location": "Austin, TX",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core data scientist initiatives utilizing Predictive Modeling and A/B Testing, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Data Scientist Specialist",
        "company": "Vertex Global Group",
        "location": "Austin, TX",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Data Scientist Architecture & Workflow Suite",
        "technologies": "Predictive Modeling, A/B Testing, XGBoost",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/data-scientist/enterprise-suite"
      },
      {
        "title": "High-Impact Data Scientist Performance Initiative",
        "technologies": "A/B Testing, XGBoost, Snowflake",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/data-scientist/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Data",
        "institution": "State University / Institute of Technology",
        "location": "Austin, TX",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Data Scientist Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "data-engineer": {
    "personal": {
      "name": "Ravi Teja",
      "title": "Data Engineer",
      "email": "ravi.teja@email.com",
      "phone": "(555) 019-2834",
      "location": "Bengaluru, India",
      "website": "data-engineer-portfolio.dev",
      "linkedin": "linkedin.com/in/data-engineer",
      "github": "github.com/data-engineer"
    },
    "summary": "Results-driven Data Engineer with 4+ years of hands-on experience in PySpark, Apache Airflow, dbt, Snowflake, Kafka, Data Lakehouse. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "PySpark",
      "Apache Airflow",
      "dbt",
      "Snowflake",
      "Kafka",
      "Data Lakehouse",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Data Engineer",
        "company": "Apex Solutions Inc.",
        "location": "Bengaluru, India",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core data engineer initiatives utilizing PySpark and Apache Airflow, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Data Engineer Specialist",
        "company": "Vertex Global Group",
        "location": "Bengaluru, India",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Data Engineer Architecture & Workflow Suite",
        "technologies": "PySpark, Apache Airflow, dbt",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/data-engineer/enterprise-suite"
      },
      {
        "title": "High-Impact Data Engineer Performance Initiative",
        "technologies": "Apache Airflow, dbt, Snowflake",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/data-engineer/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Data",
        "institution": "State University / Institute of Technology",
        "location": "Bengaluru, India",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Data Engineer Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "data-analyst-fresher-projects": {
    "personal": {
      "name": "Pooja Hegde",
      "title": "Data Analyst (Fresher & Projects)",
      "email": "pooja.hegde@email.com",
      "phone": "(555) 019-2834",
      "location": "Hyderabad, India",
      "website": "data-analyst-fresher-projects-portfolio.dev",
      "linkedin": "linkedin.com/in/data-analyst-fresher-projects",
      "github": "github.com/data-analyst-fresher-projects"
    },
    "summary": "Results-driven Data Analyst (Fresher & Projects) with 4+ years of hands-on experience in SQL, Python, PowerBI, Tableau, EDA, Excel Financial Modeling. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "SQL",
      "Python",
      "PowerBI",
      "Tableau",
      "EDA",
      "Excel Financial Modeling",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Data Analyst (Fresher & Projects)",
        "company": "Apex Solutions Inc.",
        "location": "Hyderabad, India",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core data analyst (fresher & projects) initiatives utilizing SQL and Python, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Data Analyst (Fresher & Projects) Specialist",
        "company": "Vertex Global Group",
        "location": "Hyderabad, India",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Data Analyst (Fresher & Projects) Architecture & Workflow Suite",
        "technologies": "SQL, Python, PowerBI",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/data-analyst-fresher-projects/enterprise-suite"
      },
      {
        "title": "High-Impact Data Analyst (Fresher & Projects) Performance Initiative",
        "technologies": "Python, PowerBI, Tableau",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/data-analyst-fresher-projects/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Data",
        "institution": "State University / Institute of Technology",
        "location": "Hyderabad, India",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Data Analyst (Fresher & Projects) Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "business-analyst": {
    "personal": {
      "name": "Claire Bennett",
      "title": "Business Analyst",
      "email": "claire.bennett@email.com",
      "phone": "(555) 019-2834",
      "location": "Boston, MA",
      "website": "business-analyst-portfolio.dev",
      "linkedin": "linkedin.com/in/business-analyst",
      "github": "github.com/business-analyst"
    },
    "summary": "Results-driven Business Analyst with 4+ years of hands-on experience in BRD/FRD Authoring, SQL, Tableau, Agile Scrum, Process Mapping. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "BRD/FRD Authoring",
      "SQL",
      "Tableau",
      "Agile Scrum",
      "Process Mapping",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Business Analyst",
        "company": "Apex Solutions Inc.",
        "location": "Boston, MA",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core business analyst initiatives utilizing BRD/FRD Authoring and SQL, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Business Analyst Specialist",
        "company": "Vertex Global Group",
        "location": "Boston, MA",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Business Analyst Architecture & Workflow Suite",
        "technologies": "BRD/FRD Authoring, SQL, Tableau",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/business-analyst/enterprise-suite"
      },
      {
        "title": "High-Impact Business Analyst Performance Initiative",
        "technologies": "SQL, Tableau, Agile Scrum",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/business-analyst/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Business",
        "institution": "State University / Institute of Technology",
        "location": "Boston, MA",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Business Analyst Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "mechanical-engineer": {
    "personal": {
      "name": "David Kowalski",
      "title": "Mechanical Design Engineer",
      "email": "david.kowalski@email.com",
      "phone": "(555) 019-2834",
      "location": "Detroit, MI",
      "website": "mechanical-engineer-portfolio.dev",
      "linkedin": "linkedin.com/in/mechanical-engineer",
      "github": "github.com/mechanical-engineer"
    },
    "summary": "Results-driven Mechanical Design Engineer with 4+ years of hands-on experience in SolidWorks, ANSYS FEA, GD&T ASME Y14.5, DFM/DFA, NPI. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "SolidWorks",
      "ANSYS FEA",
      "GD&T ASME Y14.5",
      "DFM/DFA",
      "NPI",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Mechanical Design Engineer",
        "company": "Apex Solutions Inc.",
        "location": "Detroit, MI",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core mechanical design engineer initiatives utilizing SolidWorks and ANSYS FEA, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Mechanical Design Engineer Specialist",
        "company": "Vertex Global Group",
        "location": "Detroit, MI",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Mechanical Design Engineer Architecture & Workflow Suite",
        "technologies": "SolidWorks, ANSYS FEA, GD&T ASME Y14.5",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/mechanical-engineer/enterprise-suite"
      },
      {
        "title": "High-Impact Mechanical Design Engineer Performance Initiative",
        "technologies": "ANSYS FEA, GD&T ASME Y14.5, DFM/DFA",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/mechanical-engineer/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Mechanical",
        "institution": "State University / Institute of Technology",
        "location": "Detroit, MI",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Mechanical Design Engineer Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "civil-engineer": {
    "personal": {
      "name": "Vikram Singh",
      "title": "Civil & Structural Engineer",
      "email": "vikram.singh@email.com",
      "phone": "(555) 019-2834",
      "location": "New Delhi, India",
      "website": "civil-engineer-portfolio.dev",
      "linkedin": "linkedin.com/in/civil-engineer",
      "github": "github.com/civil-engineer"
    },
    "summary": "Results-driven Civil & Structural Engineer with 4+ years of hands-on experience in AutoCAD Civil 3D, STAAD.Pro, Structural Analysis, IS 456, BOQ. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "AutoCAD Civil 3D",
      "STAAD.Pro",
      "Structural Analysis",
      "IS 456",
      "BOQ",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Civil & Structural Engineer",
        "company": "Apex Solutions Inc.",
        "location": "New Delhi, India",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core civil & structural engineer initiatives utilizing AutoCAD Civil 3D and STAAD.Pro, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Civil & Structural Engineer Specialist",
        "company": "Vertex Global Group",
        "location": "New Delhi, India",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Civil & Structural Engineer Architecture & Workflow Suite",
        "technologies": "AutoCAD Civil 3D, STAAD.Pro, Structural Analysis",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/civil-engineer/enterprise-suite"
      },
      {
        "title": "High-Impact Civil & Structural Engineer Performance Initiative",
        "technologies": "STAAD.Pro, Structural Analysis, IS 456",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/civil-engineer/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Civil",
        "institution": "State University / Institute of Technology",
        "location": "New Delhi, India",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Civil & Structural Engineer Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "electrical-engineer": {
    "personal": {
      "name": "Kiran Nair",
      "title": "Electrical & Embedded Engineer",
      "email": "kiran.nair@email.com",
      "phone": "(555) 019-2834",
      "location": "Chennai, India",
      "website": "electrical-engineer-portfolio.dev",
      "linkedin": "linkedin.com/in/electrical-engineer",
      "github": "github.com/electrical-engineer"
    },
    "summary": "Results-driven Electrical & Embedded Engineer with 4+ years of hands-on experience in PLC Programming, SCADA, MATLAB/Simulink, Circuit Design, IEEE. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "PLC Programming",
      "SCADA",
      "MATLAB/Simulink",
      "Circuit Design",
      "IEEE",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Electrical & Embedded Engineer",
        "company": "Apex Solutions Inc.",
        "location": "Chennai, India",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core electrical & embedded engineer initiatives utilizing PLC Programming and SCADA, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Electrical & Embedded Engineer Specialist",
        "company": "Vertex Global Group",
        "location": "Chennai, India",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Electrical & Embedded Engineer Architecture & Workflow Suite",
        "technologies": "PLC Programming, SCADA, MATLAB/Simulink",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/electrical-engineer/enterprise-suite"
      },
      {
        "title": "High-Impact Electrical & Embedded Engineer Performance Initiative",
        "technologies": "SCADA, MATLAB/Simulink, Circuit Design",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/electrical-engineer/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Electrical",
        "institution": "State University / Institute of Technology",
        "location": "Chennai, India",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Electrical & Embedded Engineer Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "industrial-engineer": {
    "personal": {
      "name": "Carlos Mendoza",
      "title": "Industrial & Systems Engineer",
      "email": "carlos.mendoza@email.com",
      "phone": "(555) 019-2834",
      "location": "Atlanta, GA",
      "website": "industrial-engineer-portfolio.dev",
      "linkedin": "linkedin.com/in/industrial-engineer",
      "github": "github.com/industrial-engineer"
    },
    "summary": "Results-driven Industrial & Systems Engineer with 4+ years of hands-on experience in Lean Six Sigma, Value Stream Mapping, Kaizen, Arena Simulation, Ergonomics. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "Lean Six Sigma",
      "Value Stream Mapping",
      "Kaizen",
      "Arena Simulation",
      "Ergonomics",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Industrial & Systems Engineer",
        "company": "Apex Solutions Inc.",
        "location": "Atlanta, GA",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core industrial & systems engineer initiatives utilizing Lean Six Sigma and Value Stream Mapping, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Industrial & Systems Engineer Specialist",
        "company": "Vertex Global Group",
        "location": "Atlanta, GA",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Industrial & Systems Engineer Architecture & Workflow Suite",
        "technologies": "Lean Six Sigma, Value Stream Mapping, Kaizen",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/industrial-engineer/enterprise-suite"
      },
      {
        "title": "High-Impact Industrial & Systems Engineer Performance Initiative",
        "technologies": "Value Stream Mapping, Kaizen, Arena Simulation",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/industrial-engineer/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Industrial",
        "institution": "State University / Institute of Technology",
        "location": "Atlanta, GA",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Industrial & Systems Engineer Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "biomedical-engineer": {
    "personal": {
      "name": "Dr. Rachel Green",
      "title": "Biomedical Engineer",
      "email": "dr..rachel.green@email.com",
      "phone": "(555) 019-2834",
      "location": "San Diego, CA",
      "website": "biomedical-engineer-portfolio.dev",
      "linkedin": "linkedin.com/in/biomedical-engineer",
      "github": "github.com/biomedical-engineer"
    },
    "summary": "Results-driven Biomedical Engineer with 4+ years of hands-on experience in Medical Device Design, ISO 13485, FDA 510(k), MATLAB, Biocompatibility. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "Medical Device Design",
      "ISO 13485",
      "FDA 510(k)",
      "MATLAB",
      "Biocompatibility",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Biomedical Engineer",
        "company": "Apex Solutions Inc.",
        "location": "San Diego, CA",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core biomedical engineer initiatives utilizing Medical Device Design and ISO 13485, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Biomedical Engineer Specialist",
        "company": "Vertex Global Group",
        "location": "San Diego, CA",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Biomedical Engineer Architecture & Workflow Suite",
        "technologies": "Medical Device Design, ISO 13485, FDA 510(k)",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/biomedical-engineer/enterprise-suite"
      },
      {
        "title": "High-Impact Biomedical Engineer Performance Initiative",
        "technologies": "ISO 13485, FDA 510(k), MATLAB",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/biomedical-engineer/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Biomedical",
        "institution": "State University / Institute of Technology",
        "location": "San Diego, CA",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Biomedical Engineer Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "architect": {
    "personal": {
      "name": "Julian Croft",
      "title": "Architect & Spatial Designer",
      "email": "julian.croft@email.com",
      "phone": "(555) 019-2834",
      "location": "Chicago, IL",
      "website": "architect-portfolio.dev",
      "linkedin": "linkedin.com/in/architect",
      "github": "github.com/architect"
    },
    "summary": "Results-driven Architect & Spatial Designer with 4+ years of hands-on experience in Revit BIM, Rhino 3D, Sustainable Design, LEED AP, Construction Docs. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "Revit BIM",
      "Rhino 3D",
      "Sustainable Design",
      "LEED AP",
      "Construction Docs",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Architect & Spatial Designer",
        "company": "Apex Solutions Inc.",
        "location": "Chicago, IL",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core architect & spatial designer initiatives utilizing Revit BIM and Rhino 3D, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Architect & Spatial Designer Specialist",
        "company": "Vertex Global Group",
        "location": "Chicago, IL",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Architect & Spatial Designer Architecture & Workflow Suite",
        "technologies": "Revit BIM, Rhino 3D, Sustainable Design",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/architect/enterprise-suite"
      },
      {
        "title": "High-Impact Architect & Spatial Designer Performance Initiative",
        "technologies": "Rhino 3D, Sustainable Design, LEED AP",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/architect/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Architect",
        "institution": "State University / Institute of Technology",
        "location": "Chicago, IL",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Architect & Spatial Designer Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "draftsman": {
    "personal": {
      "name": "Suresh Reddy",
      "title": "CAD Draftsman & Mechanical Designer",
      "email": "suresh.reddy@email.com",
      "phone": "(555) 019-2834",
      "location": "Pune, India",
      "website": "draftsman-portfolio.dev",
      "linkedin": "linkedin.com/in/draftsman",
      "github": "github.com/draftsman"
    },
    "summary": "Results-driven CAD Draftsman & Mechanical Designer with 4+ years of hands-on experience in AutoCAD 2D/3D, SolidWorks, Drafting Standards, Dimensioning, BOM. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "AutoCAD 2D/3D",
      "SolidWorks",
      "Drafting Standards",
      "Dimensioning",
      "BOM",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead CAD Draftsman & Mechanical Designer",
        "company": "Apex Solutions Inc.",
        "location": "Pune, India",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core cad draftsman & mechanical designer initiatives utilizing AutoCAD 2D/3D and SolidWorks, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "CAD Draftsman & Mechanical Designer Specialist",
        "company": "Vertex Global Group",
        "location": "Pune, India",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise CAD Draftsman & Mechanical Designer Architecture & Workflow Suite",
        "technologies": "AutoCAD 2D/3D, SolidWorks, Drafting Standards",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/draftsman/enterprise-suite"
      },
      {
        "title": "High-Impact CAD Draftsman & Mechanical Designer Performance Initiative",
        "technologies": "SolidWorks, Drafting Standards, Dimensioning",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/draftsman/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in CAD",
        "institution": "State University / Institute of Technology",
        "location": "Pune, India",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified CAD Draftsman & Mechanical Designer Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "tcs-nqt-fresher": {
    "personal": {
      "name": "Rohan Sharma",
      "title": "TCS NQT Fresher Candidate",
      "email": "rohan.sharma@email.com",
      "phone": "(555) 019-2834",
      "location": "Hyderabad, India",
      "website": "tcs-nqt-fresher-portfolio.dev",
      "linkedin": "linkedin.com/in/tcs-nqt-fresher",
      "github": "github.com/tcs-nqt-fresher"
    },
    "summary": "Results-driven TCS NQT Fresher Candidate with 4+ years of hands-on experience in Core Java, Python, SQL, DSA, OOPs, Web Development, Campus Projects. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "Core Java",
      "Python",
      "SQL",
      "DSA",
      "OOPs",
      "Web Development",
      "Campus Projects",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead TCS NQT Fresher Candidate",
        "company": "Apex Solutions Inc.",
        "location": "Hyderabad, India",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core tcs nqt fresher candidate initiatives utilizing Core Java and Python, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "TCS NQT Fresher Candidate Specialist",
        "company": "Vertex Global Group",
        "location": "Hyderabad, India",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise TCS NQT Fresher Candidate Architecture & Workflow Suite",
        "technologies": "Core Java, Python, SQL",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/tcs-nqt-fresher/enterprise-suite"
      },
      {
        "title": "High-Impact TCS NQT Fresher Candidate Performance Initiative",
        "technologies": "Python, SQL, DSA",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/tcs-nqt-fresher/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in TCS",
        "institution": "State University / Institute of Technology",
        "location": "Hyderabad, India",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified TCS NQT Fresher Candidate Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "infosys-fresher": {
    "personal": {
      "name": "Ananya Deshmukh",
      "title": "Infosys Fresher (Systems Engineer)",
      "email": "ananya.deshmukh@email.com",
      "phone": "(555) 019-2834",
      "location": "Pune, India",
      "website": "infosys-fresher-portfolio.dev",
      "linkedin": "linkedin.com/in/infosys-fresher",
      "github": "github.com/infosys-fresher"
    },
    "summary": "Results-driven Infosys Fresher (Systems Engineer) with 4+ years of hands-on experience in Python, Java, DBMS, Pseudo Code, LeetCode, GitHub Capstone Projects. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "Python",
      "Java",
      "DBMS",
      "Pseudo Code",
      "LeetCode",
      "GitHub Capstone Projects",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Infosys Fresher (Systems Engineer)",
        "company": "Apex Solutions Inc.",
        "location": "Pune, India",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core infosys fresher (systems engineer) initiatives utilizing Python and Java, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Infosys Fresher (Systems Engineer) Specialist",
        "company": "Vertex Global Group",
        "location": "Pune, India",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Infosys Fresher (Systems Engineer) Architecture & Workflow Suite",
        "technologies": "Python, Java, DBMS",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/infosys-fresher/enterprise-suite"
      },
      {
        "title": "High-Impact Infosys Fresher (Systems Engineer) Performance Initiative",
        "technologies": "Java, DBMS, Pseudo Code",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/infosys-fresher/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Infosys",
        "institution": "State University / Institute of Technology",
        "location": "Pune, India",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Infosys Fresher (Systems Engineer) Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "wipro-turbo": {
    "personal": {
      "name": "Rahul Menon",
      "title": "Wipro Turbo / Elite Fresher",
      "email": "rahul.menon@email.com",
      "phone": "(555) 019-2834",
      "location": "Kochi, India",
      "website": "wipro-turbo-portfolio.dev",
      "linkedin": "linkedin.com/in/wipro-turbo",
      "github": "github.com/wipro-turbo"
    },
    "summary": "Results-driven Wipro Turbo / Elite Fresher with 4+ years of hands-on experience in Data Structures, C++, Java, Cloud Basics, Agile Scrum, Capstone. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "Data Structures",
      "C++",
      "Java",
      "Cloud Basics",
      "Agile Scrum",
      "Capstone",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Wipro Turbo / Elite Fresher",
        "company": "Apex Solutions Inc.",
        "location": "Kochi, India",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core wipro turbo / elite fresher initiatives utilizing Data Structures and C++, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Wipro Turbo / Elite Fresher Specialist",
        "company": "Vertex Global Group",
        "location": "Kochi, India",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Wipro Turbo / Elite Fresher Architecture & Workflow Suite",
        "technologies": "Data Structures, C++, Java",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/wipro-turbo/enterprise-suite"
      },
      {
        "title": "High-Impact Wipro Turbo / Elite Fresher Performance Initiative",
        "technologies": "C++, Java, Cloud Basics",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/wipro-turbo/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Wipro",
        "institution": "State University / Institute of Technology",
        "location": "Kochi, India",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Wipro Turbo / Elite Fresher Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "accenture-placement": {
    "personal": {
      "name": "Sneha Roy",
      "title": "Accenture Associate Software Engineer",
      "email": "sneha.roy@email.com",
      "phone": "(555) 019-2834",
      "location": "Kolkata, India",
      "website": "accenture-placement-portfolio.dev",
      "linkedin": "linkedin.com/in/accenture-placement",
      "github": "github.com/accenture-placement"
    },
    "summary": "Results-driven Accenture Associate Software Engineer with 4+ years of hands-on experience in Full-Stack Development, Java, SQL, Critical Reasoning, GitHub Projects. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "Full-Stack Development",
      "Java",
      "SQL",
      "Critical Reasoning",
      "GitHub Projects",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Accenture Associate Software Engineer",
        "company": "Apex Solutions Inc.",
        "location": "Kolkata, India",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core accenture associate software engineer initiatives utilizing Full-Stack Development and Java, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Accenture Associate Software Engineer Specialist",
        "company": "Vertex Global Group",
        "location": "Kolkata, India",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Accenture Associate Software Engineer Architecture & Workflow Suite",
        "technologies": "Full-Stack Development, Java, SQL",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/accenture-placement/enterprise-suite"
      },
      {
        "title": "High-Impact Accenture Associate Software Engineer Performance Initiative",
        "technologies": "Java, SQL, Critical Reasoning",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/accenture-placement/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Accenture",
        "institution": "State University / Institute of Technology",
        "location": "Kolkata, India",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Accenture Associate Software Engineer Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "college-campus-placement": {
    "personal": {
      "name": "Abhishek Kumar",
      "title": "College Campus Placement (All Streams)",
      "email": "abhishek.kumar@email.com",
      "phone": "(555) 019-2834",
      "location": "Noida, India",
      "website": "college-campus-placement-portfolio.dev",
      "linkedin": "linkedin.com/in/college-campus-placement",
      "github": "github.com/college-campus-placement"
    },
    "summary": "Results-driven College Campus Placement (All Streams) with 4+ years of hands-on experience in Aptitude, Core Technical Fundamentals, Final Year Projects, Internships. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "Aptitude",
      "Core Technical Fundamentals",
      "Final Year Projects",
      "Internships",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead College Campus Placement (All Streams)",
        "company": "Apex Solutions Inc.",
        "location": "Noida, India",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core college campus placement (all streams) initiatives utilizing Aptitude and Core Technical Fundamentals, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "College Campus Placement (All Streams) Specialist",
        "company": "Vertex Global Group",
        "location": "Noida, India",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise College Campus Placement (All Streams) Architecture & Workflow Suite",
        "technologies": "Aptitude, Core Technical Fundamentals, Final Year Projects",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/college-campus-placement/enterprise-suite"
      },
      {
        "title": "High-Impact College Campus Placement (All Streams) Performance Initiative",
        "technologies": "Core Technical Fundamentals, Final Year Projects, Internships",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/college-campus-placement/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in College",
        "institution": "State University / Institute of Technology",
        "location": "Noida, India",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified College Campus Placement (All Streams) Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "product-manager": {
    "personal": {
      "name": "Marcus Vance",
      "title": "Product Manager",
      "email": "marcus.vance@email.com",
      "phone": "(555) 019-2834",
      "location": "New York, NY",
      "website": "product-manager-portfolio.dev",
      "linkedin": "linkedin.com/in/product-manager",
      "github": "github.com/product-manager"
    },
    "summary": "Results-driven Product Manager with 4+ years of hands-on experience in 0-to-1 Roadmaps, Amplitude Cohorts, RICE Prioritization, PRDs, GTM. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "0-to-1 Roadmaps",
      "Amplitude Cohorts",
      "RICE Prioritization",
      "PRDs",
      "GTM",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Product Manager",
        "company": "Apex Solutions Inc.",
        "location": "New York, NY",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core product manager initiatives utilizing 0-to-1 Roadmaps and Amplitude Cohorts, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Product Manager Specialist",
        "company": "Vertex Global Group",
        "location": "New York, NY",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Product Manager Architecture & Workflow Suite",
        "technologies": "0-to-1 Roadmaps, Amplitude Cohorts, RICE Prioritization",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/product-manager/enterprise-suite"
      },
      {
        "title": "High-Impact Product Manager Performance Initiative",
        "technologies": "Amplitude Cohorts, RICE Prioritization, PRDs",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/product-manager/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Product",
        "institution": "State University / Institute of Technology",
        "location": "New York, NY",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Product Manager Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "project-manager": {
    "personal": {
      "name": "Jennifer Taylor",
      "title": "Project Manager (PMP)",
      "email": "jennifer.taylor@email.com",
      "phone": "(555) 019-2834",
      "location": "Denver, CO",
      "website": "project-manager-portfolio.dev",
      "linkedin": "linkedin.com/in/project-manager",
      "github": "github.com/project-manager"
    },
    "summary": "Results-driven Project Manager (PMP) with 4+ years of hands-on experience in Agile / Scrum, Jira, Budget Allocation, Stakeholder Management, Risk Logs. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "Agile / Scrum",
      "Jira",
      "Budget Allocation",
      "Stakeholder Management",
      "Risk Logs",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Project Manager (PMP)",
        "company": "Apex Solutions Inc.",
        "location": "Denver, CO",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core project manager (pmp) initiatives utilizing Agile / Scrum and Jira, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Project Manager (PMP) Specialist",
        "company": "Vertex Global Group",
        "location": "Denver, CO",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Project Manager (PMP) Architecture & Workflow Suite",
        "technologies": "Agile / Scrum, Jira, Budget Allocation",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/project-manager/enterprise-suite"
      },
      {
        "title": "High-Impact Project Manager (PMP) Performance Initiative",
        "technologies": "Jira, Budget Allocation, Stakeholder Management",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/project-manager/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Project",
        "institution": "State University / Institute of Technology",
        "location": "Denver, CO",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Project Manager (PMP) Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "scrum-master": {
    "personal": {
      "name": "Daniel Becker",
      "title": "Certified Scrum Master (CSM)",
      "email": "daniel.becker@email.com",
      "phone": "(555) 019-2834",
      "location": "Austin, TX",
      "website": "scrum-master-portfolio.dev",
      "linkedin": "linkedin.com/in/scrum-master",
      "github": "github.com/scrum-master"
    },
    "summary": "Results-driven Certified Scrum Master (CSM) with 4+ years of hands-on experience in Sprint Ceremonies, Jira / Confluence, Velocity Tracking, Kanban, Team Agility. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "Sprint Ceremonies",
      "Jira / Confluence",
      "Velocity Tracking",
      "Kanban",
      "Team Agility",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Certified Scrum Master (CSM)",
        "company": "Apex Solutions Inc.",
        "location": "Austin, TX",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core certified scrum master (csm) initiatives utilizing Sprint Ceremonies and Jira / Confluence, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Certified Scrum Master (CSM) Specialist",
        "company": "Vertex Global Group",
        "location": "Austin, TX",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Certified Scrum Master (CSM) Architecture & Workflow Suite",
        "technologies": "Sprint Ceremonies, Jira / Confluence, Velocity Tracking",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/scrum-master/enterprise-suite"
      },
      {
        "title": "High-Impact Certified Scrum Master (CSM) Performance Initiative",
        "technologies": "Jira / Confluence, Velocity Tracking, Kanban",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/scrum-master/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Certified",
        "institution": "State University / Institute of Technology",
        "location": "Austin, TX",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Certified Scrum Master (CSM) Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "operations-manager": {
    "personal": {
      "name": "Robert Sterling",
      "title": "Operations Manager",
      "email": "robert.sterling@email.com",
      "phone": "(555) 019-2834",
      "location": "Houston, TX",
      "website": "operations-manager-portfolio.dev",
      "linkedin": "linkedin.com/in/operations-manager",
      "github": "github.com/operations-manager"
    },
    "summary": "Results-driven Operations Manager with 4+ years of hands-on experience in Process Optimization, OPEX Budgeting, Supply Chain, KPIs, Six Sigma. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "Process Optimization",
      "OPEX Budgeting",
      "Supply Chain",
      "KPIs",
      "Six Sigma",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Operations Manager",
        "company": "Apex Solutions Inc.",
        "location": "Houston, TX",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core operations manager initiatives utilizing Process Optimization and OPEX Budgeting, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Operations Manager Specialist",
        "company": "Vertex Global Group",
        "location": "Houston, TX",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Operations Manager Architecture & Workflow Suite",
        "technologies": "Process Optimization, OPEX Budgeting, Supply Chain",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/operations-manager/enterprise-suite"
      },
      {
        "title": "High-Impact Operations Manager Performance Initiative",
        "technologies": "OPEX Budgeting, Supply Chain, KPIs",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/operations-manager/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Operations",
        "institution": "State University / Institute of Technology",
        "location": "Houston, TX",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Operations Manager Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "management-consultant": {
    "personal": {
      "name": "Sophie Laurent",
      "title": "Management Consultant",
      "email": "sophie.laurent@email.com",
      "phone": "(555) 019-2834",
      "location": "New York, NY",
      "website": "management-consultant-portfolio.dev",
      "linkedin": "linkedin.com/in/management-consultant",
      "github": "github.com/management-consultant"
    },
    "summary": "Results-driven Management Consultant with 4+ years of hands-on experience in Corporate Strategy, Financial Modeling, Market Sizing, Executive Decks. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "Corporate Strategy",
      "Financial Modeling",
      "Market Sizing",
      "Executive Decks",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Management Consultant",
        "company": "Apex Solutions Inc.",
        "location": "New York, NY",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core management consultant initiatives utilizing Corporate Strategy and Financial Modeling, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Management Consultant Specialist",
        "company": "Vertex Global Group",
        "location": "New York, NY",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Management Consultant Architecture & Workflow Suite",
        "technologies": "Corporate Strategy, Financial Modeling, Market Sizing",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/management-consultant/enterprise-suite"
      },
      {
        "title": "High-Impact Management Consultant Performance Initiative",
        "technologies": "Financial Modeling, Market Sizing, Executive Decks",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/management-consultant/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Management",
        "institution": "State University / Institute of Technology",
        "location": "New York, NY",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Management Consultant Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "customer-success-manager": {
    "personal": {
      "name": "Lisa Chang",
      "title": "Customer Success Manager",
      "email": "lisa.chang@email.com",
      "phone": "(555) 019-2834",
      "location": "San Francisco, CA",
      "website": "customer-success-manager-portfolio.dev",
      "linkedin": "linkedin.com/in/customer-success-manager",
      "github": "github.com/customer-success-manager"
    },
    "summary": "Results-driven Customer Success Manager with 4+ years of hands-on experience in Net Revenue Retention (NRR), Churn Prevention, QBRs, Salesforce, Gainsight. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "Net Revenue Retention (NRR)",
      "Churn Prevention",
      "QBRs",
      "Salesforce",
      "Gainsight",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Customer Success Manager",
        "company": "Apex Solutions Inc.",
        "location": "San Francisco, CA",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core customer success manager initiatives utilizing Net Revenue Retention (NRR) and Churn Prevention, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Customer Success Manager Specialist",
        "company": "Vertex Global Group",
        "location": "San Francisco, CA",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Customer Success Manager Architecture & Workflow Suite",
        "technologies": "Net Revenue Retention (NRR), Churn Prevention, QBRs",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/customer-success-manager/enterprise-suite"
      },
      {
        "title": "High-Impact Customer Success Manager Performance Initiative",
        "technologies": "Churn Prevention, QBRs, Salesforce",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/customer-success-manager/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Customer",
        "institution": "State University / Institute of Technology",
        "location": "San Francisco, CA",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Customer Success Manager Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "investment-banker": {
    "personal": {
      "name": "James Thornton",
      "title": "Investment Banking Analyst",
      "email": "james.thornton@email.com",
      "phone": "(555) 019-2834",
      "location": "New York, NY",
      "website": "investment-banker-portfolio.dev",
      "linkedin": "linkedin.com/in/investment-banker",
      "github": "github.com/investment-banker"
    },
    "summary": "Results-driven Investment Banking Analyst with 4+ years of hands-on experience in LBO Modeling, DCF Valuation, M&A Pitchbooks, Capital IQ, SEC 10-K. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "LBO Modeling",
      "DCF Valuation",
      "M&A Pitchbooks",
      "Capital IQ",
      "SEC 10-K",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Investment Banking Analyst",
        "company": "Apex Solutions Inc.",
        "location": "New York, NY",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core investment banking analyst initiatives utilizing LBO Modeling and DCF Valuation, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Investment Banking Analyst Specialist",
        "company": "Vertex Global Group",
        "location": "New York, NY",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Investment Banking Analyst Architecture & Workflow Suite",
        "technologies": "LBO Modeling, DCF Valuation, M&A Pitchbooks",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/investment-banker/enterprise-suite"
      },
      {
        "title": "High-Impact Investment Banking Analyst Performance Initiative",
        "technologies": "DCF Valuation, M&A Pitchbooks, Capital IQ",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/investment-banker/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Investment",
        "institution": "State University / Institute of Technology",
        "location": "New York, NY",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Investment Banking Analyst Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "financial-analyst": {
    "personal": {
      "name": "Ethan Brooks",
      "title": "Financial Analyst",
      "email": "ethan.brooks@email.com",
      "phone": "(555) 019-2834",
      "location": "Charlotte, NC",
      "website": "financial-analyst-portfolio.dev",
      "linkedin": "linkedin.com/in/financial-analyst",
      "github": "github.com/financial-analyst"
    },
    "summary": "Results-driven Financial Analyst with 4+ years of hands-on experience in FP&A, Budget Variance Analysis, SQL, PowerBI, 3-Statement Modeling. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "FP&A",
      "Budget Variance Analysis",
      "SQL",
      "PowerBI",
      "3-Statement Modeling",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Financial Analyst",
        "company": "Apex Solutions Inc.",
        "location": "Charlotte, NC",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core financial analyst initiatives utilizing FP&A and Budget Variance Analysis, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Financial Analyst Specialist",
        "company": "Vertex Global Group",
        "location": "Charlotte, NC",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Financial Analyst Architecture & Workflow Suite",
        "technologies": "FP&A, Budget Variance Analysis, SQL",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/financial-analyst/enterprise-suite"
      },
      {
        "title": "High-Impact Financial Analyst Performance Initiative",
        "technologies": "Budget Variance Analysis, SQL, PowerBI",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/financial-analyst/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Financial",
        "institution": "State University / Institute of Technology",
        "location": "Charlotte, NC",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Financial Analyst Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "chief-financial-officer": {
    "personal": {
      "name": "Arthur Pendelton",
      "title": "Chief Financial Officer (CFO)",
      "email": "arthur.pendelton@email.com",
      "phone": "(555) 019-2834",
      "location": "New York, NY",
      "website": "chief-financial-officer-portfolio.dev",
      "linkedin": "linkedin.com/in/chief-financial-officer",
      "github": "github.com/chief-financial-officer"
    },
    "summary": "Results-driven Chief Financial Officer (CFO) with 4+ years of hands-on experience in Capital Allocation, M&A Strategy, SEC Compliance, Investor Relations, EBITDA. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "Capital Allocation",
      "M&A Strategy",
      "SEC Compliance",
      "Investor Relations",
      "EBITDA",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Chief Financial Officer (CFO)",
        "company": "Apex Solutions Inc.",
        "location": "New York, NY",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core chief financial officer (cfo) initiatives utilizing Capital Allocation and M&A Strategy, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Chief Financial Officer (CFO) Specialist",
        "company": "Vertex Global Group",
        "location": "New York, NY",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Chief Financial Officer (CFO) Architecture & Workflow Suite",
        "technologies": "Capital Allocation, M&A Strategy, SEC Compliance",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/chief-financial-officer/enterprise-suite"
      },
      {
        "title": "High-Impact Chief Financial Officer (CFO) Performance Initiative",
        "technologies": "M&A Strategy, SEC Compliance, Investor Relations",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/chief-financial-officer/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Chief",
        "institution": "State University / Institute of Technology",
        "location": "New York, NY",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Chief Financial Officer (CFO) Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "accountant": {
    "personal": {
      "name": "Rebecca Martinez",
      "title": "Certified Public Accountant (CPA)",
      "email": "rebecca.martinez@email.com",
      "phone": "(555) 019-2834",
      "location": "Miami, FL",
      "website": "accountant-portfolio.dev",
      "linkedin": "linkedin.com/in/accountant",
      "github": "github.com/accountant"
    },
    "summary": "Results-driven Certified Public Accountant (CPA) with 4+ years of hands-on experience in General Ledger, GAAP / IFRS, Tax Provisions, QuickBooks, Month-End Close. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "General Ledger",
      "GAAP / IFRS",
      "Tax Provisions",
      "QuickBooks",
      "Month-End Close",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Certified Public Accountant (CPA)",
        "company": "Apex Solutions Inc.",
        "location": "Miami, FL",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core certified public accountant (cpa) initiatives utilizing General Ledger and GAAP / IFRS, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Certified Public Accountant (CPA) Specialist",
        "company": "Vertex Global Group",
        "location": "Miami, FL",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Certified Public Accountant (CPA) Architecture & Workflow Suite",
        "technologies": "General Ledger, GAAP / IFRS, Tax Provisions",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/accountant/enterprise-suite"
      },
      {
        "title": "High-Impact Certified Public Accountant (CPA) Performance Initiative",
        "technologies": "GAAP / IFRS, Tax Provisions, QuickBooks",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/accountant/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Certified",
        "institution": "State University / Institute of Technology",
        "location": "Miami, FL",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Certified Public Accountant (CPA) Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "auditor": {
    "personal": {
      "name": "Timothy Walsh",
      "title": "Internal & External Auditor",
      "email": "timothy.walsh@email.com",
      "phone": "(555) 019-2834",
      "location": "Philadelphia, PA",
      "website": "auditor-portfolio.dev",
      "linkedin": "linkedin.com/in/auditor",
      "github": "github.com/auditor"
    },
    "summary": "Results-driven Internal & External Auditor with 4+ years of hands-on experience in SOX 404 Compliance, Audit Sampling, Risk Assessment, Workpapers, PCAOB. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "SOX 404 Compliance",
      "Audit Sampling",
      "Risk Assessment",
      "Workpapers",
      "PCAOB",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Internal & External Auditor",
        "company": "Apex Solutions Inc.",
        "location": "Philadelphia, PA",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core internal & external auditor initiatives utilizing SOX 404 Compliance and Audit Sampling, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Internal & External Auditor Specialist",
        "company": "Vertex Global Group",
        "location": "Philadelphia, PA",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Internal & External Auditor Architecture & Workflow Suite",
        "technologies": "SOX 404 Compliance, Audit Sampling, Risk Assessment",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/auditor/enterprise-suite"
      },
      {
        "title": "High-Impact Internal & External Auditor Performance Initiative",
        "technologies": "Audit Sampling, Risk Assessment, Workpapers",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/auditor/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Internal",
        "institution": "State University / Institute of Technology",
        "location": "Philadelphia, PA",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Internal & External Auditor Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "tax-consultant": {
    "personal": {
      "name": "Priya Venkatesh",
      "title": "Tax Consultant & Strategist",
      "email": "priya.venkatesh@email.com",
      "phone": "(555) 019-2834",
      "location": "Dallas, TX",
      "website": "tax-consultant-portfolio.dev",
      "linkedin": "linkedin.com/in/tax-consultant",
      "github": "github.com/tax-consultant"
    },
    "summary": "Results-driven Tax Consultant & Strategist with 4+ years of hands-on experience in Corporate Tax Filings, Form 1120/1065, Tax Credits (R&D), IRS Audits. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "Corporate Tax Filings",
      "Form 1120/1065",
      "Tax Credits (R&D)",
      "IRS Audits",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Tax Consultant & Strategist",
        "company": "Apex Solutions Inc.",
        "location": "Dallas, TX",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core tax consultant & strategist initiatives utilizing Corporate Tax Filings and Form 1120/1065, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Tax Consultant & Strategist Specialist",
        "company": "Vertex Global Group",
        "location": "Dallas, TX",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Tax Consultant & Strategist Architecture & Workflow Suite",
        "technologies": "Corporate Tax Filings, Form 1120/1065, Tax Credits (R&D)",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/tax-consultant/enterprise-suite"
      },
      {
        "title": "High-Impact Tax Consultant & Strategist Performance Initiative",
        "technologies": "Form 1120/1065, Tax Credits (R&D), IRS Audits",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/tax-consultant/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Tax",
        "institution": "State University / Institute of Technology",
        "location": "Dallas, TX",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Tax Consultant & Strategist Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "bookkeeper": {
    "personal": {
      "name": "Mary Jenkins",
      "title": "Senior Bookkeeper",
      "email": "mary.jenkins@email.com",
      "phone": "(555) 019-2834",
      "location": "Phoenix, AZ",
      "website": "bookkeeper-portfolio.dev",
      "linkedin": "linkedin.com/in/bookkeeper",
      "github": "github.com/bookkeeper"
    },
    "summary": "Results-driven Senior Bookkeeper with 4+ years of hands-on experience in Accounts Payable/Receivable, Bank Reconciliation, QuickBooks Online, Payroll. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "Accounts Payable/Receivable",
      "Bank Reconciliation",
      "QuickBooks Online",
      "Payroll",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Senior Bookkeeper",
        "company": "Apex Solutions Inc.",
        "location": "Phoenix, AZ",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core senior bookkeeper initiatives utilizing Accounts Payable/Receivable and Bank Reconciliation, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Senior Bookkeeper Specialist",
        "company": "Vertex Global Group",
        "location": "Phoenix, AZ",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Senior Bookkeeper Architecture & Workflow Suite",
        "technologies": "Accounts Payable/Receivable, Bank Reconciliation, QuickBooks Online",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/bookkeeper/enterprise-suite"
      },
      {
        "title": "High-Impact Senior Bookkeeper Performance Initiative",
        "technologies": "Bank Reconciliation, QuickBooks Online, Payroll",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/bookkeeper/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Senior",
        "institution": "State University / Institute of Technology",
        "location": "Phoenix, AZ",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Senior Bookkeeper Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "account-executive": {
    "personal": {
      "name": "Tyler Hansen",
      "title": "Account Executive (SaaS Sales)",
      "email": "tyler.hansen@email.com",
      "phone": "(555) 019-2834",
      "location": "San Francisco, CA",
      "website": "account-executive-portfolio.dev",
      "linkedin": "linkedin.com/in/account-executive",
      "github": "github.com/account-executive"
    },
    "summary": "Results-driven Account Executive (SaaS Sales) with 4+ years of hands-on experience in Quota Overachievement, Pipeline Generation, Salesforce, MEDDPICC, Demos. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "Quota Overachievement",
      "Pipeline Generation",
      "Salesforce",
      "MEDDPICC",
      "Demos",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Account Executive (SaaS Sales)",
        "company": "Apex Solutions Inc.",
        "location": "San Francisco, CA",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core account executive (saas sales) initiatives utilizing Quota Overachievement and Pipeline Generation, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Account Executive (SaaS Sales) Specialist",
        "company": "Vertex Global Group",
        "location": "San Francisco, CA",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Account Executive (SaaS Sales) Architecture & Workflow Suite",
        "technologies": "Quota Overachievement, Pipeline Generation, Salesforce",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/account-executive/enterprise-suite"
      },
      {
        "title": "High-Impact Account Executive (SaaS Sales) Performance Initiative",
        "technologies": "Pipeline Generation, Salesforce, MEDDPICC",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/account-executive/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Account",
        "institution": "State University / Institute of Technology",
        "location": "San Francisco, CA",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Account Executive (SaaS Sales) Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "sales-executive": {
    "personal": {
      "name": "Gabriel Morales",
      "title": "Enterprise Sales Executive",
      "email": "gabriel.morales@email.com",
      "phone": "(555) 019-2834",
      "location": "Chicago, IL",
      "website": "sales-executive-portfolio.dev",
      "linkedin": "linkedin.com/in/sales-executive",
      "github": "github.com/sales-executive"
    },
    "summary": "Results-driven Enterprise Sales Executive with 4+ years of hands-on experience in B2B Negotiations, Contract Closings, CRM Management, Territory Growth. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "B2B Negotiations",
      "Contract Closings",
      "CRM Management",
      "Territory Growth",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Enterprise Sales Executive",
        "company": "Apex Solutions Inc.",
        "location": "Chicago, IL",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core enterprise sales executive initiatives utilizing B2B Negotiations and Contract Closings, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Enterprise Sales Executive Specialist",
        "company": "Vertex Global Group",
        "location": "Chicago, IL",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Enterprise Sales Executive Architecture & Workflow Suite",
        "technologies": "B2B Negotiations, Contract Closings, CRM Management",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/sales-executive/enterprise-suite"
      },
      {
        "title": "High-Impact Enterprise Sales Executive Performance Initiative",
        "technologies": "Contract Closings, CRM Management, Territory Growth",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/sales-executive/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Enterprise",
        "institution": "State University / Institute of Technology",
        "location": "Chicago, IL",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Enterprise Sales Executive Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "registered-nurse": {
    "personal": {
      "name": "Jessica Reynolds, RN",
      "title": "Registered Nurse (RN - ICU / Med-Surg)",
      "email": "jessica.reynolds.rn@email.com",
      "phone": "(555) 019-2834",
      "location": "Nashville, TN",
      "website": "registered-nurse-portfolio.dev",
      "linkedin": "linkedin.com/in/registered-nurse",
      "github": "github.com/registered-nurse"
    },
    "summary": "Results-driven Registered Nurse (RN - ICU / Med-Surg) with 4+ years of hands-on experience in Patient Assessment, Medication Administration, Epic EMR, BLS/ACLS, Care Plans. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "Patient Assessment",
      "Medication Administration",
      "Epic EMR",
      "BLS/ACLS",
      "Care Plans",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Registered Nurse (RN - ICU / Med-Surg)",
        "company": "Apex Solutions Inc.",
        "location": "Nashville, TN",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core registered nurse (rn - icu / med-surg) initiatives utilizing Patient Assessment and Medication Administration, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Registered Nurse (RN - ICU / Med-Surg) Specialist",
        "company": "Vertex Global Group",
        "location": "Nashville, TN",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Registered Nurse (RN - ICU / Med-Surg) Architecture & Workflow Suite",
        "technologies": "Patient Assessment, Medication Administration, Epic EMR",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/registered-nurse/enterprise-suite"
      },
      {
        "title": "High-Impact Registered Nurse (RN - ICU / Med-Surg) Performance Initiative",
        "technologies": "Medication Administration, Epic EMR, BLS/ACLS",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/registered-nurse/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Registered",
        "institution": "State University / Institute of Technology",
        "location": "Nashville, TN",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Registered Nurse (RN - ICU / Med-Surg) Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "pharmacist": {
    "personal": {
      "name": "Dr. Andrew Lin, PharmD",
      "title": "Clinical Pharmacist (PharmD)",
      "email": "dr..andrew.lin.pharmd@email.com",
      "phone": "(555) 019-2834",
      "location": "Baltimore, MD",
      "website": "pharmacist-portfolio.dev",
      "linkedin": "linkedin.com/in/pharmacist",
      "github": "github.com/pharmacist"
    },
    "summary": "Results-driven Clinical Pharmacist (PharmD) with 4+ years of hands-on experience in Drug Utilization Review, Prescription Dispensing, Pharmacokinetics, Clinical Rounds. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "Drug Utilization Review",
      "Prescription Dispensing",
      "Pharmacokinetics",
      "Clinical Rounds",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Clinical Pharmacist (PharmD)",
        "company": "Apex Solutions Inc.",
        "location": "Baltimore, MD",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core clinical pharmacist (pharmd) initiatives utilizing Drug Utilization Review and Prescription Dispensing, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Clinical Pharmacist (PharmD) Specialist",
        "company": "Vertex Global Group",
        "location": "Baltimore, MD",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Clinical Pharmacist (PharmD) Architecture & Workflow Suite",
        "technologies": "Drug Utilization Review, Prescription Dispensing, Pharmacokinetics",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/pharmacist/enterprise-suite"
      },
      {
        "title": "High-Impact Clinical Pharmacist (PharmD) Performance Initiative",
        "technologies": "Prescription Dispensing, Pharmacokinetics, Clinical Rounds",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/pharmacist/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Clinical",
        "institution": "State University / Institute of Technology",
        "location": "Baltimore, MD",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Clinical Pharmacist (PharmD) Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "physical-therapist": {
    "personal": {
      "name": "Dr. Hannah Scott, DPT",
      "title": "Licensed Physical Therapist (DPT)",
      "email": "dr..hannah.scott.dpt@email.com",
      "phone": "(555) 019-2834",
      "location": "Minneapolis, MN",
      "website": "physical-therapist-portfolio.dev",
      "linkedin": "linkedin.com/in/physical-therapist",
      "github": "github.com/physical-therapist"
    },
    "summary": "Results-driven Licensed Physical Therapist (DPT) with 4+ years of hands-on experience in Orthopedic Rehab, Manual Therapy, Patient Care Plans, EMR Documentation. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "Orthopedic Rehab",
      "Manual Therapy",
      "Patient Care Plans",
      "EMR Documentation",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Licensed Physical Therapist (DPT)",
        "company": "Apex Solutions Inc.",
        "location": "Minneapolis, MN",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core licensed physical therapist (dpt) initiatives utilizing Orthopedic Rehab and Manual Therapy, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Licensed Physical Therapist (DPT) Specialist",
        "company": "Vertex Global Group",
        "location": "Minneapolis, MN",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Licensed Physical Therapist (DPT) Architecture & Workflow Suite",
        "technologies": "Orthopedic Rehab, Manual Therapy, Patient Care Plans",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/physical-therapist/enterprise-suite"
      },
      {
        "title": "High-Impact Licensed Physical Therapist (DPT) Performance Initiative",
        "technologies": "Manual Therapy, Patient Care Plans, EMR Documentation",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/physical-therapist/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Licensed",
        "institution": "State University / Institute of Technology",
        "location": "Minneapolis, MN",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Licensed Physical Therapist (DPT) Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "medical-assistant": {
    "personal": {
      "name": "Maria Santos",
      "title": "Certified Medical Assistant (CMA)",
      "email": "maria.santos@email.com",
      "phone": "(555) 019-2834",
      "location": "Orlando, FL",
      "website": "medical-assistant-portfolio.dev",
      "linkedin": "linkedin.com/in/medical-assistant",
      "github": "github.com/medical-assistant"
    },
    "summary": "Results-driven Certified Medical Assistant (CMA) with 4+ years of hands-on experience in Vital Signs, Phlebotomy, Patient Triage, EHR Scheduling, HIPAA Compliance. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "Vital Signs",
      "Phlebotomy",
      "Patient Triage",
      "EHR Scheduling",
      "HIPAA Compliance",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Certified Medical Assistant (CMA)",
        "company": "Apex Solutions Inc.",
        "location": "Orlando, FL",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core certified medical assistant (cma) initiatives utilizing Vital Signs and Phlebotomy, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Certified Medical Assistant (CMA) Specialist",
        "company": "Vertex Global Group",
        "location": "Orlando, FL",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Certified Medical Assistant (CMA) Architecture & Workflow Suite",
        "technologies": "Vital Signs, Phlebotomy, Patient Triage",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/medical-assistant/enterprise-suite"
      },
      {
        "title": "High-Impact Certified Medical Assistant (CMA) Performance Initiative",
        "technologies": "Phlebotomy, Patient Triage, EHR Scheduling",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/medical-assistant/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Certified",
        "institution": "State University / Institute of Technology",
        "location": "Orlando, FL",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Certified Medical Assistant (CMA) Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "dental-hygienist": {
    "personal": {
      "name": "Chloe Adams, RDH",
      "title": "Registered Dental Hygienist (RDH)",
      "email": "chloe.adams.rdh@email.com",
      "phone": "(555) 019-2834",
      "location": "Seattle, WA",
      "website": "dental-hygienist-portfolio.dev",
      "linkedin": "linkedin.com/in/dental-hygienist",
      "github": "github.com/dental-hygienist"
    },
    "summary": "Results-driven Registered Dental Hygienist (RDH) with 4+ years of hands-on experience in Periodontal Charting, Prophylaxis, Digital Radiography, Patient Education. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "Periodontal Charting",
      "Prophylaxis",
      "Digital Radiography",
      "Patient Education",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Registered Dental Hygienist (RDH)",
        "company": "Apex Solutions Inc.",
        "location": "Seattle, WA",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core registered dental hygienist (rdh) initiatives utilizing Periodontal Charting and Prophylaxis, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Registered Dental Hygienist (RDH) Specialist",
        "company": "Vertex Global Group",
        "location": "Seattle, WA",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Registered Dental Hygienist (RDH) Architecture & Workflow Suite",
        "technologies": "Periodontal Charting, Prophylaxis, Digital Radiography",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/dental-hygienist/enterprise-suite"
      },
      {
        "title": "High-Impact Registered Dental Hygienist (RDH) Performance Initiative",
        "technologies": "Prophylaxis, Digital Radiography, Patient Education",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/dental-hygienist/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Registered",
        "institution": "State University / Institute of Technology",
        "location": "Seattle, WA",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Registered Dental Hygienist (RDH) Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "healthcare-administrator": {
    "personal": {
      "name": "David Zimmerman",
      "title": "Healthcare Administrator",
      "email": "david.zimmerman@email.com",
      "phone": "(555) 019-2834",
      "location": "Cleveland, OH",
      "website": "healthcare-administrator-portfolio.dev",
      "linkedin": "linkedin.com/in/healthcare-administrator",
      "github": "github.com/healthcare-administrator"
    },
    "summary": "Results-driven Healthcare Administrator with 4+ years of hands-on experience in Hospital Operations, Joint Commission Compliance, Medical Billing, HIPAA, Staffing. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "Hospital Operations",
      "Joint Commission Compliance",
      "Medical Billing",
      "HIPAA",
      "Staffing",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Healthcare Administrator",
        "company": "Apex Solutions Inc.",
        "location": "Cleveland, OH",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core healthcare administrator initiatives utilizing Hospital Operations and Joint Commission Compliance, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Healthcare Administrator Specialist",
        "company": "Vertex Global Group",
        "location": "Cleveland, OH",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Healthcare Administrator Architecture & Workflow Suite",
        "technologies": "Hospital Operations, Joint Commission Compliance, Medical Billing",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/healthcare-administrator/enterprise-suite"
      },
      {
        "title": "High-Impact Healthcare Administrator Performance Initiative",
        "technologies": "Joint Commission Compliance, Medical Billing, HIPAA",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/healthcare-administrator/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Healthcare",
        "institution": "State University / Institute of Technology",
        "location": "Cleveland, OH",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Healthcare Administrator Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "clinical-researcher": {
    "personal": {
      "name": "Dr. Natalie Young",
      "title": "Clinical Research Coordinator",
      "email": "dr..natalie.young@email.com",
      "phone": "(555) 019-2834",
      "location": "Boston, MA",
      "website": "clinical-researcher-portfolio.dev",
      "linkedin": "linkedin.com/in/clinical-researcher",
      "github": "github.com/clinical-researcher"
    },
    "summary": "Results-driven Clinical Research Coordinator with 4+ years of hands-on experience in GCP Compliance, IRB Protocols, Clinical Trial Data (EDC), Patient Consent. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "GCP Compliance",
      "IRB Protocols",
      "Clinical Trial Data (EDC)",
      "Patient Consent",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Clinical Research Coordinator",
        "company": "Apex Solutions Inc.",
        "location": "Boston, MA",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core clinical research coordinator initiatives utilizing GCP Compliance and IRB Protocols, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Clinical Research Coordinator Specialist",
        "company": "Vertex Global Group",
        "location": "Boston, MA",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Clinical Research Coordinator Architecture & Workflow Suite",
        "technologies": "GCP Compliance, IRB Protocols, Clinical Trial Data (EDC)",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/clinical-researcher/enterprise-suite"
      },
      {
        "title": "High-Impact Clinical Research Coordinator Performance Initiative",
        "technologies": "IRB Protocols, Clinical Trial Data (EDC), Patient Consent",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/clinical-researcher/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Clinical",
        "institution": "State University / Institute of Technology",
        "location": "Boston, MA",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Clinical Research Coordinator Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "ui-ux-designer": {
    "personal": {
      "name": "Lucas Meyer",
      "title": "UI/UX Product Designer",
      "email": "lucas.meyer@email.com",
      "phone": "(555) 019-2834",
      "location": "San Francisco, CA",
      "website": "ui-ux-designer-portfolio.dev",
      "linkedin": "linkedin.com/in/ui-ux-designer",
      "github": "github.com/ui-ux-designer"
    },
    "summary": "Results-driven UI/UX Product Designer with 4+ years of hands-on experience in Figma Design Systems, Wireframing, User Testing, Prototyping, Mobile UX. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "Figma Design Systems",
      "Wireframing",
      "User Testing",
      "Prototyping",
      "Mobile UX",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead UI/UX Product Designer",
        "company": "Apex Solutions Inc.",
        "location": "San Francisco, CA",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core ui/ux product designer initiatives utilizing Figma Design Systems and Wireframing, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "UI/UX Product Designer Specialist",
        "company": "Vertex Global Group",
        "location": "San Francisco, CA",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise UI/UX Product Designer Architecture & Workflow Suite",
        "technologies": "Figma Design Systems, Wireframing, User Testing",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/ui-ux-designer/enterprise-suite"
      },
      {
        "title": "High-Impact UI/UX Product Designer Performance Initiative",
        "technologies": "Wireframing, User Testing, Prototyping",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/ui-ux-designer/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in UI/UX",
        "institution": "State University / Institute of Technology",
        "location": "San Francisco, CA",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified UI/UX Product Designer Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "graphic-designer": {
    "personal": {
      "name": "Zoe Kravitz",
      "title": "Senior Graphic Designer",
      "email": "zoe.kravitz@email.com",
      "phone": "(555) 019-2834",
      "location": "Los Angeles, CA",
      "website": "graphic-designer-portfolio.dev",
      "linkedin": "linkedin.com/in/graphic-designer",
      "github": "github.com/graphic-designer"
    },
    "summary": "Results-driven Senior Graphic Designer with 4+ years of hands-on experience in Adobe Illustrator, Photoshop, InDesign, Brand Identity, Visual Typography. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "Adobe Illustrator",
      "Photoshop",
      "InDesign",
      "Brand Identity",
      "Visual Typography",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Senior Graphic Designer",
        "company": "Apex Solutions Inc.",
        "location": "Los Angeles, CA",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core senior graphic designer initiatives utilizing Adobe Illustrator and Photoshop, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Senior Graphic Designer Specialist",
        "company": "Vertex Global Group",
        "location": "Los Angeles, CA",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Senior Graphic Designer Architecture & Workflow Suite",
        "technologies": "Adobe Illustrator, Photoshop, InDesign",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/graphic-designer/enterprise-suite"
      },
      {
        "title": "High-Impact Senior Graphic Designer Performance Initiative",
        "technologies": "Photoshop, InDesign, Brand Identity",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/graphic-designer/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Senior",
        "institution": "State University / Institute of Technology",
        "location": "Los Angeles, CA",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Senior Graphic Designer Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "art-director": {
    "personal": {
      "name": "Sebastian Cole",
      "title": "Art Director & Brand Lead",
      "email": "sebastian.cole@email.com",
      "phone": "(555) 019-2834",
      "location": "New York, NY",
      "website": "art-director-portfolio.dev",
      "linkedin": "linkedin.com/in/art-director",
      "github": "github.com/art-director"
    },
    "summary": "Results-driven Art Director & Brand Lead with 4+ years of hands-on experience in Visual Storytelling, Campaign Creative Direction, Agency Leadership, Branding. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "Visual Storytelling",
      "Campaign Creative Direction",
      "Agency Leadership",
      "Branding",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Art Director & Brand Lead",
        "company": "Apex Solutions Inc.",
        "location": "New York, NY",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core art director & brand lead initiatives utilizing Visual Storytelling and Campaign Creative Direction, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Art Director & Brand Lead Specialist",
        "company": "Vertex Global Group",
        "location": "New York, NY",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Art Director & Brand Lead Architecture & Workflow Suite",
        "technologies": "Visual Storytelling, Campaign Creative Direction, Agency Leadership",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/art-director/enterprise-suite"
      },
      {
        "title": "High-Impact Art Director & Brand Lead Performance Initiative",
        "technologies": "Campaign Creative Direction, Agency Leadership, Branding",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/art-director/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Art",
        "institution": "State University / Institute of Technology",
        "location": "New York, NY",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Art Director & Brand Lead Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "interior-designer": {
    "personal": {
      "name": "Aria Montgomery",
      "title": "Interior Designer & Space Planner",
      "email": "aria.montgomery@email.com",
      "phone": "(555) 019-2834",
      "location": "Miami, FL",
      "website": "interior-designer-portfolio.dev",
      "linkedin": "linkedin.com/in/interior-designer",
      "github": "github.com/interior-designer"
    },
    "summary": "Results-driven Interior Designer & Space Planner with 4+ years of hands-on experience in AutoCAD, SketchUp, 3D Rendering, FF&E Sourcing, Material Selection. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "AutoCAD",
      "SketchUp",
      "3D Rendering",
      "FF&E Sourcing",
      "Material Selection",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Interior Designer & Space Planner",
        "company": "Apex Solutions Inc.",
        "location": "Miami, FL",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core interior designer & space planner initiatives utilizing AutoCAD and SketchUp, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Interior Designer & Space Planner Specialist",
        "company": "Vertex Global Group",
        "location": "Miami, FL",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Interior Designer & Space Planner Architecture & Workflow Suite",
        "technologies": "AutoCAD, SketchUp, 3D Rendering",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/interior-designer/enterprise-suite"
      },
      {
        "title": "High-Impact Interior Designer & Space Planner Performance Initiative",
        "technologies": "SketchUp, 3D Rendering, FF&E Sourcing",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/interior-designer/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Interior",
        "institution": "State University / Institute of Technology",
        "location": "Miami, FL",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Interior Designer & Space Planner Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "animator": {
    "personal": {
      "name": "Leo Takahashi",
      "title": "3D & 2D Motion Animator",
      "email": "leo.takahashi@email.com",
      "phone": "(555) 019-2834",
      "location": "Burbank, CA",
      "website": "animator-portfolio.dev",
      "linkedin": "linkedin.com/in/animator",
      "github": "github.com/animator"
    },
    "summary": "Results-driven 3D & 2D Motion Animator with 4+ years of hands-on experience in Maya, Blender, After Effects, Character Rigging, Storyboarding, Keyframing. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "Maya",
      "Blender",
      "After Effects",
      "Character Rigging",
      "Storyboarding",
      "Keyframing",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead 3D & 2D Motion Animator",
        "company": "Apex Solutions Inc.",
        "location": "Burbank, CA",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core 3d & 2d motion animator initiatives utilizing Maya and Blender, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "3D & 2D Motion Animator Specialist",
        "company": "Vertex Global Group",
        "location": "Burbank, CA",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise 3D & 2D Motion Animator Architecture & Workflow Suite",
        "technologies": "Maya, Blender, After Effects",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/animator/enterprise-suite"
      },
      {
        "title": "High-Impact 3D & 2D Motion Animator Performance Initiative",
        "technologies": "Blender, After Effects, Character Rigging",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/animator/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in 3D",
        "institution": "State University / Institute of Technology",
        "location": "Burbank, CA",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified 3D & 2D Motion Animator Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "video-editor": {
    "personal": {
      "name": "Miles O'Connor",
      "title": "Video Editor & Post-Production Lead",
      "email": "miles.o'connor@email.com",
      "phone": "(555) 019-2834",
      "location": "Los Angeles, CA",
      "website": "video-editor-portfolio.dev",
      "linkedin": "linkedin.com/in/video-editor",
      "github": "github.com/video-editor"
    },
    "summary": "Results-driven Video Editor & Post-Production Lead with 4+ years of hands-on experience in Premiere Pro, DaVinci Resolve, Color Grading, Sound Design, Short-form Reels. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "Premiere Pro",
      "DaVinci Resolve",
      "Color Grading",
      "Sound Design",
      "Short-form Reels",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Video Editor & Post-Production Lead",
        "company": "Apex Solutions Inc.",
        "location": "Los Angeles, CA",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core video editor & post-production lead initiatives utilizing Premiere Pro and DaVinci Resolve, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Video Editor & Post-Production Lead Specialist",
        "company": "Vertex Global Group",
        "location": "Los Angeles, CA",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Video Editor & Post-Production Lead Architecture & Workflow Suite",
        "technologies": "Premiere Pro, DaVinci Resolve, Color Grading",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/video-editor/enterprise-suite"
      },
      {
        "title": "High-Impact Video Editor & Post-Production Lead Performance Initiative",
        "technologies": "DaVinci Resolve, Color Grading, Sound Design",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/video-editor/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Video",
        "institution": "State University / Institute of Technology",
        "location": "Los Angeles, CA",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Video Editor & Post-Production Lead Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "content-creator": {
    "personal": {
      "name": "Chloe Bennett",
      "title": "Content Creator & Producer",
      "email": "chloe.bennett@email.com",
      "phone": "(555) 019-2834",
      "location": "Austin, TX",
      "website": "content-creator-portfolio.dev",
      "linkedin": "linkedin.com/in/content-creator",
      "github": "github.com/content-creator"
    },
    "summary": "Results-driven Content Creator & Producer with 4+ years of hands-on experience in Short-Form Video (TikTok/Reels), Scriptwriting, Audience Growth, Brand Collabs. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "Short-Form Video (TikTok/Reels)",
      "Scriptwriting",
      "Audience Growth",
      "Brand Collabs",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Content Creator & Producer",
        "company": "Apex Solutions Inc.",
        "location": "Austin, TX",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core content creator & producer initiatives utilizing Short-Form Video (TikTok/Reels) and Scriptwriting, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Content Creator & Producer Specialist",
        "company": "Vertex Global Group",
        "location": "Austin, TX",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Content Creator & Producer Architecture & Workflow Suite",
        "technologies": "Short-Form Video (TikTok/Reels), Scriptwriting, Audience Growth",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/content-creator/enterprise-suite"
      },
      {
        "title": "High-Impact Content Creator & Producer Performance Initiative",
        "technologies": "Scriptwriting, Audience Growth, Brand Collabs",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/content-creator/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Content",
        "institution": "State University / Institute of Technology",
        "location": "Austin, TX",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Content Creator & Producer Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "copywriter": {
    "personal": {
      "name": "Harrison Wells",
      "title": "Senior Conversion Copywriter",
      "email": "harrison.wells@email.com",
      "phone": "(555) 019-2834",
      "location": "New York, NY",
      "website": "copywriter-portfolio.dev",
      "linkedin": "linkedin.com/in/copywriter",
      "github": "github.com/copywriter"
    },
    "summary": "Results-driven Senior Conversion Copywriter with 4+ years of hands-on experience in Direct Response Copy, Landing Pages, Email Sequences, SEO Messaging, Ad Hooks. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "Direct Response Copy",
      "Landing Pages",
      "Email Sequences",
      "SEO Messaging",
      "Ad Hooks",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Senior Conversion Copywriter",
        "company": "Apex Solutions Inc.",
        "location": "New York, NY",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core senior conversion copywriter initiatives utilizing Direct Response Copy and Landing Pages, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Senior Conversion Copywriter Specialist",
        "company": "Vertex Global Group",
        "location": "New York, NY",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Senior Conversion Copywriter Architecture & Workflow Suite",
        "technologies": "Direct Response Copy, Landing Pages, Email Sequences",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/copywriter/enterprise-suite"
      },
      {
        "title": "High-Impact Senior Conversion Copywriter Performance Initiative",
        "technologies": "Landing Pages, Email Sequences, SEO Messaging",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/copywriter/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Senior",
        "institution": "State University / Institute of Technology",
        "location": "New York, NY",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Senior Conversion Copywriter Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "social-media-manager": {
    "personal": {
      "name": "Brittany Spears",
      "title": "Social Media Marketing Manager",
      "email": "brittany.spears@email.com",
      "phone": "(555) 019-2834",
      "location": "Atlanta, GA",
      "website": "social-media-manager-portfolio.dev",
      "linkedin": "linkedin.com/in/social-media-manager",
      "github": "github.com/social-media-manager"
    },
    "summary": "Results-driven Social Media Marketing Manager with 4+ years of hands-on experience in Social Content Strategy, Viral Reels, Sprout Social, Community Management, ROI. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "Social Content Strategy",
      "Viral Reels",
      "Sprout Social",
      "Community Management",
      "ROI",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Social Media Marketing Manager",
        "company": "Apex Solutions Inc.",
        "location": "Atlanta, GA",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core social media marketing manager initiatives utilizing Social Content Strategy and Viral Reels, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Social Media Marketing Manager Specialist",
        "company": "Vertex Global Group",
        "location": "Atlanta, GA",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Social Media Marketing Manager Architecture & Workflow Suite",
        "technologies": "Social Content Strategy, Viral Reels, Sprout Social",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/social-media-manager/enterprise-suite"
      },
      {
        "title": "High-Impact Social Media Marketing Manager Performance Initiative",
        "technologies": "Viral Reels, Sprout Social, Community Management",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/social-media-manager/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Social",
        "institution": "State University / Institute of Technology",
        "location": "Atlanta, GA",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Social Media Marketing Manager Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "digital-marketing-specialist": {
    "personal": {
      "name": "Ryan Gallagher",
      "title": "Digital Marketing Specialist",
      "email": "ryan.gallagher@email.com",
      "phone": "(555) 019-2834",
      "location": "Chicago, IL",
      "website": "digital-marketing-specialist-portfolio.dev",
      "linkedin": "linkedin.com/in/digital-marketing-specialist",
      "github": "github.com/digital-marketing-specialist"
    },
    "summary": "Results-driven Digital Marketing Specialist with 4+ years of hands-on experience in Google Ads (PPC), Meta Ads, GA4, Funnel Optimization, ROAS, Retargeting. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "Google Ads (PPC)",
      "Meta Ads",
      "GA4",
      "Funnel Optimization",
      "ROAS",
      "Retargeting",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Digital Marketing Specialist",
        "company": "Apex Solutions Inc.",
        "location": "Chicago, IL",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core digital marketing specialist initiatives utilizing Google Ads (PPC) and Meta Ads, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Digital Marketing Specialist Specialist",
        "company": "Vertex Global Group",
        "location": "Chicago, IL",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Digital Marketing Specialist Architecture & Workflow Suite",
        "technologies": "Google Ads (PPC), Meta Ads, GA4",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/digital-marketing-specialist/enterprise-suite"
      },
      {
        "title": "High-Impact Digital Marketing Specialist Performance Initiative",
        "technologies": "Meta Ads, GA4, Funnel Optimization",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/digital-marketing-specialist/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Digital",
        "institution": "State University / Institute of Technology",
        "location": "Chicago, IL",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Digital Marketing Specialist Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "seo-specialist": {
    "personal": {
      "name": "Aaron Feldman",
      "title": "SEO Strategist & Technical Lead",
      "email": "aaron.feldman@email.com",
      "phone": "(555) 019-2834",
      "location": "San Jose, CA",
      "website": "seo-specialist-portfolio.dev",
      "linkedin": "linkedin.com/in/seo-specialist",
      "github": "github.com/seo-specialist"
    },
    "summary": "Results-driven SEO Strategist & Technical Lead with 4+ years of hands-on experience in Technical SEO, Keyword Research, Semrush/Ahrefs, Link Building, Content Strategy. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "Technical SEO",
      "Keyword Research",
      "Semrush/Ahrefs",
      "Link Building",
      "Content Strategy",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead SEO Strategist & Technical Lead",
        "company": "Apex Solutions Inc.",
        "location": "San Jose, CA",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core seo strategist & technical lead initiatives utilizing Technical SEO and Keyword Research, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "SEO Strategist & Technical Lead Specialist",
        "company": "Vertex Global Group",
        "location": "San Jose, CA",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise SEO Strategist & Technical Lead Architecture & Workflow Suite",
        "technologies": "Technical SEO, Keyword Research, Semrush/Ahrefs",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/seo-specialist/enterprise-suite"
      },
      {
        "title": "High-Impact SEO Strategist & Technical Lead Performance Initiative",
        "technologies": "Keyword Research, Semrush/Ahrefs, Link Building",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/seo-specialist/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in SEO",
        "institution": "State University / Institute of Technology",
        "location": "San Jose, CA",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified SEO Strategist & Technical Lead Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "public-relations-specialist": {
    "personal": {
      "name": "Victoria Sterling",
      "title": "Public Relations Specialist",
      "email": "victoria.sterling@email.com",
      "phone": "(555) 019-2834",
      "location": "Washington, D.C.",
      "website": "public-relations-specialist-portfolio.dev",
      "linkedin": "linkedin.com/in/public-relations-specialist",
      "github": "github.com/public-relations-specialist"
    },
    "summary": "Results-driven Public Relations Specialist with 4+ years of hands-on experience in Media Pitching, Press Releases, Crisis Communication, Brand Reputation, Cision. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "Media Pitching",
      "Press Releases",
      "Crisis Communication",
      "Brand Reputation",
      "Cision",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Public Relations Specialist",
        "company": "Apex Solutions Inc.",
        "location": "Washington, D.C.",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core public relations specialist initiatives utilizing Media Pitching and Press Releases, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Public Relations Specialist Specialist",
        "company": "Vertex Global Group",
        "location": "Washington, D.C.",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Public Relations Specialist Architecture & Workflow Suite",
        "technologies": "Media Pitching, Press Releases, Crisis Communication",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/public-relations-specialist/enterprise-suite"
      },
      {
        "title": "High-Impact Public Relations Specialist Performance Initiative",
        "technologies": "Press Releases, Crisis Communication, Brand Reputation",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/public-relations-specialist/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Public",
        "institution": "State University / Institute of Technology",
        "location": "Washington, D.C.",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Public Relations Specialist Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "marketing-manager": {
    "personal": {
      "name": "Dominic Reed",
      "title": "Growth Marketing Manager",
      "email": "dominic.reed@email.com",
      "phone": "(555) 019-2834",
      "location": "New York, NY",
      "website": "marketing-manager-portfolio.dev",
      "linkedin": "linkedin.com/in/marketing-manager",
      "github": "github.com/marketing-manager"
    },
    "summary": "Results-driven Growth Marketing Manager with 4+ years of hands-on experience in Omnichannel Growth, CAC/LTV Optimization, Email Automation, Team Leadership. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "Omnichannel Growth",
      "CAC/LTV Optimization",
      "Email Automation",
      "Team Leadership",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Growth Marketing Manager",
        "company": "Apex Solutions Inc.",
        "location": "New York, NY",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core growth marketing manager initiatives utilizing Omnichannel Growth and CAC/LTV Optimization, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Growth Marketing Manager Specialist",
        "company": "Vertex Global Group",
        "location": "New York, NY",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Growth Marketing Manager Architecture & Workflow Suite",
        "technologies": "Omnichannel Growth, CAC/LTV Optimization, Email Automation",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/marketing-manager/enterprise-suite"
      },
      {
        "title": "High-Impact Growth Marketing Manager Performance Initiative",
        "technologies": "CAC/LTV Optimization, Email Automation, Team Leadership",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/marketing-manager/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Growth",
        "institution": "State University / Institute of Technology",
        "location": "New York, NY",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Growth Marketing Manager Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "teacher": {
    "personal": {
      "name": "Sarah Jenkins",
      "title": "Certified High School Teacher",
      "email": "sarah.jenkins@email.com",
      "phone": "(555) 019-2834",
      "location": "Columbus, OH",
      "website": "teacher-portfolio.dev",
      "linkedin": "linkedin.com/in/teacher",
      "github": "github.com/teacher"
    },
    "summary": "Results-driven Certified High School Teacher with 4+ years of hands-on experience in Curriculum Development, Classroom Management, Differentiated Instruction, EdTech. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "Curriculum Development",
      "Classroom Management",
      "Differentiated Instruction",
      "EdTech",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Certified High School Teacher",
        "company": "Apex Solutions Inc.",
        "location": "Columbus, OH",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core certified high school teacher initiatives utilizing Curriculum Development and Classroom Management, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Certified High School Teacher Specialist",
        "company": "Vertex Global Group",
        "location": "Columbus, OH",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Certified High School Teacher Architecture & Workflow Suite",
        "technologies": "Curriculum Development, Classroom Management, Differentiated Instruction",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/teacher/enterprise-suite"
      },
      {
        "title": "High-Impact Certified High School Teacher Performance Initiative",
        "technologies": "Classroom Management, Differentiated Instruction, EdTech",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/teacher/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Certified",
        "institution": "State University / Institute of Technology",
        "location": "Columbus, OH",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Certified High School Teacher Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "professor": {
    "personal": {
      "name": "Dr. William Bennett",
      "title": "University Professor & Academic Researcher",
      "email": "dr..william.bennett@email.com",
      "phone": "(555) 019-2834",
      "location": "Cambridge, MA",
      "website": "professor-portfolio.dev",
      "linkedin": "linkedin.com/in/professor",
      "github": "github.com/professor"
    },
    "summary": "Results-driven University Professor & Academic Researcher with 4+ years of hands-on experience in Higher Education Lecturing, Peer-Reviewed Publications, Grant Writing, Mentorship. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "Higher Education Lecturing",
      "Peer-Reviewed Publications",
      "Grant Writing",
      "Mentorship",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead University Professor & Academic Researcher",
        "company": "Apex Solutions Inc.",
        "location": "Cambridge, MA",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core university professor & academic researcher initiatives utilizing Higher Education Lecturing and Peer-Reviewed Publications, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "University Professor & Academic Researcher Specialist",
        "company": "Vertex Global Group",
        "location": "Cambridge, MA",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise University Professor & Academic Researcher Architecture & Workflow Suite",
        "technologies": "Higher Education Lecturing, Peer-Reviewed Publications, Grant Writing",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/professor/enterprise-suite"
      },
      {
        "title": "High-Impact University Professor & Academic Researcher Performance Initiative",
        "technologies": "Peer-Reviewed Publications, Grant Writing, Mentorship",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/professor/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in University",
        "institution": "State University / Institute of Technology",
        "location": "Cambridge, MA",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified University Professor & Academic Researcher Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "tutor": {
    "personal": {
      "name": "Deepak Joshi",
      "title": "Academic Subject Tutor & Test Prep Coach",
      "email": "deepak.joshi@email.com",
      "phone": "(555) 019-2834",
      "location": "Bengaluru, India",
      "website": "tutor-portfolio.dev",
      "linkedin": "linkedin.com/in/tutor",
      "github": "github.com/tutor"
    },
    "summary": "Results-driven Academic Subject Tutor & Test Prep Coach with 4+ years of hands-on experience in One-on-One Tutoring, SAT/ACT Prep, Personalized Study Plans, Student Progress. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "One-on-One Tutoring",
      "SAT/ACT Prep",
      "Personalized Study Plans",
      "Student Progress",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Academic Subject Tutor & Test Prep Coach",
        "company": "Apex Solutions Inc.",
        "location": "Bengaluru, India",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core academic subject tutor & test prep coach initiatives utilizing One-on-One Tutoring and SAT/ACT Prep, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Academic Subject Tutor & Test Prep Coach Specialist",
        "company": "Vertex Global Group",
        "location": "Bengaluru, India",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Academic Subject Tutor & Test Prep Coach Architecture & Workflow Suite",
        "technologies": "One-on-One Tutoring, SAT/ACT Prep, Personalized Study Plans",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/tutor/enterprise-suite"
      },
      {
        "title": "High-Impact Academic Subject Tutor & Test Prep Coach Performance Initiative",
        "technologies": "SAT/ACT Prep, Personalized Study Plans, Student Progress",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/tutor/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Academic",
        "institution": "State University / Institute of Technology",
        "location": "Bengaluru, India",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Academic Subject Tutor & Test Prep Coach Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "school-counselor": {
    "personal": {
      "name": "Patricia Morales",
      "title": "Certified School Counselor",
      "email": "patricia.morales@email.com",
      "phone": "(555) 019-2834",
      "location": "San Antonio, TX",
      "website": "school-counselor-portfolio.dev",
      "linkedin": "linkedin.com/in/school-counselor",
      "github": "github.com/school-counselor"
    },
    "summary": "Results-driven Certified School Counselor with 4+ years of hands-on experience in Student Guidance, College Admissions Counseling, Crisis Intervention, IEP Meetings. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "Student Guidance",
      "College Admissions Counseling",
      "Crisis Intervention",
      "IEP Meetings",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Certified School Counselor",
        "company": "Apex Solutions Inc.",
        "location": "San Antonio, TX",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core certified school counselor initiatives utilizing Student Guidance and College Admissions Counseling, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Certified School Counselor Specialist",
        "company": "Vertex Global Group",
        "location": "San Antonio, TX",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Certified School Counselor Architecture & Workflow Suite",
        "technologies": "Student Guidance, College Admissions Counseling, Crisis Intervention",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/school-counselor/enterprise-suite"
      },
      {
        "title": "High-Impact Certified School Counselor Performance Initiative",
        "technologies": "College Admissions Counseling, Crisis Intervention, IEP Meetings",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/school-counselor/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Certified",
        "institution": "State University / Institute of Technology",
        "location": "San Antonio, TX",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Certified School Counselor Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "instructional-designer": {
    "personal": {
      "name": "Keith Anderson",
      "title": "Instructional Designer & E-Learning Developer",
      "email": "keith.anderson@email.com",
      "phone": "(555) 019-2834",
      "location": "Salt Lake City, UT",
      "website": "instructional-designer-portfolio.dev",
      "linkedin": "linkedin.com/in/instructional-designer",
      "github": "github.com/instructional-designer"
    },
    "summary": "Results-driven Instructional Designer & E-Learning Developer with 4+ years of hands-on experience in Articulate 360, Storyline, ADDIE Model, LMS Administration, SCORM. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "Articulate 360",
      "Storyline",
      "ADDIE Model",
      "LMS Administration",
      "SCORM",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Instructional Designer & E-Learning Developer",
        "company": "Apex Solutions Inc.",
        "location": "Salt Lake City, UT",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core instructional designer & e-learning developer initiatives utilizing Articulate 360 and Storyline, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Instructional Designer & E-Learning Developer Specialist",
        "company": "Vertex Global Group",
        "location": "Salt Lake City, UT",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Instructional Designer & E-Learning Developer Architecture & Workflow Suite",
        "technologies": "Articulate 360, Storyline, ADDIE Model",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/instructional-designer/enterprise-suite"
      },
      {
        "title": "High-Impact Instructional Designer & E-Learning Developer Performance Initiative",
        "technologies": "Storyline, ADDIE Model, LMS Administration",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/instructional-designer/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Instructional",
        "institution": "State University / Institute of Technology",
        "location": "Salt Lake City, UT",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Instructional Designer & E-Learning Developer Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "education-administrator": {
    "personal": {
      "name": "Dr. Margaret Hayes",
      "title": "Education Administrator & Principal",
      "email": "dr..margaret.hayes@email.com",
      "phone": "(555) 019-2834",
      "location": "Richmond, VA",
      "website": "education-administrator-portfolio.dev",
      "linkedin": "linkedin.com/in/education-administrator",
      "github": "github.com/education-administrator"
    },
    "summary": "Results-driven Education Administrator & Principal with 4+ years of hands-on experience in School Operations, Staff Supervision, District Compliance, Budget Management. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "School Operations",
      "Staff Supervision",
      "District Compliance",
      "Budget Management",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Education Administrator & Principal",
        "company": "Apex Solutions Inc.",
        "location": "Richmond, VA",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core education administrator & principal initiatives utilizing School Operations and Staff Supervision, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Education Administrator & Principal Specialist",
        "company": "Vertex Global Group",
        "location": "Richmond, VA",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Education Administrator & Principal Architecture & Workflow Suite",
        "technologies": "School Operations, Staff Supervision, District Compliance",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/education-administrator/enterprise-suite"
      },
      {
        "title": "High-Impact Education Administrator & Principal Performance Initiative",
        "technologies": "Staff Supervision, District Compliance, Budget Management",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/education-administrator/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Education",
        "institution": "State University / Institute of Technology",
        "location": "Richmond, VA",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Education Administrator & Principal Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "human-resources-manager": {
    "personal": {
      "name": "Samantha Lee",
      "title": "Human Resources Manager (SHRM-CP)",
      "email": "samantha.lee@email.com",
      "phone": "(555) 019-2834",
      "location": "San Jose, CA",
      "website": "human-resources-manager-portfolio.dev",
      "linkedin": "linkedin.com/in/human-resources-manager",
      "github": "github.com/human-resources-manager"
    },
    "summary": "Results-driven Human Resources Manager (SHRM-CP) with 4+ years of hands-on experience in Talent Acquisition, Employee Relations, HRIS (Workday), Compliance, Culture. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "Talent Acquisition",
      "Employee Relations",
      "HRIS (Workday)",
      "Compliance",
      "Culture",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Human Resources Manager (SHRM-CP)",
        "company": "Apex Solutions Inc.",
        "location": "San Jose, CA",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core human resources manager (shrm-cp) initiatives utilizing Talent Acquisition and Employee Relations, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Human Resources Manager (SHRM-CP) Specialist",
        "company": "Vertex Global Group",
        "location": "San Jose, CA",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Human Resources Manager (SHRM-CP) Architecture & Workflow Suite",
        "technologies": "Talent Acquisition, Employee Relations, HRIS (Workday)",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/human-resources-manager/enterprise-suite"
      },
      {
        "title": "High-Impact Human Resources Manager (SHRM-CP) Performance Initiative",
        "technologies": "Employee Relations, HRIS (Workday), Compliance",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/human-resources-manager/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Human",
        "institution": "State University / Institute of Technology",
        "location": "San Jose, CA",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Human Resources Manager (SHRM-CP) Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  },
  "executive-assistant": {
    "personal": {
      "name": "Caroline Vance",
      "title": "Executive Assistant to C-Suite",
      "email": "caroline.vance@email.com",
      "phone": "(555) 019-2834",
      "location": "New York, NY",
      "website": "executive-assistant-portfolio.dev",
      "linkedin": "linkedin.com/in/executive-assistant",
      "github": "github.com/executive-assistant"
    },
    "summary": "Results-driven Executive Assistant to C-Suite with 4+ years of hands-on experience in Calendar Management, Travel Coordination, Board Meeting Minutes, Confidentiality. Proven track record of delivering measurable project outcomes, optimizing operational workflows by 38%, and maintaining 100% compliance with industry benchmarks.",
    "skills": [
      "Calendar Management",
      "Travel Coordination",
      "Board Meeting Minutes",
      "Confidentiality",
      "Jira",
      "Agile / Scrum",
      "Quality Assurance",
      "Cross-Functional Collaboration",
      "Process Automation"
    ],
    "experience": [
      {
        "role": "Lead Executive Assistant to C-Suite",
        "company": "Apex Solutions Inc.",
        "location": "New York, NY",
        "dates": "2023 - Present",
        "descriptions": [
          "Led core executive assistant to c-suite initiatives utilizing Calendar Management and Travel Coordination, improving delivery velocity by 38%.",
          "Architected modular framework across 18 high-priority deliverables, ensuring 100% compliance with industry benchmarks.",
          "Mentored 4 junior specialists and established continuous quality review protocols."
        ]
      },
      {
        "role": "Executive Assistant to C-Suite Specialist",
        "company": "Vertex Global Group",
        "location": "New York, NY",
        "dates": "2021 - 2023",
        "descriptions": [
          "Executed daily operational workflows, reducing turnaround latency by 25% across key projects.",
          "Collaborated with cross-functional leadership to deliver $240,000 in annual operational cost efficiencies.",
          "Authored technical standard operating procedures (SOPs) and automated recurring reporting."
        ]
      }
    ],
    "projects": [
      {
        "title": "Enterprise Executive Assistant to C-Suite Architecture & Workflow Suite",
        "technologies": "Calendar Management, Travel Coordination, Board Meeting Minutes",
        "description": "Designed and deployed comprehensive enterprise solution resulting in 42% operational efficiency gain and automated reporting.",
        "link": "github.com/executive-assistant/enterprise-suite"
      },
      {
        "title": "High-Impact Executive Assistant to C-Suite Performance Initiative",
        "technologies": "Travel Coordination, Board Meeting Minutes, Confidentiality",
        "description": "Spearheaded core optimization project reducing error rates by 65% while managing cross-functional stakeholder deliverables.",
        "link": "github.com/executive-assistant/performance-suite"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science / Degree in Executive",
        "institution": "State University / Institute of Technology",
        "location": "New York, NY",
        "dates": "2017 - 2021",
        "gpa": "First Class with Distinction \u2022 Dean's Honors List"
      }
    ],
    "certifications": [
      {
        "name": "Certified Executive Assistant to C-Suite Professional",
        "issuer": "Global Professional Standards Institute",
        "dates": "2024"
      }
    ]
  }
};
