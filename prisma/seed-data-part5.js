// Part 5: Operating Systems, Computer Networks
const topicContentDataPart5 = {
  // =========================================================================
  // 11. OPERATING SYSTEMS
  // =========================================================================
  "os-processes": {
    videos: [
      {
        title: "Operating Systems: Processes, Threads & Process Control Block (PCB)",
        youtubeUrl: "https://www.youtube.com/watch?v=OrM7nZcxXZU",
        duration: "25 min",
        channel: "Neso Academy",
        description: "Process lifecycle, PCB attributes, context switching, user vs kernel mode, and multithreading models.",
        learningObjective: "Understand process state machines, PCB context switching overhead, and kernel vs user space isolation."
      }
    ],
    questions: [
      {
        questionText: "What is the primary difference between a Process and a Thread in modern operating systems?",
        optionA: "Processes run only on GPUs; threads run on CPUs.",
        optionB: "A Process is an independent program in execution with its own isolated virtual address space; a Thread is a lightweight dispatchable execution unit within a process, sharing memory and open files with sibling threads.",
        optionC: "Processes cannot communicate across networks.",
        optionD: "Threads require separate physical computers.",
        correctAnswer: "B",
        explanation: "Processes have separate, protected address spaces. Threads within the same process share code, data, heap, and open file descriptors, having only their own stack and registers.",
        difficulty: "EASY",
        sourceReference: "Process vs Thread Architecture"
      },
      {
        questionText: "What information is stored inside the Process Control Block (PCB)?",
        optionA: "Only the user's login username.",
        optionB: "Process State, Program Counter, CPU registers, CPU scheduling info, Memory-management info (page tables), and I/O status info.",
        optionC: "The entire source code of the application.",
        optionD: "The computer's BIOS firmware settings.",
        correctAnswer: "B",
        explanation: "The PCB is the kernel data structure maintaining all state information required to suspend and resume process execution during a context switch.",
        difficulty: "EASY",
        sourceReference: "Process Control Block"
      },
      {
        questionText: "What occurs during an Operating System Context Switch?",
        optionA: "The operating system formats a hard disk partition.",
        optionB: "The CPU halts running one process, saves its state (registers, program counter) into its PCB, and loads the saved context of another process from its PCB to begin execution.",
        optionC: "All RAM is cleared to prevent data leaks.",
        optionD: "The compiler generates new machine code.",
        correctAnswer: "B",
        explanation: "Context switching switches CPU execution from one process/thread to another, incurring pure kernel overhead as no useful user work is performed during the switch.",
        difficulty: "MEDIUM",
        sourceReference: "Context Switching Mechanics"
      },
      {
        questionText: "What is the function of the `fork()` system call in Unix/Linux operating systems?",
        optionA: "Terminates the calling process.",
        optionB: "Creates an exact duplicate child process with a separate address space (via Copy-On-Write), returning 0 to the child and the child's PID to the parent.",
        optionC: "Opens a network socket.",
        optionD: "Spawns a new GUI window.",
        correctAnswer: "B",
        explanation: "`fork()` clones the calling process. Copy-on-Write (COW) optimizes this by sharing physical memory pages read-only until either process writes to them.",
        difficulty: "MEDIUM",
        sourceReference: "Unix Process Creation"
      },
      {
        questionText: "What is a 'Zombie Process' in Unix?",
        optionA: "A malicious virus process.",
        optionB: "A process that has completed execution via `exit()`, but still possesses an entry in the process table because its parent has not yet read its exit status via `wait()`.",
        optionC: "A process running without an active user.",
        optionD: "A process stuck in an infinite loop.",
        correctAnswer: "B",
        explanation: "A zombie process has terminated but retains a PID and exit code entry in the process table until the parent reaps it with `wait()`.",
        difficulty: "MEDIUM",
        sourceReference: "Process Termination & Reaping"
      }
    ]
  },

  "os-scheduling": {
    videos: [
      {
        title: "CPU Scheduling Algorithms: FCFS, SJF, SRTF, Round Robin & Priority",
        youtubeUrl: "https://www.youtube.com/watch?v=ewmt0ZgWDPI",
        duration: "26 min",
        channel: "Neso Academy",
        description: "Preemptive vs non-preemptive scheduling, Gantt charts, turnaround time, waiting time, and completely fair scheduler (CFS).",
        learningObjective: "Calculate average waiting and turnaround times across scheduling algorithms and evaluate starvation."
      }
    ],
    questions: [
      {
        questionText: "What is the difference between Preemptive and Non-Preemptive CPU scheduling?",
        optionA: "Preemptive scheduling runs only on desktop computers.",
        optionB: "In preemptive scheduling, the OS kernel can interrupt a running process and allocate the CPU to another process (e.g. higher priority or timer interrupt); non-preemptive allows a process to retain the CPU until it yields or terminates.",
        optionC: "Non-preemptive scheduling never uses RAM.",
        optionD: "Preemptive scheduling only schedules background batch jobs.",
        correctAnswer: "B",
        explanation: "Preemption allows the scheduler to forcibly context-switch a running process when a higher-priority task becomes ready or its time slice expires.",
        difficulty: "EASY",
        sourceReference: "Preemptive vs Non-Preemptive"
      },
      {
        questionText: "Which CPU scheduling algorithm gives the minimum average waiting time for a given set of processes?",
        optionA: "First-Come, First-Served (FCFS)",
        optionB: "Shortest Job First (SJF) / Shortest Remaining Time First (SRTF)",
        optionC: "Round Robin with large time quantum",
        optionD: "Random Selection",
        correctAnswer: "B",
        explanation: "SJF is provably optimal for minimizing average waiting time by scheduling the shortest burst first, though burst times must be estimated in advance.",
        difficulty: "MEDIUM",
        sourceReference: "Optimal CPU Scheduling"
      },
      {
        questionText: "What is the 'Convoy Effect' in First-Come, First-Served (FCFS) scheduling?",
        optionA: "Network packets colliding on an ethernet cable.",
        optionB: "A scenario where short CPU-burst processes suffer long waiting times queued behind a long CPU-burst, compute-heavy process.",
        optionC: "When the scheduler runs out of memory.",
        optionD: "Processes running on multiple CPUs in tandem.",
        correctAnswer: "B",
        explanation: "In FCFS, when a long process hogs the CPU, all short processes wait behind it, resulting in poor CPU and device utilization.",
        difficulty: "EASY",
        sourceReference: "FCFS Convoy Effect"
      },
      {
        questionText: "In Round Robin (RR) scheduling, what happens if the Time Quantum is chosen to be extremely small?",
        optionA: "The system behaves like FCFS.",
        optionB: "Context switching overhead dominates CPU time, drastically reducing overall system throughput.",
        optionC: "Average waiting time becomes zero.",
        optionD: "Processes deadlock immediately.",
        correctAnswer: "B",
        explanation: "An excessively tiny quantum causes the CPU to spend most of its cycles performing context switches between processes rather than executing useful work.",
        difficulty: "MEDIUM",
        sourceReference: "Round Robin Quantum Tradeoff"
      },
      {
        questionText: "What mechanism prevents Starvation in Priority Scheduling where low-priority processes might never execute?",
        optionA: "Aging: gradually increasing the priority of processes that wait in the system for long periods.",
        optionB: "Decreasing the memory allocation.",
        optionC: "Terminating low-priority processes immediately.",
        optionD: "Disabling timer interrupts.",
        correctAnswer: "A",
        explanation: "Aging increases process priority proportional to waiting time, guaranteeing that even the lowest-priority process eventually reaches top priority.",
        difficulty: "EASY",
        sourceReference: "Aging & Starvation Prevention"
      }
    ]
  },

  "os-synchronization": {
    videos: [
      {
        title: "Process Synchronization: Critical Section, Semaphores & Mutexes",
        youtubeUrl: "https://www.youtube.com/watch?v=1y_4P_4zWdI",
        duration: "27 min",
        channel: "Gate Smashers",
        description: "The Critical Section Problem, Peterson's solution, binary vs counting semaphores, mutex locks, and Producer-Consumer problem.",
        learningObjective: "Formulate race condition solutions satisfying mutual exclusion, progress, and bounded waiting."
      }
    ],
    questions: [
      {
        questionText: "What three conditions must any valid solution to the Critical Section Problem satisfy?",
        optionA: "Speed, Memory, Disk space",
        optionB: "Mutual Exclusion (at most one process inside), Progress (only waiting processes decide who enters next), and Bounded Waiting (limit on times other processes enter before one gets in).",
        optionC: "Compilation, Execution, Linking",
        optionD: "Encryption, Decryption, Hashing",
        correctAnswer: "B",
        explanation: "Dijkstra formulated these three criteria to ensure safety (Mutual Exclusion) and liveness (Progress and Bounded Waiting without starvation).",
        difficulty: "MEDIUM",
        sourceReference: "Critical Section Criteria"
      },
      {
        questionText: "What is the difference between a Mutex and a Counting Semaphore?",
        optionA: "A Mutex is a binary lock with ownership semantics (only the thread that locked it can unlock it); a Counting Semaphore maintains an integer count and can be signaled by any thread to manage finite pools of resources.",
        optionB: "A mutex can only be used in C++; semaphores in Java.",
        optionC: "A semaphore only works on single-core CPUs.",
        optionD: "There is no functional difference.",
        correctAnswer: "A",
        explanation: "Mutex has ownership (lock/unlock by same thread). Semaphores are signaling primitives where count represents available instances of a shared resource.",
        difficulty: "MEDIUM",
        sourceReference: "Mutex vs Semaphore"
      },
      {
        questionText: "What is a Spinlock, and under what condition is it preferred over a sleeping mutex?",
        optionA: "A lock that spins disk platters.",
        optionB: "A lock where waiting threads execute a busy-waiting loop (`while(locked);`); preferred on multi-core systems when the critical section is extremely short, avoiding expensive context switch overhead.",
        optionC: "A lock that can only be unlocked during reboot.",
        optionD: "A lock used only on single-core uniprocessor systems.",
        correctAnswer: "B",
        explanation: "Spinlocks avoid context switch sleeping costs when lock hold times are shorter than the time required to sleep and wake up a thread.",
        difficulty: "HARD",
        sourceReference: "Spinlocks & Busy Waiting"
      },
      {
        questionText: "In the classic Producer-Consumer problem with a bounded buffer of size N, what semaphores are required for thread safety?",
        optionA: "Only one integer counter.",
        optionB: "A mutex (for mutual exclusion), an `empty` counting semaphore initialized to N, and a `full` counting semaphore initialized to 0.",
        optionC: "Two mutexes and three threads.",
        optionD: "No semaphores are needed.",
        correctAnswer: "B",
        explanation: "`empty` tracks open slots (blocks producer when 0); `full` tracks filled slots (blocks consumer when 0); `mutex` protects buffer array mutations.",
        difficulty: "MEDIUM",
        sourceReference: "Producer-Consumer Synchronization"
      },
      {
        questionText: "What hardware instruction enables atomic read-modify-write synchronization primitives in modern CPUs?",
        optionA: "Test-and-Set (or Compare-And-Swap / CAS)",
        optionB: "MOV instruction",
        optionC: "JMP instruction",
        optionD: "NOP instruction",
        correctAnswer: "A",
        explanation: "Hardware atomic instructions like `TestAndSet` or `CMPXCHG` execute indivisibly across cache lines, forming the foundation of all software locks.",
        difficulty: "HARD",
        sourceReference: "Hardware Synchronization Primitives"
      }
    ]
  },

  "os-deadlocks": {
    videos: [
      {
        title: "Deadlock Detection, Prevention & Banker's Algorithm",
        youtubeUrl: "https://www.youtube.com/watch?v=Ucg4p_i4H7s",
        duration: "25 min",
        channel: "Gate Smashers",
        description: "Coffman conditions for deadlock, Resource Allocation Graphs (RAG), Banker's algorithm safe states, and recovery strategies.",
        learningObjective: "Detect resource deadlock cycles, apply Banker's safe state validation, and break Coffman conditions."
      }
    ],
    questions: [
      {
        questionText: "What are the four Coffman Conditions that must hold simultaneously for a deadlock to occur?",
        optionA: "Speed, Latency, Bandwidth, Jitter",
        optionB: "1. Mutual Exclusion, 2. Hold and Wait, 3. No Preemption, 4. Circular Wait",
        optionC: "Read, Write, Execute, Delete",
        optionD: "Hardware, Software, Firmware, Network",
        correctAnswer: "B",
        explanation: "Deadlock requires all 4 Coffman conditions: breaking ANY single condition completely prevents deadlock from ever occurring.",
        difficulty: "EASY",
        sourceReference: "Coffman Deadlock Conditions"
      },
      {
        questionText: "How does the Banker's Algorithm ensure deadlock avoidance?",
        optionA: "By refusing to allocate money to bankrupt processes.",
        optionB: "Before granting a resource request, it simulates allocation and tests if the resulting state remains in a 'Safe State' where a safe execution sequence exists for all processes.",
        optionC: "By terminating all processes whenever a request arrives.",
        optionD: "By disabling multi-threading.",
        correctAnswer: "B",
        explanation: "Dijkstra's Banker's Algorithm tests if allocating resources leaves the system in a safe state where every process can eventually finish with remaining resources.",
        difficulty: "MEDIUM",
        sourceReference: "Banker's Algorithm"
      },
      {
        questionText: "In a Resource Allocation Graph (RAG) where each resource type has strictly ONE single instance, what does the presence of a cycle indicate?",
        optionA: "The system is performing optimally.",
        optionB: "A deadlock definitely exists in the system.",
        optionC: "The graph must be deleted.",
        optionD: "All resources are currently free.",
        correctAnswer: "B",
        explanation: "In single-instance resource graphs, a cycle is a necessary and sufficient condition for deadlock. (With multiple instances, a cycle is necessary but not sufficient).",
        difficulty: "MEDIUM",
        sourceReference: "Resource Allocation Graphs"
      },
      {
        questionText: "How can the 'Circular Wait' condition be practically prevented in operating systems?",
        optionA: "By imposing a strict global total ordering on all resource types and requiring processes to request resources in strictly ascending numerical order.",
        optionB: "By giving every process unlimited memory.",
        optionC: "By eliminating user accounts.",
        optionD: "By shutting down the system every hour.",
        correctAnswer: "A",
        explanation: "Ordering resources globally (R1 < R2 < R3) and requiring processes to request in increasing order mathematically eliminates the possibility of circular dependencies.",
        difficulty: "MEDIUM",
        sourceReference: "Deadlock Prevention Techniques"
      },
      {
        questionText: "What is the 'Ostrich Algorithm' approach to deadlocks used by most general-purpose OSs (like Linux and Windows)?",
        optionA: "Hiding memory pages under a virtual sand folder.",
        optionB: "Ignoring the deadlock problem on the assumption that deadlocks occur rarely and the performance cost of continuous detection/avoidance is not worth the overhead.",
        optionC: "Rebooting whenever CPU exceeds 90%.",
        optionD: "Spawning an ostrich process to kill frozen tasks.",
        correctAnswer: "B",
        explanation: "Because deadlock detection adds high runtime overhead, general-purpose OSs ignore rare deadlocks and rely on users/watchdogs to kill hung processes.",
        difficulty: "EASY",
        sourceReference: "Ostrich Strategy"
      }
    ]
  },

  "os-memory": {
    videos: [
      {
        title: "Virtual Memory, Paging, TLB & Page Replacement Algorithms",
        youtubeUrl: "https://www.youtube.com/watch?v=pqp9r4n712A",
        duration: "28 min",
        channel: "Gate Smashers",
        description: "Logical vs physical addresses, Paging, Page Tables, Translation Lookaside Buffer (TLB), Page Faults, and LRU/FIFO replacement.",
        learningObjective: "Understand virtual memory address translation, page fault handling, TLB cache hit rates, and Belady's anomaly."
      }
    ],
    questions: [
      {
        questionText: "What is the role of the Memory Management Unit (MMU) in virtual memory systems?",
        optionA: "To compile C++ code into machine code.",
        optionB: "To translate Virtual (Logical) memory addresses generated by the CPU into Physical RAM addresses at runtime using Page Tables.",
        optionC: "To format SSD drives.",
        optionD: "To manage CPU clock frequencies.",
        correctAnswer: "B",
        explanation: "The MMU is hardware translating virtual addresses into physical addresses via page table lookups, enforcing memory protection across processes.",
        difficulty: "EASY",
        sourceReference: "MMU & Address Translation"
      },
      {
        questionText: "What is a Page Fault in an operating system?",
        optionA: "A hardware failure where a RAM chip breaks.",
        optionB: "A CPU interrupt triggered when a process accesses a virtual memory page that is not currently mapped into physical RAM (valid bit = 0, page is on disk swap).",
        optionC: "A syntax error in an HTML page.",
        optionD: "A kernel panic.",
        correctAnswer: "B",
        explanation: "When an accessed page is not in RAM, a page fault trap transfers control to the OS kernel to fetch the missing page from disk swap into a physical frame.",
        difficulty: "EASY",
        sourceReference: "Page Fault Handling"
      },
      {
        questionText: "What is the Translation Lookaside Buffer (TLB)?",
        optionA: "A network packet buffer in the router.",
        optionB: "A fast, small associative hardware cache located directly on the CPU that stores recent virtual-to-physical address translations, avoiding multi-level page table memory walks.",
        optionC: "A disk backup sector.",
        optionD: "An audio buffer for speaker drivers.",
        correctAnswer: "B",
        explanation: "TLB is an on-chip associative cache. A TLB hit resolves virtual addresses in 1 CPU cycle, avoiding 3-4 memory accesses needed for multi-level page tables.",
        difficulty: "MEDIUM",
        sourceReference: "TLB Cache Architecture"
      },
      {
        questionText: "What is Belady's Anomaly in page replacement algorithms?",
        optionA: "When adding more CPU cores slows down execution.",
        optionB: "The counter-intuitive phenomenon in FIFO page replacement where increasing the number of physical page frames results in MORE page faults for certain reference strings.",
        optionC: "When memory addresses become negative.",
        optionD: "When an array index exceeds its bounds.",
        correctAnswer: "B",
        explanation: "Discovered by Laszlo Belady, FIFO can suffer more page faults with more frames because it does not satisfy the stack property (unlike LRU).",
        difficulty: "HARD",
        sourceReference: "Belady's Anomaly"
      },
      {
        questionText: "What is 'Thrashing' in an operating system?",
        optionA: "Deleting files repeatedly in a loop.",
        optionB: "A condition where the OS spends significantly more time swapping pages in and out of disk swap space than executing actual instructions, collapsing system throughput.",
        optionC: "Physical vibration of server fans.",
        optionD: "Continuous context switching between threads.",
        correctAnswer: "B",
        explanation: "Thrashing occurs when the sum of processes' working sets exceeds total physical RAM; pages are continually evicted and immediately faulted back in.",
        difficulty: "MEDIUM",
        sourceReference: "Thrashing & Working Set"
      }
    ]
  },

  // =========================================================================
  // 12. COMPUTER NETWORKS
  // =========================================================================
  "cn-osi-layers": {
    videos: [
      {
        title: "OSI Model & TCP/IP Layered Architecture Explained",
        youtubeUrl: "https://www.youtube.com/watch?v=vv4y_uOneC0",
        duration: "25 min",
        channel: "NetworkChuck",
        description: "7 layers of the OSI model, protocol data units (PDU), data encapsulation/decapsulation, and TCP/IP 4-layer comparison.",
        learningObjective: "Trace packet encapsulation from Application down to Physical layer, mapping protocols to respective layers."
      }
    ],
    questions: [
      {
        questionText: "What is the correct top-to-bottom sequence of the 7 layers of the OSI reference model?",
        optionA: "Physical, Data Link, Network, Transport, Session, Presentation, Application",
        optionB: "Application, Presentation, Session, Transport, Network, Data Link, Physical",
        optionC: "Application, Transport, Internet, Network Access",
        optionD: "Hardware, Kernel, Protocol, Browser, User",
        correctAnswer: "B",
        explanation: "Layer 7 to 1: Application (7), Presentation (6), Session (5), Transport (4), Network (3), Data Link (2), Physical (1).",
        difficulty: "EASY",
        sourceReference: "OSI 7-Layer Model"
      },
      {
        questionText: "What is the Protocol Data Unit (PDU) name at the Transport, Network, and Data Link layers respectively?",
        optionA: "Bit, Byte, Packet",
        optionB: "Segment (or Datagram), Packet, Frame",
        optionC: "Frame, Segment, Packet",
        optionD: "Message, Stream, Signal",
        correctAnswer: "B",
        explanation: "Layer 4 (Transport) produces Segments/Datagrams; Layer 3 (Network) produces Packets; Layer 2 (Data Link) packages them into Frames.",
        difficulty: "EASY",
        sourceReference: "Protocol Data Units"
      },
      {
        questionText: "At which OSI layer do IP routing and logical IP addressing operate?",
        optionA: "Data Link Layer (Layer 2)",
        optionB: "Network Layer (Layer 3)",
        optionC: "Transport Layer (Layer 4)",
        optionD: "Session Layer (Layer 5)",
        correctAnswer: "B",
        explanation: "Layer 3 (Network Layer) handles end-to-end packet delivery, logical addressing (IPv4/IPv6), and routing across heterogeneous networks.",
        difficulty: "EASY",
        sourceReference: "Network Layer Operations"
      },
      {
        questionText: "What is Data Encapsulation in network communications?",
        optionA: "Encrypting all network packets with AES.",
        optionB: "The process where each descending layer in the protocol stack wraps data from the upper layer with its own protocol header and metadata.",
        optionC: "Compressing images before sending.",
        optionD: "Converting digital signals into radio waves.",
        correctAnswer: "B",
        explanation: "Encapsulation adds headers at each layer: Application data -> Transport segment (+ ports) -> Network packet (+ IPs) -> Data link frame (+ MACs).",
        difficulty: "EASY",
        sourceReference: "Encapsulation & Decapsulation"
      },
      {
        questionText: "What is the primary responsibility of the Data Link Layer (Layer 2)?",
        optionA: "End-to-end reliability across the global internet.",
        optionB: "Hop-to-hop frame delivery across a single physical link, physical MAC addressing, framing, and media access control (CSMA/CD).",
        optionC: "Formatting JSON data into XML.",
        optionD: "Resolving DNS names.",
        correctAnswer: "B",
        explanation: "Layer 2 provides node-to-node node transfer within the same local network segment using physical MAC addresses (e.g. Ethernet, Wi-Fi).",
        difficulty: "MEDIUM",
        sourceReference: "Data Link Layer"
      }
    ]
  },

  "cn-ip-addressing": {
    videos: [
      {
        title: "IPv4, IPv6 & Subnetting: CIDR, Subnet Masks & NAT",
        youtubeUrl: "https://www.youtube.com/watch?v=s_NIt847quQ",
        duration: "26 min",
        channel: "NetworkChuck",
        description: "IPv4 binary structure, classes, subnet masks, CIDR notation (/24, /26), usable host calculations, and IPv6 128-bit addresses.",
        learningObjective: "Calculate network addresses, broadcast addresses, usable hosts per subnet, and configure CIDR prefixes."
      }
    ],
    questions: [
      {
        questionText: "How many usable host IP addresses are available in an IPv4 subnet with a `/26` prefix (e.g. 192.168.1.0/26)?",
        optionA: "64",
        optionB: "62 (2^(32 - 26) - 2 = 64 - 2)",
        optionC: "128",
        optionD: "254",
        correctAnswer: "B",
        explanation: "Host bits = 32 - 26 = 6. Total addresses = 2^6 = 64. Subtracting 2 (network address and broadcast address) leaves 62 usable host addresses.",
        difficulty: "MEDIUM",
        sourceReference: "IPv4 Subnet Calculations"
      },
      {
        questionText: "What is the bit length of an IPv4 address compared to an IPv6 address?",
        optionA: "IPv4 is 16 bits; IPv6 is 64 bits.",
        optionB: "IPv4 is 32 bits (4 bytes); IPv6 is 128 bits (16 bytes).",
        optionC: "IPv4 is 64 bits; IPv6 is 256 bits.",
        optionD: "Both are 32 bits.",
        correctAnswer: "B",
        explanation: "IPv4 uses 32-bit addresses (~4.3 billion addresses); IPv6 uses 128-bit addresses (~3.4 x 10^38 addresses), solving IPv4 exhaustion.",
        difficulty: "EASY",
        sourceReference: "IPv4 vs IPv6 Structure"
      },
      {
        questionText: "What is the purpose of NAT (Network Address Translation) in home and enterprise routers?",
        optionA: "To encrypt network packets.",
        optionB: "To map multiple private RFC 1918 IP addresses inside a local LAN to a single public IP address using port numbers (PAT/NAPT), conserving public IPv4 space.",
        optionC: "To measure internet speed.",
        optionD: "To assign domain names to websites.",
        correctAnswer: "B",
        explanation: "NAT allows thousands of internal hosts using private IPs (192.168.x.x, 10.x.x.x) to share a single public IP address via port translation.",
        difficulty: "EASY",
        sourceReference: "Network Address Translation (NAT)"
      },
      {
        questionText: "What are the private IPv4 address ranges defined by RFC 1918 that cannot be routed on the public internet?",
        optionA: "1.0.0.0/8, 2.0.0.0/8, 3.0.0.0/8",
        optionB: "10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16",
        optionC: "127.0.0.0/8 only",
        optionD: "224.0.0.0/4 only",
        correctAnswer: "B",
        explanation: "RFC 1918 reserves 10.0.0.0/8 (Class A), 172.16.0.0/12 (Class B), and 192.168.0.0/16 (Class C) for non-routable private networks.",
        difficulty: "MEDIUM",
        sourceReference: "RFC 1918 Private IP Space"
      },
      {
        questionText: "What is the Subnet Mask corresponding to a `/28` CIDR prefix?",
        optionA: "255.255.255.0",
        optionB: "255.255.255.240",
        optionC: "255.255.255.192",
        optionD: "255.255.255.252",
        correctAnswer: "B",
        explanation: "/28 means 28 ones in the mask: 24 ones = 255.255.255. The last byte has 4 ones: 128 + 64 + 32 + 16 = 240, giving 255.255.255.240.",
        difficulty: "MEDIUM",
        sourceReference: "CIDR to Subnet Mask Conversion"
      }
    ]
  },

  "cn-transport": {
    videos: [
      {
        title: "TCP vs UDP: 3-Way Handshake, Flow Control & Congestion Control",
        youtubeUrl: "https://www.youtube.com/watch?v=AYdF7dv38-Y",
        duration: "25 min",
        channel: "Ben Eater",
        description: "Connection-oriented TCP vs connectionless UDP, sequence numbers, sliding window flow control, and TCP Reno congestion avoidance.",
        learningObjective: "Compare TCP reliability vs UDP speed, trace the 3-way handshake, and understand congestion window mechanics."
      }
    ],
    questions: [
      {
        questionText: "What are the flags exchanged in the TCP Three-Way Handshake to establish a connection?",
        optionA: "PING, PONG, ACK",
        optionB: "SYN (Client to Server) -> SYN-ACK (Server to Client) -> ACK (Client to Server)",
        optionC: "HELLO, WELCOME, CONNECT",
        optionD: "RST, FIN, ACK",
        correctAnswer: "B",
        explanation: "The client sends SYN with initial sequence number (ISN); the server acknowledges with SYN-ACK; the client finalizes with ACK.",
        difficulty: "EASY",
        sourceReference: "TCP 3-Way Handshake"
      },
      {
        questionText: "How does TCP differ from UDP in terms of delivery guarantees and overhead?",
        optionA: "TCP is connectionless and unreliable; UDP is connection-oriented.",
        optionB: "TCP provides reliable, ordered, error-checked, flow-controlled byte streams with 20-byte header; UDP is connectionless, lightweight (8-byte header), and offers no delivery guarantees.",
        optionC: "UDP is slower than TCP.",
        optionD: "TCP only works over satellite links.",
        correctAnswer: "B",
        explanation: "TCP guarantees delivery and order via acknowledgments, retransmissions, and flow control. UDP offers fast, low-latency best-effort transmission.",
        difficulty: "EASY",
        sourceReference: "TCP vs UDP Comparison"
      },
      {
        questionText: "What mechanism does TCP use for Flow Control to prevent a fast sender from overwhelming a slow receiver?",
        optionA: "Dropping all packets randomly.",
        optionB: "The Sliding Window protocol, where the receiver advertises its available buffer space (Receive Window - rwnd) in TCP header acks.",
        optionC: "Reducing the server CPU clock speed.",
        optionD: "Converting data from binary to text.",
        correctAnswer: "B",
        explanation: "Flow control matches sender rate to receiver capacity: the sender transmits at most `rwnd` unacknowledged bytes advertised by the receiver.",
        difficulty: "MEDIUM",
        sourceReference: "TCP Flow Control & Sliding Window"
      },
      {
        questionText: "What is the purpose of the Congestion Window (cwnd) in TCP Congestion Control algorithms?",
        optionA: "To measure Wi-Fi signal strength.",
        optionB: "To dynamically limit the number of bytes injected into the network based on estimated network capacity (Slow Start, Congestion Avoidance, Fast Retransmit).",
        optionC: "To prevent unauthorized users from logging in.",
        optionD: "To encrypt payload data.",
        correctAnswer: "B",
        explanation: "The sender maintains `cwnd` to prevent network bottleneck congestion. Actual allowed in-flight data is `min(rwnd, cwnd)`.",
        difficulty: "HARD",
        sourceReference: "TCP Congestion Control"
      },
      {
        questionText: "Why do real-time voice (VoIP), video streaming, and online multiplayer games predominantly use UDP over TCP?",
        optionA: "Because TCP cannot transmit audio.",
        optionB: "Because in real-time media, late retransmitted packets are useless; low latency and minimal jitter are far more important than 100% reliable packet retransmission.",
        optionC: "UDP packages have built-in audio decoders.",
        optionD: "TCP is prohibited on mobile devices.",
        correctAnswer: "B",
        explanation: "TCP retransmissions introduce head-of-line blocking latency. Real-time media prefers discarding occasional dropped frames over freezing.",
        difficulty: "EASY",
        sourceReference: "UDP Application Suitability"
      }
    ]
  },

  "cn-routing": {
    videos: [
      {
        title: "Routing Protocols: Distance Vector, Link State, OSPF & BGP",
        youtubeUrl: "https://www.youtube.com/watch?v=k8Z7wFqH3W8",
        duration: "24 min",
        channel: "PowerCert Animated Videos",
        description: "Routing tables, Interior Gateway Protocols (RIP, OSPF) vs Exterior Gateway Protocols (BGP), and autonomous systems (AS).",
        learningObjective: "Distinguish interior vs exterior routing protocols, link-state Dijkstra calculations, and BGP peering."
      }
    ],
    questions: [
      {
        questionText: "What is the primary distinction between an Interior Gateway Protocol (IGP) and an Exterior Gateway Protocol (EGP)?",
        optionA: "IGPs run on laptops; EGPs run on satellites.",
        optionB: "IGPs (e.g. OSPF, EIGRP) route traffic within a single Autonomous System (AS); EGPs (specifically BGP) route traffic between different Autonomous Systems across the global internet.",
        optionC: "EGPs do not use IP addresses.",
        optionD: "IGPs only work on fiber optic cables.",
        correctAnswer: "B",
        explanation: "IGPs route inside an organization's autonomous network; BGP (Border Gateway Protocol) is the EGP connecting global ISPs and routing internet prefixes.",
        difficulty: "EASY",
        sourceReference: "Routing Protocols Classification"
      },
      {
        questionText: "What algorithm does OSPF (Open Shortest Path First) use to compute the shortest path tree to all network destinations?",
        optionA: "Bellman-Ford Algorithm",
        optionB: "Dijkstra's Shortest Path First (SPF) Algorithm",
        optionC: "Floyd-Warshall Algorithm",
        optionD: "Prim's Algorithm",
        correctAnswer: "B",
        explanation: "OSPF is a link-state protocol where routers flood link-state advertisements (LSAs) and run Dijkstra's algorithm to compute the shortest path tree.",
        difficulty: "EASY",
        sourceReference: "OSPF & Dijkstra SPF"
      },
      {
        questionText: "What protocol is universally used to route traffic between Autonomous Systems on the global Internet?",
        optionA: "RIP (Routing Information Protocol)",
        optionB: "BGP (Border Gateway Protocol - BGP4)",
        optionC: "DHCP",
        optionD: "ICMP",
        correctAnswer: "B",
        explanation: "BGP is the de facto path-vector routing protocol that connects internet service providers, exchanging reachability information via AS paths.",
        difficulty: "EASY",
        sourceReference: "Border Gateway Protocol (BGP)"
      },
      {
        questionText: "What is the 'Count to Infinity' problem in Distance Vector routing protocols (like RIP), and how is it mitigated?",
        optionA: "CPUs running out of registers; mitigated by rebooting.",
        optionB: "Routing loops that cause metric counts to increment endlessly when a link fails; mitigated using Split Horizon, Poison Reverse, and Hold-Down Timers.",
        optionC: "Too many internet users.",
        optionD: "An integer overflow error in the routing table.",
        correctAnswer: "B",
        explanation: "When a route fails, distance-vector nodes may update each other circularly, slowly incrementing metric to infinity (16 in RIP). Split horizon prevents advertising routes back out the same interface.",
        difficulty: "HARD",
        sourceReference: "Distance Vector Routing Problems"
      },
      {
        questionText: "What does the Time to Live (TTL) field in an IPv4 packet header accomplish?",
        optionA: "Measures the physical battery life of the sender device.",
        optionB: "Prevents packets from circulating indefinitely in routing loops by decrementing by 1 at each router hop; when TTL reaches 0, the packet is discarded and an ICMP Time Exceeded is returned.",
        optionC: "Sets the expiration date of user passwords.",
        optionD: "Limits the file size of HTTP downloads.",
        correctAnswer: "B",
        explanation: "TTL is an 8-bit hop counter. Each router decrements TTL by 1. When it hits 0, the packet is dropped, preventing infinite loop congestion.",
        difficulty: "EASY",
        sourceReference: "IPv4 Header & TTL"
      }
    ]
  },

  "cn-application": {
    videos: [
      {
        title: "Application Protocols: DNS, HTTP/1.1, HTTP/2, HTTP/3 & TLS",
        youtubeUrl: "https://www.youtube.com/watch?v=72snZctFFtA",
        duration: "26 min",
        channel: "Computerphile",
        description: "DNS resolution hierarchy (Root, TLD, Authoritative), HTTP/1.1 vs HTTP/2 multiplexing, HTTP/3 over QUIC/UDP, and TLS 1.3 handshakes.",
        learningObjective: "Understand recursive DNS lookups, HTTP evolution from pipelining to QUIC multiplexing, and TLS session handshakes."
      }
    ],
    questions: [
      {
        questionText: "What are the hierarchical steps of a Recursive DNS Lookup when resolving `www.example.com` for the first time?",
        optionA: "Ask browser cache -> Ask Google -> Query local database.",
        optionB: "Resolver queries Root DNS servers (.) -> TLD servers (.com) -> Authoritative Name Server for `example.com` -> returns A/AAAA record to client.",
        optionC: "Query all computers on the local Wi-Fi simultaneously.",
        optionD: "Send broadcast packets to 255.255.255.255.",
        correctAnswer: "B",
        explanation: "DNS resolves hierarchically: Recursive Resolver asks Root Server (points to .com TLD), TLD server (points to Authoritative server), and Authoritative server returns IP.",
        difficulty: "MEDIUM",
        sourceReference: "DNS Resolution Hierarchy"
      },
      {
        questionText: "What major performance limitation of HTTP/1.1 was resolved by HTTP/2?",
        optionA: "HTTP/1.1 could not display images.",
        optionB: "Head-of-Line Blocking at the application layer: HTTP/2 introduced binary framing with stream multiplexing, allowing multiple concurrent requests and responses over a single TCP connection.",
        optionC: "HTTP/1.1 did not support passwords.",
        optionD: "HTTP/2 removed all encryption requirements.",
        correctAnswer: "B",
        explanation: "HTTP/1.1 suffers Head-of-Line blocking where requests on a TCP connection must wait in line. HTTP/2 interleaves binary frames for multiple streams concurrently.",
        difficulty: "MEDIUM",
        sourceReference: "HTTP/2 Multiplexing"
      },
      {
        questionText: "What underlying transport protocol does HTTP/3 utilize instead of TCP?",
        optionA: "SCTP",
        optionB: "QUIC (built on top of UDP), eliminating TCP head-of-line blocking and reducing handshake latency to 0-RTT/1-RTT.",
        optionC: "Raw IP sockets",
        optionD: "Ethernet broadcast frames",
        correctAnswer: "B",
        explanation: "HTTP/3 replaces TCP with QUIC over UDP, providing independent stream packet loss recovery and fast 0-RTT connection resumption.",
        difficulty: "HARD",
        sourceReference: "HTTP/3 & QUIC"
      },
      {
        questionText: "What is the function of the DNS `CNAME` record type?",
        optionA: "Maps a hostname directly to an IPv4 address.",
        optionB: "Canonical Name record: creates an alias pointing one domain name to another domain name (canonical domain).",
        optionC: "Defines mail exchange servers for email routing.",
        optionD: "Stores text records for SPF and domain verification.",
        correctAnswer: "B",
        explanation: "CNAME aliases a domain (e.g. `docs.example.com` -> `example.github.io`), requiring the resolver to perform an additional lookup for the target's IP.",
        difficulty: "EASY",
        sourceReference: "DNS Record Types"
      },
      {
        questionText: "What does TLS (Transport Layer Security) 1.3 provide over older versions during connection negotiation?",
        optionA: "It removes encryption completely.",
        optionB: "1-RTT handshake (and optional 0-RTT resumption), removal of legacy insecure ciphers (e.g. RSA key exchange, RC4), and mandatory Forward Secrecy.",
        optionC: "It doubles network packet size.",
        optionD: "It forces users to change passwords every session.",
        correctAnswer: "B",
        explanation: "TLS 1.3 cuts handshake latency from 2 round trips to 1, mandates (EC)DHE for forward secrecy, and eliminates insecure legacy crypto algorithms.",
        difficulty: "MEDIUM",
        sourceReference: "TLS 1.3 Architecture"
      }
    ]
  }
};

module.exports = { topicContentDataPart5 };
