import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Database, ref, set } from '@angular/fire/database';
import { Store } from '@ngrx/store';
import { Register, UserRole } from '../../models/register&login';
import { setUserData } from '../../store/user/user.actions';
import { hideSpinner, showSpinner } from '../../store/spinner/spinner.actions';


@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(
    private auth: Auth,
    private db: Database,
    private store: Store
  ) {}

  async register(user: Register): Promise<void> {
    try {
      this.store.dispatch(showSpinner()); // Mostrar spinner al iniciar
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        user.email,
        user.password
      );
  
      const uid = userCredential.user.uid;
      const rolePath = this.getRolePath(user.rol);
      const userRef = ref(this.db, `usuarios/${rolePath}/${uid}`);
  
      const userData: {
        id: string;
        nombres: string;
        apellidos: string;
        cedula: string;
        usuario: string;
        email: string;
        rol: UserRole;
        fechaCreacion: Date;
        activo: boolean;
      } = {
        id: uid,
        nombres: user.nombres,
        apellidos: user.apellidos,
        cedula: user.cedula,
        usuario: user.usuario || `${user.nombres}.${user.apellidos}`.toLowerCase().replace(/\s+/g, ''),
        email: user.email,
        rol: user.rol,
        fechaCreacion: new Date(),
        activo: true,
      };
  

      const missingFields = Object.entries(userData).filter(([key, value]) => value === undefined);
      if (missingFields.length > 0) {
        console.error(`Los siguientes campos tienen valores 'undefined':`, missingFields.map(([key]) => key));
        throw new Error(`Campos inválidos: ${missingFields.map(([key]) => key).join(', ')}`);
      }
  
      await set(userRef, userData);
  
      this.store.dispatch(setUserData({ data: userData })); 
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      throw error; 
    } finally {
      this.store.dispatch(hideSpinner()); 
    }
  }
  
  private getRolePath(role: UserRole): string {
    switch (role) {
      case UserRole.administrador:
        return 'administradores';
      case UserRole.empleado:
        return 'empleados';
      case UserRole.cocinero:
        return 'cocineros';
      default:
        throw new Error('Rol inválido');
    }
  }
}