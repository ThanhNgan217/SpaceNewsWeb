import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Post, listPost } from '../post';
import { ApiService } from '../Service/api.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent {
  // listEvent=[
  //   {
  //     id: 1,
  //     url:'/assets/img/event-img/event1.png'
  //   },
  //   {
  //     id: 2,
  //     url:'/assets/img/event-img/event2.png'
  //   },
  //   {
  //     id: 3,
  //     url:'/assets/img/event-img/event3.png'
  //   }
  // ]
  listEvent = listPost.filter((p)=> p.piority == true);

  logged = false;
  user = {
    id : '',
    auth_token : ''
  }

  //slider
  index = 0;
  idShow = this.listEvent[this.index].id; // 1
  urlShow = this.listEvent[this.index].url
  counter = this.listEvent.length;

  constructor(private router : Router, private apiService: ApiService) {
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.bsInlineRangeValue = [this.bsInlineValue, this.maxDate];
  }
  ngOnInit(){
    setInterval(() => {
      if(this.index == this.counter-1) this.index = 0;
      else this.index++;

      this.idShow = this.listEvent[this.index].id;
      this.urlShow = this.listEvent[this.index].url
    }, 4000);
    this.setUser();
    console.log(this.logged, this.user);
  }

  //slider handle
  changeImg(){
    clearInterval;
    for (let e of this.listEvent){
      if(e.id == this.idShow) this.urlShow = e.url;
    }
  }
  toEvent(id:number){
    clearInterval;
    this.idShow = id;
    this.changeImg();
  }
  toPrev(){
    clearInterval;
    if(this.index == 0) this.index = this.counter-1;
    else this.index--;

    this.idShow = this.listEvent[this.index].id;
    this.urlShow = this.listEvent[this.index].url
  }
  toNext(){
    clearInterval;
    if(this.index == this.counter-1) this.index = 0;
    else this.index++;

    this.idShow = this.listEvent[this.index].id;
    this.urlShow = this.listEvent[this.index].url
  }
  //logged
  setUser(){
    let arr:string[] =[];
    this.apiService.currUsser.subscribe((__value: string[]) => {
      arr.push(__value[0]);
      arr.push(__value[1]);
    })
    if(arr[0]) {
      this.user.id = arr[0];
      this.user.auth_token = arr[1];
      this.logged = true;
    }
    else{
      this.logged = false;
      this.user.id = '';
      this.user.auth_token = '';
    }
  }

  //list topic handle
  ListTopic = [
    {
      id : 1,
      subject : 'Subject 1'
    },
    {
      id : 2,
      subject : 'Subject 2'
    },
    {
      id : 3,
      subject : 'Subject 3'
     },
  ]
  topicChecked = 0;

  topicChange(value : number){
    this.topicChecked = value;
  }

  //calendar handle
  bsInlineValue = new Date();
  bsInlineRangeValue: Date[];
  maxDate = new Date();
  bsConfig?: Partial<BsDatepickerConfig> = Object.assign({}, {
    containerClass: 'theme-default',
    showWeekNumbers: false,
  });
}
