import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause, SkipBack } from 'lucide-react';
import Button from '../common/Button.jsx';
import styles from './StepControls.module.css';

export default function StepControls({
  currentStep,
  totalSteps,
  onPrev,
  onNext,
  onReset,
  isPlaying = false,
  onTogglePlay,
  stepDescription = '',
}) {
  if (totalSteps === 0) return null;

  const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

  return (
    <motion.div
      className={styles.wrapper}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Progress bar */}
      <div className={styles.progressBar}>
        <motion.div
          className={styles.progressFill}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>

      <div className={styles.controls}>
        <div className={styles.left}>
          {onReset && (
            <Button
              variant="ghost"
              size="sm"
              icon={SkipBack}
              onClick={onReset}
              title="Reset to start"
            >
              Reset
            </Button>
          )}
        </div>

        <div className={styles.center}>
          <Button
            variant="ghost"
            size="sm"
            icon={ChevronLeft}
            onClick={onPrev}
            disabled={currentStep <= 0}
            title="Previous step"
          >
            Back
          </Button>

          {onTogglePlay && (
            <Button
              variant="primary"
              size="sm"
              icon={isPlaying ? Pause : Play}
              onClick={onTogglePlay}
              title={isPlaying ? 'Pause' : 'Auto-play'}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            iconRight={ChevronRight}
            onClick={onNext}
            disabled={currentStep >= totalSteps - 1}
            title="Next step"
          >
            Next
          </Button>
        </div>

        <div className={styles.right}>
          <span className={styles.stepCount}>
            <span className={styles.current}>{currentStep + 1}</span>
            <span className={styles.separator}>/</span>
            <span>{totalSteps}</span>
          </span>
        </div>
      </div>

      {/* Step description */}
      {stepDescription && (
        <motion.p
          key={stepDescription}
          className={styles.description}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {stepDescription}
        </motion.p>
      )}
    </motion.div>
  );
}
