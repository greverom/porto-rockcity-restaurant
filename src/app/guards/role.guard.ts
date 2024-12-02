import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectUserData } from '../store/user/user.selectors';
import { Router } from '@angular/router';
import { map, take } from 'rxjs/operators';

export const roleGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);
  const allowedRoles: string[] = route.data?.['roles'] || []; 

  return store.select(selectUserData).pipe(
    take(1),
    map((userData) => {
      const userRole = userData?.rol?.toUpperCase() || '';
      if (!allowedRoles.includes(userRole)) {
        router.navigate(['/home']); 
        return false;
      }
      return true;
    })
  );
};