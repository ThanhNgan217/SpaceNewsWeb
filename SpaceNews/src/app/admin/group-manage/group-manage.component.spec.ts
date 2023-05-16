import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupManageComponent } from './group-manage.component';

describe('GroupManageComponent', () => {
  let component: GroupManageComponent;
  let fixture: ComponentFixture<GroupManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupManageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
