/**
 * Directed graph data structure with adjacency list representation.
 */

class Graph {
  constructor() {
    this.adjList = new Map();
  }

  addVertex(v, incidents = []) {
    // give ability to add edges directly with vertex
    this.adjList.set(v, incidents);
  }

  addEdge(u,v) {
    this.adjList.get(u).push(v);
  }
}

module.exports = Graph;