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
      <h1 className={styles.title}>convert image to jpg 20kb</h1>
      <p className={styles.description}>Welcome to the ultimate solution for your image conversion needs. Whether you need to <strong>convert image to jpg 20kb</strong> for a web submission or perform a high-quality <strong>tiff to jpg</strong> conversion for your portfolio, our tool handles it all. Simply upload your file, choose your desired format, and let us do the rest. It&apos;s fast, free, and secure..</p>
      
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
          <h2 className={styles.seoTitle}>How to Convert Image to JPG 20kb</h2>
          <p>
              Many online platforms and forms have strict upload limits, often requiring images to be under a certain size, like 20kb. Our <strong>image to jpg converter 20kb</strong> is designed for this exact purpose. The process is simple:
          </p>
          <ol>
            <li>Upload your image in its original format (like PNG, BMP, or TIFF).</li>
            <li>Select &apos;JPG&apos; as the output format.</li>
            <li>Our engine will automatically optimize the conversion to get as close to 20kb as possible without destroying the image quality. If the output is still too large, you can take the converted JPG to our Image Compressor for further reduction.</li>
          </ol>
          <h2 className={styles.seoTitle}>Specialized and High-Resolution Conversions</h2>
          <h3 className={styles.seoSubtitle}>TIFF to JPG Conversion</h3>
           <p>
            Photographers and designers often work with TIFF files due to their high quality and lossless compression. However, these files are large and not web-friendly. Use our tool for a seamless <strong>tiff to jpg</strong> conversion, making your images ready for online galleries, social media, and client previews without a significant loss in visual fidelity.
          </p>
          
          <h3 className={styles.seoSubtitle}>Need a 3000x3000 Image Converter?</h3>
          <p>
            High-resolution images, such as those for print or detailed digital work, require a powerful converter. Our tool functions as a <strong>3000x3000 image converter</strong>, capable of handling large dimension files and converting them to the format you need, whether it&apos;s a versatile JPG or a transparent PNG.
          </p>

          <h2 className={styles.seoTitle}>Frequently Asked Questions</h2>
          <dl>
            <dt>Why would I need to <strong>convert image to jpg 20kb</strong>?</dt>
            <dd>This is common for online applications, government forms, or forums where file upload sizes are strictly limited to ensure fast loading times and efficient storage.</dd>
            
            <dt>What&apos;s the main benefit of a <strong>tiff to jpg</strong> conversion?</dt>
            <dd>The primary benefit is file size reduction. TIFFs are excellent for quality but are too large for web use. Converting to JPG makes them universally compatible and much smaller, making your website or portfolio load faster for visitors.</dd>
          </dl>
      </div>
    </div>
  );
}