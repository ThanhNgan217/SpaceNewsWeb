import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../app/login-page/user';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'https://localhost:7136';
  // private apiUrl = 'http://localhost:3000/login';

  private httpOptions = {
    headers : new HttpHeaders({'accept':'*/*'})
    // headers : new HttpHeaders({'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJuZ2FuQGdtYWlsLmNvbSIsImp0aSI6IjdkOWY4ZTA3LTBlNjgtNGI4Yi1hY2MxLWNhNDcxMDMzMWVlYyIsImlhdCI6MTY4MTExMTg2OSwicm9sIjoiYXBpX2FjY2VzcyIsImlkIjoiZjZiOWExOGMtZGM3NC00OWVjLTk5MmItNTNmYTdhYjYzNzEwIiwibmJmIjoxNjgxMTExODY4LCJleHAiOjE2ODExMTkwNjgsImlzcyI6IndlYkFwaSIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NDQ0OTMvIn0.LV2dR5DUE7UyBZHOEHO7fuvI4MbijK3vyjQDvLNKmp4'})

  };
// ['application/json', 'text/json', 'application/*+json']
  constructor(private http:HttpClient) { }

  login(user : User):Observable<User>{
    let body = JSON.stringify(user);
    console.log(body)
    return this.http.post<User>(`${this.apiUrl}/api/Auth/login`, body, this.httpOptions);
  }

  getPost(id:number){
    let body = JSON.stringify(id);
    return this.http.get<any>('https://localhost:7136/api/Topics', {headers:{'accept':'*/*','Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJuZ2FuQGdtYWlsLmNvbSIsImp0aSI6ImRiNWMzYjAwLWZkMzktNDQ0My1iYTQ3LWY5YTdkMmJlZGViMSIsImlhdCI6MTY4MTg5OTg4NCwicm9sIjoiYXBpX2FjY2VzcyIsImlkIjoiZjZiOWExOGMtZGM3NC00OWVjLTk5MmItNTNmYTdhYjYzNzEwIiwibmJmIjoxNjgxODk5ODgzLCJleHAiOjE2ODE5MDcwODMsImlzcyI6IndlYkFwaSIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NDQ0OTMvIn0.MYwdkuGP3-v_HOADICH38fg-eXtO7X6byGyTX1-Xv50'}});
  }
}
