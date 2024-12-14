import { Injectable } from '@angular/core';
import { Database, ref, push, set, query, orderByChild, equalTo, get } from '@angular/fire/database';
import { PedidoParaLlevarModel } from '../../models/para-llevar';

@Injectable({
  providedIn: 'root',
})
export class ParaLlevarService {
  constructor(private db: Database) {} 

  async createPedido(
    pedido: Omit<PedidoParaLlevarModel, 'id' | 'fechaUltimaActualizacion'>
  ): Promise<string> {
    const paraLlevarRef = ref(this.db, 'para-llevar'); 
    const newPedidoRef = push(paraLlevarRef); 
  
    const pedidoData: PedidoParaLlevarModel = {
      ...pedido,
      id: newPedidoRef.key || '',
      fechaUltimaActualizacion: new Date(),
    };
  
    await set(newPedidoRef, pedidoData); 
  
    return newPedidoRef.key || ''; 
  }

  async getPedidosByMeseroId(meseroId: string): Promise<PedidoParaLlevarModel[]> {
    try {
      const paraLlevarRef = ref(this.db, 'para-llevar'); 
      const pedidosQuery = query(
        paraLlevarRef,
        orderByChild('meseroId'), 
        equalTo(meseroId) 
      );

      const snapshot = await get(pedidosQuery); 

      if (snapshot.exists()) {
        const pedidos = Object.values(snapshot.val()) as PedidoParaLlevarModel[]; 
        return pedidos;
      } else {
        return []; 
      }
    } catch (error) {
      console.error('Error al obtener pedidos por meseroId:', error);
      throw error; 
    }
  }

  async getPedidoById(pedidoId: string): Promise<PedidoParaLlevarModel | null> {
    try {
      const pedidoRef = ref(this.db, `para-llevar/${pedidoId}`); 
      const snapshot = await get(pedidoRef); 

      if (snapshot.exists()) {
        return snapshot.val() as PedidoParaLlevarModel; 
      } else {
        console.warn(`No se encontró el pedido con ID: ${pedidoId}`);
        return null; 
      }
    } catch (error) {
      console.error('Error al obtener el pedido por ID:', error);
      throw error; 
    }
  }
}