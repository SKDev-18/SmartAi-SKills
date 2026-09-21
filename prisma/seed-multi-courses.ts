import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedMultiCourses() {
  console.log("Seeding Multiple Engineering Courses & Roadmaps...");

  // Ensure default progression threshold
  const existingThreshold = await prisma.progressionThreshold.findFirst();
  if (!existingThreshold) {
    await prisma.progressionThreshold.create({
      data: {
        name: "Standard Engineering Adaptive Rule",
        relearnThreshold: 60.0,
        retryThreshold: 80.0,
        masteryThreshold: 90.0,
      },
    });
  }

  // Find or create default competency for questions
  let comp = await prisma.competency.findFirst({
    where: { code: "DATA_ANALYSIS_PANDAS" },
  });
  if (!comp) {
    comp = await prisma.competency.create({
      data: {
        code: "DATA_ANALYSIS_PANDAS",
        name: "Data Analysis & Manipulation",
        domain: "Data Analysis",
        description: "Data manipulation, transformation, filtering, and aggregation using Pandas and SQL.",
        targetLevel: 80.0,
      },
    });
  }

  // =========================================================================
  // 1. DATA ANALYTICS COURSE
  // =========================================================================
  let daCourse = await prisma.course.findUnique({ where: { slug: "data-analytics" } });
  if (!daCourse) {
    daCourse = await prisma.course.create({
      data: {
        id: "course_data_analytics",
        title: "Data Analytics",
        slug: "data-analytics",
        description: "Comprehensive end-to-end data analytics curriculum: Python, NumPy, Pandas, Data Cleaning, SQL, Statistics, Data Visualization, and Capstone Projects.",
        category: "Data",
        branch: "Computer Engineering",
        targetAudience: "Engineering Students & Aspiring Data Analysts",
        icon: "BarChart3",
      },
    });
  }

  // Modules for Data Analytics
  let daMod1 = await prisma.courseModule.findFirst({
    where: { courseId: daCourse.id, order: 1 },
  });
  if (!daMod1) {
    daMod1 = await prisma.courseModule.create({
      data: {
        courseId: daCourse.id,
        title: "1. Python & Numerical Computing",
        order: 1,
      },
    });
  }

  let daMod2 = await prisma.courseModule.findFirst({
    where: { courseId: daCourse.id, order: 2 },
  });
  if (!daMod2) {
    daMod2 = await prisma.courseModule.create({
      data: {
        courseId: daCourse.id,
        title: "2. Data Manipulation & Wrangling",
        order: 2,
      },
    });
  }

  let daMod3 = await prisma.courseModule.findFirst({
    where: { courseId: daCourse.id, order: 3 },
  });
  if (!daMod3) {
    daMod3 = await prisma.courseModule.create({
      data: {
        courseId: daCourse.id,
        title: "3. Database Querying & Statistical Foundations",
        order: 3,
      },
    });
  }

  let daMod4 = await prisma.courseModule.findFirst({
    where: { courseId: daCourse.id, order: 4 },
  });
  if (!daMod4) {
    daMod4 = await prisma.courseModule.create({
      data: {
        courseId: daCourse.id,
        title: "4. Visualization & Capstone Projects",
        order: 4,
      },
    });
  }

  // Topic 1: Python Basics
  let tPython = await prisma.topic.findUnique({ where: { slug: "python-basics" } });
  if (!tPython) {
    tPython = await prisma.topic.create({
      data: {
        moduleId: daMod1.id,
        title: "Python Basics",
        slug: "python-basics",
        order: 1,
        estimatedTime: "40 mins",
        description: "Variables, data types, lists, dictionaries, control flow, functions, and list comprehensions.",
        notesContent: `# Python Basics for Data Analytics

## 1. Core Data Types & Collections
- **Lists**: Ordered, mutable sequence (\`[1, 2, 3]\`). Methods: \`.append()\`, \`.extend()\`, \`.pop()\`.
- **Tuples**: Ordered, immutable sequence (\`(1, 2, 3)\`). Used for fixed records and dictionary keys.
- **Dictionaries**: Key-value mapping with O(1) average lookup (\`{"name": "Alice", "age": 22}\`).
- **Sets**: Unordered collection of unique items (\`{1, 2, 3}\`). Supports union \`|\`, intersection \`&\`, difference \`-\`.

## 2. List & Dictionary Comprehensions
\`\`\`python
# Filter even squares
squares = [x**2 for x in range(10) if x % 2 == 0]

# Dict mapping name to length
names = ["Alice", "Bob", "Charlie"]
name_lengths = {name: len(name) for name in names}
\`\`\`

## 3. Functions & Lambda Expressions
\`\`\`python
# Lambda for inline transformations
square = lambda x: x * x
print(list(map(square, [1, 2, 3, 4])))
\`\`\`
`,
      },
    });
  }

  // Topic 2: NumPy
  let tNumpy = await prisma.topic.findUnique({ where: { slug: "numpy" } });
  if (!tNumpy) {
    tNumpy = await prisma.topic.create({
      data: {
        moduleId: daMod1.id,
        title: "NumPy",
        slug: "numpy",
        order: 2,
        prerequisiteId: tPython.id,
        estimatedTime: "45 mins",
        description: "Multidimensional arrays (ndarrays), vectorization, broadcasting, slicing, linear algebra, and mathematical operations.",
        notesContent: `# NumPy — Numerical Computing in Python

## 1. Why NumPy?
NumPy arrays are stored in contiguous C-style memory blocks, allowing SIMD vectorization and cache locality. Operations on ndarrays execute in compiled C code, running 10x to 100x faster than standard Python lists.

\`\`\`python
import numpy as np

# Create arrays
a = np.array([1, 2, 3, 4])
b = np.zeros((3, 4), dtype=np.float64)
c = np.arange(0, 10, 2)
d = np.linspace(0, 1, 5)
\`\`\`

## 2. Broadcasting Rules
Two dimensions are compatible when:
1. They are equal, or
2. One of them is 1.

\`\`\`python
A = np.ones((3, 1)) # shape (3, 1)
B = np.ones((1, 4)) # shape (1, 4)
C = A + B           # result shape (3, 4)
\`\`\`
`,
      },
    });
  }

  // Topic 3: Pandas — DataFrames & Series
  let tPandas = await prisma.topic.findUnique({ where: { slug: "pandas" } });
  if (!tPandas) {
    tPandas = await prisma.topic.create({
      data: {
        moduleId: daMod2.id,
        title: "Pandas — DataFrames",
        slug: "pandas",
        order: 3,
        prerequisiteId: tNumpy.id,
        estimatedTime: "60 mins",
        description: "Series, DataFrames, indexing with loc/iloc, Boolean filtering, GroupBy aggregations, merging, pivoting, and handling missing data.",
        notesContent: `# Pandas — DataFrames & Data Manipulation

## Why This Topic Matters
Pandas is the bedrock of modern Data Science and Analytics. It provides fast, flexible, and expressive data structures designed to make working with tabular, relational, and labeled data both easy and intuitive. In real-world engineering and analytics, 80% of data work involves ingesting, cleaning, slicing, and reshaping data using Pandas before modeling or reporting.

---

## 1. Series vs DataFrame
- **Series**: 1-dimensional labeled array capable of holding any data type.
- **DataFrame**: 2-dimensional labeled data structure with columns of potentially different types (like a SQL table or Excel spreadsheet).

\`\`\`python
import pandas as pd

# Creating a DataFrame
data = {
    'Student': ['Aarav', 'Priya', 'Rohan', 'Isha'],
    'Branch': ['CSE', 'IT', 'CSE', 'AI&DS'],
    'Score': [92, 85, 78, 95]
}
df = pd.DataFrame(data)
\`\`\`

---

## 2. Indexing & Selection: loc vs iloc
- **\`df.loc[row_label, col_label]\`**: Label-based indexing (inclusive of end labels).
- **\`df.iloc[row_index, col_index]\`**: Integer-position-based indexing (0-indexed, exclusive of upper bound).

\`\`\`python
# Label-based selection
df.loc[0:2, ['Student', 'Score']]

# Position-based selection
df.iloc[0:2, 0:2]

# Boolean filtering
top_students = df[df['Score'] >= 85]
\`\`\`

---

## 3. GroupBy Aggregations & Split-Apply-Combine
The \`groupby\` operation splits the data into groups based on specified criteria, applies an aggregation function (such as mean, sum, count), and combines the results.

\`\`\`python
# Average score by engineering branch
branch_avg = df.groupby('Branch')['Score'].agg(['mean', 'count', 'max'])
\`\`\`

---

## 4. Merging & Joining (SQL-like Operations)
Pandas supports inner, left, right, and outer joins using \`pd.merge()\`:

\`\`\`python
merged_df = pd.merge(students_df, grades_df, on='Student_ID', how='inner')
\`\`\`

---

## 5. Handling Missing Data (NaN)
- Detect: \`df.isnull().sum()\`
- Drop: \`df.dropna(subset=['Critical_Column'])\`
- Impute: \`df['Score'].fillna(df['Score'].median(), inplace=True)\`
`,
      },
    });
  }

  // Add Videos for Pandas
  const existingPandasVideos = await prisma.topicVideo.findMany({
    where: { topicId: tPandas.id },
  });
  if (existingPandasVideos.length === 0) {
    await prisma.topicVideo.createMany({
      data: [
        {
          topicId: tPandas.id,
          title: "Pandas DataFrames — Full Tutorial for Beginners",
          youtubeUrl: "https://www.youtube.com/watch?v=vmEHCJofslg",
          duration: "28 min",
          channel: "Keith Galli",
          description: "Hands-on guide to Pandas DataFrames: reading CSV files, inspecting, filtering, and summarizing data.",
          learningObjective: "Learn how to load data, inspect dimensions, use loc/iloc, and filter datasets based on conditional expressions.",
          order: 1,
        },
        {
          topicId: tPandas.id,
          title: "Pandas GroupBy & Multi-Level Aggregations",
          youtubeUrl: "https://www.youtube.com/watch?v=txMdrV1Ut64",
          duration: "22 min",
          channel: "Corey Schafer",
          description: "Deep dive into the Split-Apply-Combine pattern, custom aggregations, and transforming data grouped by categories.",
          learningObjective: "Master groupby, agg, transform, and filtering grouped datasets without losing index context.",
          order: 2,
        },
        {
          topicId: tPandas.id,
          title: "Merging, Joining & Concatenating DataFrames",
          youtubeUrl: "https://www.youtube.com/watch?v=g7n1MZyYjOM",
          duration: "25 min",
          channel: "Corey Schafer",
          description: "Master inner, left, right, and outer joins with real relational tables.",
          learningObjective: "Understand SQL-style relational joins, key alignment, and handling duplicate merge keys.",
          order: 3,
        },
      ],
    });
  }

  // Add 30-Question Comprehensive Quiz for Pandas
  let pandasQuiz = await prisma.quiz.findFirst({
    where: { topicId: tPandas.id },
  });
  if (!pandasQuiz) {
    pandasQuiz = await prisma.quiz.create({
      data: {
        id: "pandas-basics-quiz",
        title: "Pandas Basics & Data Manipulation Assessment",
        description: "Comprehensive 30-question engineering assessment testing DataFrames, Series, loc/iloc indexing, boolean filtering, missing values, GroupBy, and merging operations.",
        topic: "DataFrames",
        topicId: tPandas.id,
        competencyId: comp.id,
        passPercentage: 80.0,
        masteryThreshold: 90.0,
        relearnThreshold: 60.0,
        isPublished: true,
      },
    });

    const questionsData = [
      // 1-5: Series & DataFrame basics
      {
        q: "What is the primary difference between a Pandas Series and a Pandas DataFrame?",
        a: "A Series is a 1-dimensional labeled array, whereas a DataFrame is a 2-dimensional labeled table with columns of potentially different types.",
        b: "A Series can only store integers, while a DataFrame can store any data type.",
        c: "A Series is mutable, but a DataFrame is strictly immutable.",
        d: "A Series has no index, whereas a DataFrame always requires a primary key.",
        correct: "A",
        exp: "A Series is a one-dimensional labeled array capable of holding any data type, while a DataFrame is a two-dimensional labeled data structure with heterogeneous columns.",
        concept: "DataFrames vs Series",
      },
      {
        q: "Which attribute of a Pandas DataFrame returns a tuple representing its dimensionality (rows, columns)?",
        a: "df.shape",
        b: "df.size",
        c: "df.ndim",
        d: "df.dim",
        correct: "A",
        exp: "df.shape returns a tuple (nrows, ncols) representing the dimensions of the DataFrame.",
        concept: "DataFrame Attributes",
      },
      {
        q: "Which method provides a concise summary of a DataFrame including index dtype, column dtypes, non-null values, and memory usage?",
        a: "df.info()",
        b: "df.describe()",
        c: "df.summary()",
        d: "df.schema()",
        correct: "A",
        exp: "df.info() displays column names, counts of non-null values, data types, and total memory usage.",
        concept: "DataFrame Inspection",
      },
      {
        q: "By default, how many rows does df.head() return if no argument is provided?",
        a: "5",
        b: "10",
        c: "1",
        d: "20",
        correct: "A",
        exp: "df.head() returns the first 5 rows by default.",
        concept: "DataFrame Slicing",
      },
      {
        q: "How do you calculate summary statistics (mean, std, min, 25%, 50%, 75%, max) for all numerical columns?",
        a: "df.describe()",
        b: "df.stats()",
        c: "df.aggregate()",
        d: "df.summary_stats()",
        correct: "A",
        exp: "df.describe() generates descriptive statistics that summarize the central tendency, dispersion and shape of a dataset's distribution.",
        concept: "Summary Statistics",
      },

      // 6-10: Indexing & Selection (loc vs iloc)
      {
        q: "What is the key functional difference between df.loc and df.iloc?",
        a: "df.loc uses label-based indexing, whereas df.iloc uses integer position-based indexing.",
        b: "df.loc only works on columns, while df.iloc only works on rows.",
        c: "df.loc is 0-indexed, while df.iloc is 1-indexed.",
        d: "df.loc cannot slice multiple rows simultaneously.",
        correct: "A",
        exp: "df.loc is purely label-based indexing where endpoints are included. df.iloc is purely integer-position based where standard Python slicing rules apply (stop is excluded).",
        concept: "loc vs iloc Indexing",
      },
      {
        q: "Given df.loc[1:3, 'Age'], what does it include if the index is integers [1, 2, 3, 4]?",
        a: "Rows with labels 1, 2, and 3 (endpoint 3 is included).",
        b: "Only rows with index 1 and 2 (endpoint 3 is excluded).",
        c: "The first 3 rows of the DataFrame regardless of label.",
        d: "Throws a TypeError because integers cannot be used with loc.",
        correct: "A",
        exp: "In loc label slicing, both the start and stop labels are included in the result.",
        concept: "Label-based Slicing",
      },
      {
        q: "How do you select the value at row 0 and column 2 using integer position?",
        a: "df.iloc[0, 2]",
        b: "df.loc[0, 2]",
        c: "df.ix[0, 2]",
        d: "df.get(0, 2)",
        correct: "A",
        exp: "df.iloc[0, 2] accesses the element at integer row 0, column 2.",
        concept: "iloc Position Selection",
      },
      {
        q: "Which expression correctly selects rows where the column 'Salary' is greater than 50000 AND 'Department' is 'Engineering'?",
        a: "df[(df['Salary'] > 50000) & (df['Department'] == 'Engineering')]",
        b: "df[(df['Salary'] > 50000) and (df['Department'] == 'Engineering')]",
        c: "df[df['Salary'] > 50000 && df['Department'] == 'Engineering']",
        d: "df.query(Salary > 50000 and Department == Engineering)",
        correct: "A",
        exp: "In Pandas, element-wise logical AND is '&' and each condition must be enclosed in parentheses to handle operator precedence.",
        concept: "Boolean Filtering",
      },
      {
        q: "Which method is the most memory-efficient way to filter a DataFrame using a readable string query?",
        a: "df.query('Salary > 50000 and Department == \"Engineering\"')",
        b: "df.filter(lambda x: x['Salary'] > 50000)",
        c: "df.eval_rows('Salary > 50000')",
        d: "df.where('Salary > 50000')",
        correct: "A",
        exp: "df.query() evaluates a boolean expression using numexpr under the hood, saving memory by not creating intermediate boolean Series.",
        concept: "Query Method",
      },

      // 11-15: Missing Data & Cleaning
      {
        q: "Which method returns a boolean DataFrame indicating where values are missing (NaN/None)?",
        a: "df.isna() or df.isnull()",
        b: "df.is_empty()",
        c: "df.has_nan()",
        d: "df.missing()",
        correct: "A",
        exp: "df.isna() and df.isnull() are aliases that return a boolean mask where True indicates missing values.",
        concept: "Missing Value Detection",
      },
      {
        q: "How do you count the number of missing values in each column of a DataFrame?",
        a: "df.isnull().sum()",
        b: "df.isna().count()",
        c: "df.missing().total()",
        d: "df.count_nulls()",
        correct: "A",
        exp: "df.isnull().sum() sums the True booleans (treated as 1) for each column.",
        concept: "Missing Values Count",
      },
      {
        q: "What does df.dropna(how='all') do?",
        a: "Drops rows where ALL values are NaN.",
        b: "Drops rows where ANY value is NaN.",
        c: "Drops all rows and columns completely.",
        d: "Drops columns with more than 50% missing values.",
        correct: "A",
        exp: "how='all' drops the row only if all columns in that row are NaN. (Default is how='any').",
        concept: "dropna Options",
      },
      {
        q: "Which method replaces NaN values with a specific replacement value or calculated statistic?",
        a: "df.fillna()",
        b: "df.replace_na()",
        c: "df.impute()",
        d: "df.set_default()",
        correct: "A",
        exp: "df.fillna(value) fills NA/NaN values using the specified value or interpolation method.",
        concept: "Imputation with fillna",
      },
      {
        q: "To drop duplicate rows based only on a subset of columns, which parameter is used in df.drop_duplicates()?",
        a: "subset=['col1', 'col2']",
        b: "columns=['col1', 'col2']",
        c: "by=['col1', 'col2']",
        d: "keys=['col1', 'col2']",
        correct: "A",
        exp: "The subset parameter takes a list of column names to consider when identifying duplicate rows.",
        concept: "Deduplication",
      },

      // 16-20: GroupBy & Aggregations
      {
        q: "What is the three-step paradigm underlying Pandas GroupBy?",
        a: "Split-Apply-Combine",
        b: "Map-Filter-Reduce",
        c: "Extract-Transform-Load",
        d: "Partition-Aggregate-Sort",
        correct: "A",
        exp: "Pandas GroupBy operates on the Split-Apply-Combine methodology (splitting the data into groups, applying functions independently, and combining results).",
        concept: "Split-Apply-Combine",
      },
      {
        q: "How do you calculate both the mean and the standard deviation of 'Salary' for each 'Department'?",
        a: "df.groupby('Department')['Salary'].agg(['mean', 'std'])",
        b: "df.groupby('Department').compute(['mean', 'std'])",
        c: "df.groupby('Department')['Salary'].apply(mean, std)",
        d: "df.groupby('Department')['Salary'].mean_std()",
        correct: "A",
        exp: ".agg(['mean', 'std']) executes multiple aggregation functions on the grouped column.",
        concept: "GroupBy Multi-Aggregation",
      },
      {
        q: "What is the difference between GroupBy.agg() and GroupBy.transform()?",
        a: "agg() reduces each group to a single value; transform() returns an object with the same size as the original group.",
        b: "transform() sorts the data; agg() does not.",
        c: "agg() only works on numbers; transform() only works on strings.",
        d: "There is no difference; they are aliases.",
        correct: "A",
        exp: "transform() produces a result with the same shape/index as the input group, making it ideal for broadcasting group statistics (e.g. z-score normalization).",
        concept: "agg vs transform",
      },
      {
        q: "How do you prevent the grouping column from becoming the new DataFrame index after groupby?",
        a: "df.groupby('Department', as_index=False).mean()",
        b: "df.groupby('Department', reset_index=True).mean()",
        c: "df.groupby('Department', keep_index=False).mean()",
        d: "df.groupby('Department').mean(as_series=False)",
        correct: "A",
        exp: "as_index=False keeps the grouping column as regular DataFrame columns rather than promoting them to index labels.",
        concept: "as_index Parameter",
      },
      {
        q: "Which function counts the number of occurrences of each unique value in a Series?",
        a: "s.value_counts()",
        b: "s.count_unique()",
        c: "s.distinct_count()",
        d: "s.frequency()",
        correct: "A",
        exp: "s.value_counts() returns a Series containing counts of unique values in descending order.",
        concept: "value_counts",
      },

      // 21-25: Merging, Joining & Concatenating
      {
        q: "Which function is used to join two DataFrames along a particular axis (rows or columns)?",
        a: "pd.concat([df1, df2], axis=0)",
        b: "pd.stack(df1, df2)",
        c: "pd.append_all(df1, df2)",
        d: "pd.union(df1, df2)",
        correct: "A",
        exp: "pd.concat() concatenates pandas objects along a particular axis (axis=0 for stacking rows, axis=1 for adjoining columns).",
        concept: "pd.concat",
      },
      {
        q: "In pd.merge(df1, df2, how='left', on='id'), what happens to rows in df1 that have no matching 'id' in df2?",
        a: "They are retained, and the columns from df2 are filled with NaN.",
        b: "They are completely discarded.",
        c: "They raise a KeyError.",
        d: "They are filled with 0.",
        correct: "A",
        exp: "In a left join, all rows from the left DataFrame are preserved; non-matching columns from the right DataFrame are filled with NaN.",
        concept: "Left Join Behavior",
      },
      {
        q: "When merging two DataFrames with different column names representing the same key (e.g., 'user_id' in df1 and 'id' in df2), which parameters should be used?",
        a: "left_on='user_id', right_on='id'",
        b: "key1='user_id', key2='id'",
        c: "join_on=('user_id', 'id')",
        d: "match=('user_id', 'id')",
        correct: "A",
        exp: "left_on and right_on specify separate column names in the left and right DataFrames to join on.",
        concept: "Merge Key Mapping",
      },
      {
        q: "What does an 'outer' merge (how='outer') produce?",
        a: "The union of keys from both DataFrames, retaining all rows from both tables and filling non-matches with NaN.",
        b: "Only rows where keys match in both DataFrames.",
        c: "A Cartesian product without key matching.",
        d: "An empty DataFrame if any key is missing.",
        correct: "A",
        exp: "An outer join returns the union of keys from both DataFrames with NaN in non-overlapping columns.",
        concept: "Outer Join",
      },
      {
        q: "Which parameter in pd.merge() handles overlapping column names that are not join keys?",
        a: "suffixes=('_left', '_right')",
        b: "rename=True",
        c: "prefix=('_1', '_2')",
        d: "resolve_duplicates=True",
        correct: "A",
        exp: "suffixes takes a tuple of string suffixes to append to overlapping column names.",
        concept: "Merge Suffixes",
      },

      // 26-30: Performance, Transformations & Reshaping
      {
        q: "Which method is best suited for reshaping a DataFrame from long format to wide format?",
        a: "df.pivot() or df.pivot_table()",
        b: "df.melt()",
        c: "df.transpose()",
        d: "df.unravel()",
        correct: "A",
        exp: "pivot() and pivot_table() reshape data from long to wide format based on column values.",
        concept: "Pivot Table",
      },
      {
        q: "Which method unpivots a DataFrame from wide format to long format?",
        a: "pd.melt(df, id_vars=[...])",
        b: "df.widen()",
        c: "df.flatten()",
        d: "df.expand()",
        correct: "A",
        exp: "pd.melt() unpivots a DataFrame from wide to long format, leaving identifier variables set.",
        concept: "pd.melt Reshaping",
      },
      {
        q: "Why is iterating through rows with `for index, row in df.iterrows():` considered an anti-pattern in Pandas?",
        a: "It is significantly slower than vectorized operations because it constructs a Series for each row and executes in Python space.",
        b: "It mutates the original DataFrame unintentionally.",
        c: "It skips rows containing NaN values automatically.",
        d: "It only works on DataFrames with fewer than 100 rows.",
        correct: "A",
        exp: "iterrows() is notoriously slow because it switches back and forth between C and Python interpreter, creating a new Series object per row. Vectorized operations should always be preferred.",
        concept: "Vectorization vs Loops",
      },
      {
        q: "How do you convert a column 'Order_Date' from string type to datetime in Pandas?",
        a: "pd.to_datetime(df['Order_Date'])",
        b: "df['Order_Date'].as_date()",
        c: "df['Order_Date'].to_timestamp()",
        d: "df.cast('Order_Date', 'date')",
        correct: "A",
        exp: "pd.to_datetime() parses strings into timestamp/datetime64 objects, enabling date-based slicing and accessor methods (.dt).",
        concept: "Datetime Conversion",
      },
      {
        q: "Which accessor allows you to extract date components like year, month, or weekday from a datetime column?",
        a: "df['Order_Date'].dt",
        b: "df['Order_Date'].date",
        c: "df['Order_Date'].time",
        d: "df['Order_Date'].chrono",
        correct: "A",
        exp: "The .dt accessor provides access to datetime properties (e.g. df['Order_Date'].dt.year, .dt.month, .dt.day_name()).",
        concept: "dt Accessor",
      },
    ];

    for (let i = 0; i < questionsData.length; i++) {
      const q = questionsData[i];
      await prisma.quizQuestion.create({
        data: {
          quizId: pandasQuiz.id,
          competencyId: comp.id,
          topic: "DataFrames",
          questionText: q.q,
          optionA: q.a,
          optionB: q.b,
          optionC: q.c,
          optionD: q.d,
          correctAnswer: q.correct,
          explanation: q.exp,
          difficulty: i < 10 ? "EASY" : i < 22 ? "MEDIUM" : "HARD",
          sourceReference: q.concept,
          status: "APPROVED",
          qualityScore: 100.0,
        },
      });
    }
    console.log(`Created 30-Question Quiz for Pandas DataFrames!`);
  }

  // Topic 4: Data Cleaning
  let tCleaning = await prisma.topic.findUnique({ where: { slug: "data-cleaning" } });
  if (!tCleaning) {
    tCleaning = await prisma.topic.create({
      data: {
        moduleId: daMod2.id,
        title: "Data Cleaning",
        slug: "data-cleaning",
        order: 4,
        prerequisiteId: tPandas.id,
        estimatedTime: "50 mins",
        description: "Standardizing formats, deduplication, regex text extraction, handling invalid values, and outlier mitigation.",
        notesContent: `# Data Cleaning & Preprocessing

## 1. Handling Messy Text Data
\`\`\`python
# String methods via .str accessor
df['Email'] = df['Email'].str.strip().str.lower()
df['Phone'] = df['Phone'].str.replace(r'\\D', '', regex=True)
\`\`\`

## 2. Detecting Outliers using IQR
\`\`\`python
Q1 = df['Salary'].quantile(0.25)
Q3 = df['Salary'].quantile(0.75)
IQR = Q3 - Q1
lower_bound = Q1 - 1.5 * IQR
upper_bound = Q3 + 1.5 * IQR

# Filter outliers
clean_df = df[(df['Salary'] >= lower_bound) & (df['Salary'] <= upper_bound)]
\`\`\`
`,
      },
    });

    await prisma.topicVideo.create({
      data: {
        topicId: tCleaning.id,
        title: "Data Cleaning Portfolio Project in Python & Pandas",
        youtubeUrl: "https://www.youtube.com/watch?v=bDhvCp3_lYw",
        duration: "24 min",
        channel: "Alex The Analyst",
        description: "Full walkthrough cleaning a dirty real-world dataset step by step.",
        learningObjective: "Learn to standardize column names, drop duplicates, fix inconsistent data, and handle missing values.",
        order: 1,
      },
    });
  }

  // Topics 5-9 for Data Analytics
  const remainingTopics = [
    {
      slug: "sql-analytics",
      title: "SQL for Data Analytics",
      order: 5,
      modId: daMod3.id,
      prereq: tCleaning.id,
      desc: "SELECT queries, WHERE filtering, GROUP BY, HAVING, subqueries, CTEs, and window functions (ROW_NUMBER, RANK, LEAD, LAG).",
    },
    {
      slug: "statistics",
      title: "Statistics for Analytics",
      order: 6,
      modId: daMod3.id,
      prereq: "sql-analytics",
      desc: "Descriptive statistics, normal distribution, z-scores, hypothesis testing, p-values, correlation, and covariance.",
    },
    {
      slug: "data-visualization",
      title: "Data Visualization",
      order: 7,
      modId: daMod4.id,
      prereq: "statistics",
      desc: "Storytelling with data: Matplotlib plots, Seaborn statistical charts, interactive charts, and dashboard layouts.",
    },
    {
      slug: "eda",
      title: "Exploratory Data Analysis",
      order: 8,
      modId: daMod4.id,
      prereq: "data-visualization",
      desc: "End-to-end dataset profiling, feature distributions, identifying anomalies, correlation heatmaps, and insight synthesis.",
    },
    {
      slug: "data-analytics-projects",
      title: "Capstone Analytics Projects",
      order: 9,
      modId: daMod4.id,
      prereq: "eda",
      desc: "Comprehensive business analytics case studies, executive summary reports, and presentation decks.",
    },
  ];

  let prevId = tCleaning.id;
  for (const item of remainingTopics) {
    let top = await prisma.topic.findUnique({ where: { slug: item.slug } });
    if (!top) {
      top = await prisma.topic.create({
        data: {
          moduleId: item.modId,
          title: item.title,
          slug: item.slug,
          order: item.order,
          prerequisiteId: prevId,
          estimatedTime: "50 mins",
          description: item.desc,
          notesContent: `# ${item.title}

Comprehensive engineering notes and practical templates for ${item.title}.
`,
        },
      });
    }
    prevId = top.id;
  }

  // =========================================================================
  // 2. FULL-STACK WEB DEVELOPMENT COURSE
  // =========================================================================
  let webCourse = await prisma.course.findUnique({ where: { slug: "web-development" } });
  if (!webCourse) {
    webCourse = await prisma.course.create({
      data: {
        id: "course_web_dev",
        title: "Web Development",
        slug: "web-development",
        description: "Modern Full-Stack Web Development roadmap: HTML, CSS, JavaScript, DOM, Git, React, Node.js, Express, Databases, and Production Deployment.",
        category: "Development",
        branch: "Information Technology",
        targetAudience: "Engineering Students & Aspiring Software Developers",
        icon: "Globe",
      },
    });

    const wMod1 = await prisma.courseModule.create({
      data: { courseId: webCourse.id, title: "1. Frontend Fundamentals", order: 1 },
    });
    const wMod2 = await prisma.courseModule.create({
      data: { courseId: webCourse.id, title: "2. Modern Frontend & Frameworks", order: 2 },
    });
    const wMod3 = await prisma.courseModule.create({
      data: { courseId: webCourse.id, title: "3. Backend & Database Architecture", order: 3 },
    });

    const webTopics = [
      { slug: "html", title: "HTML & Semantic Markup", order: 1, modId: wMod1.id, time: "30 mins", desc: "Semantic tags, forms, input validation, accessibility, and SEO basics." },
      { slug: "css", title: "CSS & Responsive Layouts", order: 2, modId: wMod1.id, time: "45 mins", desc: "Box model, Flexbox, Grid, media queries, and Tailwind CSS fundamentals." },
      { slug: "javascript", title: "JavaScript Core", order: 3, modId: wMod1.id, time: "60 mins", desc: "ES6+, closures, promises, async/await, event loop, and array methods." },
      { slug: "dom", title: "DOM & Browser APIs", order: 4, modId: wMod1.id, time: "40 mins", desc: "Document Object Model manipulation, event delegation, and localStorage." },
      { slug: "git", title: "Git & Version Control", order: 5, modId: wMod2.id, time: "35 mins", desc: "Branching, merging, pull requests, merge conflict resolution, and CI/CD basics." },
      { slug: "frontend-react", title: "Frontend Framework (React)", order: 6, modId: wMod2.id, time: "65 mins", desc: "Components, JSX, useState, useEffect, custom hooks, and state management." },
      { slug: "backend-node", title: "Backend Development (Node.js)", order: 7, modId: wMod3.id, time: "60 mins", desc: "REST APIs, Express middleware, routing, request validation, and error handling." },
      { slug: "database-apis", title: "Database & APIs", order: 8, modId: wMod3.id, time: "50 mins", desc: "Relational and NoSQL databases, Prisma ORM, migrations, and CRUD operations." },
      { slug: "authentication", title: "Authentication & Security", order: 9, modId: wMod3.id, time: "45 mins", desc: "JWT tokens, HTTP-only cookies, password hashing (bcrypt), CORS, and OWASP safety." },
      { slug: "deployment", title: "Deployment & Cloud Hosting", order: 10, modId: wMod3.id, time: "40 mins", desc: "Vercel, Docker, environment variables, SSL certificates, and performance tuning." },
    ];

    let wPrev = null;
    for (const wt of webTopics) {
      const top = await prisma.topic.create({
        data: {
          moduleId: wt.modId,
          title: wt.title,
          slug: wt.slug,
          order: wt.order,
          prerequisiteId: wPrev,
          estimatedTime: wt.time,
          description: wt.desc,
          notesContent: `# ${wt.title}\n\nComprehensive engineering notes and code examples for ${wt.title}.`,
        },
      });
      wPrev = top.id;
    }
  }

  // =========================================================================
  // 3. PYTHON COURSE
  // =========================================================================
  let pyCourse = await prisma.course.findUnique({ where: { slug: "python" } });
  if (!pyCourse) {
    pyCourse = await prisma.course.create({
      data: {
        id: "course_python",
        title: "Python for Engineering",
        slug: "python",
        description: "Master Python from syntax fundamentals to Object-Oriented Programming, file handling, automation, and advanced engineering libraries.",
        category: "Programming",
        branch: "Computer Engineering",
        targetAudience: "All Engineering Branches",
        icon: "Terminal",
      },
    });

    const pyMod1 = await prisma.courseModule.create({
      data: { courseId: pyCourse.id, title: "1. Syntax & Core Constructs", order: 1 },
    });
    const pyMod2 = await prisma.courseModule.create({
      data: { courseId: pyCourse.id, title: "2. OOP & Advanced Python", order: 2 },
    });

    const pyTopics = [
      { slug: "python-fundamentals", title: "Python Fundamentals & Syntax", order: 1, modId: pyMod1.id },
      { slug: "python-collections", title: "Data Structures & Collections", order: 2, modId: pyMod1.id },
      { slug: "python-oop", title: "Object-Oriented Programming in Python", order: 3, modId: pyMod2.id },
      { slug: "python-files-modules", title: "File I/O, Modules & Exception Handling", order: 4, modId: pyMod2.id },
      { slug: "python-automation", title: "Scripting & Automation Projects", order: 5, modId: pyMod2.id },
    ];

    let pPrev = null;
    for (const pt of pyTopics) {
      const top = await prisma.topic.create({
        data: {
          moduleId: pt.modId,
          title: pt.title,
          slug: pt.slug,
          order: pt.order,
          prerequisiteId: pPrev,
          estimatedTime: "45 mins",
          description: `Core concepts and hands-on exercises for ${pt.title}.`,
          notesContent: `# ${pt.title}\n\nDetailed reference notes for ${pt.title}.`,
        },
      });
      pPrev = top.id;
    }
  }

  console.log("Multiple Engineering Courses seeded successfully!");
}

if (require.main === module) {
  seedMultiCourses()
    .then(() => {
      console.log("Done!");
      process.exit(0);
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
