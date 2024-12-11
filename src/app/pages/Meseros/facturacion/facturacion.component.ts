import { Component } from '@angular/core';
import { AlimentoMesaModel, FormaPago, PagoMesaModel } from '../../../models/mesa';
import { FacturacionService } from '../../../services/facturacion/facturacion.service';
import { MesaService } from '../../../services/mesas/mesa.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
  showConsumidorFinalModal: boolean = false; 
  facturaForm: FormGroup;
  consumidorFinalForm: FormGroup;
  formasPago = Object.values(FormaPago);
  meseroNombre: string = '';

  constructor(
    private facturacionService: FacturacionService,
    private mesaService: MesaService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.facturaForm = this.fb.group({
      clienteId: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      nombreCliente: ['', Validators.required],
      correo: [''],
      monto: [{ value: this.calcularTotal(), disabled: true }, Validators.required],
      formaPago: [FormaPago.EFECTIVO, Validators.required]
    });

    this.consumidorFinalForm = this.fb.group({
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
   // console.log('Alimento seleccionado:', alimento);
  }

  calcularSubtotalSeleccionados(): number {
    const seleccionados = this.alimentos.filter(alimento => alimento.seleccionado);
    if (seleccionados.length === 0) {
      return this.alimentos.reduce((total, alimento) => total + alimento.subtotal, 0);
    }
    return seleccionados.reduce((total, alimento) => total + alimento.subtotal, 0);
  }

  calcularIVASeleccionados(): number {
    const subtotal = this.calcularSubtotalSeleccionados();
    return subtotal * 0.15;
  }

  calcularTotalSeleccionados(): number {
    const subtotal = this.calcularSubtotalSeleccionados();
    const iva = this.calcularIVASeleccionados();
    return subtotal + iva;
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
    const totalSeleccionados = parseFloat(this.calcularTotalSeleccionados().toFixed(2)); 
    this.facturaForm.controls['monto'].setValue(totalSeleccionados);
  
    this.showFacturaModal = true;
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

  async onPagarConFactura(): Promise<void> {
    if (this.facturaForm.valid) {
      const monto = this.facturaForm.get('monto')?.value;

      const alimentosSeleccionados = this.alimentos.filter(alimento => alimento.seleccionado);
      const descripcionAlimentos = alimentosSeleccionados.length > 0 
      ? alimentosSeleccionados 
      : this.alimentos;

      const pago: PagoMesaModel = {
        clienteId: this.facturaForm.value.clienteId,
        nombreCliente: this.facturaForm.value.nombreCliente,
        correo: this.facturaForm.value.correo,
        monto: monto,
        formaPago: this.facturaForm.value.formaPago,
        fecha: new Date(),
        descripcionAlimentos,
      };
  
      const facturaData = {
        pago,
        numeroMesa: this.numeroMesa,
        meseroNombre: this.meseroNombre
      };
  
      //console.log('Factura registrada:', facturaData);
      await this.mesaService.registrarFactura(facturaData);
  
      const alimentosParaEliminar = this.alimentos.filter(alimento => alimento.seleccionado);
      const alimentosRestantes = alimentosParaEliminar.length > 0 
        ? this.alimentos.filter(alimento => !alimento.seleccionado) 
        : []; 
  
      await this.mesaService.actualizarMesaDespuesDePago(this.mesaId!, alimentosRestantes);
  
      this.alimentos = alimentosRestantes;
      this.closeFacturaModal();
      this.router.navigate(['/gestion-mesas']);
    }
  }

  openConsumidorFinalModal(): void {
    const totalSeleccionados = parseFloat(this.calcularTotalSeleccionados().toFixed(2)); 
    this.consumidorFinalForm.controls['monto'].setValue(totalSeleccionados);
  
    this.showConsumidorFinalModal = true;
  }

  closeConsumidorFinalModal(): void {
    this.showConsumidorFinalModal = false;
    this.consumidorFinalForm.reset({
      monto: 0,
      formaPago: FormaPago.EFECTIVO
    });
  }

  async onPagarConsumidorFinal(): Promise<void> {
    if (this.consumidorFinalForm.valid) {
      const monto = this.consumidorFinalForm.get('monto')?.value;

      const alimentosSeleccionados = this.alimentos.filter(alimento => alimento.seleccionado);
      const descripcionAlimentos = alimentosSeleccionados.length > 0 
      ? alimentosSeleccionados 
      : this.alimentos;

      const pago: PagoMesaModel = {
        clienteId: 'xxxxxxxxxx',
        nombreCliente: 'xxxxxxxxxx',
        correo: 'xxxxxxxxxx',
        monto: monto,
        formaPago: this.consumidorFinalForm.value.formaPago,
        fecha: new Date(),
        descripcionAlimentos,
      };
  
      const facturaData = {
        pago,
        numeroMesa: this.numeroMesa,
        meseroNombre: this.meseroNombre
      };
  
      //console.log('Factura para Consumidor Final registrada:', facturaData);
      await this.mesaService.registrarNotaDeVenta(facturaData)
  
      const alimentosParaEliminar = this.alimentos.filter(alimento => alimento.seleccionado);
      const alimentosRestantes = alimentosParaEliminar.length > 0 
        ? this.alimentos.filter(alimento => !alimento.seleccionado) 
        : []; 
  
      await this.mesaService.actualizarMesaDespuesDePago(this.mesaId!, alimentosRestantes);
  
      this.alimentos = alimentosRestantes;
      this.closeConsumidorFinalModal();
      this.router.navigate(['/gestion-mesas']);
    }
  }
}
