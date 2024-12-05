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
  animationClass: string = ''; 

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;

      const childRoute = this.activatedRoute.firstChild;
      if (childRoute && childRoute.snapshot.data['animation']) {
        this.animationClass = childRoute.snapshot.data['animation'];
      } else {
        this.animationClass = ''; 
      }
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
