const express = require('express');
const router = express.Router();
const balanceController = require('../controllers/balanceController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);
router.get('/', balanceController.getBalances);

module.exports = router;