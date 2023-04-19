import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Post, listPost } from '../post';
import { Observable } from 'rxjs';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  // ListPosts : Post[] = [
  //   {
  //     id : 1,
  //     idTopic : 1,
  //     title : "Rijeka begins year of European Capital of ...",
  //     url : '/assets/img/event-img/event1.png',
  //     // new Date ( year, month(octal : hệ bát phân), date[, hour, minute, second, millisecond ])
  //     time : new Date(2023, 0o3, 0o5, 9, 30, 0, 0),
  //     author : 'EuroNews',
  //     counter : '4 min read'
  //   },
  //   {
  //     id : 2,
  //     idTopic : 2,
  //     title : "Rijeka begins year of European Capital of ...",
  //     url : '/assets/img/event-img/event2.png',
  //     time : new Date(2023, 0o4, 0o5, 9, 30, 0, 0),
  //     author : 'EuroNews',
  //     counter : '4 min read'
  //   },
  //   {
  //     id : 3,
  //     title : "Rijeka begins year of European Capital of ...",
  //     idTopic : 3,
  //     url : '/assets/img/event-img/event3.png',
  //     time : new Date(2023, 0o5, 0o5, 9, 30, 0, 0), //6
  //     author : 'EuroNews',
  //     counter : '4 min read'
  //   },
  //   {
  //     id : 4,
  //     title : "Rijeka begins year of European Capital of ...",
  //     idTopic : 1,
  //     url : '/assets/img/event-img/event1.png',
  //     time : new Date(2023, 0o6, 0o5, 9, 30, 0, 0), // 7
  //     author : 'EuroNews',
  //     counter : '4 min read'
  //   },
  //   {
  //     id : 5,
  //     title : "Rijeka begins year of European Capital of ...",
  //     idTopic : 3,
  //     url : '/assets/img/event-img/event3.png',
  //     time : new Date(2023, 0o7, 0o5, 9, 30, 0, 0), // 8
  //     author : 'EuroNews',
  //     counter : '4 min read'
  //   },
  //   {
  //     id : 6,
  //     title : "Rijeka begins year of European Capital of ...",
  //     idTopic : 3,
  //     url : '/assets/img/event-img/event3.png',
  //     time : new Date(2023, 0o10, 0o5, 9, 30, 0, 0), //9
  //     author : 'EuroNews',
  //     counter : '4 min read'
  //   },
  //   {
  //     id : 7,
  //     title : "Rijeka begins year of European Capital of ...",
  //     idTopic : 2,
  //     url : '/assets/img/event-img/event2.png',
  //     time : new Date(2023, 0o11, 0o5, 9, 30, 0), // 10
  //     author : 'EuroNews',
  //     counter : '4 min read'
  //   },
  //   {
  //     id : 8,
  //     title : "Rijeka begins year of European Capital of ...",
  //     idTopic : 3,
  //     url : '/assets/img/event-img/event3.png',
  //     time : new Date(2023, 0o12, 0o5, 9, 30, 0, 0),//11
  //     author : 'EuroNews',
  //     counter : '4 min read'
  //   },
  //   {
  //     id : 9,
  //     title : "Rijeka begins year of European Capital of ...",
  //     idTopic : 2,
  //     url : '/assets/img/event-img/event2.png',
  //     time : new Date(2023, 0o13, 0o5, 9, 30, 0, 0),//12
  //     author : 'EuroNews',
  //     counter : '4 min read'
  //   },
  // ]
  constructor(private _route: ActivatedRoute, private router: Router  ){
    this.bsInlineRangeValue = [this.bsInlineValue, this.maxDate];
  }

  PostId = this._route.snapshot.paramMap.get('id');
  relatedPosts : Post[] = [];
  PostShow :Post | undefined;


  ngOnInit(): void {
    this.loadPost(Number(this.PostId));
  }

  loadPost(id:number){
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    this.relatedPosts = [];
    this.PostShow = listPost.find((p)=>p.id == id)
    // console.log(this.PostId, this.PostShow)
    let arr:Post[] = listPost.filter((p)=>{
      return ((p.idTopic == this.PostShow?.idTopic) && p.id != id) ;
    });
    arr = arr.sort((a, b)=>a.time.getTime() - b.time.getTime());
    for(let i = 0; i<= arr.length && i < 3;i++){
      if(arr[i]) {
          this.relatedPosts.push(arr[i]);
        }
      else return;
    }
    // window.scroll(0,0);

  }

  //calendar handle
  bsInlineValue = new Date();
  bsInlineRangeValue: Date[];
  maxDate = new Date();
  bsConfig?: Partial<BsDatepickerConfig> = Object.assign({}, {
    containerClass: 'theme-default',
    showWeekNumbers: false,
    // datePickerHead :'S, M, T, W, T, F, S'
  });
}
