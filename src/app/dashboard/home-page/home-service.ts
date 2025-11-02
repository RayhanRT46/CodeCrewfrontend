import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class homeService {
  private base = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  // get latest config (returns raw JSON)
  getConfig(): Observable<any> {
    return this.http.get<any>(`${this.base}/api/homepage/GetLatestConfig`);
  }

  // save config (admin)
  saveConfig(config: any): Observable<any> {
    debugger
    return this.http.post(`${this.base}/api/homepage/SaveConfig`, config);
  }

  // optional update by id
  updateConfig(id: number, config: any) {
    return this.http.put(`${this.base}/api/homepage/UpdateConfig${id}`, config);
  }
}
