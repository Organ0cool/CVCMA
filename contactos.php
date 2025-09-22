<?php
// Ajusta estos valores a tu entorno XAMPP
$DB_HOST = 'localhost';
$DB_NAME = 'cv_claudio';
$DB_USER = 'root';
$DB_PASS = '';

$required = ['name','email','message'];
foreach ($required as $field) {
  if (empty($_POST[$field])) {
    http_response_code(400);
    echo '<h2>Faltan campos obligatorios.</h2>';
    exit;
  }
}
$name = trim($_POST['name']);
$email = trim($_POST['email']);
$phone = trim($_POST['phone'] ?? '');
$message = trim($_POST['message']);

try {
  $pdo = new PDO("mysql:host=$DB_HOST;dbname=$DB_NAME;charset=utf8mb4", $DB_USER, $DB_PASS, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
  ]);
  $stmt = $pdo->prepare("INSERT INTO contacts(name,email,phone,message) VALUES (?,?,?,?)");
  $stmt->execute([$name,$email,$phone,$message]);

  // --- Respuesta HTML simple ---
  echo '<!doctype html><meta charset="utf-8"><title>Gracias</title>';
  echo '<p>¡Gracias! Tu mensaje fue enviado correctamente.</p>';
  echo '<p><a href="../index.html#contacto">Volver</a></p>';

  // --- Si prefieres JSON (para AJAX), usa esto en su lugar:
  // header('Content-Type: application/json');
  // echo json_encode(['ok' => true]);
} catch (Exception $e) {
  http_response_code(500);
  echo '<!doctype html><meta charset="utf-8"><title>Error</title>';
  echo '<p>Ocurrió un error al guardar tu mensaje.</p>';
  // header('Content-Type: application/json'); echo json_encode(['ok'=>false]);
}
