import { Component, OnInit } from '@angular/core';
import { MesaEstado, MesaModel } from '../../../models/mesa';
import { MesaService } from '../../../services/mesas/mesa.service';
import { CommonModule } from '@angular/common';
import { selectUserData } from '../../../store/user/user.selectors';
import { Store } from '@ngrx/store';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-gestion-pedidos',
  standalone: true,
  imports: [
      CommonModule,
      FormsModule,
      RouterModule
  ],
  templateUrl: './gestion-pedidos.component.html',
  styleUrl: './gestion-pedidos.component.css'
})
export class GestionPedidosComponent implements OnInit {
  mesas: MesaModel[] = [];
  meseroId: string | null = null;
  selectedMesa: MesaModel | null = null;
  showAsignarModal = false;
  mesasAsignadasCount: number = 0;

  constructor(private mesaService: MesaService,
              private store: Store,
              private router: Router
  ) {}

  async ngOnInit() {
    await this.loadMesas();

    this.store.select(selectUserData).subscribe((userData) => {
      if (userData?.id) {
        this.meseroId = userData.id;
        this.calculateMesasAsignadas();
        //console.log(this.meseroId); 
      }
    });
  }

  async loadMesas() {
    try {
      const mesas = await this.mesaService.getMesas();
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalizar la fecha actual
  
      for (const mesa of mesas) {
        if (mesa.estado === MesaEstado.OCUPADA) {
          continue; 
        }
  
        if (mesa.reservaId) {
          const reserva = await this.mesaService.getReservaById(mesa.reservaId);
  
          if (reserva && reserva.fechaReserva) {
            const fechaReserva = new Date(reserva.fechaReserva);
            fechaReserva.setHours(0, 0, 0, 0); // Normalizar fecha de la reserva
  
            if (fechaReserva.getTime() < today.getTime()) {
              await this.mesaService.deleteReserva(reserva.id);
              await this.mesaService.updateMesa(mesa.id, {
                estado: MesaEstado.DISPONIBLE,
                reservaId: null,
              });
              mesa.estado = MesaEstado.DISPONIBLE;
              mesa.reservaId = null;
            } else if (fechaReserva.getTime() === today.getTime()) {
              mesa.estado = MesaEstado.RESERVADA;
            } else {
              mesa.estado = MesaEstado.DISPONIBLE;
            }
          } else {
            mesa.estado = MesaEstado.DISPONIBLE;
          }
        } else {
          mesa.estado = MesaEstado.DISPONIBLE;
        }
      }
  
      this.mesas = mesas.sort((a, b) => a.numero - b.numero); 
      this.calculateMesasAsignadas(); 
    } catch (error) {
      console.error('Error al cargar las mesas:', error);
    }
  }

  async selectMesa(id: string): Promise<void> {
    try {
      this.selectedMesa = await this.mesaService.getMesaById(id); 
      //console.log(this.selectedMesa); 
    } catch (error) {
      console.error('Error al seleccionar la mesa:', error);
    }
  }

  async openAsignarModal(mesaId: string): Promise<void> {
    try {
      const mesaSeleccionada = this.mesas.find((mesa) => mesa.id === mesaId);
      if (mesaSeleccionada?.estado === MesaEstado.OCUPADA) {
        console.log('No se puede seleccionar una mesa ocupada.');
        return;
      }
  
      await this.selectMesa(mesaId); 
      this.showAsignarModal = true; 
    } catch (error) {
      console.error('Error al abrir el modal de asignación:', error);
    }
  }

  closeAsignarModal(): void {
    this.showAsignarModal = false;
    this.selectedMesa = null;
  }

  async onAsignarMesa(): Promise<void> {
    if (!this.selectedMesa || !this.meseroId) {
      //console.error('Faltan datos para asignar la mesa.');
      return;
    }
  
    try {
      const nuevaCapacidad = this.selectedMesa.capacidad;
  
      if (!nuevaCapacidad || nuevaCapacidad < 1) {
        console.error('La capacidad debe ser un número válido y mayor a 0.');
        return;
      }
  
      await this.mesaService.updateMesa(this.selectedMesa.id, {
        estado: MesaEstado.OCUPADA,
        meseroId: this.meseroId,
        capacidad: nuevaCapacidad, 
      });
  
      this.selectedMesa.estado = MesaEstado.OCUPADA;
      this.selectedMesa.meseroId = this.meseroId;
      this.selectedMesa.capacidad = nuevaCapacidad; 
      const mesaIndex = this.mesas.findIndex((mesa) => mesa.id === this.selectedMesa!.id);
      await this.loadMesas(); 
      this.showAsignarModal = false;
      this.router.navigate(['/mesas-asignadas']);
      //console.log('Datos de la mesa asignada:', this.selectedMesa);
      //console.log('Mesa asignada correctamente.');
    } catch (error) {
      console.error('Error al asignar la mesa:', error);
    }
  }

  calculateMesasAsignadas() {
    if (this.meseroId) {
      this.mesasAsignadasCount = this.mesas.filter(
        (mesa) => mesa.meseroId === this.meseroId && mesa.estado === MesaEstado.OCUPADA
      ).length;
    }
  }

  onParaLlevar(): void {
    this.router.navigate(['/para-llevar']); 
  }
}
