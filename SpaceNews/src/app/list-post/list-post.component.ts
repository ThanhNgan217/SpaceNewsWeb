import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Post } from '../post';

@Component({
  selector: 'app-list-post',
  templateUrl: './list-post.component.html',
  styleUrls: ['./list-post.component.css']
})
export class ListPostComponent {
  @Input() topicChecked = 0;

  constructor(){}

  ngOnChanges(changes: SimpleChanges): void {
    if ('topicChecked' in changes){
      const topic = Number(changes['topicChecked'].currentValue);
      this.topicChecked = topic;
      this.ChangeTopic(topic);
    }
  }

  ListPosts : Post[] = [
    {
      id : 1,
      idTopic : 1,
      title : "Rijeka begins year of European Capital of ...",
      url : '/assets/img/event-img/event1.png',
      // new Date ( year, month(octal : hệ bát phân), date[, hour, minute, second, millisecond ])
      time : new Date(2023, 0o3, 0o5, 9, 30, 0, 0),
      author : 'EuroNews',
      counter : '4 min read'
    },
    {
      id : 2,
      idTopic : 2,
      title : "Rijeka begins year of European Capital of ...",
      url : '/assets/img/event-img/event2.png',
      time : new Date(2023, 0o4, 0o5, 9, 30, 0, 0),
      author : 'EuroNews',
      counter : '4 min read'
    },
    {
      id : 3,
      title : "Rijeka begins year of European Capital of ...",
      idTopic : 3,
      url : '/assets/img/event-img/event3.png',
      time : new Date(2023, 0o5, 0o5, 9, 30, 0, 0), //6
      author : 'EuroNews',
      counter : '4 min read'
    },
    {
      id : 4,
      title : "Rijeka begins year of European Capital of ...",
      idTopic : 1,
      url : '/assets/img/event-img/event1.png',
      time : new Date(2023, 0o6, 0o5, 9, 30, 0, 0), // 7
      author : 'EuroNews',
      counter : '4 min read'
    },
    {
      id : 5,
      title : "Rijeka begins year of European Capital of ...",
      idTopic : 3,
      url : '/assets/img/event-img/event3.png',
      time : new Date(2023, 0o7, 0o5, 9, 30, 0, 0), // 8
      author : 'EuroNews',
      counter : '4 min read'
    },
    {
      id : 6,
      title : "Rijeka begins year of European Capital of ...",
      idTopic : 3,
      url : '/assets/img/event-img/event3.png',
      time : new Date(2023, 0o10, 0o5, 9, 30, 0, 0), //9
      author : 'EuroNews',
      counter : '4 min read'
    },
    {
      id : 7,
      title : "Rijeka begins year of European Capital of ...",
      idTopic : 2,
      url : '/assets/img/event-img/event2.png',
      time : new Date(2023, 0o11, 0o5, 9, 30, 0), // 10
      author : 'EuroNews',
      counter : '4 min read'
    },
    {
      id : 8,
      title : "Rijeka begins year of European Capital of ...",
      idTopic : 3,
      url : '/assets/img/event-img/event3.png',
      time : new Date(2023, 0o12, 0o5, 9, 30, 0, 0),//11
      author : 'EuroNews',
      counter : '4 min read'
    },
    {
      id : 9,
      title : "Rijeka begins year of European Capital of ...",
      idTopic : 2,
      url : '/assets/img/event-img/event2.png',
      time : new Date(2023, 0o13, 0o5, 9, 30, 0, 0),//12
      author : 'EuroNews',
      counter : '4 min read'
    },
  ] // data

  posts : Post[] = this.ListPosts; // will show

  ChangeTopic(id:number){
    if(id == 0){
      this.posts = this.ListPosts;
    }
    else{
      this.posts = this.ListPosts.filter(post => post.idTopic == id)
    }
  }

}
