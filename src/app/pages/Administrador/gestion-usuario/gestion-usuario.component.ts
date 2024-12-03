import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MeserosComponent} from '../../../components/empleados/meseros/meseros.component';

@Component({
  selector: 'app-gestion-usuario',
  standalone: true,
  imports: [
      CommonModule,
      RouterOutlet,
      RouterModule,
      MeserosComponent
  ],
  templateUrl: './gestion-usuario.component.html',
  styleUrl: './gestion-usuario.component.css'
})
export class GestionUsuarioComponent implements OnInit {
  isOnRegisterRoute: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.isOnRegisterRoute = this.router.url.includes('/gestion-usuarios/register');
    });
  }

  goToRegister(): void {
    this.router.navigate(['/gestion-usuarios/register']);
  }

  goToGestionUsuarios(): void {
    this.router.navigate(['/gestion-usuarios']);
  }
}
