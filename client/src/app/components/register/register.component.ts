import { Component, OnInit } from '@angular/core';
// IMPORT ROUTER FOR REROUTING
import { Router } from '@angular/router';
// IMPORT AUTHSERVICE TO USE SERVICE FUNCTIONS TO SPEAK TO BACKEND
import { AuthService } from './../../services/auth.service';
// IMPORT ANGULAR FORMS TO BUILD REACTIVE FORMS
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  // remember to import reactiveformsmodule in appmodule to bind form to formgroup.
  form: FormGroup;
  message;
  messageClass;
  processing = false;
  emailValid;
  emailMessage;
  usernameValid;
  usernameMessage;

  // constructor is mainly for dependency injection, and initializing class members, used for when class is called
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // whenever class is called or used, this.createForm() function will be auto booted to use.
    this.createForm();
  }

  // ngOnInit is part of angular to "start" component functionality
  ngOnInit() {
  }

  // CREATE REGISTER FORM WITH FORMBUILDER VALIDATIONS
  createForm() {
    this.form = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
        this.validateEmail
      ])],
      username: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
        this.validateUsername
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(35),
        this.validatePassword
      ])],
      confirm: ['', Validators.required]
    }, {
      validator: this.matchingPasswords('password', 'confirm')
    });
  }

  // CREATE CREATEFORM VALIDATOR FUNCTIONS
    validateEmail(controls) {
      const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,:;\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

      if (regExp.test(controls.value)) {
        return null;
      } else {
        return { 'validateEmail': true };
      }
    }

    validateUsername(controls) {
      const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
      if (regExp.test(controls.value)) {
        return null;
      } else {
        return { 'validateUsernamse': true };
      }
    }

    validatePassword(controls) {
      const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
      if (regExp.test(controls.value)) {
        return null;
      } else {
        return { 'validatePassword': true };
      }
    }

    matchingPasswords(password, confirm) {
      return (group: FormGroup) => {
        if (group.controls[password].value === group.controls[confirm].value) {
          return null;
        } else {
          return { 'matchingPasswords': true };
        }
      };
    }

  // DISABLE ENABLE FORM, IF VALID OR INVALID INPUT
    disableForm() {
      this.form.controls['email'].disable();
      this.form.controls['username'].disable();
      this.form.controls['password'].disable();
      this.form.controls['confirm'].disable();
    }

    enableForm() {
      this.form.controls['email'].enable();
      this.form.controls['username'].enable();
      this.form.controls['password'].enable();
      this.form.controls['confirm'].enable();
    }

  // FUNCTIONS FOR HTML BLUR EVENT BINDING
    checkEmail() {
      const email = this.form.get('email').value;
      this.authService.checkEmail(email).subscribe(data => {
        if (!data.success) {
          this.emailValid = false;
          this.emailMessage = data.message;
        } else {
          this.emailValid = true;
          this.emailMessage = data.message;
        }
      });
    }

    checkUsername() {
      const username = this.form.get('username').value;
      this.authService.checkUsername(username).subscribe(data => {
        if (!data.success) {
          this.usernameValid = false;
          this.usernameMessage = data.message;
        } else {
          this.usernameValid = true;
          this.usernameMessage = data.message;
        }
      });
    }

  // SUBMIT FORM USING AUTHSERVICE TO CREATE TO BACKEND API
    onRegisterSubmit() {
      this.processing = true;
      this.disableForm();
      const user = {
        email: this.form.get('email').value,
        username: this.form.get('username').value,
        password: this.form.get('password').value
      };
      console.log(this.form.get('email').value);
      console.log('Form submitted');

      this.authService.registerUser(user).subscribe(data => {
        console.log(data);
        if (!data.success) {
          this.messageClass = 'alert alert-danger';
          this.message = data.message;
          this.processing = false;
          this.enableForm();
        } else {
          this.messageClass = 'alert alert-success';
          this.message = data.message;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        }
      });
    }

}
