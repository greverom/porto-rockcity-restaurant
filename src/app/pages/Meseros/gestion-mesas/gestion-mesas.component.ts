import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-gestion-mesas',
  standalone: true,
  imports: [
      CommonModule,
      RouterModule
  ],
  templateUrl: './gestion-mesas.component.html',
  styleUrl: './gestion-mesas.component.css'
})
export class GestionMesasComponent {

}
