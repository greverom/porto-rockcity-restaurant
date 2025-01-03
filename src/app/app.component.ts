import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { Observable, of } from 'rxjs';
import { selectIsLoggedIn, selectUserData } from './store/user/user.selectors';
import { AuthService } from './services/authentication/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SpinnerComponent,
    SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  isLoggedIn$: Observable<boolean> = new Observable();
  userData$: Observable<any> = of(null);
  isSidebarOpen = true;

  constructor(private store: Store, @Inject(PLATFORM_ID) private platformId: Object,  private authService: AuthService) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.authService.restoreSession();
  
      this.isLoggedIn$ = this.store.select(selectIsLoggedIn);
  
      this.store.select(selectUserData).subscribe((userData) => {
       // console.log(userData);
      });
    }
  }

  onSidebarToggle(isOpen: boolean): void {
    this.isSidebarOpen = isOpen;
  }

}