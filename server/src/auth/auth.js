import jwt from'jsonwebtoken';
import  'dotenv/config';

const secret = process.env.SECRET;

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email, type: 'access' }, secret, { expiresIn: '5m' });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email, type: 'refresh' }, secret, { expiresIn: '15m' });
};

const getUserFromToken = (token) => {
  try {
    if (!token) return null;
    const decoded = jwt.verify(token.replace("Bearer ", ""), secret);
    if (decoded.type !== 'access') return null; // Ensure it's an access token
    return decoded;
  } catch (err) {
    return null;
  }
};

const refreshAccessToken = (refreshToken) => {
  try {
    if (!refreshToken) return null;
    const decoded = jwt.verify(refreshToken, secret);
    if (decoded.type !== 'refresh') return null; // Ensure it's a refresh token
    const user = { id: decoded.id, email: decoded.email };
    return generateAccessToken(user);
  } catch (err) {
    return null;
  }
};

export { generateAccessToken, generateRefreshToken, getUserFromToken, refreshAccessToken };
