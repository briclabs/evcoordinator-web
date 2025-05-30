import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRegistrationComponent } from './edit-registration.component';

describe('MyProfileComponent', () => {
  let component: EditRegistrationComponent;
  let fixture: ComponentFixture<EditRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditRegistrationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
