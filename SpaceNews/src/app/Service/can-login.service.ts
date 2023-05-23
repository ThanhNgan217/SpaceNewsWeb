import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { __values } from 'tslib';

@Injectable({
  providedIn: 'root'
})
export class CanLoginService {
  constructor( private apiService: ApiService) { }
  isloged(){
    let result = true;
    this.apiService.currUsser.subscribe(__values=>{
      if(__values[2] == '1' || __values[2] == '0') result = false // check userRole is valid
    })
    return result;
  }
}
