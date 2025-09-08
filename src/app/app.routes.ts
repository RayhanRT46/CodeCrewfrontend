import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './dashboard/user/login/login';
import { Dashboard } from './dashboard/dashboard';


export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  {path: 'dashboard', component: Dashboard},
  { path: 'dashboard/:menu', component: Dashboard },
]