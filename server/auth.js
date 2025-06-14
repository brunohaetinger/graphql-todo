import jwt from'jsonwebtoken';
import  'dotenv/config';

const secret = process.env.SECRET;

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: '1h' });
}

const getUserFromToken = (token) => {
  try {
    if (!token) return null;
    const decoded = jwt.verify(token.replace("Bearer ", ""), secret);
    return decoded;
  } catch (err) {
    return null;
  }
}

export { generateToken, getUserFromToken };
