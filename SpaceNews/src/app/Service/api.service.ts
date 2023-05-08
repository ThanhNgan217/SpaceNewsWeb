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

  // search results
  private search = new BehaviorSubject<boolean>(false);
  key : string| undefined = '';
  showSearch = this.search.asObservable();


  userAccount : Account | undefined;
  private Isloged = new BehaviorSubject<string[]>([]);

  currUsser = this.Isloged.asObservable();

  logged(id:string, auth:string) {
    this.Isloged.next([id, auth]);
  }

  private httpOptions = {
  //   // headers : new HttpHeaders({'accept':'*/*', 'Content-Type': 'application/json'})
  //   // headers : new HttpHeaders({'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJuZ2FuQGdtYWlsLmNvbSIsImp0aSI6IjdkOWY4ZTA3LTBlNjgtNGI4Yi1hY2MxLWNhNDcxMDMzMWVlYyIsImlhdCI6MTY4MTExMTg2OSwicm9sIjoiYXBpX2FjY2VzcyIsImlkIjoiZjZiOWExOGMtZGM3NC00OWVjLTk5MmItNTNmYTdhYjYzNzEwIiwibmJmIjoxNjgxMTExODY4LCJleHAiOjE2ODExMTkwNjgsImlzcyI6IndlYkFwaSIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NDQ0OTMvIn0.LV2dR5DUE7UyBZHOEHO7fuvI4MbijK3vyjQDvLNKmp4'})
  headers : new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8',
  // "Access-Control-Allow-Origin": "*",
  // "Access-Control-Allow-Headers": "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization"
  // 'Access-Control-Allow-Methods':'GET,POST,PUT,PATCH,DELETE',
  // 'Access-Control-Allow-Headers': '*'
  }),
  };

  constructor(private http:HttpClient) { }

  login(user : User){
    let body = JSON.stringify(user);
    // console.log(body)
    return this.http.post<Account>(`${this.apiUrl}/api/Auth/login`, body, this.httpOptions)
  }

  getTopic(){
    return this.http.get<Topic[]>(`${this.apiUrl}/api/Topics`);
  }

  getSlider(){
    return this.http.get<Post[]>(`${this.apiUrl}/api/Posts?pageIndex=0&pageSize=999`);
  }

  getPosts(idTopic : number = 0, pageNumber = 0){
    if(idTopic == 0){
      return this.http.get<Post[]>(`${this.apiUrl}/api/Posts?pageIndex=${pageNumber}&pageSize=9`);
    }
    else{
      return this.http.get<Post[]>(`${this.apiUrl}/api/Posts?topicId=${idTopic}&pageIndex=${pageNumber}&pageSize=9`)
    }
  }

  searchPost(key: string|undefined){
    if(key != ''){
      this.key = key;
      // console.log(key)
      this.search.next(true);
    }
    else this.stopSearch();
  }
  getSearchResults(pageNumber = 0, key =''){
    return this.http.get<Post[]>(`${this.apiUrl}/api/Posts?keyword=${key}&pageIndex=${pageNumber}&pageSize=9`)
  }

  stopSearch(){
    this.search.next(false);
    this.key = '';
  }

  getGroup(){
    return this.http.get('https://localhost:7136/api/Groups').subscribe({
      next:data =>{
        console.log(data);
      }
    })
  }

}
