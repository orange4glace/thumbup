import { Component, Input, OnInit, OnDestroy, Inject } from '@angular/core';
import { ImageDrawing, ImageDrawingChangeInvertCommand } from 'src/app/model/image-drawing';
import { Subscription } from 'rxjs';
import { ICommandService } from 'src/app/service/command.service';
import { CanvasAddStackElementCommand } from 'src/app/model/canvas';

@Component({
  selector: 'image-drawing-control',
  templateUrl: './image-drawing-control.component.html',
  // styleUrls: ['./image-drawing-control.component.scss']
})
export class ImageDrawingControlComponent implements OnInit, OnDestroy {

  private subs_: Subscription[] = [];

  @Input() drawing: ImageDrawing;

  public invertX;
  public invertY;
  onChangeInvert(x: boolean, y: boolean) {
    x = (x === undefined ? this.drawing.invertX : x);
    y = (y === undefined ? this.drawing.invertY : y);
    this.commandService_.dispatch(
      new ImageDrawingChangeInvertCommand(this.drawing, x, y));
    this.commandService_.dispatch(
      new CanvasAddStackElementCommand());
  }

  constructor(
    @Inject(ICommandService) private readonly commandService_: ICommandService) {
    
  }

  ngOnInit() {
    this.invertX = this.drawing.invertX;
    this.invertY = this.drawing.invertY;
    this.subs_.push(this.drawing.onDidDirty.subscribe(() => {
      this.invertX = this.drawing.invertX;
      this.invertY = this.drawing.invertY;
    }));
  }

  ngOnDestroy() {
    this.subs_.forEach(sub => sub.unsubscribe())
  }

}