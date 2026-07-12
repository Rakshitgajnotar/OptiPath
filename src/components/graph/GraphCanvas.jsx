import { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './GraphCanvas.module.css';

/**
 * SVG-based interactive graph canvas with zoom/pan.
 *
 * Props:
 *  - nodes: [{ id, x, y, label?, active?, collected? }]
 *  - edges: [{ source, target, weight, highlighted?, active? }]
 *  - theme: { nodeFill, nodeStroke, nodeRadius, nodeText, edgeStroke, highlightStroke, ... }
 *  - onNodeDrag?: (id, x, y) => void
 *  - className?: string
 */
export default function GraphCanvas({
  nodes = [],
  edges = [],
  theme = {},
  onNodeDrag,
  className = '',
}) {
  const svgRef = useRef(null);
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: 800, h: 500 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [draggingNode, setDraggingNode] = useState(null);

  const defaults = {
    nodeFill: '#0E1729',
    nodeStroke: '#6366F1',
    nodeStrokeWidth: 2.5,
    nodeRadius: 22,
    nodeText: '#FAFAFA',
    nodeGlow: 'rgba(99, 102, 241, 0.25)',
    edgeStroke: '#3F3F46',
    edgeStrokeWidth: 2,
    edgeWeightBg: '#27272A',
    edgeWeightText: '#A1A1AA',
    highlightStroke: '#F59E0B',
    highlightStrokeWidth: 3.5,
    highlightGlow: 'rgba(245, 158, 11, 0.4)',
    activeNodeFill: 'rgba(99, 102, 241, 0.15)',
    activeNodeStroke: '#818CF8',
    ...theme,
  };

  /* Auto-fit viewBox to contain all nodes with padding */
  useEffect(() => {
    if (nodes.length === 0) return;
    const pad = 80;
    const xs = nodes.map((n) => n.x);
    const ys = nodes.map((n) => n.y);
    const minX = Math.min(...xs) - pad;
    const minY = Math.min(...ys) - pad;
    const maxX = Math.max(...xs) + pad;
    const maxY = Math.max(...ys) + pad;
    setViewBox({
      x: minX,
      y: minY,
      w: Math.max(maxX - minX, 300),
      h: Math.max(maxY - minY, 250),
    });
  }, [nodes]);

  /* Zoom with mouse wheel */
  const handleWheel = useCallback(
    (e) => {
      e.preventDefault();
      const scale = e.deltaY > 0 ? 1.1 : 0.9;
      setViewBox((vb) => {
        const cx = vb.x + vb.w / 2;
        const cy = vb.y + vb.h / 2;
        const nw = vb.w * scale;
        const nh = vb.h * scale;
        return { x: cx - nw / 2, y: cy - nh / 2, w: nw, h: nh };
      });
    },
    []
  );

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    svg.addEventListener('wheel', handleWheel, { passive: false });
    return () => svg.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  /* Pan */
  const toSVG = useCallback(
    (clientX, clientY) => {
      const svg = svgRef.current;
      if (!svg) return { x: 0, y: 0 };
      const rect = svg.getBoundingClientRect();
      return {
        x: viewBox.x + ((clientX - rect.left) / rect.width) * viewBox.w,
        y: viewBox.y + ((clientY - rect.top) / rect.height) * viewBox.h,
      };
    },
    [viewBox]
  );

  const handlePointerDown = useCallback(
    (e) => {
      if (e.target.closest('[data-node-id]')) return;
      setIsPanning(true);
      setPanStart(toSVG(e.clientX, e.clientY));
      svgRef.current?.setPointerCapture(e.pointerId);
    },
    [toSVG]
  );

  const handlePointerMove = useCallback(
    (e) => {
      if (draggingNode !== null && onNodeDrag) {
        const pt = toSVG(e.clientX, e.clientY);
        onNodeDrag(draggingNode, pt.x, pt.y);
        return;
      }
      if (!isPanning) return;
      const pt = toSVG(e.clientX, e.clientY);
      setViewBox((vb) => ({
        ...vb,
        x: vb.x + (panStart.x - pt.x) * 0.5,
        y: vb.y + (panStart.y - pt.y) * 0.5,
      }));
    },
    [isPanning, panStart, toSVG, draggingNode, onNodeDrag]
  );

  const handlePointerUp = useCallback(() => {
    setIsPanning(false);
    setDraggingNode(null);
  }, []);

  /* Build edge lookup for midpoint label positions */
  const nodeMap = useMemo(() => {
    const m = {};
    nodes.forEach((n) => (m[n.id] = n));
    return m;
  }, [nodes]);

  if (nodes.length === 0) {
    return (
      <div className={[styles.wrapper, styles.empty, className].filter(Boolean).join(' ')}>
        <div className={styles.emptyContent}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="12" cy="36" r="5" stroke="#3F3F46" strokeWidth="2" />
            <circle cx="36" cy="36" r="5" stroke="#3F3F46" strokeWidth="2" />
            <circle cx="24" cy="12" r="5" stroke="#3F3F46" strokeWidth="2" />
            <line x1="15" y1="33" x2="21" y2="15" stroke="#27272A" strokeWidth="1.5" strokeDasharray="4 3" />
            <line x1="33" y1="33" x2="27" y2="15" stroke="#27272A" strokeWidth="1.5" strokeDasharray="4 3" />
            <line x1="17" y1="36" x2="31" y2="36" stroke="#27272A" strokeWidth="1.5" strokeDasharray="4 3" />
          </svg>
          <p>Add edges to visualize the graph</p>
        </div>
      </div>
    );
  }

  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(' ')}>
      <svg
        ref={svgRef}
        className={styles.svg}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
        preserveAspectRatio="xMidYMid meet"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
      >
        {/* Defs for filters and gradients */}
        <defs>
          <filter id="glow-highlight" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-node" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grid pattern background */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1a1a2e" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect
          x={viewBox.x}
          y={viewBox.y}
          width={viewBox.w}
          height={viewBox.h}
          fill="url(#grid)"
          opacity="0.5"
        />

        {/* Edges */}
        {edges.map((edge, i) => {
          const src = nodeMap[edge.source];
          const tgt = nodeMap[edge.target];
          if (!src || !tgt) return null;

          const isHighlighted = edge.highlighted;
          const isActive = edge.active;

          const midX = (src.x + tgt.x) / 2;
          const midY = (src.y + tgt.y) / 2;

          return (
            <g key={`edge-${i}`}>
              {/* Edge line */}
              <line
                x1={src.x}
                y1={src.y}
                x2={tgt.x}
                y2={tgt.y}
                stroke={
                  isHighlighted
                    ? defaults.highlightStroke
                    : isActive
                    ? defaults.activeNodeStroke
                    : defaults.edgeStroke
                }
                strokeWidth={
                  isHighlighted
                    ? defaults.highlightStrokeWidth
                    : defaults.edgeStrokeWidth
                }
                strokeLinecap="round"
                filter={isHighlighted ? 'url(#glow-highlight)' : undefined}
                style={{
                  transition: 'stroke 0.3s ease, stroke-width 0.3s ease',
                }}
              />
              {/* Animated dash for active */}
              {isActive && (
                <line
                  x1={src.x}
                  y1={src.y}
                  x2={tgt.x}
                  y2={tgt.y}
                  stroke={defaults.highlightStroke}
                  strokeWidth={2}
                  strokeDasharray="8 6"
                  strokeLinecap="round"
                  className={styles.dashAnimate}
                />
              )}
              {/* Weight label */}
              {edge.weight !== undefined && (
                <g>
                  <rect
                    x={midX - 16}
                    y={midY - 10}
                    width={32}
                    height={20}
                    rx={6}
                    fill={defaults.edgeWeightBg}
                    stroke={isHighlighted ? defaults.highlightStroke : 'transparent'}
                    strokeWidth={1}
                    opacity={0.9}
                  />
                  <text
                    x={midX}
                    y={midY}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={isHighlighted ? defaults.highlightStroke : defaults.edgeWeightText}
                    fontSize="11"
                    fontWeight="600"
                    fontFamily="Inter, sans-serif"
                  >
                    {edge.weight}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const isActive = node.active;
          const r = defaults.nodeRadius;
          const stroke = isActive ? defaults.activeNodeStroke : defaults.nodeStroke;
          const fill = isActive ? defaults.activeNodeFill : defaults.nodeFill;

          return (
            <g
              key={`node-${node.id}`}
              data-node-id={node.id}
              style={{ cursor: onNodeDrag ? 'grab' : 'default' }}
              onPointerDown={(e) => {
                if (!onNodeDrag) return;
                e.stopPropagation();
                setDraggingNode(node.id);
                svgRef.current?.setPointerCapture(e.pointerId);
              }}
            >
              {/* Outer glow */}
              <circle
                cx={node.x}
                cy={node.y}
                r={r + 6}
                fill={isActive ? defaults.activeNodeStroke : defaults.nodeStroke}
                opacity={0.12}
                style={{ transition: 'opacity 0.3s ease' }}
              />
              {/* Main circle */}
              <circle
                cx={node.x}
                cy={node.y}
                r={r}
                fill={fill}
                stroke={stroke}
                strokeWidth={defaults.nodeStrokeWidth}
                filter={isActive ? 'url(#glow-node)' : undefined}
                style={{
                  transition: 'fill 0.3s ease, stroke 0.3s ease',
                }}
              />
              {/* Label */}
              <text
                x={node.x}
                y={node.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={defaults.nodeText}
                fontSize="14"
                fontWeight="700"
                fontFamily="Inter, sans-serif"
                pointerEvents="none"
              >
                {node.label !== undefined ? node.label : node.id}
              </text>
              {/* Collected badge (for fuel) */}
              {node.collected !== undefined && node.collected > 1 && (
                <g>
                  <circle
                    cx={node.x + r * 0.7}
                    cy={node.y - r * 0.7}
                    r={10}
                    fill={defaults.highlightStroke}
                  />
                  <text
                    x={node.x + r * 0.7}
                    y={node.y - r * 0.7}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#000"
                    fontSize="10"
                    fontWeight="700"
                    fontFamily="Inter, sans-serif"
                  >
                    {node.collected}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Zoom hint */}
      <div className={styles.hint}>Scroll to zoom · Drag to pan</div>
    </div>
  );
}
