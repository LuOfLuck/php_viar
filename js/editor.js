const agregar = document.getElementById("btn-agregar"); 
const guardar = document.getElementById("btn-guardar"); 
const exit = document.getElementById("btn-exit"); 
const edit = document.getElementById("btn-edit"); 
const borrar = document.getElementById("btn-borrar"); 
const modal = document.getElementById("modal"); 
const titulo = document.getElementById("titulo"); 
// --- REFERENCIAS DOM ---
const vistaTitulo = document.getElementById('vistaTitulo');
const formTitulo = document.getElementById('formTitulo');
const btnEditarTitulo = document.getElementById('btnEditarTitulo');
const btnCancelarEdit = document.getElementById('btnCancelarEdit');
const inputTituloEdit = document.getElementById('inputTituloEdit');
const inputDescHidden = document.getElementById('inputDescHidden');
const boxTituloText = document.getElementById('boxTituloText');
// --- REFERENCIAS AL DOM (MODAL AGREGAR) ---
const modalAddVideo = document.getElementById('modalAddVideo');
const btnAgregarVideo = document.getElementById('btnAgregarVideo');
const btnCancelAdd = document.getElementById('btnCancelAdd');
const btnSaveAdd = document.getElementById('btnSaveAdd');
const inputNewTitle = document.getElementById('newVideoTitle');
const inputNewLink = document.getElementById('newVideoLink');

// 1. ABRIR EL MODAL
if (btnAgregarVideo) {
    btnAgregarVideo.addEventListener('click', () => {
        // Limpiamos los inputs anteriores
        inputNewTitle.value = "";
        inputNewLink.value = "";
        
        // Mostramos el modal quitando la clase d-none
        modalAddVideo.classList.remove('d-none');
        
        // Ponemos el foco en el título
        inputNewTitle.focus();
    });
}

// 2. CERRAR EL MODAL (Botón Cancelar)
if (btnCancelAdd) {
    btnCancelAdd.addEventListener('click', () => {
        modalAddVideo.classList.add('d-none');
    });
}

// 3. GUARDAR (Botón Continuar/Guardar)
if (btnSaveAdd) {
    btnSaveAdd.addEventListener('click', () => {
        const idPunto = document.getElementById('currentPointId').value;
        const titulo = inputNewTitle.value;
        let link = inputNewLink.value;

        // Validaciones
        if (!idPunto) return alert("Error interno: No hay punto seleccionado");
        if (!titulo.trim()) return alert("El título es obligatorio");
        if (!link.trim()) return alert("El link es obligatorio");

        // Convertir link de YouTube a embed si es necesario
        if (link.includes("watch?v=")) {
            link = link.replace("watch?v=", "embed/");
            // Limpiar parámetros extra si los hay (como &t=...)
            if (link.includes("&")) {
                link = link.split("&")[0];
            }
        } else if (link.includes("youtu.be/")) {
            // Manejar links cortos (youtu.be/ID)
            const parts = link.split("youtu.be/");
            link = "https://www.youtube.com/embed/" + parts[1];
        }

        // Enviamos a la API
        fetch('api_acciones.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                accion: 'agregar_video',
                id_punto: idPunto,
                titulo: titulo,
                link: link
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                alert("¡Video agregado con éxito!");
                
                // Cerramos el modal
                modalAddVideo.classList.add('d-none');
                
                // Recargamos la página para ver los cambios
                location.reload();
            } else {
                alert("Error al guardar: " + (data.message || "Desconocido"));
            }
        })
        .catch(err => console.error("Error:", err));
    });
}

// Opcional: Cerrar si clickean fuera del cuadro blanco (en el fondo oscuro)
modalAddVideo.addEventListener('click', (e) => {
    if (e.target === modalAddVideo) {
        modalAddVideo.classList.add('d-none');
    }
});
btnEditarTitulo.addEventListener("click", (e) => {
    vistaTitulo.classList.add("btn-des");
    formTitulo.classList.remove("btn-des");
    
    inputTituloEdit.value = boxTituloText.innerText;
    inputTituloEdit.focus();
});

btnCancelarEdit.addEventListener("click", (e) => {
    vistaTitulo.classList.remove("btn-des");
    formTitulo.classList.add("btn-des");
});

formTitulo.addEventListener("submit", (e) => {
    e.preventDefault();
    const idPunto = document.getElementById('currentPointId').value;
    const nuevoTitulo = inputTituloEdit.value;
    const descripcionActual = inputDescHidden.value; 
    if(!nuevoTitulo.trim()) return alert("El título no puede estar vacío");

    // Enviamos a la API
    fetch('api_acciones.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            accion: 'editar_punto',
            id_punto: idPunto,
            titulo: nuevoTitulo,
            descripcion: descripcionActual // IMPORTANTE: Mandamos la descripción para que PHP no la borre
        })
    })
    .then(res => res.json())
    .then(data => {
        if(data.status === 'success') {
            boxTituloText.innerText = nuevoTitulo;
            
            vistaTitulo.classList.remove("btn-des");
            formTitulo.classList.add("btn-des");
        } else {
            alert("Error al guardar: " + data.message);
        }
    })
    .catch(err => console.error("Error:", err));
});
var cont =-1
var newHost = []
function mostrarMensaje(evento, args) {
    console.log("Hotspot clickeado!");
    vistaPrinc.viewer.removeHotSpot(args.id);
    const indice = newHost.findIndex(elemento => elemento.id == args.id);
    if (indice > -1) {
        newHost.splice(indice, 1); 
        console.log(" Eliminado del array. Lista actual:", newHost);
    } else {
        console.warn("No se encontró ese ID en el array newHost");
    }
}
function guardarHostpost(){
	    if (newHost.length > 0) {
            console.log("Enviando datos...", newHost);
    fetch('guardar_hotspots.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newHost) 
    })
    .then(response => response.text())
    .then(texto => {
        console.log("Servidor:", texto); 
        
        try {
            const data = JSON.parse(texto); 
            if (data.status === 'success') {
                alert("Guardado (Se actualizara la pagina)");
                location.reload()
                newHost = [];
                location.reload()
            } else {
                alert("Error: " + data.mensaje);
            }
        } catch (error) {
            console.error("Error de parseo:", error);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert("Error al guardar");
    });
    }
}
const registrarClick = (event) => {
	let idCuarto = vistaPrinc.viewer.getScene(); 
    const coords = vistaPrinc.viewer.mouseEventToCoords(event);
    console.log(`Click detectado en -> Pitch: ${coords[0]}, Yaw: ${coords[1]}`);
    let pitch =coords[0];
    let yaw =coords[1];
    
    let l = vistaPrinc.viewer.addHotSpot({
    	"id":`${cont}`,
        "pitch": pitch,
        "yaw": yaw,
        "type": "info",
        "cssClass": "custom-hotspot custom-new",
        "text": "",
        "clickHandlerFunc": mostrarMensaje, 
        "clickHandlerArgs": { "id":`${cont}`, },
    });
    newHost.push({
    	"id":`${cont}`,
    	"id_cuarto":idCuarto,
        "pitch": pitch,
        "yaw": yaw,
    })
    console.log(newHost)
    cont--
};


agregar.addEventListener("click",(e)=>{
	modal.classList.remove("btn-des")
	agregar.classList.add("btn-des")
})
exit.addEventListener("click",(e)=>{
	modal.classList.add("btn-des")
	agregar.classList.remove("btn-des")
})

edit.addEventListener("click", (e) => {
    modal.classList.add("btn-des");
    guardar.classList.remove("btn-des");
    borrar.classList.remove("btn-des");
    vistaPrinc.viewer.off("mousedown", registrarClick);
    vistaPrinc.viewer.on("mousedown", registrarClick);
});

guardar.addEventListener("click", (e) => {
    guardar.classList.add("btn-des");
    borrar.classList.add("btn-des");
    if(typeof agregar !== 'undefined') agregar.classList.remove("btn-des"); 
    vistaPrinc.viewer.off("mousedown", registrarClick);
    guardarHostpost();
    

});

borrar.addEventListener("click", (e) => {
	vistaPrinc.viewer.off("mousedown", registrarClick);
    guardar.classList.add("btn-des");
    borrar.classList.add("btn-des");
    agregar.classList.remove("btn-des")
  
    console.log(newHost);
    newHost.forEach((host)=>{
    	console.log(host)
    	vistaPrinc.viewer.removeHotSpot(host.id);
    })
    
    newHost = []
});

// B. ELIMINAR VIDEO (El que se ve actualmente)
document.getElementById('btnEliminarVideo').addEventListener('click', () => {
    const idLink = document.getElementById('currentVideoId').value;
    
    if(!idLink) return alert("No hay video seleccionado o la lista está vacía.");
    if(!confirm("¿Seguro que quieres borrar este video?")) return;

    fetch('api_acciones.php', {
        method: 'POST',
        body: JSON.stringify({
            accion: 'eliminar_video',
            id_link: idLink
        })
    })
    .then(res => res.json())
    .then(data => {
        if(data.status === 'success') {
            alert("Video eliminado.");
            location.reload();
        }
    });
});

// C. EDITAR PUNTO (Título y Descripción)


// D. ELIMINAR TODO (Punto y videos)
document.getElementById('btnEliminarPunto').addEventListener('click', () => {
    const idPunto = document.getElementById('currentPointId').value;
    if(!idPunto) return;

    if(!confirm("⚠️ ¡CUIDADO! ⚠️\nEsto borrará el punto, la descripción y TODOS los videos asociados.\n¿Continuar?")) return;

    fetch('api_acciones.php', {
        method: 'POST',
        body: JSON.stringify({
            accion: 'eliminar_punto',
            id_punto: idPunto
        })
    })
    .then(res => res.json())
    .then(data => {
        if(data.status === 'success') {
            alert("Punto eliminado completamente.");
            location.reload(); // Recargar para que desaparezca del tour
        }
    });
});