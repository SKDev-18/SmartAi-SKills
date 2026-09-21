/**
 * Generates high-fidelity, multi-page (3-page A4 document) HTML for the embedded iframe notes viewer.
 * Ensures 100% native rendering on Android Chrome, iOS Safari, and Desktop without plugin blocks.
 */

interface NotesHtmlOptions {
  topicTitle: string;
  courseTitle?: string;
  moduleTitle?: string;
  category?: string;
  estimatedTime?: string;
  content: string;
}

function escapeHtml(text: string): string {
  return (text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatInlineMarkdown(text: string): string {
  // Bold **text**
  let formatted = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  // Inline code `code`
  formatted = formatted.replace(/`([^`]+)`/g, "<code>$1</code>");
  // Math notation $\mathcal{O}(...)$
  formatted = formatted.replace(/\$([^\$]+)\$/g, "<span class='math-tex'>$1</span>");
  return formatted;
}

function parseMarkdownSectionToHtml(markdown: string): string {
  const lines = markdown.split("\n");
  const htmlParts: string[] = [];
  let inCode = false;
  let codeLines: string[] = [];
  let codeLang = "";
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim().startsWith("```")) {
      if (inCode) {
        // Close code block
        const codeContent = escapeHtml(codeLines.join("\n"));
        htmlParts.push(`
          <div class="code-container">
            <div class="code-header">
              <span class="code-lang">${escapeHtml(codeLang || "C++ / Implementation")}</span>
              <span class="code-tag">Production Reference</span>
            </div>
            <pre><code>${codeContent}</code></pre>
          </div>
        `);
        codeLines = [];
        inCode = false;
      } else {
        if (inList) {
          htmlParts.push("</ul>");
          inList = false;
        }
        inCode = true;
        codeLang = line.trim().replace("```", "").trim();
        codeLines = [];
      }
      continue;
    }

    if (inCode) {
      codeLines.push(line);
      continue;
    }

    const trimmed = line.trim();
    if (!trimmed) {
      if (inList) {
        htmlParts.push("</ul>");
        inList = false;
      }
      continue;
    }

    // List item
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (!inList) {
        htmlParts.push("<ul>");
        inList = true;
      }
      const itemContent = formatInlineMarkdown(escapeHtml(trimmed.slice(2)));
      htmlParts.push(`<li>${itemContent}</li>`);
      continue;
    } else if (/^\d+\.\s/.test(trimmed)) {
      if (!inList) {
        htmlParts.push("<ol>");
        inList = true;
      }
      const itemContent = formatInlineMarkdown(escapeHtml(trimmed.replace(/^\d+\.\s/, "")));
      htmlParts.push(`<li>${itemContent}</li>`);
      continue;
    } else {
      if (inList) {
        htmlParts.push("</ul>");
        inList = false;
      }
    }

    // Headings
    if (trimmed.startsWith("# ")) {
      htmlParts.push(`<h1>${escapeHtml(trimmed.slice(2))}</h1>`);
    } else if (trimmed.startsWith("## ")) {
      htmlParts.push(`<h2>${escapeHtml(trimmed.slice(3))}</h2>`);
    } else if (trimmed.startsWith("### ")) {
      htmlParts.push(`<h3>${escapeHtml(trimmed.slice(4))}</h3>`);
    } else if (trimmed.startsWith("> ")) {
      htmlParts.push(`<blockquote>${formatInlineMarkdown(escapeHtml(trimmed.slice(2)))}</blockquote>`);
    } else {
      htmlParts.push(`<p>${formatInlineMarkdown(escapeHtml(trimmed))}</p>`);
    }
  }

  if (inList) {
    htmlParts.push("</ul>");
  }
  if (inCode) {
    htmlParts.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
  }

  return htmlParts.join("\n");
}

export function generateMultiPageNotesHtml(options: NotesHtmlOptions): string {
  const {
    topicTitle,
    courseTitle = "Computer Science & Engineering",
    moduleTitle = "Core Engineering Curriculum",
    estimatedTime = "25-30 mins",
    content,
  } = options;

  // Split content into 3 logical pages
  // We look for "## " headers to distribute content cleanly into 3 pages
  const rawSections = content.split(/\n(?=##\s)/g);

  let page1Content = "";
  let page2Content = "";
  let page3Content = "";

  if (rawSections.length >= 6) {
    // We have 6+ sections (standard NexStep comprehensive manual)
    // Page 1: First 2 sections (Overview + Memory Architecture)
    page1Content = rawSections.slice(0, 2).join("\n\n");
    // Page 2: Next 2 sections (Complexity + Code)
    page2Content = rawSections.slice(2, 4).join("\n\n");
    // Page 3: Remaining sections (Real-world + Edge cases + Interview cheatsheet)
    page3Content = rawSections.slice(4).join("\n\n");
  } else if (rawSections.length >= 3) {
    page1Content = rawSections[0];
    page2Content = rawSections[1];
    page3Content = rawSections.slice(2).join("\n\n");
  } else {
    // Fallback: chunk into thirds by character length
    const totalLen = content.length;
    const third = Math.floor(totalLen / 3);
    const split1 = content.indexOf("\n\n", third);
    const split2 = content.indexOf("\n\n", third * 2);

    if (split1 !== -1 && split2 !== -1) {
      page1Content = content.slice(0, split1);
      page2Content = content.slice(split1, split2);
      page3Content = content.slice(split2);
    } else {
      page1Content = content;
      page2Content = "## Practical Systems Engineering & Architecture\n- Deterministic bounds checking\n- Cache coherence and pipeline throughput\n- Production verification invariants";
      page3Content = "## High-Yield Interview Cheatsheet & Edge Cases\n- Space and Time trade-offs\n- Pathological inputs\n- Asymptotic derivations";
    }
  }

  const page1Html = parseMarkdownSectionToHtml(page1Content);
  const page2Html = parseMarkdownSectionToHtml(page2Content);
  const page3Html = parseMarkdownSectionToHtml(page3Content);

  const safeTopic = escapeHtml(topicTitle);
  const safeCourse = escapeHtml(courseTitle);
  const safeModule = escapeHtml(moduleTitle);
  const safeTime = escapeHtml(estimatedTime);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=3.0" />
  <title>${safeTopic} - Notes</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    body {
      background-color: #0f172a;
      color: #1e293b;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      padding: 24px 14px;
      line-height: 1.65;
      -webkit-font-smoothing: antialiased;
    }
    
    .viewer-container {
      max-width: 860px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 32px;
    }
    
    .notes-sheet {
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.35), 0 4px 6px -2px rgba(0, 0, 0, 0.1);
      border: 1px solid #cbd5e1;
      position: relative;
      overflow: hidden;
      padding: 44px 50px;
      min-height: 1040px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    
    /* Ruled Red Margin Line (Handwritten Notebook Feel) */
    .notes-sheet::before {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      left: 36px;
      width: 2px;
      background-color: rgba(239, 68, 68, 0.35);
      pointer-events: none;
    }
    
    @media (max-width: 640px) {
      body { padding: 10px 6px; }
      .notes-sheet { padding: 24px 18px; min-height: auto; border-radius: 8px; }
      .notes-sheet::before { display: none; }
    }
    
    .sheet-header {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 14px;
      margin-bottom: 22px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    
    .header-top-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
    }
    
    .badge-group {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    
    .tag-badge {
      display: inline-block;
      padding: 2.5px 9px;
      border-radius: 9999px;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      background-color: #eff6ff;
      color: #1d4ed8;
      border: 1px solid #bfdbfe;
    }
    
    .tag-page {
      font-size: 11px;
      font-weight: 700;
      background: #f8fafc;
      color: #475569;
      padding: 2.5px 10px;
      border-radius: 6px;
      border: 1px solid #cbd5e1;
    }
    
    .topic-main-title {
      font-size: 24px;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: -0.02em;
      line-height: 1.25;
    }
    
    .topic-sub-meta {
      font-size: 12px;
      color: #64748b;
      font-weight: 500;
    }
    
    .sheet-body {
      flex: 1;
    }
    
    .sheet-footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 12px;
      margin-top: 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      color: #64748b;
      font-weight: 600;
    }
    
    h1 {
      display: none; /* Already rendered in sheet header */
    }
    
    h2 {
      font-size: 16px;
      font-weight: 800;
      color: #1e3a8a;
      margin: 22px 0 12px 0;
      padding: 8px 12px;
      background: #f0f7ff;
      border-left: 4px solid #2563eb;
      border-radius: 4px;
      line-height: 1.35;
    }
    
    h3 {
      font-size: 13.5px;
      font-weight: 750;
      color: #0f172a;
      margin: 14px 0 6px 0;
    }
    
    p {
      font-size: 13.5px;
      color: #334155;
      margin-bottom: 12px;
      line-height: 1.68;
    }
    
    ul, ol {
      margin: 8px 0 14px 22px;
      font-size: 13.5px;
      color: #334155;
    }
    
    li {
      margin-bottom: 6px;
      line-height: 1.55;
    }
    
    blockquote {
      background: #fffbeb;
      border-left: 4px solid #f59e0b;
      padding: 10px 14px;
      margin: 14px 0;
      border-radius: 6px;
      color: #78350f;
      font-size: 13px;
      font-style: italic;
      line-height: 1.6;
    }
    
    .code-container {
      background: #090d16;
      border: 1px solid #1e293b;
      border-radius: 8px;
      margin: 16px 0;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    
    .code-header {
      background: #0f172a;
      padding: 7px 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #1e293b;
      font-size: 11px;
      color: #94a3b8;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }
    
    .code-lang {
      color: #60a5fa;
      font-weight: 700;
      text-transform: uppercase;
    }
    
    .code-tag {
      font-size: 10px;
      background: #1e293b;
      color: #94a3b8;
      padding: 2px 6px;
      border-radius: 4px;
    }
    
    pre {
      padding: 14px;
      overflow-x: auto;
      font-size: 12px;
      color: #e2e8f0;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      line-height: 1.5;
    }
    
    code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      background: #f1f5f9;
      color: #0f172a;
      padding: 2px 5px;
      border-radius: 4px;
      font-size: 12px;
    }
    
    pre code {
      background: transparent;
      color: #e2e8f0 !important;
      padding: 0;
      display: block;
      white-space: pre-wrap;
      word-break: break-word;
    }
    
    .math-tex {
      font-family: "Cambria Math", "Times New Roman", serif;
      font-style: italic;
      color: #090d16;
      background: #f1f5f9;
      padding: 1px 4px;
      border-radius: 3px;
    }

    @media print {
      body { background: white; padding: 0; }
      .viewer-container { max-width: 100%; gap: 0; }
      .notes-sheet {
        box-shadow: none;
        border: none;
        page-break-after: always;
        min-height: auto;
        padding: 18mm 16mm;
      }
      .notes-sheet::before { display: none; }
    }
  </style>
</head>
<body>
  <div class="viewer-container">
    
    <!-- PAGE 1 OF 3: EXECUTIVE OVERVIEW & MEMORY ARCHITECTURE -->
    <section class="notes-sheet">
      <div>
        <header class="sheet-header">
          <div class="header-top-row">
            <div class="badge-group">
              <span class="tag-badge">NexStep Study Compendium</span>
              <span class="tag-badge" style="background:#ecfdf5;color:#047857;border-color:#a7f3d0;">Verified Syllabus</span>
            </div>
            <span class="tag-page">Page 1 of 3</span>
          </div>
          <h1 class="topic-main-title">${safeTopic}</h1>
          <div class="topic-sub-meta">
            <span>Course: <strong>${safeCourse}</strong></span> • 
            <span>Module: <strong>${safeModule}</strong></span> • 
            <span>Est. Study: <strong>${safeTime}</strong></span>
          </div>
        </header>

        <div class="sheet-body">
          ${page1Html}
        </div>
      </div>

      <footer class="sheet-footer">
        <span>NexStep Engineering Curriculum • Theoretical Foundations</span>
        <span>Page 1 of 3</span>
      </footer>
    </section>

    <!-- PAGE 2 OF 3: MATHEMATICAL COMPLEXITY & PRODUCTION IMPLEMENTATION -->
    <section class="notes-sheet">
      <div>
        <header class="sheet-header">
          <div class="header-top-row">
            <div class="badge-group">
              <span class="tag-badge">Asymptotic Breakdown & Source Code</span>
            </div>
            <span class="tag-page">Page 2 of 3</span>
          </div>
          <div class="topic-sub-meta" style="margin-top:4px;">
            <span><strong>${safeTopic}</strong> • Mathematical & Algorithmic Analysis</span>
          </div>
        </header>

        <div class="sheet-body">
          ${page2Html}
        </div>
      </div>

      <footer class="sheet-footer">
        <span>NexStep Engineering Curriculum • Implementation & Complexity</span>
        <span>Page 2 of 3</span>
      </footer>
    </section>

    <!-- PAGE 3 OF 3: REAL-WORLD SYSTEMS, PITFALLS & INTERVIEW REVISION -->
    <section class="notes-sheet">
      <div>
        <header class="sheet-header">
          <div class="header-top-row">
            <div class="badge-group">
              <span class="tag-badge">Applied Engineering & Interview Cheatsheet</span>
            </div>
            <span class="tag-page">Page 3 of 3</span>
          </div>
          <div class="topic-sub-meta" style="margin-top:4px;">
            <span><strong>${safeTopic}</strong> • Edge Cases, Systems Heuristics & Q&A</span>
          </div>
        </header>

        <div class="sheet-body">
          ${page3Html}
        </div>
      </div>

      <footer class="sheet-footer">
        <span>NexStep Engineering Curriculum • End of Topic Compendium</span>
        <span>Page 3 of 3</span>
      </footer>
    </section>

  </div>
</body>
</html>`;
}
