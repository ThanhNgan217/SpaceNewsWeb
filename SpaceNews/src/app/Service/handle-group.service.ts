import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Group } from '../Group';

interface formGroupData {
  groupName:'',
  groupMail:''
}

@Injectable({
  providedIn: 'root'
})
export class HandleGroupService {
  constructor(private apiService:ApiService, private http:HttpClient) { }

  private httpOptions = {
    //   // headers : new HttpHeaders({'accept':'*/*', 'Content-Type': 'application/json'})
    //   // headers : new HttpHeaders({'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJuZ2FuQGdtYWlsLmNvbSIsImp0aSI6IjdkOWY4ZTA3LTBlNjgtNGI4Yi1hY2MxLWNhNDcxMDMzMWVlYyIsImlhdCI6MTY4MTExMTg2OSwicm9sIjoiYXBpX2FjY2VzcyIsImlkIjoiZjZiOWExOGMtZGM3NC00OWVjLTk5MmItNTNmYTdhYjYzNzEwIiwibmJmIjoxNjgxMTExODY4LCJleHAiOjE2ODExMTkwNjgsImlzcyI6IndlYkFwaSIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NDQ0OTMvIn0.LV2dR5DUE7UyBZHOEHO7fuvI4MbijK3vyjQDvLNKmp4'})
    headers : new HttpHeaders({ 'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0cnVjQGdtYWlsLmNvbSIsImp0aSI6ImUwYTcxOTg5LTE0MWQtNDRlYy1hZTJiLWRkYzlhMDkyMmFjMiIsImlhdCI6MTY4Mzg2NTQ1NSwicm9sIjoiYXBpX2FjY2VzcyIsImlkIjoiZTYxZWMzOWYtNWQ5MC00M2ZkLTg0MDQtMjBkNjAwYWIyYzE2IiwibmJmIjoxNjgzODY1NDU1LCJleHAiOjE2ODM4NzI2NTUsImlzcyI6IndlYkFwaSIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NDQ0OTMvIn0.CSReoI11wa8aqSokdoLcDxGGOisYRVGneIQ7gvNBAyI',
                                'Content-Type': 'application/json;charset=UTF-8',
    // "Access-Control-Allow-Origin": "*",
    // "Access-Control-Allow-Headers": "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization"
    // 'Access-Control-Allow-Methods':'GET,POST,PUT,PATCH,DELETE',
    // 'Access-Control-Allow-Headers': '*'
    }),
    };

  url = 'https://localhost:7136';




  addGroup(obj : formGroupData){
    let newGroup = {
      name: obj.groupName,
      email: obj.groupMail
    };
    console.log(newGroup);
    return this.http.post(`${this.url}/api/Groups`, JSON.stringify(newGroup), this.httpOptions);
  }
  searchGroup(keyWord='', pageIndex=0){
    return this.http.get<Group[]>(`https://localhost:7136/api/Groups?keyword=${keyWord}&pageIndex=${pageIndex}&pageSize=6`);
  }
  loadListGroup(pageIndex = 0){
    return this.http.get<Group[]>(`https://localhost:7136/api/Groups?pageIndex=${pageIndex}&pageSize=6`);
  }
  deleteGroup(val: number){
    return this.http.delete(`${this.url}/api/Groups/${val}`);
  }
  editGroup(obj: formGroupData, Id: number){
    let edittedGroup = {
      name: obj.groupName,
      email: obj.groupMail,
      id: Id
    };
    return this.http.put<Group>(`${this.url}/api/Groups/${Id}`, edittedGroup);

  }

}
