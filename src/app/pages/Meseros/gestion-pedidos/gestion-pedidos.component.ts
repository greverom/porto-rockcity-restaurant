import { Component, OnInit } from '@angular/core';
import { MesaEstado, MesaModel } from '../../../models/mesa';
import { MesaService } from '../../../services/mesas/mesa.service';
import { CommonModule } from '@angular/common';
import { selectUserData } from '../../../store/user/user.selectors';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-gestion-pedidos',
  standalone: true,
  imports: [
      CommonModule
  ],
  templateUrl: './gestion-pedidos.component.html',
  styleUrl: './gestion-pedidos.component.css'
})
export class GestionPedidosComponent implements OnInit {
  mesas: MesaModel[] = [];
  meseroId: string | null = null;
  selectedMesa: MesaModel | null = null;
  showAsignarModal = false;

  constructor(private mesaService: MesaService,
              private store: Store
  ) {}

  async ngOnInit() {
    await this.loadMesas();

    this.store.select(selectUserData).subscribe((userData) => {
      if (userData?.id) {
        this.meseroId = userData.id;
        //console.log('Mesero ID:', this.meseroId); 
      }
    });
  }

  async loadMesas() {
    try {
      const mesas = await this.mesaService.getMesas();
      this.mesas = mesas.sort((a, b) => a.numero - b.numero); 
    } catch (error) {
      console.error('Error al cargar las mesas:', error);
    }
  }

  async selectMesa(id: string): Promise<void> {
    try {
      this.selectedMesa = await this.mesaService.getMesaById(id); 
      console.log('Mesa seleccionada:', this.selectedMesa); 
    } catch (error) {
      console.error('Error al seleccionar la mesa:', error);
    }
  }

  async openAsignarModal(mesaId: string): Promise<void> {
    try {
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
      console.error('Faltan datos para asignar la mesa.');
      return;
    }

    try {
      await this.mesaService.updateMesa(this.selectedMesa.id, {
        estado: MesaEstado.OCUPADA,
        meseroId: this.meseroId,    
      });

      this.selectedMesa.estado = MesaEstado.OCUPADA;
      this.selectedMesa.meseroId = this.meseroId;

      this.showAsignarModal = false;
      await this.loadMesas(); 
      console.log('Datos de la mesa asignada:', this.selectedMesa);
      console.log('Mesa asignada correctamente.');
    } catch (error) {
      console.error('Error al asignar la mesa:', error);
    }
  }
}
