// src/app/tools/image-converter/ImageConverterClient.tsx
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

const formatOptions = ['PNG', 'JPEG', 'WEBP', 'GIF', 'BMP', 'TIFF'];

export default function ImageConverterClient() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState('PNG');
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
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif', '.bmp', '.tiff'] },
    multiple: false,
  });

  useEffect(() => {
    if (!jobId || jobStatus?.status === 'COMPLETED' || jobStatus?.status === 'FAILED') return;

    const interval = setInterval(async () => {
      try {
        const response = await api.get(`/image/jobs/${jobId}/status/`);
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
    formData.append('uploaded_file', file);
    formData.append('tool_type', 'image_converter');
    formData.append('target_format', targetFormat);

    try {
      const response = await api.post('/image/convert/', formData, {
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
      case 'PROCESSING':
        return <div className={`${styles.statusBar} ${styles.statusProcessing}`}>Converting... Please wait.</div>;
      case 'COMPLETED':
        return <div className={`${styles.statusBar} ${styles.statusCompleted}`}>Conversion successful!</div>;
      case 'FAILED':
        return <div className={`${styles.statusBar} ${styles.statusError}`}>Error: {jobStatus.error_message || 'An unknown error occurred.'}</div>;
      default:
        return null;
    }
  };

  return (
    <div className={styles.toolContainer}>
      <h1 className={styles.title}>Image Converter</h1>
      <p className={styles.description}>Convert your images to a variety of formats like PNG, JPG, and WEBP.</p>
      
      {!file ? (
        <div {...getRootProps()} style={{ border: '2px dashed #2c2b4f', padding: '2rem', textAlign: 'center', cursor: 'pointer', borderRadius: '0.5rem' }}>
          <input {...getInputProps()} />
          <p>{isDragActive ? "Drop the image here..." : "Drag 'n' drop an image here, or click to select a file"}</p>
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
            <label htmlFor="format" className={styles.label}>
              Convert to:
            </label>
            <select
              id="format"
              value={targetFormat}
              onChange={(e) => setTargetFormat(e.target.value)}
              className={styles.selectInput}
            >
              {formatOptions.map(format => (
                <option key={format} value={format}>{format}</option>
              ))}
            </select>
          </div>
          <button onClick={handleSubmit} disabled={jobStatus?.status === 'PROCESSING'} className={styles.submitButton}>
            {jobStatus?.status === 'PROCESSING' ? 'Converting...' : 'Convert Image'}
          </button>
        </>
      )}

      {getStatusMessage()}
      
      {jobStatus?.status === 'COMPLETED' && jobStatus.id && (
        <a href={`https://api.opustools.xyz/api/image/jobs/${jobStatus.id}/download/`} className={styles.downloadButton}>
          Download Converted Image
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
          <h2 className={styles.seoTitle}>Flexible Image Format Conversion</h2>
          <p>
              Different platforms and use cases require different image formats. Our Image Converter allows you to easily switch between formats like the versatile PNG, the efficient WEBP, or the universally compatible JPEG, ensuring your images are always in the right format for the job.
          </p>
          <h3 className={styles.seoSubtitle}>Common Conversions</h3>
          <ul>
              <li><strong>PNG to JPG:</strong> Reduce file size for web use.</li>
              <li><strong>JPG to PNG:</strong> Add a transparent background.</li>
              <li><strong>To WEBP:</strong> Modern, efficient format for faster websites.</li>
          </ul>
      </div>
    </div>
  );
}