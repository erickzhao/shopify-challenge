const fetch = require('node-fetch');
const MenuGraph = require('./menuGraph.js');

/**
 * Wraps the Shopify API and returns JSON data for a page
 * @param {number} caseId   problem number
 * @param {number} page     page number
 */
async function getPage(caseId, page) {
  let response = await fetch(`https://backend-challenge-summer-2018.herokuapp.com/challenges.json?id=${caseId}&page=${page}`);
  if (response.status !== 200) {
    throw new Error(`No response from Shopify API for ID ${caseId}, Page ${page}.`);
  }
  let data = await response.json();
  return data;
}

/**
 * Calculates the number of pages needed to fit the number of items
 * @param {number} itemsPerPage   number of menus per page
 * @param {number} totalItems     total number of menus
 */
function countPages(itemsPerPage, totalItems) {
  return Math.ceil(totalItems / itemsPerPage);
}

/**
 * Generates menu graph based on the problem number passed in by
 * calling the Shopify API and returning a MenuGraph object.
 * @param {number} caseId   problem number
 */
async function initializeGraph(caseId) {
  const menuGraph = new MenuGraph();
  const firstPage = await getPage(caseId, 1);
  menuGraph.addMenus(firstPage.menus);

  // calculate how many pages we need based on first page response,
  // and generates promises for the number of pages needed.
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

/**
 * Generates the graph corresponding to the problem number
 * and gets the list of valid and invalid menus.
 * @param {number} caseNumber   problem number
 */
async function validateMenus(caseNumber) {
  const graph = await initializeGraph(caseNumber);
  return graph.getMenus();
}

// 
/**
 * Run code if validator is called directly from CLI.
 * Accepts 1 argument (problem ID). If it's a valid number,
 * pass it into the menu validator. Otherwise (for empty or
 * invalid argument), set it to problem #1.
 */
function runCLI() {
  if (require.main === module) {
    const caseNumber = Number(process.argv[2]) || 1;
    console.log(validateMenus(caseNumber));
  }
}

runCLI();
module.exports.validate = validateMenus;

