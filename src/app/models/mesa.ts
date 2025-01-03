export interface MesaModel {
    id: string;                    
    numero: number;                
    capacidad: number;              
    estado: MesaEstado;          
    alimentos: AlimentoMesaModel[]; 
    pagos: PagoMesaModel[];        
    total: number;                 
    fechaUltimaActualizacion: Date;
    reservaId?: string | null;  
    meseroId?: string | null;
  }
  
  export enum MesaEstado {
    DISPONIBLE = 'DISPONIBLE',  
    OCUPADA = 'OCUPADA',       
    RESERVADA = 'RESERVADA'    
  }
  
  export interface AlimentoMesaModel {
    alimentoId: string;          
    nombre: string;              
    cantidad: number;            
    precioUnitario: number;      
    subtotal: number;            
    clienteId?: string;  
    seleccionado?: boolean;  
    activo?: boolean;  
    listo:boolean;    
  }
  
  export interface PagoMesaModel {
    clienteId: string; 
    nombreCliente: string;  
    correo?: string;      
    monto: number;              
    formaPago: FormaPago;       
    fecha: Date; 
    meseroId?: string;  
    descripcionAlimentos: AlimentoMesaModel[];             
  }
  
  export enum FormaPago {
    EFECTIVO = 'EFECTIVO',
    TARJETA = 'TARJETA',
    TRANSFERENCIA = 'TRANSFERENCIA'
  }

  export interface ReservaModel {
    id: string;              
    mesaId: string;           
    clienteNombre: string;    
    numeroPersonas: number;   
    fechaReserva: string | Date | null;   
    meseroNombre?: string;  
    estado: ReservaEstado;    
    fechaCreacion: string | Date | null;
    mesaNumero?: number;
  }
  
  export enum ReservaEstado {
    CONFIRMADA = 'CONFIRMADA', 
    CANCELADA = 'CANCELADA'    
  }