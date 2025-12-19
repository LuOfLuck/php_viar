const modelos = {
    "circle":{
        "objetos":[
            //Smith
            {

                "pitch":  -6.04,
                "yaw":  -120.19,
                "cssClass": "custom-hotspot",
                "createTooltipArgs": {
                    "titulo":"Máquina Smith",
                    "descripcion":`
                    Máquina guiada que permite levantar peso con seguridad, mejorando fuerza, técnica y estabilidad en distintos ejercicios`,
                    "url":[ 
                        {"titulo": "Sentadilla", "link": "https://www.youtube.com/embed/vAlQMTTmalE"}, 
                        {"titulo": "Press de Banca Plano", "link": "https://www.youtube.com/embed/pijIaN_OOfk"}, 
                        {"titulo": "Press Militar (Hombro)", "link": "https://www.youtube.com/embed/ORvcK_OuTK0"}, 
                        {"titulo": "Sentadilla Frontal", "link": "https://www.youtube.com/embed/0Vh44WrziWM"}, 
                        {"titulo": "Zancadas (Lunges)", "link": "https://www.youtube.com/embed/sC_XTQqo780"}, 
                    ], 
                    "pitch": -6.04,
                    "yaw": -120.19,
                }
            }, 
            //prensa 
            {
                "pitch":-20.19,
                "yaw": -151.16,
                "cssClass": "custom-hotspot",
                "createTooltipArgs": {
                    "titulo": "Prensa de Piernas",
                    "descripcion": "Máquina fundamental para el tren inferior. Permite trabajar cuádriceps, glúteos e isquiotibiales con gran peso y soporte lumbar.",
                    "url": [
                        {"titulo": "Técnica Prensa 45°", "link": "https://www.youtube.com/embed/wpHk7S4eF5I?si=eFpkGsTL-7Xw_E2e"},
                        {"titulo": "Errores Comunes", "link": "https://www.youtube.com/embed/Xw0h2hiiYTg?si=j99DNrgoGuhlsjUI"}
                    ],
                    "pitch": -20.19,
                    "yaw": -151.16,
                }
            },
            //mancuernas
            { 
                "pitch": -13.06, 
                "yaw": -33.11, 
                "cssClass": "custom-hotspot", 
                "createTooltipArgs": { 
                    "titulo": "Mancuernas", 
                    "descripcion": "Elemento fundamental del gimnasio. Su naturaleza de peso libre permite un rango de movimiento completo y natural, mejorando la fuerza y la estabilidad unilateral.", 
                    "url": [ 
                        {"titulo": "Sentadilla Goblet", "link": "https://www.youtube.com/embed/SpMrPG3RiCQ"}, 
                        {"titulo": "Peso Muerto Rumano (RDL)", "link": "https://www.youtube.com/embed/WY8vQ3nIz7A"}, 
                        {"titulo": "Press Militar (Hombro)", "link": "https://www.youtube.com/embed/rv8aEOWls5E"},  
                        {"titulo": "Remo Unilateral", "link": "https://www.youtube.com/embed/X-kJyjifh2g"}, 
                        {"titulo": "Zancadas (Lunges)", "link": "https://www.youtube.com/embed/pPIoI_9MpxE"}, 
                        {"titulo": "Elevaciones Laterales", "link": "https://www.youtube.com/embed/nOAUECQEpHs"}, 
                        {"titulo": "Curl Martillo", "link": "https://www.youtube.com/embed/9bsalvR-6vo"}, 
                        {"titulo": "Sentadilla Búlgara", "link": "https://www.youtube.com/embed/WbPONX8pW6U"} 
                    ], 
                    "pitch": -13.06, 
                    "yaw": -33.11 
                } 
            }, 
            /*
            { 
                "pitch": 0, 
                "yaw": 0, 
                "cssClass": "custom-hotspot", 
                "createTooltipArgs": { 
                    "titulo": "Sillón de Cuádriceps", 
                    "descripcion": "Máquina de aislamiento diseñada para enfocar el trabajo directamente en los músculos cuádriceps (parte frontal del muslo).", 
                    "url": [ 
                        {"titulo": "Técnica Correcta", "link": "https://www.youtube.com/embed/D8CL7VuvvTg"},
                        {"titulo": "Errores Comunes", "link": "https://www.youtube.com/embed/L4bPYvNVD5U"}, 
                        {"titulo": "Extensión Unilateral", "link": "https://www.youtube.com/embed/KQSolHWckMs"} 
                    ], 
                    "pitch": 0, 
                    "yaw": 0 
                } 
            } */
        ],
        "salidas":[
            {       
                "id":0,
                "pitch": -1.08,
                "yaw": -80.07,
                "type": "scene",
                //"sceneId": "1",
                "cssClass": "custom-exit",
                "clickHandlerFunc": "irEscenaConZoom",
                "clickHandlerArgs": { 
                    "id": "1",
                    "pitch": -1.08,
                    "yaw": -80.07,
                }

            },  
        ],
    },
    "house":{
        "objetos":[
            {
                "pitch": -15.65,
                "yaw": 12.49,
                "cssClass": "custom-hotspot",
                "createTooltipArgs": {
                    "titulo": "Press Banca (Plano)",
                    "descripcion": "Ejercicio fundamental para el desarrollo del pecho (pectoral mayor), tríceps y deltoides anterior. Se realiza en un banco plano.",
                    "url": [
                        { 
                            "titulo": "Técnica Correcta", "link": "https://www.youtube.com/embed/gRVjAtPip0Y" 
                        },
                        { 
                            "titulo": "Errores Comunes", "link": "https://www.youtube.com/embed/gS5KGm4wp1g" 
                        },
                        { 
                            "titulo": "Con Mancuernas", "link": "https://www.youtube.com/embed/rIfrdmAS04c" 
                        }
                    ],
                    "pitch": -15.65,
                    "yaw": 12.49
                },
            },
            {
                "pitch": -24.39,
                "yaw": 88.66,
                "cssClass": "custom-hotspot",
                "createTooltipArgs": {
                    "titulo": "Press Banca Inclinado",
                    "descripcion": "Variante del press de banca que enfatiza la porción superior (clavicular) del pectoral, así como los deltoides anteriores.",
                    "url": [
                        { "titulo": "Técnica (Mancuernas)", "link": "https://www.youtube.com/embed/0G2_XV7slIg" },
                        { "titulo": "Errores a Evitar", "link": "https://www.youtube.com/embed/MkMf308jXww" },
                        { "titulo": "Técnica (Barra)", "link": "https://www.youtube.com/embed/-vYzoCo9VRU?si=gABsyHzkjetpYVZ0" }
                    ],
                    "pitch": -24.39,
                    "yaw": 88.66
                }
            },
        ],
        "salidas":[
            {       
                "id":1,
                "pitch":  -16.25,
                "yaw":  -33.28,
                "type": "scene",
                "cssClass": "custom-exit",
                //"sceneId": "0",
                "clickHandlerFunc": "irEscenaConZoom",
                "clickHandlerArgs": {
                    "id": "0",
                    "pitch":  -16.25,
                    "yaw":  -33.28,
                },
            },  
        ],
    },
}
const cuartos = [
    {
        "id":"0",
        "nombre": "Sala 1",
        //"url":"https://www.luofluck.tech/360/8-min.jpeg",
        "url":"https://www.luofluck.tech/360/8-min.webp",
        "preview": "https://www.luofluck.tech/360/8-min_preview.jpg",
        "modelos":modelos.circle.objetos,
        "salidas":modelos.circle.salidas,

    },
    {
        "id":"1",
        "nombre": "Sala 2",
        //"url":"https://www.luofluck.tech/360/7-min.jpeg",
        "url":"https://www.luofluck.tech/360/7-min.webp",
        "preview": "https://www.luofluck.tech/360/7-min_preview.jpg",
        "modelos":modelos.house.objetos,
        "salidas":modelos.house.salidas,
    },

]
