// backend/server.js
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// ========== ROTA DE TESTE ==========
app.get("/", (req, res) => {
  res.json({ mensagem: "API funcionando! 🚀" });
});

// ========== ROTA DE CADASTRO COM FAIXA ETÁRIA ==========
app.post("/api/usuarios/cadastro", (req, res) => {
  const { nome, email, senha, faixaEtaria } = req.body;

  console.log("📝 Recebido cadastro completo:");
  console.log("   Nome:", nome);
  console.log("   Email:", email);
  console.log("   Senha:", senha ? "***" : "vazio");
  console.log("   Faixa Etária:", faixaEtaria);

  // Validação
  if (!nome || !email || !senha) {
    console.error("❌ Campos obrigatórios faltando");
    return res.status(400).json({ 
      erro: "Nome, email e senha são obrigatórios" 
    });
  }

  if (!faixaEtaria) {
    console.error("❌ Faixa etária não foi enviada!");
    return res.status(400).json({ 
      erro: "Faixa etária é obrigatória" 
    });
  }

  // Valida faixa etária
  if (faixaEtaria !== "adulto" && faixaEtaria !== "kids") {
    console.error("❌ Faixa etária inválida:", faixaEtaria);
    return res.status(400).json({ 
      erro: "Faixa etária inválida. Use 'adulto' ou 'kids'" 
    });
  }

  console.log("✅ Validação passou! Verificando email...");

  // Verifica se o email já existe
  const verificaEmail = "SELECT * FROM usuarios WHERE email = ?";
  db.query(verificaEmail, [email], (err, resultado) => {
    if (err) {
      console.error("❌ Erro ao verificar email:", err);
      return res.status(500).json({ erro: "Erro no servidor" });
    }

    if (resultado.length > 0) {
      console.log("⚠️ Email já cadastrado:", email);
      return res.status(400).json({ 
        erro: "Email já cadastrado" 
      });
    }

    console.log("✅ Email disponível! Inserindo no banco...");

    // ✅ Insere o novo usuário COM faixa etária
    const inserir = "INSERT INTO usuarios (nome, email, senha, faixaEtaria) VALUES (?, ?, ?, ?)";
    
    db.query(inserir, [nome, email, senha, faixaEtaria], (err, resultado) => {
      if (err) {
        console.error("❌ Erro ao cadastrar:", err);
        console.error("   Detalhes do erro:", err.message);
        console.error("   SQL:", err.sql);
        return res.status(500).json({ erro: "Erro ao cadastrar usuário: " + err.message });
      }

      console.log("✅✅✅ USUÁRIO CADASTRADO COM SUCESSO! ✅✅✅");
      console.log("   ID:", resultado.insertId);
      console.log("   Nome:", nome);
      console.log("   Email:", email);
      console.log("   Faixa Etária:", faixaEtaria);
      
      res.status(201).json({
        mensagem: "Usuário cadastrado com sucesso!",
        id: resultado.insertId,
        faixaEtaria: faixaEtaria
      });
    });
  });
});

// Inicia o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📊 Teste a API: http://localhost:${PORT}`);
  console.log(`✅ Backend pronto para receber cadastros!`);
});

// server.js