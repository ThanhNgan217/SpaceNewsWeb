import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CanLoginService } from '../Service/can-login.service';

@Injectable({
  providedIn: 'root'
})
export class CanLoginGuard implements CanActivate {
  constructor(private service:CanLoginService){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
      if(!localStorage.getItem('userID')) return true;
      else return false;
    }
}
