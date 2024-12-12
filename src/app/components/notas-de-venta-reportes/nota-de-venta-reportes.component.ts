import { Component, OnInit } from '@angular/core';
import { MesaService } from '../../services/mesas/mesa.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nota-de-venta-reportes',
  standalone: true,
  imports: [
      CommonModule,
      FormsModule
  ],
  templateUrl: './nota-de-venta-reportes.component.html',
  styleUrl: './nota-de-venta-reportes.component.css'
})
export class NotaDeVentaReportesComponent implements OnInit {
  notasDeVenta: any[] = [];
  selectedNota: any = null;
  loading = true;

  constructor(private mesaService: MesaService) {}

  async ngOnInit(): Promise<void> {
    await this.loadNotasDeVenta();
  }

  async loadNotasDeVenta(): Promise<void> {
    try {
      const rawNotas = await this.mesaService.getNotasDeVenta();
      this.notasDeVenta = rawNotas.map(nota => ({
        ...nota,
        fecha: nota.fecha ? new Date(nota.fecha) : null, 
        subtotal: nota.pago.descripcionAlimentos.reduce(
          (subtotal: number, alimento: any) => subtotal + alimento.subtotal,
          0
        ),
        iva: nota.pago.descripcionAlimentos.reduce(
          (subtotal: number, alimento: any) => subtotal + alimento.subtotal,
          0
        ) * 0.15,
      }));
    } catch (error) {
      console.error('Error al cargar las notas de venta:', error);
    } finally {
      this.loading = false;
    }
  }

  onNotaChange(): void {
    console.log('Nota de Venta seleccionada:', this.selectedNota);
  }
}
