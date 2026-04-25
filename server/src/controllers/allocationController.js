const asyncHandler = require('express-async-handler');
const { runAutoAllocation, checkReallocations, runSingleAllocation, finalizeAllocation, rejectAllocation, unassignTrader } = require('../services/allocationService');
const Allocation = require('../models/Allocation');
const Customer = require('../models/Customer');
const Trader = require('../models/Trader');

// @desc    Run full allocation engine
// @route   POST /api/allocate
// @access  Admin
const allocateAll = asyncHandler(async (req, res) => {
  const results = await runAutoAllocation();
  res.status(200).json(results);
});

const allocateOne = asyncHandler(async (req, res) => {
  try {
    const { clientId } = req.params;
    console.log(`[AI Match] Triggering allocation for client: ${clientId}`);
    const result = await runSingleAllocation(clientId);
    res.status(200).json(result);
  } catch (err) {
    console.error(`[AI Match Error]: ${err.message}`);
    res.status(500);
    throw err;
  }
});

// @desc    Reassign a client manually
const reassignClient = asyncHandler(async (req, res) => {
  const { clientId } = req.params;
  const { traderId } = req.body;

  const client = await Customer.findById(clientId);
  if (!client) return res.status(404).json({ message: 'Client not found' });

  if (client.assignedTraderId) {
    await Trader.findByIdAndUpdate(client.assignedTraderId, { $inc: { currentLoad: -1 } });
  }

  await Trader.findByIdAndUpdate(traderId, { $inc: { currentLoad: 1 } });

  client.assignedTraderId = traderId;
  await client.save();

  res.status(200).json({ message: 'Client reassigned successfully' });
});

const getTriggers = asyncHandler(async (req, res) => {
  const triggers = await checkReallocations();
  res.status(200).json(triggers);
});

const getAllocations = asyncHandler(async (req, res) => {
  const allocations = await Allocation.find({})
    .populate('clientId', 'name email riskAppetite portfolioValue complexity preferredSpecialization')
    .populate('traderId', 'name email level specialization performanceScore currentLoad capacity');
  res.status(200).json(allocations);
});

const getTraderAllocations = asyncHandler(async (req, res) => {
  const allocations = await Allocation.find({ traderId: req.params.traderId, status: 'Active' })
    .populate('clientId', 'name email riskAppetite portfolioValue complexity preferredSpecialization');
  res.status(200).json(allocations);
});

const finalizeProposal = asyncHandler(async (req, res) => {
  const { allocationId } = req.body;
  const result = await finalizeAllocation(allocationId);
  res.status(200).json(result);
});

const rejectProposal = asyncHandler(async (req, res) => {
  const { allocationId } = req.body;
  const result = await rejectAllocation(allocationId);
  res.status(200).json(result);
});

const unassignClient = asyncHandler(async (req, res) => {
  const { clientId } = req.body;
  const targetId = clientId || req.user._id;

  // Authority Check
  if (req.user.role !== 'Admin' && req.user._id.toString() !== targetId.toString()) {
    // If not admin and not self (Customer), check if it's a Trader unassigning their client
    const client = await Customer.findById(targetId);
    if (!client || client.assignedTraderId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to unassign this user' });
    }
  }

  const result = await unassignTrader(targetId);
  res.status(200).json(result);
});

module.exports = {
  allocateAll,
  allocateOne,
  reassignClient,
  getTriggers,
  getAllocations,
  getTraderAllocations,
  finalizeProposal,
  rejectProposal,
  unassignClient
};
