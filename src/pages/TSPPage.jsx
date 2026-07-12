import { useState } from 'react';
import { motion } from 'framer-motion';
import { Route as RouteIcon, Plus, Save, Play, Trash2 } from 'lucide-react';
import useTSP from '../hooks/useTSP';
import Card from '../components/common/Card.jsx';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';
import EdgeTable from '../components/ui/EdgeTable.jsx';
import ResultPanel from '../components/ui/ResultPanel.jsx';
import GraphCanvas from '../components/graph/GraphCanvas.jsx';
import styles from './TSPPage.module.css';

export default function TSPPage() {
  const {
    edges,
    nodeCount,
    setNodeCount,
    result,
    error,
    isSimulating,
    isLoading,
    graphData,
    addEdge,
    deleteEdge,
    clearAll,
    save,
    simulate,
    theme,
  } = useTSP();

  /* Local form state */
  const [formU, setFormU] = useState('');
  const [formV, setFormV] = useState('');
  const [formW, setFormW] = useState('');

  const handleAddEdge = () => {
    const success = addEdge(
      parseInt(formU),
      parseInt(formV),
      parseInt(formW)
    );
    if (success) {
      setFormU('');
      setFormV('');
      setFormW('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAddEdge();
  };

  const { nodes, edges: graphEdges } = graphData();

  return (
    <div className={styles.page}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className={styles.title}>
          <RouteIcon size={28} className={styles.titleIcon} />
          TSP Solver
        </h1>
        <p className={styles.subtitle}>
          Find the shortest Hamiltonian cycle using Floyd-Warshall + Dynamic Programming with bitmask optimization
        </p>
      </motion.div>

      <div className={styles.layout}>
        {/* Left panel — Controls */}
        <div className={styles.panel}>
          {/* Add Edge Card */}
          <Card title="Add Edge" icon={Plus} variant="secondary" delay={0.1}>
            <div className={styles.form}>
              <div className={styles.inputRow}>
                <Input
                  label="Node U"
                  value={formU}
                  onChange={(e) => setFormU(e.target.value)}
                  placeholder="0"
                  min={0}
                  id="tsp-nodeU"
                  onKeyDown={handleKeyDown}
                />
                <Input
                  label="Node V"
                  value={formV}
                  onChange={(e) => setFormV(e.target.value)}
                  placeholder="1"
                  min={0}
                  id="tsp-nodeV"
                  onKeyDown={handleKeyDown}
                />
                <Input
                  label="Weight"
                  value={formW}
                  onChange={(e) => setFormW(e.target.value)}
                  placeholder="10"
                  min={1}
                  id="tsp-weight"
                  onKeyDown={handleKeyDown}
                />
              </div>
              <Button
                variant="secondary"
                icon={Plus}
                onClick={handleAddEdge}
                fullWidth
                id="tsp-addEdgeBtn"
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
              columns={['U', 'V', 'Weight']}
              onDelete={deleteEdge}
              variant="secondary"
            />
          </motion.div>

          {/* Config & Actions */}
          <Card title="Configuration" delay={0.3}>
            <div className={styles.configSection}>
              <Input
                label="Total Nodes (n)"
                value={nodeCount || ''}
                onChange={(e) => setNodeCount(parseInt(e.target.value) || 0)}
                placeholder="4"
                min={2}
                id="tsp-nodesCount"
              />
              <div className={styles.actionRow}>
                <Button
                  variant="accent"
                  icon={Save}
                  onClick={save}
                  loading={isLoading}
                  id="tsp-saveBtn"
                >
                  Save
                </Button>
                <Button
                  variant="primary"
                  icon={Play}
                  onClick={simulate}
                  loading={isSimulating}
                  id="tsp-simulateBtn"
                >
                  {isSimulating ? 'Simulating...' : 'Find Optimal Path'}
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
            title="Minimum Cost Cycle"
            value={result?.cost}
            variant="default"
            path={result?.path || []}
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
        </div>
      </div>
    </div>
  );
}
