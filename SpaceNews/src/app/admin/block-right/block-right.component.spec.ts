import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockRightComponent } from './block-right.component';

describe('BlockRightComponent', () => {
  let component: BlockRightComponent;
  let fixture: ComponentFixture<BlockRightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlockRightComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlockRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
