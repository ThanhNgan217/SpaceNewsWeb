import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

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

  constructor(private router:Router) {
    this.router.events.forEach((event)=>{
      if(event instanceof NavigationStart){
        clearTimeout(this.sessionTimeout);
      }
    })
   }

  ngOnInit(): void {
    this.setUser();
    this.expiredLoginSession();
  }

  // expired login session
  expiredLoginSession(){
    let currTime = new Date();
    let expired = sessionStorage.getItem('expiredTime');
    let expiredTime = Number(expired) - currTime.getTime();
    this.sessionTimeout = setTimeout(()=>{
      console.log('admin')
      alert('Login session expired, Please login again');
      sessionStorage.clear();
      this.router.navigate(['/login']);
    }, expiredTime);
  }

  sessionTimeout = setTimeout(()=>{});

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
