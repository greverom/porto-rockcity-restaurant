import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLinkActive, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-balances',
  standalone: true,
  imports: [ 
      CommonModule,
      RouterOutlet,
      RouterLinkActive
  ],
  templateUrl: './balances.component.html',
  styleUrl: './balances.component.css'
})
export class BalancesComponent {

  constructor( private router: Router
  ){}


  irABalanceDiario():void {
    this.router.navigate(['balances/diario'])
  }

  irABalanceSemanal():void{
    this.router.navigate(['balances/semanal'])
  }

}
