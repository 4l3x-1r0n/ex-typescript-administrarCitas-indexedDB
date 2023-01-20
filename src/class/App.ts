import {
    form,
    mascota_input,
    propietario_input,
    telefono_input,
    fecha_input,
    hora_input,
    sintomas_input
} from "../selectores.js";

import { agregarCita, fillCitaObj } from "../funciones.js";

//Regitrar eventos
export class App {
    constructor() {
        this.initApp();
    }

    initApp() {
        //document.addEventListener("DOMContentLoaded", cargarCitas);
        //window.onload hace lo mismo que el event slistener DOMContentLoaded
        // window.onload = cargarCitas;

        form.addEventListener("submit", agregarCita);

        mascota_input.addEventListener("change", fillCitaObj);
        propietario_input.addEventListener("change", fillCitaObj);
        telefono_input.addEventListener("change", fillCitaObj);
        fecha_input.addEventListener("change", fillCitaObj);
        hora_input.addEventListener("change", fillCitaObj);
        sintomas_input.addEventListener("change", fillCitaObj);
    }
}
