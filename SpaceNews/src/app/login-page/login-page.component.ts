import { Component, OnInit } from "@angular/core";
import { ApiService } from "../Service/api.service";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import { User } from "./user";

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


  constructor(private fb: FormBuilder, private apiServide: ApiService) {}

  ngOnInit(): void {
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

    new FormControl("", Validators.required);
  }
  onSubmit(): void {
    let username = this.loginForm.get('emailAddress')?.value;
    let password = this.loginForm.get('password')?.value;

    let user :User = {
      username : username,
      password : password
    }
    this.apiServide.login(user).subscribe(()=>{
      alert("success");
    },

    );
    // this.apiServide.getPost().subscribe((data)=>{console.log(data)});
  }

  get emailAddress(){
    return this.loginForm.get('emailAddress');
  }
  get password(){
    return this.loginForm.get('password');
  }

}
