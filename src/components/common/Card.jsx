import { motion } from 'framer-motion';
import styles from './Card.module.css';

export default function Card({
  children,
  title,
  subtitle,
  icon: Icon,
  variant = 'default',
  glow = false,
  className = '',
  delay = 0,
  ...props
}) {
  const classes = [
    styles.card,
    styles[variant],
    glow ? styles.glow : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <motion.div
      className={classes}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] }}
      {...props}
    >
      {(title || Icon) && (
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            {Icon && (
              <div className={styles.iconWrap}>
                <Icon size={20} />
              </div>
            )}
            <div>
              {title && <h3 className={styles.title}>{title}</h3>}
              {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            </div>
          </div>
        </div>
      )}
      <div className={styles.body}>{children}</div>
    </motion.div>
  );
}
