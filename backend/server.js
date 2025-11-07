// backend/server.js
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

// Middlewares
// Substitua a linha app.use(cors()); por:
app.use(cors({
  origin: '*', // Permite todas as origens (apenas para desenvolvimento)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// ========== ROTA DE TESTE ==========
app.get("/", (req, res) => {
  res.json({ mensagem: "API funcionando! 🚀" });
});

// ========== ROTA DE CADASTRO ==========
app.post("/api/usuarios/cadastro", (req, res) => {
  const { nome, email, senha } = req.body;

  console.log("📝 Recebido cadastro:", { nome, email });

  // Validação
  if (!nome || !email || !senha) {
    return res.status(400).json({ 
      erro: "Todos os campos são obrigatórios" 
    });
  }

  // Verifica se o email já existe
  const verificaEmail = "SELECT * FROM usuarios WHERE email = ?";
  db.query(verificaEmail, [email], (err, resultado) => {
    if (err) {
      console.error("❌ Erro ao verificar email:", err);
      return res.status(500).json({ erro: "Erro no servidor" });
    }

    if (resultado.length > 0) {
      return res.status(400).json({ 
        erro: "Email já cadastrado" 
      });
    }

    // Insere o novo usuário
    const inserir = "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)";
    db.query(inserir, [nome, email, senha], (err, resultado) => {
      if (err) {
        console.error("❌ Erro ao cadastrar:", err);
        return res.status(500).json({ erro: "Erro ao cadastrar usuário" });
      }

      console.log("✅ Usuário cadastrado com sucesso! ID:", resultado.insertId);
      res.status(201).json({
        mensagem: "Usuário cadastrado com sucesso!",
        id: resultado.insertId
      });
    });
  });
});

// Inicia o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📊 Teste a API: http://localhost:${PORT}`);
});