<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

// Configuração do banco
$host = '127.0.0.1';
$db   = 'librali';
$user = 'root'; // ajuste com seu usuário
$pass = ''; // ajuste com sua senha
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erro de conexão: ' . $e->getMessage()]);
    exit;
}

// Verifica se o ID foi passado
if (!isset($_GET['id'])) {
    echo json_encode(['success' => false, 'message' => 'ID não fornecido']);
    exit;
}

$userId = (int)$_GET['id'];

// Busca o usuário
$stmt = $pdo->prepare("SELECT id, nome, email FROM usuarios WHERE id = ?");
$stmt->execute([$userId]);
$usuario = $stmt->fetch();

if ($usuario) {
    echo json_encode([
        'success' => true,
        'usuario' => $usuario
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Usuário não encontrado']);
}
?>