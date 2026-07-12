/**
 * Force-directed graph layout utility.
 * Positions nodes using simple spring-based physics to prevent overlaps.
 * No external dependencies — pure JS implementation.
 */

/**
 * Calculate force-directed layout positions for nodes.
 *
 * @param {Array} edges - Array of [source, target, weight?] tuples
 * @param {Object} options
 * @param {number} options.width - Canvas width
 * @param {number} options.height - Canvas height
 * @param {number} options.iterations - Number of simulation steps
 * @param {number} options.repulsion - Repulsive force between nodes
 * @param {number} options.attraction - Spring attraction along edges
 * @returns {Object} Map of nodeId → { x, y }
 */
export function forceLayout(edges, options = {}) {
  const {
    width = 600,
    height = 400,
    iterations = 200,
    repulsion = 8000,
    attraction = 0.005,
    centerGravity = 0.01,
  } = options;

  /* Collect unique nodes */
  const nodeSet = new Set();
  edges.forEach(([s, t]) => {
    nodeSet.add(s);
    nodeSet.add(t);
  });
  const nodeIds = [...nodeSet].sort((a, b) => a - b);

  if (nodeIds.length === 0) return {};
  if (nodeIds.length === 1) {
    return { [nodeIds[0]]: { x: width / 2, y: height / 2 } };
  }

  /* Initialize positions in a circle */
  const positions = {};
  const velocities = {};
  const cx = width / 2;
  const cy = height / 2;
  const initRadius = Math.min(width, height) * 0.35;

  nodeIds.forEach((id, i) => {
    const angle = (i / nodeIds.length) * 2 * Math.PI - Math.PI / 2;
    positions[id] = {
      x: cx + initRadius * Math.cos(angle),
      y: cy + initRadius * Math.sin(angle),
    };
    velocities[id] = { x: 0, y: 0 };
  });

  /* Simulation */
  for (let iter = 0; iter < iterations; iter++) {
    const cooling = 1 - iter / iterations; // temperature decreases
    const forces = {};
    nodeIds.forEach((id) => (forces[id] = { x: 0, y: 0 }));

    /* Repulsion between all node pairs */
    for (let i = 0; i < nodeIds.length; i++) {
      for (let j = i + 1; j < nodeIds.length; j++) {
        const a = nodeIds[i];
        const b = nodeIds[j];
        const dx = positions[a].x - positions[b].x;
        const dy = positions[a].y - positions[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = (repulsion * cooling) / (dist * dist);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        forces[a].x += fx;
        forces[a].y += fy;
        forces[b].x -= fx;
        forces[b].y -= fy;
      }
    }

    /* Attraction along edges */
    edges.forEach(([s, t]) => {
      if (positions[s] && positions[t]) {
        const dx = positions[t].x - positions[s].x;
        const dy = positions[t].y - positions[s].y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = attraction * dist * cooling;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        forces[s].x += fx;
        forces[s].y += fy;
        forces[t].x -= fx;
        forces[t].y -= fy;
      }
    });

    /* Center gravity */
    nodeIds.forEach((id) => {
      forces[id].x += (cx - positions[id].x) * centerGravity;
      forces[id].y += (cy - positions[id].y) * centerGravity;
    });

    /* Apply forces with damping */
    const damping = 0.85;
    const maxSpeed = 15 * cooling;
    nodeIds.forEach((id) => {
      velocities[id].x = (velocities[id].x + forces[id].x) * damping;
      velocities[id].y = (velocities[id].y + forces[id].y) * damping;
      const speed = Math.sqrt(
        velocities[id].x ** 2 + velocities[id].y ** 2
      );
      if (speed > maxSpeed) {
        velocities[id].x *= maxSpeed / speed;
        velocities[id].y *= maxSpeed / speed;
      }
      positions[id].x += velocities[id].x;
      positions[id].y += velocities[id].y;
    });
  }

  return positions;
}

/**
 * Calculate hierarchical tree layout (top-down).
 * Best for the fuel calculator's tree structure.
 *
 * @param {Array} edges - Array of [parent, child, weight?] tuples
 * @param {number} root - Root node ID
 * @param {Object} options
 * @returns {Object} Map of nodeId → { x, y }
 */
export function treeLayout(edges, root = 0, options = {}) {
  const {
    width = 600,
    height = 400,
    horizontalSpacing = 60,
    verticalSpacing = 80,
  } = options;

  /* Build adjacency list */
  const adj = {};
  const allNodes = new Set();
  edges.forEach(([a, b]) => {
    if (!adj[a]) adj[a] = [];
    if (!adj[b]) adj[b] = [];
    adj[a].push(b);
    adj[b].push(a);
    allNodes.add(a);
    allNodes.add(b);
  });

  if (allNodes.size === 0) return {};

  /* BFS to build tree hierarchy from root */
  const children = {};
  const depth = {};
  const visited = new Set();
  const queue = [root];
  visited.add(root);
  depth[root] = 0;
  children[root] = [];

  while (queue.length > 0) {
    const node = queue.shift();
    const neighbors = adj[node] || [];
    for (const nb of neighbors) {
      if (!visited.has(nb)) {
        visited.add(nb);
        depth[nb] = depth[node] + 1;
        if (!children[node]) children[node] = [];
        children[node].push(nb);
        children[nb] = [];
        queue.push(nb);
      }
    }
  }

  /* Count subtree sizes for proportional spacing */
  const subtreeSize = {};
  function countSize(node) {
    let size = 1;
    for (const child of children[node] || []) {
      size += countSize(child);
    }
    subtreeSize[node] = size;
    return size;
  }
  countSize(root);

  /* Assign x positions using subtree sizes */
  const positions = {};
  const maxDepth = Math.max(...Object.values(depth), 0);
  const levelHeight = Math.min(verticalSpacing, (height - 80) / (maxDepth + 1));

  function assignPositions(node, left, right, d) {
    const cx = (left + right) / 2;
    positions[node] = {
      x: cx,
      y: 60 + d * levelHeight,
    };
    const kids = children[node] || [];
    if (kids.length === 0) return;

    const totalSize = kids.reduce((s, c) => s + (subtreeSize[c] || 1), 0);
    let currentLeft = left;
    for (const child of kids) {
      const fraction = (subtreeSize[child] || 1) / totalSize;
      const childRight = currentLeft + fraction * (right - left);
      assignPositions(child, currentLeft, childRight, d + 1);
      currentLeft = childRight;
    }
  }

  assignPositions(root, 40, width - 40, 0);

  return positions;
}
