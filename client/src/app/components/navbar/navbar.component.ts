import { Component, OnInit, Input } from '@angular/core';
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

  @Input() username;

  constructor(
    private router: Router,
    private authService: AuthService,
    private flashMsg: FlashMessagesService
  ) {}

  ngOnInit() {
    // Listen to emitter to update username
    this.authService.getUsername.subscribe( name => {
      this.username = name;
    });

    // Keep username pulled in.
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username;
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
