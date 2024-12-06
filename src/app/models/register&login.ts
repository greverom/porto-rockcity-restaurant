export interface Register {
  nombres: string;         
  apellidos: string;       
  cedula: string;          
  rol: UserRole;  
  usuario: string;            
  email: string;           
  password: string;        
  confirmPassword: string; 
  fechaCreacion: string;
  activo: boolean;
}

export enum UserRole {
  empleado = 'EMPLEADOS',
  administrador = 'ADMINISTRADORES',
  cocinero = 'COCINEROS'
}


export interface Login {
  email: string;     
  password: string;  
}