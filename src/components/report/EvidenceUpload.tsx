/**
 * Evidence Upload Component
 * Mulika Ufisadi - Corruption Reporting Platform
 */

import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import imageCompression from 'browser-image-compression';
import type { Evidence } from '../../types/report';

interface EvidenceUploadProps {
  evidence: Evidence[];
  onChange: (evidence: Evidence[]) => void;
  error?: string;
  maxFiles?: number;
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024; // 10MB
const TARGET_IMAGE_SIZE = 1 * 1024 * 1024; // 1MB target after compression

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const ACCEPTED_DOCUMENT_TYPES = ['application/pdf'];

export function EvidenceUpload({
  evidence,
  onChange,
  error,
  maxFiles = 3,
}: EvidenceUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const compressImage = async (file: File): Promise<File> => {
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: file.type,
      };

      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error('Error compressing image:', error);
      throw new Error('Failed to compress image');
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const processFile = async (file: File): Promise<Evidence | null> => {
    setUploadError(null);

    const isImage = ACCEPTED_IMAGE_TYPES.includes(file.type);
    const isDocument = ACCEPTED_DOCUMENT_TYPES.includes(file.type);

    if (!isImage && !isDocument) {
      setUploadError(`Invalid file type: ${file.name}. Only JPG, PNG, and PDF files are allowed.`);
      return null;
    }

    if (isImage && file.size > MAX_IMAGE_SIZE) {
      setUploadError(`Image ${file.name} is too large. Maximum size is 5MB.`);
      return null;
    }

    if (isDocument && file.size > MAX_DOCUMENT_SIZE) {
      setUploadError(`Document ${file.name} is too large. Maximum size is 10MB.`);
      return null;
    }

    try {
      let processedFile = file;

      if (isImage && file.size > TARGET_IMAGE_SIZE) {
        processedFile = await compressImage(file);
      }

      const base64Data = await fileToBase64(processedFile);

      const evidenceItem: Evidence = {
        type: isImage ? 'image' : 'document',
        data: base64Data,
        filename: file.name,
        size: processedFile.size,
      };

      return evidenceItem;
    } catch (error) {
      console.error('Error processing file:', error);
      setUploadError(`Failed to process ${file.name}. Please try again.`);
      return null;
    }
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remainingSlots = maxFiles - evidence.length;
    if (remainingSlots <= 0) {
      setUploadError(`Maximum ${maxFiles} files allowed.`);
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    setIsProcessing(true);
    setUploadError(null);

    const processedFiles: Evidence[] = [];

    for (const file of filesToProcess) {
      const processedFile = await processFile(file);
      if (processedFile) {
        processedFiles.push(processedFile);
      }
    }

    if (processedFiles.length > 0) {
      onChange([...evidence, ...processedFiles]);
    }

    setIsProcessing(false);
  };

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      await handleFiles(e.dataTransfer.files);
    },
    [evidence, maxFiles]
  );

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await handleFiles(e.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = (index: number) => {
    const newEvidence = evidence.filter((_, i) => i !== index);
    onChange(newEvidence);
    setUploadError(null);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="w-full">
      <label className="block mb-2 text-sm font-medium text-neutral-700 font-primary">
        Evidence Upload (Optional)
      </label>

      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer
          ${isDragging ? 'border-primary-500 bg-primary-50' : 'border-neutral-300 bg-white hover:border-primary-400 hover:bg-neutral-50'}
          ${error || uploadError ? 'border-red-500 bg-red-50' : ''}
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={[...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_DOCUMENT_TYPES].join(',')}
          multiple
          onChange={handleFileInputChange}
          disabled={isProcessing || evidence.length >= maxFiles}
        />

        <div className="flex flex-col items-center gap-3">
          {isProcessing ? (
            <>
              <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-neutral-600 font-primary">Processing files...</p>
            </>
          ) : (
            <>
              <svg
                className="w-12 h-12 text-neutral-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <div>
                <p className="text-base font-medium text-neutral-700 font-primary mb-1">
                  Drop files here or click to upload
                </p>
                <p className="text-sm text-neutral-500 font-primary">
                  Images (JPG, PNG) up to 5MB or PDFs up to 10MB
                </p>
                <p className="text-xs text-neutral-400 font-primary mt-1">
                  Maximum {maxFiles} files ({evidence.length}/{maxFiles} uploaded)
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {(error || uploadError) && (
        <p className="mt-1.5 text-sm text-red-500 font-primary" role="alert">
          {error || uploadError}
        </p>
      )}

      {evidence.length > 0 && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {evidence.map((item, index) => (
              <motion.div
                key={`${item.filename}-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="relative group bg-white border border-neutral-200 rounded-lg p-3 hover:shadow-md transition-shadow duration-200"
              >
                {item.type === 'image' ? (
                  <div className="aspect-video rounded-md overflow-hidden bg-neutral-100 mb-2">
                    <img
                      src={item.data}
                      alt={item.filename}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-video rounded-md overflow-hidden bg-neutral-100 mb-2 flex items-center justify-center">
                    <svg
                      className="w-16 h-16 text-red-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}

                <div className="space-y-1">
                  <p className="text-xs font-medium text-neutral-700 font-primary truncate" title={item.filename}>
                    {item.filename}
                  </p>
                  <p className="text-xs text-neutral-500 font-secondary">
                    {formatFileSize(item.size)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(index);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  aria-label={`Remove ${item.filename}`}
                >
                  <svg
                    className="w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
