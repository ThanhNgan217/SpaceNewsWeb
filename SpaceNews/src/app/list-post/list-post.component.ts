import { Component, EventEmitter, Inject, Input, OnInit, Output, SimpleChanges } from '@angular/core';
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
  @Input() pageIndex = 0;
  @Output() changePage = new EventEmitter();
  @Output() topicChange = new EventEmitter();

  listPost : Post[] = [];
  constructor(public dialog: MatDialog, private apiService:ApiService){}

  posts : Post[] = [];//will show
  upcommingPost : Post[]= [];
  passedEvent : Post[] = [];

  // search results
  showSearch = false;
  searchResults: Post[] = [];
  keyWord : string|undefined;

  ngOnInit(): void{
    this.apiService.showSearch.subscribe({
      next:data => {
        this.showSearch = data;
        console.log(this.showSearch)
        if(this.showSearch){
          this.keyWord = this.apiService.key;
          this.pageIndex = 0
          this.changePage.emit(this.pageIndex);
          this.topicChecked = 0;
          this.topicChange.emit(0);
          this.getListPost(undefined, this.pageIndex, this.keyWord)
        }
        // this.posts = this.apiService.searchResults;
      }
    })
    this.getListPost(this.topicChecked, this.pageIndex, this.keyWord);

    // this.posts = this.listPost;
    // this.upcommingPost.forEach((p)=>this.posts.unshift(p))
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('topicChecked' in changes){
      if(this.showSearch == true && this.topicChecked == 0){
        this.showSearch = false;
      }
      else{
        this.pageIndex = 0;
        // this.changePage.emit(this.pageIndex);
        const topic = Number(changes['topicChecked'].currentValue);
        this.topicChecked = topic;
        this.apiService.stopSearch();
        this.ChangeTopic(topic);
      }
    }
    if('pageIndex' in changes){
      this.getListPost(this.topicChecked, this.pageIndex, this.keyWord)
    }
  }

  // getsearchPost(numpage = 0, key = ''){
  //   this.apiService.getSearchResults(numpage, key)
  // }

  getListPost(topicId = 0, pagenum = 0, key =''){
    if(this.showSearch){
      this.apiService.getSearchResults(pagenum, key).subscribe({
        next:data =>{
          this.listPost = data;
          this.handlePosts();
        }
      })
    }
    else{
      this.apiService.getPosts(topicId, pagenum).subscribe({
        next:data =>{
          this.listPost = data;
          this.handlePosts();
        }
      })
    }
  }

  handlePosts(){
    let currDate = new Date();
    let upcommingTime = new Date();
    let t = currDate.getTime();
    let list: Post[] = [];
    let passEvent : Post[] = [];
    // this.listPost.forEach(p =>{
    //   console.log(new Date(p.time).getTime());
    // })

    //listPost.length = 9 => if (p.time > currDate) => push;
                            // if (p is upcomming) => unshift;

    this.listPost.forEach(p =>{
      let x = new Date(p.time);
      if(x.getTime() < t){ // event pass
        passEvent.push(p);
      }
      else{
        list.push(p);
      }
    })

    //sort list
    this.posts = list.sort((a, b)=>{
        let x = new Date(a.time).getTime();
        let y = new Date(b.time).getTime();
        return x - y;
    })

    //upcomming time
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

    this.passedEvent = passEvent.sort((a, b)=>{
      let x = new Date(a.time).getTime();
      let y = new Date(b.time).getTime();
      return x - y;
    });

    this.posts = this.posts.concat(passEvent);
    // console.log(this.posts)
    // if(false){
    //   this.listPost.forEach(p=>{
    //   let x = new Date(p.time).getTime();
    //   if(i <= 8 && x > currDate.getTime()) {
    //     list.push(p);
    //     i++;
    //   }
    //   else {
    //     return;
    //   }
    // })

    // will show
    // this.posts = list.sort((a, b)=>{
    //   // a.time.getTime() - b.time.getTime()
    //   let x = new Date(a.time).getTime();
    //   let y = new Date(b.time).getTime();
    //   return x - y;
    // });

    // filter events pass
    // this.posts = this.posts.filter((p)=>{
    //   // new Date(p.time).getTime() > currDate.getTime()
    //   let x = new Date(p.time).getTime();
    //   return x > currDate.getTime();
    // })

    // this.posts.forEach(p=>{
    //   let x = new Date(p.time);
    //   if(x.getMonth() == currDate.getMonth() && x.getFullYear() == currDate.getFullYear()){
    //     if(x.getDate() - currDate.getDate() <= 3) upcommingTime = x;
    //   }
    // })

    // this.upcommingPost = this.posts.filter((p)=> {
    //   let x = new Date(p.time);
    //   if(x <= upcommingTime) return p;
    //   else return;
    // });}

  }

  isPassed(id : number){
    // console.log(this.passedEvent)
    if(this.passedEvent.find((p)=>p.id == id)) return true;
    else return false;
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
    this.changePage.emit(this.pageIndex);
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
