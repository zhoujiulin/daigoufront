import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalArriverColisComponent } from './modalarrivercolis.component';

describe('ModalarrivercolisComponent', () => {
  let component: ModalArriverColisComponent;
  let fixture: ComponentFixture<ModalArriverColisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalArriverColisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalArriverColisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
