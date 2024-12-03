import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Database, get, ref, set } from '@angular/fire/database';
import { Store } from '@ngrx/store';
import { Register, UserRole } from '../../models/register&login';
import { setLoggedInStatus, setUserData, unsetUserData } from '../../store/user/user.actions';
import { hideSpinner, showSpinner } from '../../store/spinner/spinner.actions';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private auth: Auth,
    private db: Database,
    private store: Store,
    private router: Router
  ) {}

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

// Método de registro de usuario
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
      await this.auth.signOut();
   
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      throw error; 
    } finally {
      this.store.dispatch(hideSpinner()); 
    }
  }
  
  
  async login(email: string, password: string): Promise<void> {
    try {
      this.store.dispatch(showSpinner());
  
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const uid = userCredential.user.uid;
  
      const usersRef = ref(this.db, `usuarios`);
      const snapshot = await get(usersRef);
  
      if (!snapshot.exists()) {
        throw new Error('Usuario no encontrado en la base de datos.');
      }
  
      const roles = snapshot.val();
      let userRole: UserRole | null = null;
      let userData = null;
  
      for (const role in roles) {
        if (roles[role]?.[uid]) {
          userRole = role.toUpperCase() as UserRole; 
          userData = roles[role][uid];
          break;
        }
      }
  
      if (!userRole || !userData) {
        throw new Error('Usuario o rol no encontrados.');
      }
  
      const fullUserData = {
        id: uid,
        nombres: userData.nombres || '',
        apellidos: userData.apellidos || '',
        cedula: userData.cedula || '',
        usuario: userData.usuario || '',
        email: userData.email || '',
        rol: userRole, 
        fechaCreacion: userData.fechaCreacion ? new Date(userData.fechaCreacion) : new Date(),
        activo: userData.activo ?? true,
      };
  
      this.store.dispatch(setUserData({ data: fullUserData }));
      this.store.dispatch(setLoggedInStatus({ isLoggedIn: true }));
  
      const token = await userCredential.user.getIdToken();
      localStorage.setItem('authToken', token);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    } finally {
      this.store.dispatch(hideSpinner());
    }
  }

  async restoreSession(): Promise<void> {
    const token = localStorage.getItem('authToken'); // Obtén el token desde el localStorage
  
    if (!token) {
      console.warn('No hay token en el localStorage.');
      return;
    }
  
    onAuthStateChanged(this.auth, async (user) => {
      if (!user) {
        console.warn('El usuario no está autenticado en Firebase.');
        return;
      }
  
      try {
        const uid = user.uid;
        const usersRef = ref(this.db, `usuarios`);
        const snapshot = await get(usersRef);
  
        if (!snapshot.exists()) {
          console.error('No se encontraron datos de usuario en la base de datos.');
          return;
        }
  
        const roles = snapshot.val();
        let userRole: UserRole | null = null;
        let userData = null;
  
        for (const role in roles) {
          if (roles[role]?.[uid]) {
            userRole = role.toUpperCase() as UserRole;
            userData = roles[role][uid];
            break;
          }
        }
  
        if (!userRole || !userData) {
          throw new Error('Usuario o rol no encontrados.');
        }
  
        const fullUserData = {
          id: uid,
          nombres: userData.nombres || '',
          apellidos: userData.apellidos || '',
          cedula: userData.cedula || '',
          usuario: userData.usuario || '',
          email: userData.email || '',
          rol: userRole,
          fechaCreacion: userData.fechaCreacion ? new Date(userData.fechaCreacion) : new Date(),
          activo: userData.activo ?? true,
        };
  
        // Despacha los datos al Store
        this.store.dispatch(setUserData({ data: fullUserData }));
        this.store.dispatch(setLoggedInStatus({ isLoggedIn: true }));
      } catch (error) {
        console.error('Error al restaurar la sesión:', error);
      }
    });
  }

  logout(): void {
    this.store.dispatch(unsetUserData());
    this.auth.signOut().then(() => {
      console.log('Sesión cerrada correctamente.');
      localStorage.removeItem('authToken');
      this.router.navigate(['/login']);
    }).catch((error) => {
      console.error('Error al cerrar sesión:', error);
    });
  }
}