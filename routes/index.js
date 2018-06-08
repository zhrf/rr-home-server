var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/firstView', function(req, res, next) {
  res.render('home', { title: 'hello my homepage!' });
});
module.exports = router;
