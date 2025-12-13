import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { Login } from './dashboard/user/login/login';
import { Dashboard } from './dashboard/dashboard';
import { ShopComponent } from './shop/shop';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  {path: 'shop', component: ShopComponent},
  { path: 'login', component: Login },
  {path: 'dashboard', component: Dashboard},
  { path: 'dashboard/:menu', component: Dashboard },
]