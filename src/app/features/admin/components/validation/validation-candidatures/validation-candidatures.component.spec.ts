import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationCandidaturesComponent } from './validation-candidatures.component';

describe('ValidationCandidaturesComponent', () => {
  let component: ValidationCandidaturesComponent;
  let fixture: ComponentFixture<ValidationCandidaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidationCandidaturesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidationCandidaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
