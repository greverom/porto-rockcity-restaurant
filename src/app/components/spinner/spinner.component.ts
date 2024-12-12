import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { selectIsLoading } from '../../store/spinner/spinner.selector';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css'
})
export class SpinnerComponent {
  isLoading$ = this.store.select(selectIsLoading); 

  constructor(private store: Store) {}
}
