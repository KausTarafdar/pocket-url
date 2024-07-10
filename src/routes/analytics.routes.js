const express = require("express");
const { handleSingleAccessCount } = require("../controllers/analytic/single.access.controller");
const { handleUsageFrequency } = require("../controllers/analytic/frequency.controller");

const router = express.Router();

router.post('/id', handleSingleAccessCount);
router.get('/frequency', handleUsageFrequency);

module.exports = router;