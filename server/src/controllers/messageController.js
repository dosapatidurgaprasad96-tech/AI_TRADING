const asyncHandler = require('express-async-handler');
const Message = require('../models/Message');
const Admin = require('../models/Admin');
const Customer = require('../models/Customer');
const Trader = require('../models/Trader');

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
  const { receiverId, content } = req.body;

  if (!content) {
    res.status(400);
    throw new Error('Message content is required');
  }

  // Check all collections for receiver
  let receiver = await Admin.findById(receiverId);
  if (!receiver) receiver = await Customer.findById(receiverId);
  if (!receiver) receiver = await Trader.findById(receiverId);

  if (!receiver) {
    res.status(404);
    throw new Error('Receiver not found');
  }

  const message = await Message.create({
    sender: req.user._id,
    receiver: receiverId,
    content,
  });

  res.status(201).json(message);
});

// @desc    Get messages between two users
// @route   GET /api/messages/:otherUserId
// @access  Private
const getMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find({
    $or: [
      { sender: req.user._id, receiver: req.params.otherUserId },
      { sender: req.params.otherUserId, receiver: req.user._id },
    ],
  }).sort({ createdAt: 1 });

  res.json(messages);
});

module.exports = {
  sendMessage,
  getMessages,
};
