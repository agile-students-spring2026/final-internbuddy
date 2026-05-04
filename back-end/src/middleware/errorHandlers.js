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

  if (err?.type === 'entity.too.large' || err?.status === 413) {
    return res.status(413).json({
      error: 'Request payload too large',
      details: 'Profile image is too large. Please choose a smaller image.'
    });
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
