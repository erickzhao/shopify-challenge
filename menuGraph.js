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
    return this.roots.reduce((acc,val) => {
      const menu = {
        root_id: val,
        children: this._DFSHelper(val, {})
      };
      (this._validationHelper(val, {}, {}, 1)) ? acc.invalid_menus.push(menu) : acc.valid_menus.push(menu);
      return acc;
    }, {valid_menus: [], invalid_menus: []})
  }

  _DFSHelper(id, visited) {
    visited[id] = true;
    const children = [];

    this.adjList.get(id).forEach(child => {
      children.push(child);
      if (!visited[child]) {
        children.push(...this._DFSHelper(child, visited));
      }
    });
    return children;
  }

  _validationHelper(id, visited, recList, depth) {
    visited[id] = true;
    recList[id] = true;
    let children = this.adjList.get(id);

    for (let i=0; i < children.length; i++) {
      const child = children[i];
      if (recList[child] || depth > 4 || !visited[child] && this._validationHelper(child, visited, recList, depth+1)) {
        return true;
      }
    }
    recList[id] = false;
    return false;
  }
}

module.exports = MenuGraph;