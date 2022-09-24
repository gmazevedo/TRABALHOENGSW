import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { SessionCreateComponent } from 'src/app/components/session-create/session-create.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './components/login/login.component';
import { MySessionsComponent } from './components/my-sessions/my-sessions.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SignupComponent } from './components/signup/signup.component';

const routes: Routes = [
  {
    path: 'session-create',
    component: SessionCreateComponent,
    canActivate: [AuthGuard],
    pathMatch: 'full',
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    pathMatch: 'full',
  },
  {
    path: 'my-sessions',
    component: MySessionsComponent,
    canActivate: [AuthGuard],
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    pathMatch: 'full',
  },
  {
    path: 'signup',
    component: SignupComponent,
    pathMatch: 'full',
  },
  // default route
  {
    path: '',
    redirectTo: 'profile',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [CommonModule, BrowserModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
