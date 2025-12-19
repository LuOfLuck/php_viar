<?php
// panel.php
session_start();
require 'db.php';

// 1. SEGURIDAD: Si no está logueado, lo mandamos al login
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}

$id_cliente_logueado = $_SESSION['user_id'];
$nombre_cliente = $_SESSION['user_nombre'];
$mensaje = "";
$gym_actual = null;

// ---------------------------------------------------
// ACCIONES (Crear, Editar, Borrar)
// ---------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $id_gym = isset($_POST['id_gym']) ? $_POST['id_gym'] : '';
    $nombre = $_POST['nombre'];
    $direccion = $_POST['direccion'];

    try {
        if ($id_gym) {
            // EDITAR: Importante el "AND id_cliente = ?" para que no edite gyms de otros
            $sql = "UPDATE gym SET nombre=?, direccion=? WHERE id=? AND id_cliente=?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$nombre, $direccion, $id_gym, $id_cliente_logueado]);
            $mensaje = "<div class='alert alert-success'>Gimnasio actualizado.</div>";
        } else {
            // CREAR: Asignamos automáticamente el ID del cliente logueado
            $sql = "INSERT INTO gym (id_cliente, nombre, direccion) VALUES (?, ?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$id_cliente_logueado, $nombre, $direccion]);
            $mensaje = "<div class='alert alert-success'>Nuevo gimnasio creado.</div>";
        }
    } catch (PDOException $e) {
        $mensaje = "<div class='alert alert-danger'>Error: " . $e->getMessage() . "</div>";
    }
}

if (isset($_GET['borrar'])) {
    $id_borrar = $_GET['borrar'];
    $stmt = $pdo->prepare("DELETE FROM gym WHERE id = ? AND id_cliente = ?");
    $stmt->execute([$id_borrar, $id_cliente_logueado]);
    $mensaje = "<div class='alert alert-warning'>Gimnasio eliminado.</div>";
}

if (isset($_GET['editar'])) {
    $id_editar = $_GET['editar'];
    $stmt = $pdo->prepare("SELECT * FROM gym WHERE id = ? AND id_cliente = ?");
    $stmt->execute([$id_editar, $id_cliente_logueado]);
    $gym_actual = $stmt->fetch();
}

$stmt = $pdo->prepare("SELECT * FROM gym WHERE id_cliente = ?");
$stmt->execute([$id_cliente_logueado]);
$mis_gyms = $stmt->fetchAll();
?>



<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi Panel</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">

<nav class="navbar navbar-dark bg-primary px-4 mb-4">
    <span class="navbar-brand">Panel de <?php echo htmlspecialchars($nombre_cliente); ?></span>
    <a href="logout.php" class="btn btn-sm btn-light">Cerrar Sesión</a>
</nav>

<div class="container">
    <?php echo $mensaje; ?>

    <div class="row">
        <div class="col-md-4">
            <div class="card shadow-sm">
                <div class="card-header bg-white fw-bold">
                    <?php echo $gym_actual ? 'Editar Gym' : 'Agregar Nuevo Gym'; ?>
                </div>
                <div class="card-body">
                    <form method="POST" action="panel.php">
                        <input type="hidden" name="id_gym" value="<?php echo $gym_actual['id'] ?? ''; ?>">
                        
                        <div class="mb-3">
                            <label>Nombre del Gym</label>
                            <input type="text" name="nombre" class="form-control" required 
                                   value="<?php echo $gym_actual['nombre'] ?? ''; ?>">
                        </div>
                        <div class="mb-3">
                            <label>Dirección</label>
                            <input type="text" name="direccion" class="form-control" 
                                   value="<?php echo $gym_actual['direccion'] ?? ''; ?>">
                        </div>
                        
                        <div class="d-grid gap-2">
                            <button type="submit" class="btn btn-success">Guardar</button>
                            <?php if($gym_actual): ?>
                                <a href="panel.php" class="btn btn-secondary">Cancelar</a>
                            <?php endif; ?>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <div class="col-md-8">
            <div class="card shadow-sm">
                <div class="card-header bg-white fw-bold">Mis Gimnasios</div>
                <div class="card-body p-0">
                    <table class="table table-striped mb-0">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Dirección</th>
                                <th class="text-end">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if(count($mis_gyms) > 0): ?>
                                <?php foreach($mis_gyms as $gym): ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($gym['nombre']); ?></td>
                                    <td><?php echo htmlspecialchars($gym['direccion']); ?></td>
                                    <td class="text-end">
                                        <a href="ver.php?id=<?php echo $gym['id']; ?>" class="btn btn-sm btn-success">Visualizar</a>
                                        <a href="panel.php?editar=<?php echo $gym['id']; ?>" class="btn btn-sm btn-primary">Editar</a>
                                        <a href="panel.php?borrar=<?php echo $gym['id']; ?>" class="btn btn-sm btn-danger" onclick="return confirm('¿Borrar?');">X</a>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            <?php else: ?>
                                <tr><td colspan="3" class="text-center p-3">No tienes gimnasios registrados.</td></tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

</body>
</html>