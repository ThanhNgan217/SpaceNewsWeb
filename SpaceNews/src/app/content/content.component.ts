import { Component, Inject, Input, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
// import { Post, listPost } from '../post';
import { Post } from '../PostEvent';
import { ApiService, Bookmark } from '../Service/api.service';
import { PostDialog } from '../list-post/list-post.component'
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Topic } from '../Topic';
import { HttpClient } from '@angular/common/http';
import { Group } from '../Group';

interface User{
  id : string|null,
  auth_token : string |null,
}
export interface History{
  userID : string | null,
  eventsID : string | null
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
  eventsQuantity = 0;

  dialogClosed = false;

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

  //history
  listID : string = '';

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
    this.router.events.forEach((event)=>{
      if(event instanceof NavigationStart){
        clearTimeout(this.sessionTimeout);
      }
    })
  }
  ngOnInit(){
    this.getNumPages();
    // this.eventsQuantity = 9; // 10 pages
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

    let userRole = sessionStorage.getItem('userRole');
    if(userRole == '1'){
      this.expiredLoginSession();
    }
  }

  // expired login session
  expiredLoginSession(){
    let currTime = new Date();
    let expired = sessionStorage.getItem('expiredTime');
    let expiredTime = Number(expired) - currTime.getTime();
    this.sessionTimeout = setTimeout(()=>{
      alert('Login session expired, Please login again');
      sessionStorage.clear();
      this.router.navigate(['/login']);
    }, expiredTime);
  }

  sessionTimeout = setTimeout(()=>{});

  myInterval= () => {
    let length = this.postsSlider.length;
    if(length > 0){
      if(this.index == this.counter-1) this.index = 0;
      else this.index++;
      this.idShow = this.postsSlider[this.index].id;
      this.urlShow = this.postsSlider[this.index].image;
      this.title = this.postsSlider[this.index].title;

    }
  }
  autoChangeSlider = setInterval(this.myInterval, 3500);

  getNumPages(){
    this.apiService.getEventQuantity().subscribe(data => {
      if(data % 9 != 0) this.eventsQuantity = Math.floor(data/9);
      else this.eventsQuantity = Math.floor(data/9)-1;
    });
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
        this.autoChangeSlider;
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
    if(sessionStorage.getItem('userID')) {
      this.handleHistory(id.toString());
    }
    this.dialog.open(PostDialog, {
      data : post,
      maxWidth : '50%'
    });
  }


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
    if(this.pageIndex < this.eventsQuantity)this.pageIndex += 1;
    else return;
    // console.log(this.pageIndex)
  }

  openHistory(){
    const dialogRef = this.dialog.open(BookmarkDialog, {
      data: false,
      width: '85vw',
      height: '80vh',
    });
    dialogRef.afterOpened().subscribe( ()=>{
      this.dialogClosed = false;
    })
    dialogRef.afterClosed().subscribe(data =>{
      this.dialogClosed = true;
    })
  }

  openBookmark(){
    const dialogRef =  this.dialog.open(BookmarkDialog, {
      data: true,
      width: '85vw',
      height: '80vh',
    });
    dialogRef.afterOpened().subscribe( ()=>{
      this.dialogClosed = false;
    })
    dialogRef.afterClosed().subscribe((data)=>{
      this.dialogClosed = true;
    })
  }

  handleHistory(postID : string){
    let userID = sessionStorage.getItem('userID');
    let eventsID : string ='';
    this.apiService.getHistory(userID).subscribe({
      next:data =>{
        eventsID = data.eventsID? data.eventsID : '';
        let arr = eventsID.split(',');
        let index = arr.indexOf(postID);
        if(index > -1) arr.splice(index, 1);
        if(arr.length >= 12) arr.shift();
        arr.push(postID);
        let body : History = {
          userID : userID,
          eventsID : arr.join(','),
        }
        // console.log(body);
        this.apiService.addHistory(body).subscribe();
      }
    })
  }

}


@Component({
  selector: 'bookmark-dialog',
  templateUrl: '../bookmark-dialog/bookmark-dialog.html',
  styleUrls: ['../bookmark-dialog/bookmark-dialog.css'],
})
export class BookmarkDialog implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<PostDialog>,
    @Inject(MAT_DIALOG_DATA) public openBookmark: boolean,
    private apiService: ApiService,
    // @Inject(MAT_DIALOG_DATA) public grName: string,
    // private handlePostService: HandlePostService,
    public dialog: MatDialog,
    // private sanitizer: DomSanitizer,
    private router: Router
  ) {
    // this.dialogRef.afterClosed().subscribe(() => {console.log('closed')})
  }

  listGroup : Group[] = [];
  listEvent : Post[] = [];
  eventsID : any; // History
  bookmarkID : any; // Bookmark
  userID : string | null = '';
  listBookmark: any = [];
  ngOnInit(): void {
    this.userID = sessionStorage.getItem('userID');

    this.getListGroup();
    if(this.openBookmark){ // true : bookmark ; false : read history
      this.handleBookmark();
    }
    else{
      this.getBookmark(this.userID);
      this.handleHistory();
    }
  }



  // star icon
  addEventListener(id:number){
    let star = document.getElementById(`readHistory-bookmark-${id}`);
    let starFill = document.getElementById(`readHistory-bookmark-checked-${id}`);
    let eventsID :string[]|undefined = [];
    //add bookmark
    star?.addEventListener("click", ()=>{
      this.apiService.getBookmarks(this.userID).subscribe({
        next : data =>{
          if(data.eventsID != '') eventsID = data.eventsID?.split(',');
          else eventsID = [];
          eventsID?.push(id.toString());
          starFill?.classList.toggle('icon-hide');
          star?.classList.toggle('icon-hide');
          let body : Bookmark ={
            userID : this.userID,
            eventsID : eventsID?.join(',')
          }
          // console.log(id, body.eventsID)
          this.apiService.addBookmark(body).subscribe();
        }
      })
    })
    // remove bookmark
    starFill?.addEventListener("click", ()=>{
      this.apiService.getBookmarks(this.userID).subscribe({
        next:data =>{
          starFill?.classList.toggle('icon-hide');
          star?.classList.toggle('icon-hide');
          eventsID = data.eventsID?.split(',');
          eventsID = eventsID?.filter(i => i != id.toString());
          let body : Bookmark ={
            userID : this.userID,
            eventsID : eventsID?.join(',')
          }
          // console.log(id, body.eventsID)

          this.apiService.addBookmark(body).subscribe();
        }
      });
    })

  }

  // handle star icon
  getBookmark(id:string|null){
    this.apiService.getBookmarks(id).subscribe({
      next:data =>{
        this.listBookmark = data.eventsID?.split(',');
      }
    });
  }
  hideIcon(id:number) {
    let index = this.listBookmark.findIndex((b:any) => b == id)
    if(index > -1) return true;
    else return false;
  }

  getListGroup(){
    this.apiService.getGroup().subscribe({
      next: data =>{
        this.listGroup = data;
      }
    })
  }

  showEvent(id : number){
    this.router.events.subscribe(() => {
      this.dialogRef.close();
    });
    this.apiService.getPost(id).subscribe({
      next:data =>{
        let grsID = data.groupID.split(',');
        let arr: string[] = [];
        grsID.map( id =>{
          let group = this.listGroup.find(g=>g.id == id);
          if(group){
            arr.push(group.name);
          }
        })
        data.groupNames = arr;
        this.dialog.open(PostDialog, {
          data: data,
          maxWidth : '50%'
        })
      }
    })
  }

  handleBookmark(){
    this.apiService.getBookmarks(this.userID).subscribe({
      next:data =>{
        if(data.eventsID != ''){
          let flag = false;
          this.bookmarkID = data.eventsID;
          let list : any[] = this.bookmarkID?.split(',').reverse();
          let promise = new Promise((resolve, reject) =>{
            list.forEach( (item: any) =>{
              this.apiService.getPost(Number(item)).subscribe({
                next:data =>{
                  let index = list.findIndex( i => i == item);
                  list[index] = data;
                  this.listEvent = list;
                  flag = list.every(p => typeof p == 'object')
                  if(flag) resolve(list)
                },
                error: err=>{
                  // in case event id not exist
                  let a = list.findIndex(i => i==item);
                  if (a > -1) {
                    list.splice(a, 1);
                  }
                  let arr : string = list.join(',');
                  let body : Bookmark= {
                    userID : this.userID,
                    eventsID : arr
                  }
                  this.apiService.addBookmark(body).subscribe()
                }
              })

            })
          })
          promise
          .then((list)=>{
            let newlist : any = list;
            newlist.forEach((e:Post) =>{
              this.addEListener(e.id)
            })
          })

        }
        else this.listEvent = [];

      },
      error: err =>{
        this.listEvent = [];
      }
    })
  }
  handleDelete(eventID: number){
    if(this.openBookmark){ // remove bookmark
      let newBookmark = this.bookmarkID.split(',');
      let index = newBookmark.findIndex((i:string) => i == eventID.toString());
      if(index > -1){
        newBookmark.splice(index, 1)
      }
      let body : Bookmark ={
        userID : this.userID,
        eventsID : newBookmark.join(','),
      }
      // console.log('delete')
      this.apiService.addBookmark(body).subscribe();
      this.handleBookmark();
    }
    else{ // delete history
      let newHistory = this.eventsID.split(',');
      let index = newHistory.findIndex((i:string) => i == eventID.toString());
      if(index > -1){
        newHistory.splice(index, 1)
      }
      let body : History ={
        userID : this.userID,
        eventsID : newHistory.join(','),
      }
      this.apiService.addHistory(body).subscribe();
      this.handleHistory();
    }
  }

  addEListener(id:number){
    setTimeout(()=>{ // delay 0.1s for element render
      let element = document.getElementById(`event-${id}`);
      let icon = document.getElementById(`delete-${id}`);
        element?.addEventListener('mouseover', (e)=>{
          icon?.classList.add('isHover')
        })
        element?.addEventListener('mouseout', (e)=>{
          icon?.classList.remove('isHover')
        })
    }, 100)
  }

  handleDeleteAll(){
    if(this.openBookmark){
      let body : Bookmark ={
        userID : this.userID,
        eventsID : ''
      }
      this.apiService.addBookmark(body).subscribe();
      this.handleBookmark();
    }
    else{
      let body : History ={
        userID : this.userID,
        eventsID : ''
      }
      this.apiService.addHistory(body).subscribe();
      this.handleHistory();
    }
  }

  handleHistory(){
    this.apiService.getHistory(this.userID).subscribe({
      next:data =>{
        if(data.eventsID != ''){
          let flag = false;
          this.eventsID = data.eventsID;
          let list : any[] = this.eventsID?.split(',').reverse();
          let promise = new Promise((resolve, reject) =>{
            list.forEach( (item: any) =>{
              this.apiService.getPost(Number(item)).subscribe({
                next:data =>{
                  let index = list.findIndex( i => i == item);
                  list[index] = data;
                  this.listEvent = list;
                  flag = list.every(p => typeof p == 'object')
                  if(flag) resolve(list)
                },
                error: err=>{
                  // in case event id not exist
                  let a = list.findIndex(i => i==item);
                  if (a > -1) {
                    list.splice(a, 1);
                  }
                  let arr : string = list.join(',');
                  let body : History= {
                    userID : this.userID,
                    eventsID : arr
                  }
                  this.apiService.addHistory(body).subscribe()
                }
              })

            })
          })
          promise
          .then((list)=>{
            let newlist : any = list;
            newlist.forEach((e:Post) =>{
              this.addEListener(e.id)
              setTimeout(()=>{
                this.addEventListener(e.id);
              }, 100)
            })
          })

        }
        else this.listEvent = [];

      },
      error: err =>{
        this.listEvent = [];
      }
    })
  }

  closeDialog(){
    this.dialogRef.close('close');
  }
}
