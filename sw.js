// para que un pwa se pueda instalar necesitamos 3 cosas
// 1 - un manifest valido
// 2 - un dominio https o ser un localhost
//3 - tener registrado el eventlistener de fetch
const nombreCache = "apv-v1";
const archivos = [
    "/",
    "/manifest.json",
    "/index.html",
    "/error.html",
    "/img/icons/Icon-144.png",
    "/css/bootstrap.css",
    "/css/styles.css",
    "/css/normalize.css",
    "/dist/app.js",
    "/dist/apv.js",
    "/dist/funciones.js",
    "/dist/selectores.js",
    "/dist/class/App.js",
    "/dist/class/Citas.js",
    "/dist/class/ICitas.js",
    "/dist/class/IndexDB.js",
    "/dist/class/UI.js",
];

//cuando se instala el serviceWorker
self.addEventListener("install", (e) => {
    console.log("instalado el service Worker");
    console.log(e);

    e.waitUntil(//tremos a cache los que nos hace falta para que nuestra app funcione sin estar conectada a internet
        caches.open(nombreCache)
            .then((cache) => {
                console.log("cacheando");
                cache.addAll(archivos);//add all permite pasarle el arreglo de archivos
            }).catch((err) => {
                console.log(err);
            })
    );
});

//cuando se activa el serviceWorker
self.addEventListener("activate", (e) => {
    console.log("sevice Worker activado");
    console.log(e);

    e.waitUntil(//eperamos por que se devuelvan las keys del cache del service worker
        caches.keys()
            .then(keys => {
                return Promise.all(keys.filter(key => key !== nombreCache)
                    .map(key => caches.delete(key)));
            })
    );
});

// evento fetch para descargar archivos estaticos
self.addEventListener('fetch', e => {

    e.respondWith(
        caches.match(e.request.url)
            .then(respuestaCache => {
                return respuestaCache || fetch(e.request);
            })
            .catch(() => caches.match('/error.html'))
    );
});
