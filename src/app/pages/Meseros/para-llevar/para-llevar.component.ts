import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PedidoParaLlevarModel } from '../../../models/para-llevar';
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
  pedidos: PedidoParaLlevarModel[] = [];
  pedidoSeleccionado: PedidoParaLlevarModel | null = null;

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
      this.pedidoSeleccionado = await this.paraLlevarService.getPedidoById(
        pedidoId
      );
      console.log(this.pedidoSeleccionado);
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
    this.cerrarModalCrearPedido();
  } catch (error) {
    console.error('Error al crear el pedido:', error);
  }
}
}
