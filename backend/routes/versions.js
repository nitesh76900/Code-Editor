const express = require('express');
const router = express.Router();
const { saveVersion, getVersions, revertVersion } = require('../controllers/versionController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/:id/version', authMiddleware, saveVersion);
router.get('/:id/versions', authMiddleware, getVersions);
router.post('/:id/revert/:vId', authMiddleware, revertVersion);

module.exports = router;