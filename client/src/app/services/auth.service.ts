import { Injectable, EventEmitter, Output } from '@angular/core';

// USE ANGULAR HTTP TO SPEAK TO BACKEND
import { Http, Headers, RequestOptions } from '@angular/http';
// import rxjs to use map operator
import 'rxjs/add/operator/map';

import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthService {

  backend = 'http://localhost:8080';
  options;
  user; // <-- will be set to current logged in user
  authToken; // <-- will be set to current logged in user token
  @Output() getUsername: EventEmitter<string> = new EventEmitter(); // Will Emit the username for components to "listen" or "subscribe" to.

  // Remember to also import httpmodule in appmodule to make http work.
  constructor(
    private http: Http
  ) { }

// REGISTER API - Create User Api
  registerUser(user) {
    return this.http.post(this.backend + '/authentication/register', user).map(res => res.json());
  }

  checkUsername(username) {
    return this.http.get(this.backend + '/authentication/checkUsername/' + username).map(res => res.json());
  }

  checkEmail(email) {
    return this.http.get(this.backend + '/authentication/checkEmail/' + email).map(res => res.json());
  }

// LOGIN GET API
  login(user) {
    return this.http.post(this.backend + '/authentication/login', user).map(res => res.json());
  }

  // -- store user data.token in browser's localStorage for use
  storeUserData(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
    this.getUsername.emit(user.username); // Activate emitting of logged in user username
  }
  // -- check function for checking if user is logged in
  loggedIn() {
    return tokenNotExpired(); // <-- npm install angular2-jwt --save | to use
  }

  logOut() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

// PROFILE GET API
  getProfile() {
    this.createAuthHeaders();
    return this.http.get(this.backend + '/authentication/profile', this.options).map(res => res.json());
  }
    // -- create headers to send with get profile req to backend, and token
    loadToken() {
      const token = localStorage.getItem('token');
      this.authToken = token;
    }

    createAuthHeaders() {
      this.loadToken();
      this.options = new RequestOptions({
        headers: new Headers({
          'Content-Type': 'application/json',
          'authorization': this.authToken
        })
      });
    }
}
