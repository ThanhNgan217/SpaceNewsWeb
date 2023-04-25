import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Account } from '../login-page/account';
import { ApiService } from '../Service/api.service';
import { __values } from 'tslib';

@Component({
  selector: 'app-home-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit, OnChanges{
  constructor(private router : Router, private apiService:ApiService) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    if('this.logged' in changes){
    }
  }
  logged = false;
  user = {
    id : '',
    auth_token : ''
  }

  menuShow = false;

  ngOnInit(): void {
    this.setUser();
  }

  setUser(){
    let arr:string[] =[];
    this.apiService.currUsser.subscribe(__value => {
      arr.push(__value[0]);
      arr.push(__value[1]);
    })
    if(arr[0]) {
      this.user.id = arr[0];
      this.user.auth_token = arr[1];
      this.logged = true;
    }
    else{
      this.logged = false;
      this.user.id = '';
      this.user.auth_token = '';
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
    // test logout
    this.apiService.logged('', '');
    this.setUser();
  }
  searchClick(){
    // console.log(this.user)
    // console.log(this.logged)

    //GET USER AUTH
    // let arr: (string | boolean)[][]=[];
    // // console.log(this.apiService.currUsser.getValue());
    // this.apiService.currUsser.subscribe(__values => {
    //   arr.push(__values);
    // })
    // arr.forEach(i =>{console.log(i)});
  }
}
