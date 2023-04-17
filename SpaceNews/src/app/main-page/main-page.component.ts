import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-home-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {
  // bsInlineValue = new Date();
  // bsInlineRangeValue: Date[];
  // maxDate = new Date();
  // bsConfig?: Partial<BsDatepickerConfig> = Object.assign({}, {
  //   containerClass: 'theme-default',
  //   showWeekNumbers: false,
  //   // datePickerHead :'S, M, T, W, T, F, S'
  // });

  constructor(private router : Router) {

  }

  // ListTopic = [
  //   {
  //     id : 1,
  //     subject : 'Subject 1'
  //   },
  //   {
  //     id : 2,
  //     subject : 'Subject 2'
  //   },
  //   {
  //     id : 3,
  //     subject : 'Subject 3'
  //   },
  // ]
  // topicChecked = 0;

  // topicChange(value : number){
  //   this.topicChecked = value;
  // }
  toLogin(){
    this.router.navigate(['/login']);
  }
  // navLogin(){
  //    navigateByUrl(url: string | UrlTree, extras: NavigationExtras = { skipLocationChange: false }): Promise<boolean>;
  // }



}
