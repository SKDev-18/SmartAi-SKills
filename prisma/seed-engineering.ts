import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

export async function seedEngineering(prisma: PrismaClient) {
  console.log("Seeding SIH 2026 Engineering Learning Platform (DSA Roadmap & 30-Question Quizzes)...");

  // Clean engineering tables
  await prisma.userTopicProgress.deleteMany();
  await prisma.topicVideo.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.courseModule.deleteMany();
  await prisma.course.deleteMany();
  await prisma.progressionThreshold.deleteMany();

  // 1. Create Default Progression Thresholds (PRD §30)
  await prisma.progressionThreshold.create({
    data: {
      name: "Standard Engineering Adaptive Rule",
      relearnThreshold: 60.0,
      retryThreshold: 80.0,
      masteryThreshold: 90.0,
    },
  });

  // 2. Create Engineering Course: Data Structures & Algorithms
  const dsaCourse = await prisma.course.create({
    data: {
      id: "course_dsa",
      title: "Data Structures & Algorithms (DSA)",
      slug: "dsa",
      description: "Master foundational to advanced data structures and algorithms, problem-solving techniques, and time-space optimization for technical interviews and engineering mastery.",
      branch: "Computer Engineering",
      targetAudience: "Engineering Freshers & Computer/IT Students",
      icon: "Code",
    },
  });

  // 3. Create Modules
  const mod1 = await prisma.courseModule.create({
    data: {
      courseId: dsaCourse.id,
      title: "1. Programming Foundations & Logic",
      order: 1,
    },
  });

  const mod2 = await prisma.courseModule.create({
    data: {
      courseId: dsaCourse.id,
      title: "2. Linear Data Structures",
      order: 2,
    },
  });

  const mod3 = await prisma.courseModule.create({
    data: {
      courseId: dsaCourse.id,
      title: "3. Non-Linear & Hierarchical Structures",
      order: 3,
    },
  });

  const mod4 = await prisma.courseModule.create({
    data: {
      courseId: dsaCourse.id,
      title: "4. Advanced Optimization & Algorithms",
      order: 4,
    },
  });

  // 4. Create Roadmap Topics (10 Sequential Topics per PRD §2, §15, §36)
  const topicProgBasics = await prisma.topic.create({
    data: {
      moduleId: mod1.id,
      title: "Programming Fundamentals",
      slug: "programming-fundamentals",
      order: 1,
      estimatedTime: "30 mins",
      description: "Variables, conditional logic, loops, functions, memory layout, and computational problem solving.",
      notesContent: `# Programming Fundamentals

## Core Concepts
- **Variables & Data Types**: Primitive (int, float, char, bool) vs Non-Primitive.
- **Control Flow**: Conditional branching (\`if/else\`, \`switch\`) and iterative loops (\`for\`, \`while\`, \`do-while\`).
- **Memory Layout**: Stack memory (local variables, function calls) vs Heap memory (dynamic allocations).
- **Functions & Scope**: Pass by value vs Pass by reference (\`&\` in C++, pointers).

\`\`\`cpp
// Example: Swap using pointers / references in C++
void swap(int &a, int &b) {
    int temp = a;
    a = b;
    b = temp;
}
\`\`\`
`,
    },
  });

  const topicArrays = await prisma.topic.create({
    data: {
      moduleId: mod2.id,
      title: "Arrays & Dynamic Arrays",
      slug: "arrays",
      order: 2,
      prerequisiteId: topicProgBasics.id,
      estimatedTime: "40 mins",
      description: "Contiguous memory allocation, indexing, dynamic resizing, two-pointer techniques, and sliding window.",
      notesContent: `# Arrays & Dynamic Arrays

## Key Characteristics
1. **Contiguous Memory**: Elements stored in adjacent memory locations.
2. **O(1) Random Access**: \`address(arr[i]) = base_address + i * sizeof(type)\`.
3. **Static vs Dynamic**: Fixed arrays (e.g. \`int arr[10]\`) vs Resizable arrays (\`std::vector\` in C++, \`ArrayList\` in Java, \`list\` in Python).

## Complexity Table
- Access: **O(1)**
- Search (Linear): **O(n)**
- Insertion / Deletion at End: **O(1) Amortized**
- Insertion / Deletion at Beginning: **O(n)**
`,
    },
  });

  const topicStrings = await prisma.topic.create({
    data: {
      moduleId: mod2.id,
      title: "Strings & Hashing",
      slug: "strings",
      order: 3,
      prerequisiteId: topicArrays.id,
      estimatedTime: "45 mins",
      description: "Character arrays, string immutability, pattern matching, hash tables, and collision resolution.",
      notesContent: `# Strings & Hashing

## String Operations
- Character arrays (\`char[]\`) null-terminated with \`'\\0'\` vs String objects.
- Common patterns: Two Pointers, Palindrome checking, Anagram verification using frequency arrays.

## Hash Tables
- Hash function maps keys to buckets: \`hash(key) % table_size\`.
- Collision resolution: Separate Chaining (Linked Lists) vs Open Addressing (Linear Probing).
- Average lookup, insert, delete: **O(1)**.
`,
    },
  });

  const topicLinkedList = await prisma.topic.create({
    data: {
      moduleId: mod2.id,
      title: "Linked List",
      slug: "linked-list",
      order: 4,
      prerequisiteId: topicStrings.id,
      estimatedTime: "50 mins",
      description: "Linear collection of data elements where linear order is given by pointers. Essential for dynamic memory and building Stacks and Queues.",
      notesContent: `# Linked List — Comprehensive Engineering Notes

## Why This Topic Matters
Linked Lists are fundamental linear data structures where elements (nodes) are stored non-contiguously in heap memory. Unlike arrays, linked lists can grow or shrink dynamically without costly reallocation or memory waste. They form the architectural basis for stacks, queues, hash table chaining, and OS kernel process scheduling.

---

## 1. Node Structure & Memory Representation
Each node contains two components:
1. **Data payload** (the actual value stored).
2. **Next pointer / reference** (memory address of the succeeding node).

\`\`\`cpp
// C++ Node Representation
struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};
\`\`\`

\`\`\`python
# Python Node Representation
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None
\`\`\`

---

## 2. Types of Linked Lists
1. **Singly Linked List**: Each node points strictly to the next node. The last node points to \`nullptr\`.
2. **Doubly Linked List**: Each node contains both \`next\` and \`prev\` pointers, allowing bidirectional traversal.
3. **Circular Linked List**: The last node's \`next\` points back to the \`head\` node.

---

## 3. Operations & Time Complexity Comparison

| Operation | Array | Singly Linked List | Doubly Linked List |
| :--- | :--- | :--- | :--- |
| **Access (k-th element)** | O(1) | O(n) | O(n) |
| **Insert at Head** | O(n) | **O(1)** | **O(1)** |
| **Insert at Tail (with tail ptr)** | O(1) amortized | **O(1)** | **O(1)** |
| **Insert at Middle** | O(n) | O(n) | O(n) |
| **Delete at Head** | O(n) | **O(1)** | **O(1)** |
| **Delete given Node Pointer** | O(n) | O(n) (needs prev) | **O(1)** |

---

## 4. Fundamental Algorithms

### A. Traversal
\`\`\`cpp
void printList(Node* head) {
    Node* curr = head;
    while (curr != nullptr) {
        cout << curr->data << " -> ";
        curr = curr->next;
    }
    cout << "NULL" << endl;
}
\`\`\`

### B. In-Place Reversal (Iterative 3-Pointers)
\`\`\`cpp
Node* reverseList(Node* head) {
    Node* prev = nullptr;
    Node* curr = head;
    Node* next = nullptr;
    while (curr != nullptr) {
        next = curr->next; // Store next
        curr->next = prev; // Reverse pointer
        prev = curr;       // Advance prev
        curr = next;       // Advance curr
    }
    return prev; // New head
}
\`\`\`

### C. Cycle Detection (Floyd's Tortoise and Hare)
- Use two pointers: \`slow\` (advances 1 step) and \`fast\` (advances 2 steps).
- If \`fast == slow\` at any point, a cycle exists.
- If \`fast == nullptr\` or \`fast->next == nullptr\`, the list terminates linearly.

---

## 5. Best Practices & Common Pitfalls
- Always verify \`head == nullptr\` (empty list edge case) and \`head->next == nullptr\` (single node).
- When deleting a node in languages without garbage collection (C/C++), always invoke \`delete\` on the unlinked pointer to prevent memory leaks.
- Maintain dummy / sentinel nodes (\`Node* dummy = new Node(0)\`) to dramatically simplify head insertion and deletion edge cases.
`,
    },
  });

  const topicStack = await prisma.topic.create({
    data: {
      moduleId: mod2.id,
      title: "Stack",
      slug: "stack",
      order: 5,
      prerequisiteId: topicLinkedList.id,
      estimatedTime: "40 mins",
      description: "LIFO (Last In First Out) principle, expression evaluation, monotonic stack, and call stack mechanics.",
      notesContent: `# Stack Data Structure

## Definition
A linear collection adhering to **Last In, First Out (LIFO)**.
- \`push(x)\`: Add element to top — **O(1)**
- \`pop()\`: Remove element from top — **O(1)**
- \`peek() / top()\`: Inspect top element — **O(1)**
- \`isEmpty()\`: Check if empty — **O(1)**

## Core Applications
1. Parentheses Balancing (e.g. compiler syntax checks).
2. Expression Evaluation: Infix to Postfix conversion.
3. Undo/Redo operations.
4. Monotonic Stack for Next Greater Element problems.
`,
    },
  });

  const topicQueue = await prisma.topic.create({
    data: {
      moduleId: mod2.id,
      title: "Queue & Deque",
      slug: "queue",
      order: 6,
      prerequisiteId: topicStack.id,
      estimatedTime: "40 mins",
      description: "FIFO (First In First Out) principle, circular queues, double-ended queues, and BFS traversal queues.",
      notesContent: `# Queue & Deque

## Definition
A linear collection adhering to **First In, First Out (FIFO)**.
- \`enqueue(x)\`: Add to rear — **O(1)**
- \`dequeue()\`: Remove from front — **O(1)**
- \`front()\`: Inspect front item — **O(1)**

## Variations
- **Circular Queue**: Avoids wasted array space using modulo arithmetic: \`(rear + 1) % size\`.
- **Double-Ended Queue (Deque)**: Insert and remove from both front and rear in O(1).
- **Priority Queue**: Elements served based on priority using a binary heap.
`,
    },
  });

  const topicRecursion = await prisma.topic.create({
    data: {
      moduleId: mod1.id,
      title: "Recursion & Backtracking",
      slug: "recursion",
      order: 7,
      prerequisiteId: topicProgBasics.id,
      estimatedTime: "45 mins",
      description: "Base cases, recursive call stack, recurrence relations, subset generation, and state-space tree traversal.",
      notesContent: `# Recursion & Backtracking

## Anatomy of a Recursive Function
1. **Base Case**: Halting condition to stop infinite recursion.
2. **Recursive Step**: Sub-problem reduction calling itself with smaller parameters.

## Backtracking Paradigm
Choose ➔ Explore ➔ Un-choose (backtrack state).
- N-Queens, Sudoku Solver, Subset Sum, Permutations.
`,
    },
  });

  const topicTrees = await prisma.topic.create({
    data: {
      moduleId: mod3.id,
      title: "Trees & Binary Search Trees",
      slug: "trees",
      order: 8,
      prerequisiteId: topicRecursion.id,
      estimatedTime: "60 mins",
      description: "Hierarchical data structures, binary trees, BST invariant, Inorder/Preorder/Postorder traversals, and AVL balances.",
      notesContent: `# Trees & Binary Search Trees

## Binary Search Tree (BST) Invariant
For every node with value \`V\`:
- All values in the left subtree are strictly \`< V\`.
- All values in the right subtree are strictly \`> V\`.

## Traversals
- **Preorder**: Root ➔ Left ➔ Right
- **Inorder**: Left ➔ Root ➔ Right (yields sorted order in a BST!)
- **Postorder**: Left ➔ Right ➔ Root
- **Level Order (BFS)**: Uses a Queue.
`,
    },
  });

  const topicGraphs = await prisma.topic.create({
    data: {
      moduleId: mod3.id,
      title: "Graphs & Graph Algorithms",
      slug: "graphs",
      order: 9,
      prerequisiteId: topicTrees.id,
      estimatedTime: "60 mins",
      description: "Adjacency matrix vs list, BFS, DFS, shortest path (Dijkstra, Bellman-Ford), and topological sorting.",
      notesContent: `# Graphs & Graph Algorithms

## Graph Representations
1. **Adjacency Matrix**: \`adj[u][v] = weight\`. Space: O(V^2).
2. **Adjacency List**: \`adj[u] = list of neighbors\`. Space: O(V + E) — optimal for sparse graphs.

## Standard Algorithms
- **Breadth-First Search (BFS)**: Queue-based, explores layer by layer. Finds shortest path in unweighted graphs.
- **Depth-First Search (DFS)**: Recursion / Stack-based, explores deep paths first.
- **Dijkstra's Algorithm**: Greedy single-source shortest path with non-negative edges using Min-Heap.
`,
    },
  });

  const topicDP = await prisma.topic.create({
    data: {
      moduleId: mod4.id,
      title: "Dynamic Programming",
      slug: "dynamic-programming",
      order: 10,
      prerequisiteId: topicRecursion.id,
      estimatedTime: "75 mins",
      description: "Overlapping subproblems, optimal substructure, memoization (top-down), and tabulation (bottom-up).",
      notesContent: `# Dynamic Programming (DP)

## The Two Core Hallmarks of DP
1. **Optimal Substructure**: An optimal solution to the problem contains optimal solutions to sub-problems.
2. **Overlapping Subproblems**: The same sub-problems are computed repeatedly.

## Approaches
- **Memoization (Top-Down)**: Standard recursive approach with cache/lookup table.
- **Tabulation (Bottom-Up)**: Iteratively filling a table starting from base states.
`,
    },
  });

  // 5. Seed Free Curated YouTube Lectures for Linked List (PRD §19, §52)
  await prisma.topicVideo.createMany({
    data: [
      {
        topicId: topicLinkedList.id,
        title: "Introduction to Singly Linked List — Structure & Pointers",
        youtubeUrl: "https://www.youtube.com/watch?v=nobHl4xXq3A",
        duration: "18 min",
        channel: "Abdul Bari",
        description: "Visual memory representation of nodes, head pointer, dynamic memory allocation in heap, and traversal.",
        order: 1,
      },
      {
        topicId: topicLinkedList.id,
        title: "Linked List Insertion, Deletion & Edge Cases Implementation",
        youtubeUrl: "https://www.youtube.com/watch?v=Nq7ok-OyEpg",
        duration: "25 min",
        channel: "take U forward (Striver)",
        description: "Hands-on code walkthrough of inserting and deleting at head, tail, and k-th position with zero memory leaks.",
        order: 2,
      },
      {
        topicId: topicLinkedList.id,
        title: "Top Linked List Interview Problems (Reversal & Cycle Detection)",
        youtubeUrl: "https://www.youtube.com/watch?v=F8AbOfQwl1c",
        duration: "32 min",
        channel: "freeCodeCamp",
        description: "In-depth derivation of iterative pointer reversal and Floyd's Tortoise & Hare cycle detection algorithm.",
        order: 3,
      },
    ],
  });

  // 6. Seed Complete 30-Question Quiz for Linked List (PRD §21 - §24)
  const linkedListQuiz = await prisma.quiz.create({
    data: {
      title: "Linked List Mastery Assessment",
      description: "Rigorous 30-question adaptive assessment covering nodes, pointers, traversal, insertion, deletion, reversal, cycle detection, and time-space complexities.",
      topic: "Linked List",
      topicId: topicLinkedList.id,
      passPercentage: 80.0,
      masteryThreshold: 90.0,
      relearnThreshold: 60.0,
      isPublished: true,
    },
  });

  // Fetch or create a default competency for the questions
  let dsaComp = await prisma.competency.findFirst({
    where: { code: "DSA_LINEAR_LIST" },
  });

  if (!dsaComp) {
    dsaComp = await prisma.competency.create({
      data: {
        code: "DSA_LINEAR_LIST",
        name: "Data Structures - Linked Lists",
        domain: "Computer Science",
        description: "Mastery of linear node linkages, pointer manipulation, and asymptotic analysis.",
        targetLevel: 80.0,
      },
    });
  }

  // 30 Specific, Rigorous Linked List Questions (PRD §22, §23)
  const questionsData = [
    // Sub-topic: Definition & Node Representation (Q1 - Q4)
    {
      questionText: "What are the two fundamental components that comprise a standard Singly Linked List node?",
      optionA: "An index and a value",
      optionB: "A data payload and a pointer to the next node",
      optionC: "A key and a hash code",
      optionD: "Two integer values",
      correctAnswer: "B",
      explanation: "A standard singly linked list node encapsulates two fields: the data/payload to be stored and a pointer/reference to the succeeding node.",
      difficulty: "EASY",
      sourceReference: "Linked List Basics",
    },
    {
      questionText: "Where are linked list nodes typically allocated in program memory during runtime?",
      optionA: "The Call Stack",
      optionB: "The Heap Memory",
      optionC: "The CPU Cache L1",
      optionD: "The Read-Only Data Segment",
      correctAnswer: "B",
      explanation: "Linked list nodes are allocated dynamically at runtime on the Heap via operators like new (C++) or malloc (C), allowing dynamic sizing.",
      difficulty: "EASY",
      sourceReference: "Linked List Basics",
    },
    {
      questionText: "What does the 'next' pointer of the final node in a standard linear Singly Linked List point to?",
      optionA: "The head node",
      optionB: "Null / nullptr",
      optionC: "Itself",
      optionD: "The operating system root",
      correctAnswer: "B",
      explanation: "In a linear singly linked list, the final node's next pointer points to NULL (or nullptr), signaling the termination of the list.",
      difficulty: "EASY",
      sourceReference: "Linked List Basics",
    },
    {
      questionText: "Which of the following is a primary architectural advantage of a Linked List over a fixed-size Array?",
      optionA: "Random access in O(1) time",
      optionB: "Cache-friendly contiguous memory locality",
      optionC: "Dynamic size allocation without requiring expensive contiguous memory reallocations",
      optionD: "Lower memory overhead per element",
      correctAnswer: "C",
      explanation: "Linked lists allocate nodes on-demand anywhere in available heap memory, eliminating the need to allocate contiguous blocks or resize and copy arrays.",
      difficulty: "EASY",
      sourceReference: "Linked List Basics",
    },

    // Sub-topic: Types of Linked Lists (Q5 - Q8)
    {
      questionText: "How does a Doubly Linked List differ fundamentally from a Singly Linked List?",
      optionA: "It holds double the amount of integer data in every node",
      optionB: "Each node contains both a 'next' pointer and a 'prev' pointer",
      optionC: "It is automatically sorted in ascending order",
      optionD: "It cannot contain circular references",
      correctAnswer: "B",
      explanation: "Doubly linked list nodes maintain two pointers: one pointing forward to the next node and one pointing backward to the previous node, enabling bidirectional traversal.",
      difficulty: "MEDIUM",
      sourceReference: "Types of Linked Lists",
    },
    {
      questionText: "What distinguishes a Circular Linked List from a conventional Singly Linked List?",
      optionA: "Nodes have circular memory addresses",
      optionB: "The last node's next pointer references the first node (head) instead of null",
      optionC: "It requires a circular buffer for initialization",
      optionD: "Every node has exactly two next pointers",
      correctAnswer: "B",
      explanation: "In a circular linked list, the last node links back to the head of the list, forming a continuous ring without any null terminal pointers.",
      difficulty: "EASY",
      sourceReference: "Types of Linked Lists",
    },
    {
      questionText: "What is the extra memory overhead incurred by a Doubly Linked List compared to a Singly Linked List?",
      optionA: "One extra integer per node",
      optionB: "One extra pointer (e.g. 4 or 8 bytes) per node for the backward reference",
      optionC: "Double the heap segment allocation per process",
      optionD: "No extra overhead",
      correctAnswer: "B",
      explanation: "Each node in a doubly linked list must store an additional pointer (prev), which costs 4 bytes on 32-bit architectures or 8 bytes on 64-bit architectures per node.",
      difficulty: "MEDIUM",
      sourceReference: "Types of Linked Lists",
    },
    {
      questionText: "Which data structure can be traversed seamlessly in reverse without using recursion or an auxiliary stack?",
      optionA: "Singly Linked List",
      optionB: "Doubly Linked List",
      optionC: "Single-ended Queue",
      optionD: "Binary Tree without parent pointers",
      correctAnswer: "B",
      explanation: "Because each node in a doubly linked list stores a pointer to its predecessor, it can be traversed backward from tail to head in O(1) auxiliary space.",
      difficulty: "MEDIUM",
      sourceReference: "Types of Linked Lists",
    },

    // Sub-topic: Time Complexity Analysis (Q9 - Q12)
    {
      questionText: "What is the worst-case time complexity to access the k-th element in a Singly Linked List of length n?",
      optionA: "O(1)",
      optionB: "O(log n)",
      optionC: "O(n)",
      optionD: "O(n^2)",
      correctAnswer: "C",
      explanation: "Linked lists lack indexed address arithmetic; accessing the k-th element requires sequentially traversing k nodes from the head, resulting in O(n) time.",
      difficulty: "EASY",
      sourceReference: "Complexity Analysis",
    },
    {
      questionText: "What is the time complexity to insert a new node at the HEAD (beginning) of a Singly Linked List?",
      optionA: "O(1)",
      optionB: "O(n)",
      optionC: "O(log n)",
      optionD: "O(n log n)",
      correctAnswer: "A",
      explanation: "Inserting at the head merely requires pointing the new node's next to the current head and reassigning the head pointer, taking strictly O(1) constant time.",
      difficulty: "EASY",
      sourceReference: "Complexity Analysis",
    },
    {
      questionText: "Given a pointer directly to the node to be deleted in a Doubly Linked List, what is the time complexity of the deletion?",
      optionA: "O(1)",
      optionB: "O(n)",
      optionC: "O(log n)",
      optionD: "O(n^2)",
      correctAnswer: "A",
      explanation: "Because the node provides direct access to both its predecessor (prev) and successor (next), their pointers can be updated in O(1) without any list traversal.",
      difficulty: "MEDIUM",
      sourceReference: "Complexity Analysis",
    },
    {
      questionText: "Why do Arrays generally provide faster sequential traversal than Linked Lists despite both having O(n) theoretical time complexity?",
      optionA: "Arrays have fewer arithmetic operations",
      optionB: "Contiguous memory layout of arrays maximizes CPU cache line hits (spatial locality)",
      optionC: "Linked list pointers are always corrupted by CPU caches",
      optionD: "Arrays do not require heap allocation",
      correctAnswer: "B",
      explanation: "Array elements sit contiguously in memory, so CPU prefetching loads entire cache lines containing multiple elements. Linked list nodes are scattered across the heap, triggering frequent cache misses.",
      difficulty: "HARD",
      sourceReference: "Complexity Analysis",
    },

    // Sub-topic: Insertion Operations (Q13 - Q16)
    {
      questionText: "What is the correct sequence of pointer assignments when inserting a new node 'newNode' after an existing node 'prevNode'?",
      optionA: "prevNode->next = newNode; newNode->next = prevNode->next;",
      optionB: "newNode->next = prevNode->next; prevNode->next = newNode;",
      optionC: "newNode->next = prevNode; prevNode = newNode;",
      optionD: "prevNode = newNode->next; newNode = prevNode;",
      correctAnswer: "B",
      explanation: "You must first point newNode->next to the node following prevNode to prevent losing the rest of the list, then safely update prevNode->next to newNode.",
      difficulty: "MEDIUM",
      sourceReference: "Insertion Operations",
    },
    {
      questionText: "If a Singly Linked List does NOT maintain a tail pointer, what is the time complexity to append an element to the end of the list?",
      optionA: "O(1)",
      optionB: "O(n)",
      optionC: "O(log n)",
      optionD: "O(n^2)",
      correctAnswer: "B",
      explanation: "Without a tail pointer, the code must traverse from the head all the way to the last node (n steps) before attaching the new node, taking O(n) time.",
      difficulty: "EASY",
      sourceReference: "Insertion Operations",
    },
    {
      questionText: "What is the primary benefit of utilizing a 'Dummy' or 'Sentinel' head node during linked list insertions?",
      optionA: "It halves memory usage",
      optionB: "It eliminates special-case boundary logic when inserting at the head",
      optionC: "It makes the list doubly linked automatically",
      optionD: "It sorts the list in ascending order",
      correctAnswer: "B",
      explanation: "A dummy node ensures that every real node (including the very first data node) always has a preceding node, unifying insertion logic and eliminating edge cases.",
      difficulty: "MEDIUM",
      sourceReference: "Insertion Operations",
    },
    {
      questionText: "When inserting a node at index 0 of an empty list, what should the head pointer be updated to?",
      optionA: "nullptr",
      optionB: "The address of the new node",
      optionC: "The address of the previous tail",
      optionD: "The size of the list",
      correctAnswer: "B",
      explanation: "In an empty list where head is nullptr, adding the first node requires pointing head directly to this newly allocated node.",
      difficulty: "EASY",
      sourceReference: "Insertion Operations",
    },

    // Sub-topic: Deletion Operations (Q17 - Q20)
    {
      questionText: "What critical step must be executed in C++ when deleting the head node of a singly linked list to avoid a memory leak?",
      optionA: "head = head->next; without saving the old pointer",
      optionB: "Store old head in a temp pointer, advance head = head->next, and call 'delete temp'",
      optionC: "Overwrite head->data with zero",
      optionD: "Call free() on the entire stack",
      correctAnswer: "B",
      explanation: "In non-garbage-collected languages like C++, you must hold a reference to the detached node and explicitly free its memory using 'delete' to prevent memory leaks.",
      difficulty: "MEDIUM",
      sourceReference: "Deletion Operations",
    },
    {
      questionText: "To delete the node following 'prevNode', what is the single pointer reassignment required?",
      optionA: "prevNode = prevNode->next;",
      optionB: "prevNode->next = prevNode->next->next;",
      optionC: "prevNode->next = nullptr;",
      optionD: "prevNode->next->next = prevNode;",
      correctAnswer: "B",
      explanation: "Assigning prevNode->next to prevNode->next->next bypasses the target node, effectively unlinking it from the chain.",
      difficulty: "MEDIUM",
      sourceReference: "Deletion Operations",
    },
    {
      questionText: "Given only a pointer to a node 'curr' (not the tail) in a Singly Linked List without access to the head, how can you delete it in O(1) time?",
      optionA: "Traverse backward using pointer arithmetic",
      optionB: "Copy curr->next->data into curr->data, then delete curr->next after bypassing it",
      optionC: "Set curr = nullptr",
      optionD: "It is mathematically impossible",
      correctAnswer: "B",
      explanation: "By copying the successor's data into the current node and then removing the successor node (curr->next = curr->next->next), the node is effectively deleted in O(1).",
      difficulty: "HARD",
      sourceReference: "Deletion Operations",
    },
    {
      questionText: "What happens if you execute 'delete head;' before reassigning 'head = head->next;' in C++?",
      optionA: "The list is safely reversed",
      optionB: "Accessing head->next causes Undefined Behavior / Read After Free (Dangling Pointer)",
      optionC: "The memory is automatically reclaimed by the OS safely",
      optionD: "The compiler will prevent the code from compiling",
      correctAnswer: "B",
      explanation: "Deleting head invalidates the node's memory. Reading head->next afterwards accesses freed memory, causing a classic Use-After-Free bug and possible segmentation fault.",
      difficulty: "HARD",
      sourceReference: "Deletion Operations",
    },

    // Sub-topic: Reversal & Pointer Manipulation (Q21 - Q24)
    {
      questionText: "How many pointers are traditionally maintained to reverse a Singly Linked List iteratively in O(1) space?",
      optionA: "One pointer (curr)",
      optionB: "Two pointers (curr, next)",
      optionC: "Three pointers (prev, curr, next)",
      optionD: "Four pointers (head, tail, prev, next)",
      correctAnswer: "C",
      explanation: "The standard iterative reversal uses three pointers: 'curr' (current node being processed), 'prev' (the reversed chain built so far), and 'next' (to preserve the forward list before reversing curr->next).",
      difficulty: "MEDIUM",
      sourceReference: "Reversal & Pointers",
    },
    {
      questionText: "What is the time and auxiliary space complexity of iteratively reversing a Singly Linked List of length n?",
      optionA: "Time: O(n), Space: O(1)",
      optionB: "Time: O(n), Space: O(n)",
      optionC: "Time: O(n^2), Space: O(1)",
      optionD: "Time: O(1), Space: O(n)",
      correctAnswer: "A",
      explanation: "The iterative 3-pointer algorithm visits every node exactly once (O(n) time) and modifies pointers in place without allocating new memory (O(1) space).",
      difficulty: "EASY",
      sourceReference: "Reversal & Pointers",
    },
    {
      questionText: "If a Singly Linked List is reversed recursively, what is the auxiliary space complexity incurred by the call stack?",
      optionA: "O(1)",
      optionB: "O(log n)",
      optionC: "O(n)",
      optionD: "O(n^2)",
      correctAnswer: "C",
      explanation: "Recursive reversal recurses all the way to the last node before unwinding, placing n stack frames onto the program execution call stack (O(n) auxiliary space).",
      difficulty: "MEDIUM",
      sourceReference: "Reversal & Pointers",
    },
    {
      questionText: "In the 3-pointer reversal algorithm, inside the while loop, which assignment must happen first before 'curr->next = prev'?",
      optionA: "prev = curr;",
      optionB: "next = curr->next;",
      optionC: "curr = next;",
      optionD: "head = prev;",
      correctAnswer: "B",
      explanation: "You must first save 'next = curr->next' because overwriting curr->next = prev immediately destroys the reference to the remainder of the list.",
      difficulty: "MEDIUM",
      sourceReference: "Reversal & Pointers",
    },

    // Sub-topic: Cycle Detection & Two-Pointer Techniques (Q25 - Q27)
    {
      questionText: "What is the name of the two-pointer cycle detection algorithm that uses a slow and fast pointer?",
      optionA: "Dijkstra's Shortest Path Algorithm",
      optionB: "Floyd's Tortoise and Hare Algorithm",
      optionC: "Kruskal's Minimum Spanning Tree",
      optionD: "Kadane's Algorithm",
      correctAnswer: "B",
      explanation: "Floyd's Cycle-Finding Algorithm (Tortoise and Hare) advances slow by 1 step and fast by 2 steps. If a cycle exists, they are guaranteed to meet inside the loop.",
      difficulty: "MEDIUM",
      sourceReference: "Cycle Detection & Two Pointers",
    },
    {
      questionText: "In Floyd's Cycle Detection, if the slow pointer moves 1 step per iteration, how many steps does the fast pointer move?",
      optionA: "1 step",
      optionB: "2 steps",
      optionC: "3 steps",
      optionD: "n steps",
      correctAnswer: "B",
      explanation: "The fast pointer moves at twice the speed of the slow pointer (2 steps per iteration), closing the relative distance between them in a loop by 1 node per iteration.",
      difficulty: "EASY",
      sourceReference: "Cycle Detection & Two Pointers",
    },
    {
      questionText: "How can you locate the middle node of a Singly Linked List in a single traversal pass?",
      optionA: "Count total nodes first, then iterate n/2 times",
      optionB: "Use slow moving 1 step and fast moving 2 steps; when fast reaches the end, slow is at the middle",
      optionC: "Use random pointer sampling",
      optionD: "Store all nodes in a binary search tree",
      correctAnswer: "B",
      explanation: "When the fast pointer reaches the end (fast == null or fast->next == null), the slow pointer will have traversed exactly half the distance, landing squarely on the middle node.",
      difficulty: "MEDIUM",
      sourceReference: "Cycle Detection & Two Pointers",
    },

    // Sub-topic: Applications & Comparative Engineering (Q28 - Q30)
    {
      questionText: "Which of the following real-world software components is most naturally implemented using a Doubly Linked List with a Hash Map?",
      optionA: "A Depth-First Search recursive stack",
      optionB: "An LRU (Least Recently Used) Cache",
      optionC: "A Binary Search sorted table",
      optionD: "An unweighted adjacency matrix",
      correctAnswer: "B",
      explanation: "An LRU cache pairs a Hash Map (for O(1) key lookups) with a Doubly Linked List (for O(1) removal and insertion of most/least recently used nodes).",
      difficulty: "HARD",
      sourceReference: "Applications & Engineering",
    },
    {
      questionText: "Why is a Circular Linked List frequently used in operating system process schedulers (e.g. Round Robin)?",
      optionA: "It sorts processes by CPU utilization",
      optionB: "It allows CPU time slices to cycle continuously among active processes without reaching a terminal null pointer",
      optionC: "It eliminates interrupt latency",
      optionD: "It uses zero memory for process control blocks",
      correctAnswer: "B",
      explanation: "Round-Robin scheduling allocates time slices circularly. A circular linked list allows the scheduler to loop through all active processes repeatedly without resetting pointers.",
      difficulty: "MEDIUM",
      sourceReference: "Applications & Engineering",
    },
    {
      questionText: "When implementing a Queue using a Singly Linked List with head and tail pointers, where should 'enqueue' and 'dequeue' occur for O(1) performance?",
      optionA: "Enqueue at head, Dequeue at tail",
      optionB: "Enqueue at tail, Dequeue at head",
      optionC: "Both at head",
      optionD: "Both at tail",
      correctAnswer: "B",
      explanation: "Enqueueing at the tail is O(1) because tail->next is updated. Dequeueing at the head is O(1) because head = head->next. Dequeueing at the tail in a singly linked list would require O(n) to find the predecessor.",
      difficulty: "HARD",
      sourceReference: "Applications & Engineering",
    },
  ];

  for (const q of questionsData) {
    await prisma.quizQuestion.create({
      data: {
        quizId: linkedListQuiz.id,
        competencyId: dsaComp.id,
        topic: q.sourceReference,
        questionText: q.questionText,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: q.difficulty,
        sourceReference: q.sourceReference,
        status: "APPROVED",
        qualityScore: 100.0,
      },
    });
  }

  // 7. Seed Demo Engineering Student: Harshal Patel (PRD §2, §14, §40)
  const passwordHash = await bcrypt.hash("Password@123", 10);
  const harshal = await prisma.user.upsert({
    where: { email: "harshal.patel@engg.edu" },
    update: {
      onboardingCompleted: true,
      branch: "Computer Engineering",
      year: "2nd Year",
      semester: "Semester 3",
      college: "Pune Institute of Computer Technology",
      graduationYear: "2026",
      skills: JSON.stringify([
        { name: "C++", level: "Intermediate" },
        { name: "Basic Programming", level: "Intermediate" },
        { name: "Python", level: "Beginner" },
      ]),
      referralSource: "YouTube",
      currentCourseId: "course_dsa",
      targetSkill: "Data Structures & Algorithms",
    },
    create: {
      email: "harshal.patel@engg.edu",
      passwordHash,
      name: "Harshal Patel",
      employeeId: "ENGG-2024-042",
      department: "Computer Engineering",
      designation: "Engineering Student",
      experienceLevel: "Intermediate",
      role: "LEARNER",
      dob: "2004-08-15",
      mobile: "+91 9876543210",
      gender: "Male",
      branch: "Computer Engineering",
      year: "2nd Year",
      semester: "Semester 3",
      college: "Pune Institute of Computer Technology",
      graduationYear: "2026",
      skills: JSON.stringify([
        { name: "C++", level: "Intermediate" },
        { name: "Basic Programming", level: "Intermediate" },
        { name: "Python", level: "Beginner" },
      ]),
      referralSource: "YouTube",
      onboardingCompleted: true,
      currentCourseId: "course_dsa",
      targetSkill: "Data Structures & Algorithms",
    },
  });

  // Seed Harshal's Roadmap Progress (PRD §2, §14):
  // 1. Programming Basics -> COMPLETED (from skills)
  // 2. Arrays -> COMPLETED (score 90%)
  // 3. Strings -> COMPLETED (score 85%)
  // 4. Linked List -> IN_PROGRESS (68% overall, ready for Quiz)
  // 5. Stack -> LOCKED
  await prisma.userTopicProgress.upsert({
    where: { userId_topicId: { userId: harshal.id, topicId: topicProgBasics.id } },
    update: { status: "COMPLETED", notesCompleted: true, videoCompleted: true, quizCompleted: true, bestQuizScore: 95 },
    create: { userId: harshal.id, topicId: topicProgBasics.id, status: "COMPLETED", notesCompleted: true, videoCompleted: true, quizCompleted: true, bestQuizScore: 95 },
  });

  await prisma.userTopicProgress.upsert({
    where: { userId_topicId: { userId: harshal.id, topicId: topicArrays.id } },
    update: { status: "COMPLETED", notesCompleted: true, videoCompleted: true, quizCompleted: true, bestQuizScore: 92 },
    create: { userId: harshal.id, topicId: topicArrays.id, status: "COMPLETED", notesCompleted: true, videoCompleted: true, quizCompleted: true, bestQuizScore: 92 },
  });

  await prisma.userTopicProgress.upsert({
    where: { userId_topicId: { userId: harshal.id, topicId: topicStrings.id } },
    update: { status: "COMPLETED", notesCompleted: true, videoCompleted: true, quizCompleted: true, bestQuizScore: 88 },
    create: { userId: harshal.id, topicId: topicStrings.id, status: "COMPLETED", notesCompleted: true, videoCompleted: true, quizCompleted: true, bestQuizScore: 88 },
  });

  await prisma.userTopicProgress.upsert({
    where: { userId_topicId: { userId: harshal.id, topicId: topicLinkedList.id } },
    update: { status: "IN_PROGRESS", notesCompleted: true, videoCompleted: true, quizCompleted: false, bestQuizScore: 0 },
    create: { userId: harshal.id, topicId: topicLinkedList.id, status: "IN_PROGRESS", notesCompleted: true, videoCompleted: true, quizCompleted: false, bestQuizScore: 0 },
  });

  await prisma.userTopicProgress.upsert({
    where: { userId_topicId: { userId: harshal.id, topicId: topicStack.id } },
    update: { status: "LOCKED" },
    create: { userId: harshal.id, topicId: topicStack.id, status: "LOCKED" },
  });

  console.log("Engineering courses, topics, 30-question Linked List quiz, and demo student seeded successfully!");
}
