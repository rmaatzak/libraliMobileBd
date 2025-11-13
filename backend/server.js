// backend/server.js
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

// ====== MIDDLEWARES ======
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// ====== ROTA DE TESTE ======
app.get("/", (req, res) => {
  res.json({ mensagem: "API funcionando! 🚀" });
});

// ====== ROTA DE CADASTRO COM FAIXA ETÁRIA ======
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

    // Insere novo usuário com faixaEtaria
    const inserir = "INSERT INTO usuarios (nome, email, senha, faixaEtaria) VALUES (?, ?, ?, ?)";
    db.query(inserir, [nome, email, senha, faixaEtaria], (err, resultado) => {
      if (err) {
        console.error("❌ Erro ao cadastrar:", err);
        return res.status(500).json({ erro: "Erro ao cadastrar usuário: " + err.message });
      }

      console.log("✅✅✅ USUÁRIO CADASTRADO COM SUCESSO! ✅✅✅");
      res.status(201).json({
        mensagem: "Usuário cadastrado com sucesso!",
        id: resultado.insertId,
        faixaEtaria: faixaEtaria
      });
    });
  });
});

// ====== ROTA DE LOGIN ======
app.post("/api/usuarios/login", (req, res) => {
  const { email, senha } = req.body;

  console.log("🔐 Tentativa de login recebida:");
  console.log("   Email:", email);
  console.log("   Senha:", senha ? "***" : "vazio");

  if (!email || !senha) {
    console.error("❌ Email e senha são obrigatórios");
    return res.status(400).json({ erro: "Email e senha são obrigatórios" });
  }

  const consulta = "SELECT * FROM usuarios WHERE email = ?";
  db.query(consulta, [email], (err, resultado) => {
    if (err) {
      console.error("❌ Erro ao buscar usuário:", err);
      return res.status(500).json({ erro: "Erro no servidor" });
    }

    if (resultado.length === 0) {
      console.warn("⚠️ Usuário não encontrado:", email);
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    const usuario = resultado[0];

    if (usuario.senha !== senha) {
      console.warn("⚠️ Senha incorreta para:", email);
      return res.status(401).json({ erro: "Senha incorreta" });
    }

    console.log("✅ Login bem-sucedido!");
    res.status(200).json({
      mensagem: "Login realizado com sucesso!",
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        faixaEtaria: usuario.faixaEtaria
      }
    });
  });
});

// ====== INICIAR SERVIDOR ======
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📊 Teste a API: http://localhost:${PORT}`);
  console.log(`✅ Backend pronto para cadastro e login!`);
});
