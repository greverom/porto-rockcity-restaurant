import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BalanceService } from '../../../services/balances/balance.service';

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
  mostrarResultados: boolean = false;

  constructor(private balanceService: BalanceService) {}

  calcularSubtotalEIVA(facturaONota: any): void {
    if (!facturaONota || !facturaONota.pago?.descripcionAlimentos) return;
  
    const subtotal = facturaONota.pago.descripcionAlimentos.reduce(
      (acc: number, alimento: any) => acc + (alimento.subtotal || 0),
      0
    );
  
    const iva = subtotal * 0.15;
  
    facturaONota.subtotal = subtotal;
    facturaONota.iva = iva;
  }

  onFacturaChange(): void {
    if (this.selectedFactura) {
      this.calcularSubtotalEIVA(this.selectedFactura);
    }
  }
  
  onNotaChange(): void {
    if (this.selectedNota) {
      this.calcularSubtotalEIVA(this.selectedNota);
    }
  }

  async calcularBalanceSemanal() {
    if (!this.fechaInicio || !this.fechaFin) return;

    try {
      this.mostrarResultados = false;
      const facturasResult = await this.balanceService.getFacturasPorRango(this.fechaInicio, this.fechaFin);
      this.totalFacturas = facturasResult.total;
      this.cantidadFacturas = facturasResult.cantidad;
      this.facturas = facturasResult.facturas;

      const notasResult = await this.balanceService.getNotasDeVentaPorRango(this.fechaInicio, this.fechaFin);
      this.totalNotasDeVenta = notasResult.total;
      this.cantidadNotasDeVenta = notasResult.cantidad;
      this.notasDeVenta = notasResult.notas;

      this.totalGeneral = this.totalFacturas + this.totalNotasDeVenta;
      this.mostrarResultados = true;
    } catch (error) {
      console.error('Error al calcular el balance semanal:', error);
    }
  }
}