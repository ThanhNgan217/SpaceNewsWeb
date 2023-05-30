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
import { Group } from '../Group';

interface User{
  id : string|null,
  auth_token : string |null,
}

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
  listGroup: Group[] = [];
  idTopic = 0;
  pageIndex = 0;
  postsSlider : Post[] = [];

  logged = sessionStorage.getItem('userID')? true : false;
  user : User = {
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
    this.getListGroup();
    this.LoadSlider();
    this.LoadTopics();
    this.setUser();
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
    this.autoChangeSlider;

    // console.log(this.logged, this.user);
  }

  myInterval= () => {
    if(this.index == this.counter-1) this.index = 0;
    else this.index++;
    this.idShow = this.postsSlider[this.index].id;
    this.urlShow = this.postsSlider[this.index].image;
    this.title = this.postsSlider[this.index].title;
  }

  //slider handle'
  LoadSlider(){
    this.apiService.getSlider().subscribe({
      next:data =>{
        this.postsSlider= data.filter(d=>d.priority == 1)
        this.getGrNames();
        this.index = 0;
        this.idShow = this.postsSlider[0].id; // 1
        this.urlShow = this.postsSlider[0].image;
        this.title = this.postsSlider[0].title;
        this.counter = this.postsSlider.length;
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
    this.postsSlider.forEach(p=>{
      let idGr = p.groupID.split(',');
      let arr: string[] = [];
      idGr.map( id =>{
        let group = this.listGroup.find(g=>g.id == id);
        if(group){
          arr.push(group.name);
        }
      })
      p.groupNames = arr;
    })
  }

  toEvent(id:number){
    clearInterval(this.autoChangeSlider);
    let index = 0;
    for (let e of this.postsSlider){
      if(e.id == id) {
        this.urlShow = e.image;
        this.idShow = e.id;
        this.title = e.title;
        this.index = index;
      }
      index++;
    }
    this.autoChangeSlider = setInterval(this.myInterval, 3500);

    // this.changeImg();
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
    this.dialog.open(PostDialog, {
      data : post,
    });
  }

  autoChangeSlider = setInterval(this.myInterval, 3500);

  //logged
  setUser(){
    this.user.id = sessionStorage.getItem('userID');
    this.user.auth_token = sessionStorage.getItem('auth_token');
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
