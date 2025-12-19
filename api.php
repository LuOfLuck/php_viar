<?php
// api.php
header("Access-Control-Allow-Origin: *"); // Permite peticiones desde cualquier lugar (CORS)
header("Content-Type: application/json; charset=UTF-8");

require 'db.php';

// Obtener parámetros de la URL
// Ejemplo: api.php?recurso=gyms&id=1
$recurso = isset($_GET['recurso']) ? $_GET['recurso'] : '';
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

$response = [];

try {
    switch ($recurso) {
        
        // CASO 1: Obtener todos los gimnasios de un cliente (Dueño)
        // Uso: api.php?recurso=gyms&id=1  (Donde id es el id_cliente)
        case 'gyms':
            $stmt = $pdo->prepare("SELECT * FROM gym WHERE id_cliente = ?");
            $stmt->execute([$id]);
            $response = $stmt->fetchAll();
            break;

        // CASO 2: Obtener todos los cuartos de un gimnasio (solo lista básica)
        // Uso: api.php?recurso=cuartos&id=7 (Donde id es el id_gym)
        case 'cuartos':
            $stmt = $pdo->prepare("SELECT * FROM cuartos WHERE id_gym = ?");
            $stmt->execute([$id]);
            $response = $stmt->fetchAll();
            break;

        // CASO 3: MASTER DATA - Obtener TODO sobre un cuarto específico
        // Esto es ideal para cargar la escena del tour virtual
        // Uso: api.php?recurso=info_completa_cuarto&id=1 (Donde id es id_cuarto)
        case 'info_completa_cuarto':
            // A. Datos del cuarto
            $stmt = $pdo->prepare("SELECT * FROM cuartos WHERE id = ?");
            $stmt->execute([$id]);
            $cuarto = $stmt->fetch();

            if($cuarto) {
                // B. Obtener Imágenes
                $stmtImg = $pdo->prepare("SELECT * FROM imagenes WHERE id_cuarto = ?");
                $stmtImg->execute([$id]);
                $cuarto['imagenes'] = $stmtImg->fetch(); // Asumiendo una config de imagen por cuarto

                // C. Obtener Salidas (Flechas para moverse)
                $stmtSalidas = $pdo->prepare("SELECT s.*, c.nombre as nombre_destino 
                                              FROM salidas s 
                                              JOIN cuartos c ON s.salida = c.id 
                                              WHERE s.id_cuarto = ?");
                $stmtSalidas->execute([$id]);
                $cuarto['salidas'] = $stmtSalidas->fetchAll();

                // D. Obtener Puntos de Interés (Hotspots)
                $stmtPuntos = $pdo->prepare("SELECT * FROM puntos WHERE id_cuarto = ?");
                $stmtPuntos->execute([$id]);
                $puntos = $stmtPuntos->fetchAll();

                // E. Obtener Links DENTRO de cada punto
                // Recorremos cada punto para buscar sus links
                foreach ($puntos as &$punto) {
                    $stmtLinks = $pdo->prepare("SELECT * FROM links WHERE id_punto = ?");
                    $stmtLinks->execute([$punto['id']]);
                    $punto['links'] = $stmtLinks->fetchAll();
                }
                
                $cuarto['puntos_interes'] = $puntos;
                $response = $cuarto;
            } else {
                $response = ['error' => 'Cuarto no encontrado'];
            }
            break;

        default:
            $response = ['error' => 'Recurso no válido o no especificado. Usa ?recurso=gyms&id=X'];
            break;
    }

    // Devolver respuesta en JSON
    echo json_encode($response, JSON_PRETTY_PRINT);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>