import { Injectable } from '@angular/core';
import { Database, ref, get, update } from '@angular/fire/database';
import { MesaModel } from '../../models/mesa';

@Injectable({
  providedIn: 'root',
})
export class CocinaService {
  constructor(private db: Database) {}

  async getMesasConPedidos(): Promise<MesaModel[]> {
    try {
      const snapshot = await get(ref(this.db, 'mesas'));
      if (!snapshot.exists()) {
        return []; 
      }

      const mesas = Object.values(snapshot.val()) as MesaModel[];
      // Filtrar mesas que tienen alimentos en su lista
      const mesasConPedidos = mesas.filter((mesa) => mesa.alimentos && mesa.alimentos.length > 0);

      return mesasConPedidos;
    } catch (error) {
      console.error('Error al obtener mesas con pedidos:', error);
      throw new Error('No se pudieron cargar las mesas con pedidos.');
    }
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

      // Actualizar un alimento dentro de una mesa
      async updateAlimentoEstado(mesaId: string, alimentoId: string, listo: boolean): Promise<void> {
        try {
          // Referencia a los alimentos dentro de la mesa
          const alimentosRef = ref(this.db, `mesas/${mesaId}/alimentos`);
          const snapshot = await get(alimentosRef);
      
          if (snapshot.exists()) {
            const alimentos = snapshot.val(); // Alimentos dentro de la mesa
            const index = Object.keys(alimentos).find(
              (key) => alimentos[key].alimentoId === alimentoId
            );
      
            if (index !== undefined) {
              // Actualiza el estado del alimento
              const alimentoRef = ref(this.db, `mesas/${mesaId}/alimentos/${index}`);
              await update(alimentoRef, { listo });
              console.log(`Estado del alimento con ID ${alimentoId} actualizado a ${listo}`);
            } else {
              console.error(`No se encontró el alimento con ID ${alimentoId} en la mesa ${mesaId}`);
            }
          } else {
            console.error(`No se encontró la mesa con ID ${mesaId}`);
          }
        } catch (error) {
          console.error('Error al actualizar el estado del alimento:', error);
          throw new Error('No se pudo actualizar el estado del alimento.');
        }
      }
}