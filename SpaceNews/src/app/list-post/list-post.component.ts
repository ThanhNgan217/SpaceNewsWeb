import { Component, Inject, Input, OnInit, SimpleChanges } from '@angular/core';
// import { Post, listPost } from '../post';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Post } from '../PostEvent';
import { ApiService } from '../Service/api.service';

@Component({
  selector: 'app-list-post',
  templateUrl: './list-post.component.html',
  styleUrls: ['./list-post.component.css']
})
export class ListPostComponent implements OnInit{
  @Input() topicChecked = 0;

  listPost : Post[] = [];
  constructor(public dialog: MatDialog, private apiService:ApiService){}

  posts : Post[] = [];//will show
  upcommingPost : Post[]= [];

  ngOnInit(): void{
    this.getListPost(this.topicChecked);
    // this.posts = this.listPost;
    // this.upcommingPost.forEach((p)=>this.posts.unshift(p))
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('topicChecked' in changes){
      let currDate = new Date();
      this.posts = this.posts.filter((p)=>{
        // p.time.getTime() > currDate.getTime()
        let x = new Date(p.time);
        return x.getTime() > currDate.getTime();
      })
      const topic = Number(changes['topicChecked'].currentValue);
      this.topicChecked = topic;
      this.ChangeTopic(topic);
    }
  }

  getListPost(topicId = 0){
    this.apiService.getPosts(topicId).subscribe({
      next:data =>{
        this.listPost = data;
        // this.posts = data;
        this.handlePosts();
      }
    })

  }

  handlePosts(){
    let currDate = new Date();
    let upcommingTime = new Date();
    let i = 0;
    let list: Post[] = [];
    // this.listPost.forEach(p =>{
    //   console.log(new Date(p.time).getTime());
    // })
    this.listPost.forEach(p=>{
      if(i <= 8) {
        list.push(p);
        i++;
      }
      else return;
    })
    this.posts = list.sort((a, b)=>{
      // a.time.getTime() - b.time.getTime()
      let x = new Date(a.time).getTime();
      let y = new Date(b.time).getTime();
      return x - y;
    }); // will show
    this.posts = this.posts.filter((p)=>{
      // new Date(p.time).getTime() > currDate.getTime()
      let x = new Date(p.time).getTime();
      return x > currDate.getTime();
    })//filter events pass
    this.posts.forEach(p=>{
      let x = new Date(p.time);
      if(x.getMonth() == currDate.getMonth() && x.getFullYear() == currDate.getFullYear()){
        if(x.getDate() - currDate.getDate() <= 3) upcommingTime = x;
      }
    })
    this.upcommingPost = this.posts.filter((p)=> {
      let x = new Date(p.time);
      if(x <= upcommingTime) return p;
      else return;
    });
  }

  isUpcomming(id : number){
    if(this.upcommingPost.find((p)=>p.id == id)) return true;
    else return false;
  }


  ChangeTopic(id:number){
    // let currDate = new Date();
    // if(id == 0){
    //   this.posts = this.listPost.filter((p)=>{
    //     // p.time.getTime() > currDate.getTime()
    //     let x = new Date(p.time);
    //     return x.getTime() > currDate.getTime();
    //   })
    // }
    // else{
    //   this.posts = this.listPost.filter(post => {
    //     // post.topicID == id && post.time.getTime() > currDate.getTime()
    //     let x = new Date(post.time);
    //     if(post.topicID == id && x.getTime() > currDate.getTime()) return post;
    //     else return;
    //   })
    // }
    this.getListPost(id);
  }

  // favourite
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
