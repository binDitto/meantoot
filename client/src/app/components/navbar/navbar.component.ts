import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages'; // <-- npm install angular2-flash-messages --save
import { Observable } from 'rxjs/Observable';

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
    this.authService.getUsername.subscribe( name => {
      this.username = name;
    });
  }

  // LOGOUT NAV
  onLogoutClick() {
    this.authService.logOut();
    this.username = null;
    this.flashMsg.show('You are logged out', { cssClass: 'alert-info'});
    this.router.navigate(['/']);
  }

}
