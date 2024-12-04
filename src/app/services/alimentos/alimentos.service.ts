import { Injectable } from '@angular/core';
import { Database, ref, set, update, remove, get, push } from '@angular/fire/database';
import { AlimentoModel } from '../../models/food';


@Injectable({
  providedIn: 'root',
})
export class AlimentosService {
  constructor(private db: Database) {}

  // Agregar un nuevo alimento
  async createAlimento(alimento: Omit<AlimentoModel, 'id'>): Promise<void> {
    const alimentosRef = ref(this.db, `alimentos/${alimento.categoria}`);
    const newAlimentoRef = push(alimentosRef);

    const alimentoData: AlimentoModel = {
      ...alimento,
      id: newAlimentoRef.key || '',
      fechaCreacion: alimento.fechaCreacion || new Date(),
      fechaActualizacion: alimento.fechaActualizacion || new Date(),
    };

    await set(newAlimentoRef, alimentoData);
  }

  // Obtener alimentos de una categoría específica
  async obtenerAlimentosPorCategoria(categoria: string): Promise<AlimentoModel[]> {
    const categoriaRef = ref(this.db, `alimentos/${categoria}`);
    const snapshot = await get(categoriaRef);
  
    if (!snapshot.exists()) {
      return [];
    }
  
    const alimentos = snapshot.val();
    return Object.keys(alimentos).map((id) => ({
      ...alimentos[id],
      id, 
    }));
  }

  // Obtener todos los alimentos
  async obtenerAlimentos(): Promise<AlimentoModel[]> {
    const alimentosRef = ref(this.db, `alimentos`);
    const snapshot = await get(alimentosRef);

    if (!snapshot.exists()) {
      return [];
    }
    const alimentos = snapshot.val();
    const alimentosArray: AlimentoModel[] = [];

    for (const categoria in alimentos) {
      for (const id in alimentos[categoria]) {
        alimentosArray.push({ ...alimentos[categoria][id], id });
      }
    }
    return alimentosArray;
  }

  // Editar un alimento
  async editarAlimento(alimento: AlimentoModel): Promise<void> {
    const alimentoRef = ref(this.db, `alimentos/${alimento.categoria}/${alimento.id}`);
    const alimentoData = {
      ...alimento,
      fechaActualizacion: new Date().toISOString(),
    };
    await update(alimentoRef, alimentoData);
  }

  // Eliminar un alimento
  async eliminarAlimento(categoria: string, id: string): Promise<void> {
    const alimentoRef = ref(this.db, `alimentos/${categoria}/${id}`);
    await remove(alimentoRef);
  }

  // Cambiar disponibilidad
  async cambiarDisponibilidad(categoria: string, id: string, disponible: boolean): Promise<void> {
    const alimentoRef = ref(this.db, `alimentos/${categoria}/${id}`);
    await update(alimentoRef, { activo: disponible });
  }
}