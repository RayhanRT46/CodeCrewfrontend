import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
})
export class Sidebar {
  @Output() menuClick = new EventEmitter<string>();
  @Input() activeMenu: string = '';
  isCollapsed: boolean = false;

  selectMenu(menu: string) {
    this.menuClick.emit(menu);
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
