import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Editor, Toolbar } from 'ngx-editor';
import { ApiService } from 'src/app/Service/api.service';
import { Topic } from 'src/app/Topic';
import { Router } from '@angular/router';
import { Group } from 'src/app/Group';
import { HandlePostService } from 'src/app/Service/handle-post.service';

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit, OnDestroy{
  fileSrc: any;
  selectedFile: ImageSnippet | undefined;

  checked = false;
  listTopic : Topic[] = [];
  ListGroups : Group[] = [];
  selectedTopic = 1;
  selectedGroup = 1;

  addEventForm = new FormGroup({
    eventTitle: new FormControl(''),
    eventType: new FormControl(1),
    eventDate: new FormControl(Date),
    eventTime: new FormControl(Date),
    eventLocation: new FormControl(''),
    eventImg: new FormControl(''),
    eventPiority: new FormControl(0),
    eventGroup: new FormControl(1),
    eventContent: new FormControl('')
  });


  constructor(private fb: FormBuilder, private apiService: ApiService, private postService:HandlePostService, private router : Router) {}


  editor = new Editor;
  toolbar: Toolbar = [
    ['bold', 'italic', 'underline','text_color'],
    ['link', 'image', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['bullet_list', 'ordered_list'],
  ];

  html= '';

  ngOnInit(){
    this.initForm();
    // console.log(this.router.url)
    this.editor = new Editor();
    this.LoadTopics();
    this.LoadGroups();
    this.selectedTopic = 1;
    this.selectedGroup = 1;
    // this.ListGroup();
  }

  initForm(){
    this.addEventForm = this.fb.group({
      eventTitle: ['', [Validators.required]],
      eventType: [1],
      eventDate: [Date, [Validators.required]],
      eventTime: [Date, [Validators.required]],
      eventLocation: ['', [Validators.required]],
      eventImg: ['', [Validators.required]],
      eventPiority: [0],
      eventGroup: [1],
      eventContent: ['', [Validators.required]]
    })
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
      }
    })
  }
  //list group handle
  LoadGroups(){
    this.apiService.getGroup().subscribe({
      next:data => {
        this.ListGroups = data;
      }
    })
  }

  onSubmit(){
    // console.log(this.fileSrc);
    if(this.checked) this.addEventForm.patchValue({eventPiority:1})
    else this.addEventForm.patchValue({eventPiority:0})
    // this.addEventForm.patchValue({eventImg: this.fileSrc})

    let data = Object(this.addEventForm.value);

    // this.addEventForm.reset();
    this.initForm();
    this.postService.addPost(data, this.fileSrc).subscribe({
      next:data=>{
        alert('Success');
      },
      error:err=>{console.log(err)}
    })
  }

  // upload img
  onFileSelected(event:Event){
    // @ts-ignore: Object is possibly 'null'.
    let file = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file)
    reader.addEventListener("load", (event) => {
      this.fileSrc = reader.result as string;
    });

  }



}
