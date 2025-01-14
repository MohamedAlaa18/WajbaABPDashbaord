import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguagesDetailsComponent } from './languages-details.component';

describe('LanguagesDetailsComponent', () => {
  let component: LanguagesDetailsComponent;
  let fixture: ComponentFixture<LanguagesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguagesDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanguagesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
