import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { DomSanitizer} from '@angular/platform-browser';
import { Router } from '@angular/router';
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
  postsSlider : Post[] = [];

  posts : Post[] = [];

  constructor(
    public dialogRef: MatDialogRef<PastEventsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Post[],
    // @Inject(MAT_DIALOG_DATA) public grName: string,
    private handlePostService: HandlePostService,
    private apiService: ApiService,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}


  ngOnInit(): void {
    this.LoadTopics();
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
    });

    // catch event navigation
    this.router.events
    .subscribe(() => {
    this.dialogRef.close();
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
      }
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
    if(this.pageIndex < 9)this.pageIndex += 1;
    else return;
    this.getListPost(this.idTopic, this.pageIndex);
  }

  haveResults(){
    if(this.posts.length == 0) return false;
    else return true;
  }

}
