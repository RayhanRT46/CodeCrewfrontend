import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cetegory } from './cetegory';

describe('Cetegory', () => {
  let component: Cetegory;
  let fixture: ComponentFixture<Cetegory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cetegory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cetegory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
