import { Injectable } from '@angular/core';

// USE ANGULAR HTTP TO SPEAK TO BACKEND
import { Http, Headers, RequestOptions } from '@angular/http';
// import rxjs to use map operator
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

  backend = 'http://localhost:8080';
  user;
  options;
  authToken;

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
}
