import { Injectable } from '@angular/core';
import { Database, ref, get } from '@angular/fire/database';

@Injectable({
  providedIn: 'root',
})
export class BalanceService {
  constructor(private db: Database) {}

  // Método para obtener el total de facturas por día
  async getFacturasPorFecha(fecha: string): Promise<{ total: number; cantidad: number; facturas: any[] }> {
    const facturasRef = ref(this.db, 'pagos/facturas');
    const snapshot = await get(facturasRef);
  
    let total = 0;
    let cantidad = 0;
    const facturas: any[] = []; // Almacenar facturas filtradas
  
    snapshot.forEach((childSnapshot) => {
      const factura = childSnapshot.val();
  
      // Convertir la fecha UTC a la zona horaria local (UTC-5)
      const fechaFacturaUTC = new Date(factura.fecha);
      const fechaFacturaLocal = new Date(fechaFacturaUTC.getTime() - 5 * 60 * 60 * 1000);
      const fechaLocalString = fechaFacturaLocal.toISOString().split('T')[0];
  
      if (fechaLocalString === fecha) {
        total += factura.pago.monto || 0; // Suma el monto
        cantidad++; // Incrementa la cantidad de facturas
        facturas.push(factura); // Almacena la factura filtrada
      }
    });
  
    return { total, cantidad, facturas };
  }

  // Método para obtener el total de notas de venta por día
  async getNotasDeVentaPorFecha(fecha: string): Promise<{ total: number; cantidad: number; notas: any[] }> {
    const notasRef = ref(this.db, 'pagos/notasDeVenta');
    const snapshot = await get(notasRef);
  
    let total = 0;
    let cantidad = 0;
    const notas: any[] = []; // Almacenar notas de venta filtradas
  
    snapshot.forEach((childSnapshot) => {
      const nota = childSnapshot.val();
  
      // Convertir la fecha UTC a la zona horaria local (UTC-5)
      const fechaNotaUTC = new Date(nota.fecha);
      const fechaNotaLocal = new Date(fechaNotaUTC.getTime() - 5 * 60 * 60 * 1000);
      const fechaLocalString = fechaNotaLocal.toISOString().split('T')[0];
  
      if (fechaLocalString === fecha) {
        total += nota.pago.monto || 0; // Suma el monto
        cantidad++; // Incrementa la cantidad de notas
        notas.push(nota); // Almacena la nota filtrada
      }
    });
  
    return { total, cantidad, notas };
  }


  // Método auxiliar para incrementar un día
  private incrementarUnDia(fecha: string): string {
    const date = new Date(fecha);
    date.setDate(date.getDate() + 1);
    return date.toISOString();
  }
}