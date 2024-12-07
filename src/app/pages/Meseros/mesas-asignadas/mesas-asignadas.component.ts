import { Component, OnInit } from '@angular/core';
import { AlimentoMesaModel, MesaModel } from '../../../models/mesa';
import { MesaService } from '../../../services/mesas/mesa.service';
import { Store } from '@ngrx/store';
import { selectUserData } from '../../../store/user/user.selectors';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mesas-asignadas',
  standalone: true,
  imports: [
      CommonModule,
      FormsModule
  ],
  templateUrl: './mesas-asignadas.component.html',
  styleUrl: './mesas-asignadas.component.css'
})
export class MesasAsignadasComponent implements OnInit {
  mesasAsignadas: MesaModel[] = [];
  meseroId: string | null = null;
  selectedMesa: MesaModel | null = null;
  isAlimentoFormVisible = false;
  searchQuery: string = '';
  alimentosFiltrados: AlimentoMesaModel[] = [];
  alimentoSeleccionado: string = '';
  selectedAlimento: AlimentoMesaModel | null = null;

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

  toggleAlimentoForm(): void {
    if (this.selectedMesa) {
      this.isAlimentoFormVisible = !this.isAlimentoFormVisible;
      //console.log(this.selectedMesa)
    } else {
      console.error('No hay mesa seleccionada para agregar alimentos.');
    }
  }

  onBuscarAlimento(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value.trim();
    
    if (this.searchQuery.length > 0) {
      this.fetchAlimentos(this.searchQuery);
    } else {
      this.alimentosFiltrados = []; 
    }
  }
  
  async fetchAlimentos(query: string): Promise<void> {
    try {
      const alimentos = await this.mesaService.buscarAlimentosPorNombre(query);
  
      this.alimentosFiltrados = alimentos.map((alimento) => ({
        alimentoId: alimento.id, 
        nombre: alimento.nombre,
        cantidad: 1, 
        precioUnitario: alimento.precio,
        subtotal: alimento.precio, 
      }));
     // console.log('Alimentos filtrados:', this.alimentosFiltrados);
    } catch (error) {
      console.error('Error al buscar alimentos:', error);
    }
  }
  
  seleccionarAlimento(alimento: AlimentoMesaModel): void {
    console.log('Alimento seleccionado:', alimento); 
    this.selectedAlimento = alimento; 
    this.alimentoSeleccionado = alimento.nombre; 
    this.alimentosFiltrados = []; 
  }

  async onAgregarAlimento(): Promise<void> {
    if (!this.selectedMesa || !this.selectedAlimento) {
      console.error('No hay mesa seleccionada o alimento seleccionado.');
      return;
    }
  
    try {
      if (!this.selectedMesa.alimentos) {
        this.selectedMesa.alimentos = [];
      }
  
      const nuevoAlimento: AlimentoMesaModel = {
        alimentoId: this.selectedAlimento.alimentoId,
        nombre: this.selectedAlimento.nombre,
        cantidad: this.selectedAlimento.cantidad || 1,
        precioUnitario: this.selectedAlimento.precioUnitario,
        subtotal: this.selectedAlimento.precioUnitario * (this.selectedAlimento.cantidad || 1),
      };
  
      this.selectedMesa.alimentos.push(nuevoAlimento);
  
      this.selectedMesa.total += nuevoAlimento.subtotal;
  
      await this.mesaService.updateMesa(this.selectedMesa.id, {
        alimentos: this.selectedMesa.alimentos,
        total: this.selectedMesa.total,
      });
  
      //console.log('Alimento agregado correctamente:', nuevoAlimento);
      this.selectedAlimento = null;
      this.alimentoSeleccionado = '';
      this.alimentosFiltrados = [];
    } catch (error) {
      console.error('Error al agregar el alimento:', error);
    }
  }
}
