import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MesaEstado, MesaModel, ReservaEstado, ReservaModel } from '../../../models/mesa';
import { MesaService } from '../../../services/mesas/mesa.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalDto, modalInitializer } from '../../../components/modal/modal.dto';
import { ModalComponent } from '../../../components/modal/modal.component';

@Component({
  selector: 'app-gestion-mesas',
  standalone: true,
  imports: [
      CommonModule,
      RouterModule,
      ReactiveFormsModule,
      ModalComponent
  ],
  templateUrl: './gestion-mesas.component.html',
  styleUrl: './gestion-mesas.component.css'
})
export class GestionMesasComponent {
  mesas: MesaModel[] = [];
  selectedMesa: MesaModel | null = null;
  showReservaModal = false;
  reservaForm: FormGroup;
  modal: ModalDto = modalInitializer();

  constructor(
    private mesaService: MesaService,
    private fb: FormBuilder
  ) {
    this.reservaForm = this.fb.group({
      clienteNombre: ['', [Validators.required]],
      numeroPersonas: ['', [Validators.required, Validators.min(1)]],
      fechaReserva: ['', [Validators.required]],
    });
  }

  async ngOnInit() {
    await this.loadMesas();
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
    this.selectedMesa = await this.mesaService.getMesaById(id); 
  }

  openReservaModal(): void {
    this.showReservaModal = true;
  }

  closeReservaModal(): void {
    this.showReservaModal = false;
    this.reservaForm.reset();
  }

  async onReservarMesa(): Promise<void> {
    if (this.reservaForm.invalid || !this.selectedMesa) {
      return;
    }

    const reservaData: Omit<ReservaModel, 'id' | 'fechaCreacion'> = {
      mesaId: this.selectedMesa.id,
      clienteNombre: this.reservaForm.value.clienteNombre,
      numeroPersonas: this.reservaForm.value.numeroPersonas,
      fechaReserva: new Date(this.reservaForm.value.fechaReserva),
      estado: ReservaEstado.CONFIRMADA,
    };

    try {
      await this.mesaService.createReserva(reservaData);

      await this.mesaService.updateMesa(this.selectedMesa.id, {
        estado: MesaEstado.RESERVADA,
      });
      this.showModal('Mesa reservada.', false);
      this.closeReservaModal();
      await this.loadMesas();
    } catch (error) {
      this.showModal('Hubo un error al reservar la mesa. Intenta nuevamente.', true); 
      console.error('Error al reservar la mesa:', error);
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
