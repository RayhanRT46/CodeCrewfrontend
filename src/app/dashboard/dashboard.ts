import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from './sidebar/sidebar';
import { AllUsers } from "./all-users/all-users";
import { NavigationEnd, Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Registeruseradmin } from "./all-users/registeruseradmin/registeruseradmin";
import { filter } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, Sidebar, AllUsers, RouterModule, Registeruseradmin],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard {
  activeMenu: string = '';
  showAddUser: boolean = false;

  // ✅ Inject Router and ActivatedRoute
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    // Listen to route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const urlParts = this.router.url.split('/');
        this.activeMenu = urlParts[2] || '';
        this.showAddUser = urlParts[3] === 'add';
      });
  }

  onMenuClick(menu: string) {
    this.activeMenu = menu;
    this.showAddUser = false;
    this.router.navigate(['/dashboard', menu]);
  }

  onAddUserClick() {
    this.showAddUser = true;
    this.router.navigate(['/dashboard', 'users', 'add']);
  }

  onUserRegistered() {
    this.showAddUser = false;
    this.router.navigate(['/dashboard', 'users']);
  }
}
