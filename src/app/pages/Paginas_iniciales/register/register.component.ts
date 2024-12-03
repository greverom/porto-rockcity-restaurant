import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalDto, modalInitializer } from '../../../components/modal/modal.dto';
import { ModalComponent } from '../../../components/modal/modal.component';
import { AuthService } from '../../../services/authentication/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  modal: ModalDto = modalInitializer();

  constructor(private fb: FormBuilder, private authService: AuthService ) {
    this.registerForm = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      cedula: ['', Validators.required],
      rol: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordsMatch });
  }

  passwordsMatch(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { notMatching: true };
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
  
      this.modal = {
        ...modalInitializer(),
        show: true,
        message: 'Formulario inválido. Por favor, verifica los campos.',
        isError: true,
        autoCloseDuration: 2500,
      };
      return;
    }
  
    const formData = this.registerForm.value;
  
    this.authService.register(formData).then(() => {
      this.modal = {
        ...modalInitializer(),
        show: true,
        message: 'Registro exitoso. El usuario ha sido creado correctamente. Cerrando sesión...',
        isSuccess: true,
        autoCloseDuration: 2500,
      };
  
      this.registerForm.reset();
  
      setTimeout(() => {
        this.authService.logout(); 
      }, 2000);
    }).catch((error) => {
      this.modal = {
        ...modalInitializer(),
        show: true,
        message: `Error al registrar: ${error.message}`,
        isError: true,
        autoCloseDuration: 2500,
      };
    });
  }

  showErrorModal(message: string) {
    this.modal = {
      ...modalInitializer(),
      show: true,
      message: message,
      isError: true,
    };
  }

  closeModal() {
    this.modal.show = false;
  }
}
