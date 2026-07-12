/**
 * Centralized API service layer for OptiPath.
 * All fetch calls go through here for consistent error handling.
 */

async function request(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.error || `Request failed (${response.status})`);
    }

    return await response.json();
  } catch (err) {
    if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
      throw new Error('Cannot connect to server. Make sure the backend is running on port 3000.');
    }
    throw err;
  }
}

/* ─── TSP API ─── */
export const tspAPI = {
  getData() {
    return request('/tsp/data');
  },

  save(data) {
    return request('/tsp/save', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  simulate(roads, n) {
    return request('/tsp/simulate', {
      method: 'POST',
      body: JSON.stringify({ roads, n }),
    });
  },
};

/* ─── Fuel Calculator API ─── */
export const fuelAPI = {
  getEdges() {
    return request('/fuel/edges');
  },

  addEdge(from, to, weight) {
    return request('/fuel/addEdge', {
      method: 'POST',
      body: JSON.stringify({ from, to, weight }),
    });
  },

  saveEdges() {
    return request('/fuel/saveEdges', {
      method: 'POST',
    });
  },

  calculate(seats) {
    return request('/fuel/calculate', {
      method: 'POST',
      body: JSON.stringify({ seats }),
    });
  },
};
