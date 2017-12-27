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
}

module.exports = MenuGraph;