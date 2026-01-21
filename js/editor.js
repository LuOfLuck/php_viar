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

const Popup = {
    overlay: document.getElementById('customModal'),
    title: document.getElementById('modalTitle'),
    message: document.getElementById('modalMessage'),
    btnConfirm: document.getElementById('btnModalConfirm'),
    btnCancel: document.getElementById('btnModalCancel'),

    // Función para cerrar el modal
    close: function() {
        this.overlay.style.display = 'none';
    },

    // Método CONFIRM (Si/No)
    confirm: function(titulo, texto, onConfirm) {
        this.title.innerText = titulo;
        this.message.innerHTML = texto.replace(/\n/g, "<br>"); // Permitir saltos de linea
        
        // Mostrar botón cancelar
        this.btnCancel.style.display = "inline-block";
        this.btnConfirm.innerText = "Sí, eliminar";
        this.btnConfirm.style.backgroundColor = "#d32f2f"; // Rojo para acciones destructivas

        this.overlay.style.display = 'flex';

        // LIMPIEZA DE EVENTOS (Truco para borrar listeners viejos)
        const newConfirm = this.btnConfirm.cloneNode(true);
        const newCancel = this.btnCancel.cloneNode(true);
        this.btnConfirm.replaceWith(newConfirm);
        this.btnCancel.replaceWith(newCancel);
        this.btnConfirm = newConfirm;
        this.btnCancel = newCancel;

        // Asignar nuevos eventos
        this.btnConfirm.addEventListener('click', () => {
            this.close();
            if (onConfirm) onConfirm(); // Ejecuta la acción si dijo que sí
        });
        
        this.btnCancel.addEventListener('click', () => this.close());
    },

    // Método ALERT (Solo OK)
    alert: function(titulo, texto, onOk) {
        this.title.innerText = titulo;
        this.message.innerHTML = texto;
        
        // Ocultar cancelar y poner botón normal
        this.btnCancel.style.display = "none";
        this.btnConfirm.innerText = "Entendido";
        this.btnConfirm.style.backgroundColor = "#00796b"; // Verde normal

        this.overlay.style.display = 'flex';

        // Limpieza de eventos
        const newConfirm = this.btnConfirm.cloneNode(true);
        this.btnConfirm.replaceWith(newConfirm);
        this.btnConfirm = newConfirm;

        this.btnConfirm.addEventListener('click', () => {
            this.close();
            if (onOk) onOk();
        });
    }
};
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
    acceso.classList.add("btn-des")
})
exit.addEventListener("click",(e)=>{
	modal.classList.add("btn-des")
	agregar.classList.remove("btn-des")
    acceso.classList.remove("btn-des")
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
    acceso.classList.remove()("btn-des");
    if(typeof agregar !== 'undefined') agregar.classList.remove("btn-des"); 
    vistaPrinc.viewer.off("mousedown", registrarClick);
    guardarHostpost();
    

});

borrar.addEventListener("click", (e) => {
	vistaPrinc.viewer.off("mousedown", registrarClick);
    guardar.classList.add("btn-des");
    borrar.classList.add("btn-des");
    agregar.classList.remove("btn-des")
    acceso.classList.remove("btn-des")
  
    console.log(newHost);
    newHost.forEach((host)=>{
    	console.log(host)
    	vistaPrinc.viewer.removeHotSpot(host.id);
    })
    
    newHost = []
});

// B. ELIMINAR VIDEO
document.getElementById('btnEliminarVideo').addEventListener('click', () => {
    const idLink = document.getElementById('currentVideoId').value;
    
    if(!idLink) {
        Popup.alert("Atención", "No hay video seleccionado o la lista está vacía.");
        return;
    }

    // Usamos el nuevo sistema
    Popup.confirm(
        "¿Eliminar Video?", 
        "Estás a punto de borrar este video de la base de datos.<br>Esta acción es irreversible.", 
        () => {
            // Este código solo se ejecuta si el usuario presiona "Sí, eliminar"
            fetch('api_acciones.php', {
                method: 'POST',
                body: JSON.stringify({ accion: 'eliminar_video', id_link: idLink })
            })
            .then(res => res.json())
            .then(data => {
                if(data.status === 'success') {
                    // Popup de éxito antes de recargar
                    Popup.alert("¡Hecho!", "Video eliminado correctamente.", () => {
                        location.reload();
                    });
                } else {
                    Popup.alert("Error", "No se pudo eliminar el video.");
                }
            });
        }
    );
});


// D. ELIMINAR TODO
document.getElementById('btnEliminarPunto').addEventListener('click', () => {
    const idPunto = document.getElementById('currentPointId').value;
    if(!idPunto) return;

    Popup.confirm(
        "⚠️ ¡PELIGRO CRÍTICO!", 
        "Esto borrará el <b>Punto completo</b>, su descripción y <b>TODOS</b> los videos asociados.\n¿Deseas realmente continuar?", 
        () => {
            fetch('api_acciones.php', {
                method: 'POST',
                body: JSON.stringify({ accion: 'eliminar_punto', id_punto: idPunto })
            })
            .then(res => res.json())
            .then(data => {
                if(data.status === 'success') {
                    Popup.alert("Eliminado", "Punto eliminado completamente.", () => {
                         location.reload();
                    });
                }
            });
        }
    );
});