export interface AlimentoModel {
    id: string;             
    nombre: string;         
    descripcion: string;    
    categoria: string;      
    precio: number;         
    imagen: string;         
    activo: boolean;  
    cantidadRestante: number;      
    fechaCreacion?: Date;    
    fechaActualizacion?: Date;
  }