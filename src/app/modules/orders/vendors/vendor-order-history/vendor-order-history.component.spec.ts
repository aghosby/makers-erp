import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierOrderHistoryComponent } from './supplier-order-history.component';

describe('SupplierOrderHistoryComponent', () => {
  let component: SupplierOrderHistoryComponent;
  let fixture: ComponentFixture<SupplierOrderHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierOrderHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierOrderHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
