import { Component, HostBinding, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, map, Observable } from 'rxjs';
import { selectUserData } from '../../store/user/user.selectors';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../modal/modal.component';
import { ModalDto, modalInitializer } from '../modal/modal.dto';
import { AuthService } from '../../services/authentication/auth.service';


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
  userRole$: Observable<string | null>; 
  modal: ModalDto = modalInitializer();
  currentRole: string | null = null;
  isSidebarOpen = false;

  constructor(private router: Router, 
              private store: Store, 
              private authService: AuthService) {
    this.userRole$ = this.store.select(selectUserData).pipe(
      map((data) => data?.rol || null),
      distinctUntilChanged() 
    );
  }

  ngOnInit(): void {
    this.userRole$.subscribe((role) => {
      this.currentRole = role?.toUpperCase() || null; 
    });
  }

  @HostBinding('class.closed') get isClosed() {
    return !this.isSidebarOpen;
  }

  openSidebar(): void {
    this.isSidebarOpen = true; 
  }

  closeSidebar(): void {
    this.isSidebarOpen = false; 
  }

  isVisibleForAll(): boolean {
    return true; 
  }

  isVisibleForAdmin(): boolean {
    return this.currentRole === 'ADMINISTRADORES';
  }

  isVisibleForEmployee(): boolean {
    return this.currentRole === 'EMPLEADOS';
  }

  isVisibleForCook(): boolean {
    return this.currentRole === 'COCINEROS';
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
    this.authService.logout(); 
  }
}
