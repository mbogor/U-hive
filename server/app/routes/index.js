'use strict';
var router = require('express').Router();
module.exports = router;

// sballan No /api?
router.use('/tasks', require('./tasks'));
router.use('/api/users', require('./users'));





// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});
