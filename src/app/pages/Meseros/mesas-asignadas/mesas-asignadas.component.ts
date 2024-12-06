import { Component, OnInit } from '@angular/core';
import { MesaModel } from '../../../models/mesa';
import { MesaService } from '../../../services/mesas/mesa.service';
import { Store } from '@ngrx/store';
import { selectUserData } from '../../../store/user/user.selectors';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mesas-asignadas',
  standalone: true,
  imports: [
      CommonModule,
  ],
  templateUrl: './mesas-asignadas.component.html',
  styleUrl: './mesas-asignadas.component.css'
})
export class MesasAsignadasComponent implements OnInit {
  mesasAsignadas: MesaModel[] = [];
  meseroId: string | null = null;
  selectedMesa: MesaModel | null = null;

  constructor(
    private mesaService: MesaService,
    private store: Store
  ) {}

  async ngOnInit() {
    this.store.select(selectUserData).subscribe((userData) => {
      if (userData?.id) {
        this.meseroId = userData.id;
        this.loadMesasAsignadas(); 
      }
    });
  }

  async loadMesasAsignadas() {
    if (!this.meseroId) return;

    try {
      this.mesasAsignadas = await this.mesaService.getMesasPorMeseroId(this.meseroId);
      //console.log('Mesas asignadas:', this.mesasAsignadas);
    } catch (error) {
      console.error('Error al cargar las mesas asignadas:', error);
    }
  }

  async selectMesa(id: string): Promise<void> {
    try {
      this.selectedMesa = await this.mesaService.getMesaById(id);
      //console.log('Mesa seleccionada:', this.selectedMesa);
    } catch (error) {
      console.error('Error al seleccionar la mesa:', error);
    }
  }
}
