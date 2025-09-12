// src/app/tools/image-resizer/ImageResizerClient.tsx
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

export default function ImageResizerClient() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [width, setWidth] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');
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
    if (!width && !height) return setError('Please enter a width or a height.');

    setJobStatus({ id: '', status: 'PROCESSING', output_url: null, error_message: null });
    setError(null);

    const formData = new FormData();
    formData.append('uploaded_file', file);
    formData.append('tool_type', 'image_resizer');
    if (width) formData.append('width', width.toString());
    if (height) formData.append('height', height.toString());

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
        return <div className={`${styles.statusBar} ${styles.statusProcessing}`}>Resizing... Please wait.</div>;
      case 'COMPLETED':
        return <div className={`${styles.statusBar} ${styles.statusCompleted}`}>Resize successful!</div>;
      case 'FAILED':
        return <div className={`${styles.statusBar} ${styles.statusError}`}>Error: {jobStatus.error_message || 'An unknown error occurred.'}</div>;
      default:
        return null;
    }
  };

  return (
    <div className={styles.toolContainer}>
      <h1 className={styles.title}>Resize Image to 30kb</h1>
      <p className={styles.description}>Resizing an image isn&apos;t just about changing its dimensions; it&apos;s also about meeting specific file size requirements. With our tool, you can use the <strong>image resizer 20kb</strong> function for avatars, or <strong>resize image to 500kb</strong> for high-resolution banners. We provide the flexibility to control both pixel dimensions and file size</p>
      
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
            <div className={styles.dimensionInputs}>
              <div className={styles.dimensionInput}>
                <label htmlFor="width" className={styles.label}>Width (pixels)</label>
                <input
                  id="width"
                  type="number"
                  placeholder="e.g., 1920"
                  value={width}
                  onChange={(e) => setWidth(e.target.value === '' ? '' : Number(e.target.value))}
                  className={styles.input}
                />
              </div>
              <div className={styles.dimensionInput}>
                <label htmlFor="height" className={styles.label}>Height (pixels)</label>
                <input
                  id="height"
                  type="number"
                  placeholder="e.g., 1080"
                  value={height}
                  onChange={(e) => setHeight(e.target.value === '' ? '' : Number(e.target.value))}
                  className={styles.input}
                />
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '1rem' }}>Leave one field blank to maintain the aspect ratio.</p>
          </div>
          <button onClick={handleSubmit} disabled={jobStatus?.status === 'PROCESSING'} className={styles.submitButton}>
            {jobStatus?.status === 'PROCESSING' ? 'Resizing...' : 'Resize Image'}
          </button>
        </>
      )}

      {getStatusMessage()}
      
      {jobStatus?.status === 'COMPLETED' && jobStatus.id && (
        <a href={`https://api.opustools.xyz/api/image/jobs/${jobStatus.id}/download/`} className={styles.downloadButton}>
          Download Resized Image
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
        <h2 className={styles.seoTitle}>Your Go-To Resizer for Every File Size</h2>
        <h3 className={styles.seoSubtitle}>Small Sizes: Use the <strong>image resizer 20kb</strong> and <strong>resize image to 30kb</strong></h3>
        <p>
          When you need a tiny image for a forum signature, an icon, or a specific online portal, our tool is the perfect <strong>image resizer 20kb</strong>. It intelligently reduces the image dimensions and applies light compression to help you hit that target. The same process applies when you need to <strong>resize image to 30kb</strong>.
        </p>
        <h3 className={styles.seoSubtitle}>Medium Sizes: The Perfect <strong>image resizer in 50 kb</strong> and how to <strong>resize image 100kb</strong></h3>
        <p>
          For blog content, email newsletters, and product thumbnails, a balance between quality and size is key. Our <strong>image resize to 50 kb</strong> capability ensures your images are crisp and load quickly. If you need a bit more detail, the option to <strong>resize image 100kb</strong> is perfect for featured images.
        </p>
        <h2 className={styles.seoTitle}>Resizing for High-Resolution and Banners</h2>
        <p>
          For larger web graphics, like website banners or portfolio hero images, you need more detail. Our tool functions as an <strong>image resizer 200kb</strong> and can even handle requests to <strong>resize image to 500kb</strong>. This allows you to maintain excellent quality while still benefiting from significant file size reduction compared to the original.
        </p>
      </div>
    </div>
  );
}