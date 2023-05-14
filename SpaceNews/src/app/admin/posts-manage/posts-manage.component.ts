import { Component, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Post } from 'src/app/PostEvent';
import { ApiService } from 'src/app/Service/api.service';
import { HandlePostService } from 'src/app/Service/handle-post.service';
import { PostDialog } from 'src/app/list-post/list-post.component';

interface User{
  id : string|null,
  auth_token : string |null,
}

@Component({
  selector: 'app-posts-manage',
  templateUrl: './posts-manage.component.html',
  styleUrls: ['./posts-manage.component.css']
})
export class PostsManageComponent implements OnInit {

  listPost : Post[] = [];
  topicChecked = 0;
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
  searchResults: Post[] = [];
  keyWord : string|undefined = '';

  constructor(private router : Router, private fb: FormBuilder, public dialog: MatDialog, private postService:HandlePostService) {
  }

  ngOnInit(): void {
    // this.setUser();
    this.searchForm = this.fb.group({
      keyWord:""
    })
    this.getListPost();
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  getListPost(){
    // if(sessionStorage.getItem('isSearch')){

    //   this.postService.searchPost(this.keyWord, this.pageIndex);
    // }
    // else {
      this.postService.loadListPost(this.pageIndex).subscribe({
        next:data =>{
          this.listPost = data;
        }
      })
    // }
  }

  showDialog(id : number){
    let post = this.listPost.find(p => p.id == id);
    this.dialog.open(PostDialog, {
      data : post,
    });
  }

  // setUser(){
  //   this.user.id = sessionStorage.getItem('userID');
  //   this.user.auth_token = sessionStorage.getItem('auth_token');
  // }

  // Logout(){
  //   sessionStorage.removeItem('userID');
  //   sessionStorage.removeItem('auth_token');
  //   sessionStorage.removeItem('userRole');
  //   this.router.navigate(['']);
  // }

  // isPostsPage(){
  //   if(this.router.url == '/posts') return true;
  //   return false;
  // }

  searchClick(){
    // this.showSearch = true;
    let key = this.searchForm.get('keyWord')?.value?.trim();

    key = key?.replace(/ /g,'%20');
    // console.log("hello",key);
    this.showSearch = true;
    this.searchForm.reset({keyWord: ''});
    this.postService.searchPost(key, this.pageIndex).subscribe({
      next:data =>{
        this.listPost = data;
      }
    });
  }

  // handle page number
  changePage(value:number){
    this.pageIndex = value;
    this.getListPost();
  }
  pagePrev(){
    if(this.pageIndex > 0)this.pageIndex -= 1;
    else return;
    this.getListPost();
  }
  pageNext(){
    if(this.pageIndex < 9)this.pageIndex += 1;
    else return;
    this.getListPost();
  }
}
