<?php
// login.php
session_start();
require 'db.php';

$error = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $usuario = $_POST['usuario'];
    $password = $_POST['password'];

    // Buscamos al usuario en la base de datos
    $stmt = $pdo->prepare("SELECT * FROM cliente WHERE usuario = ?");
    $stmt->execute([$usuario]);
    $user = $stmt->fetch();

    // NOTA DE SEGURIDAD: En un entorno real, usa password_verify() y hashes.
    // Como en tu base de datos tienes texto plano ('12345678'), comparamos directo:
    if ($user && $user['password'] === $password) {
        // ¡Login exitoso! Guardamos su ID en la sesión
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_nombre'] = $user['nombre'];
        
        header('Location: panel.php');
        exit;
    } else {
        $error = "Usuario o contraseña incorrectos";
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Clientes</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-dark d-flex align-items-center justify-content-center" style="height: 100vh;">

    <div class="card p-4" style="width: 400px;">
        <h3 class="text-center mb-4">Acceso Clientes</h3>
        
        <?php if($error): ?>
            <div class="alert alert-danger"><?php echo $error; ?></div>
        <?php endif; ?>

        <form method="POST">
            <div class="mb-3">
                <label>Usuario</label>
                <input type="text" name="usuario" class="form-control" required placeholder="Ej: luofluck">
            </div>
            <div class="mb-3">
                <label>Contraseña</label>
                <input type="password" name="password" class="form-control" required>
            </div>
            <button type="submit" class="btn btn-primary w-100">Ingresar</button>
        </form>
    </div>

</body>
</html>