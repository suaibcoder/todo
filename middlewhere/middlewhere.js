// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'thisismysecretkey');
    req.user = { userId: decodedToken._id };
    console.log(decodedToken._id);
    console.log(req.user);
    console.log(decodedToken);
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};
