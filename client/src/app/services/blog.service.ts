import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class BlogService {

  options;
  backend = this.authService.backend;

  constructor(
    private authService: AuthService,,
    private http: Http
  ) { }

  createAuthHeaders() {
    this.authService.loadToken();
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json',
        'authorization': this.authService.authToken
      })
    });
  }

  // CREATE BLOG (POST)
  newBlog(blog) {
    this.createAuthHeaders();
    return this.http.post(this.backend + '/blogs/newblog', blog, this.options).map(res => res.json());
  }
}
