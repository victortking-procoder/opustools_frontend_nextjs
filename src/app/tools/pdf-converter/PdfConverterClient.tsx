// src/app/tools/pdf-converter/PdfConverterClient.tsx
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

const formatOptions = [
    { value: 'docx', label: 'Word (.docx)' },
    { value: 'xlsx', label: 'Excel (.xlsx)' },
    { value: 'pptx', label: 'PowerPoint (.pptx)' },
    { value: 'jpg', label: 'Image (.jpg)' },
];

export default function PdfConverterClient() {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState('docx');
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

    setJobStatus({ id: '', status: 'PROCESSING', output_url: null, error_message: null });
    setError(null);

    const formData = new FormData();
    formData.append('tool_type', 'pdf_converter');
    // Your backend expects the key to be 'files' for all pdf tools
    formData.append('file', file); 
    formData.append('target_format', targetFormat);

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
      case 'PROCESSING': return <div className={`${styles.statusBar} ${styles.statusProcessing}`}>Converting PDF... Please wait.</div>;
      case 'COMPLETED': return <div className={`${styles.statusBar} ${styles.statusCompleted}`}>Conversion successful!</div>;
      case 'FAILED': return <div className={`${styles.statusBar} ${styles.statusError}`}>Error: {jobStatus.error_message || 'An unknown error occurred.'}</div>;
      default: return null;
    }
  };

  return (
    <div className={styles.toolContainer}>
      <h1 className={styles.title}>PDF Converter</h1>
      <p className={styles.description}>Convert your PDF to Word, PowerPoint, Excel, or JPG.</p>

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
            <label htmlFor="format" className={styles.label}>
              Convert to Format
            </label>
            <select
              id="format"
              value={targetFormat}
              onChange={(e) => setTargetFormat(e.target.value)}
              className={styles.selectInput}
            >
              {formatOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <button onClick={handleSubmit} disabled={jobStatus?.status === 'PROCESSING'} className={styles.submitButton}>
            {jobStatus?.status === 'PROCESSING' ? 'Converting...' : 'Convert PDF'}
          </button>
        </>
      )}

      {getStatusMessage()}

      {jobStatus?.status === 'COMPLETED' && jobStatus.id && (
        <a href={`https://api.opustools.xyz/api/pdf/jobs/${jobStatus.id}/download/`} className={styles.downloadButton}>
          Download Converted File
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
        <h2 className={styles.seoTitle}>Unlock Your PDF Content</h2>
        <p>
          Our PDF Converter tool allows you to transform your static PDF files into editable formats like Microsoft Word, Excel, and PowerPoint. You can also convert your PDF pages into high-quality JPG images.
        </p>
      </div>
    </div>
  );
}