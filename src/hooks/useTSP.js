import { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import { tspAPI } from '../services/api';
import { TSP_THEME } from '../utils/constants';

export default function useTSP() {
  const [edges, setEdges] = useState([]);
  const [nodeCount, setNodeCount] = useState(0);
  const [result, setResult] = useState(null); // { cost, path }
  const [error, setError] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightPath, setHighlightPath] = useState([]);
  const [animStep, setAnimStep] = useState(-1);

  /* Load saved data on mount */
  useEffect(() => {
    (async () => {
      try {
        const data = await tspAPI.getData();
        setEdges(data.roads || []);
        setNodeCount(data.n || 0);
      } catch (err) {
        console.error('Failed to load TSP data:', err);
      }
    })();
  }, []);

  /* Compute graph nodes & edges for GraphCanvas — circular layout */
  const graphData = useCallback(() => {
    if (nodeCount === 0 && edges.length === 0) {
      return { nodes: [], edges: [] };
    }

    const n = nodeCount || (edges.length > 0 ? Math.max(...edges.flat()) + 1 : 0);

    /* Circular layout with dynamic radius */
    const radius = Math.max(220, n * 45);
    const cx = radius + 80; // center x with margin
    const cy = radius + 80; // center y with margin

    const nodes = [];
    for (let i = 0; i < n; i++) {
      const angle = (2 * Math.PI * i) / n - Math.PI / 2; // start from top
      nodes.push({
        id: i,
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle),
        active: highlightPath.includes(i),
      });
    }

    const graphEdges = edges.map(([u, v, w]) => {
      /* Check if this edge is part of the highlighted path */
      let highlighted = false;
      for (let j = 0; j < highlightPath.length - 1; j++) {
        if (
          (highlightPath[j] === u && highlightPath[j + 1] === v) ||
          (highlightPath[j] === v && highlightPath[j + 1] === u)
        ) {
          highlighted = true;
          break;
        }
      }
      return { source: u, target: v, weight: w, highlighted };
    });

    return { nodes, edges: graphEdges };
  }, [edges, nodeCount, highlightPath]);

  /* Add edge */
  const addEdge = useCallback(
    (u, v, w) => {
      if (isNaN(u) || isNaN(v) || isNaN(w)) {
        toast.error('Please enter valid numbers for all fields');
        return false;
      }
      if (w <= 0) {
        toast.error('Weight must be a positive number');
        return false;
      }
      if (u === v) {
        toast.error('Self-loops are not allowed (U ≠ V)');
        return false;
      }
      if (nodeCount > 0 && (u >= nodeCount || v >= nodeCount || u < 0 || v < 0)) {
        toast.error(`Nodes must be between 0 and ${nodeCount - 1}`);
        return false;
      }
      setEdges((prev) => [...prev, [u, v, w]]);
      toast.success(`Edge ${u} ↔ ${v} (weight: ${w}) added`);
      return true;
    },
    [nodeCount]
  );

  /* Delete edge */
  const deleteEdge = useCallback((index) => {
    setEdges((prev) => prev.filter((_, i) => i !== index));
    toast.success('Edge removed');
  }, []);

  /* Clear all */
  const clearAll = useCallback(() => {
    setEdges([]);
    setResult(null);
    setError(null);
    setHighlightPath([]);
    setAnimStep(-1);
    toast.success('Graph cleared');
  }, []);

  /* Save */
  const save = useCallback(async () => {
    if (nodeCount < 2) {
      toast.error('Need at least 2 nodes');
      return;
    }
    setIsLoading(true);
    try {
      await tspAPI.save({ roads: edges, n: nodeCount });
      toast.success('Graph saved successfully!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [edges, nodeCount]);

  /* Simulate */
  const simulate = useCallback(async () => {
    const n = nodeCount;
    if (n < 2) {
      toast.error('Set at least 2 nodes before simulating');
      return;
    }
    if (edges.length === 0) {
      toast.error('Add at least one edge before simulating');
      return;
    }

    setIsSimulating(true);
    setError(null);
    setResult(null);
    setHighlightPath([]);
    setAnimStep(-1);

    try {
      const data = await tspAPI.simulate(edges, n);

      if (typeof data.cost === 'string' && data.path.length === 0) {
        setError(data.cost);
        setIsSimulating(false);
        return;
      }

      setResult(data);

      /* Animate path step by step */
      const path = data.path;
      for (let i = 1; i <= path.length; i++) {
        await new Promise((r) => setTimeout(r, 600));
        setHighlightPath(path.slice(0, i));
        setAnimStep(i - 1);
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsSimulating(false);
    }
  }, [edges, nodeCount]);

  return {
    edges,
    nodeCount,
    setNodeCount,
    result,
    error,
    isSimulating,
    isLoading,
    highlightPath,
    animStep,
    graphData,
    addEdge,
    deleteEdge,
    clearAll,
    save,
    simulate,
    theme: TSP_THEME,
  };
}
