import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChange, SimpleChanges, ComponentRef, ComponentFactoryResolver, Injector, ViewChild, ViewContainerRef, Inject } from '@angular/core';
import { Drawing, DrawingChangeFilterCommand } from 'src/app/model/drawing';
import { Subscription } from 'rxjs';
import { FilterControlFactory } from 'src/app/components/control/filter/filter-control-factory';
import { DrawingControlFactory } from 'src/app/components/control/drawing/drawing-control-factory';
import { MatSelectChange } from '@angular/material/select';
import { GrayscaleDrawingFilter, IDrawingFilter, BlurDrawingFilter, ColorDrawingFilter } from 'src/app/model/drawing-filter';
import { ICommandService } from 'src/app/service/command.service';
import { CanvasAddStackElementCommand } from 'src/app/model/canvas';

@Component({
  selector: 'drawing-control',
  templateUrl: './drawing-control.component.html',
  styleUrls: ['./drawing-control.component.scss']
})
export class DrawingControlComponent implements OnDestroy, OnChanges {

  private subs_: Subscription[] = [];

  @Input() drawing: Drawing;
  @ViewChild('drawingControlContainer', {read: ViewContainerRef})
    drawingControlContainer_: ViewContainerRef;
  @ViewChild('filterControlContainer', {read: ViewContainerRef})
    filterControlContainer_: ViewContainerRef;

  private drawingControl_: ComponentRef<any>;
  private filterControl_: ComponentRef<any>;

  private filterType_: string;
  public get filterType() {
    return this.drawing?.filter?.type.toLowerCase();
  }
  onFilterChange(e: MatSelectChange) {
    const value = e.value;
    let filter: IDrawingFilter;
    switch (value) {
      case 'grayscale':
        filter = new GrayscaleDrawingFilter();
        break;
      case 'blur':
        filter = new BlurDrawingFilter();
        break;
      case 'color':
        filter = new ColorDrawingFilter();
        break;
    }
    this.commandService_.dispatch(
      new DrawingChangeFilterCommand(this.drawing, filter));
    this.commandService_.dispatch(
      new CanvasAddStackElementCommand());
  }

  constructor(
    private readonly injector_: Injector,
    private readonly componentFactoryResolver_: ComponentFactoryResolver,
    @Inject(ICommandService) private readonly commandService_: ICommandService) {

  }

  ngOnDestroy() {
    this.subs_.forEach(sub => sub.unsubscribe());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.drawing) {
      this.subs_.forEach(sub => sub.unsubscribe());
      this.subs_.length = 0;

      this.createDrawingControl();
      this.createFilterControl();
      if (!this.drawing) return;
      this.subs_.push(this.drawing.onDidChangeFilter.subscribe(() => {
        this.createFilterControl();
      }));
    }
  }

  private createDrawingControl() {
    if (this.drawingControl_) this.drawingControl_.destroy();
    const factory = new DrawingControlFactory(this.componentFactoryResolver_);
    const comp = factory.create(this.drawingControlContainer_, this.drawing, this.injector_);
    this.drawingControl_ = comp;
  }

  private createFilterControl() {
    if (this.filterControl_) this.filterControl_.destroy();
    if (!this.drawing) return;
    const factory = new FilterControlFactory(this.componentFactoryResolver_);
    const comp = factory.create(this.filterControlContainer_, this.drawing.filter, this.injector_);
    this.filterControl_ = comp;
  }

}