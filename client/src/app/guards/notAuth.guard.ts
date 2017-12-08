import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Injectable()
export class NotAuthGuard implements CanActivate {
  redirectUrl;

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMsg: FlashMessagesService
  ) { }

  canActivate() {
    if (this.authService.loggedIn()) {
      this.router.navigate(['/']);
      this.flashMsg.show('What are you doing? You are already logged in.', { cssClass: 'alert alert-info' });
      return false;
    } else {
      return true;
    }
  }
}
