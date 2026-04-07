function notFoundHandler(req, res, next) {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
}

function errorHandler(err, req, res, next) {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  return res.status(500).json({
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'production' ? undefined : err.message
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};
