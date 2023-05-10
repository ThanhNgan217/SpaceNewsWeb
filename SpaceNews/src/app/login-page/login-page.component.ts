import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { ApiService } from "../Service/api.service";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import { Account } from "./account";
import { Router } from "@angular/router";

// import { NoWhitespaceValidator } from "../validators/no-whitespace.validator";

@Component({
  selector: 'app-login',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  loginForm = new FormGroup({
    emailAddress: new FormControl<string>(''),
    password: new FormControl<string>(''),

  });

  errorMessage = '';
  isErr = false;

  userAccount : Account | undefined;
  // isLogin = false;
  // userId = '';
  // auth_token = '';
  // user_role = '';

  constructor(private fb: FormBuilder, private apiService: ApiService, private router : Router) {}

  ngOnInit(): void {
    this.isErr = false;
    this.errorMessage = '';
    this.loginForm = this.fb.group({
      emailAddress:[
        "",
        Validators.compose([
          Validators.required,
          Validators.email
          // Validators.pattern(/^[a-z]{6,32}$/i)
        ])
      ],
      password: [
        "",
        Validators.compose([
          Validators.required
          //Validators.minLength(6),
          // Validators.pattern(/^(?=.*[!@#$%^&*]+)[a-z0-9!@#$%^&*]{6,32}$/)
        ])
      ],
    });

    // this.apiServide.getPosts()
    // .subscribe((data) => {
    //   console.log(data);});
    // new FormControl("", Validators.required);
  }

  clearErr(){
    this.isErr = false;
    this.errorMessage ='';
  }

  onSubmit(): void {
    let username = this.loginForm.get('emailAddress')?.value;
    let password = this.loginForm.get('password')?.value;
    let user  = {
      username : username,
      password : password
    }
    this.apiService.login(user)
    .subscribe({
      next:data =>{
        // this.userAccount = data;
        this.userAccount = data;
        console.log('useraccount', this.userAccount)
        this.apiService.logged(this.userAccount.id, this.userAccount.auth_token, this.userAccount.role);
        this.router.navigate(['/'])
      },
      error: error => {
        this.isErr = true;
        this.errorMessage = (error.error.login_failure[0]);
        // console.log(error.error)
        // console.log(this.errorMessage)
      }
    });
    // this.apiServide.getPost().subscribe((data)=>{console.log(data)});
  }

  get emailAddress(){
    return this.loginForm.get('emailAddress');
  }
  get password(){
    return this.loginForm.get('password');
  }

}
