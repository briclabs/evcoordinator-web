import {ToolsMenuComponent} from "./tools-menu.component";
import {ComponentFixture, TestBed} from "@angular/core/testing";

describe('Tools Menu', () => {
  let fixture: ComponentFixture<ToolsMenuComponent>;
  let component: ToolsMenuComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToolsMenuComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolsMenuComponent);
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

    expect(linkText).toContain('Events');
    expect(linkText).toContain('Participants');
    expect(linkText).toContain('Payments');
    expect(linkText).toContain('History');

  });

})
