const Graph = require('./graph.js');

class MenuGraph extends Graph {
  constructor() {
    super();
    this.roots = [];
  }

  addMenus(menus) {
    menus.forEach(menu => {
      if (!menu.parent_id) {
        this.roots.push(menu.id);
      }
      this.addVertex(menu.id, menu.child_ids);
    });
  }

  getMenus() {
    return this.roots.map(parent => ({
      root_id: parent,
      children: this._DFSHelper(parent, {})
    }))
  }

  _DFSHelper(id, visited) {
    visited[id] = true;
    const children = [];

    this.adjList.get(id).forEach(child => {
      if (!visited[child]) {
        children.push(child);
        children.push(...this._DFSHelper(child, visited));
      } else {
        children.push(child);
      }
    });
    return children;
  }

  validate() {
    return this.roots.reduce((acc,val) => {
      acc[val] = !this._validationHelper(val, {}, {});
      return acc;
    },{});
  }

  _validationHelper(id, visited, recList) {
    visited[id] = true;
    recList[id] = true;
    let children = this.adjList.get(id);

    for (let i=0; i < children.length; i++) {
      const child = children[i];
      if (recList[child] || !visited[child] && this._validationHelper(child, visited, recList)) {
        return true;
      }
    }
    recList[id] = false;
    return false;
  }
}

module.exports = MenuGraph;