const agregar = document.getElementById("btn-agregar"); 
const guardar = document.getElementById("btn-guardar"); 
const exit = document.getElementById("btn-exit"); 
const edit = document.getElementById("btn-edit"); 
const borrar = document.getElementById("btn-borrar"); 
const modal = document.getElementById("modal"); 
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