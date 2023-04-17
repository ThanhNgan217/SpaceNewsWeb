import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { ListPostComponent } from './list-post/list-post.component';
import { PostComponent } from './post/post.component';

const routes: Routes = [
  {path:'', component:MainPageComponent},
  {path:'home',redirectTo:'', pathMatch:'full'},
  {path:'login', component:LoginPageComponent},
  // {path:'home/topic/:id', component:ListPostComponent},
  {path:'post/:id', component:PostComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
