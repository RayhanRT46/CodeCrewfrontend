export interface ProductImage {
  imageUrl: string;
}

export interface ProductAttribute {
  name: string;
  value: string;
}

export interface Product {
  id: number;
  productName: string;
  description?: string;
  price?: number;
  salePrice?: number;
  stockQuantity: number;
  weightUnit?: string;
  unitQuantity?: string;
  isActive: boolean;
  categoryId: number;
  brandId?: number;
  productTypeId?: number;
  sellerId: number;
  images?: ProductImage[];
  attributes?: ProductAttribute[];
}
