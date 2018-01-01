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
      const [children, isInvalid] = this._DFSHelper(val, {}, {}, 1);
      const menu = {
        root_id: val,
        children: children
      };
      (isInvalid) ? acc.invalid_menus.push(menu) : acc.valid_menus.push(menu);
      return acc;
    }, {valid_menus: [], invalid_menus: []});
  }

  _DFSHelper(id, visited, recList, depth) {
    visited[id] = true;
    recList[id] = true;
    let isInvalid = false;
    const children = [];

    this.adjList.get(id).forEach(child => {
      children.push(child);
      let isUnvisited = !visited[child], isChildInvalid, grandchildren;
      if (isUnvisited) {
        [grandchildren, isChildInvalid] = this._DFSHelper(child, visited, recList, depth+1);
        children.push(...grandchildren);
      }
      if (recList[child] || depth > 4 || isChildInvalid) {
        isInvalid = true;
      }
    });

    recList[id] = false;
    return [children, isInvalid];
  }
}

module.exports = MenuGraph;