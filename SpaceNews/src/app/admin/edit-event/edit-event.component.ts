import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Editor, Toolbar } from 'ngx-editor';
import { ApiService } from 'src/app/Service/api.service';
import { Topic } from 'src/app/Topic';
import { ActivatedRoute, Router } from '@angular/router';
import { Group } from 'src/app/Group';
import { HandlePostService } from 'src/app/Service/handle-post.service';
import {Location} from '@angular/common';

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
  selectedGroup = '';

  addEventForm = new FormGroup({
    eventTitle: new FormControl('', Validators.required),
    eventType: new FormControl(1, Validators.required),
    eventDate: new FormControl( new Date, Validators.required),
    eventTime: new FormControl(new Date, Validators.required),
    eventLocation: new FormControl('', Validators.required),
    eventImg: new FormControl(''),
    eventPiority: new FormControl(0, Validators.required),
    eventGroup: new FormControl('', Validators.required),
    eventContent: new FormControl('', Validators.required)
  });


  constructor(private location: Location, private fb: FormBuilder, private _route: ActivatedRoute, private apiService: ApiService, private postService:HandlePostService, private router : Router) {

  }


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
    this.LoadPost(this.postID);

    // this.editor = new Editor();
    this.LoadTopics();
    this.LoadGroups();
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
        this.selectedTopic = data.topicID;
        this.selectedGroup = data.groupID;
        if(data.priority == 1) this.checked = true;
        this.addEventForm.patchValue({eventContent: data.content})
        // this.addEventForm.patchValue({eventDate: new Date})
        // this.addEventForm.patchValue({eventTime: new Date})
        this.addEventForm.setValue({
          eventTitle: data.title,
          eventType: data.topicID,
          eventDate: data.date,
          eventTime: data.date,
          eventLocation: data.location,
          eventImg: data.image,
          eventPiority: data.priority,
          eventGroup: data.groupID,
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
    if(this.checked) this.addEventForm.patchValue({eventPiority:1})
    else this.addEventForm.patchValue({eventPiority:0})

    let data = Object(this.addEventForm.value);
    // console.log(this.addEventForm.get('eventContent')?.value)
    this.addEventForm.reset();

    this.selectedTopic = 1;
    this.selectedGroup = '1';

    this.postService.editPost(data, this.postID, this.currPost.date, this.fileSrc, this.currPost.showInSlider)
    .subscribe({
      next:data=>{
        alert('Saved change');
        this.router.navigateByUrl('admin/posts');
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

}


