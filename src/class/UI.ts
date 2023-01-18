import { Cita } from "./Citas.js";
import { editarCita, eliminaCita } from "../funciones.js";
import { citasContainer_ul } from "../selectores.js";

type TipoError = "error" | "success";

export class UI {

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
