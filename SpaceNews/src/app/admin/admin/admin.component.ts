import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface User{
  id : string|null,
  auth_token : string |null,
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  menuShow = false;
  user : User = {
    id : '',
    auth_token : ''
  }
  constructor(private router:Router) { }

  ngOnInit(): void {
    this.setUser();

  }


    Logout(){
    sessionStorage.removeItem('userID');
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('userRole');
    this.router.navigate(['']);
  }

  setUser(){
    this.user.id = sessionStorage.getItem('userID');
    this.user.auth_token = sessionStorage.getItem('auth_token');
  }

  isPostsPage(){
    if(this.router.url == '/admin/posts') return true;
    return false;
  }
}
