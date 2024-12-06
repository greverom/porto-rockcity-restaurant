import { Injectable } from '@angular/core';
import { Database, ref, set, update, remove, push, get } from '@angular/fire/database';
import { MesaEstado, MesaModel, ReservaModel } from '../../models/mesa';


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
    async createReserva(reserva: Omit<ReservaModel, 'id' | 'fechaCreacion'>): Promise<void> {
      const reservaRef = ref(this.db, 'reservas');
      const newReservaRef = push(reservaRef); 
  
      const reservaData: ReservaModel = {
        ...reserva,
        id: newReservaRef.key || '', 
        fechaCreacion: new Date(),  
      };
  
      await set(newReservaRef, reservaData); 
    }

  // Eliminar una mesa
  async deleteMesa(id: string): Promise<void> {
    const mesaRef = ref(this.db, `mesas/${id}`);
    await remove(mesaRef);
  }
}