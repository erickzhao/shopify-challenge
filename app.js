const express = require('express');
const validator = require('./validator.js');
const app = express();

app.get('/menus', async(req, res) => {
  try {
    const menus = await validator.validate(req.query.id);
    res.json(menus);
  } catch(e) {
    res.status(404).json({
      message: e.message
    });
  }
});

app.listen(3000, () => console.log('Shopify back-end challenge listening on port 3000!'))