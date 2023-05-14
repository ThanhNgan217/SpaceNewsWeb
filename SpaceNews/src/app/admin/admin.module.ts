import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEventComponent } from './add-event/add-event.component';
import { PostsManageComponent } from './posts-manage/posts-manage.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Route, RouterModule, Routes } from '@angular/router';

import {MatMenuModule} from '@angular/material/menu';
import {MatTableModule} from '@angular/material/table';
import {MatListModule} from '@angular/material/list';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { NgxEditorModule } from 'ngx-editor';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CanActivateGuard } from '../Guard/can-activate-guard.guard';
import { AdminComponent } from './admin/admin.component';
import { BlockRightComponent } from './block-right/block-right.component';

const routes: Routes = [
  { path: 'admin',
    component: AdminComponent,
    // canActivate: [CanActivateGuard],
    children: [
      {
        path:'posts', 
        component:PostsManageComponent,
      }
    ]
  },
  {
    path:'admin/posts/add',
    component: AddEventComponent,
    // canActivate: [CanActivateGuard],
  }
  ,
  {
    path: 'Groups',
    component: AddEventComponent,
    canActivate: [CanActivateGuard],
  }
];

@NgModule({
  declarations: [
    AddEventComponent,
    PostsManageComponent,
    AdminComponent,
    BlockRightComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxEditorModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatTableModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatInputModule,
    MatIconModule,
    MatOptionModule,
    ReactiveFormsModule
  ],

})
export class AdminModule { }
