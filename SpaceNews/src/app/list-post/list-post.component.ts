import { Component, SecurityContext, EventEmitter, Inject, Input, OnInit, Output, SimpleChanges } from '@angular/core';
// import { Post, listPost } from '../post';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Post } from '../PostEvent';
import { ApiService } from '../Service/api.service';
import { DomSanitizer} from '@angular/platform-browser'

@Component({
  selector: 'app-list-post',
  templateUrl: './list-post.component.html',
  styleUrls: ['./list-post.component.css']
})
export class ListPostComponent implements OnInit{
  @Input() topicChecked = 0;
  @Input() pageIndex = 0;
  @Input() keyWord : string|undefined;
  @Output() changePage = new EventEmitter();
  @Output() topicChange = new EventEmitter();

  isAdmin = false;

  posts : Post[] = [];//will show
  onWeek: Post[] = [];// <= 7days
  upcomming : Post[] = [];// <= 3days

  keyWordOrigin : string |undefined;
  listPost : Post[] = [];
  constructor(public dialog: MatDialog, private apiService:ApiService){}



  // search results
  // showSearch = false;
  // searchResults: Post[] = [];
  // keyWord : string|undefined;

  ngOnInit(): void{
    if(sessionStorage.getItem('userID')) this.isAdmin = true;
    // this.getListPost(this.topicChecked, this.pageIndex, this.keyWord);
    // this.posts = this.listPost;
    // this.upcommingPost.forEach((p)=>this.posts.unshift(p))
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('topicChecked' in changes){
      const topic = Number(changes['topicChecked'].currentValue);
        this.pageIndex = 0;
        this.changePage.emit(this.pageIndex);
        // const topic = Number(changes['topicChecked'].currentValue);
        this.topicChecked = topic;
        this.apiService.stopSearch();
        this.ChangeTopic(topic);
      // if('pageIndex'in changes){
      //   this.getListPost(topic, this.pageIndex);
      // }else this.getListPost(topic, 0);
    }
    else if('keyWord' in changes){
      let str = /%20/g;
      this.keyWordOrigin = this.keyWord?.replace(str,' ');
      this.getListPost(this.topicChecked,this.pageIndex, this.keyWord);
    }
    else if('pageIndex' in changes){
      if(this.keyWord){
        this.getListPost(this.topicChecked, this.pageIndex, this.keyWord)
      }
        else {
          this.getListPost(this.topicChecked, this.pageIndex, '');}
    }

  //   if ('topicChecked' in changes){
  //     this.pageIndex = 0;
  //     // this.changePage.emit(this.pageIndex);
  //     const topic = Number(changes['topicChecked'].currentValue);
  //     this.topicChecked = topic;
  //     this.apiService.stopSearch();
  //     this.ChangeTopic(topic);
  // }
  // if('keyWord' in changes){
  //   let str = /%20/g;
  //   this.keyWordOrigin = this.keyWord?.replace(str,' ');
  //   this.getListPost(this.topicChecked,this.pageIndex, this.keyWord);
  // }
  // if('pageIndex' in changes){
  //   if(this.keyWord){
  //     this.getListPost(this.topicChecked, this.pageIndex, this.keyWord)
  //   }
  //     else {
  //       this.getListPost(this.topicChecked, this.pageIndex, '');}
  // }
  }

  // getsearchPost(numpage = 0, key = ''){
  //   this.apiService.getSearchResults(numpage, key)
  // }

  getListPost(topicId = 0, pagenum = 0, key :string|undefined = ''){
    if(key){
      // need sort, enable, not passed event
      this.apiService.getSearchResults(pagenum, key).subscribe({
        next:data =>{
          // this.listPost = data;
          this.posts = data;
          this.handlePosts();
        }
      })
    }
    else{
      this.apiService.getPosts(topicId, pagenum).subscribe({
        next:data =>{
          // this.listPost = data;
          this.posts = data;
          this.handlePosts();
        }
      })
    }
  }

  handlePosts(){
    let currDate = new Date();
    let t = currDate.getTime();

    // onWeek list
    // 259200000 ms = 72h = 3days
    // 345600000 ms = 96h = 4days
    // 345599999 ms = 96h - 1s = 4days - 1s
    // 604800000 ms = 168h = 7days
    // 691199000 ma = ... = 8days -1s
    this.posts.forEach((p)=>{
      let x = new Date(p.time);
      if(x.getTime() - t <= 604800000 && x.getTime() - t >= -36399000){
        if(x.getTime() - t <= 259200000) this.upcomming.push(p)
        else this.onWeek.push(p);
      }
    })

  }

  isUpcomming(id : number){
    if(this.upcomming.find(p=>p.id == id)) return true;
    else return false;
  }
  isOnWeek(id : number){
    if(this.onWeek.find(p => p.id == id)) return true;
    else return false;
  }


  ChangeTopic(id:number){
    // this.changePage.emit(this.pageIndex);
    this.getListPost(id);
  }

  // favourite
  isFavourite = false;
  starClick(id : number){
    this.isFavourite = !this.isFavourite;

  }
  showDialog(id : number){
    let post = this.posts.find(p => p.id == id);
    let grName = 'DG5';
    // post.groupname = post?.Group.name
    // console.log(post?.content)


    const dialogRef = this.dialog.open(PostDialog, {
      data: post
    });
  }
}

@Component({
  selector: 'post-dialog',
  templateUrl: '../post-dialog/post-dialog.html',
  styleUrls: ['../post-dialog/post-dialog.css'],
})
export class PostDialog implements OnInit{
  constructor(
    public dialogRef: MatDialogRef<PostDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Post,
    // @Inject(MAT_DIALOG_DATA) public grName: string,
    private apiService : ApiService,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) {
    this.content = sanitizer.sanitize(SecurityContext.HTML, data.content);
  }

  isAdmin = false;
  post = this.data;
  // name = this.grName
  content : string | null;

  ngOnInit(): void {
    sessionStorage.setItem('prev',window.location.href);
    if(sessionStorage.getItem('userID')) this.isAdmin = true;
  }

}
