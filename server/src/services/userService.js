import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from '../auth/auth.js';
import db from '../models/index.js';

export default {
  register: async (email, password) => {
    if (await db.User.findOne({where: { email }})) throw new Error('User already exists');
    const hashed = await bcrypt.hash(password, 10);
    const user = { email, password: hashed };
    await db.User.create(user);
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    return { accessToken, refreshToken, user };
  },

  login: async (email, password) => {
    const user = await db.User.findOne({where: { email }});
    if (!user) throw new Error('User not found');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Incorrect Password');
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    return { accessToken, refreshToken, user };
  }
};
