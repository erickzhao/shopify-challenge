const fetch = require('node-fetch');
const Graph = require('./graph.js');

async function getPage(caseId, page) {
  let response = await fetch(`https://backend-challenge-summer-2018.herokuapp.com/challenges.json?id=${caseId}&page=${page}`);
  let data = await response.json();
  return data;
}

function addToMenuGraph(graph, menus) {
  menus.forEach(menu => {
    graph.addVertex(menu.id, menu.child_ids);
  })
}

function countPages(itemsPerPage, totalItems) {
  return Math.ceil(totalItems/itemsPerPage);
}

async function initializeGraph(caseId) {
  const menuGraph = new Graph();
  const firstPage = await getPage(caseId, 1);
  addToMenuGraph(menuGraph, firstPage.menus);

  const numPages = countPages(firstPage.pagination.per_page, firstPage.pagination.total);

  const promises = [];
  for (let i=2; i<=numPages; i++) {
    promises.push(getPage(caseId, i));
  }
  const restOfPages = await Promise.all(promises);
  const restOfMenus = restOfPages.reduce((acc,val) => acc.concat(val.menus), []);
  addToMenuGraph(menuGraph, restOfMenus);
  return menuGraph;
}

initializeGraph(2).then(result => console.log(result));
