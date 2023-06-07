import { Component, OnInit, ElementRef, ViewChild, Inject, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';import {ErrorStateMatcher} from '@angular/material/core';
import { Group } from 'src/app/Group';
import { ApiService } from '../../Service/api.service';
import { HandleGroupService } from 'src/app/Service/handle-group.service';
import { Route, Router } from '@angular/router';
import {Observable} from 'rxjs';
import { Member } from 'src/app/Member';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HandleMemberService } from 'src/app/Service/handle-member.service';
import { GroupMembers } from 'src/app/GroupMembers';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.css']
})
export class AddGroupComponent implements OnInit{
  addGroupForm = new FormGroup({
    groupName: new FormControl(''),
    // groupMember: new FormGroup({
    //   memberName: new FormControl(''),
    //   memberMail: new FormControl('')
    // }),
  });

  addgroupMember= new FormGroup({
    memberName: new FormControl(''),
    memberMail: new FormControl('')
  })

  members: Member[] = []; // members add to group
  allMembers: Member[] = []; // all members (added to db)
  groups: GroupMembers[] = [];

  searchOption: Member[] = [];
  // @ViewChild('memberInput') memberInput: ElementRef<HTMLInputElement>;
  memberName: string ='';
  memberMail: string ='';
  // @Output() onSelectedOption = new EventEmitter();



  constructor(
    private apiService: ApiService,
    private router: Router,
    private fb: FormBuilder,
    private groupService: HandleGroupService,
    private memberService: HandleMemberService,
    public dialog: MatDialog)
    {}

  ngOnInit(): void {
    this.addGroupForm = this.fb.group({
      groupName: ['', Validators.required],
      // groupMember: this.fb.group({
      //   memberName: ['', Validators.required],
      //   memberMail: ['', Validators.required]
      // })
    });
    this.addgroupMember = this.fb.group({
      memberName: ['', Validators.required],
      memberMail: ['', Validators.required]
    })
    this.loadMembers();

  }
  loadMembers(){
    this.apiService.getMembers().subscribe({
      next:data => {
        this.allMembers = data;
        console.log(data);
      }
    })
  }
  loadGroups(){
    this.groupService.loadAllGroups().subscribe({
      next:data=>{
        this.groups = data;
        // console.log(this.groups);
      }
    })
  }




  addHandler(){
    let member = Object(this.addgroupMember.value);
    console.log(member);
    //list members of group
    this.members.push({
      name : member.memberName,
      email: member.memberMail,
      id: +1
    });
    //add new members
    let listNewMembers = this.addMember();
    console.log(listNewMembers);
    listNewMembers.forEach(p=>{
      this.memberService.addMember(p).subscribe({
        next:data=>{
          this.loadMembers();
        }
      })
    })
  }
  //add to new members to database
  addMember(){
    let m: Member;
    let mem: Member;
    let listNewMembers: Member[] = []; // list of New members

    this.members.forEach(p=>{
      const found = this.allMembers.find(x => p.name == x.name && p.email == x.email)
      if (found == null){
        listNewMembers.push(p);
      }
      else{
        console.log(found);
      }
    })

    return listNewMembers
  }
  getlistMemberId(){
    let listMemberId: Number[] = [] //list Id of members add to group
    this.members.forEach(p=>{
      this.allMembers.forEach(x=>{
        if(p.name === x.name && p.email === x.email){
          console.log(x.id);
          listMemberId.push(x.id)
        }
      })
      // listMemberId.push(indx);
    })
    console.log(listMemberId);
    return listMemberId;
  }


  onSubmit(){
    let groupName = Object(this.addGroupForm.value);
    this.addGroupForm.reset();
    let listMemberId = this.getlistMemberId();
    this.getlistMemberId();


    //add new group
    this.groupService.addGroup(groupName, listMemberId.toString()).subscribe({
      next:data=>{
        alert('Success');
        console.log(data);
        this.loadGroups();
      },
      error:err=>{console.log(err)}
    });

  }




}

// @Component({
//   selector: 'warning-dialog',
//   templateUrl: '../warning-dialog/warning-dialog.html',
//   styleUrls: ['../warning-dialog/warning-dialog.css']
// })
// export class WarningDialog {
//   constructor(
//     public dialogRef: MatDialogRef<WarningDialog>,
//     @Inject(MAT_DIALOG_DATA) public data: Member,
//     private groupService : HandleGroupService,
//   ) {}


//   addMember(){
//     this.groupService.addMembers(this.data).subscribe({
//       next:data => {
//         alert('Member is added');
//       },
//       error: err => {console.log(err)}
//     })
//     this.onNoClick();
//   }
//   onNoClick(): void {
//     this.dialogRef.close();
//   }
// }
