import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map } from 'rxjs';
import { User } from '../../app/login-page/user';
import { Account } from '../login-page/account';
import { Topic } from '../Topic';
import { Post } from '../PostEvent';
import { Group } from '../Group';
import { __values } from 'tslib';
import { Member } from '../Member';

interface History{
  userID : string | null,
  eventsID : string | null
}
export interface Bookmark{
  userID : string | null,
  eventsID : string | null | undefined
}

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
  isAdmin(){
    let result = false;
    this.currUsser.subscribe(__values=>{
      if(__values[2] == '1') result = true;
    })
    return result;
  }
  logged(id:string, auth:string, role : string) {
    this.Isloged.next([id, auth, role]);
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

  getEventQuantity(pastEvent : boolean = false){
    if(pastEvent == false)return this.http.get<number>(`${this.apiUrl}/api/Posts/Quantity?previousTime=false`);
    else return this.http.get<number>(`${this.apiUrl}/api/Posts/Quantity?previousTime=true`);
  }

  getTopic(){
    return this.http.get<Topic[]>(`${this.apiUrl}/api/Topics`);
  }

  getSlider(){
    return this.http.get<Post[]>(`${this.apiUrl}/api/Posts?pageIndex=0&pageSize=999`);
  }

  getPosts(idTopic : number = 0, pageNumber = 0){
    if(idTopic == 0){
      return this.http.get<Post[]>(`${this.apiUrl}/api/Posts?pageIndex=${pageNumber}&pageSize=9&showSlider=true&previousTime=false&ascendingOrder=true`);
    }
    else{
      return this.http.get<Post[]>(`${this.apiUrl}/api/Posts?topicId=${idTopic}&pageIndex=${pageNumber}&pageSize=9&showSlider=true&previousTime=false&ascendingOrder=true`)
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
  getSearchResults(pageNumber = 0, key ='', enable = true, pastEvent = false ){
    //list results : showInSlider(enable) = true, sort = true, not get previous events(past event)
    return this.http.get<Post[]>(`${this.apiUrl}/api/Posts?keyword=${key}&pageIndex=${pageNumber}&pageSize=9&showSlider=${enable}&previousTime=${pastEvent}&ascendingOrder=true`)
  }

  stopSearch(){
    this.search.next(false);
    this.key = '';
  }

  getPost(id : number){
    return this.http.get<Post>(`${this.apiUrl}/api/Posts/${id}`);
  }

  getGroup(){
    return this.http.get<Group[]>(`${this.apiUrl}/api/GroupMembers?pageIndex=0&pageSize=999`);
  }

  addPost(val: any){
    return this.http.post(`${this.apiUrl}/api/Posts`, val);
  }

  // filter posts by group id
  getListPosts(groupId: string){
    return this.http.get<Post[]>(`${this.apiUrl}/api/Posts?groupId=${groupId}&pageIndex=0&pageSize=9999`)
  }

  // Bookmarks
  getAllBookmarks(){
    return this.http.get<Bookmark[]>(`${this.apiUrl}/api/Bookmark`);
  }
  getBookmarks(userID : string|null){
    return this.http.get<Bookmark>(`${this.apiUrl}/api/Bookmark/${userID}`);
  }
  addBookmark(body : Bookmark){
    let auth = sessionStorage.getItem('auth_token');
    let exist  = this.bookmarkHandle(body.userID);
    if(exist != ''){
      return this.http.put<Bookmark>(`${this.apiUrl}/api/Bookmark/${body.userID}`,JSON.stringify(body), {headers:{'Authorization':`Bearer ${auth}`,'Content-Type': 'application/json;charset=UTF-8'}})
    }
    else{
      return this.http.post<Bookmark>(`${this.apiUrl}/api/Bookmark`,JSON.stringify(body), {headers:{'Authorization':`Bearer ${auth}`,'Content-Type': 'application/json;charset=UTF-8'}})
    }
  }
  bookmarkHandle(userID:string|null){
    let result;
    this.getBookmarks(userID).subscribe({
      next:data => {
        result = data.userID;
      },
      error : err =>{
        result = '';
      }
    })
    return result;
  }

  // Read History
  getAllHistory(){
    return this.http.get<History[]>(`${this.apiUrl}/api/ReadHistory`);
  }

  getHistory(id : string | null){
    return this.http.get<History>(`${this.apiUrl}/api/ReadHistory/${id}`);
  }

  addHistory(body : History){
    let auth = sessionStorage.getItem('auth_token');
    let list : History;
    let exist  = this.historyHandle(body.userID);
    if(exist != ''){
      return this.http.put<History>(`${this.apiUrl}/api/ReadHistory/${body.userID}`,JSON.stringify(body), {headers:{'Authorization':`Bearer ${auth}`,'Content-Type': 'application/json;charset=UTF-8'}})
    }
    else{
      return this.http.post<History>(`${this.apiUrl}/api/ReadHistory`,JSON.stringify(body), {headers:{'Authorization':`Bearer ${auth}`,'Content-Type': 'application/json;charset=UTF-8'}})
    }
  }

  historyHandle(id: string|null){
    let result;
    this.getHistory(id).subscribe({
      next:data => {
        result = data.userID;
      },
      error : err =>{
        result = '';
      }
    })
    return result;
  }


  getMembers(){
    return this.http.get<Member[]>(`${this.apiUrl}/api/Members`);
  }
}
