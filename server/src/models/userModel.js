const users = [];

export default {
  getAllUsers: () => users,
  getUserByEmail: (email) => users.find(u => u.email === email),
  getUserById: (id) => users.find(u => u.id === id),
  addUser: (user) => users.push(user)
};