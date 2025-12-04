// backend/server.js
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("./db");

const app = express();

// ====== CONFIGURAÇÃO ======
const JWT_SECRET = "sua_chave_secreta_super_segura_123"; // ⚠️ MUDE ISSO EM PRODUÇÃO!
const SALT_ROUNDS = 10;

// ====== MIDDLEWARES ======
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// ====== MIDDLEWARE DE AUTENTICAÇÃO ======
const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ erro: "Token não fornecido" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuarioId = decoded.id;
    req.usuarioEmail = decoded.email;
    next();
  } catch (error) {
    return res.status(401).json({ erro: "Token inválido ou expirado" });
  }
};

// ====== ROTA DE TESTE ======
app.get("/", (req, res) => {
  res.json({ mensagem: "API funcionando! 🚀" });
});

// ====== ROTA DE CADASTRO COM CRIPTOGRAFIA ======
app.post("/api/usuarios/cadastro", async (req, res) => {
  const { nome, email, senha, faixaEtaria } = req.body;

  console.log("📝 Recebido cadastro completo:");
  console.log("   Nome:", nome);
  console.log("   Email:", email);
  console.log("   Faixa Etária:", faixaEtaria);

  // Validação
  if (!nome || !email || !senha) {
    return res.status(400).json({
      erro: "Nome, email e senha são obrigatórios"
    });
  }

  if (!faixaEtaria || (faixaEtaria !== "adulto" && faixaEtaria !== "kids")) {
    return res.status(400).json({
      erro: "Faixa etária inválida. Use 'adulto' ou 'kids'"
    });
  }

  try {
    // Verifica se o email já existe
    const verificaEmail = "SELECT * FROM usuarios WHERE email = ?";
    db.query(verificaEmail, [email], async (err, resultado) => {
      if (err) {
        console.error("❌ Erro ao verificar email:", err);
        return res.status(500).json({ erro: "Erro no servidor" });
      }

      if (resultado.length > 0) {
        return res.status(400).json({ erro: "Email já cadastrado" });
      }

      // Criptografa a senha
      const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);

      // Insere novo usuário
      const inserir = "INSERT INTO usuarios (nome, email, senha, faixaEtaria) VALUES (?, ?, ?, ?)";
      db.query(inserir, [nome, email, senhaHash, faixaEtaria], (err, resultado) => {
        if (err) {
          console.error("❌ Erro ao cadastrar:", err);
          return res.status(500).json({ erro: "Erro ao cadastrar usuário" });
        }

        // Gera token JWT
        const token = jwt.sign(
          { id: resultado.insertId, email, nome, faixaEtaria },
          JWT_SECRET,
          { expiresIn: "7d" } // Token válido por 7 dias
        );

        console.log("✅ USUÁRIO CADASTRADO COM SUCESSO!");
        res.status(201).json({
          mensagem: "Usuário cadastrado com sucesso!",
          token,
          usuario: {
            id: resultado.insertId,
            nome,
            email,
            faixaEtaria
          }
        });
      });
    });
  } catch (error) {
    console.error("❌ Erro no cadastro:", error);
    res.status(500).json({ erro: "Erro no servidor" });
  }
});

// ====== ROTA DE LOGIN COM JWT ======
app.post("/api/usuarios/login", (req, res) => {
  const { email, senha } = req.body;

  console.log("🔐 Tentativa de login:", email);

  if (!email || !senha) {
    return res.status(400).json({ erro: "Email e senha são obrigatórios" });
  }

  const consulta = "SELECT * FROM usuarios WHERE email = ?";
  db.query(consulta, [email], async (err, resultado) => {
    if (err) {
      console.error("❌ Erro ao buscar usuário:", err);
      return res.status(500).json({ erro: "Erro no servidor" });
    }

    if (resultado.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    const usuario = resultado[0];

    // Compara senha criptografada
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ erro: "Senha incorreta" });
    }

    // Gera token JWT
    const token = jwt.sign(
      { 
        id: usuario.id, 
        email: usuario.email, 
        nome: usuario.nome,
        faixaEtaria: usuario.faixaEtaria 
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("✅ Login bem-sucedido!");
    res.status(200).json({
      mensagem: "Login realizado com sucesso!",
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        faixaEtaria: usuario.faixaEtaria
      }
    });
  });
});

// ====== ROTA PARA VERIFICAR TOKEN (Auto-login) ======
app.get("/api/usuarios/verificar", verificarToken, (req, res) => {
  const consulta = "SELECT id, nome, email, faixaEtaria FROM usuarios WHERE id = ?";
  
  db.query(consulta, [req.usuarioId], (err, resultado) => {
    if (err || resultado.length === 0) {
      return res.status(401).json({ erro: "Usuário não encontrado" });
    }

    const usuario = resultado[0];
    res.status(200).json({
      mensagem: "Token válido",
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        faixaEtaria: usuario.faixaEtaria
      }
    });
  });
});

// ====== ROTA DE LOGOUT (Opcional - apenas limpa token no frontend) ======
app.post("/api/usuarios/logout", verificarToken, (req, res) => {
  console.log("👋 Logout realizado");
  res.status(200).json({ mensagem: "Logout realizado com sucesso" });
});

// ====== INICIAR SERVIDOR ======
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`🔐 Sistema de autenticação JWT ativo!`);
});

//server.js