# DAA Algorithm Visualizer

A merged web application that visualizes two important graph algorithms:
1. **Traveling Salesman Problem (TSP)** - Finding the shortest Hamiltonian cycle
2. **Fuel Calculator** - Computing minimum fuel for tree traversal

## 🚀 Quick Start

### Installation
```bash
cd "d:\5th Sem\DAA\Innovative assignment\MergedProjects\MergedApp"
npm install
```

### Run the Application
```bash
npm start
```

Open your browser and navigate to: **http://localhost:3000**

## 📖 How to Use

### Traveling Salesman Problem (TSP)

#### Step-by-step Instructions:

1. **Set Number of Nodes First**
   - Enter the total number of nodes in the "Number of Nodes (n)" field
   - Example: If you want nodes 0, 1, 2, 3 → enter **4**
   - ⚠️ **Important**: Node numbers must be between 0 and (n-1)

2. **Add Edges**
   - Node U: Starting node (e.g., 0)
   - Node V: Ending node (e.g., 1)
   - Weight: Distance/cost between nodes (must be positive)
   - Click "Add Edge"
   - **Note**: Edges are bidirectional (undirected graph)

3. **Save Configuration**
   - Click "Save to File" to persist your graph data
   - This saves your current graph structure

4. **Run Simulation**
   - Click "Run Simulation" to find the shortest Hamiltonian cycle
   - Watch the animated visualization showing the optimal path
   - Results show: Minimum cost and complete path

#### Example: Creating a Simple TSP Graph

For a 4-node graph:
1. Set "Number of Nodes" = **4**
2. Add edges:
   - Node U=0, V=1, Weight=10 → Click "Add Edge"
   - Node U=1, V=2, Weight=15 → Click "Add Edge"
   - Node U=2, V=3, Weight=20 → Click "Add Edge"
   - Node U=3, V=0, Weight=25 → Click "Add Edge"
3. Click "Save to File"
4. Click "Run Simulation"

### Fuel Calculator

#### Step-by-step Instructions:

1. **Add Edges to Create a Tree**
   - From Node: Parent node
   - To Node: Child node
   - Weight: Distance between nodes
   - Click "Add Edge"
   - **Note**: Must form a tree structure (no cycles)

2. **Save Edges** (Optional)
   - Click "Save Edges" to persist your tree structure

3. **Set Seats per Car**
   - Enter how many people can fit in one car
   - Default is 1

4. **Calculate Fuel**
   - Click "Calculate Fuel & Prepare Steps"
   - View the minimum fuel required
   - See the detailed path list

5. **Step Through Simulation**
   - Use "← Back" and "Next →" buttons to navigate through each step
   - Watch how representatives are collected from leaf nodes to the root

#### Example: Creating a Fuel Calculator Tree

For a tree rooted at node 0:
1. Add edges:
   - From=0, To=1, Weight=5 → Click "Add Edge"
   - From=0, To=2, Weight=3 → Click "Add Edge"
   - From=1, To=3, Weight=2 → Click "Add Edge"
   - From=1, To=4, Weight=4 → Click "Add Edge"
2. Click "Save Edges"
3. Set "Seats per Car" = **2**
4. Click "Calculate Fuel & Prepare Steps"
5. Use navigation buttons to see each step

## ⚠️ Common Issues & Solutions

### Issue: "Invalid node: nodes must be between 0 and X"
**Solution**: Make sure you've set the "Number of Nodes" correctly and all node numbers are within the valid range (0 to n-1).

### Issue: "Please add at least one edge!"
**Solution**: You need to add edges before running the simulation.

### Issue: "No Hamiltonian cycle exists"
**Solution**: The graph is not fully connected. Add more edges to ensure all nodes can be visited.

### Issue: Nothing appears on canvas
**Solution**: 
1. Check that you've saved the configuration with the correct number of nodes
2. Make sure your node numbers match the n value
3. Refresh the page and try again

### Issue: Fuel calculator shows 0 fuel
**Solution**: Make sure you've added edges and clicked "Calculate Fuel" button.

## 🎨 Features

- **Tabbed Interface**: Easily switch between TSP and Fuel Calculator
- **Real-time Visualization**: Watch algorithms execute step-by-step
- **Interactive Canvas**: Visual representation of graphs and trees
- **Data Persistence**: Save and reload your configurations
- **Input Validation**: Prevents invalid inputs and provides helpful error messages
- **Responsive Design**: Works on different screen sizes

## 🔧 Technical Details

### Algorithms Used

**TSP (Traveling Salesman Problem)**:
- Floyd-Warshall algorithm for shortest paths
- Dynamic Programming with Bitmask for optimal tour
- Time Complexity: O(n² × 2ⁿ)

**Fuel Calculator**:
- Depth-First Search (DFS) for tree traversal
- Bottom-up calculation from leaves to root
- Time Complexity: O(n)

### Technology Stack
- **Backend**: Node.js, Express
- **Frontend**: Vanilla JavaScript, HTML5 Canvas
- **Styling**: CSS3 with gradients and animations

## 📁 Project Structure

```
MergedApp/
├── server.js              # Main server file
├── tsp.js                 # TSP algorithm implementation
├── fuelCalculator.js      # Fuel calculator implementation
├── package.json           # Dependencies
├── tsp-data.json          # TSP data storage
├── fuel-data.json         # Fuel data storage
└── public/
    ├── index.html         # Main HTML file
    ├── script.js          # Frontend JavaScript
    └── styles.css         # Styling
```

## 🐛 Debugging Tips

1. **Check Browser Console** (F12): Look for error messages
2. **Check Server Terminal**: Look for backend errors
3. **Verify Node Numbers**: Make sure all nodes are within valid range
4. **Check Edge List**: Ensure edges are added correctly in the table
5. **Refresh Page**: Sometimes a fresh start helps

## 📝 Tips for Best Results

### For TSP:
- Start with a small number of nodes (4-6) for testing
- Ensure the graph is complete (every node connected to every other node) for best results
- Add edges in both directions if creating manually
- Save your work frequently

### For Fuel Calculator:
- Create a proper tree structure (no cycles)
- Root node should be 0
- Keep the tree relatively small for clear visualization
- Try different "seats per car" values to see how it affects fuel consumption

## 🎯 Sample Data Sets

### TSP Example (4 nodes complete graph):
```
Number of Nodes: 4
Edges:
0 → 1 (weight: 10)
0 → 2 (weight: 15)
0 → 3 (weight: 20)
1 → 2 (weight: 35)
1 → 3 (weight: 25)
2 → 3 (weight: 30)
```

### Fuel Calculator Example (Tree):
```
Seats per Car: 2
Edges:
0 → 1 (weight: 5)
0 → 2 (weight: 10)
1 → 3 (weight: 3)
1 → 4 (weight: 8)
2 → 5 (weight: 6)
```

## 📞 Need Help?

If you encounter any issues:
1. Clear the data by refreshing the page
2. Check that node numbers are valid
3. Verify the server is running on port 3000
4. Check the browser console for detailed error messages

---

**Happy Visualizing! 🎉**
