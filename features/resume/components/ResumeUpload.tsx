"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { UploadCloud, FileText, CheckCircle2 } from "lucide-react";

interface Props {
  onFileSelect: (file: File) => void;
}

export default function ResumeUpload({ onFileSelect }: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setSelectedFile(file);
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
    onDrop,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-3xl border-2 border-dashed p-10 shadow-sm transition-all duration-200
          ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30"
          }
        `}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center gap-5">
          {selectedFile ? (
            <>
              <div className="rounded-full bg-emerald-100 p-4 dark:bg-emerald-900/30">
                <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  Resume selected
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {selectedFile.name}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Drop a new file to replace, or click to browse
              </p>
            </>
          ) : (
            <>
              <div
                className={`rounded-full p-5 transition-colors ${
                  isDragActive
                    ? "bg-primary/10"
                    : "bg-muted"
                }`}
              >
                <UploadCloud
                  size={40}
                  className={
                    isDragActive
                      ? "text-primary"
                      : "text-muted-foreground"
                  }
                />
              </div>

              <div className="text-center">
                <h2 className="text-xl font-semibold">
                  {isDragActive
                    ? "Drop your resume here"
                    : "Upload Resume"}
                </h2>

                <p className="mt-2 text-muted-foreground">
                  {isDragActive
                    ? "Release to upload"
                    : "Drag & drop your PDF resume, or click to browse"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs text-muted-foreground">
                  <FileText className="h-3.5 w-3.5" />
                  PDF only
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs text-muted-foreground">
                  <UploadCloud className="h-3.5 w-3.5" />
                  Max 10 MB
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}