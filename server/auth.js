import jwt from'jsonwebtoken';

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.SECRET, { expiresIn: '1h' });
}

const getUserFromToken = (token) => {
  try {
    if (!token) return null;
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
}

export { generateToken, getUserFromToken };
