import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule, NgClass, NgIf} from "@angular/common";

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  @Input() showModal: boolean = false;
  @Input() message: string = 'An error occurred'; // Default message
  @Input() isError: boolean = true;  // Flag to determine error or success
  @Input() isSuccess: boolean = false;  // Success flag for success message
  @Input() isConfirm: boolean = false;
  @Input() showRedirectButton: boolean = false;
  @Input() autoCloseDuration: number = 0; 

  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>(); 
  @Output() cancel = new EventEmitter<void>();
  @Output() redirect = new EventEmitter<void>(); 
  shake: boolean = false;

  ngOnChanges() {
    if (this.isError && this.showModal) {
      this.shake = true;
      setTimeout(() => {
        this.shake = false;
      }, 500); 
    }

    if (this.showModal && this.autoCloseDuration > 0) {
      setTimeout(() => {
        this.closeModal();
      }, this.autoCloseDuration);
    }
  }
  
  closeModal() {
    this.showModal = false;
    this.close.emit();  // Notify parent component to close the modal
  }

  confirmAction() {
    this.confirm.emit();
    this.closeModal();
  }

  cancelAction() {
    this.cancel.emit();
    this.closeModal();
  }

  redirectAction() {
    this.redirect.emit(); 
    this.closeModal();
  }
}
