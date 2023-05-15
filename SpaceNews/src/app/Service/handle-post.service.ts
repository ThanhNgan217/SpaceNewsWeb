import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Post } from '../PostEvent';

interface formEventData {
  eventTitle : '',
  eventType: 1,
  eventDate: Date,
  eventTime: Date,
  eventLocation: '',
  eventImg: '',
  eventPiority: 0,
  eventGroup: 1,
  eventContent: ''
}

@Injectable({
  providedIn: 'root'
})
export class HandlePostService {
  constructor(private apiService:ApiService, private http:HttpClient) { }
  auth = sessionStorage.getItem('auth_token');
  private httpOptions = {
    //   // headers : new HttpHeaders({'accept':'*/*', 'Content-Type': 'application/json'})
    //   // headers : new HttpHeaders({'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJuZ2FuQGdtYWlsLmNvbSIsImp0aSI6IjdkOWY4ZTA3LTBlNjgtNGI4Yi1hY2MxLWNhNDcxMDMzMWVlYyIsImlhdCI6MTY4MTExMTg2OSwicm9sIjoiYXBpX2FjY2VzcyIsImlkIjoiZjZiOWExOGMtZGM3NC00OWVjLTk5MmItNTNmYTdhYjYzNzEwIiwibmJmIjoxNjgxMTExODY4LCJleHAiOjE2ODExMTkwNjgsImlzcyI6IndlYkFwaSIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NDQ0OTMvIn0.LV2dR5DUE7UyBZHOEHO7fuvI4MbijK3vyjQDvLNKmp4'})
    headers : new HttpHeaders({
                                'Content-Type': 'application/json;charset=UTF-8',
    // "Access-Control-Allow-Origin": "*",
    // "Access-Control-Allow-Headers": "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization"
    // 'Access-Control-Allow-Methods':'GET,POST,PUT,PATCH,DELETE',
    // 'Access-Control-Allow-Headers': '*'
    }),
    };

  url = 'https://localhost:7136';




  addPost(obj : formEventData){
    let dateTime = `${obj.eventDate}T${obj.eventTime}`;

    let newPost = {
      date: dateTime,
      time: dateTime,
      location: obj.eventLocation,
      image: obj.eventImg,
      priority: obj.eventPiority,
      content: obj.eventContent,
      showInSlider: obj.eventPiority == 0 ? false : true,
      topicID: obj.eventType,
      groupID: obj.eventGroup,
      title: obj.eventTitle,
      type: '',
    };
    console.log(newPost);
    return this.http.post(`${this.url}/api/Posts`, JSON.stringify(newPost), {headers:{'Authorization':`Bearer ${this.auth}`,'Content-Type': 'application/json;charset=UTF-8'}});
  }

  editPost(obj : formEventData, id : number){
    let dateTime = `${obj.eventDate}T${obj.eventTime}`;

    let post = {
      date: dateTime,
      time: dateTime,
      location: obj.eventLocation,
      image: obj.eventImg,
      priority: obj.eventPiority,
      content: obj.eventContent,
      showInSlider: obj.eventPiority == 0 ? false : true,
      topicID: obj.eventType,
      groupID: obj.eventGroup,
      title: obj.eventTitle,
      type: '',
      id: id
    };
    console.log(post)
    return this.http.put<Post>(`${this.url}/api/Posts/${id}`, post, {headers:{'Authorization':`Bearer ${this.auth}`,'Content-Type': 'application/json;charset=UTF-8'}});
  }

  loadListPost(pageIndex = 0){
    return this.http.get<Post[]>(`https://localhost:7136/api/Posts?pageIndex=${pageIndex}&pageSize=6`);
  }

  searchPost(key = '', pageIndex = 0){
    // sessionStorage.setItem('isSearch', 'true');
    // sessionStorage.setItem('key', key);
    console.log(key)
    return this.http.get<Post[]>(`https://localhost:7136/api/Posts?keyword=${key}&pageIndex=${pageIndex}&pageSize=6`);
  }

}
