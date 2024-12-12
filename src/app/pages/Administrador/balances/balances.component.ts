import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BalanceService } from '../../../services/balances/balance.service';
import { Router } from '@angular/router';

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
  facturas: any[] = [];
  totalFacturas: number = 0;
  cantidadFacturas: number = 0; 
  notasDeVenta: any[] = [];
  totalNotasDeVenta: number = 0;
  cantidadNotasDeVenta: number = 0;
  totalGeneral: number = 0;

  selectedFactura: any = null; 
  selectedNota: any = null;

  constructor(private balanceService: BalanceService,
              private router: Router
  ){}

  ngOnInit() {
  }

  activarBalanceDiario() {
    this.mostrarBalanceDiario = true;
  }

  irABalanceSemanal():void{
    this.router.navigate(['/balance-semanal'])
  }

  onFacturaChange() {
    //console.log('Factura seleccionada:', this.selectedFactura);
  }
  
  onNotaChange() {
    //console.log('Nota de venta seleccionada:', this.selectedNota);
  }

  async cargarBalancesPorFecha() {
    if (!this.fechaSeleccionada) return;
  
    try {
      const facturas = await this.balanceService.getFacturasPorFecha(this.fechaSeleccionada);
      this.totalFacturas = facturas.total;
      this.cantidadFacturas = facturas.cantidad;
      this.facturas = facturas.facturas; 
  
      const notasDeVenta = await this.balanceService.getNotasDeVentaPorFecha(this.fechaSeleccionada);
      this.totalNotasDeVenta = notasDeVenta.total;
      this.cantidadNotasDeVenta = notasDeVenta.cantidad;
      this.notasDeVenta = notasDeVenta.notas; 
  
      this.totalGeneral = this.totalFacturas + this.totalNotasDeVenta;
  
      //console.log('Facturas:', this.facturas);
     // console.log('Notas de Venta:', this.notasDeVenta);
    } catch (error) {
      console.error('Error cargando balances:', error);
    }
  }
}
