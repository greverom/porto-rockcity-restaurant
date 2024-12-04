import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectIsLoggedIn } from '../store/user/user.selectors';
import { Router } from '@angular/router';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectIsLoggedIn).pipe(
    take(1), 
    map((isLoggedIn) => {
      if (!isLoggedIn) {
        router.navigate(['/home']); 
        return false;
      }
      return true;
    })
  );
};