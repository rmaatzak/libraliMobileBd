  methods: ['GET', 'POST', 'PUT', 'DELETE'],
// backend/db.js
const mysql = require('mysql2');

// ====== CONFIGURAÇÃO DO BANCO DE DADOS ======
const db = mysql.createConnection({
  host: 'localhost',      // Se estiver usando XAMPP, mantenha localhost
  user: 'root',           // Usuário padrão do XAMPP
  password: '',           // Senha padrão do XAMPP (vazia)
  database: 'librali', // Nome do seu banco de dados
  port: 3306              // Porta padrão do MySQL
});

// ====== CONECTAR AO BANCO ======
db.connect((err) => {
  if (err) {
    console.error('❌ Erro ao conectar ao banco de dados:', err.message);
    console.error('📋 Detalhes:', {
      codigo: err.code,
      errno: err.errno,
      sqlMessage: err.sqlMessage
    });
    console.log('\n🔧 SOLUÇÕES POSSÍVEIS:');
    console.log('1. Verifique se o XAMPP está rodando');
    console.log('2. Confirme se o MySQL está ativo no XAMPP');
    console.log('3. Verifique se o banco "libras_app" existe');
    console.log('4. Confirme as credenciais (usuário/senha)');
    return;
  }
  
  console.log('✅ Conectado ao banco MySQL com sucesso!');
  console.log('📊 Detalhes da conexão:');
  console.log(`   Host: ${db.config.host}`);
  console.log(`   Database: ${db.config.database}`);
  console.log(`   User: ${db.config.user}`);
});

// ====== CRIAR TABELA USUÁRIOS (se não existir) ======
const criarTabela = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS usuarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      senha VARCHAR(255) NOT NULL,
      faixaEtaria ENUM('adulto', 'kids') NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error('❌ Erro ao criar tabela usuarios:', err);
      return;
    }
    console.log('📋 Tabela "usuarios" verificada/criada com sucesso!');
  });
};

// Executar criação da tabela
criarTabela();

// ====== EXPORTAR CONEXÃO ======
module.exports = db;