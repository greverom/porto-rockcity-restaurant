import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pagina-error',
  standalone: true,
  imports: [],
  templateUrl: './pagina-error.component.html',
  styleUrl: './pagina-error.component.css'
})
export class PaginaErrorComponent {
  constructor(private router: Router) {}

  navigateHome(): void {
    this.router.navigate(['/home']);
  }
}
