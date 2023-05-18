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

  getListPost(){
    if(this.showSearch == true){
      this.postService.searchPost(this.keyWord, this.pageIndex).subscribe({
        next:data =>{
          this.listPost = data;
        }
      });
    }
    else{
      this.postService.loadListPost(this.pageIndex).subscribe({
        next:data =>{
          this.listPost = data;
        }
      })
    }
  }

  // detail
  showDialog(id : number){
    let post = this.listPost.find(p => p.id == id);
    this.dialog.open(PostDialog, {
      data : post,
    });
  }

  //delete
  deletePost(id : number){
    this.postService.deletePost(id).subscribe({
      next:data =>{
        this.getListPost();
        alert('Delete post successfully!');
      }
    })
  }

  // piority
  piorityToggle(id:number){
    let currPost = this.listPost.find(p=>p.id == id);
    let toggle = !currPost?.showInSlider;
    let tag = document.getElementById(`toggle${id}`);
    let thumb = document.getElementById(`thumb${id}`);
    console.log(`toggle${id}`)
    tag?.classList.toggle('checked');
    thumb?.classList.toggle('checked');
    this.postService.piorityToggle(id, toggle, currPost).subscribe({
    })
  }

  //search posts
  ClickBtn(){
    this.pageIndex = 0;
    if(this.showSearch == false){ // search icon
      let key = this.searchForm.get('keyWord')?.value?.trim();
      key = key?.replace(/ /g,'%20');
      this.keyWord = key;
      this.showSearch = true;
      this.postService.searchPost(key, this.pageIndex).subscribe({
        next:data =>{
          this.listPost = data;
        }
      });
    }
    else{ // close icon
      this.searchForm.reset({keyWord: ''});
      this.showSearch = false;
      this.getListPost();
    }
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

  haveResults(){
    if(this.listPost.length == 0) return false;
    else return true;
  }

}
