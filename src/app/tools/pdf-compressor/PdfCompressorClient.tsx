// src/app/tools/pdf-compressor/PdfCompressorClient.tsx
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

type CompressionLevel = 'low' | 'medium' | 'high';

export default function PdfCompressorClient() {
  const [files, setFiles] = useState<File[]>([]);
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('medium');
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(currentFiles => [...currentFiles, ...acceptedFiles]);
    setJobId(null);
    setJobStatus(null);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: true,
  });

  const handleRemoveFile = (fileToRemove: File) => {
    setFiles(files.filter(file => file !== fileToRemove));
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
    if (files.length === 0) return setError('Please upload at least one PDF file.');
    
    setJobStatus({ id: '', status: 'PROCESSING', output_url: null, error_message: null });
    setError(null);

    const formData = new FormData();
    formData.append('tool_type', 'file_compressor');
    formData.append('compression_level', compressionLevel);

    files.forEach(file => {
      formData.append('files', file);
    });

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
      case 'PROCESSING': return <div className={`${styles.statusBar} ${styles.statusProcessing}`}>Compressing PDF(s)... Please wait.</div>;
      case 'COMPLETED': return <div className={`${styles.statusBar} ${styles.statusCompleted}`}>Compression successful!</div>;
      case 'FAILED': return <div className={`${styles.statusBar} ${styles.statusError}`}>Error: {jobStatus.error_message || 'An unknown error occurred.'}</div>;
      default: return null;
    }
  };

  return (
    <div className={styles.toolContainer}>
      <h1 className={styles.title}>PDF Compressor</h1>
      <p className={styles.description}>Reduce the file size of your PDF documents while balancing quality.</p>

      <div {...getRootProps()} style={{ border: '2px dashed #2c2b4f', padding: '2rem', textAlign: 'center', cursor: 'pointer', borderRadius: '0.5rem' }}>
        <input {...getInputProps()} />
        <p>{isDragActive ? "Drop the files here..." : "Drag 'n' drop PDF files here, or click to select"}</p>
      </div>

      {files.length > 0 && (
        <>
          <div className={styles.options}>
            <label className={styles.label}>Compression Level</label>
            <div style={{ display: 'flex', justifyContent: 'space-around', gap: '1rem' }}>
              {(['low', 'medium', 'high'] as CompressionLevel[]).map(level => (
                <button
                  key={level}
                  onClick={() => setCompressionLevel(level)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: `2px solid ${compressionLevel === level ? '#6f42c1' : '#2c2b4f'}`,
                    backgroundColor: compressionLevel === level ? 'rgba(111, 66, 193, 0.2)' : '#0d0c22',
                    color: '#ffffff',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.fileList}>
            {files.map((file, index) => (
              <div key={index} className={styles.fileItem} style={{cursor: 'default'}}>
                <p>📄 {file.name}</p>
                <button onClick={() => handleRemoveFile(file)} className={styles.removeButton}>&times;</button>
              </div>
            ))}
          </div>

          <button onClick={handleSubmit} disabled={jobStatus?.status === 'PROCESSING'} className={styles.submitButton}>
            {jobStatus?.status === 'PROCESSING' ? 'Compressing...' : `Compress ${files.length} PDF(s)`}
          </button>
        </>
      )}

      {getStatusMessage()}

      {jobStatus?.status === 'COMPLETED' && jobStatus.id && (
        <a href={`https://api.opustools.xyz/api/pdf/jobs/${jobStatus.id}/download/`} className={styles.downloadButton}>
          Download Compressed File(s)
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
        <h2 className={styles.seoTitle}>Optimize Your PDF Files</h2>
        <p>
          Large PDF files can be difficult to share and store. Our PDF Compressor reduces file sizes significantly, making them easier to email, upload, or archive. Choose from multiple compression levels to find the perfect balance between file size and quality for your needs.
        </p>
      </div>
    </div>
  );
}