"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, FileText, FileDown, ChevronDown } from "lucide-react";

interface Props {
  text: string;
  filename?: string;
}

export default function DownloadButton({ text, filename = "cover-letter" }: Props) {
  const [open, setOpen] = useState(false);

  const downloadTxt = () => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setOpen(false);
  };

  const downloadPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    // Convert markdown-like content to simple HTML
    const htmlContent = text
      .replace(/^### (.+)$/gm, '<h3 style="font-size:16px;font-weight:600;margin:16px 0 8px;">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 style="font-size:18px;font-weight:700;margin:20px 0 10px;">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 style="font-size:22px;font-weight:700;margin:24px 0 12px;">$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/^- (.+)$/gm, '<li style="margin-left:20px;margin-bottom:4px;">$1</li>')
      .replace(/\n{2,}/g, '</p><p style="margin-bottom:12px;line-height:1.6;">')
      .replace(/\n/g, '<br/>');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${filename}</title>
        <style>
          @page { margin: 1in; size: A4; }
          body {
            font-family: 'Georgia', 'Times New Roman', serif;
            font-size: 12pt;
            line-height: 1.6;
            color: #1a1a1a;
            max-width: 100%;
            margin: 0;
            padding: 0;
          }
          p { margin-bottom: 12px; }
          h1, h2, h3 { color: #111; }
          strong { font-weight: 700; }
          em { font-style: italic; }
          li { list-style-type: disc; }
        </style>
      </head>
      <body>
        <div style="padding: 0;">
          <p style="margin-bottom:12px;line-height:1.6;">${htmlContent}</p>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 300);
    setOpen(false);
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 rounded-xl border bg-background px-4 py-2.5 text-sm font-medium transition-all hover:bg-muted dark:border-zinc-700"
      >
        <Download className="h-4 w-4" />
        Download
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-xl border bg-background shadow-xl dark:border-zinc-700"
            >
              <button
                onClick={downloadPDF}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
              >
                <FileDown className="h-4 w-4 text-red-500" />
                Download as PDF
              </button>
              <button
                onClick={downloadTxt}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
              >
                <FileText className="h-4 w-4 text-blue-500" />
                Download as TXT
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}