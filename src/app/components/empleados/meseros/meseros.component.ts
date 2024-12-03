import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuarios/usuario.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-meseros',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './meseros.component.html',
  styleUrl: './meseros.component.css'
})
export class MeserosComponent implements OnInit {
  empleados: any[] = [];

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.usuarioService.getEmpleados().subscribe((empleados) => {
      this.empleados = empleados;
      console.log('Empleados cargados:', this.empleados);
    });
  }
}
