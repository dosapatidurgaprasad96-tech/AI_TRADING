const asyncHandler = require('express-async-handler');
const SystemLog = require('../models/SystemLog');
const AuditTrail = require('../models/AuditTrail');
const { generateMarketData } = require('../services/marketService');

// @desc    Get system logs
// @route   GET /api/system/logs
// @access  Private/Admin
const getSystemLogs = asyncHandler(async (req, res) => {
  const logs = await SystemLog.find().sort({ createdAt: -1 }).limit(50);
  res.json(logs);
});

// @desc    Get audit trail
// @route   GET /api/system/audit
// @access  Private/Admin
const getAuditTrail = asyncHandler(async (req, res) => {
  const trail = await AuditTrail.find().sort({ createdAt: -1 }).limit(50);
  res.json(trail);
});

// @desc    Get live market data
// @route   GET /api/system/market
// @access  Private
const getMarketData = asyncHandler(async (req, res) => {
  const data = generateMarketData();
  res.json(data);
});

// @desc    Create system log (Internal)
const createLog = async (type, module, message) => {
  try {
    await SystemLog.create({ type, module, message });
  } catch (err) {
    console.error('Logging failed:', err);
  }
};

// @desc    Create audit entry (Internal)
const createAudit = async (adminId, adminName, action, target, metadata) => {
  try {
    await AuditTrail.create({ adminId, adminName, action, target, metadata });
  } catch (err) {
    console.error('Audit failed:', err);
  }
};

// @desc    Get trader performance stats
// @route   GET /api/system/performance
// @access  Private/Employee
const getTraderStats = asyncHandler(async (req, res) => {
  // In a real app, this would query trade history and feedback models
  const stats = {
    totalClients: Math.floor(Math.random() * 10) + 5,
    successRate: (Math.random() * 15 + 80).toFixed(1) + '%',
    platformRank: '#' + (Math.floor(Math.random() * 10) + 1),
    avgFeedback: (Math.random() * 1 + 4).toFixed(1),
    growth: '+' + (Math.random() * 5 + 2).toFixed(1) + '%'
  };
  res.json(stats);
});

module.exports = {
  getSystemLogs,
  getAuditTrail,
  getMarketData,
  getTraderStats,
  createLog,
  createAudit
};
