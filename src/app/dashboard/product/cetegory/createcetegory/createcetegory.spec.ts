import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCetegory } from './createcetegory';

describe('CreateCetegory', () => {
  let component: CreateCetegory;
  let fixture: ComponentFixture<CreateCetegory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCetegory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCetegory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
