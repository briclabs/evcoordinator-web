import {ComponentFixture, TestBed} from "@angular/core/testing";
import {HeaderComponent} from "./header.component";

describe('Header', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let component: HeaderComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should contain the expected links', () => {
    const menuEntries: HTMLElement[] = fixture.nativeElement.querySelectorAll('a');

    expect(menuEntries.length).toEqual(4);

    let linkText: Array<string> = new Array<string>(4);

    menuEntries.forEach(link => {
      linkText.push(link.innerText);
    })

    expect(linkText).toContain('');
    expect(linkText).toContain('Guidelines');
    expect(linkText).toContain('Registration');
    expect(linkText).toContain('Donations');

  });

  it('should include the coordinator tools submenu', () => {
    const submenuElement: HTMLElement = fixture.nativeElement.querySelector('button');

    expect(submenuElement.innerText).toEqual('Coordinator Tools'.concat(String.fromCharCode(160)));
  });

  it('should show the coordinator tools submenu icon', () => {
    const submenuButton: HTMLElement = fixture.nativeElement.querySelector('button');

    expect(submenuButton).toBeTruthy();

    const submenuIcon: HTMLSpanElement | null = submenuButton.querySelector('span');
    expect(submenuIcon).toBeTruthy();
    expect(submenuIcon?.classList).toContain('navbar-toggler-icon');
  });

})
