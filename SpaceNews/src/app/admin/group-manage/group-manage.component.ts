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

interface User{
  id : string|null,
  auth_token : string |null,
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
  members: Member[] = [];
  groups: Group[] = [];
  showSearch = false;
  searchResults: Group[] = [];
  keyWord : string|undefined = '';

  user : User = {
    id : '',
    auth_token : ''
  }


  constructor(private groupService: HandleGroupService, private fb: FormBuilder, public dialog: MatDialog) { }
  ngOnInit(): void {
    this.searchForm = this.fb.group({
      keyWord:""
    })
    this.getListGroups();
    // this.getListMembers();
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

  // getListMembers(){
  //   this.groups.forEach(p => p.id{

  //   })
  // }

  getListGroups() {
    if(this.showSearch == true){
      this.groupService.searchGroup(this.keyWord, this.pageIndex).subscribe({
        next:data =>{
          this.groups = data;
        }
      });
    }
    else{
      this.groupService.loadListGroup(this.pageIndex).subscribe({
        next:data=>{
          this.groups = data;
          // this.handleGroup();
          console.log(this.groups);
        }
      })
    }

  }

  //handle detail-btn
  groupDetail(id:string){
    let group = this.groups.find(p => p.id ==id);
    const dialogRef = this.dialog.open(GroupDetailsDialog, {
      data : group
    });
    // console.log(group)
  }

  //handle edit-btn
  editGroup(id:string){
    let group = this.groups.find(p => p.id == id);
    // console.log(group?.id);
    const dialogRef = this.dialog.open(GroupEditDialog, {
      data : group
    });
  }

  //handle delete-btn
  deleteGroup(id:string){
    this.groupService.deleteGroup(Number(id)).subscribe(group =>{
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
      // console.log(this.groups.length);
      return false;
    }
    else{
      // console.log(this.groups.length);
    } return true;
  }

}
@Component({
  selector: 'group-details-dialog',
  templateUrl: '../group-details-dialog/group-details-dialog.html',
  styleUrls: ['../group-details-dialog/group-details-dialog.css']
})
export class GroupDetailsDialog implements OnInit {
  // @Input() topicChecked = 0;
  @Input() pageIndex = 0;
  // @Input() keyWord : string|undefined;
  @Output() changePage = new EventEmitter();
  // @Output() topicChange = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<GroupDetailsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Group,
    private groupService : HandleGroupService,
    private apiService:ApiService,
    private postService: HandlePostService
  ) {}
  group = this.data;



  isAdmin = true;

  posts : Post[] = [];//will show
  onWeek: Post[] = [];// <= 7days
  upcomming : Post[] = [];// <= 3days

  // keyWordOrigin : string |undefined;
  listPost : Post[] = [];
  listMember : GroupMembers[] = [];
  members: Member[] = [];



  ngOnInit(): void{
    // this.getListPost();
    // this.getPost();
    this.getMember();
    console.log(this.group);
    // this.upcommingPost.forEach((p)=>this.posts.unshift(p))
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if ('topicChecked' in changes){
  //     const topic = Number(changes['topicChecked'].currentValue);
  //       this.pageIndex = 0;
  //       this.changePage.emit(this.pageIndex);
  //       // const topic = Number(changes['topicChecked'].currentValue);
  //       // this.topicChecked = topic;
  //       this.apiService.stopSearch();
  //       this.ChangeTopic(topic);
  //     // if('pageIndex'in changes){
  //     //   this.getListPost(topic, this.pageIndex);
  //     // }else this.getListPost(topic, 0);
  //   }
  //   else if('pageIndex' in changes){
  //     if(this.keyWord){
  //       this.getListPost(this.topicChecked, this.pageIndex, this.keyWord)
  //     }
  //       else {
  //         this.getListPost(this.topicChecked, this.pageIndex, '');}
  //   }
  // }

  getPost(){
    let id = this.data.id;
    this.apiService.getListPosts(id.toString()).subscribe({
      next:data=>{
        this.listPost = data;
      }
    })
  }

  getMember(){
    let id = this.data.id;
    this.groupService.getMembersofGroups(Number(id)).subscribe({
      next:data=>{
        this.listMember = data;
        console.log(this.listMember);
      }
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


  // ChangeTopic(id:number){
  //   // this.changePage.emit(this.pageIndex);
  //   this.getListPost(id);
  // }

  // favourite
  isFavourite = false;
  starClick(id : number){
    this.isFavourite = !this.isFavourite;

  }
}


@Component({
  selector: 'group-edit-dialog',
  templateUrl: '../group-edit-dialog/group-edit-dialog.html',
  styleUrls: ['../group-edit-dialog/group-edit-dialog.css']
})
export class GroupEditDialog implements OnInit{
  editGroupForm = new FormGroup({
    groupName: new FormControl('', Validators.required),
    groupMail: new FormControl('', Validators.required),
  });

  constructor(
    public dialogRef: MatDialogRef<GroupEditDialog>,
    private fb: FormBuilder,
    private groupService: HandleGroupService,
    private router: Router,
    private apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: Group,

  ) {}


  group = this.data;
  ngOnInit(): void {
    // this.groupID = this.group.id;
    this.LoadGroup(Number(this.group.id));
    // this.updateGroup()
    console.log(this.group);
  }
  LoadGroup(id:number){
    this.apiService.getGroup().subscribe({
      next: data =>{
        console.log(data);
        // this.editGroupForm.setValue({
        //   groupName: data.groupName,
        //   groupMail: data.email})
      }
    })
  }

  onSubmit(){
    // let data = Object(this.editGroupForm.value);
    // this.editGroupForm.reset();
    // this.groupService.editGroup(data, this.group.id).subscribe({
    //   next:data=>{
    //     alert('Saved Change');
    //   },
    //   error:err=>{console.log(err)}
    // })
    // this.router.navigateByUrl('/group')
  }
}
