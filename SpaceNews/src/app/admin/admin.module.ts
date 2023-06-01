import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEventComponent } from './add-event/add-event.component';
import { PostsManageComponent } from './posts-manage/posts-manage.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Route, RouterModule, Routes } from '@angular/router';

import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgxEditorModule } from 'ngx-editor';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CanActivateGuard } from '../Guard/can-activate-guard.guard';
import { AdminComponent } from './admin/admin.component';
import { BlockRightComponent } from './block-right/block-right.component';
import { EditEventComponent } from './edit-event/edit-event.component';
import { GroupDetailsDialog, GroupEditDialog, GroupManageComponent } from './group-manage/group-manage.component';
import { PastEventsComponent } from './past-events/past-events.component';
import { AddGroupComponent } from './add-group/add-group.component';


const routes: Routes = [
  { path: 'admin',
    component: AdminComponent,
    // canActivate: [CanActivateGuard],
    children: [
      {
        path:'posts',
        component:PostsManageComponent,
      },
      {
        path: '', redirectTo : 'posts', pathMatch:'full'
      },
      {
        path:'groups',
        component:GroupManageComponent
      }
    ]
  },
  {
    path:'admin/posts/add',
    component: AddEventComponent,
    // canActivate: [CanActivateGuard],
  },
  {
    path:'admin/posts/edit/:id',
    component: EditEventComponent,
    // canActivate: [CanActivateGuard],
  },
  {
    path:'admin/groups/add',
    component: AddGroupComponent,
    // canActivate: [CanActivateGuard],
  }
];

@NgModule({
  declarations: [
    AddEventComponent,
    PostsManageComponent,
    AdminComponent,
    BlockRightComponent,
    EditEventComponent,
    GroupManageComponent,
    PastEventsComponent,
    GroupDetailsDialog,
    GroupEditDialog,
    AddGroupComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxEditorModule,
    MatFormFieldModule,
    MatDialogModule,
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
    MatSelectModule,
    ReactiveFormsModule
  ],

})
export class AdminModule { }
