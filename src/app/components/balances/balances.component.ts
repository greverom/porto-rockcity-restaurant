import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BalanceService } from '../../services/balances/balance.service';

@Component({
  selector: 'app-balances',
  standalone: true,
  imports: [
      CommonModule,
      FormsModule
  ],
  templateUrl: './balances.component.html',
  styleUrl: './balances.component.css'
})
export class BalancesComponent {
  mostrarBalanceDiario: boolean = false;
  fechaSeleccionada: string = '';
  totalFacturas: number = 0; 
  totalNotasDeVenta: number = 0;
  totalGeneral: number = 0;

  constructor(private balanceService: BalanceService){}

  ngOnInit() {
  }

  activarBalanceDiario() {
    this.mostrarBalanceDiario = true;
  }

  async cargarBalancesPorFecha() {
    if (!this.fechaSeleccionada) return;

    try {
      this.totalFacturas = await this.balanceService.getTotalFacturasPorFecha(this.fechaSeleccionada);
      this.totalNotasDeVenta = await this.balanceService.getTotalNotasDeVentaPorFecha(this.fechaSeleccionada);

      this.totalGeneral = this.totalFacturas + this.totalNotasDeVenta;
      //console.log('Total Facturas:', this.totalFacturas);
      //console.log('Total Notas de Venta:', this.totalNotasDeVenta);
    } catch (error) {
      console.error('Error cargando balances:', error);
    }
  }
}
