const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Competencies per course
const courseCompetencies = {
  "dsa": { code: "COMP_DSA", name: "Data Structures & Algorithms", domain: "Computer Science" },
  "data-analytics": { code: "COMP_DATA_ANALYTICS", name: "Data Analytics & Statistics", domain: "Data Analytics" },
  "web-development": { code: "COMP_WEB_DEV", name: "Fullstack Web Development", domain: "Web Development" },
  "python": { code: "COMP_PYTHON", name: "Python Engineering & Automation", domain: "Programming" },
  "machine-learning": { code: "COMP_ML_AI", name: "Machine Learning & AI", domain: "Artificial Intelligence" },
  "dbms": { code: "COMP_DBMS", name: "Relational DBMS & SQL", domain: "Database Systems" },
  "cloud-devops": { code: "COMP_CLOUD_DEVOPS", name: "Cloud Computing & DevOps", domain: "Cloud & Infrastructure" },
  "cyber-security": { code: "COMP_CYBER_SEC", name: "Cyber Security & Defense", domain: "Information Security" },
  "java": { code: "COMP_JAVA", name: "Java Systems & OOP", domain: "Software Engineering" },
  "cpp": { code: "COMP_CPP", name: "C++ Modern Systems Programming", domain: "Systems Programming" },
  "operating-systems": { code: "COMP_OS", name: "Operating Systems Architecture", domain: "Computer Systems" },
  "computer-networks": { code: "COMP_CN", name: "Computer Networks & Protocols", domain: "Networking" },
};

// Course topic content map with authentic YouTube videos and topic-strict assessment questions
const topicContentData = {
  // =========================================================================
  // 1. DATA STRUCTURES & ALGORITHMS (DSA)
  // =========================================================================
  "programming-fundamentals": {
    videos: [
      {
        title: "Programming Fundamentals: Memory, Variables & Control Flow",
        youtubeUrl: "https://www.youtube.com/watch?v=zOjov-2OZ0E",
        duration: "22 min",
        channel: "freeCodeCamp.org",
        description: "Foundations of computer programming, memory layout, variables, and logic branching.",
        learningObjective: "Understand how high-level code maps to memory addresses, stack frames, and control structures."
      }
    ],
    questions: [
      {
        questionText: "What is the primary difference between Stack memory and Heap memory in most programming languages?",
        optionA: "Stack memory is automatically managed with LIFO allocation for function call frames, while Heap memory is dynamically allocated at runtime.",
        optionB: "Stack memory is used exclusively for global variables, while Heap is used for local primitives.",
        optionC: "Stack allocation requires manual garbage collection, whereas Heap is deallocated instantaneously.",
        optionD: "Heap memory is limited to fixed compile-time buffers, whereas Stack memory can grow without limit.",
        correctAnswer: "A",
        explanation: "Stack memory stores execution frames and local variables allocated in LIFO order, while Heap is used for dynamic memory allocations whose lifetime exceeds a single stack frame.",
        difficulty: "EASY",
        sourceReference: "Memory Management & Execution Models"
      },
      {
        questionText: "What does asymptotic time complexity Big-O notation describe?",
        optionA: "The exact runtime in milliseconds on a specific CPU architecture.",
        optionB: "The upper bound on the growth rate of algorithm runtime as the input size approaches infinity.",
        optionC: "The minimum amount of memory required to compile a binary executable.",
        optionD: "The exact number of cache misses incurred by an instruction pipeline.",
        correctAnswer: "B",
        explanation: "Big-O notation describes the asymptotic upper bound of the growth rate of runtime or space complexity as input size N tends toward infinity.",
        difficulty: "EASY",
        sourceReference: "Algorithm Analysis & Asymptotics"
      },
      {
        questionText: "Which of the following operations has an average time complexity of O(1)?",
        optionA: "Searching for an unindexed value in an unsorted array.",
        optionB: "Accessing an array element by its zero-based index.",
        optionC: "Inserting an element at the beginning of an array with N elements.",
        optionD: "Finding the median value of an unsorted linked list.",
        correctAnswer: "B",
        explanation: "Array indexing computes the memory offset directly as (base_address + index * element_size), which executes in O(1) constant time.",
        difficulty: "EASY",
        sourceReference: "Data Structure Operations"
      },
      {
        questionText: "In recursive algorithm execution, what condition must be satisfied to prevent a Stack Overflow error?",
        optionA: "The function must allocate all memory dynamically on the heap.",
        optionB: "A well-defined base case that halts recursive invocations without further calls.",
        optionC: "Every parameter must be passed strictly by pointer or reference.",
        optionD: "The recursion depth must exceed the maximum integer bitwidth.",
        correctAnswer: "B",
        explanation: "A base case is mandatory in recursion to stop continuous stack frame creation and allow the stack to unwind.",
        difficulty: "EASY",
        sourceReference: "Recursion Principles"
      },
      {
        questionText: "What is the time complexity of binary search on a sorted array of N elements?",
        optionA: "O(1)",
        optionB: "O(log N)",
        optionC: "O(N)",
        optionD: "O(N log N)",
        correctAnswer: "B",
        explanation: "Binary search halves the search space with each comparison step, yielding logarithmic O(log N) time complexity.",
        difficulty: "MEDIUM",
        sourceReference: "Searching Algorithms"
      }
    ]
  },

  "recursion": {
    videos: [
      {
        title: "Recursion and Backtracking Masterclass",
        youtubeUrl: "https://www.youtube.com/watch?v=mGOV4nMbuLM",
        duration: "28 min",
        channel: "Abdul Bari",
        description: "In-depth derivation of recurrence relations, recursive call trees, and backtracking state trees.",
        learningObjective: "Master recursive trace trees, time complexity derivation, and state rollback in backtracking."
      }
    ],
    questions: [
      {
        questionText: "What are the two mandatory components of every correct recursive function?",
        optionA: "A loop construct and a dynamic array.",
        optionB: "A base condition and a recursive relation that makes progress toward the base condition.",
        optionC: "A mutex lock and a pointer dereference.",
        optionD: "A global counter and a try-catch block.",
        correctAnswer: "B",
        explanation: "Every valid recursive function requires a base condition to terminate and recursive sub-problems that converge toward the base condition.",
        difficulty: "EASY",
        sourceReference: "Recursive Paradigms"
      },
      {
        questionText: "What distinguishes backtracking from simple brute-force recursion?",
        optionA: "Backtracking prunes branches of the search space as soon as a constraint is violated.",
        optionB: "Backtracking never uses stack memory.",
        optionC: "Backtracking is only applicable to linear data structures.",
        optionD: "Backtracking runs in guaranteed polynomial O(N^2) time.",
        correctAnswer: "A",
        explanation: "Backtracking explores candidate solutions recursively and prunes invalid branches as soon as constraints are violated, rolling back state to explore alternatives.",
        difficulty: "MEDIUM",
        sourceReference: "Backtracking Foundations"
      },
      {
        questionText: "What is the recurrence relation for the Tower of Hanoi problem with N disks?",
        optionA: "T(N) = T(N - 1) + 1",
        optionB: "T(N) = 2*T(N - 1) + 1",
        optionC: "T(N) = T(N / 2) + O(1)",
        optionD: "T(N) = 2*T(N / 2) + O(N)",
        correctAnswer: "B",
        explanation: "Solving N disks requires moving N-1 disks to an auxiliary peg, 1 disk to target, and N-1 disks from auxiliary to target: T(N) = 2T(N-1) + 1 = 2^N - 1.",
        difficulty: "MEDIUM",
        sourceReference: "Recurrence Relations"
      },
      {
        questionText: "What is the worst-case auxiliary space complexity of recursive Depth First Search on a tree of height H?",
        optionA: "O(1)",
        optionB: "O(H)",
        optionC: "O(2^H)",
        optionD: "O(N!)",
        correctAnswer: "B",
        explanation: "The call stack holds at most H activation frames corresponding to the path from root to the deepest leaf node.",
        difficulty: "MEDIUM",
        sourceReference: "Recursive Tree Analysis"
      },
      {
        questionText: "What is tail recursion?",
        optionA: "A recursive call occurring at the start of a function before any local variables are initialized.",
        optionB: "A recursive call where the function performs no further operations after the recursive invocation returns.",
        optionC: "A recursive function that traverses a linked list starting from the tail node.",
        optionD: "A recursion that spawns multiple concurrent worker threads.",
        correctAnswer: "B",
        explanation: "In tail recursion, the recursive call is the final operation executed by the function, allowing compiler tail-call optimization (TCO) to reuse the current stack frame.",
        difficulty: "HARD",
        sourceReference: "Tail Call Optimization"
      }
    ]
  },

  "arrays": {
    videos: [
      {
        title: "Arrays & Dynamic Arrays: Memory Layout & Two-Pointers",
        youtubeUrl: "https://www.youtube.com/watch?v=5_5oE5664HY",
        duration: "25 min",
        channel: "Abdul Bari",
        description: "Contiguous memory allocation, static vs dynamic resizing, amortized complexity, and two-pointer techniques.",
        learningObjective: "Understand array memory addressing, dynamic array geometric doubling amortized cost, and sliding window patterns."
      }
    ],
    questions: [
      {
        questionText: "Why is the amortized cost of appending an element to a dynamically resizing array (like std::vector or Python list) O(1)?",
        optionA: "Because resizing only happens when memory is fully defragmented.",
        optionB: "Because capacity is geometrically doubled, spreading the O(N) reallocation cost over N preceding O(1) insertions.",
        optionC: "Because memory is allocated lazily on the CPU cache register.",
        optionD: "Because elements are not actually copied during resizing.",
        correctAnswer: "B",
        explanation: "With geometric doubling (factor of 2 or 1.5), an expensive O(N) resize only occurs after N individual insertions, resulting in amortized O(1) per append.",
        difficulty: "MEDIUM",
        sourceReference: "Dynamic Array Resizing"
      },
      {
        questionText: "What is the worst-case time complexity of inserting an element at index 0 of an array containing N elements?",
        optionA: "O(1)",
        optionB: "O(log N)",
        optionC: "O(N)",
        optionD: "O(N^2)",
        correctAnswer: "C",
        explanation: "Inserting at index 0 requires shifting all existing N elements one position to the right to maintain contiguous storage.",
        difficulty: "EASY",
        sourceReference: "Array Operations"
      },
      {
        questionText: "Which algorithmic technique allows finding a continuous subarray with maximum sum in O(N) time?",
        optionA: "Dijkstra's algorithm",
        optionB: "Kadane's algorithm",
        optionC: "Floyd-Warshall algorithm",
        optionD: "Kruskal's algorithm",
        correctAnswer: "B",
        explanation: "Kadane's algorithm maintains the maximum subarray sum ending at each position in single-pass O(N) time and O(1) space.",
        difficulty: "MEDIUM",
        sourceReference: "Subarray Optimization"
      },
      {
        questionText: "In a two-pointer technique on a sorted array, what allows us to eliminate candidates in O(1) time?",
        optionA: "Random hashing of array indices.",
        optionB: "The monotonic ordering guarantees that moving a pointer in a given direction strictly increases or decreases the evaluated sum.",
        optionC: "Heap allocation guarantees consecutive memory blocks.",
        optionD: "Bitwise XOR cancellation of duplicate elements.",
        correctAnswer: "B",
        explanation: "Sorted order guarantees that if current_sum < target, incrementing the left pointer strictly increases the sum, and decrementing the right pointer strictly decreases it.",
        difficulty: "MEDIUM",
        sourceReference: "Two-Pointer Strategy"
      },
      {
        questionText: "What cache phenomenon explains why linear traversal over a 1D array is significantly faster than traversing a linked list of equal size?",
        optionA: "Context switching latency.",
        optionB: "Spatial locality of reference enabling CPU prefetching into L1/L2 caches.",
        optionC: "Virtual memory thrashing.",
        optionD: "Instruction pipelining hazards.",
        correctAnswer: "B",
        explanation: "Arrays store elements in contiguous memory words. Reading an element loads its entire cache line, maximizing spatial locality and cache hits.",
        difficulty: "HARD",
        sourceReference: "Computer Architecture & Memory Cache"
      }
    ]
  },

  "strings": {
    videos: [
      {
        title: "Strings & Hashing: Sliding Window, Rolling Hash & KMP",
        youtubeUrl: "https://www.youtube.com/watch?v=V7mK05tK_v8",
        duration: "24 min",
        channel: "take U forward",
        description: "String algorithms, character encoding, rolling hash functions, and prefix tables.",
        learningObjective: "Implement string pattern matching, rolling hash for substring checks, and sliding window frequency maps."
      }
    ],
    questions: [
      {
        questionText: "What is string immutability in languages such as Java and Python?",
        optionA: "Strings cannot be read after creation.",
        optionB: "Once created, string characters cannot be modified in-place; alterations create a new string object.",
        optionC: "Strings cannot be concatenated under any circumstances.",
        optionD: "Strings are always stored in read-only ROM memory.",
        correctAnswer: "B",
        explanation: "Immutability means the state of the string object cannot change after construction. Any modification results in a newly allocated string.",
        difficulty: "EASY",
        sourceReference: "String Immutability"
      },
      {
        questionText: "What is the primary advantage of the Knuth-Morris-Pratt (KMP) string matching algorithm over naive pattern matching?",
        optionA: "KMP uses O(1) auxiliary space.",
        optionB: "KMP utilizes a longest prefix-suffix (LPS) array to avoid re-examining characters in the text that have already matched.",
        optionC: "KMP sorts characters in ASCII order before searching.",
        optionD: "KMP runs in logarithmic time on uncompressed text.",
        correctAnswer: "B",
        explanation: "KMP precomputes an LPS pi-table, enabling the search pointer in the text to advance without backtracking upon a mismatch, achieving O(N+M) time.",
        difficulty: "HARD",
        sourceReference: "Pattern Matching Algorithms"
      },
      {
        questionText: "What enables the Rabin-Karp algorithm to search for a pattern in O(N + M) average time?",
        optionA: "Dynamic programming memoization tables.",
        optionB: "A rolling hash function that computes the hash of the next window in O(1) time.",
        optionC: "Binary search on character frequency arrays.",
        optionD: "Depth-first traversal of a suffix automaton.",
        correctAnswer: "B",
        explanation: "Rabin-Karp uses a polynomial rolling hash: sliding the window subtracts the exiting character and adds the entering character in O(1) arithmetic steps.",
        difficulty: "MEDIUM",
        sourceReference: "Rolling Hash Techniques"
      },
      {
        questionText: "How do you check if two strings are anagrams in O(N) time and O(1) auxiliary space (assuming lowercase English alphabet)?",
        optionA: "Sort both strings and compare character-by-character.",
        optionB: "Maintain a fixed-size frequency array of length 26 to count character occurrences.",
        optionC: "Concatenate both strings and compute edit distance.",
        optionD: "Convert both strings into binary search trees.",
        correctAnswer: "B",
        explanation: "Using an integer array of size 26, increment counts for string A and decrement for string B. If all counts are zero, they are anagrams in O(N) time and O(1) extra space.",
        difficulty: "EASY",
        sourceReference: "Frequency Arrays"
      },
      {
        questionText: "What is the worst-case time complexity of constructing a Trie (prefix tree) of N words each of maximum length L?",
        optionA: "O(N * L)",
        optionB: "O(N^2 * L)",
        optionC: "O(2^(N+L))",
        optionD: "O(N * log L)",
        correctAnswer: "A",
        explanation: "Inserting each character takes O(1) branch traversal. For N words of length L, total construction requires O(N * L) steps.",
        difficulty: "MEDIUM",
        sourceReference: "Trie Data Structures"
      }
    ]
  },

  "stack": {
    videos: [
      {
        title: "Stack Data Structure: Implementation & Monotonic Stack",
        youtubeUrl: "https://www.youtube.com/watch?v=sFVxsatgEI4",
        duration: "21 min",
        channel: "Abdul Bari",
        description: "LIFO principles, array/linked-list representations, infix to postfix conversions, and monotonic stack patterns.",
        learningObjective: "Master stack invariant maintenance, next greater element algorithms, and parenthesis validation."
      }
    ],
    questions: [
      {
        questionText: "Which principle governs the order of insertion and removal in a Stack?",
        optionA: "FIFO (First In First Out)",
        optionB: "LIFO (Last In First Out)",
        optionC: "Priority Ordering",
        optionD: "Random Access",
        correctAnswer: "B",
        explanation: "Stacks operate strictly on Last In First Out (LIFO): the most recently pushed element is the first to be popped.",
        difficulty: "EASY",
        sourceReference: "Stack Fundamentals"
      },
      {
        questionText: "What is the time complexity of pushing and popping elements in a standard array-backed stack?",
        optionA: "O(1) push, O(N) pop",
        optionB: "O(1) push, O(1) pop",
        optionC: "O(log N) for both",
        optionD: "O(N) for both",
        correctAnswer: "B",
        explanation: "Both push and pop operate directly on the top pointer without shifting other elements, executing in O(1) constant time.",
        difficulty: "EASY",
        sourceReference: "Stack Complexity"
      },
      {
        questionText: "What data structure pattern solves the 'Next Greater Element' problem for all elements in an array in O(N) total time?",
        optionA: "Monotonic Stack",
        optionB: "Binary Search Tree",
        optionC: "Disjoint Set Union",
        optionD: "Circular Buffer",
        correctAnswer: "A",
        explanation: "A monotonic decreasing stack keeps elements in non-increasing order. Each array index is pushed and popped at most once, yielding linear O(N) time.",
        difficulty: "MEDIUM",
        sourceReference: "Monotonic Stack Applications"
      },
      {
        questionText: "When converting an Infix arithmetic expression to Postfix (Reverse Polish Notation) using Shunting Yard, what role does the stack play?",
        optionA: "It holds operands until an operator arrives.",
        optionB: "It holds operators and parentheses according to precedence rules until they can be appended to output.",
        optionC: "It stores intermediate floating-point results.",
        optionD: "It sorts operands lexicographically.",
        correctAnswer: "B",
        explanation: "Dijkstra's Shunting-yard algorithm uses an operator stack to buffer operators and resolve precedence before appending them to the postfix output.",
        difficulty: "MEDIUM",
        sourceReference: "Expression Parsing"
      },
      {
        questionText: "What problem arises if function calls recurse indefinitely without reaching a base condition?",
        optionA: "Deadlock on the mutex lock.",
        optionB: "Call Stack Overflow due to exhaustion of reserved stack memory.",
        optionC: "Heap fragmentation.",
        optionD: "Integer underflow.",
        correctAnswer: "B",
        explanation: "Each function invocation pushes a new stack frame. Infinite recursion consumes all stack space, causing an operating system stack overflow crash.",
        difficulty: "EASY",
        sourceReference: "Call Stack Architecture"
      }
    ]
  },

  "queue": {
    videos: [
      {
        title: "Queue & Deque: Circular Queues, Sliding Window Max",
        youtubeUrl: "https://www.youtube.com/watch?v=okr-XE8GFTO",
        duration: "20 min",
        channel: "Abdul Bari",
        description: "FIFO mechanics, circular array pointers modulo arithmetic, double-ended queues (deque), and monotonic queue sliding window maximum.",
        learningObjective: "Understand FIFO queues, circular index arithmetic, and O(N) sliding window maximum using deques."
      }
    ],
    questions: [
      {
        questionText: "Why does a naive array-based queue implementation suffer from O(N) dequeue time complexity?",
        optionA: "Because every dequeue requires recalculating memory checksums.",
        optionB: "Because removing the front element requires shifting all subsequent elements left by one position.",
        optionC: "Because array pointers can only point to odd memory addresses.",
        optionD: "Because queues require dynamic hashing.",
        correctAnswer: "B",
        explanation: "In a naive array where front is fixed at index 0, removing the front element forces shifting the remaining N-1 elements, costing O(N).",
        difficulty: "EASY",
        sourceReference: "Queue Implementations"
      },
      {
        questionText: "How does a Circular Queue solve the shifting problem with O(1) enqueue and dequeue operations?",
        optionA: "By using modulo arithmetic to wrap front and rear pointers around the fixed array buffer.",
        optionB: "By allocating a new dynamic array on every insertion.",
        optionC: "By using recursive function calls instead of loops.",
        optionD: "By sorting items whenever the buffer reaches capacity.",
        correctAnswer: "A",
        explanation: "Using (rear + 1) % capacity and (front + 1) % capacity allows pointers to wrap around without shifting existing elements.",
        difficulty: "EASY",
        sourceReference: "Circular Queue"
      },
      {
        questionText: "What data structure is optimal for solving the 'Sliding Window Maximum' problem in O(N) time?",
        optionA: "A Monotonic Double-Ended Queue (Deque)",
        optionB: "A Binary Search Tree",
        optionC: "A Hash Table",
        optionD: "A Singly Linked List",
        correctAnswer: "A",
        explanation: "A monotonic decreasing deque stores indices of candidate maximums, allowing O(1) amortized window shifts and O(N) overall runtime.",
        difficulty: "HARD",
        sourceReference: "Monotonic Deque Optimization"
      },
      {
        questionText: "Which tree traversal algorithm utilizes a Queue for its standard iterative implementation?",
        optionA: "Preorder Traversal",
        optionB: "Inorder Traversal",
        optionC: "Breadth-First Search (Level-Order Traversal)",
        optionD: "Postorder Traversal",
        correctAnswer: "C",
        explanation: "Breadth-First Search (BFS) processes nodes level-by-level in FIFO order, making a queue the natural data structure.",
        difficulty: "EASY",
        sourceReference: "Graph & Tree Traversals"
      },
      {
        questionText: "What is the underlying data structure of an efficient Priority Queue?",
        optionA: "A Binary Heap (Min-Heap or Max-Heap)",
        optionB: "An unsorted array",
        optionC: "A circular singly linked list",
        optionD: "A hash map with open addressing",
        correctAnswer: "A",
        explanation: "A binary heap provides O(log N) insertion and O(log N) extraction of the maximum/minimum element while maintaining a compact array representation.",
        difficulty: "MEDIUM",
        sourceReference: "Priority Queue & Heaps"
      }
    ]
  },

  "trees": {
    videos: [
      {
        title: "Binary Trees & BST: Traversals, Height & Balancing",
        youtubeUrl: "https://www.youtube.com/watch?v=H5JubkIy_p8",
        duration: "27 min",
        channel: "Abdul Bari",
        description: "Tree terminology, recursive traversals (pre, in, post), Binary Search Tree invariants, and AVL balance factors.",
        learningObjective: "Master tree recursions, BST search/insert properties, and tree diameter and height calculations."
      }
    ],
    questions: [
      {
        questionText: "What invariant must hold true for every node X in a valid Binary Search Tree (BST)?",
        optionA: "All values in X's left subtree must be strictly less than X, and all values in X's right subtree must be strictly greater than X.",
        optionB: "The left child must have a depth equal to the right child.",
        optionC: "Every node must have exactly two child nodes.",
        optionD: "The tree height must equal log2(N) under all circumstances.",
        correctAnswer: "A",
        explanation: "In a BST, all keys in the left subtree are smaller than the node key, and all keys in the right subtree are greater than the node key.",
        difficulty: "EASY",
        sourceReference: "BST Definition"
      },
      {
        questionText: "Which depth-first traversal of a Binary Search Tree produces values in strictly sorted ascending order?",
        optionA: "Preorder (Root, Left, Right)",
        optionB: "Inorder (Left, Root, Right)",
        optionC: "Postorder (Left, Right, Root)",
        optionD: "Level-order (BFS)",
        correctAnswer: "B",
        explanation: "Inorder traversal visits left subtree, root node, then right subtree, naturally outputting BST elements in sorted ascending sequence.",
        difficulty: "EASY",
        sourceReference: "Tree Traversals"
      },
      {
        questionText: "What is the worst-case search time complexity in an unbalanced Binary Search Tree of N nodes?",
        optionA: "O(1)",
        optionB: "O(log N)",
        optionC: "O(N)",
        optionD: "O(N log N)",
        correctAnswer: "C",
        explanation: "When keys are inserted in sorted or reverse-sorted order, an unbalanced BST degenerates into a linear linked list with O(N) search depth.",
        difficulty: "MEDIUM",
        sourceReference: "Tree Degeneration"
      },
      {
        questionText: "What condition defines an AVL self-balancing binary search tree?",
        optionA: "The number of nodes in the left subtree equals the number of nodes in the right subtree.",
        optionB: "For every node, the absolute difference between the heights of its left and right subtrees is at most 1.",
        optionC: "All leaves must reside on the exact same level.",
        optionD: "Every internal node must be colored red or black.",
        correctAnswer: "B",
        explanation: "The AVL balance factor is defined as height(left) - height(right), and must remain in {-1, 0, 1} for every node through tree rotations.",
        difficulty: "MEDIUM",
        sourceReference: "Self-Balancing Trees"
      },
      {
        questionText: "What is the maximum number of nodes in a binary tree of height H (where height of a single root node is 1)?",
        optionA: "2^(H - 1)",
        optionB: "2^H - 1",
        optionC: "H^2",
        optionD: "2 * H",
        correctAnswer: "B",
        explanation: "A full binary tree of height H has sum_{i=0}^{H-1} 2^i = 2^H - 1 nodes.",
        difficulty: "EASY",
        sourceReference: "Tree Properties"
      }
    ]
  },

  "graphs": {
    videos: [
      {
        title: "Graph Algorithms: BFS, DFS, Dijkstra & Topological Sort",
        youtubeUrl: "https://www.youtube.com/watch?v=vf-c505G0n0",
        duration: "32 min",
        channel: "Abdul Bari",
        description: "Adjacency matrix vs adjacency list, graph traversals, shortest path, and topological sort for DAGs.",
        learningObjective: "Master graph representations, BFS shortest path on unweighted graphs, and Dijkstra priority queue implementation."
      }
    ],
    questions: [
      {
        questionText: "What is the time complexity of Breadth-First Search (BFS) and Depth-First Search (DFS) on a graph with V vertices and E edges represented as an adjacency list?",
        optionA: "O(V * E)",
        optionB: "O(V + E)",
        optionC: "O(V^2)",
        optionD: "O(E * log V)",
        correctAnswer: "B",
        explanation: "Each vertex is visited once and each edge is examined once (or twice for undirected graphs), resulting in O(V + E) time.",
        difficulty: "EASY",
        sourceReference: "Graph Traversal Complexity"
      },
      {
        questionText: "Under what condition does Breadth-First Search (BFS) guarantee finding the shortest path between two vertices?",
        optionA: "Only when the graph has no cycles.",
        optionB: "When all edges have uniform (equal) weight (or unweighted).",
        optionC: "When edge weights can be arbitrary negative numbers.",
        optionD: "Only on directed acyclic graphs.",
        correctAnswer: "B",
        explanation: "BFS explores vertices in order of increasing edge distance, guaranteeing the shortest path when all edge weights are uniform.",
        difficulty: "MEDIUM",
        sourceReference: "BFS Shortest Path"
      },
      {
        questionText: "Why does Dijkstra's algorithm fail on graphs with negative edge weights?",
        optionA: "Because priority queues cannot store negative integers.",
        optionB: "Because Dijkstra greedily assumes that once a vertex is settled, its shortest distance cannot be reduced further by longer paths with negative edges.",
        optionC: "Because negative edges cause an immediate segmentation fault.",
        optionD: "Because negative weights turn the graph into a tree.",
        correctAnswer: "B",
        explanation: "Dijkstra relies on greedy monotonic distance growth. A negative edge can make a longer route shorter later, violating the greedy invariant.",
        difficulty: "MEDIUM",
        sourceReference: "Dijkstra Invariants"
      },
      {
        questionText: "What type of graph is required for Topological Sorting to exist?",
        optionA: "Any undirected graph.",
        optionB: "A Directed Acyclic Graph (DAG).",
        optionC: "A bipartite complete graph.",
        optionD: "A graph containing at least one Hamiltonian cycle.",
        correctAnswer: "B",
        explanation: "Topological sorting orders vertices such that for every directed edge u -> v, u comes before v. Cycles make this ordering impossible.",
        difficulty: "EASY",
        sourceReference: "Topological Ordering"
      },
      {
        questionText: "Which algorithm finds the Minimum Spanning Tree of a connected weighted graph by greedily adding edges in increasing order of weight?",
        optionA: "Bellman-Ford Algorithm",
        optionB: "Kruskal's Algorithm (with Disjoint Set Union)",
        optionC: "Floyd-Warshall Algorithm",
        optionD: "Kosaraju's Algorithm",
        correctAnswer: "B",
        explanation: "Kruskal's algorithm sorts all edges and uses Disjoint Set Union (DSU / Union-Find) to greedily add edges without creating cycles.",
        difficulty: "MEDIUM",
        sourceReference: "Minimum Spanning Trees"
      }
    ]
  },

  "dynamic-programming": {
    videos: [
      {
        title: "Dynamic Programming: Memoization, Tabulation & Knapsack",
        youtubeUrl: "https://www.youtube.com/watch?v=5dRgrUN486Y",
        duration: "35 min",
        channel: "Abdul Bari",
        description: "Optimal substructure, overlapping subproblems, top-down memoization, bottom-up tabulation, and 0/1 Knapsack.",
        learningObjective: "Formulate DP state definitions, base cases, state transitions, and space-optimization techniques."
      }
    ],
    questions: [
      {
        questionText: "What two properties must a problem exhibit for Dynamic Programming to be an applicable solution technique?",
        optionA: "Greedy choice property and polynomial complexity.",
        optionB: "Overlapping subproblems and optimal substructure.",
        optionC: "Divide-and-conquer independence and base-case convergence.",
        optionD: "Linear ordering and unique paths.",
        correctAnswer: "B",
        explanation: "DP requires optimal substructure (optimal solution composed of optimal subproblem solutions) and overlapping subproblems (same subproblems solved multiple times).",
        difficulty: "EASY",
        sourceReference: "DP Foundations"
      },
      {
        questionText: "What is the key difference between Memoization and Tabulation in Dynamic Programming?",
        optionA: "Memoization is bottom-up iterative, while Tabulation is top-down recursive.",
        optionB: "Memoization is top-down recursive with caching, while Tabulation is bottom-up iterative filling a table.",
        optionC: "Memoization uses O(1) space, while Tabulation requires exponential memory.",
        optionD: "Tabulation cannot be applied to multidimensional problems.",
        correctAnswer: "B",
        explanation: "Top-down memoization recursively solves subproblems on-demand and caches results; bottom-up tabulation iteratively builds results from base cases up.",
        difficulty: "EASY",
        sourceReference: "Memoization vs Tabulation"
      },
      {
        questionText: "What is the time complexity of the classic 0/1 Knapsack problem with N items and maximum weight capacity W using standard dynamic programming?",
        optionA: "O(N * W)",
        optionB: "O(2^N)",
        optionC: "O(N log W)",
        optionD: "O(N + W)",
        correctAnswer: "A",
        explanation: "The DP table has dimensions (N+1) x (W+1), and each cell is computed in O(1) time, yielding pseudo-polynomial O(N * W) complexity.",
        difficulty: "MEDIUM",
        sourceReference: "Knapsack DP"
      },
      {
        questionText: "In the Longest Common Subsequence (LCS) problem of two strings of length M and N, what is the state transition when character s1[i-1] == s2[j-1]?",
        optionA: "dp[i][j] = dp[i-1][j-1] + 1",
        optionB: "dp[i][j] = max(dp[i-1][j], dp[i][j-1])",
        optionC: "dp[i][j] = dp[i-1][j] + dp[i][j-1]",
        optionD: "dp[i][j] = 0",
        correctAnswer: "A",
        explanation: "When current characters match, they extend the longest common subsequence of the prefixes by 1: dp[i][j] = dp[i-1][j-1] + 1.",
        difficulty: "MEDIUM",
        sourceReference: "LCS Recurrence"
      },
      {
        questionText: "How can the space complexity of computing the N-th Fibonacci number be reduced from O(N) to O(1)?",
        optionA: "By using tail-call compiler optimization.",
        optionB: "By keeping only the two most recent values (prev1 and prev2) rather than the entire array.",
        optionC: "By using a hash map with 2 entries.",
        optionD: "By executing the recursive calls on separate threads.",
        correctAnswer: "B",
        explanation: "Since fib(N) only depends on fib(N-1) and fib(N-2), maintaining two scalar variables reduces space complexity to O(1).",
        difficulty: "EASY",
        sourceReference: "State Space Optimization"
      }
    ]
  },

  // =========================================================================
  // 2. DATA ANALYTICS
  // =========================================================================
  "python-basics": {
    videos: [
      {
        title: "Python for Data Analytics: Fundamentals & Syntax",
        youtubeUrl: "https://www.youtube.com/watch?v=kqtD5dpn9C8",
        duration: "25 min",
        channel: "Programming with Mosh",
        description: "Variables, list comprehensions, slicing, functions, and lambda expressions for data processing.",
        learningObjective: "Master Python syntax, list slicing, dictionary mappings, and data filtering idioms."
      }
    ],
    questions: [
      {
        questionText: "What does list comprehension `[x**2 for x in range(10) if x % 2 == 0]` evaluate to?",
        optionA: "[0, 1, 4, 9, 16, 25, 36, 49, 64, 81]",
        optionB: "[0, 4, 16, 36, 64]",
        optionC: "[4, 16, 36, 64, 100]",
        optionD: "[0, 2, 4, 6, 8]",
        correctAnswer: "B",
        explanation: "It filters even numbers in 0..9 (0, 2, 4, 6, 8) and computes their squares: 0^2=0, 2^2=4, 4^2=16, 6^2=36, 8^2=64.",
        difficulty: "EASY",
        sourceReference: "List Comprehensions"
      },
      {
        questionText: "In Python, which of the following data structures is immutable?",
        optionA: "list",
        optionB: "dict",
        optionC: "tuple",
        optionD: "set",
        correctAnswer: "C",
        explanation: "Tuples are immutable sequences in Python; their elements cannot be modified, appended, or deleted after creation.",
        difficulty: "EASY",
        sourceReference: "Python Primitive Types"
      },
      {
        questionText: "What is the time complexity of searching for a key in a Python dictionary on average?",
        optionA: "O(1)",
        optionB: "O(log N)",
        optionC: "O(N)",
        optionD: "O(N log N)",
        correctAnswer: "A",
        explanation: "Python dictionaries are implemented as hash tables with open addressing, providing average O(1) key lookups.",
        difficulty: "EASY",
        sourceReference: "Python Dictionary Internals"
      },
      {
        questionText: "What does the Python `zip()` function do when given two lists `[1, 2]` and `['a', 'b']`?",
        optionA: "Concatenates them into a single list `[1, 2, 'a', 'b']`.",
        optionB: "Produces an iterator of tuples: `[(1, 'a'), (2, 'b')]`.",
        optionC: "Multiplies their corresponding elements.",
        optionD: "Returns a dictionary where elements of the first list are keys and all values are empty.",
        correctAnswer: "B",
        explanation: "zip() aggregates elements from each of the iterables into pairwise tuples.",
        difficulty: "EASY",
        sourceReference: "Python Built-in Iterators"
      },
      {
        questionText: "What keyword is used to write a generator function that produces a sequence of values lazily over time?",
        optionA: "return",
        optionB: "yield",
        optionC: "emit",
        optionD: "async",
        correctAnswer: "B",
        explanation: "The `yield` statement pauses function execution and saves its state, returning a generator object that produces values on demand.",
        difficulty: "MEDIUM",
        sourceReference: "Generators & Iterators"
      }
    ]
  },

  "numpy": {
    videos: [
      {
        title: "NumPy Full Course: Multi-dimensional Array Computing",
        youtubeUrl: "https://www.youtube.com/watch?v=QUT1VHiLmmI",
        duration: "26 min",
        channel: "freeCodeCamp.org",
        description: "Vectorization, array broadcasting, indexing, linear algebra, and memory contiguous storage.",
        learningObjective: "Master ndarray creation, multidimensional broadcasting rules, and vectorized math operations."
      }
    ],
    questions: [
      {
        questionText: "Why are NumPy ndarray operations significantly faster than standard Python list loops for numerical computing?",
        optionA: "NumPy arrays run in browser WebAssembly.",
        optionB: "NumPy arrays are stored as contiguous C memory buffers and execute pre-compiled C vector math without Python interpreter overhead.",
        optionC: "NumPy arrays automatically run on cloud servers.",
        optionD: "NumPy transforms all numbers into string representations.",
        correctAnswer: "B",
        explanation: "NumPy arrays store elements contiguously in homogeneous memory buffers, enabling SIMD vectorization and cache locality in C without Python boxing.",
        difficulty: "EASY",
        sourceReference: "NumPy Vectorization Architecture"
      },
      {
        questionText: "What are the rules of NumPy array broadcasting when operating on arrays of shapes (3, 1) and (1, 4)?",
        optionA: "An error is thrown because dimensions must match exactly.",
        optionB: "The arrays are broadcasted to a resulting shape of (3, 4).",
        optionC: "The arrays are flattened into a 1D vector of shape (7,).",
        optionD: "Only the diagonal elements are computed.",
        correctAnswer: "B",
        explanation: "Trailing dimensions match or equal 1. Dimensions of size 1 are stretched to match the larger dimension: (3, 1) and (1, 4) produce (3, 4).",
        difficulty: "MEDIUM",
        sourceReference: "NumPy Broadcasting Rules"
      },
      {
        questionText: "Which NumPy function is used to calculate the dot product of two matrices?",
        optionA: "np.multiply(A, B)",
        optionB: "np.dot(A, B) or A @ B",
        optionC: "np.cross(A, B)",
        optionD: "np.sum(A, B)",
        correctAnswer: "B",
        explanation: "`np.dot(A, B)` or the `@` operator performs true linear algebra matrix multiplication, whereas `np.multiply` performs element-wise multiplication.",
        difficulty: "EASY",
        sourceReference: "NumPy Linear Algebra"
      },
      {
        questionText: "What does `arr[arr > 5]` accomplish in NumPy?",
        optionA: "Changes all elements greater than 5 to 0.",
        optionB: "Boolean indexing: extracts all elements from `arr` that are strictly greater than 5 into a 1D array.",
        optionC: "Throws a TypeError because booleans cannot index an array.",
        optionD: "Finds the first index where value is 5.",
        correctAnswer: "B",
        explanation: "Boolean indexing creates a boolean mask `arr > 5` and returns only the elements where the mask evaluates to True.",
        difficulty: "EASY",
        sourceReference: "Boolean Masking"
      },
      {
        questionText: "What is the effect of `arr.reshape(-1, 1)` on a 1D array with 10 elements?",
        optionA: "It reverses the array in-place.",
        optionB: "It reshapes the array into a 2D column vector of shape (10, 1).",
        optionC: "It creates a square matrix of size 10x10.",
        optionD: "It deletes the first and last elements.",
        correctAnswer: "B",
        explanation: "The -1 dimension is inferred automatically: 10 elements reshaped with 1 column yields shape (10, 1).",
        difficulty: "MEDIUM",
        sourceReference: "Array Reshaping"
      }
    ]
  },

  "sql-analytics": {
    videos: [
      {
        title: "SQL for Data Analytics: Window Functions & Aggregations",
        youtubeUrl: "https://www.youtube.com/watch?v=7mz73uXD9DA",
        duration: "24 min",
        channel: "Alex The Analyst",
        description: "Writing complex analytical queries, CTEs, window functions (ROW_NUMBER, RANK, DENSE_RANK), and cohort analysis.",
        learningObjective: "Master analytical SQL queries, partition by clauses, aggregate metrics, and CTE modularization."
      }
    ],
    questions: [
      {
        questionText: "What is the difference between RANK() and DENSE_RANK() in SQL window functions when duplicate values occur?",
        optionA: "RANK() leaves gaps in the rank numbering sequence after duplicates, while DENSE_RANK() does not leave gaps.",
        optionB: "DENSE_RANK() only works on integer primary keys.",
        optionC: "RANK() assigns alphabetical strings, while DENSE_RANK() assigns floats.",
        optionD: "There is no difference.",
        correctAnswer: "A",
        explanation: "If two rows tie for rank 1, RANK() assigns 1, 1, 3 (leaving gap 2), whereas DENSE_RANK() assigns 1, 1, 2 without gaps.",
        difficulty: "MEDIUM",
        sourceReference: "SQL Window Functions"
      },
      {
        questionText: "What is the purpose of the `OVER (PARTITION BY department ORDER BY salary DESC)` clause?",
        optionA: "It filters out departments with duplicate salaries.",
        optionB: "It computes window calculations independently within each department slice, ordered by descending salary.",
        optionC: "It drops the table partition from disk.",
        optionD: "It creates a physical index on department and salary.",
        correctAnswer: "B",
        explanation: "PARTITION BY divides rows into logical groups, and ORDER BY orders rows within each partition before evaluating the window function.",
        difficulty: "MEDIUM",
        sourceReference: "Window Partitioning"
      },
      {
        questionText: "Which SQL clause is used to filter records AFTER an aggregation with GROUP BY has been computed?",
        optionA: "WHERE",
        optionB: "HAVING",
        optionC: "QUALIFY",
        optionD: "FILTER",
        correctAnswer: "B",
        explanation: "WHERE filters rows before aggregation, while HAVING filters aggregated group results after GROUP BY.",
        difficulty: "EASY",
        sourceReference: "SQL Query Execution Order"
      },
      {
        questionText: "What is a Common Table Expression (CTE) defined with the `WITH` keyword in SQL?",
        optionA: "A permanent disk table that persists across database restarts.",
        optionB: "A temporary named result set that exists only within the scope of a single query execution.",
        optionC: "A stored procedure that encrypts database columns.",
        optionD: "An uncommitted database transaction.",
        correctAnswer: "B",
        explanation: "CTEs provide readable, modular, temporary result sets scoped to the execution of a SELECT, INSERT, UPDATE, or DELETE statement.",
        difficulty: "EASY",
        sourceReference: "Common Table Expressions"
      },
      {
        questionText: "What is the chronological order of execution for a SQL SELECT query?",
        optionA: "SELECT -> FROM -> WHERE -> GROUP BY -> HAVING -> ORDER BY",
        optionB: "FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY -> LIMIT",
        optionC: "WHERE -> FROM -> SELECT -> GROUP BY -> ORDER BY",
        optionD: "ORDER BY -> LIMIT -> FROM -> SELECT",
        correctAnswer: "B",
        explanation: "The query engine resolves FROM/JOIN first, filters with WHERE, groups with GROUP BY, checks HAVING, projects SELECT columns, orders with ORDER BY, and limits results.",
        difficulty: "HARD",
        sourceReference: "SQL Query Lifecycle"
      }
    ]
  },

  "statistics": {
    videos: [
      {
        title: "Statistics & Probability for Data Analytics",
        youtubeUrl: "https://www.youtube.com/watch?v=pYxNSUDSFH4",
        duration: "25 min",
        channel: "StatQuest with Josh Starmer",
        description: "Distributions, Central Limit Theorem, hypothesis testing, p-values, and confidence intervals.",
        learningObjective: "Understand statistical hypothesis testing, standard deviation, normal distributions, and p-value significance."
      }
    ],
    questions: [
      {
        questionText: "What does the Central Limit Theorem (CLT) state regarding sample means?",
        optionA: "All individual data points in any population follow a normal distribution.",
        optionB: "The distribution of sample means approaches a normal distribution as sample size N increases, regardless of the underlying population distribution shape.",
        optionC: "The median always equals the mean for non-zero datasets.",
        optionD: "Sample variance is always zero when N > 30.",
        correctAnswer: "B",
        explanation: "The CLT establishes that given a sufficiently large sample size, sample means will be normally distributed regardless of whether the population distribution is skewed.",
        difficulty: "MEDIUM",
        sourceReference: "Central Limit Theorem"
      },
      {
        questionText: "In statistical hypothesis testing, what does a p-value represent?",
        optionA: "The probability that the alternative hypothesis is false.",
        optionB: "The probability of observing data at least as extreme as the observed results, assuming the null hypothesis is true.",
        optionC: "The percentage error in data collection.",
        optionD: "The exact standard deviation of the sample.",
        correctAnswer: "B",
        explanation: "The p-value measures the probability of obtaining test results at least as extreme as the observed data under the assumption that the null hypothesis (H0) is correct.",
        difficulty: "MEDIUM",
        sourceReference: "Hypothesis Testing"
      },
      {
        questionText: "What is a Type I error in statistical hypothesis testing?",
        optionA: "Rejecting a true null hypothesis (False Positive).",
        optionB: "Failing to reject a false null hypothesis (False Negative).",
        optionC: "Dividing by zero in a t-test calculation.",
        optionD: "Collecting too many data observations.",
        correctAnswer: "A",
        explanation: "Type I error occurs when the null hypothesis is actually true, but is incorrectly rejected (commonly denoted by significance level alpha).",
        difficulty: "EASY",
        sourceReference: "Hypothesis Errors"
      },
      {
        questionText: "Which metric of central tendency is least sensitive to extreme outliers in a skewed dataset?",
        optionA: "Mean",
        optionB: "Median",
        optionC: "Standard Deviation",
        optionD: "Variance",
        correctAnswer: "B",
        explanation: "The median is the 50th percentile rank value, so extreme values in the tails do not shift its position, unlike the arithmetic mean.",
        difficulty: "EASY",
        sourceReference: "Descriptive Statistics"
      },
      {
        questionText: "What does a Pearson correlation coefficient of r = -0.85 indicate between two continuous variables?",
        optionA: "No linear relationship.",
        optionB: "A strong negative linear relationship.",
        optionC: "A weak positive correlation.",
        optionD: "Direct causality between the two variables.",
        correctAnswer: "B",
        explanation: "A Pearson r near -1 denotes a strong negative linear association where as one variable increases, the other systematically decreases.",
        difficulty: "EASY",
        sourceReference: "Correlation & Covariance"
      }
    ]
  },

  "data-visualization": {
    videos: [
      {
        title: "Data Visualization with Matplotlib & Seaborn",
        youtubeUrl: "https://www.youtube.com/watch?v=3Xc3CA655Y4",
        duration: "23 min",
        channel: "freeCodeCamp.org",
        description: "Visual encoding, plot types (scatter, bar, histograms, boxplots, heatmaps), and effective design.",
        learningObjective: "Select appropriate visualization types for categorical, continuous, and multi-variable analytical data."
      }
    ],
    questions: [
      {
        questionText: "Which chart type is best suited for visualizing the distribution, median, quartiles, and outliers of a numerical feature across categories?",
        optionA: "Pie chart",
        optionB: "Box plot (Box-and-Whisker)",
        optionC: "Donut chart",
        optionD: "Line chart",
        correctAnswer: "B",
        explanation: "Box plots visualize the 5-number summary (min, Q1, median, Q3, max) alongside Interquartile Range (IQR) outliers across discrete categories.",
        difficulty: "EASY",
        sourceReference: "Data Visualizations"
      },
      {
        questionText: "What is the primary visual purpose of a Heatmap in Exploratory Data Analysis?",
        optionA: "To show geographical routing paths.",
        optionB: "To visualize two-dimensional correlation matrices or categorical cross-tabulations using color intensity.",
        optionC: "To display 3D polygon wireframes.",
        optionD: "To plot high-frequency sound wave amplitudes.",
        correctAnswer: "B",
        explanation: "Heatmaps encode numerical matrix values (such as feature correlation coefficients) using color palettes to rapidly identify clusters and relationships.",
        difficulty: "EASY",
        sourceReference: "Correlation Visualization"
      },
      {
        questionText: "Why are 3D pie charts generally discouraged in professional data analytics?",
        optionA: "They require GPUs to render.",
        optionB: "The 3D perspective distorts segment angles and areas, making accurate visual comparison of proportions difficult.",
        optionC: "They only support two slices.",
        optionD: "They can only be exported as vector graphics.",
        correctAnswer: "B",
        explanation: "Perspective distortion in 3D plots alters relative slice sizes, impairing cognitive perception and misleading viewers regarding true proportions.",
        difficulty: "EASY",
        sourceReference: "Visual Perception Principles"
      },
      {
        questionText: "Which Seaborn function automatically plots pairwise bivariate distributions and univariate histograms across all numeric columns of a DataFrame?",
        optionA: "sns.pairplot()",
        optionB: "sns.catplot()",
        optionC: "sns.relplot()",
        optionD: "sns.jointplot()",
        correctAnswer: "A",
        explanation: "`sns.pairplot(df)` generates a grid of scatter plots for all pairwise numeric combinations and univariate distributions along the diagonal.",
        difficulty: "MEDIUM",
        sourceReference: "Seaborn Library"
      },
      {
        questionText: "In time-series data analysis, what plot type is ideal for displaying continuous trends over chronological dates?",
        optionA: "Bar chart",
        optionB: "Line chart",
        optionC: "Radar chart",
        optionD: "Scatter plot matrix",
        correctAnswer: "B",
        explanation: "Line charts connect chronological points with continuous segments, highlighting seasonal fluctuations, upward/downward trends, and momentum.",
        difficulty: "EASY",
        sourceReference: "Time Series Visualization"
      }
    ]
  },

  "eda": {
    videos: [
      {
        title: "Exploratory Data Analysis (EDA) Practical Walkthrough",
        youtubeUrl: "https://www.youtube.com/watch?v=QWggLg64vF4",
        duration: "26 min",
        channel: "Ken Jee",
        description: "Systematic EDA workflow: understanding shapes, missingness, distributions, correlations, and feature anomalies.",
        learningObjective: "Execute end-to-end exploratory analysis on raw datasets to uncover patterns, anomalies, and feature hypotheses."
      }
    ],
    questions: [
      {
        questionText: "What is the primary objective of Exploratory Data Analysis (EDA)?",
        optionA: "To deploy models straight into production without validation.",
        optionB: "To understand data distributions, uncover underlying structures, identify anomalies, test assumptions, and formulate hypotheses.",
        optionC: "To format source code using automated linters.",
        optionD: "To compress dataset files into zip archives.",
        correctAnswer: "B",
        explanation: "EDA, pioneered by John Tukey, focuses on maximizing insight into a dataset's structure, distributions, missingness, and relationships before formal modeling.",
        difficulty: "EASY",
        sourceReference: "EDA Foundations"
      },
      {
        questionText: "If a numerical variable has a long right tail with mean significantly greater than median, what is its distribution shape?",
        optionA: "Symmetric normal distribution",
        optionB: "Right-skewed (positively skewed) distribution",
        optionC: "Left-skewed (negatively skewed) distribution",
        optionD: "Uniform distribution",
        correctAnswer: "B",
        explanation: "In a right-skewed distribution, extreme high values in the right tail pull the arithmetic mean above the median.",
        difficulty: "MEDIUM",
        sourceReference: "Distribution Skewness"
      },
      {
        questionText: "How does the Interquartile Range (IQR) method define an extreme outlier?",
        optionA: "Values less than Q1 - 1.5*IQR or greater than Q3 + 1.5*IQR.",
        optionB: "Values that are negative integers.",
        optionC: "Values with more than 4 decimal places.",
        optionD: "Values within 1 standard deviation of the mean.",
        correctAnswer: "A",
        explanation: "Tukey's fences define outliers as data points situated outside [Q1 - 1.5*IQR, Q3 + 1.5*IQR].",
        difficulty: "EASY",
        sourceReference: "Outlier Detection"
      },
      {
        questionText: "What danger does high multicollinearity (correlation > 0.9 between independent variables) introduce in regression analysis?",
        optionA: "It inflates standard errors of coefficient estimates, making it difficult to determine the individual effect of each predictor.",
        optionB: "It guarantees that the R-squared value will be negative.",
        optionC: "It causes database indexes to corrupt.",
        optionD: "It eliminates all missing values automatically.",
        correctAnswer: "A",
        explanation: "Multicollinearity destabilizes coefficient estimation in linear models, causing high variance and unreliable p-values for individual predictors.",
        difficulty: "HARD",
        sourceReference: "Multicollinearity"
      },
      {
        questionText: "Which method is commonly used to quantify the extent of multicollinearity among predictor variables?",
        optionA: "Variance Inflation Factor (VIF)",
        optionB: "Confusion Matrix",
        optionC: "ROC AUC Score",
        optionD: "Silhouette Score",
        correctAnswer: "A",
        explanation: "VIF measures how much the variance of an estimated regression coefficient increases when predictors are correlated; VIF > 5 or 10 indicates high multicollinearity.",
        difficulty: "MEDIUM",
        sourceReference: "Variance Inflation Factor"
      }
    ]
  },

  "data-analytics-projects": {
    videos: [
      {
        title: "Building an End-to-End Data Analytics Portfolio Project",
        youtubeUrl: "https://www.youtube.com/watch?v=q6gSC16yQ6I",
        duration: "28 min",
        channel: "Luke Barousse",
        description: "Structuring a real-world analytics project: problem framing, data acquisition, ETL, analysis, and executive dashboarding.",
        learningObjective: "Synthesize data extraction, transformation, statistical analysis, and interactive dashboard delivery."
      }
    ],
    questions: [
      {
        questionText: "What is the critical first stage of any successful engineering analytics capstone project?",
        optionA: "Writing complex machine learning pipelines immediately.",
        optionB: "Clearly defining the business or research problem, target metrics, and scope.",
        optionC: "Purchasing proprietary database licenses.",
        optionD: "Generating synthetic labels without ground truth.",
        correctAnswer: "B",
        explanation: "Without clear business problem definition, success criteria, and measurable KPI metrics, analytical efforts often fail to deliver actionable value.",
        difficulty: "EASY",
        sourceReference: "Analytics Lifecycle"
      },
      {
        questionText: "What is an ETL pipeline in data engineering and analytics?",
        optionA: "Execute, Test, Log",
        optionB: "Extract (from sources), Transform (clean & aggregate), and Load (into data warehouse/mart)",
        optionC: "Evaluate, Track, Learn",
        optionD: "Encryption, Transmission, Latency",
        correctAnswer: "B",
        explanation: "ETL stands for Extracting raw data from operational systems, Transforming it according to analytics schema rules, and Loading it into analytical stores.",
        difficulty: "EASY",
        sourceReference: "ETL Pipelines"
      },
      {
        questionText: "What is the primary purpose of creating an Executive Summary Dashboard in an analytics project?",
        optionA: "To display raw unformatted CSV tables with millions of rows.",
        optionB: "To present high-level KPIs, trends, and actionable insights concisely for decision-makers.",
        optionC: "To test server network throughput.",
        optionD: "To replace database backups.",
        correctAnswer: "B",
        explanation: "Executive dashboards distill complex multidimensional analytics into clear visualizations, critical KPIs, and actionable takeaways for non-technical stakeholders.",
        difficulty: "EASY",
        sourceReference: "Executive Reporting"
      },
      {
        questionText: "Why is reproducibility essential in data analytics workflows?",
        optionA: "It enables peers and auditors to re-run the code on updated data and obtain consistent, verifiable results.",
        optionB: "It reduces cloud storage costs to zero.",
        optionC: "It avoids having to write unit tests.",
        optionD: "It allows bypassing data security regulations.",
        correctAnswer: "A",
        explanation: "Reproducibility ensures analytical findings can be verified independently, automated in scheduled pipelines, and maintained over time.",
        difficulty: "EASY",
        sourceReference: "Reproducible Research"
      },
      {
        questionText: "In project documentation, what does a Data Dictionary provide?",
        optionA: "A glossary of general English terminology.",
        optionB: "Detailed definitions of all dataset tables, column names, data types, allowed values, and business metric formulas.",
        optionC: "A backup of all SQL passwords.",
        optionD: "A list of operating system commands.",
        correctAnswer: "B",
        explanation: "A data dictionary documents metadata: column definitions, units of measurement, valid value ranges, and calculations, ensuring alignment across analysts.",
        difficulty: "EASY",
        sourceReference: "Data Governance & Metadata"
      }
    ]
  },

  // =========================================================================
  // 3. WEB DEVELOPMENT
  // =========================================================================
  "html": {
    videos: [
      {
        title: "HTML5 Crash Course: Semantic Markup & Modern Web APIs",
        youtubeUrl: "https://www.youtube.com/watch?v=UB1O30fR-EE",
        duration: "21 min",
        channel: "Traversy Media",
        description: "Semantic elements, accessibility (ARIA), document structure, forms, and SEO best practices.",
        learningObjective: "Write accessible, semantic HTML5 markup with correct hierarchy, meta configurations, and forms."
      }
    ],
    questions: [
      {
        questionText: "What is the purpose of semantic HTML elements such as `<header>`, `<nav>`, `<article>`, and `<aside>`?",
        optionA: "They allow executing JavaScript without a `<script>` tag.",
        optionB: "They convey structural meaning to search engines and assistive screen readers rather than just generic visual styling.",
        optionC: "They automatically apply responsive CSS grid styling without external stylesheets.",
        optionD: "They prevent SQL injection vulnerabilities in web servers.",
        correctAnswer: "B",
        explanation: "Semantic elements clearly describe their meaning to both the browser and assistive technologies, improving accessibility and SEO.",
        difficulty: "EASY",
        sourceReference: "HTML5 Semantic Standards"
      },
      {
        questionText: "What does the `<meta name='viewport' content='width=device-width, initial-scale=1.0'>` tag do?",
        optionA: "Sets the maximum resolution of images rendered on the page.",
        optionB: "Instructs the browser to render the page width to the screen width of the device and sets initial zoom level.",
        optionC: "Loads modern font icons from a remote CDN.",
        optionD: "Forces the browser into dark mode.",
        correctAnswer: "B",
        explanation: "The viewport meta tag configures mobile browsers to match viewport width with physical device width, preventing mobile zoom shrinking.",
        difficulty: "EASY",
        sourceReference: "Mobile Responsive Layouts"
      },
      {
        questionText: "Which attribute should always be included on an `<img>` tag to ensure web accessibility and fallback display?",
        optionA: "title",
        optionB: "alt",
        optionC: "aria-hidden",
        optionD: "caption",
        correctAnswer: "B",
        explanation: "The `alt` attribute provides alternative text for screen readers and displays when the image cannot be loaded.",
        difficulty: "EASY",
        sourceReference: "Accessibility Guidelines (WCAG)"
      },
      {
        questionText: "Which HTML5 input type provides built-in email validation and mobile keyboard optimization?",
        optionA: "`<input type='text' validate='email'>`",
        optionB: "`<input type='email'>`",
        optionC: "`<input type='mail'>`",
        optionD: "`<input type='string'>`",
        correctAnswer: "B",
        explanation: "`<input type='email'>` automatically enforces RFC email format validation in browser forms and triggers email-friendly mobile keyboards.",
        difficulty: "EASY",
        sourceReference: "HTML5 Form Controls"
      },
      {
        questionText: "What does the `async` attribute do when placed on a `<script>` tag?",
        optionA: "It halts HTML parsing until the script finishes executing.",
        optionB: "It downloads the script in parallel with HTML parsing and executes it immediately as soon as it is downloaded.",
        optionC: "It defers script execution until the entire DOM is parsed.",
        optionD: "It runs the script inside a background Web Worker thread.",
        correctAnswer: "B",
        explanation: "`async` fetches the script asynchronously in parallel with HTML parsing and executes it the moment download completes (which may interrupt parsing).",
        difficulty: "MEDIUM",
        sourceReference: "Script Loading & Critical Path"
      }
    ]
  },

  "css": {
    videos: [
      {
        title: "CSS & Modern Responsive Layouts: Flexbox & CSS Grid",
        youtubeUrl: "https://www.youtube.com/watch?v=1Rs2ND1ryYc",
        duration: "25 min",
        channel: "Kevin Powell",
        description: "The CSS box model, Flexbox 1D alignment, CSS Grid 2D layout systems, and media queries.",
        learningObjective: "Build fluid, responsive interfaces using modern Flexbox, Grid, and CSS variable architectures."
      }
    ],
    questions: [
      {
        questionText: "In the CSS Box Model, what components make up the total calculated width of an element with `box-sizing: border-box`?",
        optionA: "Content width only.",
        optionB: "Content + Padding + Border (padding and border are absorbed inside the specified width).",
        optionC: "Content + Margin only.",
        optionD: "Padding + Margin only.",
        correctAnswer: "B",
        explanation: "`box-sizing: border-box` includes padding and border within the element's total declared width and height, preventing overflow.",
        difficulty: "EASY",
        sourceReference: "CSS Box Model"
      },
      {
        questionText: "What is the primary difference between CSS Flexbox and CSS Grid?",
        optionA: "Flexbox is for 3D animations, while Grid is for typography.",
        optionB: "Flexbox is primarily designed for one-dimensional layouts (a row OR a column), whereas CSS Grid is designed for two-dimensional layouts (rows AND columns simultaneously).",
        optionC: "Flexbox works only in Chromium browsers.",
        optionD: "Grid does not support gap properties.",
        correctAnswer: "B",
        explanation: "Flexbox manages 1D layout flow along the main or cross axis; CSS Grid provides explicit 2D row-and-column placement.",
        difficulty: "EASY",
        sourceReference: "Layout Paradigms"
      },
      {
        questionText: "Which CSS selector has the highest specificity score?",
        optionA: "Element selector (e.g. `div`)",
        optionB: "Class selector (e.g. `.card`)",
        optionC: "ID selector (e.g. `#main-header`)",
        optionD: "Universal selector (`*`)",
        correctAnswer: "C",
        explanation: "Specificity weighting: Inline styles (1000) > ID (0100) > Class/Attribute/Pseudo-class (0010) > Element/Pseudo-element (0001) > Universal (0000).",
        difficulty: "EASY",
        sourceReference: "CSS Specificity Calculation"
      },
      {
        questionText: "How do you center an element both horizontally and vertically inside a container using Flexbox?",
        optionA: "`display: flex; justify-content: center; align-items: center;`",
        optionB: "`display: block; margin: auto;`",
        optionC: "`float: center; position: absolute;`",
        optionD: "`display: inline; text-align: center;`",
        correctAnswer: "A",
        explanation: "`justify-content: center` aligns items along the main axis, and `align-items: center` aligns along the cross axis.",
        difficulty: "EASY",
        sourceReference: "Flexbox Alignment"
      },
      {
        questionText: "What CSS property creates a new Stacking Context for z-index layering?",
        optionA: "`color: red;`",
        optionB: "Positioned elements (`relative`, `absolute`, `fixed`) with a non-auto `z-index`, or `opacity < 1`.",
        optionC: "`font-size: 16px;`",
        optionD: "`margin: 0px;`",
        correctAnswer: "B",
        explanation: "A stacking context is formed by elements with position != static and z-index != auto, opacity < 1, transform != none, or will-change properties.",
        difficulty: "HARD",
        sourceReference: "CSS Stacking Context"
      }
    ]
  },

  "javascript": {
    videos: [
      {
        title: "JavaScript Core: Closures, Event Loop & Promises",
        youtubeUrl: "https://www.youtube.com/watch?v=jS4aFq5-91M",
        duration: "27 min",
        channel: "freeCodeCamp.org",
        description: "Execution context, call stack, closures, prototypal inheritance, and asynchronous promises.",
        learningObjective: "Master scope chains, closure memory encapsulation, microtask event loops, and async/await."
      }
    ],
    questions: [
      {
        questionText: "What is a Closure in JavaScript?",
        optionA: "A method that terminates a worker process.",
        optionB: "The combination of a function bundled together with references to its surrounding lexical environment.",
        optionC: "A syntax error that occurs when a curly brace is missing.",
        optionD: "A function that can only be called once.",
        correctAnswer: "B",
        explanation: "A closure gives an inner function access to an outer function's scope variables even after the outer function has finished executing.",
        difficulty: "MEDIUM",
        sourceReference: "JavaScript Closures"
      },
      {
        questionText: "In the JavaScript Event Loop, which queue has priority for execution immediately after the current call stack clears?",
        optionA: "Macrotask (Callback) Queue (e.g. `setTimeout`, `setInterval`)",
        optionB: "Microtask Queue (e.g. `Promise.then`, `queueMicrotask`, `process.nextTick`)",
        optionC: "Network IO Queue",
        optionD: "Disk Storage Queue",
        correctAnswer: "B",
        explanation: "The event loop completely drains the Microtask queue (Promise callbacks) before processing the next task from the Macrotask (Task) queue.",
        difficulty: "HARD",
        sourceReference: "Event Loop Concurrency Model"
      },
      {
        questionText: "What is the difference between `==` (loose equality) and `===` (strict equality) in JavaScript?",
        optionA: "`==` checks memory addresses, while `===` checks value contents.",
        optionB: "`==` performs type coercion before comparison, whereas `===` requires both value and type to be identical without conversion.",
        optionC: "`===` converts numbers to strings before checking.",
        optionD: "There is no difference in ES6+.",
        correctAnswer: "B",
        explanation: "`==` coerces types (e.g. `'5' == 5` is true), while `===` strictly checks value and type without coercion (`'5' === 5` is false).",
        difficulty: "EASY",
        sourceReference: "JavaScript Operators"
      },
      {
        questionText: "What is the value of `this` inside an arrow function `() => {}`?",
        optionA: "It always refers to the global `window` or `global` object.",
        optionB: "It lexically inherits `this` from the enclosing outer execution context where the arrow function was defined.",
        optionC: "It dynamically refers to the object that invoked the function at call time.",
        optionD: "It is always undefined.",
        correctAnswer: "B",
        explanation: "Arrow functions do not bind their own `this`; they retain the lexical `this` binding of the enclosing scope.",
        difficulty: "MEDIUM",
        sourceReference: "ES6 Arrow Functions"
      },
      {
        questionText: "What does `Promise.all([p1, p2, p3])` do when one of the promises rejects?",
        optionA: "It waits for all others to complete and ignores the rejected one.",
        optionB: "It immediately rejects with the reason of the first promise that rejects (fail-fast).",
        optionC: "It returns undefined.",
        optionD: "It retries the rejected promise 3 times.",
        correctAnswer: "B",
        explanation: "`Promise.all()` rejects immediately upon any input promise rejecting, discarding ongoing results unless `Promise.allSettled()` is used.",
        difficulty: "MEDIUM",
        sourceReference: "Asynchronous JavaScript Promises"
      }
    ]
  },

  "dom": {
    videos: [
      {
        title: "JavaScript DOM Manipulation & Browser APIs",
        youtubeUrl: "https://www.youtube.com/watch?v=y17RuWkWdn8",
        duration: "22 min",
        channel: "Web Dev Simplified",
        description: "Document Object Model tree traversal, event bubbling & capturing, event delegation, and performance.",
        learningObjective: "Manipulate DOM nodes efficiently, manage event bubbling, and implement event delegation."
      }
    ],
    questions: [
      {
        questionText: "What is Event Delegation in the browser DOM?",
        optionA: "Delegating event handling to a server via WebSockets.",
        optionB: "Attaching a single event listener to a parent node to handle events for current and future child elements using event bubbling.",
        optionC: "Passing events down to child components via React props.",
        optionD: "Disabling all browser event listeners during page load.",
        correctAnswer: "B",
        explanation: "Event delegation leverages event bubbling by attaching a listener on a parent element, inspecting `e.target` to handle child events with minimal memory overhead.",
        difficulty: "MEDIUM",
        sourceReference: "DOM Event Delegation"
      },
      {
        questionText: "What are the two main phases of DOM event propagation?",
        optionA: "Compile phase and Runtime phase",
        optionB: "Capturing phase (trickling down from window to target) and Bubbling phase (bubbling up from target to window)",
        optionC: "Synchronous phase and Asynchronous phase",
        optionD: "Render phase and Commit phase",
        correctAnswer: "B",
        explanation: "An event first trickles down through ancestor nodes during the Capturing phase, hits the target, then bubbles upward during the Bubbling phase.",
        difficulty: "MEDIUM",
        sourceReference: "DOM Event Propagation"
      },
      {
        questionText: "What is the difference between `document.getElementById('title')` and `document.querySelector('#title')`?",
        optionA: "`querySelector` only works in node.js environments.",
        optionB: "`getElementById` specifically queries IDs directly and is slightly faster, while `querySelector` accepts any valid CSS selector string.",
        optionC: "`getElementById` returns a live array of matching elements.",
        optionD: "There is no difference in syntax or behavior.",
        correctAnswer: "B",
        explanation: "`getElementById` is an optimized lookup for unique element IDs, while `querySelector` evaluates generalized CSS selectors.",
        difficulty: "EASY",
        sourceReference: "DOM Query Methods"
      },
      {
        questionText: "What does `e.preventDefault()` do in a DOM event listener?",
        optionA: "Stops the event from bubbling up the DOM tree.",
        optionB: "Prevents the browser's default action associated with the event (e.g. submitting a form or navigating a link).",
        optionC: "Removes the event listener from memory.",
        optionD: "Halts the browser JavaScript thread.",
        correctAnswer: "B",
        explanation: "`e.preventDefault()` suppresses the native browser action for that event without stopping event propagation (`e.stopPropagation()` stops bubbling).",
        difficulty: "EASY",
        sourceReference: "Event Handling Methods"
      },
      {
        questionText: "What causes a browser 'Reflow' (Layout recalculation)?",
        optionA: "Changing the font-color of text in CSS.",
        optionB: "Modifying element dimensions, margins, padding, or querying geometric properties like `offsetHeight`.",
        optionC: "Loading a JSON payload over fetch.",
        optionD: "Declaring a JavaScript variable.",
        correctAnswer: "B",
        explanation: "Reflow occurs when changes affect layout geometry (widths, heights, offsets), causing the browser to recalculate element positions across the render tree.",
        difficulty: "HARD",
        sourceReference: "Browser Rendering Engine"
      }
    ]
  },

  "git": {
    videos: [
      {
        title: "Git & GitHub for Beginners: Branching, Merging & Rebase",
        youtubeUrl: "https://www.youtube.com/watch?v=RGOj5yH7evk",
        duration: "25 min",
        channel: "freeCodeCamp.org",
        description: "Git commit graphs, distributed version control, staging area, branching workflows, and conflict resolution.",
        learningObjective: "Master Git fundamentals: commits, branching, merging vs rebasing, and resolving merge conflicts."
      }
    ],
    questions: [
      {
        questionText: "What is the difference between `git merge` and `git rebase`?",
        optionA: "`git rebase` deletes the remote branch permanently.",
        optionB: "`git merge` combines branches with a dedicated merge commit preserving history; `git rebase` rewrites commit history by reapplying commits onto a new base tip.",
        optionC: "`git merge` can only be performed by repository administrators.",
        optionD: "`git rebase` works only on uncommitted files.",
        correctAnswer: "B",
        explanation: "Merge creates a commit that joins two divergent branches, while rebase replays your commits sequentially on top of the target branch tip, creating a linear history.",
        difficulty: "MEDIUM",
        sourceReference: "Git Branching Strategies"
      },
      {
        questionText: "What command creates and switches to a new Git branch named `feature/auth` in one step?",
        optionA: "`git checkout -b feature/auth` or `git switch -c feature/auth`",
        optionB: "`git branch feature/auth --jump`",
        optionC: "`git new branch feature/auth`",
        optionD: "`git commit -b feature/auth`",
        correctAnswer: "A",
        explanation: "`git checkout -b <name>` (or modern `git switch -c <name>`) creates a new branch pointer and updates HEAD to point to it.",
        difficulty: "EASY",
        sourceReference: "Git Branch Operations"
      },
      {
        questionText: "What is the purpose of the Git Staging Area (Index)?",
        optionA: "To compress video files before uploading to GitHub.",
        optionB: "To assemble and prepare explicit snapshots of file modifications before committing them into permanent history.",
        optionC: "To store temporary stash commits that were dropped.",
        optionD: "To manage user credentials.",
        correctAnswer: "B",
        explanation: "The staging area allows developers to selectively group specific changes (`git add`) into cohesive, atomic commits.",
        difficulty: "EASY",
        sourceReference: "Git Three-Tree Architecture"
      },
      {
        questionText: "What does `git stash` do?",
        optionA: "Permanently deletes all untracked files.",
        optionB: "Temporarily shelves uncommitted changes (both staged and unstaged) so you can work on another branch with a clean working directory.",
        optionC: "Pushes your code to a hidden repository.",
        optionD: "Rolls back the last 5 commits.",
        correctAnswer: "B",
        explanation: "`git stash` records the current state of the working directory and index onto a stash stack, reverting working tree to the HEAD commit.",
        difficulty: "EASY",
        sourceReference: "Git Stashing"
      },
      {
        questionText: "What does the `git cherry-pick <commit-hash>` command accomplish?",
        optionA: "Deletes the chosen commit from origin.",
        optionB: "Applies the exact changes introduced by an individual existing commit from another branch onto the current working HEAD.",
        optionC: "Creates a tag named after the commit hash.",
        optionD: "Reverts the selected commit by creating an inverse patch.",
        correctAnswer: "B",
        explanation: "`git cherry-pick` extracts the diff of a specific commit from any branch and applies it cleanly as a new commit on the current branch.",
        difficulty: "MEDIUM",
        sourceReference: "Git Commit Manipulation"
      }
    ]
  },

  "frontend-react": {
    videos: [
      {
        title: "React Masterclass: Components, Hooks, State & Virtual DOM",
        youtubeUrl: "https://www.youtube.com/watch?v=bMknfKXIFA8",
        duration: "30 min",
        channel: "freeCodeCamp.org",
        description: "JSX, props, useState, useEffect lifecycle, Reconciliation & Virtual DOM diffing, and custom hooks.",
        learningObjective: "Master component state architecture, hook rules, useEffect dependencies, and rendering optimization."
      }
    ],
    questions: [
      {
        questionText: "How does the React Virtual DOM optimize UI rendering performance?",
        optionA: "It converts all JavaScript into compiled C++ assembly code.",
        optionB: "It maintains an in-memory lightweight representation of the UI, diffs changes using a reconciliation algorithm, and batched updates the real DOM only where needed.",
        optionC: "It bypasses CSS styling calculations completely.",
        optionD: "It runs all UI components inside dedicated Web Workers.",
        correctAnswer: "B",
        explanation: "React creates a virtual representation of the DOM tree. When state changes, it diffs the new virtual tree against the previous one and computes minimal real DOM mutations.",
        difficulty: "MEDIUM",
        sourceReference: "React Reconciliation & Fiber"
      },
      {
        questionText: "Why must you NEVER update state in React by mutating it directly (e.g. `state.count = 5`)?",
        optionA: "Direct mutation causes an immediate browser syntax error.",
        optionB: "React relies on reference equality checks (`Object.is`) to detect state changes; direct mutations do not change object references and will not trigger a re-render.",
        optionC: "State can only be mutated inside the browser URL bar.",
        optionD: "React automatically freezes all variables in JavaScript.",
        correctAnswer: "B",
        explanation: "Immutability ensures state transitions produce new object references. Mutating directly skips shallow equality checks, causing the component not to re-render.",
        difficulty: "MEDIUM",
        sourceReference: "React Immutability"
      },
      {
        questionText: "When does the cleanup function returned inside a `useEffect(() => { return () => cleanup(); }, [dep])` execute?",
        optionA: "Only when the entire browser window is closed.",
        optionB: "Before the effect re-runs due to a dependency change, and when the component unmounts.",
        optionC: "Synchronously before the initial render.",
        optionD: "Every time any variable on the page changes.",
        correctAnswer: "B",
        explanation: "The cleanup function runs prior to executing the effect on subsequent renders if dependencies changed, and runs when the component unmounts to prevent memory leaks.",
        difficulty: "MEDIUM",
        sourceReference: "React useEffect Lifecycle"
      },
      {
        questionText: "Why must a unique `key` prop be provided when rendering lists of elements in React?",
        optionA: "To apply CSS styles by key name.",
        optionB: "To help React identify which items have changed, been added, or been removed during reconciliation, preserving component state correctly.",
        optionC: "To allow the browser to serialize the HTML to JSON.",
        optionD: "Keys are required only for database synchronization.",
        correctAnswer: "B",
        explanation: "Keys give stable identities to list elements across renders so React can reorder or update DOM elements without recreating them from scratch.",
        difficulty: "EASY",
        sourceReference: "React Lists & Keys"
      },
      {
        questionText: "What is the primary purpose of the `useMemo` hook in React?",
        optionA: "To fetch data from remote REST endpoints.",
        optionB: "To memoize the result of an expensive calculation so it is only recomputed when specified dependencies change.",
        optionC: "To trigger a full page reload.",
        optionD: "To create global Redux stores.",
        correctAnswer: "B",
        explanation: "`useMemo(() => computeExpensiveValue(a, b), [a, b])` caches computed values between renders unless dependencies `a` or `b` change.",
        difficulty: "MEDIUM",
        sourceReference: "React Performance Hooks"
      }
    ]
  },

  "backend-node": {
    videos: [
      {
        title: "Node.js & Express Architecture: REST APIs, Middleware & Event Loop",
        youtubeUrl: "https://www.youtube.com/watch?v=f2EqECiTBL8",
        duration: "28 min",
        channel: "Dave Gray",
        description: "Node.js non-blocking I/O, CommonJS/ESM modules, Express routing, middleware pipelines, and error handling.",
        learningObjective: "Design robust REST APIs in Node.js with Express routing, middleware stacks, and async error handling."
      }
    ],
    questions: [
      {
        questionText: "How does Node.js achieve high concurrency despite running JavaScript on a single thread?",
        optionA: "It spins up a new OS process for every incoming HTTP connection.",
        optionB: "It utilizes a non-blocking asynchronous event-driven architecture powered by libuv with a background thread pool for I/O operations.",
        optionC: "It executes JavaScript on multiple CPU cores simultaneously via hardware virtualization.",
        optionD: "It caches all HTTP responses in CPU L1 cache.",
        correctAnswer: "B",
        explanation: "Node.js offloads asynchronous I/O (filesystem, network, timers) to libuv and the OS kernel, allowing the main single thread to handle concurrent incoming requests via callbacks/events.",
        difficulty: "MEDIUM",
        sourceReference: "Node.js Architecture & libuv"
      },
      {
        questionText: "In Express.js, what is the role of the `next()` function inside a middleware function?",
        optionA: "It restarts the Node.js server process.",
        optionB: "It passes control to the next matching middleware or route handler in the execution stack.",
        optionC: "It sends an immediate HTTP 200 response to the client.",
        optionD: "It rolls back the active database transaction.",
        correctAnswer: "B",
        explanation: "Calling `next()` signals Express to pass execution down the middleware chain; without calling `next()` or ending the response, the request hangs.",
        difficulty: "EASY",
        sourceReference: "Express Middleware Pipeline"
      },
      {
        questionText: "What is the signature of an Express error-handling middleware function?",
        optionA: "`function(req, res)`",
        optionB: "`function(err, req, res, next)`",
        optionC: "`function(err, next)`",
        optionD: "`function(error)`",
        correctAnswer: "B",
        explanation: "Express recognizes an error-handling middleware specifically by its 4-parameter signature: `(err, req, res, next)`.",
        difficulty: "EASY",
        sourceReference: "Express Error Handling"
      },
      {
        questionText: "Why should you avoid using synchronous methods like `fs.readFileSync()` in production Node.js servers?",
        optionA: "They do not support UTF-8 encoding.",
        optionB: "They block the single event loop thread, preventing all other incoming requests from being processed until disk I/O completes.",
        optionC: "They automatically delete files after reading.",
        optionD: "They can only read files smaller than 1 kilobyte.",
        correctAnswer: "B",
        explanation: "Synchronous file operations block the entire Node.js main event loop thread, freezing server responsiveness for all users until the file read finishes.",
        difficulty: "EASY",
        sourceReference: "Non-Blocking I/O"
      },
      {
        questionText: "What is the purpose of Node.js Streams?",
        optionA: "To stream audio directly into browser WebAudio.",
        optionB: "To process continuous chunks of data piece-by-piece without buffering the entire payload into RAM at once.",
        optionC: "To replace TCP with UDP connections.",
        optionD: "To compile TypeScript without transpilations.",
        correctAnswer: "B",
        explanation: "Streams handle reading or writing large amounts of data in small chunks, keeping memory consumption low and enabling processing of files larger than available RAM.",
        difficulty: "MEDIUM",
        sourceReference: "Node.js Streams"
      }
    ]
  },

  "database-apis": {
    videos: [
      {
        title: "Database Integration & REST APIs: ORM, Queries & Indexing",
        youtubeUrl: "https://www.youtube.com/watch?v=WXsD0ZgxjRw",
        duration: "24 min",
        channel: "freeCodeCamp.org",
        description: "Relational database integration, Prisma/Mongoose ORMs, connection pooling, and RESTful resource routing.",
        learningObjective: "Integrate relational databases with backend APIs using ORMs, transactions, and connection pools."
      }
    ],
    questions: [
      {
        questionText: "What is an ORM (Object-Relational Mapping) tool such as Prisma or Hibernate?",
        optionA: "A database driver that only executes raw binary bytecode.",
        optionB: "A library that allows querying and manipulating a database using object-oriented code instead of writing raw SQL strings.",
        optionC: "A tool that replaces database tables with flat JSON files.",
        optionD: "A hardware accelerator for relational database storage.",
        correctAnswer: "B",
        explanation: "An ORM maps database tables to classes/objects in programming languages, providing type safety, migrations, and object-oriented query interfaces.",
        difficulty: "EASY",
        sourceReference: "ORM Fundamentals"
      },
      {
        questionText: "Why is Connection Pooling essential in high-traffic web applications interacting with databases?",
        optionA: "It permanently encrypts all database passwords.",
        optionB: "Opening new database TCP connections incurs high handshake overhead; connection pools reuse a pool of established connections.",
        optionC: "It bypasses database authentication checks.",
        optionD: "It eliminates the need for SQL queries.",
        correctAnswer: "B",
        explanation: "Establishing TCP connections and authenticating with a database server is expensive. Connection pooling maintains open connections to reuse across requests.",
        difficulty: "MEDIUM",
        sourceReference: "Database Connection Management"
      },
      {
        questionText: "Which HTTP method should be used in a RESTful API to partially update specific fields of an existing resource?",
        optionA: "GET",
        optionB: "POST",
        optionC: "PATCH",
        optionD: "DELETE",
        correctAnswer: "C",
        explanation: "HTTP PATCH is defined for partial updates of a resource, whereas PUT replaces the entire resource representation.",
        difficulty: "EASY",
        sourceReference: "RESTful API Standards"
      },
      {
        questionText: "What HTTP status code should be returned when a client successfully creates a new database resource via POST?",
        optionA: "200 OK",
        optionB: "201 Created",
        optionC: "204 No Content",
        optionD: "301 Moved Permanently",
        correctAnswer: "B",
        explanation: "HTTP 201 Created indicates that the request succeeded and led to the creation of a new resource on the server.",
        difficulty: "EASY",
        sourceReference: "HTTP Response Status Codes"
      },
      {
        questionText: "What is the N+1 Query Problem in database querying with ORMs?",
        optionA: "An error where a table contains one more column than permitted.",
        optionB: "When an application executes 1 query to fetch parent records, followed by N separate queries to fetch associated child records for each parent, causing severe latency.",
        optionC: "When the database exceeds N+1 concurrent users.",
        optionD: "When an auto-incrementing ID skips an integer.",
        correctAnswer: "B",
        explanation: "The N+1 problem happens when child records are fetched lazily in a loop instead of performing a single JOIN or eager include query.",
        difficulty: "HARD",
        sourceReference: "Database Performance & ORM"
      }
    ]
  },

  "authentication": {
    videos: [
      {
        title: "Web Security & Authentication: JWT, Sessions, Cookies & Bcrypt",
        youtubeUrl: "https://www.youtube.com/watch?v=mbsmsi7l3r4",
        duration: "25 min",
        channel: "Web Dev Simplified",
        description: "Token-based vs session-based auth, JSON Web Tokens (JWT), password hashing with bcrypt, and HttpOnly cookies.",
        learningObjective: "Implement secure authentication workflows, salted password hashing, and JWT token verification."
      }
    ],
    questions: [
      {
        questionText: "Why should passwords never be stored in plain text or with fast hashing algorithms like MD5/SHA-256?",
        optionA: "Plain text passwords consume too much disk storage.",
        optionB: "Fast hashes can be brute-forced or cracked with rainbow tables; slow, salted algorithms like bcrypt/Argon2 incorporate work factors to resist cracking.",
        optionC: "SQL databases cannot store text strings longer than 8 characters.",
        optionD: "Browsers refuse to transmit hashed passwords.",
        correctAnswer: "B",
        explanation: "Modern GPUs can compute billions of SHA-256 hashes per second. Adaptive hashing algorithms like bcrypt introduce random salts and configurable work factor iterations.",
        difficulty: "MEDIUM",
        sourceReference: "Password Hashing Standards"
      },
      {
        questionText: "What are the three components of a JSON Web Token (JWT) separated by periods?",
        optionA: "User, Password, Hash",
        optionB: "Header, Payload, Signature",
        optionC: "Issuer, Subject, Expiration",
        optionD: "Algorithm, Body, Checksum",
        correctAnswer: "B",
        explanation: "A JWT is composed of Header (metadata/algorithm), Payload (claims/data), and Signature (cryptographic verification) encoded in Base64Url.",
        difficulty: "EASY",
        sourceReference: "JWT Specifications (RFC 7519)"
      },
      {
        questionText: "Why should sensitive authentication tokens be stored in an `HttpOnly` cookie rather than browser `localStorage`?",
        optionA: "Cookies have unlimited storage capacity.",
        optionB: "`HttpOnly` cookies cannot be accessed via JavaScript (`document.cookie`), mitigating Cross-Site Scripting (XSS) token theft.",
        optionC: "Cookies never expire under any circumstances.",
        optionD: "localStorage requires an active internet connection to read.",
        correctAnswer: "B",
        explanation: "If malicious XSS script executes on a page, it can read `localStorage`. Setting the `HttpOnly` flag prevents JavaScript from reading the cookie.",
        difficulty: "MEDIUM",
        sourceReference: "Web Security & Storage"
      },
      {
        questionText: "What security mechanism protects against Cross-Site Request Forgery (CSRF) attacks?",
        optionA: "Using CORS headers only.",
        optionB: "CSRF anti-forgery tokens (Synchronizer Token Pattern) and `SameSite=Strict/Lax` cookie flags.",
        optionC: "Minifying JavaScript code before deployment.",
        optionD: "Setting image tags to lazy load.",
        correctAnswer: "B",
        explanation: "CSRF exploits ambient cookie credentials. Anti-CSRF tokens and SameSite cookie attributes prevent malicious origins from triggering authenticated requests.",
        difficulty: "MEDIUM",
        sourceReference: "CSRF Mitigation"
      },
      {
        questionText: "What is Role-Based Access Control (RBAC)?",
        optionA: "An encryption cipher used for network packets.",
        optionB: "An authorization mechanism where system permissions are assigned to specific roles (e.g. Admin, Editor, Learner), and users are assigned to roles.",
        optionC: "A database backup scheduler.",
        optionD: "A technique for load balancing web traffic.",
        correctAnswer: "B",
        explanation: "RBAC restricts system access based on user roles and associated privileges rather than assigning permissions directly to individuals.",
        difficulty: "EASY",
        sourceReference: "Authorization Architectures"
      }
    ]
  },

  "deployment": {
    videos: [
      {
        title: "Deployment & Cloud Hosting: CI/CD, Docker & Production Best Practices",
        youtubeUrl: "https://www.youtube.com/watch?v=2LaAJq1lB1Q",
        duration: "24 min",
        channel: "freeCodeCamp.org",
        description: "Deploying fullstack applications to cloud platforms, environment variables, reverse proxies, and production optimization.",
        learningObjective: "Configure production build artifacts, environment secrets, and zero-downtime deployment pipelines."
      }
    ],
    questions: [
      {
        questionText: "Why must sensitive credentials like database passwords and API keys be injected via Environment Variables rather than hardcoded in source code?",
        optionA: "Environment variables execute faster than hardcoded strings.",
        optionB: "Hardcoding credentials exposes secrets in version control (git), risking unauthorized database access if repositories are shared or compromised.",
        optionC: "Operating systems do not permit text files to contain passwords.",
        optionD: "Node.js throws a syntax error if string literals contain special characters.",
        correctAnswer: "B",
        explanation: "Twelve-Factor App methodology mandates storing configuration in the environment to avoid committing secrets into source control and enable separate dev/prod environments.",
        difficulty: "EASY",
        sourceReference: "Twelve-Factor App Configuration"
      },
      {
        questionText: "What is the role of a Reverse Proxy (such as Nginx) deployed in front of Node.js application servers?",
        optionA: "To compile TypeScript into binary machine code.",
        optionB: "To handle SSL/TLS termination, static asset caching, rate limiting, and distribute traffic across backend server instances.",
        optionC: "To replace the database server.",
        optionD: "To prevent users from bookmarking URLs.",
        correctAnswer: "B",
        explanation: "Nginx acts as a reverse proxy to terminate HTTPS, serve static assets at wire speed, handle load balancing, and protect application servers from direct exposure.",
        difficulty: "MEDIUM",
        sourceReference: "Reverse Proxy Architecture"
      },
      {
        questionText: "What does the `next build` command generate in a Next.js production build?",
        optionA: "A single uncompressed HTML file.",
        optionB: "Optimized, minified production assets, server-side bundles, static HTML pages, and code-split client chunks.",
        optionC: "A new SQLite database file.",
        optionD: "A Docker virtual machine image.",
        correctAnswer: "B",
        explanation: "`next build` pre-renders static pages, bundles server routes, generates route manifests, tree-shakes dead code, and optimizes client JavaScript chunks.",
        difficulty: "EASY",
        sourceReference: "Next.js Production Build"
      },
      {
        questionText: "What is a Blue-Green deployment strategy?",
        optionA: "Deploying code only during daylight hours.",
        optionB: "Running two identical production environments (Blue and Green); one serves live traffic while the other is updated, then switching router traffic for zero-downtime.",
        optionC: "Running tests in green mode and deployment in blue mode.",
        optionD: "Deploying to mobile devices before desktop computers.",
        correctAnswer: "B",
        explanation: "Blue-Green deployment ensures zero downtime: new versions are deployed to the inactive environment, tested, and traffic is instantly routed over.",
        difficulty: "MEDIUM",
        sourceReference: "Deployment Patterns"
      },
      {
        questionText: "What is the function of a Health Check endpoint (`/api/health`) in modern containerized cloud deployments?",
        optionA: "To display CPU hardware temperature to users.",
        optionB: "To allow orchestrators (like Kubernetes or load balancers) to periodically verify that the application instance is alive and ready to receive traffic.",
        optionC: "To scan user profiles for invalid emails.",
        optionD: "To measure internet download speeds.",
        correctAnswer: "B",
        explanation: "Health check endpoints let load balancers and orchestrators monitor container health, automatically restarting crashed pods or routing traffic away from unhealthy nodes.",
        difficulty: "EASY",
        sourceReference: "Cloud SRE & Monitoring"
      }
    ]
  }
};

console.log("Loaded core content dictionary for DSA, Data Analytics, and Web Development.");
module.exports = { courseCompetencies, topicContentData };
