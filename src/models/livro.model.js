class Livro {
   constructor({ id = null, titulo, autor, categoria, ano, editora = '', capa_caminho = '' }) {
        this.id = id !== undefined ? id : null;
        
        // Campos obrigatórios:
        this.titulo = String(titulo || '').trim();
        this.autor = String(autor || '').trim();
        this.categoria = String(categoria || '').trim();

        const anoString = String(ano).trim();
        this.ano = anoString ? parseInt(anoString, 10) : NaN; // NaN se for vazio

        // Campos opcionais:
        this.editora = String(editora || '').trim();
        this.capa_caminho = String(capa_caminho || '').trim();

        this._validar();
    }

    static fromJSON(json) {
        return new Livro({
            id: json.id ?? null,
            titulo: json.titulo,
            autor: json.autor,
            categoria: json.categoria,
            ano: json.ano,
            editora: json.editora,
            capa_caminho: json.capa_caminho 
        });
    }

    toJSON() {
        return {
            id: this.id,
            titulo: this.titulo,
            autor: this.autor,
            categoria: this.categoria,
            ano: this.ano,
            editora: this.editora,
            capa_caminho: this.capa_caminho
        };
    }

    _validar() {
        const erros = [];

        if (!this.titulo || this.titulo.length === 0) erros.push("Título é obrigatório");
        if (!this.autor || this.autor.length === 0) erros.push("Autor é obrigatório");
        if (!this.categoria || this.categoria.length === 0) erros.push("Categoria é obrigatória");

        if (isNaN(this.ano) || !Number.isInteger(this.ano)) erros.push("Ano deve ser um número válido");
        
        // Adiciona validação de range, se necessário (ex: ano ser maior que 1000)
        if (Number.isInteger(this.ano) && this.ano < 1000) erros.push("Ano inválido");

        if (erros.length > 0) {
            const error = new Error("Dados inválidos");
            error.statusCode = 400; 
            error.details = erros;
            throw error;
        }
    }
}

module.exports = Livro;