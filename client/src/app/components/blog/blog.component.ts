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
  newComment = [];
  commentForm: FormGroup;
  enabledComments = [];
  commentUser;

  setCommentClass () {
    for ( const blog of this.listOfBlogs ) {
      for ( const comment of blog.comments) {
        this.commentUser = this.authService.username === comment.commentator ? 'label label-success' : 'label label-warning';
        return this.commentUser;
      }
    }
  }
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private blogService: BlogService
  ) {
    this.createNewBlogForm(); // When component loads function will activate and form will create
    this.createCommentForm();
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
  // CREATE COMMENT
  createCommentForm() {
    this.commentForm = this.formBuilder.group({
      comment: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(200)
      ])]
    });
  }
  enableCommentForm() {
    this.commentForm.get('comment').enable();
  }
  disableCommentForm() {
    this.commentForm.get('comment').disable();
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

  draftComment(id) {
    this.commentForm.reset();
    this.newComment = [];
    this.newComment.push(id);
  }

  cancelSubmission(id) {
    const index = this.newComment.indexOf(id);
    this.newComment.splice(index, 1);
    this.commentForm.reset();
    this.enableCommentForm();
    this.processing = false;
  }

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
    this.likerdrop = false;
  }

  // SHOW LIKER
  showLiker() {
    this.likerdrop = true;
    this.dislikerdrop = false;
  }
  // HIDE LIKERS
  hideLikers(){
    this.likerdrop = false;
    this.dislikerdrop = false;
  }


  // POST COMMENT
  postComment(id) {
    this.disableCommentForm();
    this.processing = true;
    const comment = this.commentForm.get('comment').value;
    this.blogService.postComment(id, comment).subscribe(data => {
      this.getAllBlogs();
      const index = this.newComment.indexOf(id);
      this.newComment.splice(index, 1);
      this.enableCommentForm();
      this.commentForm.reset();
      this.processing = false;
      if (this.enabledComments.indexOf(id) < 0) {
        this.expand(id);
      }
    });
  }
  expand(id) {
    this.enabledComments.push(id);
  }
  collapse(id) {
    const index = this.enabledComments.indexOf(id);
    this.enabledComments.splice(index, 1);
  }

  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username;
    });
    this.getAllBlogs();
  }
}
