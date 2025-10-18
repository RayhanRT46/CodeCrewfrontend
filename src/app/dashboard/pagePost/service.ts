import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environment';
import { Page, Post } from './PagePostInterface';

@Injectable({
  providedIn: 'root'
})
export class PostPageService {
  
   baseUrl:string = environment.apiUrl;
  constructor(public http:HttpClient , public router: Router)
  {
  }

  // -------------------------
  // Page Management
  // -------------------------
  getAllPages(): Observable<Page[]> {
    return this.http.get<Page[]>(`${this.baseUrl}/api/pages`);
  }
  getPageById(id: number): Observable<Page> {
    return this.http.get<Page>(`${this.baseUrl}/api/pages/${id}`);
  }

  createPage(page: Page): Observable<Page> {
    const pageToCreate = { ...page, id: 0 }; 
    return this.http.post<Page>(`${this.baseUrl}/api/pages`, pageToCreate);
  }

  updatePage(page: Page): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/api/pages/${page.id}`, page);
  }

  deletePage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/pages/${id}`);
  }

  // -------------------------
  // Post Management
  // -------------------------

  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/admin/posts`);
  }
  
  createPost(post: Post): Observable<Post> {
    const postToCreate = { ...post, id: 0 };
    return this.http.post<Post>(`${this.baseUrl}/admin/posts`, postToCreate);
  }

}