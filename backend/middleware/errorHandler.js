export function errorHandler(error, req, res, next) {
  console.error(
    `${req.method} ${req.originalUrl} failed:`,
    error
  );

  if (res.headersSent) {
    return next(error);
  }

  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    error:
      statusCode === 500
        ? "Internal server error"
        : error.message,
  });
}