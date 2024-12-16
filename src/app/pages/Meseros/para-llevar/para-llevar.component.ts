import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlimentoPedidoModel, PedidoParaLlevarModel } from '../../../models/para-llevar';
import { Store } from '@ngrx/store';
import { selectUserData } from '../../../store/user/user.selectors';
import { ParaLlevarService } from '../../../services/para-llevar/para-llevar.service';

@Component({
  selector: 'app-para-llevar',
  standalone: true,
  imports: [
      CommonModule,
      FormsModule
  ],
  templateUrl: './para-llevar.component.html',
  styleUrl: './para-llevar.component.css'
})
export class ParaLlevarComponent implements OnInit {
  meseroId: string | null = null; 
  showCrearPedidoModal = false; 
  clienteNombre: string = ''; 
  telefono: string = '';
  pedidos: PedidoParaLlevarModel[] = [];
  pedidoSeleccionado: PedidoParaLlevarModel | null = null;

  isAlimentoFormVisible = false;
  alimentoSeleccionado: string = '';
  alimentosFiltrados: AlimentoPedidoModel[] = [];
  selectedAlimento: AlimentoPedidoModel | null = null;

  constructor(
    private paraLlevarService: ParaLlevarService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.store.select(selectUserData).subscribe((userData) => {
      if (userData?.id) {
        this.meseroId = userData.id;
        this.loadPedidos();
      }
    });
  }
  

  async seleccionarPedido(pedidoId: string): Promise<void> {
    try {
      this.pedidoSeleccionado = await this.paraLlevarService.getPedidoById(pedidoId);
      //console.log(this.pedidoSeleccionado);
    } catch (error) {
      console.error('Error al seleccionar el pedido:', error);
    }
  }

  async loadPedidos(): Promise<void> {
    if (!this.meseroId) {
      console.error('El ID del mesero no está disponible.');
      return;
    }

    try {
      this.pedidos = await this.paraLlevarService.getPedidosByMeseroId(
        this.meseroId
      );
      //console.log(this.pedidos);
    } catch (error) {
      console.error('Error al cargar los pedidos:', error);
    }
  }

  abrirModalCrearPedido(): void {
    this.clienteNombre = ''; 
    this.showCrearPedidoModal = true;
  }

  cerrarModalCrearPedido(): void {
    this.showCrearPedidoModal = false;
  }

  async crearPedido(): Promise<void> {
  if (!this.clienteNombre.trim()) {
    console.error('El nombre del cliente es obligatorio.');
    return;
  }

  if (!this.meseroId) {
    console.error('El ID del mesero no está disponible.');
    return;
  }

  const nuevoPedido: PedidoParaLlevarModel = {
    id: '', 
    esParaLlevar: true,
    meseroId: this.meseroId,
    clienteNombre: this.clienteNombre,
    telefono: this.telefono,
    alimentos: [], 
    costoAdicional: 0,
    total: 0,
    fechaUltimaActualizacion: new Date(),
  };

  try {
    const pedidoCreadoId = await this.paraLlevarService.createPedido(nuevoPedido);

    this.pedidos.push({
      ...nuevoPedido,
      id: pedidoCreadoId,
    });

    //console.log(nuevoPedido);

    this.clienteNombre = '';
    this.telefono = '';
    this.cerrarModalCrearPedido();
  } catch (error) {
    console.error('Error al crear el pedido:', error);
  }
}

abrirModalAgregarAlimentos(): void {
  //console.log('Abrir modal para agregar alimentos');
}

toggleAlimentoForm(): void {
  this.isAlimentoFormVisible = !this.isAlimentoFormVisible;
}

async onBuscarAlimento(event: Event): Promise<void> {
  const query = (event.target as HTMLInputElement).value.trim();
  if (query.length > 0) {
    try {
      const alimentos = await this.paraLlevarService.buscarAlimentosPorNombre(query);
      
      this.alimentosFiltrados = alimentos.map(alimento => ({
        alimentoId: alimento.id,               
        nombre: alimento.nombre,             
        cantidad: 1,                         
        precioUnitario: alimento.precio,     
        subtotal: alimento.precio,           
        activo: alimento.activo,             
        listo: false                         
      }));
    } catch (error) {
      console.error('Error al buscar alimentos:', error);
    }
  } else {
    this.alimentosFiltrados = [];
  }
}

seleccionarAlimento(alimento: AlimentoPedidoModel): void {
  this.selectedAlimento = alimento;
  this.alimentoSeleccionado = alimento.nombre;
  this.alimentosFiltrados = []; 
}

async onAgregarAlimento(): Promise<void> {
  if (!this.pedidoSeleccionado || !this.selectedAlimento) {
    console.error('No hay pedido o alimento seleccionado.');
    return;
  }

  try {
    if (!this.pedidoSeleccionado.alimentos) {
      this.pedidoSeleccionado.alimentos = [];
    }

    const nuevoAlimento: AlimentoPedidoModel = {
      ...this.selectedAlimento,
      subtotal: this.selectedAlimento.precioUnitario * (this.selectedAlimento.cantidad || 1),
    };

    this.pedidoSeleccionado.alimentos.push(nuevoAlimento);
    this.pedidoSeleccionado.total += nuevoAlimento.subtotal;

    await this.paraLlevarService.updatePedido(this.pedidoSeleccionado.id, {
      alimentos: this.pedidoSeleccionado.alimentos,
      total: this.pedidoSeleccionado.total,
    });

    //console.log('Alimento agregado correctamente:', nuevoAlimento);

    this.selectedAlimento = null;
    this.alimentoSeleccionado = '';
    this.isAlimentoFormVisible = false; 
  } catch (error) {
    console.error('Error al agregar el alimento:', error);
  }
}

async onEliminarAlimento(index: number): Promise<void> {
  if (!this.pedidoSeleccionado) {
    console.error('No hay pedido seleccionado.');
    return;
  }

  try {
    const alimentoEliminado = this.pedidoSeleccionado.alimentos.splice(index, 1)[0];
    this.pedidoSeleccionado.total -= alimentoEliminado.subtotal;

    await this.paraLlevarService.updatePedido(this.pedidoSeleccionado.id, {
      alimentos: this.pedidoSeleccionado.alimentos,
      total: this.pedidoSeleccionado.total,
    });

    //console.log('Alimento eliminado correctamente:', alimentoEliminado);
  } catch (error) {
    console.error('Error al eliminar el alimento:', error);
  }
}
}
