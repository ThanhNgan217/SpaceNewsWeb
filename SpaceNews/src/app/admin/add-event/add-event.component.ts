import { Component, OnDestroy, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Editor, Toolbar } from 'ngx-editor';
import { ApiService } from 'src/app/Service/api.service';
import { Topic } from 'src/app/Topic';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Post } from 'src/app/PostEvent';
import { Group } from 'src/app/Group';
import { Time } from '@angular/common';
import Image from 'ngx-editor/lib/commands/Image';
import { toDoc } from 'ngx-editor';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit, OnDestroy{

  checked = false;
  listTopic : Topic[] = [];
  ListGroups : Group[] = [];
  selectedTopic = 1;
  selectedGroup = 1;

  addEventForm = new FormGroup({
    eventTitle: new FormControl(''),
    eventType: new FormControl(1),
    eventDate: new FormControl(''),
    eventTime: new FormControl(''),
    eventLocation: new FormControl(''),
    eventImg: new FormControl(''),
    eventPiority: new FormControl(0),
    eventGroup: new FormControl(1),
    eventContent: new FormControl('')
  });


  constructor(private fb: FormBuilder, private apiService: ApiService, private router : Router) {}


  editor = new Editor;
  toolbar: Toolbar = [
    ['bold', 'italic', 'underline','text_color'],
    ['link', 'image', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['bullet_list', 'ordered_list'],
  ];

  html= '';

  ngOnInit(){
    this.addEventForm = this.fb.group({
      eventTitle: ['', Validators.required],
      eventType: [1],
      eventDate: ['', Validators.required],
      eventTime: ['', Validators.required],
      eventLocation: ['', Validators.required],
      eventImg: ['', Validators.required],
      eventPiority: [0],
      eventGroup: [1],
      eventContent: ['', Validators.required]
    })

    // this.addEventForm = this.fb.group({
    //   eventTitle:['', Validators.compose([Validators.required])],
    //   eventType : [''],
    //   eventDate : ['', Validators.compose([Validators.required])],
    //   eventTime : ['', Validators.compose([Validators.required])],
    //   eventLocation : ['', Validators.compose([Validators.required])],
    //   eventImg : ['', Validators.compose([Validators.required])],
    //   eventPiority : [0],
    //   eventGroup : [''],
    //   eventContent : ['', Validators.compose([Validators.required])]
    // });
    // this.form = this.fb.group({
    //   title: [this.currentEvent.title, Validators.required],
    //   type: this.currentEvent.topicID,
    //   date: [this.currentEvent.date, Validators.required],
    //   time: this.currentEvent.time,
    //   location: this.currentEvent.location,
    //   image: this.currentEvent.image,
    //   priority: this.currentEvent.priority,
    //   group: this.currentEvent.group,
    //   content: this.currentEvent.content
    // });
    this.editor = new Editor();
    this.LoadTopics();
    this.LoadGroups();
    this.selectedTopic = 1;
    this.selectedGroup = 1;
    // this.ListGroup();
  }

  //destory the editor
  ngOnDestroy(): void {
    this.editor.destroy();

  }

  //list topic handle
  LoadTopics(){
    this.apiService.getTopic().subscribe({
      next:data =>{
        this.listTopic = data;
        console.log(this.listTopic)
      }
    })
  }
  //list group handle
  LoadGroups(){
    this.apiService.getGroup().subscribe({
      next:data => {
        this.ListGroups = data;
        console.log(this.ListGroups)
      }
    })
  }

  onSubmit(){
    if(this.checked) this.addEventForm.patchValue({eventPiority:1})
    else this.addEventForm.patchValue({eventPiority:0})
    // this.addEventForm.patchValue({eventContent:this.html})
    console.log(this.addEventForm.getRawValue())
    console.log(this.addEventForm.get('eventContent')?.value)
  }
}
