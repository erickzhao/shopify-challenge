const fetch = require('node-fetch');

async function getMatches(id, page) {
  let response = await fetch(`https://backend-challenge-summer-2018.herokuapp.com/challenges.json?id=${id}&page=${page}`);
  let data = await response.json();
  return data;
}

getMatches(1,1)
  .then(data => console.log(data));