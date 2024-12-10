import { Component, OnInit } from '@angular/core';
import { MesaModel } from '../../../models/mesa';
import { MesaService } from '../../../services/cocina/cocina.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pedidos-cocina',
  standalone: true,
  imports: [
      CommonModule
  ],
  templateUrl: './pedidos-cocina.component.html',
  styleUrl: './pedidos-cocina.component.css'
})
export class PedidosCocinaComponent implements OnInit {
  mesasConPedidos: { numero: number; alimentos: any[]; meseroNombre: string }[] = [];
  loading = true;

  constructor(private mesaService: MesaService) {}

  async ngOnInit(): Promise<void> {
    await this.loadMesasConPedidos();
  }

  async loadMesasConPedidos(): Promise<void> {
    try {
      this.loading = true;
      const mesas = await this.mesaService.getMesasConPedidos();

      this.mesasConPedidos = await Promise.all(
        mesas.map(async (mesa) => {
          const meseroNombre = mesa.meseroId
            ? await this.getMeseroNombre(mesa.meseroId)
            : 'Sin asignar';

          return {
            numero: mesa.numero,
            alimentos: mesa.alimentos,
            meseroNombre
          };
        })
      );
    } catch (error) {
      console.error('Error al cargar mesas con pedidos:', error);
    } finally {
      this.loading = false;
    }
  }

  private async getMeseroNombre(meseroId: string): Promise<string> {
    try {
      const mesero = await this.mesaService.getEmpleadoById(meseroId);
      return mesero ? `${mesero.nombres} ${mesero.apellidos}` : 'Desconocido';
    } catch (error) {
      console.error('Error al obtener el nombre del mesero:', error);
      return 'Desconocido';
    }
  }
}
