/**
 * Example controller to demonstrate structure
 */
exports.getExample = (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: 'This is an example response from the controller',
    });
  } catch (error) {
    next(error);
  }
};
