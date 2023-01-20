import { ICita } from "./ICitas.js";

export class IndexDB {
    private dbName: string;
    private schema: ICita;
    private version: number;

    private DB = {};

    private callback: () => void;

    constructor(dbName: string, schema: ICita, version: number, callback: () => void) {
        this.dbName = dbName;
        this.schema = schema;
        this.version = version;
        this.callback = callback;

        this.dbInit();
    }

    dbInit() {
        const crearDB = window.indexedDB.open(this.dbName, 1);
        //definir schema
        crearDB.onupgradeneeded = (e) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            const db = e.target.result as IDBDatabase;//seleccionamos ela base de datos

            //Creamos la tabla
            const objectStore = db.createObjectStore(this.dbName, {
                keyPath: "id",
                autoIncrement: true
            });

            // creamos las columnas basados en el objeto que le pasamos como shema
            for (const element in this.schema) {
                if (element === "id") {
                    objectStore.createIndex(element, element, { unique: true });
                    continue;
                }
                objectStore.createIndex(element, element, { unique: false });
            }
        };


        crearDB.onsuccess = () => {
            console.log("Se pudo acceder a la base de datos");
            this.DB = crearDB.result;
            this.callback();
        };


        crearDB.onerror = () => console.log("Ha ocurrido un Error!");
    }

    addCita(cita: ICita): Promise<ICita[]> {
        return new Promise((resolve) => {
            const transaction = (this.DB as IDBDatabase).transaction([this.dbName], "readwrite");
            const objectStore = transaction.objectStore(this.dbName);
            objectStore.add(cita);

            transaction.oncomplete = () => {
                console.log("se agrego correctamente la cita");
                resolve(
                    this.loadCitas().then((citas) => citas));
            };
        });
    }

    loadCitas(): Promise<ICita[]> {
        return new Promise((resolve) => {
            const citas: ICita[] = [];
            const transaction = (this.DB as IDBDatabase).transaction([this.dbName]);
            const objectStore = transaction.objectStore(this.dbName);
            objectStore.openCursor().onsuccess = (e) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                const cursor = e.target.result;
                if (cursor) {
                    citas.push(cursor.value);
                    cursor.continue();//siguiente elemento de la tabla
                } else {//esto se ejecuta cuado ya termina de recorrer todos lo elementos de la base de datos ya que al ejecutar continue y no hay elementos, cursor estara vacio
                    resolve(citas);
                }
            };
        });
    }

    editCita(cita: ICita): Promise<ICita[]> {
        return new Promise((resolve) => {
            const transaction = (this.DB as IDBDatabase).transaction([this.dbName], "readwrite");
            const objectStore = transaction.objectStore(this.dbName);
            objectStore.put(cita);

            transaction.oncomplete = () => {
                console.log("Se edito correctamente la cita");
                resolve(
                    this.loadCitas().then((citas) => citas));
            };
        });
    }

    removeCita(id: number): Promise<ICita[]> {
        return new Promise((resolve) => {
            const transaction = (this.DB as IDBDatabase).transaction([this.dbName], "readwrite");
            const objectStore = transaction.objectStore(this.dbName);
            objectStore.delete(id);

            transaction.oncomplete = () => {
                console.log("Se elimino correctamente la cita");
                resolve(this.loadCitas().then((citas) => citas));
            };
        });

    }
}
