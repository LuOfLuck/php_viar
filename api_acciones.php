<?php
// api_acciones.php
// Configuración para recibir JSON y evitar errores de CORS/formato
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
error_reporting(0); // Ocultar warnings para no romper el JSON

require 'db.php'; // Tu archivo de conexión

// Recibir datos JSON
$input = json_decode(file_get_contents("php://input"), true);
$accion = $input['accion'] ?? '';

$response = ["status" => "error", "message" => "Acción no válida"];

try {
    switch ($accion) {
        
        // 1. AGREGAR VIDEO (LINK)
        case 'agregar_video':
            $id_punto = $input['id_punto'];
            $titulo = $input['titulo'];
            $link = $input['link'];
            
            $stmt = $pdo->prepare("INSERT INTO links (id_punto, titulo, link) VALUES (?, ?, ?)");
            if ($stmt->execute([$id_punto, $titulo, $link])) {
                $response = ["status" => "success", "id_nuevo" => $pdo->lastInsertId()];
            }
            break;

        // 2. ELIMINAR UN VIDEO ESPECÍFICO
        case 'eliminar_video':
            $id_link = $input['id_link'];
            $stmt = $pdo->prepare("DELETE FROM links WHERE id = ?");
            if ($stmt->execute([$id_link])) {
                $response = ["status" => "success"];
            }
            break;

        // 3. EDITAR TÍTULO/DESCRIPCIÓN DEL PUNTO
        case 'editar_punto':
            $id_punto = $input['id_punto'];
            $titulo = $input['titulo'];
            $descripcion = $input['descripcion'];
            
            $stmt = $pdo->prepare("UPDATE puntos SET titulo = ?, descripcion = ? WHERE id = ?");
            if ($stmt->execute([$titulo, $descripcion, $id_punto])) {
                $response = ["status" => "success"];
            }
            break;

        // 4. ELIMINAR TODO EL PUNTO (La BD borrará los links automáticamente por el CASCADE)
        case 'eliminar_punto':
            $id_punto = $input['id_punto'];
            $stmt = $pdo->prepare("DELETE FROM puntos WHERE id = ?");
            if ($stmt->execute([$id_punto])) {
                $response = ["status" => "success"];
            }
            break;
        // 5. EDITAR SOLO EL TÍTULO DEL VIDEO
        case 'editar_titulo_video':
            $id_link = $input['id_link'];
            $titulo = $input['titulo'];
            
            $stmt = $pdo->prepare("UPDATE links SET titulo = ? WHERE id = ?");
            if ($stmt->execute([$titulo, $id_link])) {
                $response = ["status" => "success"];
            }
            break;
    }
} catch (PDOException $e) {
    $response = ["status" => "error", "message" => $e->getMessage()];
}

echo json_encode($response);
?>