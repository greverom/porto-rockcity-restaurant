import { Injectable } from '@angular/core';
import { Database, ref, query, orderByChild, startAt, endAt, get } from '@angular/fire/database';

@Injectable({
  providedIn: 'root',
})
export class BalanceService {
  constructor(private db: Database) {}

  // Método para obtener el total de facturas por día
  async getTotalFacturasPorFecha(fecha: string): Promise<number> {
    const facturasRef = ref(this.db, 'pagos/facturas');
    const snapshot = await get(facturasRef);
  
    let total = 0;
    snapshot.forEach((childSnapshot) => {
      const factura = childSnapshot.val();
      
      // Convertir la fecha UTC a la zona horaria local (UTC-5)
      const fechaFacturaUTC = new Date(factura.fecha);
      const fechaFacturaLocal = new Date(fechaFacturaUTC.getTime() - 5 * 60 * 60 * 1000);
      const fechaLocalString = fechaFacturaLocal.toISOString().split('T')[0];
  
      //console.log('Fecha Local:', fechaLocalString, 'Fecha Seleccionada:', fecha); 
  
      if (fechaLocalString === fecha) {
        total += factura.pago.monto || 0; 
      }
    });
  
    //console.log('Total Facturas:', total); 
    return total;
  }

  // Método para obtener el total de notas de venta por día
  async getTotalNotasDeVentaPorFecha(fecha: string): Promise<number> {
    const notasRef = ref(this.db, 'pagos/notasDeVenta');
    const snapshot = await get(notasRef);
  
    let total = 0;
    snapshot.forEach((childSnapshot) => {
      const nota = childSnapshot.val();
  
      // Convertir la fecha UTC a la zona horaria local (UTC-5)
      const fechaNotaUTC = new Date(nota.fecha);
      const fechaNotaLocal = new Date(fechaNotaUTC.getTime() - 5 * 60 * 60 * 1000);
      const fechaLocalString = fechaNotaLocal.toISOString().split('T')[0]; 
  
      //console.log('Fecha Local:', fechaLocalString, 'Fecha Seleccionada:', fecha); 
  
      if (fechaLocalString === fecha) {
        total += nota.pago.monto || 0; 
      }
    });
  
   // console.log('Total Notas de Venta:', total); 
    return total;
  }

  // Método auxiliar para incrementar un día
  private incrementarUnDia(fecha: string): string {
    const date = new Date(fecha);
    date.setDate(date.getDate() + 1);
    return date.toISOString();
  }
}