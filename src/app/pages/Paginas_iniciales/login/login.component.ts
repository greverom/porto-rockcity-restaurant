import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent } from '../../../components/modal/modal.component';
import { ModalDto, modalInitializer } from '../../../components/modal/modal.dto';
import { AuthService } from '../../../services/authentication/auth.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword: boolean = false;
  modal: ModalDto = modalInitializer();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,  // Inyectamos el servicio AuthService
    private router: Router,
    private store: Store
  ) {
    // Creamos el formulario con validación
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],  // Validación del email
      password: ['', [Validators.required]]  // Validación de la contraseña
    });
  }

  // Toggle para la visibilidad de la contraseña
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Método que se ejecuta al enviar el formulario
  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); // Marcar todos los campos como tocados para mostrar los errores
      this.modal = {
        ...modalInitializer(),
        show: true,
        message: 'Formulario inválido. Por favor, verifica los campos.',
        isError: true,
        autoCloseDuration: 2500
      };
      return;
    }

    const { email, password } = this.loginForm.value;

    // Llamar al servicio de login
    this.authService.login(email, password).then(() => {
      this.modal = {
        ...modalInitializer(),
        show: true,
        message: 'Login exitoso.',
        isSuccess: true,
        autoCloseDuration: 2500
      };
      this.router.navigate(['/home']); // Redirigir al dashboard o página principal
      this.loginForm.reset();
    }).catch((error) => {
      this.modal = {
        ...modalInitializer(),
        show: true,
        message: `Error al iniciar sesión: ${error.message}`,
        isError: true,
        autoCloseDuration: 2500
      };
    });
  }

  // Cerrar el modal de error
  closeModal() {
    this.modal.show = false;
  }
}
