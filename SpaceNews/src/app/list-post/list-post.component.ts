import { Component, Inject, Input, OnInit, SimpleChanges } from '@angular/core';
import { Post, listPost } from '../post';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-list-post',
  templateUrl: './list-post.component.html',
  styleUrls: ['./list-post.component.css']
})
export class ListPostComponent implements OnInit{
  @Input() topicChecked = 0;

  constructor(public dialog: MatDialog){}

  posts : Post[] = listPost;//will show
  upcommingPost : Post[]= []
  ngOnInit(): void{
    let currDate = new Date();
    let upcommingTime = new Date();
    this.posts = listPost.sort((a, b)=>a.time.getTime() - b.time.getTime()); // will show
    this.posts = this.posts.filter((p)=>p.time.getTime() > currDate.getTime())//filter events pass
    // console.log('sorted')
    // if(this.posts[0].time.getMonth() == currDate.getMonth() && this.posts[0].time.getFullYear() == currDate.getFullYear()){
    //   if(this.posts[0].time.getDate() - currDate.getDate() <= 3) upcommingTime = this.posts[0].time;
    //   // console.log(this.posts[0].time.getDate() , currDate.getDate());
    // }
    this.posts.forEach(p=>{
      if(p.time.getMonth() == currDate.getMonth() && p.time.getFullYear() == currDate.getFullYear()){
        if(p.time.getDate() - currDate.getDate() <= 3) upcommingTime = p.time;
      }
    })

    this.upcommingPost = this.posts.filter((p)=> p.time <= upcommingTime);
    // this.upcommingPost.forEach((p)=>this.posts.unshift(p))
  }
  isUpcomming(id : number){
    if(this.upcommingPost.find((p)=>p.id == id)) return true;
    else return false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('topicChecked' in changes){
      let currDate = new Date();
      this.posts = this.posts.filter((p)=>p.time.getTime() > currDate.getTime())
      const topic = Number(changes['topicChecked'].currentValue);
      this.topicChecked = topic;
      this.ChangeTopic(topic);
    }
  }


  ChangeTopic(id:number){
    let currDate = new Date();
    if(id == 0){
      this.posts = listPost.filter((p)=>p.time.getTime() > currDate.getTime())
    }
    else{
      this.posts = listPost.filter(post => post.idTopic == id && post.time.getTime() > currDate.getTime())
    }
  }

  isFavourite = false;
  starClick(id : number){
    this.isFavourite = !this.isFavourite;

  }
  showDialog(id : number){
    let post = this.posts.find(p => p.id == id);
    const dialogRef = this.dialog.open(PostDialog, {
      data : post,
    });
  }
}

@Component({
  selector: 'post-dialog',
  templateUrl: '../post-dialog/post-dialog.html',
  styleUrls: ['../post-dialog/post-dialog.css']
})
export class PostDialog implements OnInit{
  constructor(
    public dialogRef: MatDialogRef<PostDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Post,
  ) {}
  ngOnInit(): void {

  }

}
