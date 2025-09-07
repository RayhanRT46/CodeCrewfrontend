import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Registeruseradmin } from './registeruseradmin';

describe('Registeruseradmin', () => {
  let component: Registeruseradmin;
  let fixture: ComponentFixture<Registeruseradmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Registeruseradmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Registeruseradmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
