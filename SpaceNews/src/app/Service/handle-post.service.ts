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




  addPost(obj : formEventData, image : string){
    let dateTime = `${obj.eventDate}T${obj.eventTime}`;

    let newPost = {
      date: dateTime,
      time: dateTime,
      location: obj.eventLocation,
      image: image,
      priority: obj.eventPiority,
      content: obj.eventContent,
      // showInSlider: obj.eventPiority == 0 ? false : true,
      showInSlider: true, // default is enable
      topicID: obj.eventType,
      groupID: obj.eventGroup,
      title: obj.eventTitle,
      type: '',
    };
    console.log(newPost);
    return this.http.post(`${this.url}/api/Posts`, JSON.stringify(newPost), {headers:{'Authorization':`Bearer ${this.auth}`,'Content-Type': 'application/json;charset=UTF-8'}});
  }

  editPost(obj : formEventData, id : number, oldDate : Date, newImg : string, showInSlider : boolean = true){
    // let dateTime = `${obj.eventDate}T${obj.eventTime}`;
    let dateTime;
    let img : string = obj.eventImg;
    if(newImg != '' && newImg != undefined){
      img = newImg;
      // console.log(newImg)
    }
    else console.log(newImg)
    if(obj.eventDate != oldDate && obj.eventTime != oldDate){ // change both
      dateTime = `${obj.eventDate}T${obj.eventTime}`;
    }
    else if(obj.eventDate != oldDate && obj.eventTime == oldDate){ // only change date
      let time = obj.eventTime.toString();
      let arr = time.split('T'); // arr = [ 'date','time' ]
      dateTime = `${obj.eventDate}T${arr[1]}`;
    }
    else if(obj.eventDate == oldDate && obj.eventTime != oldDate){ // only change time
      let date = obj.eventDate.toString();
      let arr = date.split('T'); // arr = [ 'date','time' ]
      dateTime = `${arr[0]}T${obj.eventTime}`;
    }
    else { // no change
      dateTime = `${obj.eventDate}`;
    }


    // console.log(dateTime);
    let post = {
      date: dateTime,
      time: dateTime,
      location: obj.eventLocation,
      image: img,
      priority: obj.eventPiority,
      content: obj.eventContent,
      showInSlider: showInSlider,
      topicID: obj.eventType,
      groupID: obj.eventGroup,
      title: obj.eventTitle,
      type: '',
      id: id
    };
    console.log(post)
    return this.http.put<Post>(`${this.url}/api/Posts/${id}`, post, {headers:{'Authorization':`Bearer ${this.auth}`,'Content-Type': 'application/json;charset=UTF-8'}});
  }

  getPost(id : number){
    return this.http.get<Post>(`${this.url}/api/Posts/${id}`);
  }

  deletePost(id:number){
    return this.http.delete(`${this.url}/api/Posts/${id}`, {headers:{'Authorization':`Bearer ${this.auth}`}});
  }

  piorityToggle(id:number, toggle:boolean, postData:Post|undefined){
    let post = {
      date: postData?.date,
      time: postData?.time,
      location: postData?.location,
      image: postData?.image,
      priority: toggle == true? 1 : 0,
      content: postData?.content,
      showInSlider: postData?.showInSlider,
      topicID: postData?.topicID,
      groupID: postData?.groupID,
      title: postData?.title,
      type: '',
      id: id
    };
    // console.log('new data', post);
    return this.http.put<Post>(`${this.url}/api/Posts/${id}`, post, {headers:{'Authorization':`Bearer ${this.auth}`,'Content-Type': 'application/json;charset=UTF-8'}});
  }

  statusToggle(id:number, toggle:boolean, postData:Post|undefined){
    let post = {
      date: postData?.date,
      time: postData?.time,
      location: postData?.location,
      image: postData?.image,
      priority: postData?.priority,
      content: postData?.content,
      showInSlider: toggle,
      topicID: postData?.topicID,
      groupID: postData?.groupID,
      title: postData?.title,
      type: '',
      id: id
    };
    // console.log('new data', post);

    return this.http.put<Post>(`${this.url}/api/Posts/${id}`, post, {headers:{'Authorization':`Bearer ${this.auth}`,'Content-Type': 'application/json;charset=UTF-8'}});
  }

  loadListPost(pageIndex = 0, topicID = 0){
    if(topicID == 0) return this.http.get<Post[]>(`${this.url}/api/Posts?pageIndex=${pageIndex}&pageSize=6&previousTime=false&ascendingOrder=true`);
    return this.http.get<Post[]>(`${this.url}/api/Posts?topicId=${topicID}&pageIndex=${pageIndex}&pageSize=6&previousTime=false&ascendingOrder=true`);
  }

  searchPost(key = '', pageIndex = 0, topicID = 0){
    // sessionStorage.setItem('isSearch', 'true');
    // sessionStorage.setItem('key', key);
    // console.log(key)
    if(topicID == 0){
      return this.http.get<Post[]>(`${this.url}/api/Posts?keyword=${key}&pageIndex=${pageIndex}&pageSize=6&previousTime=false&ascendingOrder=true`);
    }
    return this.http.get<Post[]>(`${this.url}/api/Posts?topicId=${topicID}&keyword=${key}&pageIndex=${pageIndex}&pageSize=6&previousTime=false&ascendingOrder=true`);
  }

}
