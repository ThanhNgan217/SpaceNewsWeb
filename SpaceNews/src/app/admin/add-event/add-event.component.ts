import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Editor, Toolbar } from 'ngx-editor';
import { ApiService } from 'src/app/Service/api.service';
import { Topic } from 'src/app/Topic';
import { Router } from '@angular/router';
import { Group } from 'src/app/Group';
import { HandlePostService } from 'src/app/Service/handle-post.service';
import { MatOption } from '@angular/material/core';

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

  groupsID = [''];

  checked = false;
  listTopic : Topic[] = [];
  ListGroups : Group[] = [];
  selectedTopic = 1;
  selectedGroup = ['0']

  addEventForm = new FormGroup({
    eventTitle: new FormControl(''),
    eventType: new FormControl(1),
    eventDate: new FormControl(Date),
    eventTime: new FormControl(Date),
    eventLocation: new FormControl(''),
    eventImg: new FormControl(''),
    eventPiority: new FormControl(0),
    eventGroup: new FormControl(['']),
    eventContent: new FormControl('')
  });


  constructor(private fb: FormBuilder, private apiService: ApiService, private postService:HandlePostService, private router : Router) {}
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
    this.initForm();
    // console.log(this.router.url)
    this.editor = new Editor();
    this.LoadTopics();
    this.LoadGroups();
    this.selectedTopic = 1;
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
      eventGroup: [['']],
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
        this.groupsID = [];
        data.forEach(g => this.groupsID.push(g.id.toString()));
        // this.selectedGroup = this.groupsID;
        // console.log(this.selectedGroup, this.groupsID)
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
    // console.log(this.fileSrc);
    if(this.checked) this.addEventForm.patchValue({eventPiority:1})
    else this.addEventForm.patchValue({eventPiority:0})
    // this.addEventForm.patchValue({eventImg: this.fileSrc})
    let gr = this.addEventForm.get('eventGroup')?.value;
    gr?.shift();
    this.addEventForm.patchValue({eventGroup : gr})
    let data = Object(this.addEventForm.value);
    console.log(data);
    console.log(this.addEventForm.get('eventGroup')?.value)
    // this.addEventForm.reset();
    this.initForm();
    this.postService.addPost(data, this.fileSrc).subscribe({
      next:data=>{
        alert('Success');
        this.router.navigate(['/admin/posts']);
      },
      error:err=>{console.log(err)}
    })
  }

  // upload img
  onFileSelected(event:Event){
    // @ts-ignore: Object is possibly 'null'.
    let file = (event.target as HTMLInputElement).files[0];
    if(file.size > 250000){
      alert('Maximum image size is 250KB');
      this.addEventForm.patchValue({eventImg: ''})
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
