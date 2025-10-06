import jwt from 'jsonwebtoken';

const jwtAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).send('Unauthorized');

  // Accept "Bearer <token>" or raw token
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : authHeader.trim();

  try {
    const secret = process.env.JWT_SECRET || 'replace-with-env-secret';
    const payload = jwt.verify(token, secret);
    req.userID = payload.userID;
  } catch (err) {
    console.log(err);
    return res.status(401).send('Unauthorized');
  }

  next();
};

export default jwtAuth;
