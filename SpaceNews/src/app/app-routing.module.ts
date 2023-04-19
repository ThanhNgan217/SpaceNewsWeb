import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { ListPostComponent } from './list-post/list-post.component';
import { PostComponent } from './post/post.component';
import { ContentComponent } from './content/content.component';

const routes: Routes = [
  {
    path:'',
    component:MainPageComponent,
    children:[
      {path:'', component:ContentComponent},
      {path:'post/:id', component:PostComponent},
    ]
  },
  {path:'home',redirectTo:'', pathMatch:'full'},
  {path:'post/:id', component:PostComponent},
  {path:'login', component:LoginPageComponent},
  // {path:'/', component:ListPostComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
