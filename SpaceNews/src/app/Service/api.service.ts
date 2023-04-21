import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map } from 'rxjs';
import { User } from '../../app/login-page/user';
import { Account } from '../login-page/account';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'https://localhost:7136';

  userAccount : Account | undefined;
  private Isloged = new BehaviorSubject([false, {}]);

  currUsser = this.Isloged.asObservable();

  loged(user: Account) {
    this.Isloged.next([true, user]);
    alert('doit')
  }

  private httpOptions = {
    // headers : new HttpHeaders({'accept':'*/*', 'Content-Type': 'application/json'})
    // headers : new HttpHeaders({'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJuZ2FuQGdtYWlsLmNvbSIsImp0aSI6IjdkOWY4ZTA3LTBlNjgtNGI4Yi1hY2MxLWNhNDcxMDMzMWVlYyIsImlhdCI6MTY4MTExMTg2OSwicm9sIjoiYXBpX2FjY2VzcyIsImlkIjoiZjZiOWExOGMtZGM3NC00OWVjLTk5MmItNTNmYTdhYjYzNzEwIiwibmJmIjoxNjgxMTExODY4LCJleHAiOjE2ODExMTkwNjgsImlzcyI6IndlYkFwaSIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NDQ0OTMvIn0.LV2dR5DUE7UyBZHOEHO7fuvI4MbijK3vyjQDvLNKmp4'})
    headers : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8',
    "Access-Control-Allow-Origin": "*",
    'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': '*'}),
  };

  constructor(private http:HttpClient) { }

  login(user : User){
    let body = JSON.stringify(user);
    console.log(body)
    return this.http.post<Account>(`${this.apiUrl}/api/Auth/login`, body, this.httpOptions)
  }

  getPosts(){
    // return this.http.get<any>('https://6440baf2792fe886a894b034.mockapi.io/api/posts');

    // return this.http.get('https://localhost:7136/api/Posts?topicId=1&pageIndex=0&pageSize=10', {headers:{'accept': 'text/plain','Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJuZ2FuQGdtYWlsLmNvbSIsImp0aSI6IjA1OWMyYzI3LWJiNDYtNDA4NC1iMzA1LWYwMzhhNjQ3ZTA3OSIsImlhdCI6MTY4MTk4MDQxMiwicm9sIjoiYXBpX2FjY2VzcyIsImlkIjoiZjZiOWExOGMtZGM3NC00OWVjLTk5MmItNTNmYTdhYjYzNzEwIiwibmJmIjoxNjgxOTgwNDEyLCJleHAiOjE2ODE5ODc2MTIsImlzcyI6IndlYkFwaSIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NDQ0OTMvIn0.VKQx0VNWkQ1C6N9YfrUTvocDxUYUJ72np5gWQvjKrYE'}});
    return this.http.get('https://localhost:7136/api/Posts?topicId=1&pageIndex=0&pageSize=10');
  }


}
