export interface Cita {
    [key: string]: unknown;//si no agregamos esto no podromos acceder a las propiedades del objeto de esta forma citaObj[algun_string], ya que como no sabe el string que viene nos dira que no esta entre las keys del objeto
    id: number;
    mascota: string;
    propietario: string;
    telefono: string;
    fecha: string;
    hora: string;
    sintomas: string;
}


export class Citas {
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
