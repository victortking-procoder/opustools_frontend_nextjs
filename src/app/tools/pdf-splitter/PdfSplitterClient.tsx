// src/app/tools/pdf-splitter/PdfSplitterClient.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Link from 'next/link';
import api from '@/lib/api';
import styles from '../PdfTool.module.css'; // Use the shared stylesheet

interface JobStatus {
  id: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  output_url: string | null;
  error_message: string | null;
}

export default function PdfSplitterClient() {
  const [file, setFile] = useState<File | null>(null);
  const [pageRanges, setPageRanges] = useState('');
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setJobId(null);
      setJobStatus(null);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });

  const handleRemoveFile = () => {
    setFile(null);
    setJobStatus(null);
    setError(null);
    setJobId(null);
  };

  useEffect(() => {
    if (!jobId || jobStatus?.status === 'COMPLETED' || jobStatus?.status === 'FAILED') return;

    const interval = setInterval(async () => {
      try {
        const response = await api.get(`/pdf/jobs/${jobId}/status/`);
        setJobStatus(response.data);
        if (['COMPLETED', 'FAILED'].includes(response.data.status)) {
          clearInterval(interval);
        }
      } catch (err) {
        setError('Could not retrieve job status.');
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [jobId, jobStatus]);

  const handleSubmit = async () => {
    if (!file) return setError('Please select a file first.');
    if (!pageRanges.trim()) return setError('Please enter the page ranges to extract.');

    setJobStatus({ id: '', status: 'PROCESSING', output_url: null, error_message: null });
    setError(null);

    const formData = new FormData();
    formData.append('tool_type', 'pdf_splitter');
    formData.append('files', file); // Correct key is 'files' (plural)
    formData.append('page_ranges', pageRanges);

    try {
      const response = await api.post('/pdf/process/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setJobId(response.data.id);
    } catch (err: any) {
      if (err.response?.data?.code === 'conversion_limit_exceeded') {
        setError('You have reached your daily limit for conversions.');
      } else {
        setError(err.response?.data?.detail || 'File upload failed.');
      }
      setJobStatus(null);
    }
  };

  const getStatusMessage = () => {
    if (!jobStatus) return null;
    switch (jobStatus.status) {
      case 'PROCESSING': return <div className={`${styles.statusBar} ${styles.statusProcessing}`}>Splitting PDF... Please wait.</div>;
      case 'COMPLETED': return <div className={`${styles.statusBar} ${styles.statusCompleted}`}>Split successful! Your download will be a .zip file.</div>;
      case 'FAILED': return <div className={`${styles.statusBar} ${styles.statusError}`}>Error: {jobStatus.error_message || 'An unknown error occurred.'}</div>;
      default: return null;
    }
  };

  return (
    <div className={styles.toolContainer}>
      <h1 className={styles.title}>PDF Splitter</h1>
      <p className={styles.description}>Extract one or more pages from your PDF document.</p>

      {!file ? (
        <div {...getRootProps()} style={{ border: '2px dashed #2c2b4f', padding: '2rem', textAlign: 'center', cursor: 'pointer', borderRadius: '0.5rem' }}>
          <input {...getInputProps()} />
          <p>{isDragActive ? "Drop the PDF here..." : "Drag 'n' drop a PDF here, or click to select a file"}</p>
        </div>
      ) : (
        <div className={styles.previewContainer}>
          <p style={{ fontSize: '2rem' }}>📄</p>
          <p style={{ marginTop: '1rem' }}>{file.name}</p>
          <button onClick={handleRemoveFile} style={{ marginTop: '0.5rem', color: '#fca5a5', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
            Remove
          </button>
        </div>
      )}

      {file && (
        <>
          <div className={styles.options}>
            <label htmlFor="pageRanges" className={styles.label}>
              Pages to Extract
            </label>
            <input
              id="pageRanges"
              type="text"
              placeholder="e.g., 1-3, 5, 8-10"
              value={pageRanges}
              onChange={(e) => setPageRanges(e.target.value)}
              className={styles.input}
            />
             <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '1rem' }}>Enter page numbers or ranges separated by commas. The result will be a .zip file.</p>
          </div>
          <button onClick={handleSubmit} disabled={jobStatus?.status === 'PROCESSING'} className={styles.submitButton}>
            {jobStatus?.status === 'PROCESSING' ? 'Splitting...' : 'Split PDF'}
          </button>
        </>
      )}

      {getStatusMessage()}
      
      {jobStatus?.status === 'COMPLETED' && jobStatus.id && (
        <a href={`https://api.opustools.xyz/api/pdf/jobs/${jobStatus.id}/download/`} className={styles.downloadButton}>
          Download Split PDFs (.zip)
        </a>
      )}
      
      {error && (
        <div className={`${styles.statusBar} ${styles.statusError}`}>
          {error}
          {error.includes('daily limit') && (
            <Link href="/register" style={{ color: '#ffffff', fontWeight: 'bold', textDecoration: 'underline', marginLeft: '0.5rem' }}>
              Sign Up for Unlimited Access
            </Link>
          )}
        </div>
      )}

      <div className={styles.seoContent}>
        <h2 className={styles.seoTitle}>Extract Pages from Your PDF with Precision</h2>
        <p>
          Our PDF Splitter allows you to easily extract specific pages or ranges from a large PDF document. Create new, smaller PDFs containing only the pages you need, perfect for separating chapters from a book, removing blank pages, or isolating important sections from a report for easy sharing.
        </p>
      </div>
    </div>
  );
}