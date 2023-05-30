import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Editor, Toolbar } from 'ngx-editor';
import { ApiService } from 'src/app/Service/api.service';
import { Topic } from 'src/app/Topic';
import { ActivatedRoute, Router } from '@angular/router';
import { Group } from 'src/app/Group';
import { HandlePostService } from 'src/app/Service/handle-post.service';
import {Location} from '@angular/common';
import { MatOption } from '@angular/material/core';

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}
@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css']
})
export class EditEventComponent implements OnInit {
  currPost={
    id: 0,
    date: new Date,
    time: new Date,
    location: '',
    priority: 0,
    title: '',
    image: '',
    content: '',
    showInSlider: false,
    topicID: 0,
    groupID: ''
  };
  fileSrc : any;
  postID : number = 0;
  date : string = '';
  time : string = '';

  fileName = '';
  selectedFile: ImageSnippet | undefined;

  checked = false;
  listTopic : Topic[] = [];
  ListGroups : Group[] = [];
  selectedTopic = 1;
  selectedGroup = ['']
  groupsID = [''];

  addEventForm = new FormGroup({
    eventTitle: new FormControl(''),
    eventType: new FormControl(),
    eventDate: new FormControl(new Date),
    eventTime: new FormControl(new Date),
    eventLocation: new FormControl(''),
    eventImg: new FormControl(''),
    eventPiority: new FormControl(0),
    eventGroup: new FormControl(['']),
    eventContent: new FormControl('')
  });


  constructor(private location: Location, private fb: FormBuilder, private _route: ActivatedRoute, private apiService: ApiService, private postService:HandlePostService, private router : Router) {

  }
  @ViewChild('selectAllGroup')
  private selectAllGroup !: MatOption;


  editor = new Editor;
  toolbar: Toolbar = [
    ['bold', 'italic', 'underline','text_color'],
    ['link', 'image', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['bullet_list', 'ordered_list'],
  ];

  html= '';

  ngOnInit(){
    // console.log(this.previousUrl);
    this.postID = Number(this._route.snapshot.paramMap.get('id'));
    this.LoadGroups();
    this.LoadTopics();
    // this.LoadPost(this.postID);

    // this.editor = new Editor();
    // this.ListGroup();
  }

  //destory the editor
  ngOnDestroy(): void {
    this.editor.destroy();
  }

  //load posts
  LoadPost(id : number){
    this.apiService.getPost(id).subscribe({
      next:data =>{
        this.currPost = data;
        if(this.listTopic.find(t => t.id == data.topicID)){ // check if event type already exists
          this.selectedTopic = data.topicID;
        }
        else{
          this.selectedTopic = 1;
        }
        let oldType = this.listTopic.find(t => t.id == this.selectedTopic)?.name
        // if not update event type, default event type is '1 : Out Door'

        this.selectedGroup = data.groupID.split(',');
        if(data.priority == 1) this.checked = true;
        let gr =  data.groupID.split(',');
        this.addEventForm.setValue({
          eventTitle: data.title,
          eventType: oldType,
          eventDate: data.date,
          eventTime: data.date,
          eventLocation: data.location,
          eventImg: data.image,
          eventPiority: data.priority,
          eventGroup: gr,
          eventContent: data.content
        })
      }
    })
  }

  //list topic handle
  LoadTopics(){
    this.apiService.getTopic().subscribe({
      next:data =>{
        this.listTopic = data;
        this.LoadPost(this.postID);
      }
    })
  }
  //list group handle
  LoadGroups(){
    this.apiService.getGroup().subscribe({
      next:data => {
        this.ListGroups = data;
        this.groupsID = [];
        data.forEach(g => this.groupsID.push(g.id.toString()));
      }
    })
  }

  // select all group
  selectAll(){
    if(this.selectAllGroup.selected){
      this.addEventForm.patchValue({eventGroup :this.groupsID})
      this.selectAllGroup.select();
    }
    else{
      this.addEventForm.patchValue({eventGroup :[]})
    }
    console.log(this.addEventForm.get('eventGroup')?.value)
  }
  selectGroup(){
    if(this.selectAllGroup.selected) {
      this.selectAllGroup.deselect();
    }
    if(this.addEventForm.controls.eventGroup.value?.length == this.groupsID.length) this.selectAllGroup.select();
  }


  onSubmit(){
    if(this.checked) this.addEventForm.patchValue({eventPiority:1})
    else this.addEventForm.patchValue({eventPiority:0})

    let gr = this.addEventForm.get('eventGroup')?.value;
    if(this.selectAllGroup.selected){
      gr?.shift();
      console.log(gr);
    }

    if(gr?.length == 0){
      gr = ['']
    }
    this.addEventForm.patchValue({eventGroup:gr});
    this.addEventForm.patchValue({eventType: this.selectedTopic});

    let data = Object(this.addEventForm.value);
    // console.log(this.addEventForm.get('eventContent')?.value)
    this.addEventForm.reset();

    this.selectedTopic = 1;
    this.selectedGroup = [''];

    this.postService.editPost(data, this.postID, this.currPost.date, this.fileSrc, this.currPost.showInSlider)
    .subscribe({
      next:data=>{
        alert('Saved change');
        if(sessionStorage.getItem('prev')){
          if(sessionStorage.getItem('prev')?.includes('posts')){
            this.router.navigate(['/admin/posts']);
            sessionStorage.removeItem('prev');
          }
          else{
            this.router.navigate(['/']);
            sessionStorage.removeItem('prev');
          }
        }
        else{
           this.router.navigate(['/admin/posts']);
          sessionStorage.removeItem('prev');
        }
      },
      error:err=>{alert(err.message)}
    })
  }

  cancelEdit(){
    if(sessionStorage.getItem('prev')){
      if(sessionStorage.getItem('prev')?.includes('posts')){
        this.router.navigate(['/admin/posts']);
        sessionStorage.removeItem('prev');
      }
      else{
        this.router.navigate(['/']);
        sessionStorage.removeItem('prev');
      }
    }
    else{
       this.router.navigate(['/admin/posts']);
      sessionStorage.removeItem('prev');
    }
  }

  // upload img
  onFileSelected(event:Event){
    // @ts-ignore: Object is possibly 'null'.
    let file = (event.target as HTMLInputElement).files[0];
    if(file.size > 250000){
      alert('Maximum image size is 250KB');
      this.fileSrc = this.addEventForm.get('eventImg')?.value;
      // this.addEventForm.patchValue({eventImg:null})
      this.addEventForm.get('eventImg')?.reset();
      (<HTMLInputElement>document.getElementById('choose-file')).value = "";
      // console.log(this.addEventForm.get('eventImg')?.value)
    }
    else{
      const reader = new FileReader();
      reader.readAsDataURL(file)
      reader.addEventListener("load", (event) => {
        this.fileSrc = reader.result as string;
      });
    }
  }

  handleTopic(e: any){
    let eventType = e.target.value;
    this.addEventForm.patchValue({eventType: eventType});
    // console.log(eventType)
    if(this.listTopic.find(t => t.name == eventType)){
      console.log(eventType)
      let id = this.listTopic.find(t => t.name == eventType)?.id;
      this.selectedTopic = id? id : 0;
    }
    else{
      let msg = `Add new event type "${eventType}"?`;
      if(confirm(msg) == true){ // add new event type / topic
        this.postService.addEventType(eventType).subscribe({
          next:data =>{
            this.selectedTopic = data.id;
          }
        });
      }
      else{
        e.target.value = '';
      }
    }

  }

}


