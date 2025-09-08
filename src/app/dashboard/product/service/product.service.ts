import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Data, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BrandModel, BrandModel2 } from '../brand/brandModel';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  baseUrl:string = 'https://localhost:7229/api/'
  constructor(public http:HttpClient , public router: Router)
  {
  }
// All Brand
public GetBrand(): Observable<BrandModel[]> {
    return this.http.get<BrandModel[]>(this.baseUrl+'Brands/GetAllBrand');
  }

// Add a Brand
public BrandAdd(req: any, token: string): Observable<any> {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });
  return this.http.post(`${this.baseUrl + `Brands/CreateBrand`}`, req, { headers });
}

//Update a Brand
public UpdateBrand(id: number , data: any): Observable<any>{
  return this.http.put<BrandModel2>(`${this.baseUrl + `Brands/ProductBrand`}/${id}`, data)
}

//Delete a User
public Deletebrand(id:number): Observable<any>{
  return this.http.delete(`${this.baseUrl+`Brands/DeletBrand`}/${id}`);
}

}
