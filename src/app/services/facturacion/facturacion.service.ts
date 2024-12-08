import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FacturacionService {
  private mesaIdSubject = new BehaviorSubject<string | null>(null);

  mesaId$: Observable<string | null> = this.mesaIdSubject.asObservable();

  setMesaId(mesaId: string): void {
    this.mesaIdSubject.next(mesaId);
  }
  
}