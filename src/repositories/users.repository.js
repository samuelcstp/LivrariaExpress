const db = require('../database/sqlite');
const User = require('../models/user.model');

class UsersRepository {
  async findById(id) {
    const row = await db.get(
      'SELECT id, username, email, nome_completo, password_hash, created_at FROM users WHERE id = ?',
      [id]
    );
    return User.fromDB(row);
  }

  async findByUsername(username) {
    const row = await db.get(
      'SELECT id, username, email, nome_completo, password_hash, created_at FROM users WHERE username = ?',
      [username]
    );
    return User.fromDB(row);
  }

  async create({ username, email, nome_completo, passwordHash }) {
    const result = await db.run(
      'INSERT INTO users (username, email, nome_completo, password_hash) VALUES (?, ?, ?, ?)',
      [username, email, nome_completo, passwordHash]
    );
    const row = await db.get(
      'SELECT id, username, email, nome_completo, password_hash, created_at FROM users WHERE id = ?',
      [result.lastInsertRowid]
    );
    return User.fromDB(row);
  }
}

module.exports = UsersRepository;
