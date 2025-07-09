const Project = require('../models/Project');
const User = require('../models/User');

exports.createProject = async (req, res) => {
  try {
    const { title, language } = req.body;

    if (!title || !language) {
      return res.status(400).json({ error: 'Title and language are required' });
    }

    const project = await Project.create({
      title: title.trim(),
      language: language.trim(),
      content: '',
      owner: req.user.id,
      collaborators: [req.user.id],
      lastEditedAt: new Date(),
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user.id }, { collaborators: req.user.id }],
    })
      .populate('owner', 'username')
      .populate('lastEditedBy', 'username');

    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'username')
      .populate('collaborators', 'username')
      .populate('lastEditedBy', 'username');

    if (!project || (!project.owner.equals(req.user.id) && !project.collaborators.includes(req.user.id))) {
      return res.status(403).json({ error: 'Unauthorized access to project' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { title, language, content } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project || (!project.owner.equals(req.user.id) && !project.collaborators.includes(req.user.id))) {
      return res.status(403).json({ error: 'Unauthorized access to project' });
    }

    project.title = title?.trim() || project.title;
    project.language = language?.trim() || project.language;
    project.content = content || project.content;
    project.lastEditedBy = req.user.id;
    project.lastEditedAt = new Date();

    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.inviteCollaborator = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (!project.owner.equals(req.user.id)) {
      return res.status(403).json({ error: 'Only project owner can invite collaborators' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (project.owner.equals(user._id)) {
      return res.status(400).json({ error: 'Owner cannot be added as collaborator' });
    }

    const isAlreadyCollaborator = project.collaborators.some((collabId) => collabId.equals(user._id));
    if (isAlreadyCollaborator) {
      return res.status(400).json({ error: 'User is already a collaborator' });
    }

    project.collaborators.push(user._id);
    await project.save();

    res.json({ message: 'Collaborator added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
