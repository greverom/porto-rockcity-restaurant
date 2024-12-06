import { Injectable } from '@angular/core';
import { Database, ref, set, update, remove, push, get } from '@angular/fire/database';
import { MesaEstado, MesaModel } from '../../models/mesa';


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

  // Actualizar una mesa existente
  async updateMesa(id: string, mesa: Partial<MesaModel>): Promise<void> {
    const mesaRef = ref(this.db, `mesas/${id}`);
    await update(mesaRef, {
      ...mesa,
      fechaUltimaActualizacion: new Date(),
    });
  }

  // Eliminar una mesa
  async deleteMesa(id: string): Promise<void> {
    const mesaRef = ref(this.db, `mesas/${id}`);
    await remove(mesaRef);
  }
}