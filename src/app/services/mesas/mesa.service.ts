import { Injectable } from '@angular/core';
import { Database, ref, set, update, remove, push, get, DatabaseReference } from '@angular/fire/database';
import { MesaEstado, MesaModel, ReservaModel } from '../../models/mesa';
import { from, map, Observable } from 'rxjs';


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
}