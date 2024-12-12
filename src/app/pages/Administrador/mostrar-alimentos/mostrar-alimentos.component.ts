import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlimentoModel } from '../../../models/food';
import { AlimentosService } from '../../../services/alimentos/alimentos.service';

@Component({
  selector: 'app-mostrar-alimentos',
  standalone: true,
  imports: [
      CommonModule,
      FormsModule
  ],
  templateUrl: './mostrar-alimentos.component.html',
  styleUrl: './mostrar-alimentos.component.css'
})
export class MostrarAlimentosComponent{
  categorias: string[] = ['Entradas', 'Platos-Fuertes', 'Postres', 'Bebidas'];
  searchQuery: string = '';
  alimentos: AlimentoModel[] = [];
  subcategoriasBebidas: { [key: string]: string[] } = {
    'Alcohólicas': ['Cervezas', 'Vinos', 'Whisky', 'Cocteles'],
    'No Alcohólicas': ['Colas', 'Jugos', 'Agua'],
  };

  selectedCategoria: string = '';
  selectedSubcategoria: string = '';
  subcategories: string[] = [];
  
  isModalOpen: boolean = false;
  selectedAlimento: AlimentoModel | null = null;

  constructor(private alimentosService: AlimentosService) {}

  async onSearchInput(event: Event): Promise<void> {
    const query = (event.target as HTMLInputElement).value.trim();
    //console.log('Buscando alimentos con el término:', query);
  
    if (query.length > 0) {
      try {
        this.alimentos = await this.alimentosService.buscarAlimentosPorNombre(query);
        //console.log('Resultados encontrados:', this.alimentos);
      } catch (error) {
        console.error('Error al buscar alimentos:', error);
      }
    } else {
      this.alimentos = []; 
    }
  }

  onCategoriaChange(): void {
    if (this.selectedCategoria === 'Bebidas') {
      this.subcategories = Object.keys(this.subcategoriasBebidas);
    } else {
      this.subcategories = [];
      this.selectedSubcategoria = ''; 
    }
    this.fetchAlimentos(); 
  }

  onSubcategoriaChange(): void {
    //console.log('Subcategoría seleccionada:', this.selectedSubcategoria);
    this.fetchAlimentos(); 
  }

  async fetchAlimentos(): Promise<void> {
    try {
      this.alimentos = [];
  
      if (!this.selectedCategoria) {
        return;
      }
  
      if (this.selectedCategoria === 'Bebidas') {
        if (this.selectedSubcategoria) {
          const subcategoriaPath =
            this.selectedSubcategoria === 'Alcohólicas' ? 'Alcohólicas' :
            this.selectedSubcategoria === 'No Alcohólicas' ? 'No Alcohólicas' : '';
  
          if (subcategoriaPath) {
            const bebidas = await this.alimentosService.obtenerAlimentosPorCategoria(`bebidas/${subcategoriaPath}`);
            
            this.alimentos = Object.values(bebidas).flatMap((item: any) => {
              if (item.id) {
                return Object.values(item).filter((alimento: any) => typeof alimento === 'object');
              }
              return item;
            });
          }
        } else {
          const bebidas = await this.alimentosService.obtenerAlimentosPorCategoria('bebidas');
          
          this.alimentos = Object.values(bebidas).flatMap((item: any) => {
            if (item.id) {
              return Object.values(item).filter((alimento: any) => typeof alimento === 'object');
            }
            return item;
          });
        }
      } else {
        this.alimentos = await this.alimentosService.obtenerAlimentosPorCategoria(
          this.selectedCategoria.toLowerCase()
        );
      }
  
      //console.log('Alimentos obtenidos:', this.alimentos);
    } catch (error) {
      console.error('Error al obtener alimentos:', error);
    }
  }

  async toggleActivo(alimento: AlimentoModel): Promise<void> {
    const nuevoEstado = !alimento.activo;
  
    try {
      await this.alimentosService.cambiarDisponibilidad(alimento.categoria, alimento.id, nuevoEstado);
      alimento.activo = nuevoEstado;
    } catch (error) {
      console.error('Error al cambiar el estado de disponibilidad del alimento:', error);
    }
  }
  
  async seleccionarAlimento(alimento: AlimentoModel): Promise<void> {
    try {
      this.selectedAlimento = await this.alimentosService.obtenerAlimentoPorId(alimento.categoria, alimento.id);
      if (this.selectedAlimento) {
        this.isModalOpen = true; 
      }
    } catch (error) {
      console.error('Error al obtener los datos del alimento:', error);
    }
  }

  async guardarCambios(): Promise<void> {
    if (this.selectedAlimento) {
      try {
        await this.alimentosService.editarAlimento(this.selectedAlimento);
        //console.log('Alimento actualizado correctamente.');
        const index = this.alimentos.findIndex((al) => al.id === this.selectedAlimento?.id);
          if (index !== -1) {
            this.alimentos[index] = { ...this.selectedAlimento }; 
          }
        this.isModalOpen = false; 
        this.selectedAlimento = null; 
      } catch (error) {
        console.error('Error al actualizar el alimento:', error);
      }
    }
  }

  cerrarModal(): void {
    this.isModalOpen = false;
    this.selectedAlimento = null;
  }
}
