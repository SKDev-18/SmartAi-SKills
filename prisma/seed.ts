import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { seedEngineering } from "./seed-engineering";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with Official Statistical System capacity building framework...");

  // Clear existing records if re-seeding
  await prisma.quizAnswer.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.quizQuestion.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.recommendation.deleteMany();
  await prisma.learningProgress.deleteMany();
  await prisma.learningResource.deleteMany();
  await prisma.learningMaterial.deleteMany();
  await prisma.assessmentAnswer.deleteMany();
  await prisma.assessmentAttempt.deleteMany();
  await prisma.assessmentQuestion.deleteMany();
  await prisma.assessment.deleteMany();
  await prisma.userCompetency.deleteMany();
  await prisma.competencyTopic.deleteMany();
  await prisma.competency.deleteMany();
  await prisma.iGOTCourse.deleteMany();
  await prisma.iGOTIntegration.deleteMany();
  await prisma.aIGenerationLog.deleteMany();
  await prisma.aIGenerationJob.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("Password@123", 10);

  // 1. Create Users
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@mospi.gov.in",
      passwordHash,
      name: "Dr. Arvind Saxena",
      employeeId: "MOSPI-ADM-001",
      department: "CSO - Training Division",
      designation: "Director & Head of Capacity Building",
      experienceLevel: "Executive",
      role: "ADMIN",
    },
  });

  const demoLearner = await prisma.user.create({
    data: {
      email: "iss.officer@mospi.gov.in",
      passwordHash,
      name: "Priya Sharma",
      employeeId: "ISS-2021-084",
      department: "NSSO - Field Operations Division",
      designation: "Senior Statistical Officer",
      experienceLevel: "Intermediate",
      role: "LEARNER",
    },
  });

  const learner2 = await prisma.user.create({
    data: {
      email: "rajesh.kumar@des.gov.in",
      passwordHash,
      name: "Rajesh Kumar",
      employeeId: "DES-MH-104",
      department: "DES Maharashtra",
      designation: "Assistant Director (Statistics)",
      experienceLevel: "Senior",
      role: "LEARNER",
    },
  });

  const learner3 = await prisma.user.create({
    data: {
      email: "anita.deshmukh@mospi.gov.in",
      passwordHash,
      name: "Anita Deshmukh",
      employeeId: "SSS-2023-319",
      department: "SDRD - Survey Design & Research Division",
      designation: "Junior Statistical Officer",
      experienceLevel: "Entry",
      role: "LEARNER",
    },
  });

  console.log("Created users: Admin and 3 Learners.");

  // 2. Competencies & Topics (PRD §7)
  const competenciesData = [
    {
      domain: "Statistical Methods",
      name: "Statistical Methods",
      code: "STAT_METHODS",
      description: "Foundational mathematical and inferential methods for official statistics, including distributions, hypothesis testing, and regression models.",
      targetLevel: 75.0,
      topics: ["Descriptive Statistics", "Inferential Statistics", "Regression", "Statistical Interpretation"],
    },
    {
      domain: "Survey Methodology",
      name: "Survey Methodology",
      code: "SURVEY_METHODOLOGY",
      description: "Principles and practices of sample survey design, multi-stage sampling, questionnaire design, field data collection, and non-sampling error management.",
      targetLevel: 75.0,
      topics: ["Sampling", "Questionnaire Design", "Data Collection", "Survey Design"],
    },
    {
      domain: "Data Management",
      name: "Data Management",
      code: "DATA_MANAGEMENT",
      description: "Methods for statistical data curation, data validation rules, imputation, cleaning algorithms, and relational data architecture.",
      targetLevel: 75.0,
      topics: ["Data Quality", "Data Cleaning", "Data Validation", "Data Management"],
    },
    {
      domain: "Data Analysis",
      name: "Data Analysis",
      code: "DATA_ANALYSIS",
      description: "Exploratory and multivariate statistical data analysis, econometric modeling, statistical computing software (R, Python, Stata), and substantive interpretation.",
      targetLevel: 75.0,
      topics: ["Data Analysis", "Statistical Software", "Data Interpretation"],
    },
    {
      domain: "Data Visualization",
      name: "Data Visualization",
      code: "DATA_VISUALIZATION",
      description: "Translating statistical findings into clear charts, interactive dashboards, geospatial maps, and high-impact policy briefs.",
      targetLevel: 75.0,
      topics: ["Charts", "Dashboards", "Visualization Principles", "Statistical Reporting"],
    },
    {
      domain: "Official Statistics",
      name: "Official Statistics",
      code: "OFFICIAL_STATISTICS",
      description: "Architecture of India's National Statistical System, Fundamental Principles of Official Statistics, National Accounts, Price Indices, and Dissemination Standards.",
      targetLevel: 80.0,
      topics: ["Official Statistical System", "Statistical Standards", "Data Dissemination", "Statistical Ethics"],
    },
  ];

  const createdCompetencies: Record<string, any> = {};

  for (const c of competenciesData) {
    const created = await prisma.competency.create({
      data: {
        domain: c.domain,
        name: c.name,
        code: c.code,
        description: c.description,
        targetLevel: c.targetLevel,
        topics: {
          create: c.topics.map((t) => ({ name: t, description: `${t} competencies in official statistics` })),
        },
      },
      include: { topics: true },
    });
    createdCompetencies[c.code] = created;
  }

  console.log("Created 6 core competency domains with 23 topics.");

  // Helper for status determination (PRD §9)
  function getCompetencyStatus(score: number, required: number): string {
    if (score >= required) return "STRONG";
    if (score >= required - 15) return "DEVELOPING";
    if (score >= 40) return "NEEDS_IMPROVEMENT";
    return "CRITICAL_GAP";
  }

  // 3. User Competencies for Demo Learner (Priya Sharma - PRD §10 & §14)
  const learnerProfiles = [
    {
      userId: demoLearner.id,
      scores: {
        STAT_METHODS: 84.0,
        SURVEY_METHODOLOGY: 61.0,
        DATA_MANAGEMENT: 72.0,
        DATA_ANALYSIS: 64.0,
        DATA_VISUALIZATION: 45.0, // Critical priority gap from PRD!
        OFFICIAL_STATISTICS: 88.0,
      },
    },
    {
      userId: learner2.id,
      scores: {
        STAT_METHODS: 78.0,
        SURVEY_METHODOLOGY: 82.0,
        DATA_MANAGEMENT: 65.0,
        DATA_ANALYSIS: 70.0,
        DATA_VISUALIZATION: 58.0,
        OFFICIAL_STATISTICS: 85.0,
      },
    },
    {
      userId: learner3.id,
      scores: {
        STAT_METHODS: 55.0,
        SURVEY_METHODOLOGY: 68.0,
        DATA_MANAGEMENT: 50.0,
        DATA_ANALYSIS: 48.0,
        DATA_VISUALIZATION: 62.0,
        OFFICIAL_STATISTICS: 70.0,
      },
    },
  ];

  for (const profile of learnerProfiles) {
    for (const [code, score] of Object.entries(profile.scores)) {
      const comp = createdCompetencies[code];
      const gap = Math.max(0, comp.targetLevel - score);
      await prisma.userCompetency.create({
        data: {
          userId: profile.userId,
          competencyId: comp.id,
          currentScore: score,
          requiredLevel: comp.targetLevel,
          gap: Number(gap.toFixed(1)),
          status: getCompetencyStatus(score, comp.targetLevel),
          lastEvaluatedAt: new Date(),
        },
      });
    }
  }

  // 4. Learning Materials (PRD §20 & §54)
  const surveyHandbookText = `
CHAPTER 3: SAMPLE DESIGN & SELECTION IN OFFICIAL HOUSEHOLD SURVEYS
Ministry of Statistics and Programme Implementation (MoSPI) - National Statistical Office

1. Stratified Sampling Principles:
The primary objective of stratified sampling is to increase the precision of sample estimates by dividing a heterogeneous population into relatively homogeneous sub-populations (strata). Within each stratum, independent sampling is conducted. Stratification guarantees proportional or optimal representation of critical domains such as Rural/Urban sectors, agro-climatic zones, and economic deciles.

2. Primary Sampling Units (PSUs) & Ultimate Sampling Units (USUs):
In India's National Sample Survey (NSS) multi-stage design:
- In rural areas, the Primary Sampling Unit (PSU) is usually the Census Village (or Panchayat ward).
- In urban areas, the PSU is the Urban Frame Survey (UFS) block.
- The Ultimate Sampling Unit (USU) is the individual household or enterprise selected through systematic circular sampling.

3. Sampling vs Non-Sampling Errors:
Sampling errors arise solely due to observing a fraction of the population rather than a complete census. They decrease predictably as sample size (n) increases. Conversely, non-sampling errors arise from questionnaire ambiguity, respondent recall bias, non-response, and data entry errors. Non-sampling errors can occur in both sample surveys and complete censuses, and frequently exceed sampling variance in socio-economic surveys.

4. Systematic Sampling with Probability Proportional to Size (PPS):
When PSUs vary considerably in population size, simple random sampling leads to high variance. Selecting PSUs using Probability Proportional to Size (PPS) with replacement or systematic circular PPS ensures larger villages have a higher selection probability, while self-weighting sample designs simplify estimation weights.
`;

  const surveyMaterial = await prisma.learningMaterial.create({
    data: {
      title: "MoSPI Survey Methodology & Sampling Handbook (Official Training Compendium 2024)",
      description: "Official guide on multi-stage sampling designs, stratified random selection, and non-sampling error mitigation used by NSSO.",
      fileName: "MoSPI_Survey_Methodology_Handbook.pdf",
      fileType: "PDF",
      fileSize: 4280500,
      contentSnippet: surveyHandbookText,
      extractedTopics: JSON.stringify(["Stratified Sampling", "PSU Selection", "Sampling vs Non-Sampling Errors", "PPS Systematic Sampling"]),
      keyConcepts: JSON.stringify([
        "Stratification maximizes precision across heterogeneous populations",
        "Rural PSU is Census Village, Urban PSU is UFS Block",
        "Non-sampling errors occur in both censuses and sample surveys",
        "Probability Proportional to Size (PPS) minimizes design effect",
      ]),
      summary: "Comprehensive handbook detailing the sampling methodologies of India's National Statistical Office, focusing on multi-stage stratification and bias controls.",
      competencyId: createdCompetencies["SURVEY_METHODOLOGY"].id,
      topic: "Sampling",
      difficulty: "INTERMEDIATE",
      uploadedById: adminUser.id,
    },
  });

  const dataVizMaterial = await prisma.learningMaterial.create({
    data: {
      title: "Statistical Data Visualization & Reporting Standards",
      description: "Best practices for communicating official statistics to policymakers, researchers, and citizens through accessible charts and dashboards.",
      fileName: "Official_Data_Visualization_Standards.pdf",
      fileType: "PDF",
      fileSize: 3150200,
      contentSnippet: `
STATISTICAL DATA VISUALIZATION PRINCIPLES FOR OFFICIAL STATISTICAL BODIES
Guidelines for Graphic Presentation of MoSPI Publications:
1. Chart Selection Framework:
- Use Line Charts for continuous temporal series (e.g., Monthly CPI inflation, Quarterly GDP growth).
- Use Bar Charts (horizontal or grouped) for categorical comparisons across States and Union Territories.
- Avoid 3D effects and pie charts with more than 5 slices, as visual perception of angles induces estimation bias.
2. Accessibility and Integrity:
- Y-axis on bar charts must always start at zero (0) to prevent deceptive magnitude distortions.
- Always include clear source attribution, baseline year (e.g. 2011-12=100), and confidence bands where sampling errors exist.
`,
      extractedTopics: JSON.stringify(["Chart Selection Framework", "Visual Distortion Avoidance", "Accessibility & Baseline Scaling"]),
      keyConcepts: JSON.stringify([
        "Line charts for temporal continuous indices",
        "Bar charts must begin at zero",
        "Avoid 3D distortions and over-segmented pie charts",
      ]),
      summary: "Guidelines on selecting charts, zero-baseline integrity, and accessible visualization for official statistical releases.",
      competencyId: createdCompetencies["DATA_VISUALIZATION"].id,
      topic: "Visualization Principles",
      difficulty: "BEGINNER",
      uploadedById: adminUser.id,
    },
  });

  // 5. Learning Resources (PRD §16)
  const res1 = await prisma.learningResource.create({
    data: {
      title: "Data Visualization Fundamentals for Statistical Officers",
      description: "Master chart selection, visual integrity, and high-impact visual storytelling for official statistical bulletins.",
      topic: "Visualization Principles",
      competencyId: createdCompetencies["DATA_VISUALIZATION"].id,
      difficulty: "BEGINNER",
      durationMinutes: 150, // 2h 30m as shown in PRD §11
      source: "INTERNAL",
      materialId: dataVizMaterial.id,
    },
  });

  const res2 = await prisma.learningResource.create({
    data: {
      title: "Advanced Sampling Techniques in Official Surveys",
      description: "In-depth module covering Stratified Random Sampling, Multi-Stage Clustering, and PPS Sampling in NSS Rounds.",
      topic: "Sampling",
      competencyId: createdCompetencies["SURVEY_METHODOLOGY"].id,
      difficulty: "INTERMEDIATE",
      durationMinutes: 180,
      source: "MATERIAL",
      materialId: surveyMaterial.id,
    },
  });

  const res3 = await prisma.learningResource.create({
    data: {
      title: "Statistical Data Analysis & Inference",
      description: "Comprehensive statistical computing module on regression modeling, hypothesis testing, and variance estimation.",
      topic: "Data Analysis",
      competencyId: createdCompetencies["DATA_ANALYSIS"].id,
      difficulty: "INTERMEDIATE",
      durationMinutes: 240,
      source: "INTERNAL",
    },
  });

  // 6. iGOT Courses (PRD §17)
  const igotCourses = [
    {
      courseCode: "IGOT-STAT-101",
      title: "MoSPI: Foundation Course on Official Statistical System of India",
      description: "Comprehensive orientation on the structure, mandate, and legal framework of the Indian Statistical System (MoSPI, NSSO, CSO, State DES).",
      domain: "Official Statistics",
      competencyMapped: "Official Statistics",
      durationMinutes: 180,
      difficulty: "BEGINNER",
      provider: "iGOT Karmayogi / MoSPI",
      externalUrl: "https://karmayogi.gov.in/app/toc/igot-stat-101",
      rating: 4.9,
    },
    {
      courseCode: "IGOT-SURV-204",
      title: "Design of Multi-Stage Household Surveys & Sampling",
      description: "Field methodology, sample size determination, and sampling frame construction for socioeconomic surveys.",
      domain: "Survey Methodology",
      competencyMapped: "Survey Methodology",
      durationMinutes: 210,
      difficulty: "INTERMEDIATE",
      provider: "iGOT Karmayogi / MoSPI",
      externalUrl: "https://karmayogi.gov.in/app/toc/igot-surv-204",
      rating: 4.8,
    },
    {
      courseCode: "IGOT-VIZ-105",
      title: "Data Storytelling & Visualization for Civil Servants",
      description: "Modern data communication principles, designing dashboards, and interpreting official statistics for policy impact.",
      domain: "Data Visualization",
      competencyMapped: "Data Visualization",
      durationMinutes: 150,
      difficulty: "BEGINNER",
      provider: "iGOT Karmayogi / Capacity Building Commission",
      externalUrl: "https://karmayogi.gov.in/app/toc/igot-viz-105",
      rating: 4.7,
    },
    {
      courseCode: "IGOT-METH-301",
      title: "Econometric Modeling & Time Series with R/Python",
      description: "Applied econometric regression, seasonal adjustment of macroeconomic series, and index numbers.",
      domain: "Statistical Methods",
      competencyMapped: "Statistical Methods",
      durationMinutes: 300,
      difficulty: "ADVANCED",
      provider: "iGOT Karmayogi / IIPS Mumbai",
      externalUrl: "https://karmayogi.gov.in/app/toc/igot-meth-301",
      rating: 4.9,
    },
  ];

  for (const c of igotCourses) {
    await prisma.iGOTCourse.create({ data: c });
  }

  // Create iGOT Integration status
  await prisma.iGOTIntegration.create({
    data: {
      providerName: "iGOT Karmayogi Central Capacity Registry",
      endpointUrl: "https://karmayogi.gov.in/api/v1/courses",
      clientId: "MOSPI_CAPACITY_NODE_01",
      isActive: true,
      isMockMode: true,
      syncStatus: "HEALTHY",
    },
  });

  // 7. Learner Recommendations (PRD §11 & §48)
  await prisma.recommendation.create({
    data: {
      userId: demoLearner.id,
      resourceId: res1.id,
      priorityScore: 0.95,
      reasonExplanation: "Your recent assessment shows a gap in statistical visualization (Current 45% vs Target 75%).",
    },
  });

  await prisma.recommendation.create({
    data: {
      userId: demoLearner.id,
      resourceId: res2.id,
      priorityScore: 0.88,
      reasonExplanation: "Survey Methodology is currently at 61% (Target 75%). Reinforcing sampling concepts will accelerate your progress.",
    },
  });

  // 8. Continue Learning Progress (PRD §12)
  await prisma.learningProgress.create({
    data: {
      userId: demoLearner.id,
      resourceId: res3.id,
      progressPercentage: 78.0,
      status: "IN_PROGRESS",
      currentStep: "Data Interpretation",
    },
  });

  // 9. Initial Baseline Competency Assessment (PRD §6 & §8)
  const baselineAssessment = await prisma.assessment.create({
    data: {
      title: "Comprehensive Statistical Competency Baseline Assessment",
      description: "An official 12-question diagnostic assessment evaluating baseline proficiency across the 6 core domains of India's Official Statistical System.",
      estimatedMinutes: 20,
      isActive: true,
    },
  });

  const assessmentQuestionsData = [
    // Statistical Methods
    {
      competencyId: createdCompetencies["STAT_METHODS"].id,
      questionText: "Which measure of central tendency is least sensitive to extreme outliers in a skewed distribution?",
      optionA: "Arithmetic Mean",
      optionB: "Median",
      optionC: "Geometric Mean",
      optionD: "Harmonic Mean",
      correctAnswer: "B",
      explanation: "The median represents the 50th percentile and is determined strictly by positional order, making it immune to extreme numerical outliers unlike the arithmetic mean.",
      difficulty: "EASY",
    },
    {
      competencyId: createdCompetencies["STAT_METHODS"].id,
      questionText: "In linear regression analysis, what does the coefficient of determination (R²) represent?",
      optionA: "The correlation between independent variables and residual errors",
      optionB: "The proportion of variance in the dependent variable explained by the model",
      optionC: "The probability that the true slope equals zero",
      optionD: "The standard error of estimated regression residuals",
      correctAnswer: "B",
      explanation: "R² measures the proportion of total variance in the dependent response variable that is explained by the independent predictor variables in the model.",
      difficulty: "MEDIUM",
    },
    // Survey Methodology (PRD §8)
    {
      competencyId: createdCompetencies["SURVEY_METHODOLOGY"].id,
      questionText: "What is the primary purpose of stratified sampling in large-scale socio-economic surveys?",
      optionA: "To reduce data collection time by eliminating sample verification",
      optionB: "To increase precision by dividing a heterogeneous population into homogeneous sub-populations",
      optionC: "To ensure every individual in the population has exactly an equal probability of selection",
      optionD: "To substitute for missing data when complete listing frames are unavailable",
      correctAnswer: "B",
      explanation: "Stratification ensures that sub-populations with distinct variances are proportionally or optimally sampled, significantly reducing sampling variance compared to simple random sampling.",
      difficulty: "MEDIUM",
    },
    {
      competencyId: createdCompetencies["SURVEY_METHODOLOGY"].id,
      questionText: "In India's NSS multi-stage household survey design, what commonly serves as the Primary Sampling Unit (PSU) in rural sectors?",
      optionA: "District Administrative Headquarter",
      optionB: "Census Village",
      optionC: "Sub-district Tehsildar Office",
      optionD: "Individual Agricultural Farm",
      correctAnswer: "B",
      explanation: "In the National Sample Survey rural framework, census villages (or census enumeration blocks for very large villages) serve as the First Stage or Primary Sampling Units.",
      difficulty: "EASY",
    },
    // Data Management
    {
      competencyId: createdCompetencies["DATA_MANAGEMENT"].id,
      questionText: "Which data validation check ensures that values in a statistical column strictly fall within allowable legal boundaries (e.g. age between 0 and 120)?",
      optionA: "Referential integrity check",
      optionB: "Range and consistency check",
      optionC: "Uniqueness constraint check",
      optionD: "Schema normalization check",
      correctAnswer: "B",
      explanation: "Range and consistency validation checks verify that numerical or temporal values fall within logically and biologically plausible limits defined in statistical protocol.",
      difficulty: "EASY",
    },
    {
      competencyId: createdCompetencies["DATA_MANAGEMENT"].id,
      questionText: "In official statistical processing, what is the primary risk of using Mean Imputation for missing survey variables?",
      optionA: "It inflates the estimated population variance and standard deviation",
      optionB: "It artificially attenuates variance and distorts covariance between variables",
      optionC: "It causes database indexing failures during aggregation queries",
      optionD: "It permanently removes non-responding records from the sampling weights",
      correctAnswer: "B",
      explanation: "Substituting missing values with the sample mean collapses the variance of the imputed variable and artificially attenuates correlation coefficients with other variables.",
      difficulty: "HARD",
    },
    // Data Analysis
    {
      competencyId: createdCompetencies["DATA_ANALYSIS"].id,
      questionText: "When comparing two categorical survey variables for statistical independence, which hypothesis test is most appropriate?",
      optionA: "Student's independent two-sample t-test",
      optionB: "Pearson's Chi-Square Test of Independence",
      optionC: "One-way Analysis of Variance (ANOVA)",
      optionD: "Ordinary Least Squares Regression",
      correctAnswer: "B",
      explanation: "Pearson's Chi-Square test evaluates whether observed contingency cell frequencies diverge significantly from frequencies expected under the hypothesis of statistical independence.",
      difficulty: "MEDIUM",
    },
    {
      competencyId: createdCompetencies["DATA_ANALYSIS"].id,
      questionText: "Multicollinearity among explanatory variables in a regression model primarily leads to which statistical problem?",
      optionA: "Severely biased point estimates of regression coefficients",
      optionB: "Inflated standard errors, making coefficient significance tests unreliable",
      optionC: "Negative R-squared values across all specifications",
      optionD: "Violation of the homoscedasticity assumption",
      correctAnswer: "B",
      explanation: "Multicollinearity inflates the variance (standard errors) of estimated parameters (Variance Inflation Factor > 5/10), making individual t-tests imprecise even if overall F-test is significant.",
      difficulty: "HARD",
    },
    // Data Visualization (PRD §11)
    {
      competencyId: createdCompetencies["DATA_VISUALIZATION"].id,
      questionText: "Why must the quantitative value axis (Y-axis) of a bar chart in official statistical publications always start at zero?",
      optionA: "Because statistical software automatically crashes if the baseline is offset",
      optionB: "Because bar lengths encode numerical magnitude; an offset axis visually exaggerates differences",
      optionC: "Because official statistics mandates only logarithmic scales for comparisons",
      optionD: "To ensure compatibility with monochrome printed government gazettes",
      correctAnswer: "B",
      explanation: "In bar charts, the human eye interprets the physical length of the bar as proportional to value. Truncating the baseline from zero creates visual distortion and misleads readers.",
      difficulty: "EASY",
    },
    {
      competencyId: createdCompetencies["DATA_VISUALIZATION"].id,
      questionText: "Which visual display format is most appropriate for visualizing the monthly Consumer Price Index (CPI) over a five-year period?",
      optionA: "Segmented 3D Donut Chart",
      optionB: "Continuous Line Chart with labeled temporal markers",
      optionC: "Horizontal Stacked Bar Chart",
      optionD: "Radial Radar Chart",
      correctAnswer: "B",
      explanation: "Continuous line charts represent temporal sequence and slope of changes across time intervals without visual clutter.",
      difficulty: "EASY",
    },
    // Official Statistics
    {
      competencyId: createdCompetencies["OFFICIAL_STATISTICS"].id,
      questionText: "Which global framework serves as the ethical cornerstone of official statistical production in India?",
      optionA: "The Basel III Statistical Accord",
      optionB: "The United Nations Fundamental Principles of Official Statistics (UN-FPOS)",
      optionC: "The International Trade Organization Guidelines",
      optionD: "The General Data Protection Regulation (GDPR)",
      correctAnswer: "B",
      explanation: "India adopted the UN Fundamental Principles of Official Statistics (UN-FPOS) to guarantee professionalism, impartiality, confidentiality, and transparency in national data.",
      difficulty: "EASY",
    },
    {
      competencyId: createdCompetencies["OFFICIAL_STATISTICS"].id,
      questionText: "Under the Collection of Statistics Act 2008, what is the legal guarantee regarding individual respondents' data provided to statistical enumerators?",
      optionA: "Data can be shared with tax and police authorities upon written request",
      optionB: "Strict confidentiality and prohibition of individual disclosure for non-statistical purposes",
      optionC: "Data must be published with full personal identifiers on the open data portal",
      optionD: "Data is subject to commercial sale to accredited research universities",
      correctAnswer: "B",
      explanation: "The Collection of Statistics Act guarantees strict confidentiality: data collected cannot be used as evidence or disclosed to non-statistical agencies, protecting respondent trust.",
      difficulty: "MEDIUM",
    },
  ];

  for (const q of assessmentQuestionsData) {
    await prisma.assessmentQuestion.create({
      data: {
        assessmentId: baselineAssessment.id,
        competencyId: q.competencyId,
        questionText: q.questionText,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: q.difficulty,
      },
    });
  }

  // 10. Published Quiz for Survey Methodology (PRD §26-28 & §54 Demo)
  const surveyQuiz = await prisma.quiz.create({
    data: {
      title: "Sampling Techniques & Multi-Stage Survey Design Quiz",
      description: "Assess your mastery of stratified sampling, PSU selection, and error mitigation based on the official MoSPI Survey Handbook.",
      materialId: surveyMaterial.id,
      competencyId: createdCompetencies["SURVEY_METHODOLOGY"].id,
      topic: "Sampling",
      passPercentage: 70.0,
      isPublished: true,
    },
  });

  const quizQuestionsData = [
    {
      questionText: "According to the MoSPI Survey Methodology Handbook, what is the primary purpose of stratified sampling?",
      optionA: "To completely eliminate the possibility of non-sampling error",
      optionB: "To increase precision by dividing a heterogeneous population into homogeneous strata",
      optionC: "To bypass the need for an updated listing of households",
      optionD: "To reduce the required sample size to fewer than 30 observations",
      correctAnswer: "B",
      explanation: "Stratification groups similar units together so that variance within strata is minimized, yielding greater precision for national and state-level estimates.",
      difficulty: "MEDIUM",
      sourceReference: "MoSPI Survey Methodology Handbook, Section 1: Stratified Sampling Principles",
    },
    {
      questionText: "In NSS household survey design, what is the Primary Sampling Unit (PSU) designated in rural areas?",
      optionA: "Agricultural Farm Holding",
      optionB: "Census Village (or Panchayat ward)",
      optionC: "District Collectorate",
      optionD: "Sub-division Revenue Circle",
      correctAnswer: "B",
      explanation: "Census villages serve as rural PSUs, while Urban Frame Survey (UFS) blocks serve as urban PSUs.",
      difficulty: "EASY",
      sourceReference: "MoSPI Survey Methodology Handbook, Section 2: PSUs and USUs",
    },
    {
      questionText: "How do non-sampling errors differ from sampling errors in official surveys?",
      optionA: "Non-sampling errors only happen in sample surveys, never in complete censuses",
      optionB: "Sampling errors increase as sample size increases, while non-sampling errors decrease",
      optionC: "Non-sampling errors can occur in both censuses and sample surveys, often exceeding sampling variance",
      optionD: "Sampling errors are caused solely by respondent untruthfulness",
      correctAnswer: "C",
      explanation: "Non-sampling errors arise from measurement, questionnaire design, and non-response, occurring in all surveys including full censuses.",
      difficulty: "MEDIUM",
      sourceReference: "MoSPI Survey Methodology Handbook, Section 3: Sampling vs Non-Sampling Errors",
    },
    {
      questionText: "Why is Probability Proportional to Size (PPS) sampling preferred over Simple Random Sampling when selecting PSUs?",
      optionA: "Because villages vary widely in population size; PPS balances workload and reduces design effect",
      optionB: "Because it eliminates the need for mathematical weighting during aggregation",
      optionC: "Because it ensures every village has exactly the same probability of inclusion",
      optionD: "Because PPS sampling does not require any listing of households",
      correctAnswer: "A",
      explanation: "Selecting larger villages with higher probability proportionate to their population size creates more stable cluster sizes and smaller variance in estimate weights.",
      difficulty: "HARD",
      sourceReference: "MoSPI Survey Methodology Handbook, Section 4: Systematic PPS Sampling",
    },
    {
      questionText: "What constitutes the Ultimate Sampling Unit (USU) in a standard NSS socioeconomic survey?",
      optionA: "The entire administrative district",
      optionB: "The individual household or enterprise",
      optionC: "The State Directorate of Economics & Statistics",
      optionD: "The regional field enumeration supervisor",
      correctAnswer: "B",
      explanation: "The ultimate unit from which questionnaire data is solicited is the individual household or enterprise.",
      difficulty: "EASY",
      sourceReference: "MoSPI Survey Methodology Handbook, Section 2: PSUs and USUs",
    },
  ];

  for (const qq of quizQuestionsData) {
    await prisma.quizQuestion.create({
      data: {
        quizId: surveyQuiz.id,
        materialId: surveyMaterial.id,
        competencyId: createdCompetencies["SURVEY_METHODOLOGY"].id,
        topic: "Sampling",
        questionText: qq.questionText,
        optionA: qq.optionA,
        optionB: qq.optionB,
        optionC: qq.optionC,
        optionD: qq.optionD,
        correctAnswer: qq.correctAnswer,
        explanation: qq.explanation,
        difficulty: qq.difficulty,
        sourceReference: qq.sourceReference,
        status: "APPROVED",
        qualityScore: 98.0,
      },
    });
  }

  // Seed SIH 2026 Engineering Platform (DSA Roadmap, Modules, Topics, 30-Question Quizzes)
  await seedEngineering(prisma);

  console.log("Database seeded successfully with all official models, competencies, users, materials, and quizzes.");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
