import { useState } from 'react';
import { motion } from 'framer-motion';
import { Fuel, Plus, Save, Zap, Trash2 } from 'lucide-react';
import useFuel from '../hooks/useFuel';
import Card from '../components/common/Card.jsx';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';
import EdgeTable from '../components/ui/EdgeTable.jsx';
import ResultPanel from '../components/ui/ResultPanel.jsx';
import StepControls from '../components/ui/StepControls.jsx';
import GraphCanvas from '../components/graph/GraphCanvas.jsx';
import styles from './FuelPage.module.css';

export default function FuelPage() {
  const {
    edges,
    seats,
    setSeats,
    result,
    error,
    isCalculating,
    isLoading,
    steps,
    currentStep,
    isPlaying,
    graphData,
    addEdge,
    deleteEdge,
    clearAll,
    saveEdges,
    calculate,
    nextStep,
    prevStep,
    resetSteps,
    togglePlay,
    theme,
  } = useFuel();

  /* Local form state */
  const [formFrom, setFormFrom] = useState('');
  const [formTo, setFormTo] = useState('');
  const [formWeight, setFormWeight] = useState('');

  const handleAddEdge = async () => {
    const success = await addEdge(
      parseInt(formFrom),
      parseInt(formTo),
      parseInt(formWeight)
    );
    if (success) {
      setFormFrom('');
      setFormTo('');
      setFormWeight('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAddEdge();
  };

  const { nodes, edges: graphEdges } = graphData(currentStep);

  const stepDescription = steps[currentStep]?.description || '';

  /* Path items for result panel */
  const pathItems = result?.paths?.map(
    ([from, to, cars, weight]) =>
      `Node ${from} → ${to} · ${cars} car${cars > 1 ? 's' : ''} × ${weight} dist = ${cars * weight} fuel`
  ) || [];

  return (
    <div className={styles.page}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className={styles.title}>
          <Fuel size={28} className={styles.titleIcon} />
          Fuel Optimizer
        </h1>
        <p className={styles.subtitle}>
          Calculate minimum fuel for tree traversal using DFS with bottom-up representative collection
        </p>
      </motion.div>

      <div className={styles.layout}>
        {/* Left panel — Controls */}
        <div className={styles.panel}>
          {/* Add Edge Card */}
          <Card title="Add Tree Edge" icon={Plus} variant="accentCard" delay={0.1}>
            <div className={styles.form}>
              <div className={styles.inputRow}>
                <Input
                  label="From Node"
                  value={formFrom}
                  onChange={(e) => setFormFrom(e.target.value)}
                  placeholder="0"
                  min={0}
                  id="fuel-from"
                  onKeyDown={handleKeyDown}
                />
                <Input
                  label="To Node"
                  value={formTo}
                  onChange={(e) => setFormTo(e.target.value)}
                  placeholder="1"
                  min={0}
                  id="fuel-to"
                  onKeyDown={handleKeyDown}
                />
                <Input
                  label="Distance"
                  value={formWeight}
                  onChange={(e) => setFormWeight(e.target.value)}
                  placeholder="5"
                  min={1}
                  id="fuel-weight"
                  onKeyDown={handleKeyDown}
                />
              </div>
              <Button
                variant="accent"
                icon={Plus}
                onClick={handleAddEdge}
                fullWidth
                id="fuel-addEdgeBtn"
              >
                Add Edge
              </Button>
            </div>
          </Card>

          {/* Edge Table */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <EdgeTable
              edges={edges}
              columns={['From', 'To', 'Distance']}
              onDelete={deleteEdge}
              variant="fuel"
            />
          </motion.div>

          {/* Config & Actions */}
          <Card title="Configuration" delay={0.3}>
            <div className={styles.configSection}>
              <Input
                label="Seats per Car"
                value={seats}
                onChange={(e) => setSeats(parseInt(e.target.value) || 1)}
                placeholder="2"
                min={1}
                id="fuel-seats"
              />
              <div className={styles.actionRow}>
                <Button
                  variant="accent"
                  icon={Save}
                  onClick={saveEdges}
                  loading={isLoading}
                  id="fuel-saveBtn"
                >
                  Save
                </Button>
                <Button
                  variant="primary"
                  icon={Zap}
                  onClick={calculate}
                  loading={isCalculating}
                  id="fuel-calculateBtn"
                >
                  {isCalculating ? 'Calculating...' : 'Calculate & Simulate'}
                </Button>
              </div>
              {edges.length > 0 && (
                <Button
                  variant="ghost"
                  icon={Trash2}
                  onClick={clearAll}
                  size="sm"
                  fullWidth
                >
                  Clear All
                </Button>
              )}
            </div>
          </Card>

          {/* Result */}
          <ResultPanel
            show={!!result || !!error}
            title="Minimum Fuel Required"
            value={result?.minFuel}
            valueSuffix=" units"
            variant="accent"
            pathItems={pathItems}
            error={error}
          />
        </div>

        {/* Right panel — Visualization */}
        <div className={styles.vizPanel}>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className={styles.canvasWrap}
          >
            <GraphCanvas
              nodes={nodes}
              edges={graphEdges}
              theme={theme}
            />
          </motion.div>

          {/* Step controls */}
          {steps.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ marginTop: 'var(--space-4, 16px)' }}
            >
              <StepControls
                currentStep={currentStep}
                totalSteps={steps.length}
                onPrev={prevStep}
                onNext={nextStep}
                onReset={resetSteps}
                isPlaying={isPlaying}
                onTogglePlay={togglePlay}
                stepDescription={stepDescription}
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
