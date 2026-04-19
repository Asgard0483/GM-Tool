import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react';
import styles from './FormField.module.css';

/* ---- Label + wrapper ---- */
interface FormFieldProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}
export function FormField({ label, error, hint, required, children }: FormFieldProps) {
  return (
    <div className={styles.field}>
      {label && (
        <label className={styles.label}>
          {label}{required && <span className={styles.req}>*</span>}
        </label>
      )}
      {children}
      {hint && !error && <span className={styles.hint}>{hint}</span>}
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}

/* ---- Input ---- */
export function Input({ className = '', ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${styles.input} ${className}`} {...rest} />;
}

/* ---- Textarea ---- */
type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { rows?: number };
export function Textarea({ className = '', rows = 3, ...rest }: TextareaProps) {
  return <textarea className={`${styles.textarea} ${className}`} rows={rows} {...rest} />;
}

/* ---- Select ---- */
export function Select({ className = '', children, ...rest }: SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <select className={`${styles.select} ${className}`} {...rest}>
      {children}
    </select>
  );
}
