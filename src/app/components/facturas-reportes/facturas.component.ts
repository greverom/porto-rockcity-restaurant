import { Component, OnInit } from '@angular/core';
import { MesaService } from '../../services/mesas/mesa.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-facturas',
  standalone: true,
  imports: [
      CommonModule,
      FormsModule
  ],
  templateUrl: './facturas.component.html',
  styleUrl: './facturas.component.css'
})
export class FacturasComponent implements OnInit {
  facturas: any[] = [];
  selectedFactura: any = null;
  loading = true;

  constructor(private mesaService: MesaService) {}

  async ngOnInit(): Promise<void> {
    await this.loadFacturas();
  }

  async loadFacturas(): Promise<void> {
    try {
      const rawFacturas = await this.mesaService.getFacturas();
      this.facturas = rawFacturas.map(factura => {
        const fechaValida = factura.pago.fecha ? new Date(factura.pago.fecha) : null;
  
        return {
          ...factura,
          pago: {
            ...factura.pago,
            fecha: fechaValida && !isNaN(fechaValida.getTime()) ? fechaValida : null, 
          },
          subtotal: factura.pago.descripcionAlimentos.reduce(
            (subtotal: number, alimento: any) => subtotal + alimento.subtotal,
            0
          ),
          iva: factura.pago.descripcionAlimentos.reduce(
            (subtotal: number, alimento: any) => subtotal + alimento.subtotal,
            0
          ) * 0.15,
        };
      });
    } catch (error) {
      console.error('Error al cargar las facturas:', error);
    }
  }

  onFacturaChange(): void {
    console.log('Factura seleccionada:', this.selectedFactura);
  }
}
