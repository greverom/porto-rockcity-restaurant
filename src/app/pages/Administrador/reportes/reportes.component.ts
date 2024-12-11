import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FacturasComponent } from '../../../components/facturas-reportes/facturas.component';
import { NotaDeVentaReportesComponent } from "../../../components/notas-de-venta-reportes/nota-de-venta-reportes.component";

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [
    CommonModule,
    FacturasComponent,
    NotaDeVentaReportesComponent
],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})
export class ReportesComponent {
  mostrarFacturas = true; 

  alternarVista(): void {
    this.mostrarFacturas = !this.mostrarFacturas;
  }

  get botonTexto(): string {
    return this.mostrarFacturas ? 'Ver Notas de Venta' : 'Ver Facturas';
  }
}
