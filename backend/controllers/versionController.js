const Version = require('../models/Version');
const Project = require('../models/Project');

exports.saveVersion = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project || (!project.owner.equals(req.user.id) && !project.collaborators.includes(req.user.id))) {
      return res.status(403).json({ error: 'Unauthorized access to project' });
    }

    const version = await Version.create({
      projectId: req.params.id,
      snapshot: project.content,
      savedBy: req.user.id,
    });

    project.versions.push(version._id);
    await project.save();

    res.status(201).json(version);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getVersions = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project || (!project.owner.equals(req.user.id) && !project.collaborators.includes(req.user.id))) {
      return res.status(403).json({ error: 'Unauthorized access to project' });
    }

    const versions = await Version.find({ projectId: req.params.id })
      .populate('savedBy', 'username')
      .sort({ savedAt: -1 });

    res.json(versions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.revertVersion = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project || (!project.owner.equals(req.user.id) && !project.collaborators.includes(req.user.id))) {
      return res.status(403).json({ error: 'Unauthorized access to project' });
    }

    const version = await Version.findById(req.params.vId);
    if (!version || version.projectId.toString() !== req.params.id) {
      return res.status(404).json({ error: 'Version not found' });
    }

    project.content = version.snapshot;
    project.lastEditedBy = req.user.id;
    project.lastEditedAt = new Date();
    await project.save();

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
