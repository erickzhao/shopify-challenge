class Graph {
  constructor() {
    this.adjList = new Map();
  }

  addVertex(v, incidents = []) {
    this.adjList.set(v, incidents);
  }

  addEdge(u,v) {
    this.adjList.get(u).push(v);
  }
}