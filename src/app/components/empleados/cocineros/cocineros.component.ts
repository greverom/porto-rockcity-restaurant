import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuarios/usuario.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cocineros',
  standalone: true,
  imports: [
      CommonModule
  ],
  templateUrl: './cocineros.component.html',
  styleUrl: './cocineros.component.css'
})
export class CocinerosComponent implements OnInit {
  cocineros: any[] = [];

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.usuarioService.getCocineros().subscribe((cocineros) => {
      this.cocineros = cocineros;
    });
  }
}
