'use strict';
var router = require('express').Router();
module.exports = router;

router.use('/users', require('./users'));
router.use('/tasks', require('./tasks'));
// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});
