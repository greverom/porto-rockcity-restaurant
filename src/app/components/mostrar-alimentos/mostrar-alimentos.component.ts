import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
export class MostrarAlimentosComponent {
  categorias: string[] = ['Entradas', 'Platos Fuertes', 'Postres', 'Bebidas'];

  subcategoriasBebidas: { [key: string]: string[] } = {
    'Bebidas Alcohólicas': ['Cervezas', 'Vinos', 'Whisky', 'Cocteles'],
    'Bebidas No Alcohólicas': ['Colas', 'Jugos', 'Agua'],
  };

  selectedCategoria: string = '';
  selectedSubcategoria: string = '';
  subcategories: string[] = []; 

  onCategoriaChange(): void {
    if (this.selectedCategoria === 'Bebidas') {
      this.subcategories = Object.keys(this.subcategoriasBebidas);
    } else {
      this.subcategories = [];
      this.selectedSubcategoria = ''; 
    }
  }

  onSubcategoriaChange(): void {
    console.log('Subcategoría seleccionada:', this.selectedSubcategoria);
  }
}
