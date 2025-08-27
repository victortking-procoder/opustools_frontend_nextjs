// src/app/tools/pdf-merger/PdfMergerClient.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Link from 'next/link';
import api from '@/lib/api';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styles from '../PdfTool.module.css';

interface JobStatus {
  id: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  output_url: string | null;
  error_message: string | null;
}

// A new, separate component for each sortable file item
function SortableFileItem({ id, file, onRemove }: { id: string, file: File, onRemove: (file: File) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={styles.fileItem}>
      <p>{file.name}</p>
      {/* Stop propagation to prevent drag from firing on button click */}
      <button onPointerDown={(e) => e.stopPropagation()} onClick={() => onRemove(file)} className={styles.removeButton}>&times;</button>
    </div>
  );
}

export default function PdfMergerClient() {
  const [files, setFiles] = useState<File[]>([]);
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.filter(newFile => !files.some(existingFile => existingFile.name === newFile.name));
    setFiles(currentFiles => [...currentFiles, ...newFiles]);
    setJobId(null);
    setJobStatus(null);
    setError(null);
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: true,
  });

  const handleRemoveFile = (fileToRemove: File) => {
    setFiles(files.filter(file => file.name !== fileToRemove.name));
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setFiles((items) => {
        const oldIndex = items.findIndex(item => item.name === active.id);
        const newIndex = items.findIndex(item => item.name === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
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
    if (files.length < 2) return setError('Please upload at least two PDF files to merge.');
    
    setJobStatus({ id: '', status: 'PROCESSING', output_url: null, error_message: null });
    setError(null);

    const formData = new FormData();
    formData.append('tool_type', 'pdf_merger');
    
    const mergeOrder = files.map(file => file.name);
    formData.append('merge_order', JSON.stringify(mergeOrder));

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
      case 'PROCESSING': return <div className={`${styles.statusBar} ${styles.statusProcessing}`}>Merging PDFs... Please wait.</div>;
      case 'COMPLETED': return <div className={`${styles.statusBar} ${styles.statusCompleted}`}>Merge successful!</div>;
      case 'FAILED': return <div className={`${styles.statusBar} ${styles.statusError}`}>Error: {jobStatus.error_message || 'An unknown error occurred.'}</div>;
      default: return null;
    }
  };

  return (
    <div className={styles.toolContainer}>
      <h1 className={styles.title}>PDF Merger</h1>
      <p className={styles.description}>Combine multiple PDF files into one. Drag and drop files to change their order.</p>

      <div {...getRootProps()} style={{ border: '2px dashed #2c2b4f', padding: '2rem', textAlign: 'center', cursor: 'pointer', borderRadius: '0.5rem' }}>
        <input {...getInputProps()} />
        <p>{isDragActive ? "Drop the files here..." : "Drag 'n' drop PDF files here, or click to select"}</p>
      </div>

      {files.length > 0 && (
        <>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={files.map(f => f.name)} strategy={verticalListSortingStrategy}>
              <div className={styles.fileList}>
                {files.map((file) => (
                  <SortableFileItem key={file.name} id={file.name} file={file} onRemove={handleRemoveFile} />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <button onClick={handleSubmit} disabled={jobStatus?.status === 'PROCESSING' || files.length < 2} className={styles.submitButton}>
            {jobStatus?.status === 'PROCESSING' ? 'Merging...' : 'Merge PDFs'}
          </button>
        </>
      )}

      {getStatusMessage()}

      {jobStatus?.status === 'COMPLETED' && jobStatus.id && (
        <a href={`https://api.opustools.xyz/api/pdf/jobs/${jobStatus.id}/download/`} className={styles.downloadButton}>
          Download Merged PDF
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
        <h2 className={styles.seoTitle}>Combine PDFs with Ease</h2>
        <p>
          Effortlessly merge multiple PDF documents into a single, organized file. Perfect for combining reports, presentations, or important documents. Simply upload your files, arrange them in the desired order by dragging and dropping, and let our tool do the rest.
        </p>
      </div>
    </div>
  );
}