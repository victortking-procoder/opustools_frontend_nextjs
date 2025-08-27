// src/app/tools/image-compressor/ImageCompressorClient.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import Link from 'next/link';
import api from '@/lib/api';
import styles from '../ImageTool.module.css';

interface JobStatus {
  id: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  output_url: string | null;
  error_message: string | null;
}

export default function ImageCompressorClient() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [quality, setQuality] = useState(75);
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
    setJobStatus(null);
    setError(null);
    setJobId(null);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const currentFile = acceptedFiles[0];
      setFile(currentFile);
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      setPreview(URL.createObjectURL(currentFile));
      setJobId(null);
      setJobStatus(null);
      setError(null);
    }
  }, [preview]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    multiple: false,
  });

  useEffect(() => {
    if (!jobId || jobStatus?.status === 'COMPLETED' || jobStatus?.status === 'FAILED') {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const response = await api.get(`/image/jobs/${jobId}/status/`);
        const statusData: JobStatus = response.data;
        setJobStatus(statusData);

        if (statusData.status === 'COMPLETED' || statusData.status === 'FAILED') {
          clearInterval(interval);
        }
      } catch (err) {
        console.error('Failed to fetch job status:', err);
        setError('Could not retrieve job status.');
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [jobId, jobStatus]);

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    setJobStatus({ id: '', status: 'PROCESSING', output_url: null, error_message: null });
    setError(null);

    const formData = new FormData();
    formData.append('uploaded_file', file);
    formData.append('tool_type', 'image_compressor');
    formData.append('quality', quality.toString());

    try {
      const response = await api.post('/image/convert/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setJobId(response.data.id);
    } catch (err: any) {
      console.error('File upload failed:', err);
      if (err.response && err.response.data?.code === 'conversion_limit_exceeded') {
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
      case 'PROCESSING':
        return <div className={`${styles.statusBar} ${styles.statusProcessing}`}>Processing... Please wait.</div>;
      case 'COMPLETED':
        return <div className={`${styles.statusBar} ${styles.statusCompleted}`}>Compression successful!</div>;
      case 'FAILED':
        return <div className={`${styles.statusBar} ${styles.statusError}`}>Error: {jobStatus.error_message || 'An unknown error occurred.'}</div>;
      default:
        return null;
    }
  };

  return (
    <div className={styles.toolContainer}>
      <h1 className={styles.title}>Image Compressor</h1>
      <p className={styles.description}>Reduce the file size of your images without compromising quality.</p>
      
      {!file ? (
        <div {...getRootProps()} style={{ border: '2px dashed #2c2b4f', padding: '2rem', textAlign: 'center', cursor: 'pointer', borderRadius: '0.5rem' }}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the image here ...</p>
          ) : (
            <p>Drag & drop an image here, or click to select a file</p>
          )}
        </div>
      ) : (
        <div className={styles.previewContainer}>
          <Image src={preview!} alt="Selected preview" width={200} height={200} className={styles.previewImage} />
          <p style={{ marginTop: '1rem' }}>{file.name}</p>
          <button onClick={handleRemoveFile} style={{ marginTop: '0.5rem', color: '#fca5a5', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
            Remove
          </button>
        </div>
      )}

      {file && (
        <>
          <div className={styles.options}>
            <label htmlFor="quality" className={styles.label}>
              Compression Quality (0-100)
            </label>
            <input
              id="quality"
              type="range"
              min="0"
              max="100"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className={styles.slider}
            />
            <div className={styles.qualityValue}>{quality}</div>
          </div>

          <button onClick={handleSubmit} disabled={jobStatus?.status === 'PROCESSING'} className={styles.submitButton}>
            {jobStatus?.status === 'PROCESSING' ? 'Compressing...' : 'Compress Image'}
          </button>
        </>
      )}

      {getStatusMessage()}
      
      {jobStatus?.status === 'COMPLETED' && jobStatus.id && (
        <a href={`https://api.opustools.xyz/api/image/jobs/${jobStatus.id}/download/`} className={styles.downloadButton}>
          Download Compressed Image
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
        <h2 className={styles.seoTitle}>Optimize Your Images for the Web</h2>
        <p>
            Large image files can significantly slow down your website's loading speed, impacting user experience and search engine rankings. Our Image Compressor uses advanced algorithms to reduce the file size of your JPG, PNG, and WebP images to the smallest possible size while maintaining excellent visual quality.
        </p>
        <h3 className={styles.seoSubtitle}>Why Compress Images?</h3>
        <ul>
            <li><strong>Faster Website Speed:</strong> Improve your PageSpeed Insights score.</li>
            <li><strong>Better SEO:</strong> Search engines prefer fast-loading websites.</li>
            <li><strong>Save Storage and Bandwidth:</strong> Reduce hosting costs.</li>
        </ul>
      </div>
    </div>
  );
}