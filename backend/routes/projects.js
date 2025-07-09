const express = require('express');
const router = express.Router();
const { createProject, getProjects, getProject, updateProject, inviteCollaborator } = require('../controllers/projectController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, getProjects);
router.post('/', authMiddleware, createProject);
router.get('/:id', authMiddleware, getProject);
router.put('/:id', authMiddleware, updateProject);
router.post('/:id/invite', authMiddleware, inviteCollaborator);

module.exports = router;