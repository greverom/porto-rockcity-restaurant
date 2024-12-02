export interface PedidoModel {
    id: string;                     
    cliente: ClienteModel;          
    alimentos: AlimentoPedidoModel[];
    estado: PedidoEstado;           
    total: number;                  
    direccionEntrega: string;       
    repartidorId?: string;          
    tiempoEstimadoEntrega?: Date;   
    fechaCreacion: Date;            
    fechaEntrega?: Date;            
  }
  export interface ClienteModel {
    id: string;   
    cedula: string;                  
    nombre: string;                 
    telefono: string;               
  }

  export interface AlimentoPedidoModel {
    alimentoId: string;             
    nombre: string;                 
    cantidad: number;               
    precioUnitario: number;         
    subtotal: number;               
  }

  export enum PedidoEstado {
    NUEVO = 'NUEVO',               
    EN_PREPARACION = 'EN_PREPARACION',
    EN_CAMINO = 'EN_CAMINO',       
    ENTREGADO = 'ENTREGADO',       
    CANCELADO = 'CANCELADO'        
  }