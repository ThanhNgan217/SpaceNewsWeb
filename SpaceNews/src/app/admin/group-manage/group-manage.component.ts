import { Component, EventEmitter, Inject, Input, OnInit, Output, SimpleChanges } from '@angular/core';;
import { ApiService } from '../../Service/api.service';
import { Group } from '../../Group';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HandleGroupService } from '../../Service/handle-group.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Post } from 'src/app/PostEvent';
import { Member } from 'src/app/Member';
import { HandlePostService } from 'src/app/Service/handle-post.service';
import { GroupMembers } from 'src/app/GroupMembers';
import { HandleMemberService } from 'src/app/Service/handle-member.service';

interface User{
  id : string|null,
  auth_token : string |null,
}
interface Groups {
  id: number,
  name: string,
  upComing: number,
  totalPost: number,
  lastEvent: Date
}
@Component({
  selector: 'app-group-manage',
  templateUrl: './group-manage.component.html',
  styleUrls: ['./group-manage.component.css']
})
export class GroupManageComponent implements OnInit {
  pageIndex = 0;
  menuShow = false;

  searchForm = new FormGroup({
    keyWord : new FormControl<string>("")
  });
  groups: GroupMembers[] = [];
  listGroup: Groups[] = [];
  listPost: Post[] = [];

  showSearch = false;
  searchResults: Group[] = [];
  keyWord : string|undefined = '';

  constructor(private groupService: HandleGroupService, private fb: FormBuilder, private apiService: ApiService, public dialog: MatDialog) { }
  ngOnInit(): void {
    this.searchForm = this.fb.group({
      keyWord:""
    })
    this.getListGroups();
    // this.getPost();
    // console.log(this.groups);

  }


  //search groups
  ClickBtn(){
    this.pageIndex = 0;
    if(this.showSearch == false){ // search icon
      let key = this.searchForm.get('keyWord')?.value?.trim();
      key = key?.replace(/ /g,'%20');
      this.keyWord = key;
      this.showSearch = true;
      this.groupService.searchGroup(key, this.pageIndex).subscribe({
        next:data =>{
          this.groups = data;
          console.log(data);
        }
      });
    }
    else{ // close icon
      this.searchForm.reset({keyWord: ''});
      this.showSearch = false;
      this.getListGroups();
    }
  }

  getListGroups() {
    if(this.showSearch == true){
      this.groupService.searchGroup(this.keyWord, this.pageIndex).subscribe({
        next:data =>{
          this.groups = data;
          this.getPost();
          // console.log(this.getPost());
        }
      });
    }
    else{
      this.groupService.loadListGroup(this.pageIndex).subscribe({
        next:data=>{
          this.groups = data;
          console.log(this.groups);
          this.getPost();

        }
      })
    }
  }

  handlePosts(){
    let currDate = new Date();
    let t = currDate.getTime();
    let upcomming : Post[] = [];
    // onWeek list
    // 259200000 ms = 72h = 3days
    // 345600000 ms = 96h = 4days
    // 345599999 ms = 96h - 1s = 4days - 1s
    // 604800000 ms = 168h = 7days
    // 691199000 ma = ... = 8days -1s
    this.listPost.forEach((p)=>{
      let x = new Date(p.time);
      if(x.getTime() - t <= 604800000 && x.getTime() - t >= -36399000){
        if(x.getTime() - t <= 259200000) upcomming.push(p)

      }
    })
   return upcomming.length
  }

  getPost(){
    this.listGroup.length = 0;
    let lastevent;
    // console.log(this.groups);
    this.groups.forEach(p=>{
      this.apiService.getListPosts(String(p.id)).subscribe({
        next:data => {
          this.listPost = data;
          lastevent = data.slice(-1)[0];
          let upcomming = this.handlePosts();
          this.listGroup.push({
            id: p.id,
            name: p.name,
            upComing: upcomming,
            totalPost: this.listPost.length,
            lastEvent: lastevent.date,
          });
        }
      });


      console.log(this.listGroup);
    })

  }

  //handle detail-btn
  groupDetail(id:number){
    let group = this.groups.find(p => p.id ==id);
    const dialogRef = this.dialog.open(GroupDetailsDialog, {
      data : group
    });
    // console.log(group)
  }


  //handle delete-btn
  deleteGroup(id:number){
    this.groupService.deleteGroup(id).subscribe(group =>{
      this.getListGroups();
    });
    // console.log(id)
  }
  // handle page number
  changePage(value:number){
    this.pageIndex = value;
    this.getListGroups();
  }
  pagePrev(){
    if(this.pageIndex > 0)this.pageIndex -= 1;
    else return;
    this.getListGroups();
  }
  pageNext(){
    if(this.pageIndex < 9)this.pageIndex += 1;
    else return;
    this.getListGroups();
  }

  haveResults(){
    if(this.groups.length == 0){
      return false;
    }
    else{
    } return true;
  }

}
@Component({
  selector: 'group-details-dialog',
  templateUrl: '../group-details-dialog/group-details-dialog.html',
  styleUrls: ['../group-details-dialog/group-details-dialog.css']
})
export class GroupDetailsDialog implements OnInit {
  @Input() pageIndex = 0;
  @Output() changePage = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<GroupDetailsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Group,
    private groupService : HandleGroupService,
    private apiService:ApiService,
    private postService: HandlePostService,
    private memberService: HandleMemberService
  ) {}
  group = this.data;

  posts : Post[] = [];//will show
  onWeek: Post[] = [];// <= 7days
  upcomming : Post[] = [];// <= 3days

  listPost : Post[] = [];
  listMember : GroupMembers[] = [];
  members: Member[] = [];

  ngOnInit(): void{
    this.getMember();
    console.log(this.group);
    this.getPost();
    // this.upcommingPost.forEach((p)=>this.posts.unshift(p))
  }




  getPost(){
    let id = this.data.id;
    this.apiService.getListPosts(id).subscribe({
      next:data=>{
        this.listPost = data;
        this.handlePosts();
        console.log(data);
      }
    })
  }

  getMember(){
    let id = this.data.id; //groupId
    let listIDs: string[] = [];
    this.groupService.getMembersofGroups(Number(id)).subscribe({
      next:data=>{
        this.listMember = data;
        for (const key in data) {
          if(key == 'memberID'){
            let IDs = data[key];
            listIDs = String(IDs).split(',');
          }
        }
        listIDs.forEach(p => {
          this.memberService.getMember(Number(p)).subscribe({
            next:data =>{
              this.members.push(data)
            }
          })
        })
      }})

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

  // favourite
  isFavourite = false;
  starClick(id : number){
    this.isFavourite = !this.isFavourite;

  }
}
