import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTypesCreate } from './product-types-create';

describe('ProductTypesCreate', () => {
  let component: ProductTypesCreate;
  let fixture: ComponentFixture<ProductTypesCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductTypesCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductTypesCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
