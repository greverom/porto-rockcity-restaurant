import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsDarkTheme } from './store/theme/theme.selectors';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  constructor(private store: Store, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.store.select(selectIsDarkTheme).subscribe((isDarkTheme) => {
        const theme = isDarkTheme ? 'dark' : 'light';
        document.body.setAttribute('data-bs-theme', theme);
      });
    }
  }

}