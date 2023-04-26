import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map } from 'rxjs';
import { User } from '../../app/login-page/user';
import { Account } from '../login-page/account';
import { Topic } from '../Topic';
import { Post } from '../PostEvent';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'https://localhost:7136';

  userAccount : Account | undefined;
  private Isloged = new BehaviorSubject<string[]>([]);

  currUsser = this.Isloged.asObservable();

  logged(id:string, auth:string) {
    this.Isloged.next([id, auth]);

    // alert('doit')
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

  getTopic(){
    return this.http.get<Topic[]>(`${this.apiUrl}/api/Topics`);
  }

  getPosts(idTopic : number = 0){
    if(idTopic == 0){
      return this.http.get<Post[]>('https://localhost:7136/api/Posts?pageIndex=0&pageSize=10');
    }
    else{
      return this.http.get<Post[]>(`https://localhost:7136/api/Posts?topicId=${idTopic}&pageIndex=0&pageSize=10`)
    }
  }


}
