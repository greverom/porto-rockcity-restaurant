import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { selectIsDarkTheme } from '../../store/theme/theme.selectors';
import { Store } from '@ngrx/store';
import { toggleTheme } from '../../store/theme/theme.actions';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-switcher.component.html',
  styleUrl: './theme-switcher.component.css'
})

export class ThemeSwitcherComponent implements OnInit {
  isDarkTheme$: Observable<boolean>;
  isDarkTheme: boolean = false; 

  constructor(
    private store: Store,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isDarkTheme$ = this.store.select(selectIsDarkTheme);
  }

  ngOnInit() {
    this.isDarkTheme$.subscribe((isDark) => {
      this.isDarkTheme = isDark;
      if (isPlatformBrowser(this.platformId)) {
        const theme = this.isDarkTheme ? 'dark' : 'light';
        document.body.setAttribute('data-bs-theme', theme);
      }
    });
  }

  toggleTheme() {
    this.store.dispatch(toggleTheme());
  }
}
