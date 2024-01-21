import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablicaComponent } from './tablica.component';

describe('TablicaComponent', () => {
  let component: TablicaComponent;
  let fixture: ComponentFixture<TablicaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TablicaComponent]
    });
    fixture = TestBed.createComponent(TablicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
