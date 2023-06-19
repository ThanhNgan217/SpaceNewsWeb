import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../Service/api.service';
import { HandleGroupService } from 'src/app/Service/handle-group.service';
import { NavigationStart, Router } from '@angular/router';
import { Member } from 'src/app/Member';
import { MatDialog } from '@angular/material/dialog';
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
    memberName: new FormControl(''),
    memberMail: new FormControl('')
  });

  members: Member[] = []; // members add to group
  allMembers: Member[] = []; // all members (added to db)
  groups: GroupMembers[] = [];


  constructor(
    private apiService: ApiService,
    private router: Router,
    private fb: FormBuilder,
    private groupService: HandleGroupService,
    private memberService: HandleMemberService,
    public dialog: MatDialog)
    {
      this.router.events.forEach((event)=>{
        if(event instanceof NavigationStart){
          clearTimeout(this.sessionTimeout);
        }
      })
    }

  ngOnInit(): void {
    this.addGroupForm = this.fb.group({
      groupName: ['', Validators.required],
      memberName: ['', Validators.required],
      memberMail: ['', Validators.required]
    });

    this.loadMembers();
    this.loadGroups();
    this.expiredLoginSession();
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

  loadMembers(){
    this.memberService.getMembers().subscribe({
      next:data => {
        this.allMembers = data;
      }
    })
  }
  loadGroups(){
    this.groupService.loadAllGroups().subscribe({
      next:data=>{
        this.groups = data;
      }
    })
  }
  fillMember(){
    let memberName = this.addGroupForm.get('memberName')?.value;
    let memberMail = this.allMembers.find(p => p.name == memberName)?.email;
    console.log(memberMail)
    this.addGroupForm.patchValue({memberMail: memberMail})
  }
  addHandler(){
    let memberName = this.addGroupForm.get('memberName')?.value;
    // let memberMail = this.allMembers.find(p => p.name == memberName)?.email;
    // console.log(memberMail)
    // this.addGroupForm.patchValue({memberMail: memberMail})
    let memberMail = this.addGroupForm.get('memberMail')?.value;
    console.log(memberName);
    this.members.push({
      name : String(memberName),
      email: String(memberMail),
      id: 0
    });
    //add new members
    let listNewMembers = this.addMember();
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
    let listNewMembers: Member[] = []; // list of New members

    this.members.forEach(p=>{
      const found = this.allMembers.find(x => p.name == x.name && p.email == x.email)
      if (found == null){
        listNewMembers.push(p);
      }
    })

    return listNewMembers
  }
  getlistMemberId(){
    let listMemberId: Number[] = [] //list Id of members add to group
    this.memberService.getMembers();
    this.members.forEach(p=>{
      this.allMembers.forEach(x=>{
        if(p.name === x.name && p.email === x.email){
          listMemberId.push(x.id)
        }
      })
    })
    return listMemberId;
  }

  removeMember(id: number){
    let index = this.members.findIndex(m => m.id === id);
    this.members.splice(index, 1);
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
        this.loadGroups();
        this.router.navigate(['admin/groups']);
      },
      error:err=>{console.log(err)}
    });
  }
}
