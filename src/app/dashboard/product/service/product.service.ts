import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Data, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BrandModel, BrandModel2 } from '../brand/brandModel';
import { productTypeModel } from '../product-types/productTypeModel';
import { Product } from '../productModel';
import { environment } from '../../../environment';

interface ProductApiResult {
  TotalCount: number;
  PageNumber: number;
  PageSize: number;
  Data: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  baseUrl:string = environment.apiUrl;
  constructor(public http:HttpClient , public router: Router)
  {
  }
// All Brand
public GetBrand(): Observable<BrandModel[]> {
    return this.http.get<BrandModel[]>(this.baseUrl+'/api/Brands/GetAllBrand');
  }

// Add a Brand
public BrandAdd(req: any): Observable<any> {
  return this.http.post(`${this.baseUrl + `/api/Brands/CreateBrand`}`, req);
}

//Update a Brand
public UpdateBrand(id: number , data: any): Observable<any>{
  return this.http.put<BrandModel2>(`${this.baseUrl + `/api/Brands/UpdateBrand`}/${id}`, data)
}

//Delete a Brand
public Deletebrand(id:number): Observable<any>{
    debugger
  return this.http.delete(`${this.baseUrl+`/api/Brands/DeleteBrand`}/${id}`);
}

//<---- Cetegory ----->
// All Cetegory
public GetCetegory(): Observable<BrandModel[]> {
    return this.http.get<BrandModel[]>(this.baseUrl+'/api/Cetegorys/GetAllCetegory');
  }

// Add a Cetegory
public AddCetegory(req: any): Observable<any> {
  return this.http.post(`${this.baseUrl + `/api/Cetegorys/CreateCategory`}`, req);
}

//Update a Cetegory
public UpdateCetegory(id: number , data: any): Observable<any>{
  return this.http.put<any>(`${this.baseUrl + `/api/Cetegorys/CategoryUpdate`}/${id}`, data)
}

//Delete a Cetegory
public DeleteCetegory(id:number): Observable<any>{
  return this.http.delete(`${this.baseUrl+`/api/Cetegorys/CategoryDelete`}/${id}`);
}


//<---- ProductType ----->
// All ProductType
public GetProductType(): Observable<productTypeModel[]> {
    return this.http.get<productTypeModel[]>(this.baseUrl+'/api/ProductTypes/GetAllProductTypes');
  }

// Add a ProductType
public AddProductType(req: any): Observable<any> {
  return this.http.post(`${this.baseUrl + `/api/ProductTypes/CreateProductTypes`}`, req);
}

//Update a ProductType
public UpdateProductType(id: number , data: any): Observable<any>{
  return this.http.put<any>(`${this.baseUrl + `/api/ProductTypes/ProductTypes`}/${id}`, data)
}

//Delete a ProductType
public DeleteProductType(id:number): Observable<any>{
  return this.http.delete(`${this.baseUrl+`/api/ProductTypes/DeletProductTypes`}/${id}`);
}

//<---- Product ----->

//Filtering Products
public GetProductWithFiltering(categoryId: number, pageSize: number) {
    const categoryIds = [categoryId]; 
    let params = new HttpParams();
    categoryIds.forEach(id => {
      params = params.append('categoryIds', id.toString());
    });
    params = params.append('pageSize', pageSize.toString());

    return this.http.get(`${this.baseUrl}/api/Products/GetFilteredProductsForCustomer`, { params });
  }

GetProductWithFilterings(
  categoryIds?: number[],
  pageSize?: number,
  productName?: string | null,
  minPrice?: number | null,
  maxPrice?: number | null,
  minReviewRating?: number,
  brandIds?: number[],
  pageNumber?: number
): Observable<any> {
  
  let params = new HttpParams();

  // categoryIds
  if (categoryIds && categoryIds.length > 0) {
    categoryIds.forEach(id => {
      params = params.append('categoryIds', id.toString());
    });
  }

  // brandIds
  if (brandIds && brandIds.length > 0) {
    brandIds.forEach(id => {
      params = params.append('brandIds', id.toString());
    });
  }

  // string or numeric filters
  if (pageSize != null) params = params.append('pageSize', pageSize.toString());
  if (pageNumber != null) params = params.append('pageNumber', pageNumber.toString());
  if (productName) params = params.append('productName', productName);
  if (minPrice != null) params = params.append('minPrice', minPrice.toString());
  if (maxPrice != null) params = params.append('maxPrice', maxPrice.toString());
  if (minReviewRating != null) params = params.append('minReviewRating', minReviewRating.toString());

  // call API
  return this.http.get(`${this.baseUrl}/api/Products/GetFilteredProductsForCustomer`, { params });
}



  //Dashboard Product with UserID filtefing
public GetProduct(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/api/Products/GetAllProduct`);
  }
  
  //New product Create
public AddProduct(req: any): Observable<any> {
    return this.http.post(`${this.baseUrl + `/api/Products/CreateProduct`}`, req ) ;
  }

  //Update Product 
public  UpdateProduct(id: number, data: FormData): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/api/Products/UpdateProduct/${id}`, data);
  }

  //Delete Product
 public DeleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/Products/DeleteProduct/${id}`);
  }

//Product Status Change
public  toggleProductStatus(id: number, isActive: boolean) {
  return this.http.patch(`${this.baseUrl}/api/Products/ToggleProductStatus/${id}`, isActive);
}

//Product Bulk Actions
public bulkAction(productIds: number[], action: string) {
  return this.http.post(`${this.baseUrl}/api/Products/BulkAction`, { productIds, action });
}


}
