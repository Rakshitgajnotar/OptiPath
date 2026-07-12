import { motion, AnimatePresence } from 'framer-motion';
import AnimatedCounter from '../common/AnimatedCounter.jsx';
import Badge from '../common/Badge.jsx';
import styles from './ResultPanel.module.css';

export default function ResultPanel({
  show = false,
  title = 'Result',
  value,
  valuePrefix = '',
  valueSuffix = '',
  variant = 'default',
  path = [],
  pathItems = [],
  error = null,
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={[styles.panel, error ? styles.errorPanel : styles[variant]]
            .filter(Boolean)
            .join(' ')}
          initial={{ opacity: 0, y: 16, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -8, height: 0 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        >
          {error ? (
            <div className={styles.errorContent}>
              <span className={styles.errorIcon}>✕</span>
              <div>
                <p className={styles.errorTitle}>Error</p>
                <p className={styles.errorMsg}>{error}</p>
              </div>
            </div>
          ) : (
            <>
              <p className={styles.title}>{title}</p>
              {typeof value === 'number' && (
                <AnimatedCounter
                  value={value}
                  prefix={valuePrefix}
                  suffix={valueSuffix}
                  variant={variant === 'accent' ? 'success' : 'default'}
                />
              )}
              {typeof value === 'string' && (
                <p className={styles.stringValue}>{value}</p>
              )}

              {/* Path chain */}
              {path.length > 0 && (
                <div className={styles.pathChain}>
                  {path.map((node, i) => (
                    <span key={i} className={styles.pathItem}>
                      <Badge variant={variant === 'accent' ? 'accent' : 'secondary'} size="md">
                        {node}
                      </Badge>
                      {i < path.length - 1 && (
                        <span className={styles.arrow}>→</span>
                      )}
                    </span>
                  ))}
                </div>
              )}

              {/* Detailed path items (fuel) */}
              {pathItems.length > 0 && (
                <ul className={styles.pathList}>
                  {pathItems.map((item, i) => (
                    <motion.li
                      key={i}
                      className={styles.pathListItem}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                    >
                      {item}
                    </motion.li>
                  ))}
                </ul>
              )}
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
