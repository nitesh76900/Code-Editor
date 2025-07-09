const Message = require('../models/Message');
const Project = require('../models/Project');

exports.getChatHistory = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project || (!project.owner.equals(req.user.id) && !project.collaborators.includes(req.user.id))) {
      return res.status(403).json({ error: 'Unauthorized access to project' });
    }

    const messages = await Message.find({ projectId: req.params.id })
      .populate('sender', 'username')
      .sort({ timestamp: -1 })
      .limit(50);

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.saveMessage = async (messageData) => {
  try {
    if (!messageData.message || !messageData.sender || !messageData.projectId) {
      throw new Error('Incomplete message data');
    }

    const message = await Message.create(messageData);
    return await message.populate('sender', 'username');
  } catch (error) {
    throw new Error(error.message);
  }
};
