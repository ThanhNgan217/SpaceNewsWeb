import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Account } from '../login-page/account';
import { ApiService } from '../Service/api.service';
import { __values } from 'tslib';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Post } from '../PostEvent';

interface User{
  id : string|null,
  auth_token : string |null,
  role : string | null
}

@Component({
  selector: 'app-home-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit, OnChanges{
  searchForm = new FormGroup({
    keyWord : new FormControl<string>("")
  });
  // postsSearch : Post[] = [];
  // showSearch = false;
  constructor(private router : Router, private apiService:ApiService, private fb: FormBuilder) {
  }

  ngOnInit():void{
    this.setUser();
    console.log(this.user);
    this.searchForm = this.fb.group({
      keyWord:""
    })
  }

  ngOnChanges(changes: SimpleChanges): void {

  }
  logged = false;
  user : User = {
    id : '',
    auth_token : '',
    role:''
  }

  menuShow = false;


  setUser(){
    // let arr:string[] =[];
    // this.apiService.currUsser.subscribe(__value => {
    //   // console.log('value',__value)
    //   arr.push(__value[0]);
    //   arr.push(__value[1]);
    //   arr.push(__value[2]);
    // })

    if(localStorage.getItem('userID')) {
      this.user.id = localStorage.getItem('userID');
      this.user.auth_token = localStorage.getItem('auth_token');
      this.user.role = localStorage.getItem('userRole');
      this.logged = true;
    }
    else{
      this.logged = false;
    }
  }

  // ListTopic = [
  //   {
  //     id : 1,
  //     subject : 'Subject 1'
  //   },
  //   {
  //     id : 2,
  //     subject : 'Subject 2'
  //   },
  //   {
  //     id : 3,
  //     subject : 'Subject 3'
  //   },
  // ]
  // topicChecked = 0;

  // topicChange(value : number){
  //   this.topicChecked = value;
  // }
  toLogin(){
    this.router.navigate(['/login']);
  }
  Logout(){
    localStorage.clear();
    // test logout
    // this.apiService.logged('', '','');
    // this.setUser();
    this.router.navigate(['']);
  }

  // search posts
  searchClick(){
    // this.showSearch = true;
    let key = this.searchForm.get('keyWord')?.value?.trim();

      key = key?.replace(/ /g,'%20');
      // console.log("hello",key)
      this.searchForm.reset({keyWord: ''});
      this.apiService.searchPost(key)


  }
}
