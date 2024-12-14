
export interface PedidoParaLlevarModel {
  id: string;                    
  esParaLlevar: boolean;                                    
  meseroId: string | null; 
  clienteNombre: string;          
  alimentos: AlimentoPedidoModel[];
  costoAdicional?: number; 
  total: number;                 
  pago?: PagoModel;        
  fechaUltimaActualizacion: Date;
  }

export interface AlimentoPedidoModel {
  alimentoId: string;          
  nombre: string;              
  cantidad: number;            
  precioUnitario: number;      
  subtotal: number;               
  activo?: boolean;  
  listo:boolean;                
}

export interface PagoModel {
  clienteId: string; 
  nombreCliente: string;  
  correo?: string;      
  subtotal: number;               
  formaPago: FormaPago;       
  fecha: Date; 
  meseroId?: string;  
  descripcionAlimentos: AlimentoPedidoModel[]; 
  montoRecibido: number;      
  vuelto: number;            
}

export enum FormaPago {
  EFECTIVO = 'EFECTIVO',
  TARJETA = 'TARJETA',
  TRANSFERENCIA = 'TRANSFERENCIA'
  }


