// Part 4: Cyber Security, Java, C++
const topicContentDataPart4 = {
  // =========================================================================
  // 8. CYBER SECURITY
  // =========================================================================
  "security-fundamentals": {
    videos: [
      {
        title: "Cyber Security Fundamentals: CIA Triad & Threat Modeling",
        youtubeUrl: "https://www.youtube.com/watch?v=nzZkKoREEGo",
        duration: "24 min",
        channel: "NetworkChuck",
        description: "Confidentiality, Integrity, Availability, threat actors, zero trust principles, and defense-in-depth.",
        learningObjective: "Understand core information security principles, threat classification, and defense-in-depth."
      }
    ],
    questions: [
      {
        questionText: "What are the three pillars of the CIA Triad in information security?",
        optionA: "Cryptography, Inspection, Authorization",
        optionB: "Confidentiality (preventing unauthorized disclosure), Integrity (preventing unauthorized modification), Availability (ensuring timely authorized access)",
        optionC: "Control, Identification, Access",
        optionD: "Centralization, Infrastructure, Algorithms",
        correctAnswer: "B",
        explanation: "The CIA Triad constitutes the foundational model of information security: Confidentiality, Integrity, and Availability.",
        difficulty: "EASY",
        sourceReference: "CIA Triad Principles"
      },
      {
        questionText: "What is the core philosophy of a Zero Trust Architecture in cybersecurity?",
        optionA: "Never verify, trust all internal corporate network traffic.",
        optionB: "'Never trust, always verify'—assume breach and enforce strict identity verification, least-privilege access, and continuous validation for all requests regardless of origin.",
        optionC: "Disable all antivirus software.",
        optionD: "Allow anonymous root shell access.",
        correctAnswer: "B",
        explanation: "Zero Trust abandons the perimeter model ('inside good, outside bad') and requires continuous authentication, authorization, and microsegmentation.",
        difficulty: "EASY",
        sourceReference: "Zero Trust Architecture"
      },
      {
        questionText: "What is the Principle of Least Privilege (PoLP)?",
        optionA: "Users should be granted root administrative privileges by default.",
        optionB: "Users, applications, and system processes should be granted only the absolute minimum access levels and permissions required to perform their specific tasks.",
        optionC: "Users should change passwords every 5 minutes.",
        optionD: "Applications should have no internet access.",
        correctAnswer: "B",
        explanation: "Least privilege limits potential damage from compromised credentials or software vulnerabilities by restricting permissions to essential duties.",
        difficulty: "EASY",
        sourceReference: "Access Control Principles"
      },
      {
        questionText: "What is Defense-in-Depth in cybersecurity strategy?",
        optionA: "Digging underground data bunkers.",
        optionB: "Layering multiple defensive security controls (firewalls, IDS/IPS, MFA, encryption, patching, auditing) so that if one layer fails, others stop the breach.",
        optionC: "Using only open-source software.",
        optionD: "Running multiple operating systems on one laptop.",
        correctAnswer: "B",
        explanation: "Defense-in-depth ensures redundancy: physical security, perimeter defenses, network controls, host security, application validation, and data encryption.",
        difficulty: "MEDIUM",
        sourceReference: "Defense-in-Depth"
      },
      {
        questionText: "What is Social Engineering in the context of cyber attacks?",
        optionA: "Writing social media algorithms in Python.",
        optionB: "The psychological manipulation of individuals into divulging confidential credentials, sensitive information, or performing unauthorized actions.",
        optionC: "Optimizing website SEO tags.",
        optionD: "Designing user interface layouts.",
        correctAnswer: "B",
        explanation: "Social engineering targets the human element (via phishing, pretexting, baiting, tailgating) rather than technical software bugs.",
        difficulty: "EASY",
        sourceReference: "Social Engineering Attacks"
      }
    ]
  },

  "cryptography": {
    videos: [
      {
        title: "Cryptography & PKI: Symmetric vs Asymmetric Ciphers & RSA",
        youtubeUrl: "https://www.youtube.com/watch?v=GSIDS_lvRv4",
        duration: "25 min",
        channel: "Computerphile",
        description: "AES symmetric encryption, RSA/ECC public key cryptography, digital signatures, hash collisions, and SSL/TLS certificates.",
        learningObjective: "Master symmetric/asymmetric cipher mechanics, Diffie-Hellman key exchange, and X.509 PKI certificates."
      }
    ],
    questions: [
      {
        questionText: "What is the primary difference between Symmetric and Asymmetric encryption?",
        optionA: "Symmetric uses text; Asymmetric uses numbers.",
        optionB: "Symmetric encryption uses the same shared secret key for both encryption and decryption; Asymmetric uses a mathematically linked public-private key pair.",
        optionC: "Asymmetric encryption is 1000x faster than symmetric encryption.",
        optionD: "Symmetric encryption can only encrypt 128 bytes.",
        correctAnswer: "B",
        explanation: "Symmetric (e.g. AES) uses one shared secret key for fast bulk encryption; Asymmetric (e.g. RSA, ECC) uses public/private keys for secure key exchange and signatures.",
        difficulty: "EASY",
        sourceReference: "Cryptography Classifications"
      },
      {
        questionText: "How does a Digital Signature provide Non-Repudiation and Integrity?",
        optionA: "The sender encrypts the entire message using the recipient's public key.",
        optionB: "The sender hashes the message and encrypts the hash with their private key; anyone with the sender's public key can verify that the sender created it and the message was untampered.",
        optionC: "The sender writes their initials at the bottom of the file.",
        optionD: "By storing the signature on a USB drive.",
        correctAnswer: "B",
        explanation: "Encrypting a hash with a private key proves authenticity (only private key holder could sign) and integrity (tampering breaks hash verification).",
        difficulty: "MEDIUM",
        sourceReference: "Digital Signatures"
      },
      {
        questionText: "What cryptographic problem does the Diffie-Hellman Key Exchange solve?",
        optionA: "Compiling code without syntax errors.",
        optionB: "Allowing two parties to securely establish a shared symmetric secret key over an insecure, eavesdropped communication channel without transmitting the key itself.",
        optionC: "Eliminating the need for passwords.",
        optionD: "Converting plain text into ASCII art.",
        correctAnswer: "B",
        explanation: "Diffie-Hellman enables two endpoints to agree on a shared symmetric key over a public network using modular discrete logarithms or elliptic curves.",
        difficulty: "MEDIUM",
        sourceReference: "Diffie-Hellman Protocol"
      },
      {
        questionText: "What property must a Cryptographic Hash Function (like SHA-256) possess?",
        optionA: "It must be reversible to retrieve the original plain text.",
        optionB: "Pre-image resistance (one-way), second pre-image resistance, collision resistance, and avalanche effect (slight input change drastically alters output).",
        optionC: "It must produce variable-length outputs depending on input length.",
        optionD: "It must be computed in constant time on all hardware.",
        correctAnswer: "B",
        explanation: "Cryptographic hash functions must be strictly one-way, collision-resistant (computationally infeasible to find two inputs with identical hash), and display avalanche behavior.",
        difficulty: "MEDIUM",
        sourceReference: "Cryptographic Hash Functions"
      },
      {
        questionText: "In a Public Key Infrastructure (PKI), what is the role of a Certificate Authority (CA)?",
        optionA: "To store users' private keys.",
        optionB: "A trusted third party that validates the identity of entities and issues cryptographically signed digital X.509 certificates binding identities to public keys.",
        optionC: "To provide free internet bandwidth.",
        optionD: "To scan web servers for malware.",
        correctAnswer: "B",
        explanation: "CAs act as trusted roots (like Let's Encrypt or DigiCert), signing public certificates so browsers can verify website identities via TLS.",
        difficulty: "EASY",
        sourceReference: "PKI & Certificate Authorities"
      }
    ]
  },

  "network-defense": {
    videos: [
      {
        title: "Network Defense: Firewalls, IDS/IPS & Packet Analysis",
        youtubeUrl: "https://www.youtube.com/watch?v=kDEX1HXybrk",
        duration: "24 min",
        channel: "NetworkChuck",
        description: "Stateful packet inspection firewalls, DMZ architectures, Intrusion Detection/Prevention Systems (IDS/IPS), and Wireshark inspection.",
        learningObjective: "Configure network defense controls, stateful firewall rules, and analyze malicious traffic patterns."
      }
    ],
    questions: [
      {
        questionText: "How does a Stateful Inspection Firewall differ from a simple Packet Filtering Firewall?",
        optionA: "Stateful firewalls only operate in the USA.",
        optionB: "Stateful firewalls track the state and context of active TCP/UDP connections, permitting return traffic for established sessions, while packet filters inspect packets in isolation.",
        optionC: "Packet filtering firewalls inspect Layer 7 application payloads.",
        optionD: "Stateful firewalls cannot block port numbers.",
        correctAnswer: "B",
        explanation: "Stateful firewalls maintain a connection state table (SYN, ESTABLISHED), automatically allowing solicited reply packets without needing manual reverse rules.",
        difficulty: "MEDIUM",
        sourceReference: "Firewall Architectures"
      },
      {
        questionText: "What is the key functional difference between an IDS (Intrusion Detection System) and an IPS (Intrusion Prevention System)?",
        optionA: "An IDS is software; an IPS is hardware.",
        optionB: "An IDS monitors and alerts administrators about suspicious traffic out-of-band; an IPS sits in-line with network traffic and actively drops malicious packets automatically.",
        optionC: "An IPS only monitors outbound emails.",
        optionD: "There is no difference in capability.",
        correctAnswer: "B",
        explanation: "IDS detects and generates alerts passively; IPS is placed in-line in the packet stream to actively intercept and block attacking packets in real time.",
        difficulty: "EASY",
        sourceReference: "IDS vs IPS"
      },
      {
        questionText: "What is a DMZ (Demilitarized Zone) in network perimeter architecture?",
        optionA: "A network zone with zero security firewalls.",
        optionB: "A perimeter subnetwork containing external-facing services (e.g. web/mail servers) isolated from the sensitive internal corporate intranet by separate firewalls.",
        optionC: "A wireless network for guest smartphones.",
        optionD: "A cloud region in another country.",
        correctAnswer: "B",
        explanation: "A DMZ exposes public servers to the internet while firewalling the internal enterprise network, ensuring compromised public servers cannot directly reach internal databases.",
        difficulty: "EASY",
        sourceReference: "DMZ Network Segmentation"
      },
      {
        questionText: "What attack does a SYN Flood perform against a target server?",
        optionA: "Sends millions of invalid passwords via SSH.",
        optionB: "Sends a barrage of TCP SYN packets with spoofed source IPs, exhausting the target's half-open TCP connection backlog queue (SYN queue) to deny service.",
        optionC: "Overheats network cables with electrical current.",
        optionD: "Modifies DNS records on the domain registrar.",
        correctAnswer: "B",
        explanation: "SYN flood exploits the TCP 3-way handshake: the server allocates memory for half-open sockets waiting for ACKs that never arrive, exhausting resources.",
        difficulty: "MEDIUM",
        sourceReference: "DDoS Attack Vectors"
      },
      {
        questionText: "Which tool is the industry standard for capturing and analyzing raw network packet bytes (PCAP) across network interfaces?",
        optionA: "Wireshark (and tcpdump)",
        optionB: "Postman",
        optionC: "Docker",
        optionD: "GitLab",
        correctAnswer: "A",
        explanation: "Wireshark (GUI) and tcpdump (CLI) capture raw network packets from interfaces and dissect protocols at byte-level precision.",
        difficulty: "EASY",
        sourceReference: "Packet Analysis Tools"
      }
    ]
  },

  "web-vulnerabilities": {
    videos: [
      {
        title: "OWASP Top 10 Web Vulnerabilities: SQLi, XSS, CSRF & SSRF",
        youtubeUrl: "https://www.youtube.com/watch?v=F-gW4K3zL4M",
        duration: "26 min",
        channel: "Traversy Media",
        description: "The most critical web security risks: SQL Injection, Stored/Reflected XSS, Broken Access Control, SSRF, and sanitization.",
        learningObjective: "Identify and remediate OWASP Top 10 vulnerabilities with parameterized queries, context escaping, and access controls."
      }
    ],
    questions: [
      {
        questionText: "How can SQL Injection (SQLi) vulnerabilities be completely and definitively prevented in backend applications?",
        optionA: "By banning single quote characters in user input.",
        optionB: "By using Parameterized Queries (Prepared Statements) or Object-Relational Mappers (ORMs), separating query logic from user data inputs.",
        optionC: "By using HTTPS encryption.",
        optionD: "By converting all database tables to read-only.",
        correctAnswer: "B",
        explanation: "Prepared statements pre-compile the SQL execution plan and treat user input strictly as data parameters, making SQL injection syntactically impossible.",
        difficulty: "EASY",
        sourceReference: "OWASP SQL Injection Prevention"
      },
      {
        questionText: "What is Cross-Site Scripting (XSS)?",
        optionA: "An attack that overrides CSS styles on another website.",
        optionB: "An injection flaw where malicious client-side JavaScript is injected into trusted web applications and executed inside unsuspecting victims' browsers.",
        optionC: "A denial of service attack against DNS servers.",
        optionD: "An attack that decrypts SSL sessions.",
        correctAnswer: "B",
        explanation: "XSS occurs when unvalidated user input is rendered in HTML output without escaping, executing attacker scripts in user sessions to steal cookies/tokens.",
        difficulty: "EASY",
        sourceReference: "OWASP Cross-Site Scripting"
      },
      {
        questionText: "What is Server-Side Request Forgery (SSRF)?",
        optionA: "An attack where the client sends forged cookies to a server.",
        optionB: "An attacker abuses functionality on a vulnerable server to force the server to initiate unintended network requests to internal systems or cloud metadata endpoints.",
        optionC: "A database corrupting its own log files.",
        optionD: "An operating system crash caused by memory leaks.",
        correctAnswer: "B",
        explanation: "SSRF allows attackers to coerce the backend server into sending requests to internal private IPs (e.g. AWS 169.254.169.254 metadata), bypassing firewall perimeters.",
        difficulty: "MEDIUM",
        sourceReference: "OWASP SSRF"
      },
      {
        questionText: "What HTTP response header helps mitigate XSS attacks by restricting which origins scripts, stylesheets, and fonts can be loaded from?",
        optionA: "Content-Type",
        optionB: "Content-Security-Policy (CSP)",
        optionC: "X-Frame-Options",
        optionD: "Server",
        correctAnswer: "B",
        explanation: "Content-Security-Policy (CSP) allows server administrators to declare allowed sources of executable scripts, blocking unauthorized inline scripts and untrusted domains.",
        difficulty: "MEDIUM",
        sourceReference: "Content Security Policy"
      },
      {
        questionText: "What category of vulnerability holds the #1 position in the OWASP Top 10?",
        optionA: "Cryptographic Failures",
        optionB: "Broken Access Control (e.g. IDOR - Insecure Direct Object References)",
        optionC: "Injection",
        optionD: "Security Logging and Monitoring Failures",
        correctAnswer: "B",
        explanation: "Broken Access Control (including IDOR, privilege escalation, and viewing other users' data by changing URL IDs) is ranked #1 in OWASP Top 10.",
        difficulty: "MEDIUM",
        sourceReference: "OWASP Top 10 Ranking"
      }
    ]
  },

  "incident-response": {
    videos: [
      {
        title: "Ethical Hacking & Incident Response: PICERL Lifecycle",
        youtubeUrl: "https://www.youtube.com/watch?v=1C6v6VbZz1U",
        duration: "25 min",
        channel: "Professor Messer",
        description: "Incident handling phases (Preparation, Identification, Containment, Eradication, Recovery, Lessons Learned) and forensic evidence preservation.",
        learningObjective: "Execute incident response procedures, isolate compromised systems, preserve forensic chains of custody, and remediate breaches."
      }
    ],
    questions: [
      {
        questionText: "What are the six phases of the NIST/SANS Incident Response lifecycle?",
        optionA: "Plan, Execute, Test, Review, Deploy, Maintain",
        optionB: "Preparation, Identification (Detection), Containment, Eradication, Recovery, and Lessons Learned (Post-Incident Review)",
        optionC: "Hack, Defense, Retaliation, Patch, Audit, Shutdown",
        optionD: "Scan, Exploit, Pivot, Exfiltrate, Clean, Repeat",
        correctAnswer: "B",
        explanation: "The standard PICERL framework defines Preparation, Identification, Containment, Eradication, Recovery, and Lessons Learned.",
        difficulty: "EASY",
        sourceReference: "NIST SP 800-61 Incident Handling"
      },
      {
        questionText: "During the Containment phase of an active ransomware incident, what is the immediate critical step regarding infected endpoints?",
        optionA: "Formatting the hard drive immediately.",
        optionB: "Isolating the infected machines from the local network (disconnecting ethernet / disabling Wi-Fi) to prevent lateral spread while preserving RAM for forensics.",
        optionC: "Paying the ransom demand.",
        optionD: "Emailing the attacker to negotiate.",
        correctAnswer: "B",
        explanation: "Immediate network isolation halts lateral movement across the intranet, while leaving the machine powered preserves volatile memory (RAM) for forensic triage.",
        difficulty: "EASY",
        sourceReference: "Incident Containment"
      },
      {
        questionText: "Why is the Chain of Custody vital when collecting digital forensic evidence during a cyber breach investigation?",
        optionA: "It speeds up file decompression.",
        optionB: "It documents the chronological lifecycle, transfer, custody, and cryptographic hashing of evidence to ensure it remains admissible in a court of law.",
        optionC: "It encrypts server log files.",
        optionD: "It is required to run antivirus scans.",
        correctAnswer: "B",
        explanation: "Chain of custody proves evidence has not been tampered with or altered from collection through presentation in legal proceedings.",
        difficulty: "MEDIUM",
        sourceReference: "Digital Forensics"
      },
      {
        questionText: "What is Order of Volatility when gathering digital evidence from a compromised system?",
        optionA: "Collecting alphabetically by file extension.",
        optionB: "Collecting evidence from most volatile (perishable) to least volatile: CPU registers/cache -> RAM -> Network state -> Disk storage -> Archival backups.",
        optionC: "Collecting largest files first.",
        optionD: "Collecting oldest files first.",
        correctAnswer: "B",
        explanation: "Volatile data is lost when power is cycled. Forensics begins with registers and RAM before moving to non-volatile disk blocks.",
        difficulty: "HARD",
        sourceReference: "Order of Volatility"
      },
      {
        questionText: "What is the primary goal of the 'Lessons Learned' phase in incident response?",
        optionA: "Assigning blame and firing junior engineers.",
        optionB: "Conducting a blameless post-mortem to analyze root cause, evaluate IR team performance, and update defensive controls to prevent recurrence.",
        optionC: "Reporting the incident to social media.",
        optionD: "Deleting all logs associated with the incident.",
        correctAnswer: "B",
        explanation: "Lessons learned (post-mortem) identifies systemic weaknesses, improves playbooks, updates detection rules, and closes the incident loop.",
        difficulty: "EASY",
        sourceReference: "Post-Incident Analysis"
      }
    ]
  },

  // =========================================================================
  // 9. JAVA PROGRAMMING
  // =========================================================================
  "java-syntax": {
    videos: [
      {
        title: "Java Syntax & Primitive Types: Memory, JVM & Control Flow",
        youtubeUrl: "https://www.youtube.com/watch?v=eIrMbAQSU34",
        duration: "25 min",
        channel: "Programming with Mosh",
        description: "JVM execution model, bytecode, primitive types vs wrapper objects, operators, and control structures.",
        learningObjective: "Master Java compilation (javac to bytecode), JVM execution, primitive bitwidths, and flow control."
      }
    ],
    questions: [
      {
        questionText: "How does Java achieve 'Write Once, Run Anywhere' (WORA) cross-platform portability?",
        optionA: "Java source code is interpreted directly by the operating system kernel.",
        optionB: "The Java compiler (`javac`) compiles source code into platform-independent Bytecode (`.class`), which is executed by the platform-specific Java Virtual Machine (JVM).",
        optionC: "Java transpiles into C++ on every machine.",
        optionD: "Java only runs inside web browsers.",
        correctAnswer: "B",
        explanation: "Bytecode is a standard instruction set executed by the JVM; each OS has its own JVM implementation translating bytecode into native CPU instructions.",
        difficulty: "EASY",
        sourceReference: "JVM Architecture"
      },
      {
        questionText: "What is the bitwidth and default value of the `int` primitive type in Java?",
        optionA: "16-bit, default null",
        optionB: "32-bit signed two's complement integer, default 0 (when declared as field)",
        optionC: "64-bit unsigned integer, default 1",
        optionD: "8-bit byte, default 0",
        correctAnswer: "B",
        explanation: "Java `int` is strictly a 32-bit signed two's complement integer ranging from -2^31 to 2^31 - 1, defaulting to 0 for class fields.",
        difficulty: "EASY",
        sourceReference: "Java Primitive Types"
      },
      {
        questionText: "What is Autoboxing and Unboxing in Java?",
        optionA: "Compressing Java files into JAR archives.",
        optionB: "The automatic conversion the Java compiler makes between primitive types (e.g. `int`, `double`) and their corresponding object wrapper classes (e.g. `Integer`, `Double`).",
        optionC: "Converting Java classes to JSON.",
        optionD: "Packaging code for cloud deployment.",
        correctAnswer: "B",
        explanation: "Autoboxing converts primitive `int` to `Integer` automatically when assigned to object references; unboxing does the reverse.",
        difficulty: "MEDIUM",
        sourceReference: "Autoboxing & Wrapper Classes"
      },
      {
        questionText: "Why does comparing two Java Strings with `str1 == str2` often lead to logical bugs?",
        optionA: "`==` does not exist in Java syntax.",
        optionB: "`==` tests reference equality (whether both point to the exact same memory address), whereas `.equals()` tests value equality (whether character sequences match).",
        optionC: "`==` converts strings to numbers.",
        optionD: "Strings can only be compared using `compareTo()`.",
        correctAnswer: "B",
        explanation: "`==` checks if both references point to the exact same memory object. To check if two separate strings contain identical characters, `str1.equals(str2)` is required.",
        difficulty: "EASY",
        sourceReference: "Java String Equality"
      },
      {
        questionText: "What does the `final` keyword indicate when applied to a variable, method, and class respectively in Java?",
        optionA: "It must run last in the program.",
        optionB: "Variable: value cannot be reassigned; Method: cannot be overridden by subclasses; Class: cannot be extended (subclassed).",
        optionC: "It marks the variable for garbage collection.",
        optionD: "It makes the class accessible from all packages.",
        correctAnswer: "B",
        explanation: "`final` enforces immutability: final variable is constant after initialization, final method prevents overriding, final class prevents inheritance (e.g. `java.lang.String`).",
        difficulty: "MEDIUM",
        sourceReference: "Java Final Keyword"
      }
    ]
  },

  "java-oop": {
    videos: [
      {
        title: "Java OOP: Inheritance, Polymorphism, Abstract Classes & Interfaces",
        youtubeUrl: "https://www.youtube.com/watch?v=a199KZGTOxk",
        duration: "26 min",
        channel: "Telusko",
        description: "Four OOP pillars in Java, method overriding vs overloading, dynamic method dispatch, interfaces, and composition.",
        learningObjective: "Implement clean object-oriented class hierarchies, interfaces with default methods, and dynamic polymorphism."
      }
    ],
    questions: [
      {
        questionText: "What is Dynamic Method Dispatch in Java?",
        optionA: "Dispatching network packets dynamically.",
        optionB: "The mechanism by which a call to an overridden method is resolved at runtime based on the actual object type, rather than the reference type (Runtime Polymorphism).",
        optionC: "Compiling methods on background threads.",
        optionD: "Calling private methods via reflection.",
        correctAnswer: "B",
        explanation: "If `Animal a = new Dog(); a.makeSound();`, runtime method dispatch resolves to `Dog.makeSound()` because the actual runtime instance is a Dog.",
        difficulty: "MEDIUM",
        sourceReference: "Dynamic Method Dispatch"
      },
      {
        questionText: "What is the key difference between an `interface` and an `abstract class` in Java?",
        optionA: "Interfaces cannot have any code; abstract classes can.",
        optionB: "A class can implement multiple interfaces but can extend only one abstract class (single inheritance), and abstract classes can maintain state (instance fields).",
        optionC: "Interfaces can only be instantiated with `new Interface()`.",
        optionD: "Abstract classes cannot declare public methods.",
        correctAnswer: "B",
        explanation: "Java permits multiple interface implementation but strictly single class inheritance. Abstract classes can declare stateful instance variables.",
        difficulty: "MEDIUM",
        sourceReference: "Interface vs Abstract Class"
      },
      {
        questionText: "What is the difference between Method Overloading and Method Overriding?",
        optionA: "Overloading occurs in different classes; Overriding in the same class.",
        optionB: "Overloading defines methods with the same name but different parameter signatures in the same class (compile-time); Overriding redefines a superclass method with the identical signature in a subclass (runtime).",
        optionC: "Overloading requires the `override` keyword.",
        optionD: "There is no difference.",
        correctAnswer: "B",
        explanation: "Overloading is compile-time polymorphism (same name, different arguments); overriding is runtime polymorphism (same name & signature in subclass).",
        difficulty: "EASY",
        sourceReference: "Polymorphism in Java"
      },
      {
        questionText: "What does the `super` keyword do in a Java subclass constructor?",
        optionA: "Grants superuser administrator permissions.",
        optionB: "Invokes the constructor of the parent superclass, which must be the very first statement in the subclass constructor.",
        optionC: "Creates a new static variable.",
        optionD: "Restarts the JVM.",
        correctAnswer: "B",
        explanation: "`super(...)` explicitly calls the superclass constructor to initialize inherited fields, and must be the first line of the child constructor.",
        difficulty: "EASY",
        sourceReference: "Constructor Chaining"
      },
      {
        questionText: "Why is 'Composition over Inheritance' widely recommended in software design?",
        optionA: "Inheritance is deprecated in Java 17.",
        optionB: "Composition achieves loose coupling and flexible runtime behavior by assembling components ('has-a'), avoiding fragile base-class problems inherent in deep inheritance hierarchies ('is-a').",
        optionC: "Composition uses zero memory.",
        optionD: "Composition prevents garbage collection.",
        correctAnswer: "B",
        explanation: "Inheritance tightly couples subclasses to superclass internals. Composition ('has-a' relationship) allows components to be swapped dynamically at runtime.",
        difficulty: "MEDIUM",
        sourceReference: "Design Principles"
      }
    ]
  },

  "java-collections": {
    videos: [
      {
        title: "Java Collections Framework: List, Set, Map & Generics",
        youtubeUrl: "https://www.youtube.com/watch?v=9ogpeK_7m1k",
        duration: "27 min",
        channel: "Kunal Kushwaha",
        description: "ArrayList vs LinkedList, HashMap internal collision buckets (trees after Java 8), HashSet, and TreeMap.",
        learningObjective: "Select and optimize Java Collection classes, evaluate hash bucket mechanics, and use generics safely."
      }
    ],
    questions: [
      {
        questionText: "How does `HashMap` handle hash collisions internally in Java 8 and later?",
        optionA: "It drops the older entry.",
        optionB: "It initially stores colliding entries in a singly linked list; if a bucket reaches 8 elements (and table capacity >= 64), it treeifies into a Red-Black Tree for O(log N) worst-case lookups.",
        optionC: "It allocates a new database table.",
        optionD: "It converts all keys to lowercase strings.",
        correctAnswer: "B",
        explanation: "Java 8 upgraded HashMap collision buckets from pure linked lists (O(N) search) to balanced Red-Black Trees (O(log N)) when bucket size exceeds `TREEIFY_THRESHOLD = 8`.",
        difficulty: "HARD",
        sourceReference: "HashMap Internal Implementation"
      },
      {
        questionText: "What contract must be maintained between `equals()` and `hashCode()` in Java?",
        optionA: "If two objects have the same hashCode, their equals() must return true.",
        optionB: "If two objects are equal according to `equals()`, they MUST produce the exact same `hashCode()`; failing this contract breaks HashSets and HashMaps.",
        optionC: "hashCode() must always return a positive integer.",
        optionD: "equals() must never be overridden.",
        correctAnswer: "B",
        explanation: "If `a.equals(b)` is true, `a.hashCode() == b.hashCode()` must be true. Violating this causes HashMaps to look in the wrong bucket and lose elements.",
        difficulty: "MEDIUM",
        sourceReference: "equals and hashCode Contract"
      },
      {
        questionText: "What is the difference between `ArrayList` and `LinkedList` in Java for random index access (`get(i)`)?",
        optionA: "`ArrayList` is O(1); `LinkedList` is O(N) because it must traverse pointer nodes from the head/tail.",
        optionB: "`LinkedList` is O(1); `ArrayList` is O(N).",
        optionC: "Both are O(1).",
        optionD: "Both are O(N).",
        correctAnswer: "A",
        explanation: "ArrayList wraps a contiguous array with O(1) direct address calculation. LinkedList must sequentially traverse node pointers, costing O(N).",
        difficulty: "EASY",
        sourceReference: "List Implementations"
      },
      {
        questionText: "What implementation of the `Set` interface maintains elements in natural sorted ascending order?",
        optionA: "HashSet",
        optionB: "LinkedHashSet",
        optionC: "TreeSet (backed by a Red-Black NavigableMap)",
        optionD: "Vector",
        correctAnswer: "C",
        explanation: "TreeSet sorts elements according to their natural Comparable ordering or a specified Comparator, providing guaranteed O(log N) operations.",
        difficulty: "EASY",
        sourceReference: "Java Set Implementations"
      },
      {
        questionText: "What is Type Erasure in Java Generics?",
        optionA: "Deleting unused Java classes from the filesystem.",
        optionB: "The compiler enforces generic type constraints at compile time, then strips/erases all generic type parameters from the bytecode, replacing them with raw types or upper bounds (e.g. `Object`).",
        optionC: "A tool that clears memory registers.",
        optionD: "Allowing variables to hold any type without checks.",
        correctAnswer: "B",
        explanation: "Java generics were introduced in Java 5 with backwards compatibility: generic types exist during compilation and are erased in bytecode.",
        difficulty: "HARD",
        sourceReference: "Generics & Type Erasure"
      }
    ]
  },

  "java-multithreading": {
    videos: [
      {
        title: "Java Multithreading & Concurrency: Threads, Locks & Executors",
        youtubeUrl: "https://www.youtube.com/watch?v=L94f9p0W2nU",
        duration: "28 min",
        channel: "Defog Tech",
        description: "Thread lifecycle, synchronization, volatile keyword, race conditions, ReentrantLock, and ExecutorService thread pools.",
        learningObjective: "Write thread-safe concurrent Java code using synchronization, atomic primitives, and executor thread pools."
      }
    ],
    questions: [
      {
        questionText: "What is a Race Condition in concurrent Java programming?",
        optionA: "When two threads execute faster than the CPU clock.",
        optionB: "When multiple threads concurrently access and modify shared mutable state without proper synchronization, making the final outcome dependent on non-deterministic execution order.",
        optionC: "When a thread terminates before starting.",
        optionD: "When the JVM runs out of heap memory.",
        correctAnswer: "B",
        explanation: "Race conditions occur when the correctness of a program depends on the relative timing or interleaving of threads accessing unsynchronized shared state.",
        difficulty: "EASY",
        sourceReference: "Concurrency Fundamentals"
      },
      {
        questionText: "What guarantees does the `volatile` keyword provide in Java?",
        optionA: "It provides atomic operations for compound actions like `count++`.",
        optionB: "Visibility guarantee: writes to a volatile variable are immediately flushed to main memory and subsequent reads by other threads observe the updated value, preventing thread caching.",
        optionC: "It locks the entire class from other threads.",
        optionD: "It serializes the object to disk.",
        correctAnswer: "B",
        explanation: "`volatile` ensures memory visibility and prevents instruction reordering across reads/writes, but does NOT guarantee atomicity for compound operations (`i++`).",
        difficulty: "MEDIUM",
        sourceReference: "Java Memory Model & Volatile"
      },
      {
        questionText: "Why is using an `ExecutorService` thread pool preferred over creating raw `new Thread()` instances manually?",
        optionA: "Raw threads cannot execute runnable tasks.",
        optionB: "Thread creation carries significant OS kernel overhead; thread pools reuse a bounded set of worker threads, preventing thread exhaustion and managing lifecycle efficiently.",
        optionC: "Thread pools bypass Java syntax checks.",
        optionD: "Raw threads can only run in single-threaded mode.",
        correctAnswer: "B",
        explanation: "Creating OS threads is expensive (1MB stack per thread). Thread pools bound and reuse worker threads, queuing tasks and regulating concurrency.",
        difficulty: "EASY",
        sourceReference: "Java Concurrency Utilities"
      },
      {
        questionText: "What is a Deadlock in multithreaded systems?",
        optionA: "A thread that finishes execution successfully.",
        optionB: "A situation where two or more threads are permanently blocked because each holds a lock that the other thread requires to proceed.",
        optionC: "A thread that encounters an OutOfMemoryError.",
        optionD: "A thread running at maximum CPU utilization.",
        correctAnswer: "B",
        explanation: "Deadlock occurs when circular wait conditions arise (Thread A holds Lock 1 and waits for Lock 2, while Thread B holds Lock 2 and waits for Lock 1).",
        difficulty: "MEDIUM",
        sourceReference: "Deadlock Conditions"
      },
      {
        questionText: "What does the `java.util.concurrent.atomic.AtomicInteger` class use to achieve lock-free thread safety?",
        optionA: "Synchronized blocks on the class object.",
        optionB: "Hardware-level Compare-And-Swap (CAS) instructions (CPU atomic primitives).",
        optionC: "Sleep timers.",
        optionD: "Operating system file locks.",
        correctAnswer: "B",
        explanation: "Atomic classes use low-level CAS (Compare-And-Swap) machine instructions to update values atomically without thread suspension or locking overhead.",
        difficulty: "HARD",
        sourceReference: "Lock-Free Primitives & CAS"
      }
    ]
  },

  "java-streams-lambda": {
    videos: [
      {
        title: "Modern Java: Functional Programming, Streams & Lambdas",
        youtubeUrl: "https://www.youtube.com/watch?v=Q93JsQ8vcwY",
        duration: "25 min",
        channel: "Amigoscode",
        description: "Functional interfaces (@FunctionalInterface), lambda expressions, Stream operations (filter, map, reduce, collect), and Optional.",
        learningObjective: "Write clean, functional Java pipelines using lambdas, Stream transformations, and Optional null-safety."
      }
    ],
    questions: [
      {
        questionText: "What is a Functional Interface in Java?",
        optionA: "An interface with only private methods.",
        optionB: "An interface containing exactly one abstract method, suitable as the target type for a Lambda Expression or method reference.",
        optionC: "An interface that inherits from `java.lang.Thread`.",
        optionD: "An interface with no methods.",
        correctAnswer: "B",
        explanation: "Functional interfaces (marked with `@FunctionalInterface`) declare exactly one abstract method (SAM - Single Abstract Method), e.g. `Predicate`, `Consumer`, `Function`.",
        difficulty: "EASY",
        sourceReference: "Functional Interfaces"
      },
      {
        questionText: "What is the difference between Intermediate and Terminal operations in the Java Stream API?",
        optionA: "Intermediate operations output to console; terminal operations write to disk.",
        optionB: "Intermediate operations (e.g. `filter`, `map`) are lazy and return another Stream; Terminal operations (e.g. `collect`, `count`, `forEach`) trigger execution and produce a non-stream result.",
        optionC: "Terminal operations can be chained indefinitely.",
        optionD: "Intermediate operations can only run once per day.",
        correctAnswer: "B",
        explanation: "Stream pipelines are lazy: intermediate operations accumulate a processing pipeline, which is only executed when a terminal operation is invoked.",
        difficulty: "MEDIUM",
        sourceReference: "Java Stream Pipeline Lifecycle"
      },
      {
        questionText: "What is the primary purpose of `Optional<T>` introduced in Java 8?",
        optionA: "To make method parameters optional in compilation.",
        optionB: "To provide a clear, type-level representation for values that may be present or absent, helping eliminate NullPointerExceptions.",
        optionC: "To replace class constructors.",
        optionD: "To compress objects in memory.",
        correctAnswer: "B",
        explanation: "`Optional<T>` forces the caller to explicitly handle absent values via methods like `orElse()`, `map()`, and `ifPresent()`, mitigating null pointer risks.",
        difficulty: "EASY",
        sourceReference: "Optional API"
      },
      {
        questionText: "What does the `Stream.reduce()` operation do in Java?",
        optionA: "Reduces the font size of console output.",
        optionB: "Combines elements of a stream into a single summary result using an associative accumulation function (e.g. summing all numbers).",
        optionC: "Deletes half of the elements in the stream.",
        optionD: "Converts stream elements into strings.",
        correctAnswer: "B",
        explanation: "`reduce(identity, accumulator)` iteratively folds stream elements into a single accumulated result using binary operations.",
        difficulty: "MEDIUM",
        sourceReference: "Stream Reductions"
      },
      {
        questionText: "How can a sequential Stream be converted into a multi-threaded parallel execution stream in Java?",
        optionA: "By wrapping it in a `Thread` constructor.",
        optionB: "By invoking `.parallel()` or using `.parallelStream()`, which leverages the common ForkJoinPool to process chunks across CPU cores.",
        optionC: "By setting `java.stream.threads = 8` in system properties.",
        optionD: "Streams cannot be parallelized.",
        correctAnswer: "B",
        explanation: "Calling `parallel()` splits stream data into spliterators processed concurrently by the common `ForkJoinPool` worker threads.",
        difficulty: "MEDIUM",
        sourceReference: "Parallel Streams & ForkJoinPool"
      }
    ]
  },

  // =========================================================================
  // 10. C++ PROGRAMMING
  // =========================================================================
  "cpp-basics": {
    videos: [
      {
        title: "C++ Pointers, References & Memory Layout Masterclass",
        youtubeUrl: "https://www.youtube.com/watch?v=DTx7v4DoG8E",
        duration: "26 min",
        channel: "The Cherno",
        description: "Memory addressing, raw pointers, dereferencing, references, stack vs heap allocation, and memory leaks.",
        learningObjective: "Master pointer arithmetic, memory layout, pass-by-reference semantics, and manual memory management."
      }
    ],
    questions: [
      {
        questionText: "What is the key difference between a Pointer and a Reference in C++?",
        optionA: "Pointers do not exist in modern C++.",
        optionB: "A pointer stores a memory address, can be re-assigned, and can be nullptr; a reference is an alias to an existing object, cannot be null, and cannot be re-bound after initialization.",
        optionC: "References require manual `delete` calls.",
        optionD: "Pointers cannot access member functions.",
        correctAnswer: "B",
        explanation: "A reference `Type&` is syntactic sugar for a non-null, immutable alias to an object; a pointer `Type*` holds an address that can change or be null.",
        difficulty: "EASY",
        sourceReference: "C++ Pointers vs References"
      },
      {
        questionText: "What happens if dynamic memory allocated with `new` is not released with `delete` in C++?",
        optionA: "The garbage collector frees it automatically after 5 minutes.",
        optionB: "A Memory Leak occurs: the allocated heap memory remains occupied until process termination, potentially exhausting system RAM.",
        optionC: "The operating system forces a kernel panic.",
        optionD: "The compiler throws an error at build time.",
        correctAnswer: "B",
        explanation: "C++ does not have automatic garbage collection. Omitting `delete` causes leaked heap memory that cannot be reclaimed until the process exits.",
        difficulty: "EASY",
        sourceReference: "Memory Management & Leaks"
      },
      {
        questionText: "What is Pointer Arithmetic: what happens when incrementing a pointer `int* ptr` (assuming 4-byte `sizeof(int)`) with `ptr++`?",
        optionA: "It increments the address by 1 byte.",
        optionB: "It increments the address by `sizeof(int)` (4 bytes), pointing to the next consecutive integer in memory.",
        optionC: "It adds 1 to the integer value stored at that address.",
        optionD: "It creates a copy of the pointer.",
        correctAnswer: "B",
        explanation: "Pointer arithmetic is scaled by the size of the underlying type: `ptr + 1` advances the memory address by `sizeof(T)` bytes.",
        difficulty: "MEDIUM",
        sourceReference: "Pointer Arithmetic"
      },
      {
        questionText: "What is a Segmentation Fault in C++?",
        optionA: "A compilation syntax error.",
        optionB: "A hardware-generated CPU interrupt raised when a program attempts to access a memory page address it does not have permission to access (e.g. dereferencing nullptr or wild pointer).",
        optionC: "An infinite recursive loop.",
        optionD: "A disk full error.",
        correctAnswer: "B",
        explanation: "A segfault occurs when the MMU detects an invalid memory access (nullptr, unmapped address, out-of-bounds array access), causing the OS to kill the process.",
        difficulty: "EASY",
        sourceReference: "Memory Violations"
      },
      {
        questionText: "What is the difference between `const int* ptr`, `int* const ptr`, and `const int* const ptr`?",
        optionA: "There is no difference.",
        optionB: "`const int* ptr` points to a constant integer (cannot modify data); `int* const ptr` is a constant pointer (cannot change address pointed to); `const int* const ptr` makes both data and pointer immutable.",
        optionC: "They determine stack vs heap placement.",
        optionD: "They are only valid in C, not C++.",
        correctAnswer: "B",
        explanation: "Reading right-to-left: `const int*` = pointer to const int; `int* const` = const pointer to int; `const int* const` = const pointer to const int.",
        difficulty: "MEDIUM",
        sourceReference: "Const Correctness"
      }
    ]
  },

  "cpp-oop": {
    videos: [
      {
        title: "C++ Classes, RAII & Constructors: Rule of Three / Five",
        youtubeUrl: "https://www.youtube.com/watch?v=2BP8NhxjrY0",
        duration: "25 min",
        channel: "The Cherno",
        description: "Class structures, constructors, destructors, RAII (Resource Acquisition Is Initialization), and Rule of 3/5.",
        learningObjective: "Master RAII deterministic resource management, copy/move constructors, and destructor cleanup."
      }
    ],
    questions: [
      {
        questionText: "What is the core principle of RAII (Resource Acquisition Is Initialization) in C++?",
        optionA: "Always initialize variables with zeroes.",
        optionB: "Resource lifetime is bound to object lifetime: resources (memory, file handles, sockets) are acquired in constructors and deterministically released in destructors when objects go out of scope.",
        optionC: "Never allocate heap memory.",
        optionD: "Only write static functions.",
        correctAnswer: "B",
        explanation: "RAII guarantees deterministic cleanup when an object goes out of scope on the stack, providing automatic, exception-safe resource management.",
        difficulty: "MEDIUM",
        sourceReference: "RAII Idiom"
      },
      {
        questionText: "Why must a base class destructor always be declared `virtual` if derived objects are deleted via base class pointers?",
        optionA: "To speed up compilation time.",
        optionB: "Without a virtual destructor, `delete basePtr` invokes only the base class destructor, failing to call the derived class destructor and leaking derived resources (Undefined Behavior).",
        optionC: "C++ requires all destructors to be virtual.",
        optionD: "To make the class abstract.",
        correctAnswer: "B",
        explanation: "Virtual destructors ensure polymorphic deletion: the vtable dispatches destructor calls from the most-derived class down to the base class.",
        difficulty: "HARD",
        sourceReference: "Virtual Destructors"
      },
      {
        questionText: "What are the components of the 'Rule of Five' in modern C++?",
        optionA: "Five functions per class.",
        optionB: "If a class manages a resource and defines one of: Destructor, Copy Constructor, Copy Assignment Operator, Move Constructor, or Move Assignment Operator, it should explicitly define or delete all five.",
        optionC: "Classes must not have more than 5 members.",
        optionD: "A rule for formatting indentation with 5 spaces.",
        correctAnswer: "B",
        explanation: "The Rule of 5 ensures resource-managing classes properly handle both deep copying and move semantics without double-free errors or memory leaks.",
        difficulty: "HARD",
        sourceReference: "Rule of Three/Five/Zero"
      },
      {
        questionText: "What is the difference between a `struct` and a `class` in C++?",
        optionA: "Structs cannot have methods or constructors.",
        optionB: "The only difference is default access visibility: members and base classes of a `struct` are `public` by default, whereas in a `class` they are `private` by default.",
        optionC: "Structs are allocated on the stack; classes on the heap.",
        optionD: "Structs do not support inheritance.",
        correctAnswer: "EASY",
        explanation: "In C++, `struct` and `class` are functionally identical except default access: `public` for struct, `private` for class.",
        difficulty: "EASY",
        sourceReference: "Struct vs Class in C++"
      },
      {
        questionText: "What makes a C++ class an Abstract Class?",
        optionA: "Declaring the class with the `abstract` keyword.",
        optionB: "Declaring at least one Pure Virtual Function (`virtual void func() = 0;`).",
        optionC: "Having no member variables.",
        optionD: "Making all constructors private.",
        correctAnswer: "B",
        explanation: "A pure virtual function (`= 0`) makes a class abstract, preventing direct instantiation and forcing subclasses to provide implementations.",
        difficulty: "EASY",
        sourceReference: "Pure Virtual Functions"
      }
    ]
  },

  "cpp-stl": {
    videos: [
      {
        title: "C++ STL Masterclass: Vectors, Maps, Sets & Algorithms",
        youtubeUrl: "https://www.youtube.com/watch?v=zDetuE0i740",
        duration: "28 min",
        channel: "Luv",
        description: "Standard Template Library containers (vector, deque, list, set, map, unordered_map), iterators, and std::sort algorithms.",
        learningObjective: "Leverage STL sequence/associative containers, iterators, and standard algorithmic operations."
      }
    ],
    questions: [
      {
        questionText: "What is the underlying data structure and time complexity of `std::map` versus `std::unordered_map` in C++?",
        optionA: "`std::map` is a Red-Black balanced BST with O(log N) lookup; `std::unordered_map` is a Hash Table with O(1) average lookup.",
        optionB: "Both are arrays with O(N) lookup.",
        optionC: "`std::map` is a hash table; `std::unordered_map` is a binary tree.",
        optionD: "`std::unordered_map` keeps elements in sorted order.",
        correctAnswer: "A",
        explanation: "`std::map` stores sorted keys in a Red-Black self-balancing tree (O(log N)); `std::unordered_map` uses a hash table with bucket chaining (O(1) average).",
        difficulty: "MEDIUM",
        sourceReference: "STL Associative Containers"
      },
      {
        questionText: "What is Iterator Invalidation in C++ `std::vector`?",
        optionA: "When an iterator is assigned a negative number.",
        optionB: "When operations like `push_back()` cause a vector reallocation, all existing pointers, references, and iterators pointing into the old buffer become dangling and invalid.",
        optionC: "When iterators run out of memory.",
        optionD: "When an iterator is converted to a string.",
        correctAnswer: "B",
        explanation: "Reallocating dynamic array storage copies elements to a new heap buffer, rendering iterators referencing the old memory location dangling pointers.",
        difficulty: "HARD",
        sourceReference: "Vector Iterator Invalidation"
      },
      {
        questionText: "What sorting algorithm does `std::sort` utilize in the modern C++ standard library?",
        optionA: "Pure Bubble Sort",
        optionB: "Introsort (hybrid of Quicksort, switching to Heapsort when recursion depth exceeds limit, and Insertion Sort for small arrays)",
        optionC: "Pure Selection Sort",
        optionD: "Radix Sort exclusively",
        correctAnswer: "B",
        explanation: "Introsort provides O(N log N) worst-case performance by beginning with fast Quicksort and switching to Heapsort if recursion depth risks O(N^2) degradation.",
        difficulty: "HARD",
        sourceReference: "std::sort Implementation"
      },
      {
        questionText: "What is the advantage of `emplace_back()` over `push_back()` in `std::vector`?",
        optionA: "`emplace_back()` only works on integers.",
        optionB: "`emplace_back()` constructs the object directly in-place in the vector's memory using forwarded arguments, avoiding temporary object creation and copy/move overhead.",
        optionC: "`push_back()` is deprecated in modern C++.",
        optionD: "`emplace_back()` allocates memory on the stack.",
        correctAnswer: "B",
        explanation: "Emplacement forwards constructor arguments to construct the object directly within the container's storage, eliminating redundant copies.",
        difficulty: "MEDIUM",
        sourceReference: "Emplacement vs Insertion"
      },
      {
        questionText: "How does `std::lower_bound` find an element in a sorted vector in O(log N) time?",
        optionA: "By scanning linearly from the beginning.",
        optionB: "By performing binary search to return an iterator pointing to the first element that is not less than (>=) the specified value.",
        optionC: "By using a hash lookup table.",
        optionD: "By sorting the array in reverse.",
        correctAnswer: "B",
        explanation: "`std::lower_bound` executes binary search on partitioned/sorted ranges, finding the first element >= target in logarithmic time.",
        difficulty: "EASY",
        sourceReference: "STL Binary Search"
      }
    ]
  },

  "cpp-smart-pointers": {
    videos: [
      {
        title: "Modern C++ Smart Pointers: unique_ptr, shared_ptr & weak_ptr",
        youtubeUrl: "https://www.youtube.com/watch?v=UOB7-B2MfwA",
        duration: "24 min",
        channel: "The Cherno",
        description: "Memory safety in modern C++, exclusive ownership (unique_ptr), reference counted ownership (shared_ptr), and breaking cycles (weak_ptr).",
        learningObjective: "Eliminate memory leaks and dangling pointers using modern C++ smart pointer ownership semantics."
      }
    ],
    questions: [
      {
        questionText: "What ownership semantic does `std::unique_ptr` enforce?",
        optionA: "Shared reference counting across multiple owners.",
        optionB: "Strict exclusive ownership: only one `std::unique_ptr` can own the object at a time; it cannot be copied, only moved (`std::move`).",
        optionC: "Non-owning weak reference.",
        optionD: "Global heap ownership accessible by any thread.",
        correctAnswer: "B",
        explanation: "`std::unique_ptr` enforces single exclusive ownership with zero runtime overhead over a raw pointer, automatically deleting the resource when it exits scope.",
        difficulty: "EASY",
        sourceReference: "std::unique_ptr Semantics"
      },
      {
        questionText: "How does `std::shared_ptr` track when heap-allocated memory should be deleted?",
        optionA: "Using an operating system timer.",
        optionB: "Using an atomic reference-counted control block; when the last `shared_ptr` pointing to the object is destroyed (count reaches 0), the managed object is deleted.",
        optionC: "By checking if the pointer is null.",
        optionD: "Via a background garbage collection thread.",
        correctAnswer: "B",
        explanation: "`shared_ptr` increments an atomic control block reference count on copy and decrements on destruction; the resource is freed when the count reaches zero.",
        difficulty: "MEDIUM",
        sourceReference: "std::shared_ptr & Control Block"
      },
      {
        questionText: "What problem arises when two objects own `std::shared_ptr` instances pointing to each other (Circular Dependency)?",
        optionA: "A compilation error.",
        optionB: "A Memory Leak: neither reference count can ever reach 0, so neither object is ever destructed.",
        optionC: "A stack overflow crash.",
        optionD: "The pointers automatically become null.",
        correctAnswer: "B",
        explanation: "Cyclic references prevent reference counts from dropping to zero, creating permanent memory leaks. `std::weak_ptr` must be used to break the cycle.",
        difficulty: "MEDIUM",
        sourceReference: "Circular Reference & std::weak_ptr"
      },
      {
        questionText: "Why is `std::make_unique<T>()` and `std::make_shared<T>()` preferred over `new`?",
        optionA: "`new` is illegal in modern C++.",
        optionB: "They provide exception safety (preventing leaks if an exception occurs during argument evaluation) and `make_shared` allocates the object and control block in a single contiguous memory block.",
        optionC: "They run on the GPU.",
        optionD: "They do not allocate memory on the heap.",
        correctAnswer: "B",
        explanation: "`std::make_shared` merges the object and control block into one heap allocation, improving cache locality and eliminating memory fragmentation.",
        difficulty: "HARD",
        sourceReference: "Smart Pointer Construction"
      },
      {
        questionText: "Can a `std::weak_ptr` directly access member functions of the pointed-to object?",
        optionA: "Yes, using the `->` operator directly.",
        optionB: "No; it must first call `.lock()` to obtain a temporary `std::shared_ptr`, verifying that the object has not already been deleted.",
        optionC: "Yes, by casting it to a raw pointer.",
        optionD: "weak_ptr can only access static members.",
        correctAnswer: "B",
        explanation: "`weak_ptr` does not prevent object destruction. To use the managed object, `.lock()` must be called to safely verify existence and get a `shared_ptr`.",
        difficulty: "MEDIUM",
        sourceReference: "std::weak_ptr Usage"
      }
    ]
  },

  "cpp-advanced": {
    videos: [
      {
        title: "Templates, Move Semantics & Modern C++ (C++11/17/20)",
        youtubeUrl: "https://www.youtube.com/watch?v=ehMg6zvXuLk",
        duration: "27 min",
        channel: "The Cherno",
        description: "Lvalues vs Rvalues, rvalue references (&&), move constructors, std::move, perfect forwarding, and template metaprogramming.",
        learningObjective: "Master move semantics, rvalue references, perfect forwarding, and compile-time template metaprogramming."
      }
    ],
    questions: [
      {
        questionText: "What problem do Move Semantics solve in C++11 and beyond?",
        optionA: "Moving code files between directories.",
        optionB: "They eliminate expensive deep copies when transferring ownership of dynamic resources from temporary (rvalue) objects, simply 'stealing' internal pointers.",
        optionC: "They allow classes to move between CPU registers.",
        optionD: "They speed up internet download speeds.",
        correctAnswer: "B",
        explanation: "Move semantics allow a new object to pilfer resources (e.g. pointer buffers) from an expiring temporary rvalue in O(1) time without copying memory.",
        difficulty: "MEDIUM",
        sourceReference: "C++ Move Semantics"
      },
      {
        questionText: "What does `std::move(x)` actually do at runtime?",
        optionA: "It copies the object to a new location in RAM.",
        optionB: "It does NOT move anything at runtime; it performs an unconditional cast of its argument into an rvalue reference (`static_cast<T&&>(x)`), enabling move constructors to be matched.",
        optionC: "It deletes the object `x` immediately.",
        optionD: "It allocates memory on the heap.",
        correctAnswer: "B",
        explanation: "`std::move` is purely a compile-time cast to an rvalue reference `T&&`, signaling that the object is eligible to have its resources stolen.",
        difficulty: "HARD",
        sourceReference: "std::move Mechanics"
      },
      {
        questionText: "What is the difference between an lvalue and an rvalue in C++ expressions?",
        optionA: "Lvalues are integers; rvalues are strings.",
        optionB: "An lvalue refers to an object that occupies an identifiable location in memory (has a name/address); an rvalue is a temporary value that does not persist beyond the expression.",
        optionC: "Lvalues are evaluated on the left side of the motherboard.",
        optionD: "There is no formal difference.",
        correctAnswer: "B",
        explanation: "Lvalues have persistent identity and memory addresses (e.g. named variables `x`). Rvalues are transient temporaries (e.g. `x + 5` or function return values).",
        difficulty: "MEDIUM",
        sourceReference: "Value Categories"
      },
      {
        questionText: "What is Perfect Forwarding achieved with `std::forward<T>` and Universal (Forwarding) References (`T&&`)?",
        optionA: "Forwarding network packets through a router.",
        optionB: "Preserving the exact value category (lvalue or rvalue) and const qualification of arguments when passing them through template functions.",
        optionC: "Forwarding email notifications to developers.",
        optionD: "Calling functions in reverse order.",
        correctAnswer: "B",
        explanation: "Universal references `T&&` combined with `std::forward` allow a template function to forward arguments to another function preserving lvalue/rvalue fidelity.",
        difficulty: "HARD",
        sourceReference: "Perfect Forwarding"
      },
      {
        questionText: "What does the `constexpr` keyword indicate when applied to a function or variable in modern C++?",
        optionA: "The function can only be called from a single thread.",
        optionB: "The expression is evaluated at compile time rather than runtime, if its arguments are compile-time constants.",
        optionC: "The variable is stored in a constant CPU register.",
        optionD: "The code is compiled without optimization.",
        correctAnswer: "B",
        explanation: "`constexpr` enforces that expressions can be evaluated at compile time, moving computation from runtime execution into compiler translation.",
        difficulty: "MEDIUM",
        sourceReference: "Compile-Time Computation"
      }
    ]
  }
};

module.exports = { topicContentDataPart4 };
