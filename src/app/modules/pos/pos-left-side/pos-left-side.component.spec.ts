import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosLeftSideComponent } from './pos-left-side.component';

describe('PosLeftSideComponent', () => {
  let component: PosLeftSideComponent;
  let fixture: ComponentFixture<PosLeftSideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosLeftSideComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosLeftSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
