import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { generateToken } from '../auth/auth.js';
import userModel from '../models/userModel.js';

export default {
  register: async (email, password) => {
    if (userModel.getUserByEmail(email)) throw new Error('Usuário já existe');
    const hashed = await bcrypt.hash(password, 10);
    const user = { id: uuidv4(), email, password: hashed };
    userModel.addUser(user);
    const token = generateToken(user);
    return { token, user };
  },

  login: async (email, password) => {
    const user = userModel.getUserByEmail(email);
    if (!user) throw new Error('Usuário não encontrado');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Senha incorreta');
    const token = generateToken(user);
    return { token, user };
  }
};
