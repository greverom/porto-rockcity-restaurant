export interface Register {
  nombres: string;         
  apellidos: string;       
  cedula: string;          
  rol: UserRole;  
  usuario: string;            
  email: string;           
  password: string;        
  confirmPassword: string; 
}

export enum UserRole {
  empleado = 'EMP',          
  administrador = 'ADMIN',      
  cocinero = 'COCINERO'  
}


export interface Login {
  email: string;     
  password: string;  
}