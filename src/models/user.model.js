class User {
  constructor({ 
    id = null, 
    username, 
    email, 
    nome_completo, 
    password = undefined, 
    passwordHash = undefined, 
    created_at = undefined, 
    validar = true 
  }) {
    this.id = id ?? null;
    this.username = String(username || '').trim();
    this.email = String(email || '').trim();
    this.nome_completo = String(nome_completo || '').trim();
    this.created_at = created_at;
    this.password = password;
    this.passwordHash = passwordHash;

    if (validar) this._validar();
  }

  _validar() {
    const erros = [];
    if (!this.username || this.username.length < 3)
      erros.push('username deve ter pelo menos 3 caracteres');
    if (!this.email || !this.email.includes('@'))
      erros.push('email inválido');
    if (!this.nome_completo || this.nome_completo.length < 3)
      erros.push('nome completo deve ter pelo menos 3 caracteres');
    if (this.password !== undefined) {
      const pwd = String(this.password);
      if (pwd.length < 6) erros.push('password deve ter pelo menos 6 caracteres');
    }
    if (erros.length) {
      const e = new Error('Dados de usuário inválidos');
      e.statusCode = 400;
      e.details = erros;
      throw e;
    }
  }

  static fromDB(row) {
    if (!row) return null;
    return new User({
      id: row.id,
      username: row.username,
      email: row.email,
      nome_completo: row.nome_completo,
      passwordHash: row.password_hash,
      created_at: row.created_at,
      validar: false
    });
  }

  toJSON() {
    return { 
      id: this.id, 
      username: this.username, 
      email: this.email,
      nome_completo: this.nome_completo, 
      created_at: this.created_at 
    };
  }
}

module.exports = User;
