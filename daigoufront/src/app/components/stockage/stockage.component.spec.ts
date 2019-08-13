import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockageComponent } from './stockage.component';

describe('StockageComponent', () => {
  let component: StockageComponent;
  let fixture: ComponentFixture<StockageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
