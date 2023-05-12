import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../Service/api.service';

@Injectable({
  providedIn: 'root'
})
export class CanActivateGuard implements CanActivate {
  constructor(private apiService:ApiService, private router : Router){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ){
    if(sessionStorage.getItem('userRole') == '1'){
      return true;
    }
    else return false;

  }

}

