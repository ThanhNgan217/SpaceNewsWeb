import { Component, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Group } from 'src/app/Group';
import { Post } from 'src/app/PostEvent';
import { ApiService } from 'src/app/Service/api.service';
import { HandleGroupService } from 'src/app/Service/handle-group.service';
import { PostDialog } from 'src/app/list-post/list-post.component';

interface User{
  id : string|null,
  auth_token : string |null,
}


@Component({
  selector: 'app-group-manage',
  templateUrl: './group-manage.component.html',
  styleUrls: ['./group-manage.component.css']
})
export class GroupManageComponent implements OnInit {

  listGroup : Group[] = [];
  pageIndex = 0;
  menuShow = false;
  searchForm = new FormGroup({
    keyWord : new FormControl<string>("")
  });

  user : User = {
    id : '',
    auth_token : ''
  }

  // search results
  showSearch = false;
  searchResults: Group[] = [];
  keyWord : string|undefined = '';

  constructor(private router : Router, private fb: FormBuilder, public dialog: MatDialog, private groupService:HandleGroupService) {
  }

  ngOnInit(): void {
    // this.setUser();
    this.searchForm = this.fb.group({
      keyWord:""
    })
    this.getListGroup();
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  getListGroup(){
    if(this.showSearch == true){
      this.groupService.getListGroup().subscribe({
        next:data =>{
          this.listGroup = data;
        }
      });
    }
    else{
      this.groupService.getListGroup().subscribe({
        next:data =>{
          this.listGroup = data;
        }
      })
    }
  }

  // detail
  showDialog(id : number){
    // let post = this.listGroup.find(p => p.id == id);
    // this.dialog.open(PostDialog, {
    //   data : post,
    // });
  }

  //delete
  deletePost(id : number){

  }

  //search posts
  ClickBtn(){

  }

  // handle page number
  changePage(value:number){
    this.pageIndex = value;
    this.getListGroup();
  }
  pagePrev(){
    if(this.pageIndex > 0)this.pageIndex -= 1;
    else return;
    this.getListGroup();
  }
  pageNext(){
    if(this.pageIndex < 9)this.pageIndex += 1;
    else return;
    this.getListGroup();
  }

  haveResults(){
    if(this.listGroup.length == 0) return false;
    else return true;
  }

}
