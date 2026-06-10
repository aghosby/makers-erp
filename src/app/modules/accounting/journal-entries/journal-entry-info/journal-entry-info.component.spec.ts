import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JournalEntryInfoComponent } from './journal-entry-info.component';

describe('JournalEntryInfoComponent', () => {
  let component: JournalEntryInfoComponent;
  let fixture: ComponentFixture<JournalEntryInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JournalEntryInfoComponent ]
    }).compileComponents();
    fixture = TestBed.createComponent(JournalEntryInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
