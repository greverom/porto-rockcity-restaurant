import { Injectable } from '@angular/core';
import { Database, ref, get, update, remove } from '@angular/fire/database';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  constructor(private db: Database) {}

  getCocineros(): Observable<any[]> {
    const cocinerosRef = ref(this.db, 'usuarios/cocineros');
    return from(get(cocinerosRef)).pipe(
      map((snapshot) => {
        if (snapshot.exists()) {
          const cocinerosObj = snapshot.val();
          return Object.keys(cocinerosObj).map((key) => ({
            id: key,
            ...cocinerosObj[key],
          }));
        }
        return [];
      })
    );
  }

  // Método para obtener empleados
  getEmpleados(): Observable<any[]> {
    const empleadosRef = ref(this.db, 'usuarios/empleados');
    return from(get(empleadosRef)).pipe(
      map((snapshot) => {
        if (snapshot.exists()) {
          const empleadosObj = snapshot.val();
          return Object.keys(empleadosObj).map((key) => ({
            id: key,
            ...empleadosObj[key],
          }));
        }
        return [];
      })
    );
  }

  getEmpleadoById(role: string, id: string): Observable<any> {
    const empleadoRef = ref(this.db, `usuarios/${role}/${id}`);
    return from(get(empleadoRef)).pipe(
      map((snapshot) => {
        if (snapshot.exists()) {
          return snapshot.val();
        }
        return null; 
      })
    );
  }

  updateUsuario(role: string, id: string, updatedData: any): Promise<void> {
    const userRef = ref(this.db, `usuarios/${role}/${id}`);
    return update(userRef, updatedData)
      .then(() => {
        //console.log(`Usuario con ID ${id} actualizado correctamente.`);
      })
      .catch((error) => {
        console.error(`Error al actualizar el usuario: ${error}`);
        throw error;
      });
  }

  deleteUsuario(role: string, id: string): Promise<void> {
    const userRef = ref(this.db, `usuarios/${role}/${id}`);
    return remove(userRef)
      .then(() => {
        //console.log(`Usuario con ID ${id} eliminado correctamente.`);
      })
      .catch((error) => {
        console.error(`Error al eliminar el usuario: ${error}`);
        throw error;
      });
  }
}