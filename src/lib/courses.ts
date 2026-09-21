export interface LearningGoalOption {
  id: string;
  name: string;
  category: "Programming" | "Core Computer Science" | "Data" | "Development" | "Modern Technology";
  description: string;
  slug: string;
}

export const ALL_LEARNING_GOALS: LearningGoalOption[] = [
  {
    id: "dsa",
    name: "Data Structures & Algorithms",
    category: "Core Computer Science",
    description: "Arrays, Strings, Linked Lists, Stacks, Queues, Trees, Graphs, and Dynamic Programming.",
    slug: "dsa",
  },
  {
    id: "data-analytics",
    name: "Data Analytics",
    category: "Data",
    description: "Python, NumPy, Pandas, Data Cleaning, SQL, Statistics, Data Visualization, and EDA.",
    slug: "data-analytics",
  },
  {
    id: "python",
    name: "Python",
    category: "Programming",
    description: "Syntax, Data Structures, OOP, File I/O, Modules, and Engineering Automation.",
    slug: "python",
  },
  {
    id: "java",
    name: "Java",
    category: "Programming",
    description: "Core Java, OOP, Collections Framework, Multithreading, and Streams.",
    slug: "java",
  },
  {
    id: "cpp",
    name: "C++",
    category: "Programming",
    description: "Memory layout, Pointers, OOP, Standard Template Library (STL), and Templates.",
    slug: "cpp",
  },
  {
    id: "web-development",
    name: "Web Development",
    category: "Development",
    description: "HTML, CSS, JavaScript, DOM, Git, React, Node.js, Databases, and Deployment.",
    slug: "web-development",
  },
  {
    id: "machine-learning",
    name: "Machine Learning",
    category: "Data",
    description: "Math foundations, Supervised Learning, Classification, Clustering, and Neural Networks.",
    slug: "machine-learning",
  },
  {
    id: "artificial-intelligence",
    name: "Artificial Intelligence",
    category: "Data",
    description: "AI problem solving, Heuristics, Knowledge representation, Machine Learning, and NLP.",
    slug: "machine-learning",
  },
  {
    id: "data-science",
    name: "Data Science",
    category: "Data",
    description: "Data analysis pipelines, Feature engineering, Statistical modeling, and Machine Learning.",
    slug: "data-analytics",
  },
  {
    id: "cloud-computing",
    name: "Cloud Computing",
    category: "Modern Technology",
    description: "Cloud architectures (AWS/GCP), Virtualization, Docker containers, and Cloud hosting.",
    slug: "cloud-devops",
  },
  {
    id: "devops",
    name: "DevOps",
    category: "Modern Technology",
    description: "CI/CD pipelines, Docker, Kubernetes container orchestration, and Infrastructure as Code.",
    slug: "cloud-devops",
  },
  {
    id: "cyber-security",
    name: "Cyber Security",
    category: "Modern Technology",
    description: "Network security, Cryptography, OWASP Web Vulnerabilities, and Ethical Hacking.",
    slug: "cyber-security",
  },
  {
    id: "database-management",
    name: "Database Management",
    category: "Core Computer Science",
    description: "Relational models, SQL queries, Normalization (1NF-BCNF), ACID transactions, and Indexing.",
    slug: "dbms",
  },
  {
    id: "computer-networks",
    name: "Computer Networks",
    category: "Core Computer Science",
    description: "OSI & TCP/IP models, IP addressing, Routing protocols, Transport layer, and HTTP/DNS.",
    slug: "computer-networks",
  },
  {
    id: "operating-systems",
    name: "Operating Systems",
    category: "Core Computer Science",
    description: "Processes, Threads, CPU scheduling algorithms, Synchronization, and Virtual memory.",
    slug: "operating-systems",
  },
  {
    id: "app-development",
    name: "App Development",
    category: "Development",
    description: "Mobile app engineering, Kotlin/Android, Jetpack Compose, Flutter, React Native, Firebase, and App Store deployment.",
    slug: "app-development",
  },
  {
    id: "ui-ux",
    name: "UI/UX",
    category: "Development",
    description: "Design systems, User personas, Wireframing, Prototyping, and Usability testing.",
    slug: "web-development",
  },
  {
    id: "software-development",
    name: "Software Development",
    category: "Development",
    description: "Software engineering principles, System design, Testing, Version control, and Clean code.",
    slug: "web-development",
  },
];

export function goalNameToCourseSlug(goalName: string): string {
  if (!goalName) return "dsa";
  const normalized = goalName.trim().toLowerCase();

  // Mobile App Development takes precedence before web
  if (
    normalized.includes("app") ||
    normalized.includes("mobile") ||
    normalized.includes("android") ||
    normalized.includes("flutter") ||
    normalized.includes("react native") ||
    normalized.includes("kotlin") ||
    normalized.includes("ios")
  ) {
    return "app-development";
  }
  if (normalized.includes("analytic") || normalized.includes("data science")) {
    return "data-analytics";
  }
  if (normalized.includes("algo") || normalized.includes("dsa") || normalized.includes("structure")) {
    return "dsa";
  }
  if (normalized.includes("web") || normalized.includes("frontend") || normalized.includes("backend") || normalized.includes("software") || normalized.includes("ui/ux")) {
    return "web-development";
  }
  if (normalized === "python" || normalized.includes("python")) {
    return "python";
  }
  if (normalized.includes("machine learning") || normalized.includes("artificial") || normalized === "ai" || normalized === "ml") {
    return "machine-learning";
  }
  if (normalized.includes("database") || normalized.includes("dbms") || normalized.includes("sql")) {
    return "dbms";
  }
  if (normalized.includes("cloud") || normalized.includes("devops")) {
    return "cloud-devops";
  }
  if (normalized.includes("cyber") || normalized.includes("security")) {
    return "cyber-security";
  }
  if (normalized === "java" || normalized.includes("java")) {
    return "java";
  }
  if (normalized.includes("c++") || normalized.includes("cpp")) {
    return "cpp";
  }
  if (normalized.includes("network")) {
    return "computer-networks";
  }
  if (normalized.includes("operating") || normalized.includes("os")) {
    return "operating-systems";
  }

  const match = ALL_LEARNING_GOALS.find(
    (g) => g.name.toLowerCase() === normalized || g.id === normalized || g.slug === normalized
  );
  return match ? match.slug : "dsa";
}

export function courseSlugToGoalName(slug: string): string {
  if (!slug) return "Data Structures & Algorithms";
  switch (slug) {
    case "app-development":
      return "App Development";
    case "data-analytics":
      return "Data Analytics";
    case "dsa":
      return "Data Structures & Algorithms";
    case "web-development":
      return "Web Development";
    case "python":
      return "Python";
    case "machine-learning":
      return "Machine Learning";
    case "dbms":
      return "Database Management";
    case "cloud-devops":
      return "Cloud Computing & DevOps";
    case "cyber-security":
      return "Cyber Security";
    case "java":
      return "Java";
    case "cpp":
      return "C++";
    case "operating-systems":
      return "Operating Systems";
    case "computer-networks":
      return "Computer Networks";
    default:
      return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }
}
