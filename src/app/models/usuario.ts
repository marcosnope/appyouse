import { Direccion } from './direccion';
import { Compania } from './compania';
export class Usuario {
    id: number;
    name: string;
    username: string;
    email: string;
    address: Direccion;
    phone: string;
    website: string;
    company: Compania;
    constructor() {
        this.id = null;
    }
}
