const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app = express();
app.use(express.json());
app.use(cors());

// 🔹 Conexão com o banco
const db = mysql.createConnection({
  host: "sql103.infinityfree.com",
  user: "if0_40237895",
  password: "WmQwcGmQLY",
  database: "if0_40237895_librali", // ❗ sem espaço antes do nome
  port: 3306,
});

// 🔹 Verificar conexão
db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco:", err);
  } else {
    console.log("Conectado ao banco de dados!");
  }
});

// 🔹 Rota para salvar a faixa etária
app.post("/salvar-faixa-etaria", (req, res) => {
  const { idUsuario, faixaEtaria } = req.body;

  if (!idUsuario || !faixaEtaria) {
    return res.status(400).json({ error: "idUsuario e faixaEtaria são obrigatórios" });
  }

  const sql = "UPDATE usuario SET faixaEtaria = ? WHERE id = ?";
  db.query(sql, [faixaEtaria, idUsuario], (err, result) => {
    if (err) {
      console.error("Erro ao atualizar:", err);
      return res.status(500).json({ error: "Erro ao salvar no banco" });
    }
    return res.json({ success: true, message: "Faixa etária salva com sucesso!" });
  });
});

// 🔹 Iniciar servidor
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
