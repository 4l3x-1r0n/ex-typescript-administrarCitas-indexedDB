// CAmpos del formulario
const mascota_input = document.querySelector("#mascota") as HTMLInputElement;
const propietario_input = document.querySelector("#propietario") as HTMLInputElement;
const telefono_input = document.querySelector("#telefono") as HTMLInputElement;
const fecha_input = document.querySelector("#fecha") as HTMLDataElement;
const hora_input = document.querySelector("#hora") as HTMLTimeElement;
const sintomas_input = document.querySelector("#sintomas") as HTMLTextAreaElement;

//UI
const form = document.querySelector("#nueva-cita") as HTMLFormElement;
const citasContainer_ul = document.querySelector("#citas") as HTMLUListElement;

type TipoError = "error" | "success";

interface Cita {
    [key: string]: unknown;//si no agregamos esto no podromos acceder a las propiedades del objeto de esta forma citaObj[algun_string], ya que como no sabe el string que viene nos dira que no esta entre las keys del objeto
    id: number;
    mascota: string;
    propietario: string;
    telefono: string;
    fecha: string;
    hora: string;
    sintomas: string;
}


class Citas {
    citas: Cita[];
    constructor() {
        this.citas = [];
    }

    addCita(cita: Cita) {
        this.citas.push(cita);
    }

    removeCita(id: number) {
        this.citas = this.citas.filter((cita) => cita.id !== id);
    }

    editCita(cita: Cita) {
        this.citas.some((citaOfCitas, index) => {
            if (citaOfCitas.id === cita.id) {
                this.citas[index] = cita;
                return true;
            }
        });
    }
}

class UI {

    showAlert(msg: string, tipo: TipoError) {
        (document.querySelector("#contenido .alert-danger, #contenido .alert-success") as HTMLDivElement)?.remove();
        const msg_div = document.createElement("div");
        msg_div.classList.add("text-center", "alert", "d-block", "col-12");
        msg_div.classList.add(tipo == "error" ? "alert-danger" : "alert-success");
        msg_div.textContent = msg;
        (document.querySelector("#contenido") as HTMLDivElement).prepend(msg_div);
        setTimeout(() => {
            msg_div.remove();
        }, 3000);
    }

    showCitas(citas: Cita[]) {
        this.resetHtmlCitas();
        citas.forEach((cita) => {
            const { id, mascota, propietario, telefono, fecha, hora, sintomas } = cita;
            const cita_div = document.createElement("div");
            cita_div.classList.add("cita", "p-3");
            cita_div.dataset.id = id.toString();

            const mascotaParrafo = document.createElement("h2");
            mascotaParrafo.classList.add("card-title", "font-wwigh-bolder");
            mascotaParrafo.textContent = mascota;

            const propietarioParrafo = document.createElement("p");
            propietarioParrafo.innerHTML = `
                <sapan class="font-weigh-bolder">Propietario: ${propietario}</sapan>
            `;

            const telefonoParrafo = document.createElement("p");
            telefonoParrafo.innerHTML = `
                <sapan class="font-weigh-bolder">Telefono: ${telefono}</sapan>
            `;

            const fechaParrafo = document.createElement("p");
            fechaParrafo.innerHTML = `
                <sapan class="font-weigh-bolder">Fecha: ${fecha}</sapan>
            `;

            const horaParrafo = document.createElement("p");
            horaParrafo.innerHTML = `
                <sapan class="font-weigh-bolder">Hora: ${hora}</sapan>
            `;

            const sintomasParrafo = document.createElement("p");
            sintomasParrafo.innerHTML = `
                <sapan class="font-weigh-bolder">Sintomas: ${sintomas}</sapan>
            `;

            //boton para ekiminar cita
            const btnEliminar = document.createElement("button");
            btnEliminar.classList.add("btn", "btn-danger", "mr-2");
            btnEliminar.textContent = "Eliminar";
            btnEliminar.onclick = () => eliminaCita(id);

            const btnEditar = document.createElement("button");
            btnEditar.classList.add("btn", "btn-info", "mr-2");
            btnEditar.textContent = "Editar";
            btnEditar.onclick = () => editarCita(cita);

            cita_div.append(mascotaParrafo);
            cita_div.append(propietarioParrafo);
            cita_div.append(telefonoParrafo);
            cita_div.append(fechaParrafo);
            cita_div.append(horaParrafo);
            cita_div.append(sintomasParrafo);
            cita_div.append(btnEliminar);
            cita_div.append(btnEditar);



            //agregar citas al html
            citasContainer_ul.append(cita_div);
        });
    }
    resetHtmlCitas() {
        while (citasContainer_ul.firstChild) {
            citasContainer_ul.firstChild.remove();
        }
    }
}

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


//Regitrar eventos
eventListeners();
function eventListeners() {
    document.addEventListener("DOMContentLoaded", cargarCitas);

    form.addEventListener("submit", agregarCita);

    mascota_input.addEventListener("change", fillCitaObj);
    propietario_input.addEventListener("change", fillCitaObj);
    telefono_input.addEventListener("change", fillCitaObj);
    fecha_input.addEventListener("change", fillCitaObj);
    hora_input.addEventListener("change", fillCitaObj);
    sintomas_input.addEventListener("change", fillCitaObj);
}

//funciones
function cargarCitas() {
    console.log("cagando citas");
}


function fillCitaObj(e: Event) {
    const element = e.target as HTMLInputElement;
    citaObj[element.name] = element.value;
}


function agregarCita(e: Event) {
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

function eliminaCita(id: number) {
    citas.removeCita(id);
    ui.showCitas(citas.citas);
}

function editarCita(cita: Cita) {
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


