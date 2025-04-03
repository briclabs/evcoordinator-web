import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RegistrationComponent } from "./registration.component";

describe('Guidelines', () => {
  let fixture: ComponentFixture<RegistrationComponent>;
  let component: RegistrationComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistrationComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should contain the expected form elements', () => {
    const formLabels: HTMLElement[] = fixture.nativeElement.querySelectorAll('label');

    expect(formLabels.length).toEqual(24);

    let formLabelText: Array<string> = new Array<string>(24);

    formLabels.forEach(label => {
      formLabelText.push(label.innerText);
    })

    expect(formLabelText).toContain('Legal First Name');
    expect(formLabelText).toContain('Legal Last Name');
    expect(formLabelText).toContain('Nickname');
    expect(formLabelText).toContain('Email Address');
    expect(formLabelText).toContain('Date of Birth');
    expect(formLabelText).toContain('Street 1');
    expect(formLabelText).toContain('Street 2');
    expect(formLabelText).toContain('Zipcode');
    expect(formLabelText).toContain('City');
    expect(formLabelText).toContain('State');
    expect(formLabelText).toContain('Home Phone Number');
    expect(formLabelText).toContain('Mobile Phone Number');
    expect(formLabelText).toContain('Emergency Contact');
    expect(formLabelText).toContain('Relationship to Self');
    expect(formLabelText).toContain('Emergency Phone');
    expect(formLabelText).toContain('Name of person(s) that first invited me');
    expect(formLabelText).toContain('Name of guest(s) I will be inviting');
    expect(formLabelText).toContain('Guest minor(s) in my care');
    expect(formLabelText).toContain('Relation to minor(s) in my care');
    expect(formLabelText).toContain('Guests pet(s) in my care');
    expect(formLabelText).toContain('Relation to pet(s) in my care');
    expect(formLabelText).toContain('Registration for Event');
    expect(formLabelText).toContain('Donation');
    expect(formLabelText).toContain('Signature');

  });

})
