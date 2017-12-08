import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Injectable()
export class AuthGuard implements CanActivate {
    redirectUrl;

    constructor(
        private authService: AuthService,
        private router: Router,
        private flashMsg: FlashMessagesService
    ) {}

    canActivate(router: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      if (this.authService.loggedIn()) {
        return true;
      } else {
        this.redirectUrl = state.url; // <-- saves url user tried to access loggedout
        this.router.navigate(['/login']);
        /* this.flashMsg.show('You are not logged in.', { cssClass: 'alert alert-danger' });
        this is implemented in login component instead. */
        return false;
      }
    }
}
