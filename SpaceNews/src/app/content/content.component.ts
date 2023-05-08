import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
// import { Post, listPost } from '../post';
import { Post } from '../PostEvent';
import { ApiService } from '../Service/api.service';
import { PostDialog } from '../list-post/list-post.component'
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Topic } from '../Topic';
import { HttpClient } from '@angular/common/http';

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

  ListTopic : Topic[] = [];
  idTopic = 0;
  pageIndex = 0;
  postsSlider : Post[] = [];

  logged = false;
  user = {
    id : '',
    auth_token : ''
  }

  // search results
  showSearch = false;
  searchResults: Post[] = [];
  keyWord : string|undefined = '';

  //slider
  index = 0;
  idShow = 1; // 1
  urlShow = '';
  title = '';
  counter = 0;

  //calendar handle
  bsInlineValue = new Date();
  bsInlineRangeValue: Date[];
  maxDate = new Date();
  bsConfig?: Partial<BsDatepickerConfig> = Object.assign({}, {
    containerClass: 'theme-default',
    showWeekNumbers: false,
  });

  constructor(private router : Router, private apiService: ApiService, private http: HttpClient, public dialog: MatDialog) {
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.bsInlineRangeValue = [this.bsInlineValue, this.maxDate];
  }
  ngOnInit(){
    this.apiService.showSearch.subscribe({
      next:data => {
        this.showSearch = data;
        if(this.showSearch){
          this.keyWord = this.apiService.key;
          this.idTopic = 0;
          this.pageIndex = 0;
        }
        else return;
      }
    })
    this.LoadSlider();
    this.LoadTopics();

    this.setUser();
    // console.log(this.logged, this.user);
  }

  //slider handle'
  LoadSlider(){
    this.apiService.getSlider().subscribe({
      next:data =>{
        this.postsSlider= data.filter(d=>d.priority == 1)
        this.index = 0;
        this.idShow = this.postsSlider[this.index].id; // 1
        this.urlShow = this.postsSlider[this.index].image;
        this.title = this.postsSlider[this.index].title;
        this.counter = this.postsSlider.length;
      }
    })
    this.autoChangeSlider;
    // this.autoChangeSlider = setInterval(this.myInterval, 3500);
  }
  changeImg(){
    clearInterval(this.autoChangeSlider);
    this.autoChangeSlider = setInterval(this.myInterval, 3500);
    for (let e of this.postsSlider){
      if(e.id == this.idShow) this.urlShow = e.image;
    }
  }
  toEvent(id:number){
    clearInterval(this.autoChangeSlider);
    this.autoChangeSlider = setInterval(this.myInterval, 3500);
    this.idShow = id;
    this.changeImg();
  }
  toPrev(){
    clearInterval(this.autoChangeSlider);
    this.autoChangeSlider = setInterval(this.myInterval, 3500);
    if(this.index == 0) this.index = this.counter-1;
    else this.index--;

    this.idShow = this.postsSlider[this.index].id;
    this.urlShow = this.postsSlider[this.index].image
  }
  toNext(){
    clearInterval(this.autoChangeSlider);
    this.autoChangeSlider = setInterval(this.myInterval, 3500);

    if(this.index == this.counter-1) this.index = 0;
    else this.index++;

    this.idShow = this.postsSlider[this.index].id;
    this.urlShow = this.postsSlider[this.index].image
  }
  showDialog(id : number){
    let post = this.postsSlider.find(p => p.id == id);
    const dialogRef = this.dialog.open(PostDialog, {
      data : post,
    });
  }
  myInterval= () => {
    if(this.index == this.counter-1) this.index = 0;
    else this.index++;

    this.idShow = this.postsSlider[this.index].id;
    this.urlShow = this.postsSlider[this.index].image;
    this.title = this.postsSlider[this.index].title;
  }
  autoChangeSlider = setInterval(this.myInterval, 3500);

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
    this.keyWord = '';
    this.apiService.stopSearch();
  }

  // handle page number
  changePage(value:number){
    this.idTopic = this.idTopic;
    this.pageIndex = value;
  }
  pagePrev(){
    if(this.pageIndex > 0)this.pageIndex -= 1;
    else return;
    // console.log(this.pageIndex)
  }
  pageNext(){
    if(this.pageIndex < 9)this.pageIndex += 1;
    else return;
    // console.log(this.pageIndex)
  }


}
