import { ICita } from "./class/ICitas.js";
import { UI } from "./class/UI.js";
import { form } from "./selectores.js";
import { IndexDB } from "./class/IndexDB.js";


const citaObj: ICita = {
    id: 0,
    mascota: "",
    propietario: "",
    telefono: "",
    fecha: "",
    hora: "",
    sintomas: ""
};

let editando = false;

const ui = new UI();

let citas: ICita[] = [];

const citasDB = new IndexDB("Citas", { ...citaObj }, 1, cargarCitas);//inicializamos la base de datos, el ultimo parametro es una funcion que se ejecuta cuando la base de datos este preparada

export function cargarCitas() {
    citasDB.loadCitas().then((result) => {
        citas = result;
        ui.showCitas(citas);
    });
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
        citasDB.editCita({ ...citaObj }).then((_citas) => {
            citas = _citas;
            //citas.editCita({ ...citaObj });
            ui.showAlert("Editado Correctamente", "success");
            (form.querySelector("button[type=\"submit\"]") as HTMLButtonElement).textContent = "Crear Cita";
            editando = false;

            citaObjRestart();
            ui.showCitas(citas);

            form.reset();
        });
    } else {
        //usamos el spread operator para mandar una copia del objeto, si no lo hacemos asi y solo ponemos el nombre del objeto, entonces estaremos mandando una referencia al objero y como es global, cuando cambiemos dicho objeto, todas las referencias a el tendran los valores nuevos del objeto, y no es lo que queremos, necesitamos ir gusrdado las propiedades del objeto a medida que va cambieando, entonces lo que hacemos es guaedar una copia del objeto en cada momento
        citasDB.addCita({ ...citaObj }).then((_citas) => {
            citas = _citas;

            ui.showAlert("Se agregó correctamente", "success");

            citaObjRestart();
            ui.showCitas(citas);

            form.reset();
        });
    }
}

function citaObjRestart() {
    for (const index in citaObj) {
        citaObj[index] = "";
    }
}

export function eliminaCita(id: number) {
    citasDB.removeCita(id).then((_citas) => {
        citas = _citas;
        //citas.removeCita(id);
        ui.showCitas(citas);
    });
}

export function editarCita(cita: ICita) {
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
