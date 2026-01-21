
// Variables globales donde se guardarán los datos finales
let modelos = {};
let cuartos = [];

async function cargarDatosDelTour() {
    try {
        // PASO 1: Obtener la lista básica de cuartos del Gimnasio
        const respCuartos = await fetch(`${API_BASE}?recurso=cuartos&id=${ID_GYMNASIO}`);
        const listaCuartos = await respCuartos.json();

        // PASO 2: Recorremos cada cuarto para pedir su "info_completa"
        // Usamos Promise.all para cargar todos los cuartos en paralelo (más rápido)
        const promesasDetalles = listaCuartos.map(async (cuartoBasico) => {
            
            // Llamada a la API de detalle (recurso=info_completa_cuarto)
            const respDetalle = await fetch(`${API_BASE}?recurso=info_completa_cuarto&id=${cuartoBasico.id}`);
            const data = await respDetalle.json();

            // --- A. TRANSFORMACIÓN DE PUNTOS (HOTSPOTS) ---
            const objetosTransformados = data.puntos_interes.map(punto => {
                return {
                    "pitch": parseFloat(punto.pitch),
                    "yaw": parseFloat(punto.yaw),
                    "cssClass": "custom-hotspot",
                    "createTooltipArgs": {
                        "titulo": punto.titulo,
                        "descripcion": punto.descripcion,
                        // Mapeamos los links de la BD al formato del array 'url'
                        "url": punto.links.map(link => ({
                            "titulo": link.titulo,
                            "link": link.link
                        })),
                        "pitch": parseFloat(punto.pitch),
                        "yaw": parseFloat(punto.yaw),
                        // Guardamos ID por si sirve para edición futura
                        "id": punto.id 
                    }
                };
            });

            // --- B. TRANSFORMACIÓN DE SALIDAS (FLECHAS) ---
            const salidasTransformadas = data.salidas.map(salida => {
                return {
                    "id": salida.id,
                    "pitch": parseFloat(salida.pitch),
                    "yaw": parseFloat(salida.yaw),
                    "type": "scene",
                    "cssClass": "custom-exit",
                    "clickHandlerFunc": "irEscenaConZoom",
                    "clickHandlerArgs": {
                        "id": salida.salida.toString(), // ID del cuarto destino
                        "pitch": parseFloat(salida.pitch),
                        "yaw": parseFloat(salida.yaw)
                    }
                };
            });

            // --- C. LLENAR OBJETO 'MODELOS' ---
            // Usamos una clave dinámica como "cuarto_1", "cuarto_2"
            const keyModelo = `cuarto_${data.id}`;
            modelos[keyModelo] = {
                "objetos": objetosTransformados,
                "salidas": salidasTransformadas
            };

            // --- D. RETORNAR OBJETO PARA EL ARRAY 'CUARTOS' ---
            return {
                "id": data.id.toString(),
                "nombre": data.nombre,
                // Validamos que existan imágenes, si no, cadena vacía
                "url": data.imagenes ? data.imagenes.urlprin : "",
                "preview": data.imagenes ? data.imagenes.urlsec : "",
                // Referenciamos lo que acabamos de crear en modelos
                "modelos": modelos[keyModelo].objetos,
                "salidas": modelos[keyModelo].salidas
            };
        });

        // Esperamos a que todas las peticiones terminen y llenamos el array 'cuartos'
        cuartos = await Promise.all(promesasDetalles);

        // --- FINAL: AQUÍ YA TIENES LOS DATOS LISTOS ---
        console.log("--- CARGA COMPLETA ---");
        console.log("Variable 'modelos':", modelos);
        console.log("Variable 'cuartos':", cuartos);

        main()
        
    } catch (error) {
        console.error("Error cargando el tour:", error);
    }
}
console.log("ss")
// Ejecutar la función
cargarDatosDelTour();