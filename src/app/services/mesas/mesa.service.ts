import { Injectable } from '@angular/core';
import { Database, ref, set, update, remove, push, get, DatabaseReference } from '@angular/fire/database';
import { AlimentoMesaModel, MesaEstado, MesaModel, ReservaModel } from '../../models/mesa';
import { AlimentoModel } from '../../models/food';


@Injectable({
  providedIn: 'root',
})
export class MesaService {
  constructor(private db: Database) {}

  // Crear una nueva mesa
  async createMesa(mesa: Omit<MesaModel, 'id' | 'fechaUltimaActualizacion'>): Promise<void> {
    const mesasRef = ref(this.db, 'mesas');
    const newMesaRef = push(mesasRef);

    const mesaData: MesaModel = {
      ...mesa,
      id: newMesaRef.key || '',
      estado: MesaEstado.DISPONIBLE, 
      alimentos: [],
      pagos: [],
      total: 0,
      fechaUltimaActualizacion: new Date(),
      reservaId: undefined,
      meseroId: undefined,
    };

    await set(newMesaRef, mesaData);
  }

  // Obtener todas las mesas
  async getMesas(): Promise<MesaModel[]> {
    const snapshot = await get(ref(this.db, 'mesas'));
    if (snapshot.exists()) {
      return Object.values(snapshot.val()) as MesaModel[];
    }
    return [];
  }

  //Seleccionar mesa por su Id
  async getMesaById(id: string): Promise<MesaModel | null> {
    try {
      const snapshot = await get(ref(this.db, `mesas/${id}`));
      if (snapshot.exists()) {
        return snapshot.val() as MesaModel;
      } else {
        console.warn(`No se encontró una mesa con el id: ${id}`);
        return null;
      }
    } catch (error) {
      console.error('Error al obtener la mesa:', error);
      return null;
    }
  }

  // Actualizar una mesa existente
  async updateMesa(id: string, mesa: Partial<MesaModel>): Promise<void> {
    const mesaRef = ref(this.db, `mesas/${id}`);
    await update(mesaRef, {
      ...mesa,
      fechaUltimaActualizacion: new Date(),
    });
  }

    // Crear una nueva reserva
    async createReserva(reserva: Omit<ReservaModel, 'id' | 'fechaCreacion'>): Promise<DatabaseReference> {
      const reservaRef = ref(this.db, 'reservas');
      const newReservaRef = push(reservaRef);
    
      const reservaData: ReservaModel = {
        ...reserva,
        id: newReservaRef.key || '',
        fechaReserva: (reserva.fechaReserva as Date).toISOString(), // Convertir Date a string
        fechaCreacion: new Date().toISOString(), // Convertir a string
      };
    
      await set(newReservaRef, reservaData);
      return newReservaRef;
    }

 // Obtener una reserva por su ID
async getReservaById(reservaId: string): Promise<ReservaModel | null> {
  try {
    const reservaRef = ref(this.db, `reservas/${reservaId}`);
    const snapshot = await get(reservaRef);

    if (snapshot.exists()) {
      const reserva = snapshot.val() as ReservaModel;

      // Convertir las fechas de string a Date si existen
      return {
        ...reserva,
        fechaReserva: reserva.fechaReserva ? new Date(reserva.fechaReserva as string) : null,
        fechaCreacion: reserva.fechaCreacion ? new Date(reserva.fechaCreacion as string) : null,
      };
    }

    return null;
  } catch (error) {
    console.error('Error al obtener la reserva:', error);
    return null;
  }
}

    //Eliminar reserva de mesa
    async deleteReserva(reservaId: string): Promise<void> {
      try {
        const reservaRef = ref(this.db, `reservas/${reservaId}`);
        await remove(reservaRef);
        //console.log('Reserva eliminada exitosamente.');
      } catch (error) {
        console.error('Error al eliminar la reserva:', error);
        throw new Error('No se pudo eliminar la reserva.');
      }
    }

  // Eliminar una mesa
  async deleteMesa(id: string): Promise<void> {
    const mesaRef = ref(this.db, `mesas/${id}`);
    await remove(mesaRef);
  }

  //obtener empleado por su id
  async getEmpleadoById(id: string): Promise<{ nombres: string; apellidos: string } | null> {
    try {
      const empleadoRef = ref(this.db, `usuarios/empleados/${id}`);
      const snapshot = await get(empleadoRef);
      if (snapshot.exists()) {
        const empleado = snapshot.val();
        return {
          nombres: empleado.nombres,
          apellidos: empleado.apellidos,
        };
      }
      return null;
    } catch (error) {
      console.error('Error al obtener los datos del empleado:', error);
      return null;
    }
  }
  
//Obtener mesas por id del mesero
async getMesasPorMeseroId(meseroId: string): Promise<MesaModel[]> {
  try {
    const snapshot = await get(ref(this.db, 'mesas'));
    if (snapshot.exists()) {
      const mesas = Object.values(snapshot.val()) as MesaModel[];
      return mesas.filter((mesa) => mesa.meseroId === meseroId && mesa.estado === MesaEstado.OCUPADA);
    }
    return [];
  } catch (error) {
    console.error('Error al obtener las mesas asignadas:', error);
    throw new Error('No se pudieron cargar las mesas asignadas.');
  }
}

async buscarAlimentosPorNombre(query: string): Promise<AlimentoModel[]> {
  if (!query.trim()) {
    return []; 
  }

  const alimentosRef = ref(this.db, 'alimentos');
  const snapshot = await get(alimentosRef);

  if (!snapshot.exists()) {
    return []; 
  }

  const alimentos = snapshot.val();
  const resultados: AlimentoModel[] = [];

  const procesarNodo = (nodo: any): void => {
    if (typeof nodo === 'object' && nodo !== null) {
      Object.entries(nodo).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          const item = value as Record<string, any>;

          if (item['nombre'] && typeof item['nombre'] === 'string' && item['nombre'].toLowerCase().includes(query.toLowerCase())) {
            resultados.push(item as AlimentoModel); 
          } else {
            procesarNodo(item); 
          }
        }
      });
    }
  };

  procesarNodo(alimentos); 

  return resultados;
}

async actualizarMesaDespuesDePago(mesaId: string, alimentosRestantes: AlimentoMesaModel[]): Promise<void> {
  try {
    const mesaRef = ref(this.db, `mesas/${mesaId}`);
    let nuevaCapacidad = 4; 
    let nuevoEstado = MesaEstado.DISPONIBLE;
    const actualizacion: Partial<MesaModel> = {
      alimentos: alimentosRestantes,
      estado: nuevoEstado,
      capacidad: nuevaCapacidad,
      total: alimentosRestantes.reduce((total, alimento) => total + alimento.subtotal, 0),
      fechaUltimaActualizacion: new Date(),
    };

    if (alimentosRestantes.length > 0) {
      actualizacion.estado = MesaEstado.OCUPADA;
      actualizacion.capacidad = alimentosRestantes.reduce((total, alimento) => total + alimento.cantidad, 0);
    } else {
      actualizacion.meseroId = null;
    }

    await update(mesaRef, actualizacion);
  } catch (error) {
    console.error('Error al actualizar la mesa después del pago:', error);
    throw new Error('No se pudo actualizar la mesa después del pago.');
  }
}

}