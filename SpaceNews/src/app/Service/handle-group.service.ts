import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Group } from '../Group';
import { GroupMembers } from '../GroupMembers';
import { Member } from '../Member';

interface formGroupData {
  groupName:'',
  // groupMail:'',
}

@Injectable({
  providedIn: 'root'
})
export class HandleGroupService {
  constructor(private apiService:ApiService, private http:HttpClient) { }
  auth = sessionStorage.getItem('auth_token');
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

  searchOption: Member[] = [];
  // memberData: Member[]

  addGroup(obj : formGroupData, indx: string){
    let newGroup = {
      name: obj.groupName,
      memberID: indx
    };

    return this.http.post(`${this.url}/api/GroupMembers`, JSON.stringify(newGroup), this.httpOptions);
  }
  searchGroup(keyWord='', pageIndex: number){
    return this.http.get<GroupMembers[]>(`${this.url}/api/GroupMembers?keyword=${keyWord}&pageIndex=${pageIndex}&pageSize=6`);
  }
  loadListGroup(pageIndex = 0){
    return this.http.get<GroupMembers[]>(`${this.url}/api/GroupMembers?pageIndex=${pageIndex}&pageSize=6`);
  }
  loadAllGroups(){
    return this.http.get<GroupMembers[]>(`${this.url}/api/GroupMembers?pageIndex=0&pageSize=9999`);
  }
  deleteGroup(val: number){
    return this.http.delete(`${this.url}/api/GroupMembers/${val}`);
  }
  editGroup(obj: formGroupData, indx: string, Id: number){
    let edittedGroup = {
      name: obj.groupName,
      memberID: indx,
      id: Id
    };
    return this.http.put<GroupMembers>(`${this.url}/api/GroupMembers/${Id}`, edittedGroup);

  }
  getMembersofGroups(groupId: number){
    return this.http.get<GroupMembers[]>(`${this.url}/api/GroupMembers/${groupId}`)
  }
  getGroup(id:number){
    return this.http.get<GroupMembers>(`${this.url}/api/GroupMembers/${id}`);
  }



}
