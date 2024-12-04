import { Component, OnInit } from '@angular/core';
import { AlimentoModel } from '../../models/food';
import { FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlimentosService } from '../../services/alimentos/alimentos.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crud-alimentos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule

  ],
  templateUrl: './crud-alimentos.component.html',
  styleUrl: './crud-alimentos.component.css'
})
export class CrudAlimentoComponent {
  alimentoForm: FormGroup;
  showModal: boolean = false;
  showSubcategories: boolean = false; 
  subcategories: string[] = []; 
  detailedSubcategories: string[] = [];

  constructor(private fb: FormBuilder, private alimentosService: AlimentosService) {
    this.alimentoForm = this.fb.group({
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      categoria: ['', [Validators.required]], 
      subcategoria: [''], 
      detalleSubcategoria: [''],
      precio: ['', [Validators.required, Validators.min(0)]],
      imagen: [''],
      cantidadRestante: [0, [Validators.required, Validators.min(0)]]
    });
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.alimentoForm.reset();
  }

  onCategoriaChange(): void {
    const categoria = this.alimentoForm.get('categoria')?.value;

    if (categoria === 'bebidas') {
      this.showSubcategories = true;
      this.subcategories = ['Alcohólicas', 'No Alcohólicas'];
    } else {
      this.showSubcategories = false;
      this.subcategories = [];
      this.detailedSubcategories = [];
    }
  }

  onSubcategoriaChange(): void {
    const subcategoria = this.alimentoForm.get('subcategoria')?.value;

    if (subcategoria === 'Alcohólicas') {
      this.detailedSubcategories = ['Cervezas', 'Vino', 'Whisky', 'Cocteles'];
    } else if (subcategoria === 'No Alcohólicas') {
      this.detailedSubcategories = ['Cola', 'Jugo', 'Agua'];
    } else {
      this.detailedSubcategories = [];
    }
  }

  saveAlimento(): void {
    if (this.alimentoForm.invalid) {
      this.alimentoForm.markAllAsTouched();
      return;
    }

    const categoria = this.alimentoForm.get('categoria')?.value;
    const subcategoria = this.alimentoForm.get('subcategoria')?.value;
    const detalleSubcategoria = this.alimentoForm.get('detalleSubcategoria')?.value;

    const categoriaCompleta = [categoria, subcategoria, detalleSubcategoria]
      .filter((c) => c) 
      .join('/');

      const alimento: Omit<AlimentoModel, 'id'> = {
        ...this.alimentoForm.value,
        categoria: categoriaCompleta,
        activo: true,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),
      };

    this.alimentosService.createAlimento(alimento).then(() => {
      console.log('Alimento guardado exitosamente');
      this.alimentoForm.reset();
    }).catch((error) => {
      console.error('Error al guardar el alimento:', error);
    });
  }
}