import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
// import { ListPostComponent } from './list-post/list-post.component';
// import { PostComponent } from './post/post.component';
import { ContentComponent } from './content/content.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PreloadAllModules } from '@angular/router';
import { CanLoginGuard } from './Guard/can-login.guard';

const routes: Routes = [
  {
    path:'',
    component:MainPageComponent,
    children:[
      {path:'', component:ContentComponent},
      // {path:'post/:id', component:PostComponent},
    ]
  },

  {path:'home',redirectTo:'', pathMatch:'full'},
  {
    path:'login',
    component:LoginPageComponent,
    canActivate:[CanLoginGuard],
    loadChildren : ()=>import('./admin/admin.module').then((m)=>m.AdminModule)
  },
  {path:'**', component:PageNotFoundComponent},
  // {path:'/', component:ListPostComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules,
  }),],
  exports: [RouterModule]
})
export class AppRoutingModule { }
