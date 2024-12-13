import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet
],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})
export class ReportesComponent {

  constructor(private router: Router){}

  irAFacturas(): void {
    this.router.navigate(['/reportes/facturas']);
  }

  irABalances():void{
    this.router.navigate(['/reportes/balances']);
  }

}
