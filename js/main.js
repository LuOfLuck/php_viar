// js/main.js

// Referencias DOM
const boxEnd = document.getElementById("button--end");
const boxCartel = document.getElementById("box--cartel");
const panorama = document.getElementById("panorama");
const buttonAcceso = document.getElementById("button-acceso");
const consejo = document.getElementById("consejo__span");
const acceso = document.getElementById("acceso");
const acceso_cont = document.getElementById("acceso_cont");
const btnEditPoint = document.getElementById("btnEditPoint");
var boxTitulo = boxCartel.querySelector(".box__header__h3");
// var boxDescripcion = boxCartel.querySelector(".box__body__p"); // Asegúrate que este elemento exista en tu HTML si lo usas
var loadingEl = document.getElementById('loading');
var progressBar = document.getElementById('progressBar');
var progressText = document.getElementById('progressText');

// Carrusel
const track = document.getElementById('carouselTrack');
const indicators = document.getElementById('indicators');
const counter = document.getElementById('counter');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let currentIndex = 0;
var length = 0;

const tips = [
  "Puedes desplazarte arrastrando con el dedo o el mouse",
  "Haz zoom acercando o alejando con dos dedos o con la rueda del mouse",
  "Toca los íconos brillantes (orbes) para descubrir información",
  "Pulsa en las flechas de salida para cambiar de habitación",
  "En pantallas táctiles, prueba girar el dispositivo para una experiencia más inmersiva",
  "Algunos objetos contienen enlaces a videos o contenido extra",
  "Toca el ícono de información para leer más detalles de la escena",
];

// Función global para cambiar escena (llamada desde las flechas de salida)
window.irEscenaConZoom = function(evento, args){
    console.log("Iniciando transición a:", args.id);
    // Accedemos a la instancia global vistaPrinc
    var pViewer = vistaPrinc.viewer; 
    var container = document.getElementById('panorama'); 
    pViewer.lookAt(args.pitch, args.yaw, 20, 400);
    container.classList.add('en-movimiento');
    setTimeout(function() {
        pViewer.loadScene(args.id);
    }, 300); 
}

// Clase Principal del Visor
class ViewerConstructor{
    constructor(modelos, cuartos) {
        this.cuartos = cuartos;
        this.modelos = modelos;
        // Iniciar Pannellum
        this.viewer  = pannellum.viewer('panorama', this.createdViewer(this.modelos, this.cuartos));
        this.carga = 0;
        
        this.actualizarImagenes();
        this.viewerClic();
        this.viewerExit();
        this.changeEscena();
        
        this.intervar = null;
    }

    createdViewer(modelos, cuartos){
        this.loadViewer();
        
        let scenes = {};
        
        // Configuración inicial
        let v = {
            "default": {
                "firstScene": cuartos[0].id,
                "sceneFadeDuration": 1000,
                "hfov": 120,
                "showLoader": false,
                "autoLoad": true,
                "showControls": false,
            },
            "scenes": { }
        }

        // Procesar cada cuarto para generar las escenas de Pannellum
        this.cuartos.forEach((element, index)=> {
            scenes[`${element.id}`] = { // Usamos el ID real del cuarto como key
                title: "",
                hfov: 120,
                pitch: 0,
                yaw: 0,
                type: "equirectangular",
                panorama: element.url,
                preview: element.preview,
                hotSpots: []
            };
            
            let objetos = [];
            
            // Procesar Hotspots (Puntos de info)
            if(element.modelos){
                element.modelos.forEach((e)=>{
                    let hotspotData = { ...e }; // Clonar
                    hotspotData.createTooltipFunc = hotspot; // Asignar la función visual
                    objetos.push(hotspotData);
                });
            }

            // Procesar Salidas (Flechas)
            if(element.salidas){
                element.salidas.forEach((e)=>{
                    let salidaProcesada = { ...e };
                    // Si viene como string desde la BD, buscamos la función en window
                    if (typeof e.clickHandlerFunc === 'string') {
                        salidaProcesada.clickHandlerFunc = window[e.clickHandlerFunc];
                    }
                    objetos.push(salidaProcesada);
                });
            }

            scenes[`${element.id}`].hotSpots = objetos;
        });
        
        v.scenes = scenes;
        return v;
    }

    showLoading(msg="Cargando panorama...") {
        progressBar.style.width = "0%";
        progressText.textContent = "0%";
        this.simulateProgress();
    }

    simulateProgress() {
        loadingEl.classList.remove("hidden");
        this.carga=0;
        progressBar.style.width = this.carga + "%";
        progressText.textContent = this.carga + "%";
        
        let randomTip = tips[Math.floor(Math.random() * tips.length)];
        consejo.textContent = randomTip;
        
        const intervalConsejo = setInterval(() => {
            let randomTip = tips[Math.floor(Math.random() * tips.length)];
            consejo.textContent = randomTip;
        }, 3000);

        const intervar = setInterval(() => {
            this.carga += Math.random() * 7;
            if (this.carga > 95) this.carga = 95;
            
            progressBar.style.width = Math.round(this.carga) + "%";
            progressText.textContent = Math.round(this.carga) + "%";
            
            // Chequear si Pannellum ya cargó
            if (this.viewer.isLoaded()) {
                clearInterval(intervar);
                clearInterval(intervalConsejo);
                this.hideLoading();
            }
        }, 400);
    }

    hideLoading() {
        progressBar.style.width = "100%";
        progressText.textContent = "100%";
        panorama.classList.add("cargado");
        acceso.classList.add("app__aceso--mostrar");
        setTimeout(() => {
            loadingEl.classList.add("hidden");
        }, 300);
    }

    viewerClic(){
        this.viewer.on("mousedown", (event) => {
            const coords = this.viewer.mouseEventToCoords(event);
            console.log(`Click detectado en -> Pitch: ${coords[0]}, Yaw: ${coords[1]}`);
        });
    }

    viewerFocus(args){
        acceso.classList.remove("app__aceso--mostrar");
        this.viewer.lookAt(args.pitch, args.yaw, 20, 2500);

        boxEnd.classList.add('button--end--active');
        boxCartel.classList.add('box--active');
        boxTitulo.innerText = args.titulo;

 

        // Cargar Videos en Carrusel
        length = args.url.length;
        track.innerHTML = "";
        indicators.innerHTML = "";
        currentIndex = 0;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        counter.textContent = `${currentIndex + 1} / ${length}`;
        
        args.url.forEach((video, index) => {
            const div = document.createElement("div");
            div.className = "video-item";
            
            const titulo = document.createElement("h3");
            titulo.textContent = video.titulo;
            
            const iframe = document.createElement("iframe");
            iframe.src = video.link;
            iframe.allowFullscreen = true;
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
            
            div.appendChild(titulo);
            div.appendChild(iframe);
            track.appendChild(div);

            const indicator = document.createElement("div");
            indicator.className = "indicator" + (index === 0 ? " active" : "");
            indicator.addEventListener("click", () => goToSlide(index));
            indicators.appendChild(indicator);
      });
    }

    viewerNormalize(){
        document.querySelectorAll(".custom-hotspot--desactive").forEach(e => {
            if(e){e.classList.remove("custom-hotspot--desactive")}
        });
        acceso.classList.add("app__aceso--mostrar");
        boxEnd.classList.remove("button--end--active");
        boxCartel.classList.remove("box--active");
        
        let pitch = this.viewer.getPitch(); 
        let yaw   = this.viewer.getYaw();    
        this.viewer.lookAt(pitch, yaw, 120, 2500);
        
        // Limpiar videos para que paren de reproducirse
        track.innerHTML = "";
    }

    viewerExit(){
        boxEnd.addEventListener("click", ()=> this.viewerNormalize()) 
    }

    loadViewer(){
        if(acceso.classList.contains("app__aceso--mostrar")){
            acceso.classList.remove("app__aceso--mostrar");
        }
        this.showLoading("Cargando escena...");
        this.simulateProgress();
    }

    changeEscena(){
        this.viewer.on("load", () => {
            if(panorama.classList.contains('en-movimiento')){
                panorama.classList.remove('en-movimiento');
            }
            if(!acceso.classList.contains("app__aceso--mostrar")){
                acceso.classList.add("app__aceso--mostrar");
            }
            this.actualizarExit();
        });

        this.viewer.on("scenechange",(sceneId)=>{
            console.log("Cambiando a escena:", sceneId);
            if(acceso.classList.contains("app__aceso--mostrar")){
                acceso.classList.remove("app__aceso--mostrar");
            }
            this.actualizarImagenes();
        });
    }

    preCargarImagen(urlImagen) {
        var img = new Image();
        img.src = urlImagen;
    }

    actualizarImagenes(){
        let scena_actual = this.viewer.getScene();
        acceso_cont.innerHTML = "";
        
        this.cuartos.forEach((cuarto)=>{
            if(cuarto.id != scena_actual){
                acceso_cont.insertAdjacentHTML('beforeend', `
                    <div class="app__aceso__img " data-scena="${cuarto.id}">
                        <div class="card-wrapper">
                            <img src="${cuarto.preview ? cuarto.preview : cuarto.url}" alt="${cuarto.nombre}">
                        </div>
                        <span class="text">${cuarto.nombre}</span>
                    </div>
                `);
            }
        });

        let imagenes = document.querySelectorAll(".app__aceso__img");
        imagenes.forEach((imagen)=>{
                imagen.addEventListener("click", ()=>{
                    this.viewer.loadScene(imagen.dataset.scena);
                    this.loadViewer();
            })
        });

        // Precarga inteligente de la siguiente escena conectada
        var escenaActualId = this.viewer.getScene();
        var config = this.viewer.getConfig();
        var escenaActual = config.scenes[escenaActualId];
        
        if(escenaActual && escenaActual.hotSpots) {
            escenaActual.hotSpots.forEach((spot)=> {
                if (spot.clickHandlerArgs && spot.clickHandlerArgs.id) {
                    var siguienteEscenaId = spot.clickHandlerArgs.id;
                    if(config.scenes[siguienteEscenaId]){
                        var urlSiguienteImagen = config.scenes[siguienteEscenaId].panorama;
                        this.preCargarImagen(urlSiguienteImagen);
                    }
                }
            });
        }
    }

    actualizarExit(){
        let exits = document.querySelectorAll(".custom-exit");
        
        exits.forEach((exit)=>{
            // Evitar duplicar flechas si ya existen
            if (exit.children.length === 0) {
                const div1 = document.createElement("div");
                div1.className = "triangulo-1";
                const div2 = document.createElement("div");
                div2.className = "triangulo-2";
                exit.appendChild(div1);
                exit.appendChild(div2);
            }
        });
    }
}

// Inicialización
let vistaPrinc;
const main = ()=>{
    // Aseguramos que 'modelos' y 'cuartos' existan (vienen del PHP)
    if(typeof modelos !== 'undefined' && typeof cuartos !== 'undefined' && cuartos.length > 0) {
        vistaPrinc = new ViewerConstructor(modelos, cuartos);
        
        buttonAcceso.addEventListener('click', (e) => {
            e.stopPropagation();
            acceso.classList.toggle('app__aceso--default');
        });
    } else {
        console.error("No se encontraron modelos o cuartos para cargar.");
        document.getElementById('progressText').innerText = "Error de datos";
    }
}

// Función visual del Hotspot (Info)
function hotspot(hotSpotDiv, args) {
    let pulse;
    pulse = document.createElement("div");
    pulse.classList.add('pulse');
    hotSpotDiv.classList.add('custom-tooltip');
    hotSpotDiv.appendChild(pulse);
    
    hotSpotDiv.addEventListener("click", (event) => {
        hotSpotDiv.classList.add('custom-hotspot--desactive');
        vistaPrinc.viewerFocus(args);
    });
}

// Lógica del Carrusel
function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    counter.textContent = `${currentIndex + 1} / ${length}`;
    
    document.querySelectorAll('.indicator').forEach((ind, i) => {
        ind.classList.toggle('active', i === currentIndex);
    });
}

function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
}

if(prevBtn) {
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + length) % length;
        updateCarousel();
    });
}

if(nextBtn) {
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % length;
        updateCarousel();
    });
}

// Arrancar
main();