/**
 * Configuration variables centralized here
 */
module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  dbUri: process.env.DB_URI,
  // Add other parsed config variables here
};
