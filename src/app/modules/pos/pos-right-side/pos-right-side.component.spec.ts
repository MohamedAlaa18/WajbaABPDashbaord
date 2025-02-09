import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosRightSideComponent } from './pos-right-side.component';

describe('PosRightSideComponent', () => {
  let component: PosRightSideComponent;
  let fixture: ComponentFixture<PosRightSideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosRightSideComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosRightSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
