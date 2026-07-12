import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './AnimatedCounter.module.css';

export default function AnimatedCounter({
  value,
  duration = 1.2,
  prefix = '',
  suffix = '',
  className = '',
  variant = 'default',
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const prevValue = useRef(0);

  useEffect(() => {
    if (!isInView || typeof value !== 'number') return;

    const start = prevValue.current;
    const end = value;
    const startTime = performance.now();
    const durationMs = duration * 1000;

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      /* ease-out cubic */
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        prevValue.current = end;
      }
    }

    requestAnimationFrame(update);
  }, [value, isInView, duration]);

  return (
    <motion.div
      ref={ref}
      className={[styles.counter, styles[variant], className]
        .filter(Boolean)
        .join(' ')}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      <span className={styles.prefix}>{prefix}</span>
      <span className={styles.value}>{displayValue}</span>
      <span className={styles.suffix}>{suffix}</span>
    </motion.div>
  );
}
