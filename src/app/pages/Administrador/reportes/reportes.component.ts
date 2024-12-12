import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FacturasComponent } from '../../../components/facturas-reportes/facturas.component';
import { NotaDeVentaReportesComponent } from "../../../components/notas-de-venta-reportes/nota-de-venta-reportes.component";
import { Router } from '@angular/router';

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

  constructor(private router: Router){}

  alternarVista(): void {
    this.mostrarFacturas = !this.mostrarFacturas;
  }

  irABalances():void{
    this.router.navigate(['/balances']);
  }

  get botonTexto(): string {
    return this.mostrarFacturas ? 'Ver Notas de Venta' : 'Ver Facturas';
  }
}
