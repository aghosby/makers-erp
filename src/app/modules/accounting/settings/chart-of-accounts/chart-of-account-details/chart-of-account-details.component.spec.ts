import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartOfAccountDetailsComponent } from './chart-of-account-details.component';

describe('ChartOfAccountDetailsComponent', () => {
  let component: ChartOfAccountDetailsComponent;
  let fixture: ComponentFixture<ChartOfAccountDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartOfAccountDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartOfAccountDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
