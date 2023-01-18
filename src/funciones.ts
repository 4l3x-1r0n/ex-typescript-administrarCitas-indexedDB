import { Cita, Citas } from "./class/Citas.js";
import { UI } from "./class/UI.js";
import { form } from "./selectores.js";


let editando = false;

const ui = new UI();

const citas = new Citas();

const citaObj: Cita = {
    id: 0,
    mascota: "",
    propietario: "",
    telefono: "",
    fecha: "",
    hora: "",
    sintomas: ""
};

export function cargarCitas() {
    console.log("cagando citas");
}


export function fillCitaObj(e: Event) {
    const element = e.target as HTMLInputElement;
    citaObj[element.name] = element.value;
}


export function agregarCita(e: Event) {
    e.preventDefault();
    if (!editando) {
        citaObj.id = Date.now();
    }

    for (const value of Object.values(citaObj)) {
        if (!value) {
            ui.showAlert("Todos los campos son obligatorios", "error");
            return;
        }
    }

    if (editando) {
        citas.editCita({ ...citaObj });
        ui.showAlert("Editado Correctamente", "success");
        (form.querySelector("button[type=\"submit\"]") as HTMLButtonElement).textContent = "Crear Cita";
        editando = false;
    } else {
        citas.addCita({ ...citaObj });//usamos el spread operator para mandar una copia del objeto, si no lo hacemos asi y solo ponemos el nombre del objeto, entonces estaremos mandando una referencia al objero y como es global, cuando cambiemos dicho objeto, todas las referencias a el tendran los valores nuevos del objeto, y no es lo que queremos, necesitamos ir gusrdado las propiedades del objeto a medida que va cambieando, entonces lo que hacemos es guaedar una copia del objeto en cada momento
        ui.showAlert("Se agregó correctamente", "success");
    }


    citaObjRestart();
    ui.showCitas(citas.citas);

    form.reset();
}

function citaObjRestart() {
    for (const index in citaObj) {
        citaObj[index] = "";
    }
}

export function eliminaCita(id: number) {
    citas.removeCita(id);
    ui.showCitas(citas.citas);
}

export function editarCita(cita: Cita) {
    for (const index in cita) {
        citaObj[index] = cita[index];
        const element = document.querySelector(`form [name=${index}`) as HTMLInputElement;
        if (element) {
            element.value = String(cita[index]);
        }
    }
    //CAmbiea texto del boton
    (form.querySelector("button[type=\"submit\"]") as HTMLButtonElement).textContent = "Guardar Cambios";

    editando = true;
}
