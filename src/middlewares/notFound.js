const notFound = (req, res, next) => {
  res.status(404).json({
    error: true,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
    code: 'NOT_FOUND'
  });
};

module.exports = notFound;