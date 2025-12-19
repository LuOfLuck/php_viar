


// Detectar Samsung Internet Browser
function isSamsungBrowser() {
    const ua = navigator.userAgent;
    return /SamsungBrowser/i.test(ua);
}

// Mostrar banner de aviso
function showSamsungWarning() {
    const banner = document.createElement('div');
    banner.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px;
        text-align: center;
        z-index: 9999;
        font-family: Arial, sans-serif;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    `;
    banner.innerHTML = `
        <div style="max-width: 600px; margin: 0 auto;">
            <span style="font-size: 24px;">🚫</span>
            <p style="margin: 10px 0; font-size: 16px;">
                <strong>¡Ups!</strong> Parece que estás usando Samsung Internet.<br>
                Este sitio requiere <strong>Chrome</strong> o <strong>Firefox</strong> para funcionar correctamente.
            </p>
            <button onclick="chrome()" style="
                padding: 10px 25px;
                background: rgba(255,255,255,0.9);
                border: 2px solid white;
                border-radius: 30px;
                cursor: pointer;
                font-weight: bold;
                color: #333;
            ">Abrir Chrome</button>
        </div>
    `;
    document.body.insertBefore(banner, document.body.firstChild);
}
function chrome(){
        const chromeIntent = `intent://${window.location.host}${window.location.pathname}${window.location.search}#Intent;scheme=https;package=com.android.chrome;end`;
        window.location.href = chromeIntent;
        
        setTimeout(() => {
            alert("Por favor, copia esta URL y ábrela en Google Chrome para continuar.");
        }, 10000);
}

if (isSamsungBrowser()) {
    showSamsungWarning();
}