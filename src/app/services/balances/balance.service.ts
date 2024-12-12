import { Injectable } from '@angular/core';
import { Database, ref, query, orderByChild, startAt, endAt, get } from '@angular/fire/database';

@Injectable({
  providedIn: 'root',
})
export class BalanceService {
  constructor(private db: Database) {}

  async getFacturasPorFecha(fecha: string): Promise<any[]> {
    const startDate = fecha;
    const endDate = this.incrementarUnDia(fecha);

    const facturasRef = ref(this.db, 'pagos/facturas');
    const facturasQuery = query(facturasRef, orderByChild('fecha'), startAt(startDate), endAt(endDate));

    const snapshot = await get(facturasQuery);
    const facturas: any[] = [];
    snapshot.forEach((childSnapshot) => {
      facturas.push(childSnapshot.val());
    });

    return facturas;
  }

  calcularBalanceDiario(facturas: any[]) {
    let totalVentas = 0;
    const metodosDePago: { [key: string]: number } = {};
    const productosVendidos: { [key: string]: number } = {};

    facturas.forEach((factura) => {
      totalVentas += factura.pago.monto;

      // Métodos de pago
      const metodoPago = factura.pago.formaPago;
      if (metodosDePago[metodoPago]) {
        metodosDePago[metodoPago] += factura.pago.monto;
      } else {
        metodosDePago[metodoPago] = factura.pago.monto;
      }

      // Productos vendidos
      factura.pago.descripcionAlimentos.forEach((alimento: any) => {
        if (productosVendidos[alimento.nombre]) {
          productosVendidos[alimento.nombre] += alimento.cantidad;
        } else {
          productosVendidos[alimento.nombre] = alimento.cantidad;
        }
      });
    });

    return { totalVentas, metodosDePago, productosVendidos };
  }

  private incrementarUnDia(fecha: string): string {
    const date = new Date(fecha);
    date.setDate(date.getDate() + 1);
    return date.toISOString();
  }
}