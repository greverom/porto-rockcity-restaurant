import { Component } from '@angular/core';
import { AlimentoMesaModel } from '../../../models/mesa';
import { FacturacionService } from '../../../services/facturacion/facturacion.service';
import { MesaService } from '../../../services/mesas/mesa.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-facturacion',
  standalone: true,
  imports: [
      CommonModule,
      FormsModule
  ],
  templateUrl: './facturacion.component.html',
  styleUrl: './facturacion.component.css'
})
export class FacturacionComponent {
  alimentos: AlimentoMesaModel[] = [];
  mesaId: string | null = null;

  constructor(
    private facturacionService: FacturacionService,
    private mesaService: MesaService
  ) {}

  ngOnInit(): void {
    this.facturacionService.mesaId$.subscribe(async (id) => {
      if (id) {
        this.mesaId = id;

        try {
          const mesa = await this.mesaService.getMesaById(id);
          this.alimentos = mesa?.alimentos || [];
          this.ordenarAlimentosPorNombre();
          //console.log( this.alimentos);
        } catch (error) {
          console.log('Error al cargar los alimentos:', error);
        }
      }
    });
  }

  ordenarAlimentosPorNombre(): void {
    this.alimentos.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }

  onSeleccionarAlimento(alimento: AlimentoMesaModel): void {
    console.log('Alimento seleccionado:', alimento);
  }

  calcularSubtotal(): number {
    return this.alimentos.reduce((total, alimento) => total + alimento.subtotal, 0);
  }
}
