const httpLogger = (req, res, next) => {
  const start = Date.now();
  const now = new Date().toLocaleDateString('sv-SE');

  console.log(`[${now}] ${req.method} ${req.url} - started`);

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `[${now}] ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`,
    );
  });

  next();
};

module.exports = {
  httpLogger,
};
