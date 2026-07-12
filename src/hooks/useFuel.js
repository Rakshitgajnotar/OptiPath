import { useState, useCallback, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { fuelAPI } from '../services/api';
import { treeLayout, forceLayout } from '../utils/graphLayout';
import { FUEL_THEME } from '../utils/constants';

export default function useFuel() {
  const [edges, setEdges] = useState([]);
  const [seats, setSeats] = useState(2);
  const [result, setResult] = useState(null); // { minFuel, paths }
  const [error, setError] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /* Simulation playback */
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const playInterval = useRef(null);

  /* Load saved data on mount */
  useEffect(() => {
    (async () => {
      try {
        const data = await fuelAPI.getEdges();
        if (Array.isArray(data)) setEdges(data);
      } catch (err) {
        console.error('Failed to load fuel edges:', err);
      }
    })();
  }, []);

  /* Auto-play logic */
  useEffect(() => {
    if (isPlaying && steps.length > 0) {
      playInterval.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            clearInterval(playInterval.current);
            return prev;
          }
          return prev + 1;
        });
      }, 1200);
    } else {
      clearInterval(playInterval.current);
    }
    return () => clearInterval(playInterval.current);
  }, [isPlaying, steps.length]);

  /* Build simulation steps from result paths */
  const buildSteps = useCallback(
    (paths) => {
      if (!paths || paths.length === 0) return [];

      /* Collect all nodes */
      const allNodes = new Set();
      edges.forEach(([a, b]) => {
        allNodes.add(a);
        allNodes.add(b);
      });

      /* Initial state: each node has itself */
      let labels = {};
      allNodes.forEach((n) => (labels[n] = [n]));

      let activeEdges = edges.map(([a, b, w]) => ({ source: a, target: b, weight: w }));

      const builtSteps = [];

      /* Initial step (before any collection) */
      builtSteps.push({
        labels: { ...labels },
        activeEdges: [...activeEdges],
        description: 'Initial state — each node has 1 representative',
        activeEdgeIndex: -1,
        activeNodes: [],
      });

      paths.forEach(([from, to, cars, weight], i) => {
        /* Merge "from" into "to" */
        const newLabels = {};
        for (const [k, v] of Object.entries(labels)) {
          if (Number(k) !== from) {
            newLabels[k] = [...v];
          }
        }
        if (newLabels[to]) {
          newLabels[to] = [...newLabels[to], ...(labels[from] || [from])];
        }

        /* Remove edges involving "from" */
        const newEdges = activeEdges.filter(
          (e) => e.source !== from && e.target !== from
        );

        labels = newLabels;
        activeEdges = newEdges;

        builtSteps.push({
          labels: { ...labels },
          activeEdges: [...activeEdges],
          description: `Step ${i + 1}: Move ${labels[to]?.length || '?'} people from node ${from} → ${to} using ${cars} car${cars > 1 ? 's' : ''} (fuel: ${cars} × ${weight} = ${cars * weight})`,
          activeEdgeIndex: i,
          activeNodes: [from, to],
        });
      });

      return builtSteps;
    },
    [edges]
  );

  /* Compute graph data for GraphCanvas */
  const graphData = useCallback(
    (stepIndex) => {
      if (edges.length === 0) return { nodes: [], edges: [] };

      /* Use tree layout for fuel */
      const positions = treeLayout(
        edges.map(([a, b]) => [a, b]),
        0,
        { width: 600, height: 400 }
      );

      /* If no steps yet, just show the base graph */
      if (steps.length === 0 || stepIndex < 0) {
        const allNodes = new Set();
        edges.forEach(([a, b]) => {
          allNodes.add(a);
          allNodes.add(b);
        });

        const nodes = [...allNodes].map((id) => ({
          id,
          x: positions[id]?.x || 300,
          y: positions[id]?.y || 200,
          collected: 1,
        }));

        const graphEdges = edges.map(([a, b, w]) => ({
          source: a,
          target: b,
          weight: w,
        }));

        return { nodes, edges: graphEdges };
      }

      /* Use step data */
      const step = steps[stepIndex];
      if (!step) return { nodes: [], edges: [] };

      const nodes = Object.entries(step.labels).map(([id, members]) => ({
        id: Number(id),
        x: positions[Number(id)]?.x || 300,
        y: positions[Number(id)]?.y || 200,
        label: Number(id),
        collected: members.length,
        active: step.activeNodes?.includes(Number(id)),
      }));

      const graphEdges = step.activeEdges.map((e) => ({
        source: e.source,
        target: e.target,
        weight: e.weight,
        active: step.activeNodes?.includes(e.source) && step.activeNodes?.includes(e.target),
      }));

      return { nodes, edges: graphEdges };
    },
    [edges, steps]
  );

  /* Add edge */
  const addEdge = useCallback(async (from, to, weight) => {
    if (isNaN(from) || isNaN(to) || isNaN(weight)) {
      toast.error('Please enter valid numbers for all fields');
      return false;
    }
    if (weight <= 0) {
      toast.error('Weight must be a positive number');
      return false;
    }
    if (from < 0 || to < 0) {
      toast.error('Node numbers must be non-negative');
      return false;
    }
    if (from === to) {
      toast.error('Self-loops are not allowed');
      return false;
    }

    try {
      await fuelAPI.addEdge(from, to, weight);
      setEdges((prev) => [...prev, [from, to, weight]]);
      toast.success(`Edge ${from} → ${to} (distance: ${weight}) added`);
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  }, []);

  /* Delete edge (local only — backend doesn't support it) */
  const deleteEdge = useCallback((index) => {
    setEdges((prev) => prev.filter((_, i) => i !== index));
    toast.success('Edge removed');
  }, []);

  /* Clear all */
  const clearAll = useCallback(() => {
    setEdges([]);
    setResult(null);
    setError(null);
    setSteps([]);
    setCurrentStep(-1);
    setIsPlaying(false);
    toast.success('Graph cleared');
  }, []);

  /* Save */
  const saveEdges = useCallback(async () => {
    setIsLoading(true);
    try {
      await fuelAPI.saveEdges();
      toast.success('Edges saved successfully!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* Calculate */
  const calculate = useCallback(async () => {
    if (edges.length === 0) {
      toast.error('Add at least one edge before calculating');
      return;
    }
    if (seats < 1) {
      toast.error('Seats per car must be at least 1');
      return;
    }

    setIsCalculating(true);
    setError(null);
    setResult(null);
    setSteps([]);
    setCurrentStep(-1);
    setIsPlaying(false);

    try {
      const data = await fuelAPI.calculate(seats);

      if (data.error) {
        setError(data.error);
        toast.error(data.error);
        setIsCalculating(false);
        return;
      }

      setResult(data);

      /* Build simulation steps */
      const builtSteps = buildSteps(data.paths);
      setSteps(builtSteps);
      if (builtSteps.length > 0) setCurrentStep(0);

      toast.success(`Minimum fuel: ${data.minFuel}`);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsCalculating(false);
    }
  }, [edges, seats, buildSteps]);

  /* Playback controls */
  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  }, [steps.length]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const resetSteps = useCallback(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  return {
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
    theme: FUEL_THEME,
  };
}
