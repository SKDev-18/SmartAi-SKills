import { DocumentAnalysisResult } from "@/types";

export interface ParsedDocument {
  text: string;
  charCount: number;
  wordCount: number;
}

export function parseDocumentContent(rawContent: string, fileName: string): ParsedDocument {
  // Clean whitespace and normalization
  const cleaned = rawContent.replace(/\r\n/g, "\n").trim();
  const words = cleaned.split(/\s+/).filter(Boolean);

  return {
    text: cleaned,
    charCount: cleaned.length,
    wordCount: words.length,
  };
}

export function analyzeStatisticalDocument(
  text: string,
  fileName: string
): DocumentAnalysisResult {
  const lower = text.toLowerCase();

  // Statistical Competency Domains to match against
  const domainSignatures = [
    {
      domain: "Survey Methodology",
      subcompetency: "Sampling",
      keywords: ["sampling", "strata", "stratified", "psu", "usu", "cluster", "pps", "frame", "non-sampling", "enumeration"],
    },
    {
      domain: "Survey Methodology",
      subcompetency: "Questionnaire Design",
      keywords: ["questionnaire", "pilot", "respondent", "fieldwork", "schedule", "canvassing"],
    },
    {
      domain: "Statistical Methods",
      subcompetency: "Inferential Statistics",
      keywords: ["hypothesis", "p-value", "significance", "confidence interval", "variance", "null hypothesis", "standard error"],
    },
    {
      domain: "Statistical Methods",
      subcompetency: "Regression",
      keywords: ["regression", "ols", "residuals", "coefficient", "multicollinearity", "heteroscedasticity", "r-squared"],
    },
    {
      domain: "Data Management",
      subcompetency: "Data Quality",
      keywords: ["data quality", "validation", "imputation", "missing values", "cleaning", "outliers", "audit", "curation"],
    },
    {
      domain: "Data Visualization",
      subcompetency: "Visualization Principles",
      keywords: ["visualization", "chart", "bar chart", "line chart", "dashboard", "axes", "legend", "visual distortion", "infographics"],
    },
    {
      domain: "Official Statistics",
      subcompetency: "Statistical Standards",
      keywords: ["official statistics", "un-fpos", "nsso", "mospi", "cso", "dissemination", "national accounts", "cpi", "iip", "confidentiality"],
    },
  ];

  const competencyMapping: {
    domain: string;
    subcompetency: string;
    relevanceScore: number;
  }[] = [];

  for (const sig of domainSignatures) {
    let matches = 0;
    for (const kw of sig.keywords) {
      if (lower.includes(kw)) {
        matches++;
      }
    }
    if (matches > 0) {
      const score = Math.min(1.0, Math.round((matches / sig.keywords.length) * 100) / 100 + 0.3);
      competencyMapping.push({
        domain: sig.domain,
        subcompetency: sig.subcompetency,
        relevanceScore: score,
      });
    }
  }

  competencyMapping.sort((a, b) => b.relevanceScore - a.relevanceScore);

  // Extract paragraphs for topics & definitions
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 30);

  const keyConcepts: string[] = [];
  const definitions: { term: string; definition: string }[] = [];
  const topics: string[] = [];

  for (const p of paragraphs) {
    // Check if line looks like a header or section
    const lines = p.split("\n");
    const firstLine = lines[0].replace(/^[\d\.\-\#\*\s]+/, "").trim();
    if (firstLine.length < 80 && !firstLine.endsWith(".")) {
      topics.push(firstLine);
    }

    // Check for definition patterns: "X is defined as Y" or "X: Y"
    const defMatch = p.match(/([A-Z][a-zA-Z\s]{2,25})\s*(?:is defined as|refers to|means|:)\s*([^.]{20,150}\.)/i);
    if (defMatch && defMatch[1] && defMatch[2]) {
      definitions.push({
        term: defMatch[1].trim(),
        definition: defMatch[2].trim(),
      });
    }

    if (p.length > 50 && p.length < 250 && keyConcepts.length < 5) {
      keyConcepts.push(p.replace(/\n/g, " "));
    }
  }

  // Ensure default fallback topics if parsing structured lines was sparse
  if (topics.length === 0) {
    if (competencyMapping.length > 0) {
      topics.push(competencyMapping[0].subcompetency);
    } else {
      topics.push("Statistical Fundamentals");
    }
  }

  const cleanTitle = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");

  const summary = `Official statistical training material covering ${topics.slice(0, 3).join(", ")}, with direct applicability to national sample surveys and statistical capacity development.`;

  return {
    title: cleanTitle,
    topics: Array.from(new Set(topics)).slice(0, 6),
    subtopics: ["Foundational Concepts", "Field Application", "Quality Controls", "Estimation Formulas"],
    keyConcepts: keyConcepts.slice(0, 5),
    definitions: definitions.slice(0, 4),
    learningObjectives: [
      `Understand key principles of ${competencyMapping[0]?.subcompetency || "Official Statistics"}`,
      "Distinguish sources of bias and variance in statistical measurement",
      "Apply standardized protocols compliant with MoSPI official methodologies",
    ],
    competencyMapping: competencyMapping.length > 0 ? competencyMapping : [
      { domain: "Statistical Methods", subcompetency: "General Statistics", relevanceScore: 0.8 },
    ],
    summary,
  };
}
