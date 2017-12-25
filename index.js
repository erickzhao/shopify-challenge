const fetch = require('node-fetch');

async function getMatches(id, page) {
  let response = await fetch(`https://backend-challenge-summer-2018.herokuapp.com/challenges.json?id=${id}&page=${page}`);
  let data = await response.json();
  console.log(data);
  return data;
}

getMatches()
  .then(data => console.log(data));