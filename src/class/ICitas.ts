export interface ICita {
    [key: string]: unknown;//si no agregamos esto no podromos acceder a las propiedades del objeto de esta forma citaObj[algun_string], ya que como no sabe el string que viene nos dira que no esta entre las keys del objeto
    id: number;
    mascota: string;
    propietario: string;
    telefono: string;
    fecha: string;
    hora: string;
    sintomas: string;
}
