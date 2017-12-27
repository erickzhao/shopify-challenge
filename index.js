const fetch = require('node-fetch');
const Graph = require('./graph.js');


async function getMatches(id=1, page=1) {
  let response = await fetch(`https://backend-challenge-summer-2018.herokuapp.com/challenges.json?id=${id}&page=${page}`);
  let data = await response.json();
  return data;
}

getMatches()
  .then(data => console.log(data));