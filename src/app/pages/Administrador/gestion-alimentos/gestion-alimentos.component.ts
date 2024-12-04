import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-gestion-alimentos',
  standalone: true,
  imports: [
      CommonModule,
      RouterOutlet,
      RouterModule
  ],
  templateUrl: './gestion-alimentos.component.html',
  styleUrl: './gestion-alimentos.component.css'
})
export class GestionAlimentosComponent {
  currentRoute: string = ''; 

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }

  toggleChildRoute(): void {
    if (this.currentRoute.includes('/crud')) {
      this.router.navigate(['gestion-alimentos/mostrar-alimentos']);
    } else {
      this.router.navigate(['gestion-alimentos/crud']);
    }
  }

  volverPaginaPrincipal(): void {
    this.router.navigate(['/gestion-alimentos']);
  }
}
