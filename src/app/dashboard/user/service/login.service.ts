import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { userModel } from '../all-users/userModel';
import { Router } from '@angular/router';
import { Registeruseradmin } from '../registeruseradmin/registeruseradmin';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  
   baseUrl:string = 'https://localhost:7229/api/'
  constructor(public http:HttpClient , public router: Router)
  {
  }
// All User Get
public GetUser(): Observable<userModel[]> {
    return this.http.get<userModel[]>(this.baseUrl+'User');
  }


//Delete a User
public DeleteUser(id:number): Observable<any>{
  return this.http.delete(`${this.baseUrl+`User`}/${id}`);
}

//Update a User
public UpdateUser(id: number, user: userModel): Observable<userModel>{
  return this.http.put<userModel>(`${this.baseUrl + `User`}/${user.id}`, user)
}


// Add a User

  registerUserAdmin(req: Registeruseradmin, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post(`${this.baseUrl + `User/register-user-admin`}`, req, { headers });
  }


//Login API call
  login(email: string, password: string): Observable<any> {
    return this.http.post(this.baseUrl +'User/login', { email, password });
  }

  // Save token & user
  saveAuthData(token: string, user: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  // Get token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Get user info
  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Is Logged In?
  isLoggedIn(): boolean {
    return this.getToken() != null;
  }
}