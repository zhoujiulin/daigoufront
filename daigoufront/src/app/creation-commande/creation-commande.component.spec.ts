import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationCommandeComponent } from './creation-commande.component';

describe('CreationCommandeComponent', () => {
  let component: CreationCommandeComponent;
  let fixture: ComponentFixture<CreationCommandeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreationCommandeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationCommandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
