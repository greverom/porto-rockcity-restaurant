import { UserRole } from "./register&login";

export interface User {
    id: string;                  // Identificador único del usuario
    nombres: string;             // Nombres del usuario
    apellidos: string;           // Apellidos del usuario
    cedula: string;              // Identificación del usuario
    rol: UserRole;               // Rol del usuario en el sistema
    usuario: string;             // Nombre de usuario único
    email: string;               // Correo electrónico
    fechaCreacion: Date;         // Fecha de creación de la cuenta
    activo: boolean;             // Estado del usuario (activo/inactivo)
  }