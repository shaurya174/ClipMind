import { jsPDF } from "jspdf";
import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from "docx";

export function sanitizeFilename(title) {
  const base = (title || "clipmind-summary").trim().toLowerCase();
  return base.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "clipmind-summary";
}

export function formattedDate() {
  return new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function safeChunks(result) {
  return result?.summary?.chunk_summaries || [];
}
function safeTakeaways(result) {
  return result?.summary?.key_takeaways || [];
}

/* ---------------- Markdown ---------------- */
export function exportMarkdown(result) {
  const { title, duration } = result;
  const chunks = safeChunks(result);
  const takeaways = safeTakeaways(result);
  const lines = [];
  lines.push("# ClipMind AI Video Summarizer");
  lines.push("### AI-Generated Video Report");
  lines.push("");
  lines.push(`**Generated:** ${formattedDate()}`);
  lines.push(`**Video Title:** ${title}`);
  lines.push(`**Duration:** ${duration}`);
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("## Overall Summary");
  lines.push("");
  lines.push(result.summary?.overall_summary || "");
  lines.push("");
  if (takeaways.length > 0) {
    lines.push("## Key Takeaways");
    lines.push("");
    takeaways.forEach((point) => lines.push(`- ${point}`));
    lines.push("");
  }
  if (chunks.length > 0) {
    lines.push("## Chapter Summaries");
    lines.push("");
    chunks.forEach((chunk, i) => {
      lines.push(`### ${i + 1}. ${chunk.title}`);
      lines.push("");
      lines.push(`**Time Range:** ${chunk.start_time} – ${chunk.end_time}`);
      lines.push("");
      lines.push(chunk.summary || "");
      lines.push("");
      if (chunk.key_points && chunk.key_points.length > 0) {
        lines.push("**Key Points:**");
        lines.push("");
        chunk.key_points.forEach((point) => lines.push(`- ${point}`));
        lines.push("");
      }
    });
  }
  const blob = new Blob([lines.join("\n")], { type: "text/markdown;charset=utf-8" });
  downloadBlob(blob, `${sanitizeFilename(title)}.md`);
}

/* ---------------- Plain text ---------------- */
export function exportText(result) {
  const { title, duration } = result;
  const chunks = safeChunks(result);
  const takeaways = safeTakeaways(result);
  const divider = "=".repeat(60);
  const subDivider = "-".repeat(60);
  const lines = [];
  lines.push(divider);
  lines.push("CLIPMIND AI VIDEO SUMMARIZER");
  lines.push("AI-Generated Video Report");
  lines.push(divider);
  lines.push("");
  lines.push(`Generated:    ${formattedDate()}`);
  lines.push(`Video Title:  ${title}`);
  lines.push(`Duration:     ${duration}`);
  lines.push("");
  lines.push(subDivider);
  lines.push("OVERALL SUMMARY");
  lines.push(subDivider);
  lines.push("");
  lines.push(result.summary?.overall_summary || "");
  lines.push("");
  if (takeaways.length > 0) {
    lines.push(subDivider);
    lines.push("KEY TAKEAWAYS");
    lines.push(subDivider);
    lines.push("");
    takeaways.forEach((point) => lines.push(`  • ${point}`));
    lines.push("");
  }
  if (chunks.length > 0) {
    lines.push(subDivider);
    lines.push("CHAPTER SUMMARIES");
    lines.push(subDivider);
    lines.push("");
    chunks.forEach((chunk, i) => {
      lines.push(`${i + 1}. ${chunk.title}`);
      lines.push(`   Time Range: ${chunk.start_time} - ${chunk.end_time}`);
      lines.push("");
      lines.push(`   ${chunk.summary || ""}`);
      lines.push("");
      if (chunk.key_points && chunk.key_points.length > 0) {
        lines.push("   Key Points:");
        chunk.key_points.forEach((point) => lines.push(`     • ${point}`));
        lines.push("");
      }
    });
  }
  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  downloadBlob(blob, `${sanitizeFilename(title)}.txt`);
}

/* ---------------- PDF ---------------- */
export const PDF_MARGIN = 56;
export const PDF_INK = "#14131A";
export const PDF_VIOLET = "#8B7FFF";
export const PDF_CORAL = "#FF8B6B";
export const PDF_MUTED = "#6B6878";
export const PDF_TEXT = "#1F1D28";

export function ensureSpace(doc, cursor, needed, pageHeight) {
  if (cursor.y + needed > pageHeight - PDF_MARGIN) {
    doc.addPage();
    cursor.y = PDF_MARGIN;
  }
}

export function pdfHeading(doc, cursor, text, { size = 16, color = PDF_INK, spaceBefore = 18, spaceAfter = 10 } = {}) {
  const pageHeight = doc.internal.pageSize.getHeight();
  cursor.y += spaceBefore;
  ensureSpace(doc, cursor, size + spaceAfter, pageHeight);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(size);
  doc.setTextColor(color);
  doc.text(text, PDF_MARGIN, cursor.y);
  cursor.y += spaceAfter;
}

export function pdfRule(doc, cursor, color = "#E4E1DA") {
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setDrawColor(color);
  doc.setLineWidth(1);
  doc.line(PDF_MARGIN, cursor.y, pageWidth - PDF_MARGIN, cursor.y);
  cursor.y += 14;
}

export function pdfParagraph(doc, cursor, text, { size = 10.5, color = PDF_TEXT, lineHeight = 15, indent = 0 } = {}) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxWidth = pageWidth - PDF_MARGIN * 2 - indent;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(size);
  doc.setTextColor(color);
  const lines = doc.splitTextToSize(text || "", maxWidth);
  lines.forEach((line) => {
    ensureSpace(doc, cursor, lineHeight, pageHeight);
    doc.text(line, PDF_MARGIN + indent, cursor.y);
    cursor.y += lineHeight;
  });
}

export function pdfBulletList(doc, cursor, items, { size = 10.5, lineHeight = 15 } = {}) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const bulletIndent = 14;
  const maxWidth = pageWidth - PDF_MARGIN * 2 - bulletIndent;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(size);
  doc.setTextColor(PDF_TEXT);
  items.forEach((item) => {
    const lines = doc.splitTextToSize(item, maxWidth);
    lines.forEach((line, i) => {
      ensureSpace(doc, cursor, lineHeight, pageHeight);
      if (i === 0) {
        doc.setTextColor(PDF_CORAL);
        doc.text("•", PDF_MARGIN, cursor.y);
        doc.setTextColor(PDF_TEXT);
      }
      doc.text(line, PDF_MARGIN + bulletIndent, cursor.y);
      cursor.y += lineHeight;
    });
  });
}

export function exportPdf(result) {
  const { title, duration, video_id } = result;
  const chunks = safeChunks(result);
  const takeaways = safeTakeaways(result);

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const cursor = { y: PDF_MARGIN };

  doc.setFillColor(PDF_INK);
  doc.rect(0, 0, pageWidth, 128, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor("#F2EFE9");
  doc.text("ClipMind AI Video Summarizer", PDF_MARGIN, 52);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(PDF_VIOLET);
  doc.text("AI-Generated Video Report", PDF_MARGIN, 72);
  doc.setFontSize(9);
  doc.setTextColor("#A39FB0");
  doc.text(`Generated ${formattedDate()}`, PDF_MARGIN, 98);
  if (video_id) doc.text(`Source: youtube.com/watch?v=${video_id}`, PDF_MARGIN, 112);

  cursor.y = 128 + 36;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(PDF_TEXT);
  const titleLines = doc.splitTextToSize(title || "Untitled video", pageWidth - PDF_MARGIN * 2);
  titleLines.forEach((line) => {
    ensureSpace(doc, cursor, 20, pageHeight);
    doc.text(line, PDF_MARGIN, cursor.y);
    cursor.y += 20;
  });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(PDF_MUTED);
  doc.text(`Duration: ${duration || "—"}`, PDF_MARGIN, cursor.y);
  cursor.y += 20;

  pdfRule(doc, cursor);
  pdfHeading(doc, cursor, "Overall Summary", { color: PDF_VIOLET });
  pdfParagraph(doc, cursor, result.summary?.overall_summary);

  if (takeaways.length > 0) {
    pdfHeading(doc, cursor, "Key Takeaways", { color: PDF_VIOLET });
    pdfBulletList(doc, cursor, takeaways);
  }

  if (chunks.length > 0) {
    pdfHeading(doc, cursor, "Chapter Summaries", { color: PDF_VIOLET });
    chunks.forEach((chunk, i) => {
      ensureSpace(doc, cursor, 60, pageHeight);
      cursor.y += 6;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(PDF_TEXT);
      doc.text(`${i + 1}. ${chunk.title}`, PDF_MARGIN, cursor.y);
      cursor.y += 15;
      doc.setFont("courier", "normal");
      doc.setFontSize(9);
      doc.setTextColor(PDF_CORAL);
      doc.text(`${chunk.start_time}  →  ${chunk.end_time}`, PDF_MARGIN, cursor.y);
      cursor.y += 14;
      pdfParagraph(doc, cursor, chunk.summary);
      if (chunk.key_points && chunk.key_points.length > 0) {
        cursor.y += 2;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(PDF_MUTED);
        ensureSpace(doc, cursor, 14, pageHeight);
        doc.text("KEY POINTS", PDF_MARGIN, cursor.y);
        cursor.y += 13;
        pdfBulletList(doc, cursor, chunk.key_points, { size: 10 });
      }
      cursor.y += 10;
      if (i < chunks.length - 1) pdfRule(doc, cursor, "#EFEDE7");
    });
  }

  const pageCount = doc.internal.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor("#B5B2AC");
    doc.text("ClipMind AI Video Summarizer", PDF_MARGIN, pageHeight - 28);
    doc.text(`Page ${p} of ${pageCount}`, pageWidth - PDF_MARGIN - 60, pageHeight - 28);
  }

  doc.save(`${sanitizeFilename(title)}.pdf`);
}

/* ---------------- DOCX ---------------- */
const DOCX_VIOLET = "8B7FFF";
const DOCX_CORAL = "FF8B6B";
const DOCX_MUTED = "6B6878";
const DOCX_INK = "14131A";

export async function exportDocx(result) {
  const { title, duration, video_id } = result;
  const chunks = safeChunks(result);
  const takeaways = safeTakeaways(result);
  const children = [];

  children.push(
    new Paragraph({ children: [new TextRun({ text: "ClipMind AI Video Summarizer", bold: true, size: 40, color: DOCX_INK })], spacing: { after: 100 } }),
    new Paragraph({ children: [new TextRun({ text: "AI-Generated Video Report", italics: true, size: 24, color: DOCX_VIOLET })], spacing: { after: 240 } }),
    new Paragraph({ children: [new TextRun({ text: `Generated: ${formattedDate()}`, size: 20, color: DOCX_MUTED })], spacing: { after: 40 } }),
    new Paragraph({ children: [new TextRun({ text: `Video Title: ${title || "—"}`, size: 20, color: DOCX_MUTED })], spacing: { after: 40 } }),
    new Paragraph({ children: [new TextRun({ text: `Duration: ${duration || "—"}`, size: 20, color: DOCX_MUTED })], spacing: { after: 40 } })
  );

  if (video_id) {
    children.push(new Paragraph({ children: [new TextRun({ text: `Source: youtube.com/watch?v=${video_id}`, size: 20, color: DOCX_MUTED })], spacing: { after: 200 } }));
  }

  children.push(new Paragraph({ border: { bottom: { color: "E4E1DA", space: 1, style: "single", size: 6 } }, spacing: { after: 300 } }));

  children.push(
    new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 120, after: 160 }, children: [new TextRun({ text: "Overall Summary", color: DOCX_VIOLET, bold: true })] }),
    new Paragraph({ children: [new TextRun({ text: result.summary?.overall_summary || "", size: 22 })], spacing: { after: 280 } })
  );

  if (takeaways.length > 0) {
    children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 120, after: 160 }, children: [new TextRun({ text: "Key Takeaways", color: DOCX_VIOLET, bold: true })] }));
    takeaways.forEach((point) => {
      children.push(new Paragraph({ bullet: { level: 0 }, spacing: { after: 100 }, children: [new TextRun({ text: point, size: 22 })] }));
    });
    children.push(new Paragraph({ spacing: { after: 200 }, children: [] }));
  }

  if (chunks.length > 0) {
    children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 120, after: 200 }, children: [new TextRun({ text: "Chapter Summaries", color: DOCX_VIOLET, bold: true })] }));
    chunks.forEach((chunk, i) => {
      children.push(
        new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 240, after: 80 }, children: [new TextRun({ text: `${i + 1}. ${chunk.title}`, bold: true })] }),
        new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: `${chunk.start_time}  →  ${chunk.end_time}`, font: "Courier New", size: 18, color: DOCX_CORAL, bold: true })] }),
        new Paragraph({ spacing: { after: 140 }, children: [new TextRun({ text: chunk.summary || "", size: 22 })] })
      );
      if (chunk.key_points && chunk.key_points.length > 0) {
        children.push(new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "KEY POINTS", bold: true, size: 18, color: DOCX_MUTED })] }));
        chunk.key_points.forEach((point) => {
          children.push(new Paragraph({ bullet: { level: 0 }, spacing: { after: 80 }, children: [new TextRun({ text: point, size: 21 })] }));
        });
      }
    });
  }

  const doc = new Document({
    styles: { default: { document: { run: { font: "Calibri" } } } },
    sections: [{ properties: { page: { margin: { top: 900, bottom: 900, left: 900, right: 900 } } }, children }],
  });

  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, `${sanitizeFilename(title)}.docx`);
}

export const EXPORT_FORMATS = [
  { key: "pdf", label: "PDF Report", extension: "pdf", run: exportPdf },
  { key: "docx", label: "Word (.docx)", extension: "docx", run: exportDocx },
  { key: "markdown", label: "Markdown", extension: "md", run: exportMarkdown },
  { key: "text", label: "Plain Text", extension: "txt", run: exportText },
];

/* ---------------- Chat transcript export ---------------- */
function chatTranscriptLines(chatExport) {
  const lines = [];
  chatExport.messages.filter((m) => !m.failed).forEach((m) => {
    const speaker = m.role === "user" ? "You" : "ClipMind AI";
    lines.push({ speaker, text: m.text, sources: m.sources || [] });
  });
  return lines;
}

export function exportChatMarkdown(chatExport) {
  const { videoTitle, videoId } = chatExport;
  const lines = [];
  lines.push("# ClipMind AI Video Summarizer");
  lines.push("### Chat Transcript");
  lines.push("");
  lines.push(`**Generated:** ${formattedDate()}`);
  lines.push(`**Video Title:** ${videoTitle}`);
  if (videoId) lines.push(`**Video ID:** ${videoId}`);
  lines.push("");
  lines.push("---");
  lines.push("");
  chatTranscriptLines(chatExport).forEach(({ speaker, text, sources }) => {
    lines.push(`**${speaker}:**`);
    lines.push("");
    lines.push(text);
    if (sources.length > 0) {
      lines.push("");
      lines.push(`*Sources: ${sources.map((s) => `${s.start_time}–${s.end_time}`).join(", ")}*`);
    }
    lines.push("");
  });
  const blob = new Blob([lines.join("\n")], { type: "text/markdown;charset=utf-8" });
  downloadBlob(blob, `${sanitizeFilename(videoTitle)}-chat.md`);
}

export function exportChatText(chatExport) {
  const { videoTitle, videoId } = chatExport;
  const divider = "=".repeat(60);
  const subDivider = "-".repeat(60);
  const lines = [];
  lines.push(divider);
  lines.push("CLIPMIND AI VIDEO SUMMARIZER");
  lines.push("CHAT TRANSCRIPT");
  lines.push(divider);
  lines.push("");
  lines.push(`Generated:   ${formattedDate()}`);
  lines.push(`Video Title: ${videoTitle}`);
  if (videoId) lines.push(`Video ID:    ${videoId}`);
  lines.push("");
  lines.push(subDivider);
  lines.push("");
  chatTranscriptLines(chatExport).forEach(({ speaker, text, sources }) => {
    lines.push(`${speaker}:`);
    lines.push(`  ${text}`);
    if (sources.length > 0) lines.push(`  Sources: ${sources.map((s) => `${s.start_time}-${s.end_time}`).join(", ")}`);
    lines.push("");
  });
  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  downloadBlob(blob, `${sanitizeFilename(videoTitle)}-chat.txt`);
}

export function exportChatPdf(chatExport) {
  const { videoTitle, videoId } = chatExport;
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const cursor = { y: PDF_MARGIN };

  doc.setFillColor(PDF_INK);
  doc.rect(0, 0, pageWidth, 110, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor("#F2EFE9");
  doc.text("ClipMind AI Video Summarizer", PDF_MARGIN, 46);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(PDF_VIOLET);
  doc.text("Chat Transcript", PDF_MARGIN, 66);
  doc.setFontSize(9);
  doc.setTextColor("#A39FB0");
  doc.text(`Generated ${formattedDate()}`, PDF_MARGIN, 88);

  cursor.y = 110 + 30;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(PDF_TEXT);
  const titleLines = doc.splitTextToSize(videoTitle || "Untitled video", pageWidth - PDF_MARGIN * 2);
  titleLines.forEach((line) => {
    ensureSpace(doc, cursor, 18, pageHeight);
    doc.text(line, PDF_MARGIN, cursor.y);
    cursor.y += 18;
  });
  if (videoId) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(PDF_MUTED);
    doc.text(`Video ID: ${videoId}`, PDF_MARGIN, cursor.y);
    cursor.y += 18;
  }
  pdfRule(doc, cursor);

  chatTranscriptLines(chatExport).forEach(({ speaker, text, sources }) => {
    ensureSpace(doc, cursor, 30, pageHeight);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(speaker === "You" ? PDF_VIOLET : PDF_CORAL);
    doc.text(speaker, PDF_MARGIN, cursor.y);
    cursor.y += 16;
    pdfParagraph(doc, cursor, text, { indent: 10 });
    if (sources.length > 0) {
      doc.setFont("courier", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(PDF_MUTED);
      const sourceText = `Sources: ${sources.map((s) => `${s.start_time}-${s.end_time}`).join(", ")}`;
      ensureSpace(doc, cursor, 14, pageHeight);
      doc.text(sourceText, PDF_MARGIN + 10, cursor.y);
      cursor.y += 14;
    }
    cursor.y += 10;
  });

  const pageCount = doc.internal.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor("#B5B2AC");
    doc.text("ClipMind AI Video Summarizer", PDF_MARGIN, pageHeight - 28);
    doc.text(`Page ${p} of ${pageCount}`, pageWidth - PDF_MARGIN - 60, pageHeight - 28);
  }
  doc.save(`${sanitizeFilename(videoTitle)}-chat.pdf`);
}

export async function exportChatDocx(chatExport) {
  const { videoTitle, videoId } = chatExport;
  const children = [];
  children.push(
    new Paragraph({ children: [new TextRun({ text: "ClipMind AI Video Summarizer", bold: true, size: 40, color: DOCX_INK })], spacing: { after: 100 } }),
    new Paragraph({ children: [new TextRun({ text: "Chat Transcript", italics: true, size: 24, color: DOCX_VIOLET })], spacing: { after: 240 } }),
    new Paragraph({ children: [new TextRun({ text: `Generated: ${formattedDate()}`, size: 20, color: DOCX_MUTED })], spacing: { after: 40 } }),
    new Paragraph({ children: [new TextRun({ text: `Video Title: ${videoTitle || "—"}`, size: 20, color: DOCX_MUTED })], spacing: { after: 40 } })
  );
  if (videoId) {
    children.push(new Paragraph({ children: [new TextRun({ text: `Video ID: ${videoId}`, size: 20, color: DOCX_MUTED })], spacing: { after: 200 } }));
  }
  children.push(new Paragraph({ border: { bottom: { color: "E4E1DA", space: 1, style: "single", size: 6 } }, spacing: { after: 260 } }));

  chatTranscriptLines(chatExport).forEach(({ speaker, text, sources }) => {
    children.push(
      new Paragraph({ spacing: { before: 160, after: 60 }, children: [new TextRun({ text: speaker, bold: true, size: 21, color: speaker === "You" ? DOCX_VIOLET : DOCX_CORAL })] }),
      new Paragraph({ spacing: { after: sources.length > 0 ? 60 : 120 }, children: [new TextRun({ text, size: 22 })] })
    );
    if (sources.length > 0) {
      children.push(new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: `Sources: ${sources.map((s) => `${s.start_time}-${s.end_time}`).join(", ")}`, font: "Courier New", size: 17, color: DOCX_MUTED })] }));
    }
  });

  const doc = new Document({
    styles: { default: { document: { run: { font: "Calibri" } } } },
    sections: [{ properties: { page: { margin: { top: 900, bottom: 900, left: 900, right: 900 } } }, children }],
  });
  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, `${sanitizeFilename(videoTitle)}-chat.docx`);
}

export const CHAT_EXPORT_FORMATS = [
  { key: "pdf", label: "PDF Report", extension: "pdf", run: exportChatPdf },
  { key: "docx", label: "Word (.docx)", extension: "docx", run: exportChatDocx },
  { key: "markdown", label: "Markdown", extension: "md", run: exportChatMarkdown },
  { key: "text", label: "Plain Text", extension: "txt", run: exportChatText },
];
