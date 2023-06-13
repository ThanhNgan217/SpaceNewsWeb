import { Component, SecurityContext, EventEmitter, Inject, Input, OnInit, Output, SimpleChanges } from '@angular/core';
// import { Post, listPost } from '../post';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Post } from '../PostEvent';
import { ApiService, Bookmark } from '../Service/api.service';
import { DomSanitizer} from '@angular/platform-browser';
import { Router } from '@angular/router';
import { HandlePostService } from '../Service/handle-post.service';
import { Group } from '../Group';
import { History } from '../content/content.component';

@Component({
  selector: 'app-list-post',
  templateUrl: './list-post.component.html',
  styleUrls: ['./list-post.component.css']
})
export class ListPostComponent implements OnInit{
  @Input() topicChecked = 0;
  @Input() pageIndex = 0;
  @Input() keyWord : string|undefined;
  @Input() dialogClosed = false;
  @Output() changePage = new EventEmitter();
  @Output() topicChange = new EventEmitter();

  listBookmark: any = [];
  isAdmin = false;
  userID : string |null='';
  listGroup: Group[] = [];
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
    this.userID = sessionStorage.getItem('userID');
    this.getBookmark(this.userID);
    if(this.userID != '') this.isAdmin = true;
    this.getListGroup();
    // this.getListPost(this.topicChecked, this.pageIndex, this.keyWord);
    // this.posts = this.listPost;
    // this.upcommingPost.forEach((p)=>this.posts.unshift(p))
  }

  ngOnChanges(changes: SimpleChanges): void {
    if('dialogClosed' in changes && this.dialogClosed == true){
      console.log('dialogClosed')
      this.getListPost(this.topicChecked, this.pageIndex, this.keyWord);
    }
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
  }

  // star icon
  addEventListener(id:number){
    let user = sessionStorage.getItem('userID');
    if(user){ // logged
      let star = document.getElementById(`bookmark-${id}`);
      let starFill = document.getElementById(`bookmark-checked-${id}`);
      let eventsID :string[]|undefined = [];
      //add bookmark
      star?.addEventListener("click", ()=>{
        this.apiService.getBookmarks(user).subscribe({
          next : data =>{
            if(data.eventsID != '') eventsID = data.eventsID?.split(',');
            else eventsID = [];
            eventsID?.push(id.toString());
            starFill?.classList.toggle('icon-hide');
            star?.classList.toggle('icon-hide');
            let body : Bookmark ={
              userID : user,
              eventsID : eventsID?.join(',')
            }

            this.apiService.addBookmark(body).subscribe();
          }
        })
      })
      // remove bookmark
      starFill?.addEventListener("click", ()=>{
        this.apiService.getBookmarks(user).subscribe({
          next:data =>{
            starFill?.classList.toggle('icon-hide');
            star?.classList.toggle('icon-hide');
            eventsID = data.eventsID?.split(',');
            eventsID = eventsID?.filter(i => i != id.toString());
            let body : Bookmark ={
              userID : user,
              eventsID : eventsID?.join(',')
            }

            this.apiService.addBookmark(body).subscribe();
          }
        });
      })

    }
  }

  //is event in bookmarks
  hideIcon(id:number) {
    let index = this.listBookmark.findIndex((b:any) => b == id)
    if(index > -1) return true;
    else return false;
  }

  getBookmark(id:string|null){
    this.apiService.getBookmarks(id).subscribe({
      next:data =>{
        this.listBookmark = data.eventsID?.split(',');
      }
    });
  }

  getListGroup(){
    this.apiService.getGroup().subscribe({
      next: data =>{
        this.listGroup = data;
      }
    })
  }

  getListPost(topicId = 0, pagenum = 0, key :string|undefined = ''){
    if(key){
      // need sort, enable, not passed event
      this.apiService.getSearchResults(pagenum, key).subscribe({
        next:data =>{
          // this.listPost = data;
          this.posts = data;
          this.getGrNames();
          this.handlePosts();
          this.getBookmark(this.userID);
        }
      })
    }
    else{
      this.apiService.getPosts(topicId, pagenum).subscribe({
        next:data =>{
          // this.listPost = data;
          this.posts = data;
          this.getGrNames();
          this.handlePosts();
          this.getBookmark(this.userID);
        }
      })
    }
  }

  getGrNames(){
    this.posts.forEach(p=>{
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
      let week = t + 604800000; // current time + 7days
      let days_3 = t + 259200000; // current time + 3days
      if(x.getTime() <= week){
        if(x.getTime() <= days_3) this.upcomming.push(p);
        else this.onWeek.push(p);
      }
      if(sessionStorage.getItem('userID')){
        setTimeout(()=>{
          this.addEventListener(p.id);
        }, 100)
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

  showDialog(id : number){
    console.log(id)
    let post = this.posts.find(p => p.id == id);
    if(sessionStorage.getItem('userID')) {
      this.handleHistory(id.toString());
    }
    this.dialog.open(PostDialog, {
      data: post,
      maxWidth : '50%'
    });
  }

  handleHistory(postID : string){
    let userID = sessionStorage.getItem('userID');
    let eventsID : string ='';
    this.apiService.getHistory(userID).subscribe({
      next:data =>{
        eventsID = data.eventsID? data.eventsID : '';
        let arr : string[];
        if(eventsID != '') arr= eventsID.split(',');
        else arr = [];
        let index = arr.indexOf(postID);
        if(index > -1) arr.splice(index, 1);
        if(arr.length >= 12) arr.shift();
        arr.push(postID);
        let body : History = {
          userID : userID,
          eventsID : arr.join(','),
        }
        console.log(body);
        this.apiService.addHistory(body).subscribe();
      }
    })
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
    private handlePostService: HandlePostService,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  isAdmin = false;
  isPastEvents = false;
  post = this.data;
  // name = this.grName
  content : any;

  ngOnInit(): void {
    if(sessionStorage.getItem('pastEvents')=='1') this.isPastEvents = true;
    if(sessionStorage.getItem('userRole')=='1'){
      this.isAdmin = true;
      sessionStorage.removeItem('prev');
      sessionStorage.setItem('prev',window.location.href);
    }
    this.content = this.transformYourHtml(this.post.content);
  }
  transformYourHtml(text: string) {
    return this.sanitizer.bypassSecurityTrustHtml(text);
  }

  editEvent(id: number){
    if(sessionStorage.getItem('pastEvents') == '1'){
      sessionStorage.removeItem('pastEvents');
    }
    this.router.navigate([`/admin/posts/edit/${id}`])
  }

  deleteEvent(id: number){
    this.handlePostService.deletePost(id).subscribe({
      next:data =>{
        this.dialogRef.close();
        alert('Event deleted successfully')
      }
    })
  }

}
