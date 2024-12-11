import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AlimentoMesaModel, MesaEstado, MesaModel, ReservaEstado, ReservaModel } from '../../../models/mesa';
import { MesaService } from '../../../services/mesas/mesa.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalDto, modalInitializer } from '../../../components/modal/modal.dto';
import { ModalComponent } from '../../../components/modal/modal.component';
import { selectUserData } from '../../../store/user/user.selectors';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { FacturacionService } from '../../../services/facturacion/facturacion.service';

@Component({
  selector: 'app-gestion-mesas',
  standalone: true,
  imports: [
      CommonModule,
      RouterModule,
      ReactiveFormsModule,
      ModalComponent,
      FormsModule
  ],
  templateUrl: './gestion-mesas.component.html',
  styleUrl: './gestion-mesas.component.css'
})
export class GestionMesasComponent {
  isAdmin$: Observable<boolean>;
  mesas: MesaModel[] = [];
  selectedMesa: MesaModel | null = null;
  selectedReserva: ReservaModel | null = null;
  showReservaModal = false;
  meseroNombre: string = '';
  reservaForm: FormGroup;
  modal: ModalDto = modalInitializer();

  constructor(
    private mesaService: MesaService,
    private fb: FormBuilder,
    private store: Store,
    private facturacionService: FacturacionService,
    private router: Router,
  ) {
    this.reservaForm = this.fb.group({
      clienteNombre: ['', [Validators.required]],
      numeroPersonas: ['', [Validators.required, Validators.min(1)]],
      fechaReserva: ['', [Validators.required]],
    });
    
    this.isAdmin$ = this.store.select(selectUserData).pipe(
      map((user) => user?.rol === 'ADMINISTRADORES') 
    );
    this.store.select(selectUserData).subscribe((userData) => {
      if (userData) {
        this.meseroNombre = `${userData.nombres} ${userData.apellidos}`;
        //console.log('Datos del usuario:', userData);
      }
    });
  }

  async ngOnInit() {
    await this.loadMesas();
  }

  async loadMesas() {
    try {
      const mesas = await this.mesaService.getMesas();
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalizar la fecha actual
  
      for (const mesa of mesas) {
        if (mesa.meseroId) {
          const mesero = await this.mesaService.getEmpleadoById(mesa.meseroId);
          if (mesero) {
            mesa.meseroId = `${mesero.nombres} ${mesero.apellidos}`; 
          } else {
            mesa.meseroId = 'Desconocido';
          }
        } else {
          mesa.meseroId = 'No asignado';
        }
  
        if (mesa.estado === MesaEstado.OCUPADA) {
          continue;
        }
  
        if (mesa.reservaId) {
          const reserva = await this.mesaService.getReservaById(mesa.reservaId);
  
          if (reserva && reserva.fechaReserva) {
            const fechaReserva = new Date(reserva.fechaReserva);
            fechaReserva.setHours(0, 0, 0, 0); // Normalizar fecha de la reserva
  
            if (fechaReserva.getTime() < today.getTime()) {
              await this.mesaService.deleteReserva(reserva.id);
              await this.mesaService.updateMesa(mesa.id, {
                estado: MesaEstado.DISPONIBLE,
                reservaId: null,
              });
  
              mesa.estado = MesaEstado.DISPONIBLE;
              mesa.reservaId = null;
            } else if (fechaReserva.getTime() === today.getTime()) {
              mesa.estado = MesaEstado.RESERVADA;
            } else {
              mesa.estado = MesaEstado.DISPONIBLE;
            }
          } else {
            mesa.estado = MesaEstado.DISPONIBLE;
          }
        } else if (!mesa.estado || mesa.estado === MesaEstado.DISPONIBLE) {
          mesa.estado = MesaEstado.DISPONIBLE;
        }
      }
  
      this.mesas = mesas.sort((a, b) => a.numero - b.numero);
    } catch (error) {
      console.error('Error al cargar las mesas:', error);
    }
  }

  ordenarAlimentosPorNombre(): void {
    if (this.selectedMesa?.alimentos) {
      this.selectedMesa.alimentos.sort((a, b) => a.nombre.localeCompare(b.nombre));
    }
  }

  async selectMesa(id: string): Promise<void> {
    try {
      this.selectedMesa = await this.mesaService.getMesaById(id);
  
      if (!this.selectedMesa) {
        console.warn('Mesa no encontrada');
        return;
      }
  
      if (this.selectedMesa.alimentos) {
        this.ordenarAlimentosPorNombre();
      }
  
      if (this.selectedMesa.reservaId) {
        const reserva = await this.mesaService.getReservaById(this.selectedMesa.reservaId);
  
        if (reserva && reserva.fechaReserva) {
          const today = new Date();
          today.setHours(0, 0, 0, 0); 
          const fechaReserva = new Date(reserva.fechaReserva);
          fechaReserva.setHours(0, 0, 0, 0); 
  
          if (fechaReserva.getTime() === today.getTime()) {
            this.selectedReserva = reserva;
            this.selectedMesa.estado = MesaEstado.RESERVADA;
          } else if (fechaReserva.getTime() > today.getTime()) {
            this.selectedReserva = null;
            if (this.selectedMesa.estado !== MesaEstado.OCUPADA) {
              this.selectedMesa.estado = MesaEstado.DISPONIBLE;
            }
          } else {
            await this.mesaService.deleteReserva(reserva.id);
            await this.mesaService.updateMesa(this.selectedMesa.id, {
              estado: MesaEstado.DISPONIBLE,
              reservaId: null,
            });
  
            this.selectedReserva = null;
            this.selectedMesa.estado = MesaEstado.DISPONIBLE;
            this.selectedMesa.reservaId = null;
          }
        } else {
          this.selectedReserva = null;
          if (this.selectedMesa.estado !== MesaEstado.OCUPADA) {
            this.selectedMesa.estado = MesaEstado.DISPONIBLE;
          }
        }
      } else {
        // Si no hay reserva asociada
        this.selectedReserva = null;
        if (!this.selectedMesa.estado || this.selectedMesa.estado === MesaEstado.RESERVADA) {
          this.selectedMesa.estado = MesaEstado.DISPONIBLE;
        }
      }
    } catch (error) {
      console.error('Error al seleccionar la mesa:', error);
    }
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
    const fechaReservaInput = this.reservaForm.value.fechaReserva;
  
    const fechaReserva = fechaReservaInput
    ? new Date(fechaReservaInput + 'T00:00:00')
    : null;
  
    if (!fechaReserva || isNaN(fechaReserva.getTime())) {
      this.showModal('La fecha de reserva es inválida.', true);
      return;
    }
  
    const reservaData: Omit<ReservaModel, 'id' | 'fechaCreacion'> = {
      mesaId: this.selectedMesa.id,
      clienteNombre: this.reservaForm.value.clienteNombre,
      numeroPersonas: this.reservaForm.value.numeroPersonas,
      fechaReserva: fechaReserva,
      estado: ReservaEstado.CONFIRMADA,
      meseroNombre: this.meseroNombre,
    };
  
    try {
      const newReservaRef = await this.mesaService.createReserva(reservaData);
      const generatedReservaId = newReservaRef.key;
  
      if (!generatedReservaId) {
        throw new Error('No se pudo obtener el ID de la nueva reserva');
      }
  
      await this.mesaService.updateMesa(this.selectedMesa.id, {
        estado: MesaEstado.RESERVADA,
        reservaId: generatedReservaId,
      });
  
      this.selectedMesa.estado = MesaEstado.RESERVADA;
      this.selectedMesa.reservaId = generatedReservaId;
  
      this.selectedReserva = {
        ...reservaData,
        id: generatedReservaId,
        fechaCreacion: new Date(),
      };
      this.closeReservaModal();
      await this.loadMesas();
  
      this.showModal('Mesa reservada.', false);
    } catch (error) {
      this.showModal('Hubo un error al reservar la mesa. Intenta nuevamente.', true);
      console.error('Error al reservar la mesa:', error);
    }
  }

  async onEliminarReserva(): Promise<void> {
    if (!this.selectedMesa || !this.selectedMesa.reservaId) {
      this.showModal('No hay reserva asociada a esta mesa.', true);
      return;
    }

    const reservaId = this.selectedMesa.reservaId;
    //console.log('Intentando eliminar reserva con ID:', reservaId);
  
    try {
      const reservaId = this.selectedMesa.reservaId;
  
      await this.mesaService.deleteReserva(reservaId);
  
      await this.mesaService.updateMesa(this.selectedMesa.id, {
        estado: MesaEstado.DISPONIBLE,
        reservaId: null, 
      });
  
      // Recargar las mesas y limpiar selección
      await this.loadMesas();
      this.selectedMesa.estado = MesaEstado.DISPONIBLE;
      this.selectedMesa.reservaId = null; 
      this.selectedReserva = null;
  
      this.showModal('Reserva eliminada exitosamente.', false);
    } catch (error) {
      this.showModal('Hubo un error al eliminar la reserva. Intenta nuevamente.', true);
      console.error('Error al eliminar la reserva:', error);
    }
  }

  proceedToPayment(): void {
    if (this.selectedMesa) {
      this.facturacionService.setMesaId(this.selectedMesa.id);
      this.router.navigate(['/facturacion']);
    } else {
      console.log('No hay mesa seleccionada.');
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
