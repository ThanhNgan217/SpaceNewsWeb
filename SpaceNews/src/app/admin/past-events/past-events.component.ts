import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogState } from '@angular/material/dialog';

import { DomSanitizer} from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Group } from 'src/app/Group';
import { Post } from 'src/app/PostEvent';
import { ApiService } from 'src/app/Service/api.service';
import { HandlePostService } from 'src/app/Service/handle-post.service';
import { Topic } from 'src/app/Topic';
import { PostDialog } from 'src/app/list-post/list-post.component';

@Component({
  selector: 'app-past-event',
  templateUrl: './past-events.component.html',
  styleUrls: ['./past-events.component.css']
})
export class PastEventsComponent implements OnInit {
  ListTopic : Topic[] = [];
  idTopic = 0;
  pageIndex = 0;
  posts : Post[] = [];
  listGroup : Group[] = [];
  eventsQuantity = 0;

  constructor(
    public dialogRef: MatDialogRef<PastEventsComponent>,
    public eventDialogRef: MatDialogRef<PostDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Post[],
    // @Inject(MAT_DIALOG_DATA) public grName: string,
    private handlePostService: HandlePostService,
    private apiService: ApiService,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}


  ngOnInit(): void {
    this.getNumPages();
    this.LoadTopics();
    this.getListGroup();
    this.getListPost();

  }

  close(){
    this.dialogRef.close();
    sessionStorage.removeItem('pastEvents');
  }

  showDialog(id : number){
    let post = this.posts.find(p => p.id == id);
    sessionStorage.setItem('pastEvents', '1');
    this.dialog.open(PostDialog, {
      data : post,
      maxWidth : '50%'
    });

    // catch event navigation
    this.router.events
    .subscribe(() => {
    this.dialogRef.close();
  });
  }

  getNumPages(){
    this.apiService.getEventQuantity(true).subscribe(data => {
      if(data % 12 != 0) this.eventsQuantity = Math.floor(data/12);
      else this.eventsQuantity = Math.floor(data/12)-1;
      console.log(data)
      console.log(this.eventsQuantity)
    });
  }

  LoadTopics(){
    this.apiService.getTopic().subscribe({
      next:data =>{
        this.ListTopic = data;
      }
    })
  }
  topicChange(value : number){
    this.idTopic = value;
    this.pageIndex = 0;
    this.getListPost(value, this.pageIndex);
  }

  getListPost(topicId = 0, pagenum = 0){
    this.handlePostService.getPastEvents(topicId, pagenum).subscribe({
      next:data =>{
        // this.listPost = data;
        this.posts = data;
        this.getGrNames();
      }
    })
  }

  getListGroup(){
    this.apiService.getGroup().subscribe({
      next: data =>{
        this.listGroup = data;
      }
    })
  }

  getGrNames(){
    this.posts.forEach(p=>{
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

  // handle page number
  changePage(value:number){
    this.pageIndex = value;
    this.getListPost(this.idTopic, value);
  }
  pagePrev(){
    if(this.pageIndex > 0)this.pageIndex -= 1;
    else return;
    this.getListPost(this.idTopic, this.pageIndex);
  }
  pageNext(){
    if(this.pageIndex < this.eventsQuantity)this.pageIndex += 1;
    else return;
    this.getListPost(this.idTopic, this.pageIndex);
  }

  haveResults(){
    if(this.posts.length == 0) return false;
    else return true;
  }

}
