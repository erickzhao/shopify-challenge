const Graph = require('./graph.js');

/**
 * Extends graph data structure to fit the context of the
 * Menus detailed in this challenge. Includes roots to indicate
 * the highest level of menu label.
 * 
 * N.B. Based on the API JSON response (only 1 parent per menu item),
 * I could have used the Tree data structure as well, but I found
 * cycle detection in graphs more intuitive to implement, and the algorithm
 * is valid to trees as well.
 */
class MenuGraph extends Graph {
  constructor() {
    super();
    this.roots = [];
  }

  /**
   * Adds menus from Shopify API to adjacency list to build menu graph
   * @param {Object} menus 
   */
  addMenus(menus) {
    menus.forEach(menu => {
      if (!menu.parent_id) {
        this.roots.push(menu.id);
      }
      this.addVertex(menu.id, menu.child_ids);
    });
  }

  /**
   * Returns list of valid and invalid menus
   */
  getMenus() {
    return this.roots.reduce((acc,val) => {
      const [children, isInvalid] = this._validationHelper(val, {}, {}, 1);
      const menu = {
        root_id: val,
        children: children.sort((a, b) => a - b) // sorting to match the format of the example response
      };
      (isInvalid) ? acc.invalid_menus.push(menu) : acc.valid_menus.push(menu);
      return acc;
    }, {valid_menus: [], invalid_menus: []});
  }

  /**
   * Executes a depth-first search of the menu's adjacency list given an ID,
   * and returns the list of children for the menu item and its validity.
   * @param {number} id       menu item id
   * @param {Object} visited  hash map of visited vertices
   * @param {Object} recStack  hash map of vertices in current recursion stack
   * @param {number} depth    depth of menu item
   */
  _validationHelper(id, visited, recStack, depth) {
    // mark this vertex as visited and add it to recursion stack
    visited[id] = true;
    recStack[id] = true;

    // initialize variables to return
    let isInvalid = false;
    const children = [];

    // run method recursively on each child
    this.adjList.get(id).forEach(child => {
      // add child to children list whether or not it's unvisited because
      // challenge example response included invalid children as well
      children.push(child);

      let isUnvisited = !visited[child], isChildInvalid, grandchildren;

      // if child is unvisited, run the validation helper recursively
      // to explore it and pass results to current vertex.
      if (isUnvisited) {
        [grandchildren, isChildInvalid] = this._validationHelper(child, visited, recStack, depth+1);
        children.push(...grandchildren);
      }

      // fail conditions:
      // 1. child in current recursion stack (cycle)
      // 2. child already invalid (cycle deeper in recursion)
      // 3. depth > 4 in menu
      if (recStack[child] || depth > 4 || isChildInvalid) {
        isInvalid = true;
      }
    });

    // after all recursive calls are executed, remove id from the recursion stack
    recStack[id] = false;
    return [children, isInvalid];
  }
}

module.exports = MenuGraph;