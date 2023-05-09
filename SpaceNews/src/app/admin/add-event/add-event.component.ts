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

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit, OnDestroy{
  form: FormGroup | undefined;
  event: Post[] = [];
  currentEvent: Post = {id:0, date: new Date(), time: new Date(), location: '', priority: 0,
                        title:'', image:'', content:'', showInSlider: false, topicID:1, group: {id :1, name : '', email :''} }

  //event types (Topic)
  ListTopic: Topic[] = [];
  //relevant groups
  ListGroups: Group[] = [];

  pageIndex = 0;
  constructor(private router : Router,
    private apiService: ApiService,
    private http: HttpClient,
    private fb: FormBuilder) {}

  date = new Date();
  dateObjectControl = new FormControl(new Date());

  private updateForm(){
    this.form?.setValue({
      title: this.currentEvent.title,
      type: this.currentEvent.topicID,
      date: new Date( this.currentEvent.date),
      time: new Date( this.currentEvent.date),
      location: this.currentEvent.location,
      image: this.currentEvent.image,
      priority: this.currentEvent.priority,
      group: this.currentEvent.group,
      content: this.currentEvent.content
    });
  }
  added = false;

  addEvent() {
    this.currentEvent = {id:0,
                        date: new Date(),
                        time: new Date(),
                        location: '',
                        priority: 0,
                        title:'',
                        image:'',
                        content:'',
                        showInSlider: false,
                        topicID:1,
                        group:{
                          id : 1,
                          name : '',
                          email : ''
                        }
                      }
    this.updateForm();
    this.added = true;
  }

  createEvent(){
    const newEvent = {
      title: this.form?.get('title')?.value,
      type: this.form?.get('type')?.value,
      date: this.form?.get('date')?.value,
      time: this.form?.get('time')?.value,
      location: this.form?.get('location')?.value,
      image: this.form?.get('image')?.value,
      priority: this.form?.get('priority')?.value,
      group: this.form?.get('group')?.value,
      content: this.form?.get('content')?.value,
    }
    this.apiService.addPost(newEvent)
  }

  // newEvent() {
  //   this.event = new Event('', '',new Date(),'',true,'','')
  // }

  editor = new Editor;
  toolbar: Toolbar = [
    ['bold', 'italic', 'underline','text_color'],
    ['link', 'image', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['bullet_list', 'ordered_list'],
  ];

  html= '';

  ngOnInit(): void {
    this.form = this.fb.group({
      title: [this.currentEvent.title, Validators.required],
      type: this.currentEvent.topicID,
      date: [this.currentEvent.date, Validators.required],
      time: this.currentEvent.time,
      location: this.currentEvent.location,
      image: this.currentEvent.image,
      priority: this.currentEvent.priority,
      group: this.currentEvent.group,
      content: this.currentEvent.content
    });
    this.editor = new Editor();
    this.LoadTopics();
    this.LoadGroups();
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
        this.ListTopic = data;
        console.log(this.ListTopic)
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

}
