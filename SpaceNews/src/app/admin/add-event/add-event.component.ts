import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Editor, Toolbar } from 'ngx-editor';
import { ApiService } from 'src/app/Service/api.service';
import { Topic } from 'src/app/Topic';
import { Router } from '@angular/router';
import { Group } from 'src/app/Group';
import { HandlePostService } from 'src/app/Service/handle-post.service';
import { MatOption } from '@angular/material/core';
// import { daLocale } from 'ngx-bootstrap/chronos';

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

  location: any;

  checked = false;
  defaultTopic = '';
  listTopic : Topic[] = [];
  ListGroups : Group[] = [];
  selectedTopic = 1;
  selectedGroup = ['']

  addEventForm = new FormGroup({
    eventTitle: new FormControl(''),
    eventType: new FormControl(),
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
    // this.getLocation();

    this.addEventPromise
    .then((listLocation)=>{
      this.location = listLocation;
      this.LoadTopics();
      this.LoadGroups();
      this.initForm();
    })
    .catch(()=>{
      this.LoadTopics();
      this.LoadGroups();
      this.initForm();
    })


    // console.log(this.router.url)
    this.editor = new Editor();
    this.selectedTopic = 1;
    // this.ListGroup();
  }

  initForm(){
    this.addEventForm = this.fb.group({
      eventTitle: ['', [Validators.required]],
      eventType: ['', [Validators.required]],
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
        this.defaultTopic = data[0].name;
        this.addEventForm.patchValue({eventType: this.defaultTopic});
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
    if(this.selectAllGroup.selected){
      gr?.shift();
    }

    if(gr?.length == 0){
      gr = ['']
    }


    this.addEventForm.patchValue({eventGroup : gr});
    this.addEventForm.patchValue({eventType: this.selectedTopic});

    let data = Object(this.addEventForm.value);
    console.log(data);

    // reset form values
    this.selectedTopic = 1;
    this.initForm();
    this.addEventForm.patchValue({eventType: this.defaultTopic});


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

  handleTopic(e: any){
    let eventType = e.target.value.trim();
    this.addEventForm.patchValue({eventType: eventType});
    // console.log(eventType)
    if(this.listTopic.find(t => t.name == eventType)){
      let id = this.listTopic.find(t => t.name == eventType)?.id;
      this.selectedTopic = id? id : 0;
    }
    else {
      if(eventType !=""){
        let msg = `Add new event type "${eventType}"?`;
        if(confirm(msg)){ // add new event type / topic
          this.postService.addEventType(eventType).subscribe({
            next:data =>{
              this.selectedTopic = data.id;
            }
          });
        }
        else{
          this.selectedTopic = 1;
          this.addEventForm.patchValue({eventType: this.defaultTopic});
        }
      }else{
        this.selectedTopic = 1;
        this.addEventForm.patchValue({eventType: this.defaultTopic});
      }
    }



  }

  addEventPromise = new Promise((resolve, reject) =>{
    let location = new Set();
    this.apiService.getSlider().subscribe({
      next : data => {
        let posts = data;
        posts.forEach(p => {location.add(p.location);})
        resolve(Array.from(location));
      },
      error: err=>{
        reject(err);
      }
    })
  })
}
