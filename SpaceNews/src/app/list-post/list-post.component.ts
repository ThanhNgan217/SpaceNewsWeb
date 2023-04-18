import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Post, listPost } from '../post';

@Component({
  selector: 'app-list-post',
  templateUrl: './list-post.component.html',
  styleUrls: ['./list-post.component.css']
})
export class ListPostComponent {
  @Input() topicChecked = 0;

  constructor(){
    this.posts = listPost.sort((a, b)=>a.time.getTime() - b.time.getTime()); // will show
  }

  posts : Post[] = listPost;//will show

  ngOnChanges(changes: SimpleChanges): void {
    if ('topicChecked' in changes){
      const topic = Number(changes['topicChecked'].currentValue);
      this.topicChecked = topic;
      this.ChangeTopic(topic);
    }
  }

  // sort (time & piority) -> show list (upcomming, piority, normal)
  isUpcomming(id : number){ // <= 3 days
    let upcommingTime = this.posts[0].time;
    let currPost = this.posts.find((p)=> p.id == id);
    let currDate = new Date();
    console.log(upcommingTime.getTime() - currDate.getTime() <= 3)
    if((currPost?.time == upcommingTime) && (upcommingTime.getTime() - currDate.getTime() <= 3)) return true;
    else return false
  }

  ChangeTopic(id:number){
    if(id == 0){
      this.posts = listPost;
    }
    else{
      this.posts = listPost.filter(post => post.idTopic == id)
    }
  }

}
