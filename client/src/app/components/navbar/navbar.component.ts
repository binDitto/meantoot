import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages'; // <-- npm install angular2-flash-messages --save

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  username;

  constructor(
    private router: Router,
    private authService: AuthService,
    private flashMsg: FlashMessagesService
  ) { }

  ngOnInit() {
    if (this.authService.loggedIn()) {
      this.authService.getProfile().subscribe(profile => {
        this.username = profile.user.username;
      });
    }
  }

  // LOGOUT NAV
  onLogoutClick() {
    this.authService.logOut();
    this.flashMsg.show('You are logged out', { cssClass: 'alert-info'});
    this.router.navigate(['/']);
  }

}
