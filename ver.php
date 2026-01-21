<?php 
// 1. ESTO DEBE IR PRIMERO QUE NADA
require_once 'db.php';

// Validar ID
if (!isset($_GET['id'])) {
    die("Error: Falta el ID del gimnasio.");
}
$id_gym = intval($_GET['id']);

// Consultar BD para obtener la variable $gym
$stmtGym = $pdo->prepare("SELECT * FROM gym WHERE id = ?");
$stmtGym->execute([$id_gym]);
$gym = $stmtGym->fetch();

if (!$gym) die("Gimnasio no encontrado.");

// Preparamos las variables para los CSS
$host_url = $gym['host'];
// Asegurar que termine en slash si existe
if (!empty($host_url) && substr($host_url, -1) !== '/') {
    $host_url .= '/';
}

// ------------------------------------------------------------------
// LOGICA DE DATOS PARA EL VISOR (MODELOS Y CUARTOS)
// ------------------------------------------------------------------
$modelos_export = [];
$cuartos_export = [];

// 1. Obtener Cuartos
$stmt = $pdo->prepare("SELECT * FROM cuartos WHERE id_gym = ?");
$stmt->execute([$id_gym]);
$lista_cuartos = $stmt->fetchAll();

foreach ($lista_cuartos as $cuarto) {
    $id_cuarto = $cuarto['id'];
    $modelo_key = "cuarto_" . $id_cuarto; 

    // A. IMÁGENES
    $stmtImg = $pdo->prepare("SELECT * FROM imagenes WHERE id_cuarto = ?");
    $stmtImg->execute([$id_cuarto]);
    $img = $stmtImg->fetch();
    $url_prin = $img['urlprin'] ?? '';
    $url_sec  = $img['urlsec'] ?? ''; // Preview

    // B. OBJETOS (Puntos + Videos)
    $objetos = [];
    $stmtPuntos = $pdo->prepare("SELECT * FROM puntos WHERE id_cuarto = ?");
    $stmtPuntos->execute([$id_cuarto]);
    
    foreach ($stmtPuntos->fetchAll() as $punto) {
        $stmtLinks = $pdo->prepare("SELECT id, titulo, link FROM links WHERE id_punto = ?");
        $stmtLinks->execute([$punto['id']]);
        $links_videos = $stmtLinks->fetchAll(PDO::FETCH_ASSOC);

        $objetos[] = [
            "pitch" => floatval($punto['pitch']),
            "yaw"   => floatval($punto['yaw']),
            "cssClass" => "custom-hotspot",
            "createTooltipArgs" => [
                "id" => $punto['id'],
                "titulo" => $punto['titulo'],
                "descripcion" => $punto['descripcion'],
                "url" => $links_videos,
                "pitch" => floatval($punto['pitch']),
                "yaw"   => floatval($punto['yaw'])
            ]
        ];
    }

    // C. SALIDAS
    $salidas = [];
    $stmtSalidas = $pdo->prepare("SELECT * FROM salidas WHERE id_cuarto = ?");
    $stmtSalidas->execute([$id_cuarto]);
    
    foreach ($stmtSalidas->fetchAll() as $salida) {
        $salidas[] = [
            "id" => (int)$salida['salida'],
            "pitch" => floatval($salida['pitch']),
            "yaw"   => floatval($salida['yaw']),
            "type"  => "scene",
            "cssClass" => "custom-exit",
            "clickHandlerFunc" => "irEscenaConZoom", // Nombre de la función global en JS
            "clickHandlerArgs" => [
                "id" => (string)$salida['salida'],
                "pitch" => floatval($salida['pitch']),
                "yaw"   => floatval($salida['yaw'])
            ]
        ];
    }

    // D. LLENAR ARRAYS PHP
    $modelos_export[$modelo_key] = [
        "objetos" => $objetos,
        "salidas" => $salidas
    ];

    $cuartos_export[] = [
        "id" => (string)$id_cuarto,
        "nombre" => $cuarto['nombre'],
        "url" => $url_prin,
        "preview" => $url_sec,
        "key_referencia" => $modelo_key
    ];
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">  
    <meta http-equiv="X-UA-Compatible" content="ie=edge">    
    <meta name="description" content="Moderniza tu gimnasio con Viar. Recorridos virtuales 360°.">
    <title>VIAR - <?php echo htmlspecialchars($gym['nombre']); ?></title>
    
    <script src="https://kit.fontawesome.com/9ec8210292.js" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    
    <link rel="stylesheet" href="<?php echo $host_url; ?>css/main.css">
    <link rel="stylesheet" href="<?php echo $host_url; ?>css/carga.css">
    <link rel="stylesheet" href="<?php echo $host_url; ?>css/box.css">
    <link rel="stylesheet" href="<?php echo $host_url; ?>css/accesos.css">
    <link rel="stylesheet" href="<?php echo $host_url; ?>css/responsive.css">
    <link rel="stylesheet" href="<?php echo $host_url; ?>css/carucel.css">
    <link rel="stylesheet" href="css/main.css">

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css">
    <script src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js"></script>
</head>

<body>
<div id="app"> 

    <div class="imagenes">
        <div id="edit-p" class="button">
            <button id="btn-agregar" class="button_mas btn-comun">+</button>
            <button id="btn-guardar" class="button_mas--s btn-comun btn-des">Guardar</button>
            <button id="btn-borrar" class="button_mas--s btn-exit btn-des">Cancelar</button>
        </div>
        <div id="modal" class="modal-cont btn-des">
            <div class="modal-overlay "></div>

        <div  class="modal">
            <h1 class="modal_titulo">¿Estás seguro?</h1>
            <h2 class="modal_descripcion">Se guardarán los cambios actuales en tu perfil.</h2>
            
            <div class="modal-actions">
                <button id="btn-exit" class="btn-exit">Salir</button>
                
                <button id="btn-edit" class="btn-comun">Continuar</button>
            </div>
        </div>
        </div>

        <div id="panorama" class="paronama image-1 ">   
            <div id="loading"  role="status" aria-live="polite">
                <div class="loading-overlay">
                    <div class="logo">VIAR</div>
                        <div class="loader" aria-hidden="true"></div>
                        <div class="progress-wrap" aria-hidden="true">
                          <div id="progressBar" class="progress-bar"></div>
                        </div>
                    <div id="progressText" class="progress-text">0%</div>
                     <p class="progress-text progress-text-consejo">Consejo: <span id="consejo__span"></span> </p>
              </div>
              <div class="fondo"></div></div>            
            </div>
        </div>
    </div>

    <div id="box--cartel" class="box box--cartel">
             <div class="box__header">
                <div id="vistaTitulo" class="">
                    <h3><span id="boxTituloText" class="box__header__h3">TITULO</span> <span id="btnEditarTitulo" class="titulo-edit" style="cursor: pointer; margin-left: 10px; color: #ffc107;">
                        <i class="fa-solid fa-pencil"></i>
                    </span> </h3>
                            
                </div>

                <form id="formTitulo" class="btn-des" action="" method="POST" style="display: flex; gap: 5px;">
                    <input type="text" id="inputTituloEdit" class="form-control form-control-sm" value="" placeholder="Título">
                    
                    <input type="hidden" id="inputDescHidden" value="">
                    
                    <button type="submit" class="btn btn-sm btn-success"><i class="fa-solid fa-check"></i></button>
                    <button type="button" id="btnCancelarEdit" class="btn btn-sm btn-secondary"><i class="fa-solid fa-xmark "></i></button>
                </form>
            </div>

             <div id="iframe" class="box__footer">
                <div class="carousel-wrapper">
                    <div class="carousel-track" id="carouselTrack"></div>
                </div>
                <div class="carousel-controls">
                    <button class="carousel-btn" id="prevBtn">‹</button>
                    <div class="carousel-indicators" id="indicators"></div>
                    <span class="counter" id="counter">1 / 1</span>
                    <button class="carousel-btn" id="nextBtn">›</button></br>
                    
                </div>
              <div class="action-buttons">
    <button class="btn-action btn-add" id="btnAgregarVideo">
        <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Agregar
    </button>
    
    <button class="btn-action btn-del" id="btnEliminarVideo">
        <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
        Video
    </button>
    
    <button class="btn-action btn-del-all" id="btnEliminarPunto">
        <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <line x1="18" y1="6" x2="6" y2="18"></line>
             <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
        Todo
    </button>
</div>                <input type="hidden" id="currentPointId" value="">
                <input type="hidden" id="currentVideoId" value="">
            </div>
            <button id="button--end" class=" imagenes__button  button--end button--end--active">x</button>   
    </div>
    
    <div id="acceso" class="app__aceso app__aceso--default app__aceso--mostrar">
        <div class="aceso__header">
          <span class="aceso__title">
            <i class="fa-solid fa-layer-group"></i> Salas
          </span>
        </div>
        <div id="acceso_cont" class="cont"></div>
        <div id="button-acceso" class="app__aceso__button">
          <i class="fa-solid fa-angles-right"></i>
        </div>
    </div>
</div>
<div id="modalAddVideo" class="modal-overlay-2 d-none">
    <div class="modal">
        <h1 class="modal_titulo">Agregar Nuevo Video</h1>
        <p class="modal_descripcion" style="margin-bottom: 15px;">Ingresa los datos del video de YouTube.</p>
        
        <div class="form-group" style="text-align: left; width: 100%; margin-bottom: 15px;">
            <label style="display:block; font-weight:bold; margin-bottom:5px;">Título:</label>
            <input type="text" id="newVideoTitle" class="modal-input" placeholder="Ej: Press de Banca">
            
            <label style="display:block; font-weight:bold; margin-top:10px; margin-bottom:5px;">Link (YouTube):</label>
            <input type="text" id="newVideoLink" class="modal-input" placeholder="https://www.youtube.com/watch?v=...">
        </div>

        <div class="modal-actions">
            <button id="btnCancelAdd" class="btn-exit">Cancelar</button>
            <button id="btnSaveAdd" class="btn-comun">Guardar</button>
        </div>
    </div>
</div>
<div id="customModal" class="modal-overlay" style="display: none;">
    <div class="modal">
        <div class="modal-header">
            <h3 id="modalTitle">Título</h3>
        </div>
        <div class="modal-body">
            <p id="modalMessage">Mensaje aquí...</p>
        </div>
        <div class="modal-footer">
            <button id="btnModalCancel" class="btn-modal-cancel">Cancelar</button>
            <button id="btnModalConfirm" class="btn-modal-confirm">Aceptar</button>
        </div>
    </div>
</div>
<footer class="footer">
    <div class="footer__link">
        <span>Todos los derechos reservados: </span>
        <a href="https://www.LuOfLuck.tech" target="_BLANK"><span>@LuOfLuck</span></a>
    </div>
</footer>

<script>

    const modelos = <?php echo json_encode($modelos_export, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES); ?>;

    const cuartos = [
        <?php foreach ($cuartos_export as $c): ?>
        {
            "id": "<?php echo $c['id']; ?>",
            "nombre": "<?php echo $c['nombre']; ?>",
            "url": "<?php echo $c['url']; ?>",
            "preview": "<?php echo $c['preview']; ?>",
            // Referencia directa a la variable JS 'modelos'
            "modelos": modelos.<?php echo $c['key_referencia']; ?>.objetos,
            "salidas": modelos.<?php echo $c['key_referencia']; ?>.salidas
        },
        <?php endforeach; ?>
    ];

    console.log("Datos cargados desde PHP:", { modelos, cuartos });
</script>

<script src="js/main.js"></script>
<script src="js/editor.js"></script>

</body>
</html>