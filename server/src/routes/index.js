const express = require('express');
const router = express.Router();
const exampleController = require('../controllers/exampleController');

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running normally' });
});

// Example resource routes
router.get('/example', exampleController.getExample);

module.exports = router;
