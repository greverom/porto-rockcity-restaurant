import { Injectable } from '@angular/core';
import { Database, ref, get } from '@angular/fire/database';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  constructor(private db: Database) {}

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
}