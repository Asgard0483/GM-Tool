import React, { useRef, useState } from 'react';
import { UploadCloud, X, Link } from 'lucide-react';
import { compressImage } from '@/shared/utils/imageCompressor';
import styles from './ImageUploadField.module.css';

/**
 * Props for the ImageUploadField component.
 */
interface ImageUploadFieldProps {
  /** The label displayed above the upload field */
  label: string;
  /** The current value (base64 string or URL). If provided, shows a preview. */
  value?: string;
  /** Callback fired when a new image is selected/processed or removed */
  onChange: (base64OrUrl: string) => void;
}

/**
 * A drag-and-drop image upload field that automatically compresses images
 * to a reasonable size and returns a base64 string or allows manual URL input.
 */
export default function ImageUploadField({ label, value, onChange }: ImageUploadFieldProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUrlMode, setIsUrlMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handles the drag over event to indicate the dropzone is active.
   */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  /**
   * Handles the drag leave event to remove the active dropzone indication.
   */
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  /**
   * Processes the selected file, compresses it, and triggers the onChange callback.
   * @param file The image file to process
   */
  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setIsProcessing(true);
    try {
      const base64 = await compressImage(file, 1024, 1024, 0.8);
      onChange(base64);
      setIsUrlMode(false);
    } catch (err) {
      console.error('Image compression failed', err);
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Handles the drop event, extracting the file and passing it to processFile.
   */
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };

  /**
   * Handles manual file selection via the hidden file input.
   */
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
    // Reset input so the same file can be selected again if removed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  /**
   * Clears the current image selection.
   */
  const handleRemove = () => {
    onChange('');
  };

  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>

      {value ? (
        <div className={styles.previewContainer}>
          <img src={value} alt="Preview" className={styles.previewImage} />
          <button 
            type="button" 
            className={styles.removeBtn} 
            onClick={handleRemove}
            title="Bild entfernen"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          className={`${styles.dropzone} ${isDragging ? styles.dragging : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadCloud size={32} className={styles.icon} />
          <span className={styles.text}>
            {isProcessing ? 'Verarbeite Bild...' : 'Bild hier ablegen oder klicken'}
          </span>
          <span className={styles.subtext}>(JPG, PNG, WebP – wird automatisch verkleinert)</span>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className={styles.hiddenInput}
          />
        </div>
      )}

      {/* URL Fallback */}
      {!value && !isUrlMode && (
        <button 
          type="button" 
          onClick={(e) => { e.preventDefault(); setIsUrlMode(true); }}
          style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}
        >
          <Link size={12} /> Oder eine Bild-URL einfügen
        </button>
      )}

      {isUrlMode && !value && (
        <div className={styles.manualUrl}>
          <input 
            type="text" 
            placeholder="https://example.com/image.jpg" 
            className={styles.urlInput}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onChange(e.currentTarget.value);
              }
            }}
            onBlur={(e) => {
              if (e.target.value) onChange(e.target.value);
            }}
            autoFocus
          />
        </div>
      )}
    </div>
  );
}
