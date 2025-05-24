import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, User } from '../services/auth.service'; // Adjust path as necessary

export const roleGuard = (allowedRoles: Array<User['type_personnel']>): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const currentUser = authService.currentUserValue;

    if (!authService.isAuthenticated() || !currentUser) {
      router.navigate(['/login']); // Or your default unauthenticated route
      return false;
    }

    if (allowedRoles.includes(currentUser.type_personnel)) {
      return true;
    }

    // If user role is not allowed, redirect to a default page or an unauthorized page
    // For now, redirecting to a generic route, you might want a specific 'unauthorized' component/route
    router.navigate(['/']); // Or perhaps a 'dashboard' or 'home' route accessible by all logged-in users
    return false;
  };
}; 