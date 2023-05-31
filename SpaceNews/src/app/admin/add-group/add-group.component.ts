import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';import {ErrorStateMatcher} from '@angular/material/core';
import { HttpClient } from '@angular/common/http';
import { Group } from 'src/app/Group';
import { ApiService } from '../../Service/api.service';
import { HandleGroupService } from 'src/app/Service/handle-group.service';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.css']
})
export class AddGroupComponent implements OnInit{
  addGroupForm = new FormGroup({
    groupName: new FormControl(''),
    groupMail: new FormControl(''),
  });

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private groupService: HandleGroupService) {}

  ngOnInit(): void {
    this.addGroupForm = this.fb.group({
      groupName: ['', Validators.required],
      groupMail: ['', Validators.required]
    })
  }

  onSubmit(){
    let data = Object(this.addGroupForm.value);
    this.addGroupForm.reset();

    this.groupService.addGroup(data).subscribe({
      next:data=>{
        alert('Success');
      },
      error:err=>{console.log(err)}
    })
  }


}
