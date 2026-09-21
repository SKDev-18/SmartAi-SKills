// Part 2: Python, Machine Learning, DBMS, Cloud DevOps
const topicContentDataPart2 = {
  // =========================================================================
  // 4. PYTHON FOR ENGINEERING
  // =========================================================================
  "python-fundamentals": {
    videos: [
      {
        title: "Python Fundamentals: Variables, Control Structures & Functions",
        youtubeUrl: "https://www.youtube.com/watch?v=kqtD5dpn9C8",
        duration: "24 min",
        channel: "Programming with Mosh",
        description: "Variables, dynamic typing, conditional branching, loops, and function parameters in Python.",
        learningObjective: "Master core Python syntax, PEP 8 standards, and variable scoping."
      }
    ],
    questions: [
      {
        questionText: "What does it mean that Python is dynamically typed?",
        optionA: "Variables can only store dynamic heap arrays.",
        optionB: "Variable types are checked and bound at runtime rather than declared explicitly at compile time.",
        optionC: "Python code compiles straight to x86 machine instructions.",
        optionD: "Variable names must start with a dollar sign.",
        correctAnswer: "B",
        explanation: "In Python, variable types are determined at runtime based on the assigned object value, without explicit type declarations.",
        difficulty: "EASY",
        sourceReference: "Python Type System"
      },
      {
        questionText: "What is the output of `bool([])`, `bool(0)`, and `bool('')` in Python?",
        optionA: "True, True, True",
        optionB: "False, False, False",
        optionC: "True, False, True",
        optionD: "Throws a TypeError",
        correctAnswer: "B",
        explanation: "Empty sequences (`[]`, `''`, `()`, `{}`) and numerical zero evaluate to `False` in boolean contexts (Falsy values).",
        difficulty: "EASY",
        sourceReference: "Truthy and Falsy Expressions"
      },
      {
        questionText: "What is the purpose of `*args` and `**kwargs` in Python function definitions?",
        optionA: "To specify pointers and pointer dereferencing as in C.",
        optionB: "`*args` allows passing variable positional arguments as a tuple, while `**kwargs` allows passing variable keyword arguments as a dictionary.",
        optionC: "To import modules dynamically from disk.",
        optionD: "To declare global variables.",
        correctAnswer: "B",
        explanation: "`*args` packs variable positional arguments into a tuple; `**kwargs` packs named keyword arguments into a dictionary.",
        difficulty: "MEDIUM",
        sourceReference: "Function Parameter Packing"
      },
      {
        questionText: "How does the LEGB rule determine variable scope lookup order in Python?",
        optionA: "Local -> Enclosing -> Global -> Built-in",
        optionB: "Linear -> Exponential -> Geometric -> Binary",
        optionC: "Loop -> Expression -> Generator -> Block",
        optionD: "Lowest -> Equal -> Greater -> Bound",
        correctAnswer: "A",
        explanation: "Python resolves identifiers using LEGB: Local scope first, then Enclosing function scopes, Global module scope, and finally Built-in namespace.",
        difficulty: "MEDIUM",
        sourceReference: "Python Scoping Rules"
      },
      {
        questionText: "What does the `pass` statement do in Python?",
        optionA: "Terminates the program with exit code 0.",
        optionB: "Acts as a syntactic null statement where a statement is required syntactically, doing nothing.",
        optionC: "Skips to the next iteration of an outer loop.",
        optionD: "Returns control to the operating system.",
        correctAnswer: "B",
        explanation: "`pass` is a placeholder that does nothing when executed, used where code is syntactically required (e.g. empty function or class stub).",
        difficulty: "EASY",
        sourceReference: "Control Flow Statements"
      }
    ]
  },

  "python-collections": {
    videos: [
      {
        title: "Python Data Structures: Lists, Tuples, Dictionaries & Sets",
        youtubeUrl: "https://www.youtube.com/watch?v=daefaLgNkw0",
        duration: "25 min",
        channel: "Corey Schafer",
        description: "Deep dive into Python collection types, dictionary hashing, set operations, and time complexities.",
        learningObjective: "Select optimal Python collections based on membership testing, order preservation, and mutation requirements."
      }
    ],
    questions: [
      {
        questionText: "What is the difference between a Python `set` and a `list`?",
        optionA: "Sets are ordered and allow duplicates; lists are unordered.",
        optionB: "Sets store unique, unordered elements with O(1) average lookup time; lists are ordered and allow duplicates with O(N) lookup.",
        optionC: "Lists cannot store strings, while sets can.",
        optionD: "Sets require compiling with Cython.",
        correctAnswer: "B",
        explanation: "Sets use hash tables to guarantee unique elements and provide average O(1) membership testing (`in`), while lists preserve insertion order with O(N) search.",
        difficulty: "EASY",
        sourceReference: "Collections & Sets"
      },
      {
        questionText: "Why cannot a Python list be used as a key in a standard `dict`?",
        optionA: "Because lists are mutable and therefore do not possess a stable `__hash__` value.",
        optionB: "Because dictionaries only support integer keys.",
        optionC: "Because lists require too much heap memory.",
        optionD: "Because Python dictionaries automatically convert all keys to floats.",
        correctAnswer: "A",
        explanation: "Dictionary keys must be hashable and immutable. Since lists can be modified in-place, their hash value would change, corrupting the hash table.",
        difficulty: "MEDIUM",
        sourceReference: "Hashable Types"
      },
      {
        questionText: "What does the `collections.defaultdict` provide over a regular `dict` in Python?",
        optionA: "It sorts keys alphabetically automatically.",
        optionB: "It supplies a default value when a non-existent key is accessed, avoiding a `KeyError`.",
        optionC: "It encrypts dictionary entries in RAM.",
        optionD: "It runs on multiple CPU cores.",
        correctAnswer: "B",
        explanation: "`defaultdict(factory)` automatically initializes missing keys with the callable factory return value (e.g. `list`, `int`), simplifying accumulation logic.",
        difficulty: "EASY",
        sourceReference: "Python Collections Module"
      },
      {
        questionText: "What is the result of `set1 & set2` in Python?",
        optionA: "The union of both sets.",
        optionB: "The intersection of both sets (elements present in both).",
        optionC: "The symmetric difference of both sets.",
        optionD: "A concatenation of set elements.",
        correctAnswer: "B",
        explanation: "The `&` operator computes set intersection, returning elements that exist in both operands.",
        difficulty: "EASY",
        sourceReference: "Set Operations"
      },
      {
        questionText: "What is the time complexity of `list.pop(0)` versus `list.pop()` in Python?",
        optionA: "`list.pop(0)` is O(N) because it shifts all remaining elements; `list.pop()` is O(1) because it removes the end element.",
        optionB: "Both are O(1).",
        optionC: "Both are O(N).",
        optionD: "`list.pop()` is O(N log N).",
        correctAnswer: "A",
        explanation: "Removing from index 0 requires shifting all N-1 subsequent elements to the left, while popping the last element requires no shifting.",
        difficulty: "MEDIUM",
        sourceReference: "List Operation Time Complexity"
      }
    ]
  },

  "python-oop": {
    videos: [
      {
        title: "Object-Oriented Programming (OOP) in Python",
        youtubeUrl: "https://www.youtube.com/watch?v=ZDa-Z5JzLYM",
        duration: "27 min",
        channel: "Corey Schafer",
        description: "Classes, instances, inheritance, classmethods vs staticmethods, dunder methods, and property decorators.",
        learningObjective: "Implement encapsulation, polymorphism, inheritance, and clean OOP abstractions in Python."
      }
    ],
    questions: [
      {
        questionText: "What is the role of the `self` parameter in Python class instance methods?",
        optionA: "It refers to the parent superclass.",
        optionB: "It is an explicit reference to the specific instance of the class invoking the method.",
        optionC: "It allocates new heap memory.",
        optionD: "It is an optional keyword for multi-threading.",
        correctAnswer: "B",
        explanation: "Python passes the instance object explicitly as the first argument to instance methods, conventionally named `self`.",
        difficulty: "EASY",
        sourceReference: "Python Class Instances"
      },
      {
        questionText: "What is the purpose of Python Dunder (Double Underscore) magic methods such as `__init__` and `__str__`?",
        optionA: "They define private variables that cannot be read.",
        optionB: "They allow classes to hook into built-in Python behaviors, operators, string representations, and object initialization.",
        optionC: "They are deprecated features from Python 1.0.",
        optionD: "They compile classes into C code.",
        correctAnswer: "B",
        explanation: "Dunder methods (like `__init__`, `__len__`, `__str__`, `__eq__`) implement operator overloading and lifecycle protocols.",
        difficulty: "EASY",
        sourceReference: "Special Dunder Methods"
      },
      {
        questionText: "What distinguishes a `@classmethod` from a `@staticmethod` in Python?",
        optionA: "`@classmethod` takes the class `cls` as its first implicit parameter, whereas `@staticmethod` receives no implicit class or instance argument.",
        optionB: "`@staticmethod` can only be invoked from within the class file.",
        optionC: "`@classmethod` cannot return a value.",
        optionD: "There is no difference.",
        correctAnswer: "A",
        explanation: "`@classmethod` receives the class object `cls` (useful for alternative constructors); `@staticmethod` behaves like a plain function placed in class namespace.",
        difficulty: "MEDIUM",
        sourceReference: "Python Decorators & Classmethods"
      },
      {
        questionText: "How does Python resolve method calls in multiple inheritance?",
        optionA: "It throws an ambiguity compiler error.",
        optionB: "Using the C3 Linearization algorithm to determine the Method Resolution Order (MRO).",
        optionC: "It calls whichever method was defined first alphabetically.",
        optionD: "It runs all matching parent methods in parallel threads.",
        correctAnswer: "B",
        explanation: "Python uses C3 linearization to produce a deterministic Method Resolution Order (MRO), accessible via `ClassName.mro()`.",
        difficulty: "HARD",
        sourceReference: "Method Resolution Order (MRO)"
      },
      {
        questionText: "What does the `@property` decorator accomplish in Python?",
        optionA: "Converts a method into a read-only getter attribute, allowing access using attribute syntax without parentheses.",
        optionB: "Exports the class to a database schema.",
        optionC: "Locks the object against garbage collection.",
        optionD: "Renders the attribute in an HTML template.",
        correctAnswer: "A",
        explanation: "`@property` enables pythonic getters and setters, allowing methods to be accessed cleanly as attributes while preserving encapsulation.",
        difficulty: "EASY",
        sourceReference: "Python Properties & Encapsulation"
      }
    ]
  },

  "python-files-modules": {
    videos: [
      {
        title: "Python File I/O, Modules & Exception Handling",
        youtubeUrl: "https://www.youtube.com/watch?v=NIWwJbo-9_8",
        duration: "23 min",
        channel: "Corey Schafer",
        description: "Context managers (`with` open), reading/writing files, custom exceptions, try/except/finally, and packaging.",
        learningObjective: "Handle file streams safely with context managers, structure reusable modules, and implement robust error recovery."
      }
    ],
    questions: [
      {
        questionText: "Why is it best practice to use the `with open('file.txt', 'r') as f:` statement when working with files in Python?",
        optionA: "It compresses the file automatically.",
        optionB: "It uses a context manager that guarantees the file descriptor is properly closed even if an unhandled exception occurs.",
        optionC: "It executes the read operation in kernel mode.",
        optionD: "It bypasses file system permission checks.",
        correctAnswer: "B",
        explanation: "The `with` statement leverages context managers (`__enter__` and `__exit__`), ensuring resources are freed and files closed even upon exceptions.",
        difficulty: "EASY",
        sourceReference: "Context Managers & File I/O"
      },
      {
        questionText: "In a Python `try...except...else...finally` block, when does the `else` clause execute?",
        optionA: "Only when an exception was raised and caught.",
        optionB: "Only when NO exception was raised in the `try` block.",
        optionC: "Every single time, right before `finally`.",
        optionD: "Only when the program runs out of memory.",
        correctAnswer: "B",
        explanation: "The `else` block executes only if the code in the `try` block ran to completion without raising any exceptions.",
        difficulty: "MEDIUM",
        sourceReference: "Exception Handling Flow"
      },
      {
        questionText: "What is the purpose of the `if __name__ == '__main__':` idiom in Python scripts?",
        optionA: "It checks whether the script is running with root administrator privileges.",
        optionB: "It ensures that code inside this block only executes when the file is run directly as a script, not when imported as a module.",
        optionC: "It verifies that Python is version 3.x.",
        optionD: "It loads environment variables from disk.",
        correctAnswer: "B",
        explanation: "When run directly, Python sets `__name__` to `'__main__'`. When imported, `__name__` is the module's name, preventing unintended top-level execution.",
        difficulty: "EASY",
        sourceReference: "Python Module Execution"
      },
      {
        questionText: "Which built-in module is used to serialize and deserialize arbitrary Python objects into binary byte streams?",
        optionA: "json",
        optionB: "pickle",
        optionC: "csv",
        optionD: "hashlib",
        correctAnswer: "B",
        explanation: "The `pickle` module implements binary protocols for serializing and de-serializing complex Python object hierarchies.",
        difficulty: "MEDIUM",
        sourceReference: "Object Serialization"
      },
      {
        questionText: "How do you define a custom exception class in Python?",
        optionA: "By defining a function named `Exception()`.",
        optionB: "By creating a class that inherits from the built-in `Exception` (or a subclass of it).",
        optionC: "By modifying the Python interpreter bytecode.",
        optionD: "By setting `sys.error = True`.",
        correctAnswer: "B",
        explanation: "Custom exceptions in Python are created by subclassing `Exception` (e.g. `class ValidationError(Exception): pass`).",
        difficulty: "EASY",
        sourceReference: "Custom Exceptions"
      }
    ]
  },

  "python-automation": {
    videos: [
      {
        title: "Python Automation & Scripting Projects",
        youtubeUrl: "https://www.youtube.com/watch?v=PXMJ6FS7llk",
        duration: "26 min",
        channel: "Tech With Tim",
        description: "Automating repetitive workflows, web scraping with BeautifulSoup, API calls with requests, and OS scripting.",
        learningObjective: "Write robust automation scripts for file organization, API consumption, and batch data processing."
      }
    ],
    questions: [
      {
        questionText: "Which Python standard library module is used for interacting with the operating system filesystem, environment variables, and paths?",
        optionA: "math",
        optionB: "os and pathlib",
        optionC: "random",
        optionD: "sqlite3",
        correctAnswer: "B",
        explanation: "`os` and modern `pathlib` provide cross-platform methods for directory traversal, environment access, and file operations.",
        difficulty: "EASY",
        sourceReference: "Python OS Operations"
      },
      {
        questionText: "What library is widely used in Python for sending HTTP requests (GET, POST) with simple, human-friendly syntax?",
        optionA: "requests",
        optionB: "numpy",
        optionC: "matplotlib",
        optionD: "tensorflow",
        correctAnswer: "A",
        explanation: "The `requests` library is the standard for crafting HTTP requests, handling authentication, cookies, and JSON payloads.",
        difficulty: "EASY",
        sourceReference: "HTTP Client Libraries"
      },
      {
        questionText: "When parsing HTML data in web scraping automation, what is the role of BeautifulSoup?",
        optionA: "To compile HTML into WebAssembly.",
        optionB: "To parse HTML/XML documents into a navigable Python tree structure for element searching and extraction.",
        optionC: "To bypass CAPTCHA validations.",
        optionD: "To execute JavaScript in headless Chromium.",
        correctAnswer: "B",
        explanation: "BeautifulSoup parses messy HTML/XML into a tree structure, allowing developers to query tags by CSS class, ID, or attributes.",
        difficulty: "EASY",
        sourceReference: "Web Scraping Architecture"
      },
      {
        questionText: "Which module in Python allows executing external operating system commands and capturing their standard output/error?",
        optionA: "subprocess",
        optionB: "sys.exit",
        optionC: "datetime",
        optionD: "collections",
        correctAnswer: "A",
        explanation: "`subprocess.run()` spawns new OS processes, connects to their pipes, and obtains their return codes and output.",
        difficulty: "MEDIUM",
        sourceReference: "OS Process Management"
      },
      {
        questionText: "What is the best way to schedule a recurring Python automation script on a Linux server?",
        optionA: "Using a `while True: time.sleep(86400)` loop.",
        optionB: "Using the system `cron` daemon (crontab) or systemd timers.",
        optionC: "Keeping an open browser tab.",
        optionD: "Rebooting the server daily.",
        correctAnswer: "B",
        explanation: "The OS `cron` daemon is the standard, reliable Linux scheduler for running unattended recurring background tasks without keeping a process alive in memory.",
        difficulty: "EASY",
        sourceReference: "Linux Job Scheduling"
      }
    ]
  },

  // =========================================================================
  // 5. MACHINE LEARNING & AI
  // =========================================================================
  "ml-foundations": {
    videos: [
      {
        title: "Linear Algebra & Calculus Foundations for Machine Learning",
        youtubeUrl: "https://www.youtube.com/watch?v=fNk_zzaMoSs",
        duration: "25 min",
        channel: "3Blue1Brown",
        description: "Vector spaces, dot products, eigenvalues/eigenvectors, matrix transformations, and gradient vectors.",
        learningObjective: "Understand vector projections, matrix rank, partial derivatives, and gradient descent geometry."
      }
    ],
    questions: [
      {
        questionText: "What does the gradient vector (nabla f) of a multi-variable function represent geometrically?",
        optionA: "The direction of steepest decrease of the function.",
        optionB: "The direction of steepest ascent of the function, with magnitude equal to the rate of increase in that direction.",
        optionC: "The global minimum coordinates.",
        optionD: "The matrix determinant.",
        correctAnswer: "B",
        explanation: "The gradient points in the direction of greatest rate of increase; Gradient Descent moves in the negative gradient direction (-nabla f) to minimize loss.",
        difficulty: "MEDIUM",
        sourceReference: "Multivariable Calculus"
      },
      {
        questionText: "What is an Eigenvector v and corresponding Eigenvalue lambda of a square matrix A?",
        optionA: "A vector that becomes zero when multiplied by A.",
        optionB: "A non-zero vector whose direction remains unchanged when transformed by A, being only scaled by factor lambda: A*v = lambda*v.",
        optionC: "The inverse of matrix A.",
        optionD: "The diagonal transpose of A.",
        correctAnswer: "B",
        explanation: "Eigenvectors represent invariant axes under a linear transformation A; the transformation stretches or shrinks them by scalar factor lambda without rotating them.",
        difficulty: "MEDIUM",
        sourceReference: "Linear Algebra Spectral Theory"
      },
      {
        questionText: "What linear algebra operation is used in Principal Component Analysis (PCA) to find directions of maximum variance?",
        optionA: "Singular Value Decomposition (SVD) or Eigendecomposition of the covariance matrix.",
        optionB: "Gaussian Elimination.",
        optionC: "Cramer's Rule.",
        optionD: "Matrix inversion using determinants.",
        correctAnswer: "A",
        explanation: "PCA diagonalizes the data covariance matrix; the eigenvectors corresponding to the largest eigenvalues represent the principal components of greatest variance.",
        difficulty: "HARD",
        sourceReference: "Dimensionality Reduction"
      },
      {
        questionText: "What does it mean for two non-zero vectors u and v to be orthogonal?",
        optionA: "Their cross product is 1.",
        optionB: "Their dot product equals zero (u . v = 0), meaning they are perpendicular at 90 degrees.",
        optionC: "They have identical magnitudes.",
        optionD: "Their sum equals the identity vector.",
        correctAnswer: "B",
        explanation: "Two vectors are orthogonal when their inner product is zero: u . v = ||u|| ||v|| cos(theta) = 0 implies cos(theta) = 0 (theta = 90 degrees).",
        difficulty: "EASY",
        sourceReference: "Vector Spaces"
      },
      {
        questionText: "In linear regression, what is the closed-form Normal Equation for the optimal weights w?",
        optionA: "w = (X^T * X)^(-1) * X^T * y",
        optionB: "w = X * y",
        optionC: "w = y^T * X",
        optionD: "w = det(X) * y",
        correctAnswer: "A",
        explanation: "Setting the gradient of the sum of squared errors to zero yields the ordinary least squares normal equation: w = (X^T X)^(-1) X^T y.",
        difficulty: "MEDIUM",
        sourceReference: "Ordinary Least Squares (OLS)"
      }
    ]
  },

  "supervised-learning": {
    videos: [
      {
        title: "Supervised Learning: Linear Regression & Regularization (L1/L2)",
        youtubeUrl: "https://www.youtube.com/watch?v=7ArmBVF2dCs",
        duration: "26 min",
        channel: "StatQuest with Josh Starmer",
        description: "Cost functions (MSE), gradient descent convergence, learning rates, Ridge (L2), and Lasso (L1) regularization.",
        learningObjective: "Formulate loss functions, train regression models, and prevent overfitting via regularization penalties."
      }
    ],
    questions: [
      {
        questionText: "What is the primary difference between L1 (Lasso) and L2 (Ridge) regularization penalties?",
        optionA: "L1 adds squared weights; L2 adds absolute weights.",
        optionB: "L1 adds the sum of absolute values of weights (|w|), driving irrelevant feature weights to exactly zero for feature selection; L2 adds squared weights (w^2), shrinking weights toward zero without setting them to exact zero.",
        optionC: "L1 can only be applied to neural networks.",
        optionD: "L2 eliminates all model bias.",
        correctAnswer: "B",
        explanation: "L1 regularization produces sparse models by zeroing out coefficients (feature selection). L2 penalizes large weights smoothly, combating multicollinearity.",
        difficulty: "MEDIUM",
        sourceReference: "Regularization Techniques"
      },
      {
        questionText: "What problem occurs if the Learning Rate in Gradient Descent is set excessively high?",
        optionA: "The model converges in a single step.",
        optionB: "The optimization steps overshoot the loss valley, causing oscillations or divergence away from the minimum.",
        optionC: "Memory consumption exceeds GPU capacity.",
        optionD: "The model underfits due to zero weights.",
        correctAnswer: "B",
        explanation: "An excessively large learning rate causes step sizes that overshoot the local minimum, leading to divergent cost function values.",
        difficulty: "EASY",
        sourceReference: "Gradient Descent Optimization"
      },
      {
        questionText: "What is the Mean Squared Error (MSE) loss function for N training examples?",
        optionA: "MSE = (1/N) * sum((y_actual - y_predicted)^2)",
        optionB: "MSE = sum(|y_actual - y_predicted|)",
        optionC: "MSE = max(y_actual) - min(y_predicted)",
        optionD: "MSE = (y_actual / y_predicted)",
        correctAnswer: "A",
        explanation: "MSE computes the average squared difference between estimated values and the actual target ground truth.",
        difficulty: "EASY",
        sourceReference: "Regression Loss Metrics"
      },
      {
        questionText: "What does the Bias-Variance Tradeoff describe in machine learning?",
        optionA: "The trade-off between training speed and GPU cost.",
        optionB: "High bias causes underfitting (oversimplified assumptions), while high variance causes overfitting (sensitivity to training noise); optimal models minimize total error.",
        optionC: "The ratio between classification and regression accuracy.",
        optionD: "The balance between RAM and CPU usage.",
        correctAnswer: "B",
        explanation: "Expected prediction error equals Bias^2 + Variance + Irreducible Error. Balancing model complexity minimizes both underfitting and overfitting.",
        difficulty: "MEDIUM",
        sourceReference: "Bias-Variance Tradeoff"
      },
      {
        questionText: "Why must continuous features be scaled (e.g. StandardScaler or MinMaxScaler) prior to training gradient-based or distance-based algorithms?",
        optionA: "Because computers cannot process numbers with different decimal places.",
        optionB: "Features with much larger numerical scales dominate distance calculations and cause elongated, slow zig-zagging gradient descent trajectories.",
        optionC: "Feature scaling converts regression into classification.",
        optionD: "Scaling removes all duplicate records.",
        correctAnswer: "B",
        explanation: "Gradient descent converges significantly faster when contours are spherical rather than elongated ellipses caused by disparate feature scales.",
        difficulty: "MEDIUM",
        sourceReference: "Feature Preprocessing"
      }
    ]
  },

  "classification-eval": {
    videos: [
      {
        title: "Classification & Model Evaluation: Logistic Regression & ROC-AUC",
        youtubeUrl: "https://www.youtube.com/watch?v=yIYKR4sgzI8",
        duration: "24 min",
        channel: "StatQuest with Josh Starmer",
        description: "Logistic regression sigmoid mapping, log-loss, Confusion Matrix, Precision, Recall, F1-score, and ROC-AUC curves.",
        learningObjective: "Evaluate classification models using confusion matrices, precision-recall tradeoffs, and ROC curves."
      }
    ],
    questions: [
      {
        questionText: "What is the function of the Sigmoid activation function in binary Logistic Regression?",
        optionA: "It computes the derivative of the cost function.",
        optionB: "It maps any real-valued linear output z into a valid probability range between 0 and 1: sigma(z) = 1 / (1 + e^(-z)).",
        optionC: "It normalizes matrix weights to unit length.",
        optionD: "It sorts classification classes alphabetically.",
        correctAnswer: "B",
        explanation: "The sigmoid logistic function converts unbounded log-odds z into probabilities strictly bounded in (0, 1).",
        difficulty: "EASY",
        sourceReference: "Logistic Regression"
      },
      {
        questionText: "In medical disease diagnosis where missing a sick patient (False Negative) has catastrophic consequences, which metric should be prioritized?",
        optionA: "Accuracy",
        optionB: "Recall (Sensitivity)",
        optionC: "Precision",
        optionD: "Specificity",
        correctAnswer: "B",
        explanation: "Recall = TP / (TP + FN). Maximizing recall minimizes False Negatives, ensuring as many positive cases as possible are identified.",
        difficulty: "EASY",
        sourceReference: "Model Evaluation Metrics"
      },
      {
        questionText: "Why is Accuracy an unreliable evaluation metric for highly imbalanced datasets (e.g. fraud detection with 99.9% non-fraud cases)?",
        optionA: "Accuracy cannot be computed with floating-point values.",
        optionB: "A trivial model predicting the majority class 100% of the time achieves 99.9% accuracy while completely failing to detect any fraud.",
        optionC: "Accuracy requires balanced GPU memory.",
        optionD: "Accuracy is only defined for multi-class problems.",
        correctAnswer: "B",
        explanation: "Class imbalance distorts accuracy; metrics like Precision, Recall, F1-Score, and PR-AUC reflect performance on the minority class accurately.",
        difficulty: "MEDIUM",
        sourceReference: "Imbalanced Classification"
      },
      {
        questionText: "What does an Area Under the ROC Curve (ROC-AUC) of 0.5 represent?",
        optionA: "A perfect classifier.",
        optionB: "A model with performance no better than random guessing.",
        optionC: "A model with 100% precision.",
        optionD: "An invalid ROC curve.",
        correctAnswer: "B",
        explanation: "The ROC curve plots True Positive Rate vs False Positive Rate across all thresholds. An AUC of 0.5 represents a diagonal line equivalent to random coin tossing.",
        difficulty: "EASY",
        sourceReference: "ROC Analysis"
      },
      {
        questionText: "What is the formula for the F1-Score?",
        optionA: "F1 = (Precision + Recall) / 2",
        optionB: "F1 = 2 * (Precision * Recall) / (Precision + Recall) (Harmonic Mean)",
        optionC: "F1 = Precision * Recall",
        optionD: "F1 = sqrt(Precision^2 + Recall^2)",
        correctAnswer: "B",
        explanation: "F1 is the harmonic mean of precision and recall, penalizing extreme trade-offs where one metric is high and the other is low.",
        difficulty: "MEDIUM",
        sourceReference: "F1-Score Formulation"
      }
    ]
  },

  "unsupervised-clustering": {
    videos: [
      {
        title: "Unsupervised Learning: K-Means, DBSCAN & Hierarchical Clustering",
        youtubeUrl: "https://www.youtube.com/watch?v=4b5d3muPQmA",
        duration: "26 min",
        channel: "StatQuest with Josh Starmer",
        description: "Centroid assignment, inertia, elbow method, density-based DBSCAN, and silhouette coefficient evaluation.",
        learningObjective: "Implement unsupervised clustering algorithms, evaluate cluster quality, and handle arbitrary spatial geometries."
      }
    ],
    questions: [
      {
        questionText: "What are the iterative steps of the K-Means clustering algorithm after initial centroid initialization?",
        optionA: "Sort all data points, compute gradient descent, and split classes in half.",
        optionB: "1. Assign each data point to its nearest centroid. 2. Recompute centroids as the mean of all points assigned to that cluster. Repeat until convergence.",
        optionC: "Calculate decision tree splits using Gini impurity.",
        optionD: "Multiply data matrix by its inverse transpose.",
        correctAnswer: "B",
        explanation: "K-Means alternates between cluster assignment (minimizing within-cluster distances) and centroid update (calculating mean vectors) until centroids stabilize.",
        difficulty: "EASY",
        sourceReference: "K-Means Mechanics"
      },
      {
        questionText: "What technique is commonly used to select the optimal number of clusters K in K-Means?",
        optionA: "Cross-validation accuracy score",
        optionB: "The Elbow Method on Within-Cluster Sum of Squares (Inertia) alongside Silhouette Analysis",
        optionC: "R-squared value",
        optionD: "P-value t-test",
        correctAnswer: "B",
        explanation: "The elbow method plots inertia against K to spot the point of diminishing returns, corroborated by silhouette coefficients.",
        difficulty: "EASY",
        sourceReference: "Cluster Hyperparameter Selection"
      },
      {
        questionText: "What is a major advantage of DBSCAN (Density-Based Spatial Clustering) over K-Means?",
        optionA: "DBSCAN requires fewer dimensions.",
        optionB: "DBSCAN can identify clusters of arbitrary non-spherical shapes and automatically marks isolated sparse points as noise/outliers without requiring K beforehand.",
        optionC: "DBSCAN always runs in O(1) time.",
        optionD: "DBSCAN only works on text data.",
        correctAnswer: "B",
        explanation: "DBSCAN groups densely packed points together and marks outliers as noise, succeeding where K-Means fails on non-convex geometric shapes.",
        difficulty: "MEDIUM",
        sourceReference: "DBSCAN Density Clustering"
      },
      {
        questionText: "What does a Silhouette Score near +1.0 indicate for a clustered data point?",
        optionA: "The point is an extreme outlier.",
        optionB: "The point is well matched to its assigned cluster and poorly matched to neighboring clusters.",
        optionC: "The algorithm failed to converge.",
        optionD: "The point belongs to multiple overlapping clusters.",
        correctAnswer: "B",
        explanation: "Silhouette score ranges from -1 to +1; a value near +1 indicates the point is dense within its cluster and far separated from other clusters.",
        difficulty: "MEDIUM",
        sourceReference: "Silhouette Analysis"
      },
      {
        questionText: "Why is K-Means sensitive to initial random centroid placement (solved by K-Means++)?",
        optionA: "Random points may cause memory segmentation faults.",
        optionB: "Poor initialization can trap the algorithm in sub-optimal local minima; K-Means++ seeds centroids far apart from each other with probability proportional to squared distance.",
        optionC: "Random points change the dataset values.",
        optionD: "K-Means++ forces K to equal 2.",
        correctAnswer: "B",
        explanation: "Standard random initialization can place centroids close together, converging to poor local minima. K-Means++ spaces initial centroids out probabilitistically.",
        difficulty: "HARD",
        sourceReference: "K-Means++ Initialization"
      }
    ]
  },

  "deep-learning-intro": {
    videos: [
      {
        title: "Deep Learning & Neural Networks: Backpropagation & Activations",
        youtubeUrl: "https://www.youtube.com/watch?v=aircAruvnKk",
        duration: "28 min",
        channel: "3Blue1Brown",
        description: "Perceptrons, multi-layer perceptrons (MLP), activation functions (ReLU, Softmax), backpropagation calculus, and chain rule.",
        learningObjective: "Understand feedforward propagation, chain rule backpropagation, vanishing gradients, and loss descent."
      }
    ],
    questions: [
      {
        questionText: "Why are non-linear activation functions (like ReLU, GELU, or Sigmoid) essential in Deep Neural Networks?",
        optionA: "Without non-linear activations, composing multiple linear layers mathematically collapses into a single linear transformation, unable to learn complex non-linear patterns.",
        optionB: "They prevent GPU hardware overheating.",
        optionC: "They convert all weights into integers.",
        optionD: "They eliminate the need for training data.",
        correctAnswer: "A",
        explanation: "A composition of linear functions W2*(W1*x + b1) + b2 is simply another linear function W'*x + b'. Non-linear activations grant universal approximation capability.",
        difficulty: "MEDIUM",
        sourceReference: "Universal Approximation Theorem"
      },
      {
        questionText: "What is Backpropagation in neural network training?",
        optionA: "Reversing the order of dataset input rows.",
        optionB: "The application of the calculus Chain Rule to compute the partial derivative of the loss function with respect to every weight and bias in the network from output back to input.",
        optionC: "A hardware cache flush.",
        optionD: "Converting floating point tensors into strings.",
        correctAnswer: "B",
        explanation: "Backpropagation propagates errors backwards using the chain rule, enabling gradient descent to update every parameter proportional to its contribution to error.",
        difficulty: "MEDIUM",
        sourceReference: "Backpropagation Algorithm"
      },
      {
        questionText: "What is the Vanishing Gradient Problem commonly encountered with deep networks using Sigmoid activations?",
        optionA: "Gradients become too large, causing integer overflow.",
        optionB: "The derivative of the sigmoid saturates near 0 for large positive or negative inputs, causing multiplied gradients to shrink exponentially in early layers, stalling learning.",
        optionC: "The learning rate becomes negative.",
        optionD: "Weights are set to NaN.",
        correctAnswer: "B",
        explanation: "Sigmoid derivative max is 0.25. Repeatedly multiplying values < 0.25 across deep layers causes gradients to vanish to zero before reaching early layers.",
        difficulty: "HARD",
        sourceReference: "Vanishing Gradients & ReLU"
      },
      {
        questionText: "What is the purpose of the Softmax function in the output layer of a multi-class neural network?",
        optionA: "To compress image resolutions.",
        optionB: "To normalize an unconstrained vector of real-valued logits into a probability distribution where all entries are positive and sum to 1.",
        optionC: "To compute the mean squared error.",
        optionD: "To drop 50% of random neurons.",
        correctAnswer: "B",
        explanation: "Softmax exponentiates logits and divides by the sum of exponentials, producing normalized class probabilities that sum to 1.0.",
        difficulty: "EASY",
        sourceReference: "Softmax Activation"
      },
      {
        questionText: "What is Dropout in deep learning?",
        optionA: "Discarding entire training epochs.",
        optionB: "A regularization technique that randomly deactivates (zeroes out) a fraction of neurons during each forward-backward training pass to prevent co-adaptation of features.",
        optionC: "Deleting rows with missing values.",
        optionD: "Lowering the CPU clock frequency.",
        correctAnswer: "B",
        explanation: "Dropout acts as an ensemble method by training a different thinned sub-network on each iteration, drastically reducing overfitting.",
        difficulty: "EASY",
        sourceReference: "Dropout Regularization"
      }
    ]
  }
};

module.exports = { topicContentDataPart2 };
