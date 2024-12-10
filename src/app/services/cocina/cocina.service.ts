import { Injectable } from '@angular/core';
import { Database, ref, get } from '@angular/fire/database';
import { MesaModel } from '../../models/mesa';

@Injectable({
  providedIn: 'root',
})
export class MesaService {
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
}