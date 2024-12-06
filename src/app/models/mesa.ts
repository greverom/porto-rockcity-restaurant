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
    meseroId?: string;
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
  }
  
  export interface PagoMesaModel {
    clienteId?: string;         
    monto: number;              
    formaPago: FormaPago;       
    fecha: Date;                
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
    fechaReserva: Date;       
    estado: ReservaEstado;    
    fechaCreacion: Date;      
  }
  
  export enum ReservaEstado {
    CONFIRMADA = 'CONFIRMADA', 
    CANCELADA = 'CANCELADA'    
  }