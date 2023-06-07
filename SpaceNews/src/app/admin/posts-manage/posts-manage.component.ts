import { Component, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Post } from 'src/app/PostEvent';
import { ApiService } from 'src/app/Service/api.service';
import { HandlePostService } from 'src/app/Service/handle-post.service';
import { Topic } from 'src/app/Topic';
import { PostDialog } from 'src/app/list-post/list-post.component';
import { DomSanitizer} from '@angular/platform-browser'
import { PastEventsComponent } from '../past-events/past-events.component';
import { Group } from 'src/app/Group';
import { History } from 'src/app/content/content.component';

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
  ListTopic : Topic[] = [];
  listGroup : Group[] = [];
  idTopic = 0;

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

  constructor(private pastEventsDialog: MatDialog, private router : Router, private fb: FormBuilder, public dialog: MatDialog, private postService:HandlePostService, private apiService: ApiService, private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    // this.setUser();
    this.LoadTopics();
    this.searchForm = this.fb.group({
      keyWord:""
    })
    this.getListGroup();
    this.getListPost();
  }

  getListPost(){
    if(this.showSearch == true){
      this.postService.searchPost(this.keyWord, this.pageIndex, this.idTopic).subscribe({
        next:data =>{
          this.listPost = data;
          this.getGrNames();
        }
      });
    }
    else{
      if(this.idTopic == 0){
        this.postService.loadListPost(this.pageIndex);
        this.getGrNames();
      }
      this.postService.loadListPost(this.pageIndex, this.idTopic).subscribe({
        next:data =>{
          this.listPost = data;
          this.getGrNames();
        }
      })
    }
  }

  getListGroup(){
    this.apiService.getGroup().subscribe({
      next: data =>{
        this.listGroup = data;
      }
    })
  }

  getGrNames(){
    this.listPost.forEach(p=>{
      let idGr = p.groupID.split(',');
      let arr: string[] = [];
      idGr.forEach( id =>{
        let group = this.listGroup.find(g=>g.id == id);
        if(group){
          arr.push(group.name);
        }
      })
      p.groupNames = arr;
    })
  }

  LoadTopics(){
    sessionStorage.removeItem('prev');
    this.apiService.getTopic().subscribe({
      next:data =>{
        this.ListTopic = data;
      }
    })
  }

  // Past events
  openPastEventsDialog(){
    // reset search fearture
    this.searchForm.reset({keyWord: ''});
    this.showSearch = false;
    this.getListPost();

    this.pastEventsDialog.open(PastEventsComponent, {
      width: '85vw',
      height: '85vh',
    });
  }

  // detail
  showDialog(id : number){
    let post = this.listPost.find(p => p.id == id);
    this.handleHistory(id.toString());
    this.dialog.open(PostDialog, {
      data : post,
      maxWidth : '50%'
    });
  }

  handleHistory(postID : string){
    let userID = sessionStorage.getItem('userID');
    let eventsID : string ='';
    this.apiService.getHistory(userID).subscribe({
      next:data =>{
        eventsID = data.eventsID? data.eventsID : '';
        let arr = eventsID.split(',');
        let index = arr.indexOf(postID);
        if(index > -1) arr.splice(index, 1);
        if(arr.length >= 12) arr.shift();
        arr.push(postID);
        let body : History = {
          userID : userID,
          eventsID : arr.join(','),
        }
        console.log(body);
        this.apiService.addHistory(body).subscribe();
      }
    })
  }

  // style attributes for content innerHTML
  transformYourHtml(text: string) {
    return this.sanitizer.bypassSecurityTrustHtml(text);
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
    let currPost;
    let toggle;
    let tag = document.getElementById(`toggle${id}`);
    let thumb = document.getElementById(`thumb${id}`);
    tag?.classList.toggle('checked');
    thumb?.classList.toggle('checked');
    this.postService.getPost(id).subscribe({
      next:data =>{
        currPost = data;
        let gr = data.groupID.split(',');
        gr = gr.filter( g =>{this.listGroup.findIndex(x => x.id == g) != -1});
        toggle = !data.showInSlider;
        currPost.groupID = gr.join(',');
        toggle = data.priority==1 ? false:true;
        this.postService.piorityToggle(id, toggle, currPost).subscribe({
        })
      }
    });
  }

  statusToggle(id:number){
    let currPost;
    let toggle;
    let tag = document.getElementById(`statusToggle${id}`);
    let thumb = document.getElementById(`statusThumb${id}`);
    tag?.classList.toggle('checked');
    thumb?.classList.toggle('checked');
    this.postService.getPost(id).subscribe({
      next:data =>{
        currPost = data;
        let gr = data.groupID.split(',');
        // case group deleted
        gr = gr.filter( g =>{this.listGroup.findIndex(x => x.id == g) != -1});
        toggle = !data.showInSlider;
        currPost.groupID = gr.join(',');
        this.postService.statusToggle(id, toggle, currPost).subscribe({
        })
      }
    });
  }


  //search posts
  ClickBtn(){
    this.idTopic = 0
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

  //Topic Change
  topicChange(id : number){
    this.idTopic = id;
    this.pageIndex = 0;
    this.getListPost();
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
