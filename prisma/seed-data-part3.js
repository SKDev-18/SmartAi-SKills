// Part 3: DBMS, Cloud DevOps, Cyber Security
const topicContentDataPart3 = {
  // =========================================================================
  // 6. DATABASE MANAGEMENT & SQL (DBMS)
  // =========================================================================
  "dbms-relational-model": {
    videos: [
      {
        title: "Relational Model, ER Diagrams & Keys in DBMS",
        youtubeUrl: "https://www.youtube.com/watch?v=NvfL9b2pvd0",
        duration: "24 min",
        channel: "Gate Smashers",
        description: "Relational schema definitions, primary keys, foreign keys, candidate keys, and entity-relationship models.",
        learningObjective: "Model relational database schemas with primary/foreign key constraints and referential integrity."
      }
    ],
    questions: [
      {
        questionText: "What defines a Primary Key in a relational database table?",
        optionA: "A column that can hold null values.",
        optionB: "A minimal candidate key that uniquely identifies each tuple (row) in a relation, with an implicit NOT NULL constraint.",
        optionC: "An index used only for full-text search.",
        optionD: "The first column created in a table regardless of uniqueness.",
        correctAnswer: "B",
        explanation: "A primary key must uniquely identify each entity row and cannot contain NULL values to preserve entity integrity.",
        difficulty: "EASY",
        sourceReference: "Relational Model Keys"
      },
      {
        questionText: "What does Referential Integrity enforce in a relational schema?",
        optionA: "All tables must have identical numbers of rows.",
        optionB: "A Foreign Key value in a referencing table must either match a valid Primary Key value in the referenced table or be NULL.",
        optionC: "All passwords must be encrypted.",
        optionD: "Every query must use an INNER JOIN.",
        correctAnswer: "B",
        explanation: "Referential integrity ensures that relationships between tables remain consistent, preventing orphan foreign key records.",
        difficulty: "EASY",
        sourceReference: "Integrity Constraints"
      },
      {
        questionText: "What is a Candidate Key in relational database theory?",
        optionA: "A key that is proposed by user input.",
        optionB: "A minimal superkey—a set of attributes that uniquely identifies tuples, from which the primary key is chosen.",
        optionC: "A non-unique index.",
        optionD: "A foreign key pointing to an external API.",
        correctAnswer: "B",
        explanation: "A candidate key is a minimal set of attributes that uniquely identifies every tuple without any redundant attributes.",
        difficulty: "MEDIUM",
        sourceReference: "Candidate & Super Keys"
      },
      {
        questionText: "In an ER diagram, what does a diamond-shaped entity represent?",
        optionA: "An entity type",
        optionB: "A relationship between entities",
        optionC: "A multivalued attribute",
        optionD: "A primary key constraint",
        correctAnswer: "B",
        explanation: "In standard Chen ER notation, rectangles represent entities, ovals represent attributes, and diamonds represent relationships.",
        difficulty: "EASY",
        sourceReference: "ER Modeling Notation"
      },
      {
        questionText: "What happens when a referenced record is deleted in a table configured with `ON DELETE CASCADE`?",
        optionA: "The database rejects the deletion with a foreign key violation error.",
        optionB: "All rows in child tables that reference the deleted row are automatically and recursively deleted.",
        optionC: "Foreign keys in child tables are set to zero.",
        optionD: "The parent table is dropped from disk.",
        correctAnswer: "B",
        explanation: "`ON DELETE CASCADE` instructs the database engine to automatically delete dependent child rows when the parent row is deleted.",
        difficulty: "MEDIUM",
        sourceReference: "Foreign Key Action Rules"
      }
    ]
  },

  "sql-deep-dive": {
    videos: [
      {
        title: "SQL Joins, Subqueries & Advanced Query Optimization",
        youtubeUrl: "https://www.youtube.com/watch?v=9yeOJ0ZMUYw",
        duration: "26 min",
        channel: "Gate Smashers",
        description: "Inner vs Outer joins, cross joins, correlated subqueries, union vs union all, and execution plans.",
        learningObjective: "Write efficient multi-table joins, subqueries, and analyze SQL execution plans."
      }
    ],
    questions: [
      {
        questionText: "What is the result of a `LEFT OUTER JOIN` between table A (left) and table B (right)?",
        optionA: "Only rows that have matching keys in both tables.",
        optionB: "All rows from table A, along with matching rows from table B; if no match exists in B, columns from B contain NULL.",
        optionC: "All rows from table B, with missing rows from table A filled with zeroes.",
        optionD: "The Cartesian product of A and B.",
        correctAnswer: "B",
        explanation: "LEFT JOIN preserves all records from the left table, populating NULL for right table columns where no join condition matches.",
        difficulty: "EASY",
        sourceReference: "SQL Join Types"
      },
      {
        questionText: "What is the difference between `UNION` and `UNION ALL` in SQL?",
        optionA: "`UNION` performs an additional deduplication sort to remove identical duplicate rows, whereas `UNION ALL` retains all duplicates and is faster.",
        optionB: "`UNION ALL` only works on numbers.",
        optionC: "`UNION` combines tables horizontally; `UNION ALL` combines them vertically.",
        optionD: "There is no difference in modern databases.",
        correctAnswer: "A",
        explanation: "`UNION` discards duplicates via a sorting/hashing pass; `UNION ALL` simply concatenates result sets without deduplication overhead.",
        difficulty: "EASY",
        sourceReference: "Set Operations in SQL"
      },
      {
        questionText: "What is a Correlated Subquery?",
        optionA: "A subquery that executes once before the outer query runs.",
        optionB: "A subquery that references columns from the outer query, requiring it to be evaluated repeatedly for each candidate row processed by the outer query.",
        optionC: "A subquery containing a syntax error.",
        optionD: "A subquery executed in parallel on another server.",
        correctAnswer: "B",
        explanation: "Correlated subqueries depend on values from the current outer row, causing row-by-row re-evaluation unless rewritten as joins.",
        difficulty: "MEDIUM",
        sourceReference: "Subquery Evaluation"
      },
      {
        questionText: "What is the SQL `EXPLAIN` or `EXPLAIN ANALYZE` command used for?",
        optionA: "To generate human-readable documentation for database tables.",
        optionB: "To display the database query optimizer's execution plan (e.g. index scans, sequential scans, join algorithms, estimated cost).",
        optionC: "To repair corrupted database files.",
        optionD: "To check user permissions.",
        correctAnswer: "B",
        explanation: "`EXPLAIN` displays the query execution plan generated by the cost-based optimizer, revealing sequential scans and index utilization.",
        difficulty: "MEDIUM",
        sourceReference: "Query Optimization & Execution Plans"
      },
      {
        questionText: "What does the `COALESCE(col1, col2, 'default')` function return?",
        optionA: "The sum of all arguments.",
        optionB: "The first non-null expression among its arguments from left to right.",
        optionC: "The count of non-empty strings.",
        optionD: "A random non-null value.",
        correctAnswer: "B",
        explanation: "`COALESCE` evaluates its arguments in sequence and returns the first value that is not NULL.",
        difficulty: "EASY",
        sourceReference: "SQL Scalar Functions"
      }
    ]
  },

  "normalization": {
    videos: [
      {
        title: "Database Normalization: 1NF, 2NF, 3NF & BCNF Explained",
        youtubeUrl: "https://www.youtube.com/watch?v=UrYLYV7WSHM",
        duration: "27 min",
        channel: "Gate Smashers",
        description: "Functional dependencies, anomalies (insertion, deletion, update), 1NF atomicity, 2NF partial dependencies, and 3NF transitive dependencies.",
        learningObjective: "Decompose unnormalized tables into 1NF, 2NF, 3NF, and BCNF to eliminate data redundancy and anomalies."
      }
    ],
    questions: [
      {
        questionText: "What condition must a relation satisfy to be in First Normal Form (1NF)?",
        optionA: "All attributes must have foreign keys.",
        optionB: "Every column attribute must contain only atomic (indivisible) values, with no repeating groups or arrays.",
        optionC: "The relation must have no secondary indexes.",
        optionD: "All table names must be lowercase.",
        correctAnswer: "B",
        explanation: "1NF requires that each column contains atomic values (no lists/sets) and each record is unique.",
        difficulty: "EASY",
        sourceReference: "1NF Standards"
      },
      {
        questionText: "What condition eliminates Partial Functional Dependencies to achieve Second Normal Form (2NF)?",
        optionA: "It must be in 1NF and no non-prime attribute may depend on a proper subset of any composite candidate key.",
        optionB: "Every table must have a maximum of 2 columns.",
        optionC: "All foreign keys must be cascaded.",
        optionD: "The primary key must be a 64-bit integer.",
        correctAnswer: "A",
        explanation: "2NF requires 1NF and full functional dependency of non-prime attributes on the whole candidate key, eliminating partial dependencies.",
        difficulty: "MEDIUM",
        sourceReference: "2NF Functional Dependencies"
      },
      {
        questionText: "What dependency does Third Normal Form (3NF) strictly eliminate?",
        optionA: "Direct primary key dependencies.",
        optionB: "Transitive functional dependencies where a non-prime attribute depends on another non-prime attribute (X -> Y -> Z).",
        optionC: "Foreign key constraints.",
        optionD: "Composite primary keys.",
        correctAnswer: "B",
        explanation: "3NF requires 2NF plus no transitive dependencies: non-prime attributes must depend only on the primary key, directly and non-transitively.",
        difficulty: "MEDIUM",
        sourceReference: "3NF Rules"
      },
      {
        questionText: "What distinguishes Boyce-Codd Normal Form (BCNF) from 3NF?",
        optionA: "BCNF is weaker than 3NF.",
        optionB: "In BCNF, for every non-trivial functional dependency X -> Y, X must strictly be a Superkey.",
        optionC: "BCNF allows repeating arrays in columns.",
        optionD: "BCNF only applies to NoSQL document databases.",
        correctAnswer: "B",
        explanation: "BCNF is a stricter form of 3NF: for every functional dependency X -> Y, X must be a superkey, eliminating candidate key overlaps.",
        difficulty: "HARD",
        sourceReference: "Boyce-Codd Normal Form (BCNF)"
      },
      {
        questionText: "Why do data warehouse designs often intentionally Denormalize schemas (e.g. Star Schema)?",
        optionA: "Because normalized databases cannot store dates.",
        optionB: "To reduce expensive multi-table JOIN operations and dramatically improve read query performance for analytical OLAP workloads.",
        optionC: "To prevent transactions from deadlocking.",
        optionD: "Because disk storage has zero cost.",
        correctAnswer: "B",
        explanation: "Denormalization introduces controlled redundancy in OLAP systems to minimize joins and accelerate complex aggregations.",
        difficulty: "MEDIUM",
        sourceReference: "Denormalization & OLAP"
      }
    ]
  },

  "transactions-acid": {
    videos: [
      {
        title: "Database Transactions & ACID Properties: Concurrency & Locks",
        youtubeUrl: "https://www.youtube.com/watch?v=gaMY5Osqn_4",
        duration: "25 min",
        channel: "Gate Smashers",
        description: "Atomicity, Consistency, Isolation, Durability, isolation levels (Read Committed, Repeatable Read, Serializable), and 2PL.",
        learningObjective: "Understand ACID guarantees, concurrency phenomena (dirty reads, phantom reads), and lock protocols."
      }
    ],
    questions: [
      {
        questionText: "What does the Atomicity property in ACID database transactions guarantee?",
        optionA: "Transactions execute at atomic CPU frequencies.",
        optionB: "All operations within a transaction either succeed completely (COMMIT) or if any part fails, the entire transaction is rolled back (All-or-Nothing).",
        optionC: "Data is immediately written to magnetic tape.",
        optionD: "No two users can connect simultaneously.",
        correctAnswer: "B",
        explanation: "Atomicity ensures all-or-nothing execution: if any statement fails, the entire transaction aborts and changes are rolled back.",
        difficulty: "EASY",
        sourceReference: "ACID Atomicity"
      },
      {
        questionText: "What is a 'Dirty Read' concurrency phenomenon?",
        optionA: "Reading data from a corrupted sector on disk.",
        optionB: "A transaction reads uncommitted data written by another concurrent transaction that might later be rolled back.",
        optionC: "Reading the same row twice and getting different values.",
        optionD: "Reading records without using an index.",
        correctAnswer: "B",
        explanation: "A dirty read occurs when Transaction A reads modifications made by Transaction B before B commits; if B aborts, A read invalid phantom state.",
        difficulty: "MEDIUM",
        sourceReference: "Transaction Isolation Anomalies"
      },
      {
        questionText: "Which SQL Transaction Isolation Level prevents Dirty Reads, Non-Repeatable Reads, and Phantom Reads completely?",
        optionA: "READ UNCOMMITTED",
        optionB: "READ COMMITTED",
        optionC: "REPEATABLE READ",
        optionD: "SERIALIZABLE",
        correctAnswer: "D",
        explanation: "SERIALIZABLE provides the highest isolation level, guaranteeing execution produces identical results to sequential, serial execution.",
        difficulty: "MEDIUM",
        sourceReference: "ANSI SQL Isolation Levels"
      },
      {
        questionText: "How does Write-Ahead Logging (WAL) guarantee the Durability property in ACID?",
        optionA: "By sending data via email to administrators.",
        optionB: "Changes are appended sequentially to a non-volatile log on disk before data pages in memory are written to table storage.",
        optionC: "By using distributed blockchain hashes.",
        optionD: "By disabling all read queries during writes.",
        correctAnswer: "B",
        explanation: "WAL writes state changes to disk log files before flushing data pages; if power fails, the database replays the log to recover committed state.",
        difficulty: "HARD",
        sourceReference: "Write-Ahead Logging (WAL)"
      },
      {
        questionText: "What is Two-Phase Locking (2PL) protocol used for in database concurrency control?",
        optionA: "To guarantee conflict serializability by requiring transactions to acquire all locks during a Growing phase and release them during a Shrinking phase.",
        optionB: "To lock database tables during user login.",
        optionC: "To encrypt database columns in two passes.",
        optionD: "To compress backups in two stages.",
        correctAnswer: "A",
        explanation: "2PL enforces growing and shrinking phases: once a transaction releases any lock, it cannot obtain any new locks, ensuring serializability.",
        difficulty: "HARD",
        sourceReference: "Two-Phase Locking (2PL)"
      }
    ]
  },

  "indexing-nosql": {
    videos: [
      {
        title: "B-Trees, Database Indexing & NoSQL Systems",
        youtubeUrl: "https://www.youtube.com/watch?v=-qNSXK7s7_w",
        duration: "26 min",
        channel: "Hussein Nasser",
        description: "B-Tree and B+Tree structures, clustered vs non-clustered indexes, write amplification, and CAP theorem for NoSQL.",
        learningObjective: "Master B+Tree index structures, index selectivity, write amplification tradeoffs, and NoSQL CAP theorem."
      }
    ],
    questions: [
      {
        questionText: "Why are B+ Trees preferred over standard Binary Search Trees for disk-based database indexes?",
        optionA: "B+ Trees only hold strings.",
        optionB: "B+ Trees have high fan-out with shallow height, minimizing slow disk I/O seek operations, and leaf nodes are linked sequentially for rapid range scans.",
        optionC: "B+ Trees do not require disk storage.",
        optionD: "Binary search trees cannot store integers.",
        correctAnswer: "B",
        explanation: "Disk accesses are slow. High fan-out nodes fit within disk block pages, keeping tree height low (3-4 levels for millions of rows) and range scans fast.",
        difficulty: "MEDIUM",
        sourceReference: "B+ Tree Index Architecture"
      },
      {
        questionText: "What is the key difference between a Clustered Index and a Non-Clustered (Secondary) Index?",
        optionA: "A clustered index stores data in RAM; secondary indexes store data in flash storage.",
        optionB: "A clustered index defines the actual physical storage order of table data on disk (only 1 per table); a secondary index stores pointers/keys to the actual data rows.",
        optionC: "A clustered index only works on foreign keys.",
        optionD: "Non-clustered indexes cannot be used in WHERE clauses.",
        correctAnswer: "B",
        explanation: "A table can have only one clustered index because rows can only be physically sorted in one order. Non-clustered indexes are separate lookup structures.",
        difficulty: "MEDIUM",
        sourceReference: "Clustered vs Non-Clustered"
      },
      {
        questionText: "What is the CAP Theorem tradeoff in distributed NoSQL database systems?",
        optionA: "Code, Architecture, Performance",
        optionB: "In the event of a Network Partition (P), a distributed system can guarantee at most Consistency (C) OR Availability (A), but not both simultaneously.",
        optionC: "Caching, Authentication, Persistence",
        optionD: "Capacity, Alignment, Parallelism",
        correctAnswer: "B",
        explanation: "Eric Brewer's CAP Theorem proves that across a network partition, a distributed system must choose between returning errors (Consistency) or stale data (Availability).",
        difficulty: "MEDIUM",
        sourceReference: "CAP Theorem"
      },
      {
        questionText: "What is the write performance penalty of adding multiple indexes to a database table?",
        optionA: "Write performance increases proportionally.",
        optionB: "Every INSERT, UPDATE, and DELETE must update not only the table data but also all associated index B-Trees, causing write amplification and latency.",
        optionC: "Indexes have zero effect on write operations.",
        optionD: "Indexes cause the database engine to crash.",
        correctAnswer: "B",
        explanation: "While indexes accelerate SELECT reads, every modification requires traversing and updating multiple B+ Tree structures, increasing write cost.",
        difficulty: "EASY",
        sourceReference: "Index Write Amplification"
      },
      {
        questionText: "What type of NoSQL database is MongoDB categorized as?",
        optionA: "Key-Value store",
        optionB: "Document-oriented store (BSON/JSON documents)",
        optionC: "Columnar store",
        optionD: "Graph database",
        correctAnswer: "B",
        explanation: "MongoDB stores records as flexible, hierarchical BSON documents with dynamic schemas, categorized as a Document store.",
        difficulty: "EASY",
        sourceReference: "NoSQL Database Categories"
      }
    ]
  },

  // =========================================================================
  // 7. CLOUD COMPUTING & DEVOPS
  // =========================================================================
  "cloud-fundamentals": {
    videos: [
      {
        title: "Cloud Computing Fundamentals: IaaS, PaaS, SaaS & AWS Architecture",
        youtubeUrl: "https://www.youtube.com/watch?v=2LaAJq1lB1Q",
        duration: "24 min",
        channel: "freeCodeCamp.org",
        description: "Cloud service models, Shared Responsibility Model, virtualization, regions, availability zones, and auto-scaling.",
        learningObjective: "Evaluate cloud delivery models (IaaS, PaaS, SaaS), cloud regions, and fault-tolerant architecture principles."
      }
    ],
    questions: [
      {
        questionText: "What is the fundamental difference between IaaS (Infrastructure as a Service) and PaaS (Platform as a Service)?",
        optionA: "IaaS provides raw compute VMs, storage, and networking where the customer manages the OS and runtime; PaaS abstracts the OS, allowing customers to deploy code directly without managing servers.",
        optionB: "IaaS is free; PaaS is always subscription-based.",
        optionC: "PaaS requires running your own physical data center.",
        optionD: "IaaS only supports Windows operating systems.",
        correctAnswer: "A",
        explanation: "In IaaS (e.g. AWS EC2), you configure the OS and middleware. In PaaS (e.g. Vercel, AWS Elastic Beanstalk), runtime and OS are managed by the cloud provider.",
        difficulty: "EASY",
        sourceReference: "Cloud Service Models"
      },
      {
        questionText: "Under the AWS Shared Responsibility Model, what is the customer responsible for when running virtual machines (EC2)?",
        optionA: "Physical data center security and hardware power.",
        optionB: "Guest operating system patching, application software, network firewall rules (Security Groups), and customer data.",
        optionC: "Replacing failed hard drive disks.",
        optionD: "Laying submarine fiber optic cables.",
        correctAnswer: "B",
        explanation: "AWS is responsible for 'Security OF the Cloud' (hardware, facilities, hypervisor); the customer is responsible for 'Security IN the Cloud' (OS, configs, data).",
        difficulty: "MEDIUM",
        sourceReference: "Shared Responsibility Model"
      },
      {
        questionText: "What is an Availability Zone (AZ) in major cloud providers like AWS or GCP?",
        optionA: "A continent-wide network cache.",
        optionB: "One or more discrete physical data centers with redundant power, networking, and connectivity within a geographic Region.",
        optionC: "A specific user login session.",
        optionD: "A software load balancer configuration.",
        correctAnswer: "B",
        explanation: "An AZ consists of isolated data centers within a region, engineered to be isolated from failures in other AZs.",
        difficulty: "EASY",
        sourceReference: "Cloud Infrastructure Architecture"
      },
      {
        questionText: "What is Horizontal Scaling (Scaling Out) compared to Vertical Scaling (Scaling Up)?",
        optionA: "Horizontal scaling adds more machine instances into the pool; vertical scaling increases CPU, RAM, or disk capacity on a single machine.",
        optionB: "Horizontal scaling uses taller server racks.",
        optionC: "Vertical scaling connects multiple cloud regions together.",
        optionD: "There is no difference in elasticity.",
        correctAnswer: "A",
        explanation: "Scaling out (horizontal) distributes load across multiple servers, providing high availability. Scaling up (vertical) adds resources to a single node until hardware limits.",
        difficulty: "EASY",
        sourceReference: "Elastic Scalability"
      },
      {
        questionText: "What is Object Storage (such as Amazon S3) primarily optimized for?",
        optionA: "Booting virtual machine operating systems via block storage.",
        optionB: "Storing and retrieving massive volumes of unstructured data (images, backups, videos, logs) via RESTful HTTP APIs with high durability.",
        optionC: "Running low-latency relational SQL transactions.",
        optionD: "Hosting CPU register caches.",
        correctAnswer: "B",
        explanation: "Object storage (S3) provides highly durable, scalable storage for unstructured files accessible via HTTP URLs rather than filesystem POSIX mounts.",
        difficulty: "EASY",
        sourceReference: "Cloud Storage Architectures"
      }
    ]
  },

  "docker-containers": {
    videos: [
      {
        title: "Docker Tutorial for Beginners: Images, Containers & Volumes",
        youtubeUrl: "https://www.youtube.com/watch?v=3c-iBn73dDE",
        duration: "26 min",
        channel: "TechWorld with Nana",
        description: "Containerization vs virtualization, Dockerfile instructions, layer caching, bind mounts, and Docker Compose.",
        learningObjective: "Package applications into lightweight, reproducible Docker container images with multi-stage builds."
      }
    ],
    questions: [
      {
        questionText: "How does a Docker container differ from a traditional Virtual Machine (VM)?",
        optionA: "Containers include a full guest operating system kernel.",
        optionB: "Containers share the host operating system kernel and isolate processes via Linux namespaces and cgroups, making them much lighter and faster than VMs with full guest OSs.",
        optionC: "VMs cannot connect to internet networks.",
        optionD: "Docker containers require dedicated GPU hardware.",
        correctAnswer: "B",
        explanation: "Containers share the host kernel and isolate processes through namespaces (PID, NET, MNT) and control groups (cgroups), eliminating guest OS overhead.",
        difficulty: "MEDIUM",
        sourceReference: "Container vs VM Architecture"
      },
      {
        questionText: "What is the purpose of Docker multi-stage builds in a `Dockerfile`?",
        optionA: "To run containers across multiple clouds at once.",
        optionB: "To separate the build environment (compilers, build tools) from the final runtime image, resulting in minimal, secure, production-ready container images.",
        optionC: "To execute tests in parallel.",
        optionD: "To create multiple root user accounts.",
        correctAnswer: "B",
        explanation: "Multi-stage builds allow copying only compiled artifacts into a lightweight alpine/distroless base image, stripping build-time SDKs and reducing image size.",
        difficulty: "MEDIUM",
        sourceReference: "Multi-Stage Docker Builds"
      },
      {
        questionText: "What command runs a container in detached mode, mapping host port 8080 to container port 80?",
        optionA: "`docker start 8080:80 my-image`",
        optionB: "`docker run -d -p 8080:80 my-image`",
        optionC: "`docker execute -port 8080 my-image`",
        optionD: "`docker attach -p 8080 my-image`",
        correctAnswer: "B",
        explanation: "`-d` runs the container in detached background mode; `-p 8080:80` maps host port 8080 to container internal listening port 80.",
        difficulty: "EASY",
        sourceReference: "Docker CLI Commands"
      },
      {
        questionText: "What happens to data written inside a container without a Docker Volume when the container is deleted?",
        optionA: "The data is saved to a zip file in the user's home folder.",
        optionB: "The data in the container's writable layer is permanently destroyed.",
        optionC: "The data is automatically committed to Docker Hub.",
        optionD: "The data is backed up to AWS S3.",
        correctAnswer: "B",
        explanation: "Container writable storage layers are ephemeral. Persistent data must be mounted using Docker Named Volumes or bind mounts.",
        difficulty: "EASY",
        sourceReference: "Docker Storage Volumes"
      },
      {
        questionText: "What is the function of `docker-compose.yml`?",
        optionA: "To compile C++ code into binary.",
        optionB: "To define, configure, and orchestrate multi-container Docker applications (services, networks, volumes) in a single declarative YAML file.",
        optionC: "To format JavaScript files with prettier.",
        optionD: "To deploy code straight to mobile devices.",
        correctAnswer: "B",
        explanation: "Docker Compose allows defining multi-service architectures (e.g. web app + redis + postgres database) and starting them together with `docker compose up`.",
        difficulty: "EASY",
        sourceReference: "Docker Compose"
      }
    ]
  },

  "cicd-pipelines": {
    videos: [
      {
        title: "CI/CD Pipeline Masterclass: GitHub Actions, Automated Testing & Deploy",
        youtubeUrl: "https://www.youtube.com/watch?v=scEDHsr3APg",
        duration: "25 min",
        channel: "TechWorld with Nana",
        description: "Continuous Integration & Continuous Delivery, GitHub Actions workflows, automated testing, linting, and artifact deployment.",
        learningObjective: "Construct automated CI/CD pipelines for linting, testing, building, and zero-downtime deployment."
      }
    ],
    questions: [
      {
        questionText: "What is the core principle of Continuous Integration (CI)?",
        optionA: "Deploying code to production once every six months.",
        optionB: "Developers frequently merge code changes into a central repository branch, where automated builds and tests verify changes to catch regressions early.",
        optionC: "Writing code without using any third-party libraries.",
        optionD: "Running continuous marketing campaigns.",
        correctAnswer: "B",
        explanation: "CI practices frequent code integration validated by automated testing pipelines, preventing merge hell and catching bugs immediately.",
        difficulty: "EASY",
        sourceReference: "Continuous Integration Principles"
      },
      {
        questionText: "What distinguishes Continuous Delivery (CD) from Continuous Deployment?",
        optionA: "Continuous Delivery automatically deploys every passing commit to production without human intervention; Continuous Deployment requires approval.",
        optionB: "Continuous Delivery ensures code is always in a deployable state with manual production release trigger; Continuous Deployment automatically deploys every passing build directly to production.",
        optionC: "Continuous Delivery only applies to mobile apps.",
        optionD: "There is no difference.",
        correctAnswer: "B",
        explanation: "In Continuous Delivery, the release artifact is validated and ready for production on human click; Continuous Deployment releases straight to production automatically.",
        difficulty: "MEDIUM",
        sourceReference: "Continuous Delivery vs Deployment"
      },
      {
        questionText: "In GitHub Actions, where are workflow YAML configuration files stored in a repository?",
        optionA: "`/config/workflows/`",
        optionB: "`.github/workflows/`",
        optionC: "`/etc/github/`",
        optionD: "`/actions/`",
        correctAnswer: "B",
        explanation: "GitHub Actions detects and executes workflow files placed in the `.github/workflows/` directory of the repository.",
        difficulty: "EASY",
        sourceReference: "GitHub Actions Workflow Configuration"
      },
      {
        questionText: "What is a 'Canary Deployment' in modern software release engineering?",
        optionA: "Deploying software to a laboratory cage before humans use it.",
        optionB: "Gradually rolling out a new software version to a small subset (e.g. 5%) of production users to verify metrics and error rates before full rollout.",
        optionC: "Deploying only during weekends.",
        optionD: "Deploying exclusively to internal company employees.",
        correctAnswer: "B",
        explanation: "Canary deployments direct a small fraction of real user traffic to the new version, rolling back automatically if errors spike before impacting all users.",
        difficulty: "MEDIUM",
        sourceReference: "Deployment Strategies"
      },
      {
        questionText: "Why should pipeline secrets (like AWS access keys or production SSH keys) never be echoed or printed in CI job logs?",
        optionA: "Printing text slows down the pipeline execution.",
        optionB: "CI build logs are frequently visible to developers or the public, exposing critical infrastructure credentials to credential theft.",
        optionC: "Bash terminals cannot display uppercase letters.",
        optionD: "GitHub charges extra fees for log characters.",
        correctAnswer: "B",
        explanation: "Exposing secrets in build logs compromises cloud credentials. CI platforms mask secret variables and warn against logging sensitive tokens.",
        difficulty: "EASY",
        sourceReference: "CI/CD Security Best Practices"
      }
    ]
  },

  "kubernetes-k8s": {
    videos: [
      {
        title: "Kubernetes Tutorial for Beginners: Pods, Deployments & Services",
        youtubeUrl: "https://www.youtube.com/watch?v=X48VuDVv0do",
        duration: "28 min",
        channel: "TechWorld with Nana",
        description: "K8s architecture (control plane, worker nodes), Pods, ReplicaSets, Deployments, Services (ClusterIP, NodePort, LoadBalancer), and Ingress.",
        learningObjective: "Deploy containerized services to Kubernetes clusters with auto-healing, scaling, and service routing."
      }
    ],
    questions: [
      {
        questionText: "What is the smallest deployable computing unit in Kubernetes?",
        optionA: "A Container Image",
        optionB: "A Pod (which encapsulates one or more co-located containers sharing network namespace and storage)",
        optionC: "A Virtual Machine",
        optionD: "A Worker Node",
        correctAnswer: "B",
        explanation: "A Pod is the fundamental execution unit in K8s, wrapping one or more tightly-coupled containers sharing IP address, port space, and volumes.",
        difficulty: "EASY",
        sourceReference: "Kubernetes Pod Architecture"
      },
      {
        questionText: "What is the role of the Kubernetes `Service` object?",
        optionA: "To compile source code inside the cluster.",
        optionB: "To define a stable networking endpoint (virtual IP and DNS name) and load-balance traffic across a dynamic set of ephemeral Pods.",
        optionC: "To format storage disks.",
        optionD: "To bill customers for CPU usage.",
        correctAnswer: "B",
        explanation: "Pods are created and destroyed dynamically. A Service provides a persistent IP/DNS name and distributes traffic among matching pods using label selectors.",
        difficulty: "MEDIUM",
        sourceReference: "K8s Networking & Services"
      },
      {
        questionText: "What does the `kube-scheduler` component of the Kubernetes Control Plane do?",
        optionA: "It schedules employee shifts at data centers.",
        optionB: "It assigns newly created unscheduled Pods to suitable worker nodes based on resource availability, constraints, and affinity rules.",
        optionC: "It deletes inactive user accounts.",
        optionD: "It runs database backups.",
        correctAnswer: "B",
        explanation: "The scheduler watches for pods with no assigned node and selects the optimal node for them to execute on based on CPU/RAM requests.",
        difficulty: "MEDIUM",
        sourceReference: "Kubernetes Control Plane"
      },
      {
        questionText: "What is the difference between a `LivenessProbe` and a `ReadinessProbe` in a Kubernetes Pod spec?",
        optionA: "Liveness probe checks if the pod is in production; readiness probe checks if it is in staging.",
        optionB: "LivenessProbe determines if the container must be restarted due to deadlock/crash; ReadinessProbe determines if the container is ready to accept user network traffic.",
        optionC: "ReadinessProbe permanently deletes failed pods.",
        optionD: "There is no functional difference.",
        correctAnswer: "B",
        explanation: "If liveness probe fails, K8s restarts the container. If readiness probe fails, K8s temporarily removes the pod from service load balancers until it recovers.",
        difficulty: "HARD",
        sourceReference: "K8s Health Probes"
      },
      {
        questionText: "What Kubernetes resource manages horizontal automatic scaling of Pod replicas based on CPU/memory utilization?",
        optionA: "DaemonSet",
        optionB: "HorizontalPodAutoscaler (HPA)",
        optionC: "StatefulSet",
        optionD: "Job",
        correctAnswer: "B",
        explanation: "The Horizontal Pod Autoscaler (HPA) automatically adjusts the number of replica pods in a deployment based on observed metrics like CPU utilization.",
        difficulty: "EASY",
        sourceReference: "K8s Autoscaling"
      }
    ]
  },

  "cloud-monitoring": {
    videos: [
      {
        title: "Cloud Monitoring, Metrics & SRE: Prometheus, Grafana & Logs",
        youtubeUrl: "https://www.youtube.com/watch?v=K47_e-s1a98",
        duration: "24 min",
        channel: "Hussein Nasser",
        description: "Observability pillars (Metrics, Logs, Traces), Prometheus time-series scraping, Grafana dashboards, and SLO/SLA management.",
        learningObjective: "Implement cloud observability with metrics collection, alerting rules, distributed tracing, and SLA error budgets."
      }
    ],
    questions: [
      {
        questionText: "What are the Three Pillars of Observability in distributed cloud systems?",
        optionA: "Speed, Security, Scale",
        optionB: "Metrics, Logs, and Traces",
        optionC: "CPU, Memory, and Disk",
        optionD: "Frontend, Backend, and Database",
        correctAnswer: "B",
        explanation: "The core observability pillars are Metrics (aggregated numeric time-series), Logs (structured timestamped events), and Traces (request flow across microservices).",
        difficulty: "EASY",
        sourceReference: "Pillars of Observability"
      },
      {
        questionText: "What is the difference between an SLA (Service Level Agreement) and an SLO (Service Level Objective)?",
        optionA: "An SLO is an internal reliability target set by engineering teams; an SLA is a legally binding commitment to customers with financial penalties if breached.",
        optionB: "An SLA is for hardware; an SLO is for software.",
        optionC: "SLOs are defined only in government contracts.",
        optionD: "There is no difference.",
        correctAnswer: "A",
        explanation: "SLOs are internal performance goals (e.g. 99.9% uptime target). SLAs are formal external commitments to customers specifying credits/penalties if breached.",
        difficulty: "MEDIUM",
        sourceReference: "Site Reliability Engineering (SRE)"
      },
      {
        questionText: "How does Prometheus collect metrics from monitored microservices?",
        optionA: "Services must write metrics to floppy disks.",
        optionB: "Prometheus uses a pull-based model that periodically scrapes HTTP `/metrics` endpoints exposed by target services.",
        optionC: "Prometheus listens on raw UDP sockets without parsing.",
        optionD: "Prometheus reads database audit tables.",
        correctAnswer: "B",
        explanation: "Prometheus pulls (scrapes) metrics over HTTP from endpoints configured in standard text/OpenMetrics format at scheduled scrape intervals.",
        difficulty: "MEDIUM",
        sourceReference: "Prometheus Architecture"
      },
      {
        questionText: "What is an Error Budget in Site Reliability Engineering?",
        optionA: "The amount of money budgeted for software bugs.",
        optionB: "The allowable threshold of downtime or errors calculated from an SLO (e.g. 99.9% availability allows 0.1% downtime) that can be spent on shipping new features.",
        optionC: "A database transaction rollback limit.",
        optionD: "The maximum number of characters allowed in error messages.",
        correctAnswer: "B",
        explanation: "Error budget = 100% - SLO. If an application maintains high reliability, the remaining budget can be spent deploying new features and taking calculated risks.",
        difficulty: "MEDIUM",
        sourceReference: "SRE Error Budgets"
      },
      {
        questionText: "What is Distributed Tracing (e.g. OpenTelemetry, Jaeger) used for in microservice architectures?",
        optionA: "Tracing user IP addresses for geofencing.",
        optionB: "Tracking the lifecycle and latency of an individual request as it traverses across multiple microservices using a unique Trace ID and Span IDs.",
        optionC: "Drawing network cabling blueprints.",
        optionD: "Decompiling microservice binaries.",
        correctAnswer: "B",
        explanation: "Distributed tracing propagates trace context headers across network calls, enabling developers to pinpoint exactly which microservice caused request latency or failure.",
        difficulty: "HARD",
        sourceReference: "Distributed Tracing"
      }
    ]
  }
};

module.exports = { topicContentDataPart3 };
