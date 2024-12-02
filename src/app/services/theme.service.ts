import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { setTheme } from '../store/theme/theme.actions';


@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  constructor(private store: Store) {}

  loadTheme() {
    const isDarkTheme = localStorage.getItem('theme') === 'dark';
    this.store.dispatch(setTheme({ isDarkTheme }));
  }
}