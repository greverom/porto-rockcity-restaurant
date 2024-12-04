import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectIsLoggedIn } from '../../../store/user/user.selectors';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
      CommonModule,
      RouterModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  isLoggedIn$: Observable<boolean> = new Observable();

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.isLoggedIn$ = this.store.select(selectIsLoggedIn); 
  }
}
