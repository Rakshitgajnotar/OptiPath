import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import EmptyState from '../common/EmptyState.jsx';
import Badge from '../common/Badge.jsx';
import styles from './EdgeTable.module.css';

export default function EdgeTable({
  edges = [],
  columns = ['U', 'V', 'Weight'],
  onDelete,
  variant = 'default',
  maxHeight = 260,
}) {
  const variantBadge = variant === 'fuel' ? 'accent' : 'secondary';

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.label}>Edge List</span>
        <Badge variant={variantBadge} size="sm">
          {edges.length} edge{edges.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {edges.length === 0 ? (
        <EmptyState
          title="No edges yet"
          description="Add edges using the form above to build your graph."
        />
      ) : (
        <div className={styles.tableWrap} style={{ maxHeight }}>
          <table className={styles.table}>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col}>{col}</th>
                ))}
                {onDelete && <th style={{ width: 44 }}></th>}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {edges.map((edge, i) => (
                  <motion.tr
                    key={`${edge[0]}-${edge[1]}-${edge[2]}-${i}`}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <td>{edge[0]}</td>
                    <td>{edge[1]}</td>
                    <td>
                      <span className={styles.weight}>{edge[2]}</span>
                    </td>
                    {onDelete && (
                      <td>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => onDelete(i)}
                          title="Remove edge"
                          aria-label={`Remove edge ${edge[0]} to ${edge[1]}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    )}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
