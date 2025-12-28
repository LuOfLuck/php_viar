<?php
error_reporting(0); 
ini_set('display_errors', 0);
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");


require 'db.php'; // Tu archivo de conexión

// 1. Recibir el JSON crudo desde JS
$json = file_get_contents("php://input");
$datos = json_decode($json, true);

// Verificamos si llegaron datos
if (is_array($datos) && count($datos) > 0) {
    try {
        // Preparamos la consulta. 
        // NO insertamos el 'id' que viene de JS porque la base de datos es AUTO_INCREMENT
        $sql = "INSERT INTO puntos (id_cuarto, pitch, yaw) VALUES (?, ?, ?)";
        $stmt = $pdo->prepare($sql);

        $insertados = 0;

        foreach ($datos as $punto) {
            if (isset($punto['id_cuarto']) && isset($punto['pitch']) && isset($punto['yaw'])) {
                
                $stmt->execute([
                    $punto['id_cuarto'],
                    $punto['pitch'],
                    $punto['yaw']
                ]);
                $insertados++;
            }
        }

        echo json_encode([
            "status" => "success", 
            "mensaje" => "Se guardaron $insertados puntos correctamente."
        ]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "mensaje" => "Error SQL: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "mensaje" => "No se recibieron datos válidos."]);
}

?>