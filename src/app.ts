if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js")
        .then((registrado) => console.log("Se ha instalado correctamente", registrado))
        .catch((error) => console.log("Fallo la instalacion ...", error));
} else {
    console.log("Serivce Worker no Soportado");
}
