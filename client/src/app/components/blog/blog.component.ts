import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  messageClass;
  message;
  newPost = false;
  loadingFeed = false;

  constructor() { }

  ngOnInit() {
  }

  newBlogForm() {
    this.newPost = true;
  }

  reloadFeed() {
    this.loadingFeed = true;
    // Get all blogs - 4 sec break disable button so they can't spam reload
    setTimeout(() => {
      this.loadingFeed = false;
    }, 4000);
  }

  draftComment() {

  }
}
