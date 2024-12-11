import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FacturasComponent } from '../../../components/facturas-reportes/facturas.component';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [
    CommonModule, 
    FacturasComponent
  ],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})
export class ReportesComponent {

}
