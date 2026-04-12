const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    console.error('❌ Validation error:', err.issues);
    res.status(400).json({error: err.errors});
  }
};

const validateParams = (schema) => (req, res, next) => {
  try {
    req.params = schema.parse(req.params);
    next();
  } catch (err) {
    console.error('❌ Validation error:', err.issues);
    res.status(400).json({error: err.errors});
  }
};

module.exports = {validate, validateParams};
