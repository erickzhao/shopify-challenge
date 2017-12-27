const fetch = require('node-fetch');
const Graph = require('./graph.js');

const menuGraph = new Graph();

async function getMatches(page=1, id=1) {
  let response = await fetch(`https://backend-challenge-summer-2018.herokuapp.com/challenges.json?id=${id}&page=${page}`);
  let data = await response.json();
  return data;
}

function addToMenuGraph(menus) {
  menus.forEach(menu => {
    menuGraph.addVertex(menu.id, menu.child_ids);
  })
}

function countPages(itemsPerPage, totalItems) {
  return Math.ceil(totalItems/itemsPerPage);
}

getMatches()
  .then(result => {
    addToMenuGraph(result.menus);
    const numPages = countPages(result.pagination.per_page, result.pagination.total);
    const promises = [];
    for (let i=2; i<=numPages; i++) {
      promises.push(getMatches(i));
    }
    return Promise.all(promises);
  })
  .then(results => {
    const menus = results.reduce((acc,val) => acc.concat(val.menus), []);
    addToMenuGraph(menus);
  })
  .catch(error => {
    console.log(`ERROR: ${error}`);
  });
