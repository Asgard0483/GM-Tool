import React, { forwardRef } from 'react';
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

/* ---- Basic Textarea ---- */
export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { rows?: number };
export const BaseTextarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', rows = 3, ...rest }, ref) => {
    return <textarea ref={ref} className={`${styles.textarea} ${className}`} rows={rows} {...rest} />;
  }
);
BaseTextarea.displayName = 'BaseTextarea';

/* ---- Smart Textarea with Mentions ---- */
export { MentionTextarea as Textarea } from '../molecules/MentionTextarea';

/* ---- Select ---- */
export function Select({ className = '', children, ...rest }: SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <select className={`${styles.select} ${className}`} {...rest}>
      {children}
    </select>
  );
}


