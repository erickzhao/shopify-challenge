const fetch = require('node-fetch');
const bunyan = require('bunyan');
const MenuGraph = require('./menuGraph.js');

const log = bunyan.createLogger({name: 'MenuValidator'});

async function getPage(caseId, page) {
  let response = await fetch(`https://backend-challenge-summer-2018.herokuapp.com/challenges.json?id=${caseId}&page=${page}`);
  if (response.status !== 200) {
    throw new Error(`No response from Shopify API for ID ${caseId}, Page ${page}.`);
  }
  let data = await response.json();
  return data;
}

function countPages(itemsPerPage, totalItems) {
  return Math.ceil(totalItems/itemsPerPage);
}

async function initializeGraph(caseId) {
  const menuGraph = new MenuGraph();
  const firstPage = await getPage(caseId, 1);
  menuGraph.addMenus(firstPage.menus);

  const numPages = countPages(firstPage.pagination.per_page, firstPage.pagination.total);

  const promises = [];
  for (let i=2; i<=numPages; i++) {
    promises.push(getPage(caseId, i));
  }
  const restOfPages = await Promise.all(promises);
  const restOfMenus = restOfPages.reduce((acc,val) => acc.concat(val.menus), []);
  menuGraph.addMenus(restOfMenus);
  return menuGraph;
}

const caseNumber = Number(process.argv[2]) || 1;

initializeGraph(caseNumber)
  .then(graph => {
    const menus = graph.getMenus();
    console.log(JSON.stringify(menus));
  })
  .catch(error => {
    console.error(error);
  })
