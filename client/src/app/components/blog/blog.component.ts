import { BlogService } from './../../services/blog.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms'; // Reactive Forms
import { AuthService } from '../../services/auth.service';

@Component({
  selector: "app-blog",
  templateUrl: "./blog.component.html",
  styleUrls: ["./blog.component.css"]
})
export class BlogComponent implements OnInit {
  messageClass;
  message;
  newPost = false;
  loadingFeed = false;
  form;
  processing = false;
  username;
  listOfBlogs;
  dislikerdrop = false;
  likerdrop = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private blogService: BlogService
  ) {
    this.createNewBlogForm(); // When component loads function will activate and form will create
  }

  // CREATE BLOG
  createNewBlogForm() {
    this.form = this.formBuilder.group({
      title: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
          Validators.minLength(5),
          this.alphaNumericValidation
        ])
      ],
      body: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(500),
          Validators.minLength(5)
        ])
      ]
    });
  }

  // ENABLE DISABLE FORM
  enableFormNewBlogForm() {
    this.form.get("title").enable();
    this.form.get("body").enable();
  }

  disableFormNewBlogForm() {
    this.form.get("title").disable();
    this.form.get("body").disable();
  }
  // NEW BLOG VALIDATIONS
  alphaNumericValidation(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { alphaNumericValidation: true };
    }
  }
  newBlogForm() {
    this.newPost = true;
  }

  reloadFeed() {
    this.loadingFeed = true;
    // Get all blogs - 4 sec break disable button so they can't spam reload
    this.getAllBlogs();
    setTimeout(() => {
      this.loadingFeed = false;
    }, 4000);
  }

  draftComment() {}

  // SUBMIT FORM
  onBlogSubmit() {
    this.processing = true;
    this.disableFormNewBlogForm();

    const blog = {
      title: this.form.get("title").value,
      body: this.form.get("body").value,
      createdBy: this.username
    };

    console.log(blog);

    this.blogService.newBlog(blog).subscribe(data => {
      if (!data.success) {
        this.messageClass = "alert alert-danger";
        this.message = data.message;
        this.processing = false;
        this.enableFormNewBlogForm();
      } else {
        this.messageClass = "alert alert-success";
        this.message = data.message;
        this.getAllBlogs(); // THIS WILL REFRESH THE LIST OF BLOGS
        setTimeout(() => {
          this.newPost = false;
          this.processing = false;
          this.message = false;
          this.form.reset();
          this.enableFormNewBlogForm();
        }, 2000);
      }
    });
  }

  // GO BACK
  goBack() {
    window.location.reload(); // basically refreshes page.
  }

  // GET BLOGS
  getAllBlogs() {
    this.blogService.getAllBlogs().subscribe(jsondata => {
      this.listOfBlogs = jsondata.blogs;
    });
  }

  // LIKE AND DISLIKE
  likeBlog(id) {
    this.blogService.likeBlog(id).subscribe(data => {
      this.getAllBlogs();
    });
  }
  dislikeBlog(id) {
    this.blogService.dislikeBlog(id).subscribe(data => {
      this.getAllBlogs();
    });
  }
  // SHOW DISLIKER
  showDisliker() {
    this.dislikerdrop = true;
  }
  // SHOW LIKER
  showLiker() {
    this.likerdrop = true;
  }

  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username;
    });
    this.getAllBlogs();
  }
}
