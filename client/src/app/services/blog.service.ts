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

  // POST BLOG (POST)
  newBlog(blog) {
    this.createAuthHeaders();
    return this.http.post(this.backend + '/blogs/newblog', blog, this.options).map(res => res.json());
  }

  // GET BLOGS (GET)
  getAllBlogs(){
    this.createAuthHeaders();
    return this.http.get(this.backend + '/blogs/allBlogs', this.options).map( res => res.json());
  }

  // GET BLOG (GET)
  getSingleBlog(id) {
    this.createAuthHeaders();
    return this.http.get(this.backend + '/blogs/singleBlog/' + id, this.options).map( res => res.json());
  }

  // PUT BLOG (UPDATE)
  editBlog(blog) {
    this.createAuthHeaders();
    return this.http.put(this.backend + '/blogs/updateBlog', blog, this.options ).map(res => res.json());
  }
}
