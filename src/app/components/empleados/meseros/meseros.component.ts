import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuarios/usuario.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalDto, modalInitializer } from '../../modal/modal.dto';
import { ModalComponent } from '../../modal/modal.component';

@Component({
  selector: 'app-meseros',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModalComponent
  ],
  templateUrl: './meseros.component.html',
  styleUrl: './meseros.component.css'
})
export class MeserosComponent implements OnInit {
  empleados: any[] = [];
  selectedEmpleadoDetails: any = null;
  editForm: Partial<{ nombres: string; apellidos: string; usuario: string }> = {}; 
  isModalOpen: boolean = false;
  modal: ModalDto = modalInitializer();

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.usuarioService.getEmpleados().subscribe((empleados) => {
      this.empleados = empleados;
    });
  }

  openEditModal(id: string): void {
    this.usuarioService.getEmpleadoById('empleados', id).subscribe((empleado) => {
      this.selectedEmpleadoDetails = empleado;
      this.editForm = {
        nombres: empleado.nombres,
        apellidos: empleado.apellidos,
        usuario: empleado.usuario,
      };
      this.isModalOpen = true; 
    });
  }

  saveEdit(): void {
    if (this.selectedEmpleadoDetails) {
      this.usuarioService.updateUsuario('empleados', this.selectedEmpleadoDetails.id, this.editForm)
        .then(() => {
          this.isModalOpen = false; 
          this.selectedEmpleadoDetails = null; 
          this.ngOnInit(); 
        })
        .catch((error) => {
          console.error('Error al actualizar el empleado:', error);
        });
    }
  }

  closeModal(): void {
    this.isModalOpen = false; 
    this.selectedEmpleadoDetails = null; 
  }

  openDeleteModal(empleado: any): void {
    this.selectedEmpleadoDetails = empleado;
    this.modal = {
      ...modalInitializer(),
      show: true,
      message: `¿Estás seguro de que deseas eliminar a ${empleado.nombres}?`,
      isConfirm: true,
      confirm: () => this.confirmDelete(),
      close: () => this.closeDeleteModal()
    };
  }

  // Método para confirmar la eliminación
  confirmDelete(): void {
    if (this.selectedEmpleadoDetails) {
      this.usuarioService.deleteUsuario('empleados', this.selectedEmpleadoDetails.id)
        .then(() => {
          console.log('Empleado eliminado correctamente.');
          this.closeDeleteModal();
          this.ngOnInit(); 
        })
        .catch((error) => {
          console.error('Error al eliminar el empleado:', error);
        });
    }
  }

  // Método para cerrar el modal de confirmación
  closeDeleteModal(): void {
    this.modal = { ...modalInitializer(), show: false };
    this.selectedEmpleadoDetails = null;
  }
  
}
