import { useState } from 'react';
import styles from './Input.module.css';

export default function Input({
  label,
  type = 'number',
  value,
  onChange,
  placeholder,
  min,
  max,
  step,
  error,
  id,
  className = '',
  ...props
}) {
  const [focused, setFocused] = useState(false);
  const hasValue = value !== '' && value !== undefined && value !== null;

  return (
    <div
      className={[
        styles.wrapper,
        focused ? styles.focused : '',
        error ? styles.hasError : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <input
        id={id}
        type={type}
        className={styles.input}
        value={value}
        onChange={onChange}
        placeholder={focused ? placeholder : ' '}
        min={min}
        max={max}
        step={step}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
      {label && (
        <label
          htmlFor={id}
          className={[
            styles.label,
            focused || hasValue ? styles.labelFloat : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {label}
        </label>
      )}
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
