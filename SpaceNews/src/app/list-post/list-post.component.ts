import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Post, listPost } from '../post';

@Component({
  selector: 'app-list-post',
  templateUrl: './list-post.component.html',
  styleUrls: ['./list-post.component.css']
})
export class ListPostComponent implements OnInit{
  @Input() topicChecked = 0;

  constructor(){}

  posts : Post[] = listPost;//will show
  upcommingPost : Post[]= []
  ngOnInit(): void{
    let currDate = new Date();
    let upcommingTime = new Date();
    this.posts = listPost.sort((a, b)=>a.time.getTime() - b.time.getTime()); // will show
    this.posts = this.posts.filter((p)=>p.time.getTime() > currDate.getTime())
    // console.log('sorted')
    if(this.posts[0].time.getMonth() == currDate.getMonth() && this.posts[0].time.getFullYear() == currDate.getFullYear()){
      if(this.posts[0].time.getDate() - currDate.getDate() <= 3) upcommingTime = this.posts[0].time;
      // console.log(this.posts[0].time.getDate() , currDate.getDate());
    }

    this.upcommingPost = this.posts.filter((p)=> p.time == upcommingTime);
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

}
