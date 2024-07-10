const express = require('express');

const { handleShortGeneration } = require('../controllers/operation/short.controller');
const { handleCustomGeneration } = require('../controllers/operation/custom.controller');

const handleQrCode = require('../controllers/operation/qr.controller');

const router = express.Router();

//URL Creation
router.post('/short', handleShortGeneration);
router.post('/custom', handleCustomGeneration);
router.post('/qr-code', handleQrCode);

module.exports = router;