import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './user/login/login';
import { Dashboard } from './dashboard/dashboard';
import { AllUsers } from './dashboard/all-users/all-users';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  {path: 'all-dashboard/users', component: AllUsers},
  {path: 'dashboard', component: Dashboard},
  { path: 'dashboard/:menu', component: Dashboard },
]