import { Component } from '@angular/core';
import { BalanceService } from '../../../services/balances/balance.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-balance-diario',
  standalone: true,
  imports: [
      CommonModule,
      FormsModule
  ],
  templateUrl: './balance-diario.component.html',
  styleUrl: './balance-diario.component.css'
})
export class BalanceDiarioComponent {
  mostrarBalanceDiario: boolean = false;
  fechaSeleccionada: string = '';
  facturas: any[] = [];
  totalFacturas: number = 0;
  cantidadFacturas: number = 0; 
  notasDeVenta: any[] = [];
  totalNotasDeVenta: number = 0;
  cantidadNotasDeVenta: number = 0;
  totalGeneral: number = 0;
  selectedFactura: any = null; 
  selectedNota: any = null;
  mostrarResultados: boolean = false;

  constructor(private balanceService: BalanceService,
  ){}

  ngOnInit() {
  }

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

  async cargarBalancesPorFecha() {
    if (!this.fechaSeleccionada) return;
  
    try {
      this.mostrarResultados = false;
      const facturas = await this.balanceService.getFacturasPorFecha(this.fechaSeleccionada);
      this.totalFacturas = facturas.total;
      this.cantidadFacturas = facturas.cantidad;
      this.facturas = facturas.facturas; 
  
      const notasDeVenta = await this.balanceService.getNotasDeVentaPorFecha(this.fechaSeleccionada);
      this.totalNotasDeVenta = notasDeVenta.total;
      this.cantidadNotasDeVenta = notasDeVenta.cantidad;
      this.notasDeVenta = notasDeVenta.notas; 
  
      this.totalGeneral = this.totalFacturas + this.totalNotasDeVenta;
      this.mostrarResultados = true;
      //console.log('Facturas:', this.facturas);
     // console.log('Notas de Venta:', this.notasDeVenta);
    } catch (error) {
      console.error('Error cargando balances:', error);
    }
  }
}

