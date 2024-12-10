import { Component, OnInit } from '@angular/core';
import { AlimentoMesaModel, MesaModel } from '../../../models/mesa';
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
  mesasConPedidos: {
    numero: number;
    alimentos: (AlimentoMesaModel & { listo: boolean })[];
    meseroNombre: string;
    todosListos: boolean;
  }[] = [];
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
            alimentos: mesa.alimentos.map((alimento) => ({
              ...alimento,
              listo: false, // Campo local para manejar el estado del alimento
            })),
            meseroNombre,
            todosListos: false,
          };
        })
      );
    } catch (error) {
      console.error('Error al cargar mesas con pedidos:', error);
    } finally {
      this.loading = false;
    }
  }

  marcarAlimentoListo(mesaNumero: number, alimentoId: string): void {
    const mesa = this.mesasConPedidos.find((m) => m.numero === mesaNumero);
    if (mesa) {
      const alimento = mesa.alimentos.find((a) => a.alimentoId === alimentoId);
      if (alimento) {
        alimento.listo = !alimento.listo; // Alternar estado
        mesa.todosListos = mesa.alimentos.every((a) => a.listo); 
      }
    }
  }

  marcarMesaPreparada(mesaNumero: number): void {
    const mesa = this.mesasConPedidos.find((m) => m.numero === mesaNumero);
    if (mesa) {
      mesa.todosListos = true; 
      this.imprimirPedido(mesa); 
    }
  }
  
  imprimirPedido(mesa: {
    numero: number;
    alimentos: { nombre: string; cantidad: number; listo: boolean }[];
    meseroNombre: string;
  }): void {
    const popup = window.open('', '_blank', 'width=600,height=800');
    if (popup) {
      const contenido = `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
                text-align: center;
              }
              h2 {
                color: #333;
                margin-bottom: 10px;
              }
              ul {
                list-style-type: none;
                padding: 0;
                margin: 10px 0;
              }
              li {
                margin: 5px 0;
              }
              .pedido-header {
                margin-bottom: 20px;
                font-weight: bold;
                font-size: 1.2rem;
              }
              .pedido-list {
                text-align: left;
                margin: 0 auto;
                max-width: 400px;
                border: 1px solid #ddd;
                padding: 10px;
                border-radius: 5px;
                background-color: #f9f9f9;
              }
            </style>
          </head>
          <body>
            <h2>Pedido de Mesa ${mesa.numero}</h2>
            <div class="pedido-list">
              <ul>
                ${mesa.alimentos
                  .map(
                    (alimento) => `
                      <li>
                        ${alimento.cantidad} x ${alimento.nombre}
                      </li>
                    `
                  )
                  .join('')}
              </ul>
            </div>
            <script>
              window.print();
              window.onafterprint = function() { window.close(); };
            </script>
          </body>
        </html>
      `;
      popup.document.open();
      popup.document.write(contenido);
      popup.document.close();
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