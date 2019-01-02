import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlemodeleComponent } from './articlemodele.component';

describe('ArticlemodeleComponent', () => {
  let component: ArticlemodeleComponent;
  let fixture: ComponentFixture<ArticlemodeleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticlemodeleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticlemodeleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
