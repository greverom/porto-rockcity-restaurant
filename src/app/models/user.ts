import { UserRole } from "./register&login";

export interface User {
    id: string;                 
    nombres: string;            
    apellidos: string;          
    cedula: string;             
    rol: UserRole;              
    usuario: string;            
    email: string;              
    fechaCreacion: Date;        
    activo: boolean;           
  }