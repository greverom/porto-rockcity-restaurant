import { Component, OnInit } from '@angular/core';
import { ReservaModel } from '../../../models/mesa';
import { MesaService } from '../../../services/mesas/mesa.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [
      CommonModule
  ],
  templateUrl: './reservas.component.html',
  styleUrl: './reservas.component.css'
})
export class ReservasComponent implements OnInit {
  reservas: ReservaModel[] = [];
  currentMonthDays: (number | string)[] = [];
  selectedMonth!: string;
  selectedYear!: number;
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
      this.reservas = await this.mesaService.getReservas();
      console.log('Reservas obtenidas:', this.reservas);
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

  prevMonth(): void {
    const current = new Date(this.selectedYear, this.monthNames.indexOf(this.selectedMonth), 1);
    current.setMonth(current.getMonth() - 1);

    const today = new Date();
    const minDate = new Date(today.getFullYear(), today.getMonth(), 1);
    if (current >= minDate) {
      this.selectedMonth = this.monthNames[current.getMonth()];
      this.selectedYear = current.getFullYear();
      this.generateDaysForCurrentMonth();
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
    }
  }
}
