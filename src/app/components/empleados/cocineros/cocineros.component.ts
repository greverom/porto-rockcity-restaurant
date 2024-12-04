import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuarios/usuario.service';
import { CommonModule } from '@angular/common';
import { ModalDto, modalInitializer } from '../../modal/modal.dto';
import { ModalComponent } from '../../modal/modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-cocineros',
  standalone: true,
  imports: [
      CommonModule,
      ModalComponent,
      FormsModule
  ],
  templateUrl: './cocineros.component.html',
  styleUrl: './cocineros.component.css'
})
export class CocinerosComponent implements OnInit {
  cocineros: any[] = [];
  selectedCocineroDetails: any = null; 
  editForm: Partial<{ nombres: string; apellidos: string; usuario: string }> = {}; 
  isModalOpen: boolean = false;
  modal: ModalDto = modalInitializer();

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.usuarioService.getCocineros().subscribe((cocineros) => {
      this.cocineros = cocineros;
    });
  }

  openEditModal(id: string): void {
    this.usuarioService.getEmpleadoById('cocineros', id).subscribe((cocinero) => {
      this.selectedCocineroDetails = cocinero;
      this.editForm = {
        nombres: cocinero.nombres,
        apellidos: cocinero.apellidos,
        usuario: cocinero.usuario,
      };
      this.isModalOpen = true; 
    });
  }

  saveEdit(): void {
    if (this.selectedCocineroDetails) {
      this.usuarioService.updateUsuario('cocineros', this.selectedCocineroDetails.id, this.editForm)
        .then(() => {
          this.isModalOpen = false; 
          this.selectedCocineroDetails = null; 
          this.ngOnInit(); // Refrescar la lista
        })
        .catch((error) => {
          console.error('Error al actualizar el cocinero:', error);
        });
    }
  }

  closeModal(): void {
    this.isModalOpen = false; 
    this.selectedCocineroDetails = null; 
  }

  openDeleteModal(cocinero: any): void {
    this.selectedCocineroDetails = cocinero;
    this.modal = {
      ...modalInitializer(),
      show: true,
      message: `¿Estás seguro de que deseas eliminar a ${cocinero.nombres}?`,
      isConfirm: true,
      confirm: () => this.confirmDelete(),
      close: () => this.closeDeleteModal()
    };
  }

  confirmDelete(): void {
    if (this.selectedCocineroDetails) {
      this.usuarioService.deleteUsuario('cocineros', this.selectedCocineroDetails.id)
        .then(() => {
          console.log('Cocinero eliminado correctamente.');
          this.closeDeleteModal();
          this.ngOnInit(); 
        })
        .catch((error) => {
          console.error('Error al eliminar el cocinero:', error);
        });
    }
  }

  closeDeleteModal(): void {
    this.modal = { ...modalInitializer(), show: false };
    this.selectedCocineroDetails = null;
  }
}
