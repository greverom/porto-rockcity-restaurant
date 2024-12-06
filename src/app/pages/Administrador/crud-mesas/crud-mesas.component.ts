import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MesaService } from '../../../services/mesas/mesa.service';
import { CommonModule } from '@angular/common';
import { ModalDto, modalInitializer } from '../../../components/modal/modal.dto';
import { ModalComponent } from '../../../components/modal/modal.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-crud-mesas',
  standalone: true,
  imports: [
      CommonModule,
      ReactiveFormsModule,
      ModalComponent,
      RouterModule
  ],
  templateUrl: './crud-mesas.component.html',
  styleUrl: './crud-mesas.component.css'
})
export class CrudMesasComponent implements OnInit {
  mesaForm: FormGroup;
  modal: ModalDto = modalInitializer();

  constructor(private fb: FormBuilder, private mesasService: MesaService) {
    this.mesaForm = this.fb.group({
      numero: ['', [Validators.required, Validators.min(1)]],
      capacidad: [4], 
    });
  }

  ngOnInit(): void {}

  async onSubmit() {
    if (this.mesaForm.invalid) {
      return;
    }

    const mesaData = {
      ...this.mesaForm.value,
      estado: 'DISPONIBLE', 
      alimentos: [],
      pagos: [],
      total: 0,
      fechaUltimaActualizacion: new Date(),
    };

    try {
      await this.mesasService.createMesa(mesaData);
      this.showModal('Mesa creada exitosamente.', false);
      this.mesaForm.reset();
    } catch (error) {
      this.showModal('Hubo un error al crear la mesa. Intenta nuevamente.', true); 
      console.error('Error al crear la mesa:', error);
    }
  }

  showModal(message: string, isError: boolean) {
    this.modal = {
      ...modalInitializer(),
      show: true,
      message,
      isError,
      isSuccess: !isError,
      autoCloseDuration: 2000, 
      close: () => (this.modal.show = false), 
    };
  
    if (this.modal.autoCloseDuration! > 0) {
      setTimeout(() => {
        this.modal.show = false;
      }, this.modal.autoCloseDuration);
    }
  }
}
