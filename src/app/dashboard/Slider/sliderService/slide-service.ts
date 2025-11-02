import { Injectable } from '@angular/core';
import { environment } from '../../../environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SlideService {
  baseUrl: string = `${environment.apiUrl}/api/Slides`;

  constructor(private http: HttpClient) {}

  getSlides(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  addSlide(formData: FormData): Observable<any> {
    return this.http.post(this.baseUrl, formData);
  }

  updateSlide(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, formData);
  }

  deleteSlide(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
