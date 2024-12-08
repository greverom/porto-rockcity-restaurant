import { Component } from '@angular/core';
import { AlimentoMesaModel, FormaPago, PagoMesaModel } from '../../../models/mesa';
import { FacturacionService } from '../../../services/facturacion/facturacion.service';
import { MesaService } from '../../../services/mesas/mesa.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-facturacion',
  standalone: true,
  imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule
  ],
  templateUrl: './facturacion.component.html',
  styleUrl: './facturacion.component.css'
})
export class FacturacionComponent {
  alimentos: AlimentoMesaModel[] = [];
  numeroMesa: number | string = 'Desconocido';
  mesaId: string | null = null;
  showFacturaModal: boolean = false;
  facturaForm: FormGroup;
  formasPago = Object.values(FormaPago);
  meseroNombre: string = '';

  constructor(
    private facturacionService: FacturacionService,
    private mesaService: MesaService,
    private fb: FormBuilder
  ) {
    this.facturaForm = this.fb.group({
      clienteId: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      nombreCliente: ['', Validators.required],
      correo: [''],
      monto: [{ value: this.calcularTotal(), disabled: true }, Validators.required],
      formaPago: [FormaPago.EFECTIVO, Validators.required]
    });
  }

  async ngOnInit(): Promise<void> {
    this.facturacionService.mesaId$.subscribe(async (id) => {
      if (id) {
        this.mesaId = id;

        try {
          const mesa = await this.mesaService.getMesaById(id);
          this.alimentos = mesa?.alimentos || [];
          this.numeroMesa = mesa?.numero ?? 'Desconocido';
          this.ordenarAlimentosPorNombre();

          // Obtener el nombre del mesero
          if (mesa?.meseroId) {
            const mesero = await this.mesaService.getEmpleadoById(mesa.meseroId);
            if (mesero) {
              this.meseroNombre = `${mesero.nombres} ${mesero.apellidos}`;
            } else {
              this.meseroNombre = 'Desconocido';
            }
          } else {
            this.meseroNombre = 'No asignado';
          }

        } catch (error) {
          console.error('Error al cargar los alimentos o el mesero:', error);
        }
      }
    });
  }

  ordenarAlimentosPorNombre(): void {
    this.alimentos.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }

  onSeleccionarAlimento(alimento: AlimentoMesaModel): void {
    console.log('Alimento seleccionado:', alimento);
  }

  calcularSubtotal(): number {
    return this.alimentos.reduce((total, alimento) => total + alimento.subtotal, 0);
  }

  calcularIVA(): number {
    const subtotal = this.calcularSubtotal();
    return subtotal * 0.15; 
  }
  
  calcularTotal(): number {
    const subtotal = this.calcularSubtotal();
    const iva = this.calcularIVA();
    return subtotal + iva; 
  }

  openFacturaModal(): void {
    this.showFacturaModal = true;
    this.facturaForm.patchValue({
      monto: this.calcularTotal()
    });
  }

  closeFacturaModal(): void {
    this.showFacturaModal = false;
    this.facturaForm.reset({
      clienteId: '',
      nombreCliente: '',
      correo: '',
      monto: 0,
      formaPago: FormaPago.EFECTIVO
    });
  }

  onPagarConFactura(): void {
    if (this.facturaForm.valid) {
      const pago: PagoMesaModel = {
        clienteId: this.facturaForm.value.clienteId,
        nombreCliente: this.facturaForm.value.nombreCliente,
        correo: this.facturaForm.value.correo,
        monto: this.calcularTotal(),
        formaPago: this.facturaForm.value.formaPago,
        fecha: new Date()
      };

      const facturaData = {
        pago,
        numeroMesa: this.numeroMesa,
        meseroNombre: this.meseroNombre
      };

      console.log('Factura registrada:', facturaData);
      this.closeFacturaModal();
    }
  }
}
