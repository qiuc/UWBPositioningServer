var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/realtime', function(req, res, next) {
  res.render('realtime', { title: 'Realtime Demo' });
});

module.exports = router;
