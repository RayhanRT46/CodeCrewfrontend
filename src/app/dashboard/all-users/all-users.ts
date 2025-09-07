import { Component, Injectable, OnInit } from '@angular/core';
import { LoginService } from '../../user/service/login.service';
import { userModel } from './userModel';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-all-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './all-users.html',
  styleUrls: ['./all-users.css']
})


export class AllUsers implements OnInit {
  userList: userModel[] = [];
  router: any;

  constructor(public service: LoginService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser() {
    this.service.GetUser().subscribe({
      next: (data) => {
        this.userList = data;
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      }
    });
  }

  //Delete User
  DeleteUser(id: number) {
  if (confirm('Are you sure you want to delete this User?')) {
    this.service.DeleteUser(id).subscribe({
      next: () => {
        this.loadUser();
      },
      error: (err) => {
        console.error('Delete failed:', err);
      }
    });
  }
}


//Update User;
editingUserId: number | null = null;
message: string = '';
messageType: 'success' | 'error' = 'success';

startEdit(userId: number) {
  this.editingUserId = userId;
}

saveEdit(user: any) {
  this.service.UpdateUser(user.id, user).subscribe({
    next: () => {
      this.message = '✅ User updated successfully!';
      this.messageType = 'success';
      this.editingUserId = null;
      this.loadUser(); // refresh list
      setTimeout(() => this.message = '', 1000);
    },
  error: (err) => {
    console.log(err);
    this.message = `❌ Failed to update user! (${err.status} ${err.statusText})`;
  }
  });
}

cancelEdit() {
  this.editingUserId = null;
}


}
