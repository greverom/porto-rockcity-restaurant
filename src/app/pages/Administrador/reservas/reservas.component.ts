import { Component, OnInit } from '@angular/core';
import { ReservaModel } from '../../../models/mesa';
import { MesaService } from '../../../services/mesas/mesa.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [
      CommonModule,
  ],
  templateUrl: './reservas.component.html',
  styleUrl: './reservas.component.css'
})
export class ReservasComponent implements OnInit {
  reservas: ReservaModel[] = [];
  reservasFiltradas: ReservaModel[] = [];
  currentMonthDays: (number | string)[] = [];
  selectedMonth!: string;
  selectedYear!: number;
  selectedDay: number | null = null;
  selectedTextDay: { day: number | null; month: string | null } = { day: null, month: null };
  monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  daysInitials = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

  constructor(private mesaService: MesaService) {}

  async ngOnInit(): Promise<void> {
    await this.loadReservas();
    this.initializeDate();
    this.generateDaysForCurrentMonth();
  }

  async loadReservas(): Promise<void> {
    try {
      const reservas = await this.mesaService.getReservas();
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalizar la fecha actual
  
      // Iterar y procesar cada reserva
      for (const reserva of reservas) {
        if (!reserva.fechaReserva) {
          continue; 
        }
  
        const fechaReserva = new Date(reserva.fechaReserva);
        fechaReserva.setHours(0, 0, 0, 0); // Normalizar la fecha de la reserva
  
        if (fechaReserva.getTime() < today.getTime()) {
          await this.mesaService.deleteReserva(reserva.id);
          continue; 
        }
  
        if (reserva.mesaId) {
          const mesa = await this.mesaService.getMesaById(reserva.mesaId);
          reserva.mesaNumero = mesa ? mesa.numero : undefined;
        }
      }
  
      this.reservas = reservas.filter(reserva => {
        const fechaReserva = reserva.fechaReserva ? new Date(reserva.fechaReserva) : null;
        return fechaReserva && fechaReserva.getTime() >= today.getTime();
      });
  
      //console.log('Reservas cargadas y actualizadas:', this.reservas);
    } catch (error) {
      console.error('Error al cargar las reservas:', error);
    }
  }

  initializeDate(): void {
    const today = new Date();
    this.selectedMonth = this.monthNames[today.getMonth()];
    this.selectedYear = today.getFullYear();
  }

  generateDaysForCurrentMonth(): void {
    const monthIndex = this.monthNames.indexOf(this.selectedMonth);
    const daysInMonth = new Date(this.selectedYear, monthIndex + 1, 0).getDate();
    const firstDayOfWeek = new Date(this.selectedYear, monthIndex, 1).getDay();
    const adjustedFirstDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; 
    this.currentMonthDays = Array.from({ length: adjustedFirstDay }, () => '');
    this.currentMonthDays = this.currentMonthDays.concat(
      Array.from({ length: daysInMonth }, (_, i) => i + 1)
    );
  }

  esDiaConReserva(day: number | string): boolean {
    if (typeof day !== 'number') {
      return false;
    }

    const monthIndex = this.monthNames.indexOf(this.selectedMonth);

    return this.reservas.some(reserva => {
      if (!reserva.fechaReserva) {
        return false;
      }

      const fechaReserva = new Date(reserva.fechaReserva);
      return (
        fechaReserva.getDate() === day &&
        fechaReserva.getMonth() === monthIndex &&
        fechaReserva.getFullYear() === this.selectedYear
      );
    });
  }

  seleccionarDia(day: number | string): void {
    if (typeof day === 'number') {
      this.selectedDay = day;
      this.selectedTextDay = { day, month: this.selectedMonth };
  
      const monthIndex = this.monthNames.indexOf(this.selectedMonth);
      this.reservasFiltradas = this.reservas.filter(reserva => {
        if (!reserva.fechaReserva) {
          return false; 
        }
  
        const fechaReserva = new Date(reserva.fechaReserva);
        return (
          fechaReserva.getDate() === day &&
          fechaReserva.getMonth() === monthIndex &&
          fechaReserva.getFullYear() === this.selectedYear
        );
      });
      
    }
  }

  prevMonth(): void {
    const current = new Date(this.selectedYear, this.monthNames.indexOf(this.selectedMonth), 1);
    current.setMonth(current.getMonth() - 1);

    const today = new Date();
    const minDate = new Date(today.getFullYear(), today.getMonth(), 1);
    if (current >= minDate) {
      this.selectedMonth = this.monthNames[current.getMonth()];
      this.selectedYear = current.getFullYear();
      this.generateDaysForCurrentMonth();
      this.selectedDay = null;
    }
  }

  nextMonth(): void {
    const current = new Date(this.selectedYear, this.monthNames.indexOf(this.selectedMonth), 1);
    current.setMonth(current.getMonth() + 1);

    const today = new Date();
    const maxDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    if (current <= maxDate) {
      this.selectedMonth = this.monthNames[current.getMonth()];
      this.selectedYear = current.getFullYear();
      this.generateDaysForCurrentMonth();
      this.selectedDay = null;
    }
  }
}
