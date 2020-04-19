import { Component, Input, OnInit, OnDestroy, Inject } from '@angular/core';
import { IDrawingFilter, ColorDrawingFilter, ColorDawingFilterChangeCommand } from 'src/app/model/drawing-filter';
import { Subscription } from 'rxjs';
import { ICommandService } from 'src/app/service/command.service';
import { CanvasAddStackElementCommand } from 'src/app/model/canvas';

@Component({
  selector: 'color-filter-control',
  templateUrl: './color-filter-control.html',
  styleUrls: ['./color-filter-control.scss']
})
export class ColorFilterControlComponent implements OnInit, OnDestroy {

  private sub_: Subscription;

  @Input() filter: ColorDrawingFilter;

  public r: number;
  public g: number;
  public b: number;
  public o: number;

  constructor(
    @Inject(ICommandService) private readonly commandService_: ICommandService) {

  }

  onInput(r: number, g: number, b: number, o: number) {
    r = (r === undefined ? this.filter.r : r);
    g = (g === undefined ? this.filter.g : g);
    b = (b === undefined ? this.filter.b : b);
    o = (o === undefined ? this.filter.o : o);
    this.commandService_.dispatch(
      new ColorDawingFilterChangeCommand(this.filter,
        r, g, b, o));
  }

  onChange() {
    console.log('change');
    this.commandService_.dispatch(
      new CanvasAddStackElementCommand());
  }

  ngOnInit() {
    this.r = this.filter.r;
    this.g = this.filter.g;
    this.b = this.filter.b;
    this.o = this.filter.o;
    this.sub_ = this.filter.onUpdate.subscribe(() => {
      this.r = this.filter.r;
      this.g = this.filter.g;
      this.b = this.filter.b;
      this.o = this.filter.o;
    })
  }

  ngOnDestroy() {
    this.sub_.unsubscribe();
  }

}