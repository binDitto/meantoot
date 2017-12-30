import { EditBlogComponent } from './components/blog/edit-blog/edit-blog.component';
import { DeleteBlogComponent } from './components/blog/delete-blog/delete-blog.component';
import { BlogComponent } from './components/blog/blog.component';
import { NotAuthGuard } from './guards/notAuth.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { PublicProfileComponent } from './components/public-profile/public-profile.component';

// Routing for single page app
const appRoutes: Routes = [
  // Needs pathMatch full so algorithm figures out whole url path to match
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'register', component: RegisterComponent, canActivate: [NotAuthGuard]},
  { path: 'login', component: LoginComponent, canActivate: [NotAuthGuard]},
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'blog', component: BlogComponent, canActivate: [AuthGuard]}, // make it so only signed in users can see
  { path: 'edit-blog/:id', component: EditBlogComponent, canActivate: [AuthGuard]},
  { path: 'delete-blog/:id', component: DeleteBlogComponent, canActivate: [AuthGuard]},
  { path: 'user/:username', component: PublicProfileComponent, canActivate: [AuthGuard]},
  // Any unspecifed route entered in browser will redirect to HomeComponent
  { path: '**', component: HomeComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(appRoutes)],
  providers: [],
  bootstrap: [],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
