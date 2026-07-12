import styles from './Badge.module.css';

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
}) {
  return (
    <span
      className={[styles.badge, styles[variant], styles[size], className]
        .filter(Boolean)
        .join(' ')}
    >
      {dot && <span className={styles.dot} />}
      {children}
    </span>
  );
}
