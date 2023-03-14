export interface BuscarGuardiaI {
    id: number;
    ci: string;
    nombre: string;
    apellido: string;
    correo: string;
    clave?: string;
    empresa: string;
    estado?: string;
    fecha_inicio?: string;
    fecha_fin?: string;
}