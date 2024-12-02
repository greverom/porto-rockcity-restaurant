import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, map, Observable } from 'rxjs';
import { selectUserData } from '../../store/user/user.selectors';
import { unsetUserData } from '../../store/user/user.actions';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../modal/modal.component';
import { ModalDto, modalInitializer } from '../modal/modal.dto';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
      CommonModule,
      RouterModule,
      ModalComponent
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  userMenu: { label: string; path: string }[] = []; 
  userRole$: Observable<string | null>; 
  modal: ModalDto = modalInitializer();

  constructor(private router: Router, private store: Store) {
    this.userRole$ = this.store.select(selectUserData).pipe(
      map((data) => data?.rol || null),
      distinctUntilChanged() 
    );
  }

  ngOnInit(): void {
    this.userRole$.subscribe((role) => {
      console.log('Generando menú para el rol:', role);
      this.generateMenu(role); 
    });
  }

  generateMenu(role: string | null): void {
    if (!role) {
      this.userMenu = []; 
      return;
    }

    const normalizedRole = role.toUpperCase();

    this.userMenu = [];

    switch (normalizedRole) {
      case 'ADMINISTRADORES':
        this.userMenu = [
          { label: 'Gestión de Alimentos', path: '/gestion-alimentos' },
          { label: 'Gestión de Usuarios', path: '/gestion-usuarios' },
        ];
        break;

      case 'EMPLEADOS':
        this.userMenu = [
          { label: 'Facturación', path: '/facturacion' },
          { label: 'Gestión de Mesas', path: '/gestion-mesas' },
          { label: 'Gestión de Pedidos', path: '/gestion-pedidos' },
          { label: 'Reservas', path: '/reservas' },
        ];
        break;

      case 'COCINEROS':
        this.userMenu = [{ label: 'Pedidos Cocina', path: '/pedidos-cocina' }];
        break;

      default:
        this.userMenu = []; 
    }
  }

  openLogoutModal(): void {
    this.modal = {
      ...modalInitializer(),
      show: true,
      message: '¿Estás seguro de que deseas cerrar sesión?',
      isConfirm: true, 
      isError: false,  
      isSuccess: false 
    };
  }

  closeLogoutModal(): void {
    this.modal = {
      ...this.modal,
      show: false,
    };
  }

  logout(): void {
    this.store.dispatch(unsetUserData());
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
    this.closeLogoutModal();
  }
}
