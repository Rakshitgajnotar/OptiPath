import { motion } from 'framer-motion';
import { Inbox } from 'lucide-react';
import styles from './EmptyState.module.css';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'No data yet',
  description = 'Get started by adding some items.',
  action,
}) {
  return (
    <motion.div
      className={styles.empty}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.iconWrap}>
        <Icon size={32} strokeWidth={1.5} />
      </div>
      <h4 className={styles.title}>{title}</h4>
      <p className={styles.description}>{description}</p>
      {action && <div className={styles.action}>{action}</div>}
    </motion.div>
  );
}
