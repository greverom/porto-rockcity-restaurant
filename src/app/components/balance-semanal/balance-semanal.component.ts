import { Component } from '@angular/core';
import { BalanceService } from '../../services/balances/balance.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-balance-semanal',
  standalone: true,
  imports: [
      CommonModule,
      FormsModule
  ],
  templateUrl: './balance-semanal.component.html',
  styleUrl: './balance-semanal.component.css'
})
export class BalanceSemanalComponent {
  fechaInicio: string = ''; 
  fechaFin: string = ''; 
  totalFacturas: number = 0;
  cantidadFacturas: number = 0;
  facturas: any[] = [];
  totalNotasDeVenta: number = 0;
  cantidadNotasDeVenta: number = 0;
  notasDeVenta: any[] = [];
  totalGeneral: number = 0;
  selectedFactura: any = null;
  selectedNota: any = null;

  constructor(private balanceService: BalanceService) {}

  onFacturaChange() {
    //console.log(this.selectedFactura);
  }
  
  onNotaChange() {
    //console.log(this.selectedNota);
  }

  async calcularBalanceSemanal() {
    if (!this.fechaInicio || !this.fechaFin) return;

    try {
      const facturasResult = await this.balanceService.getFacturasPorRango(this.fechaInicio, this.fechaFin);
      this.totalFacturas = facturasResult.total;
      this.cantidadFacturas = facturasResult.cantidad;
      this.facturas = facturasResult.facturas;

      const notasResult = await this.balanceService.getNotasDeVentaPorRango(this.fechaInicio, this.fechaFin);
      this.totalNotasDeVenta = notasResult.total;
      this.cantidadNotasDeVenta = notasResult.cantidad;
      this.notasDeVenta = notasResult.notas;

      this.totalGeneral = this.totalFacturas + this.totalNotasDeVenta;
    } catch (error) {
      console.error('Error al calcular el balance semanal:', error);
    }
  }
}