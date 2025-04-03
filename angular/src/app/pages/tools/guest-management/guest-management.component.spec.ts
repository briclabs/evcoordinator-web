import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestManagementComponent } from './guest-management.component';

describe('GuestManagementComponent', () => {
  let component: GuestManagementComponent;
  let fixture: ComponentFixture<GuestManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuestManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
