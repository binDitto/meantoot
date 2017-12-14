import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';


@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.css']
})
export class EditBlogComponent implements OnInit {

  message = false;
  messageClass = false;
  blog = {
    title: String,
    body: String,
  };
  processing = false;

  constructor(
    private location: Location
  ) { }

  ngOnInit() {
  }

  updateBlogSubmit() {

  }

  goBack() {
    this.location.back();
  }
}
