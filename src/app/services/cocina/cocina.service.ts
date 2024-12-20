import { Injectable } from '@angular/core';
import { Database, ref, get, update } from '@angular/fire/database';
import { MesaModel } from '../../models/mesa';
import { PedidoParaLlevarModel } from '../../models/para-llevar';

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
          const alimentosRef = ref(this.db, `mesas/${mesaId}/alimentos`);
          const snapshot = await get(alimentosRef);
      
          if (snapshot.exists()) {
            const alimentos = snapshot.val(); 
            const index = Object.keys(alimentos).find(
              (key) => alimentos[key].alimentoId === alimentoId
            );
      
            if (index !== undefined) {
              const alimentoRef = ref(this.db, `mesas/${mesaId}/alimentos/${index}`);
              await update(alimentoRef, { listo });
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

      async obtenerPedidosConAlimentos(): Promise<PedidoParaLlevarModel[]> {
        try {
          const paraLlevarRef = ref(this.db, 'para-llevar');
          const snapshot = await get(paraLlevarRef);
    
          if (!snapshot.exists()) {
            //console.warn('No se encontraron pedidos para llevar.');
            return [];
          }
          const pedidos = Object.values(snapshot.val()) as PedidoParaLlevarModel[];
          // Filtrar pedidos que tengan alimentos
          return pedidos.filter(pedido => pedido.alimentos && pedido.alimentos.length > 0);
        } catch (error) {
          console.error('Error al obtener pedidos con alimentos:', error);
          throw error;
        }
      }

      async updateAlimentoEstadoParaLlevar( pedidoId: string, alimentoIndex: number, listo: boolean): Promise<void> {
        try {
          const alimentoRef = ref(this.db, `para-llevar/${pedidoId}/alimentos/${alimentoIndex}`);
          await update(alimentoRef, { listo });
          //console.log(`alimento en pedido ${pedidoId} actualizado a ${listo}.`);
        } catch (error) {
          console.error('Error al actualizar el estado del alimento para llevar:', error);
          throw new Error('No se pudo actualizar el estado del alimento para llevar.');
        }
      }
}