import { Component, Input, Inject } from '@angular/core';
import { Canvas, CanvasReorderCommand, CanvasRemoveDrawingCommand, CanvasAddStackElementCommand } from 'src/app/model/canvas';
import { Drawing } from 'src/app/model/drawing';
import { CanvasComponentService } from 'src/app/components/canvas/canvas.component.service';
import { IDrawingComponent } from 'src/app/components/drawing/drawing.component';
import { ICommandService } from 'src/app/service/command.service';

@Component({
  selector: 'layer-control',
  templateUrl: './layer-control.component.html',
  styleUrls: ['./layer-control.component.scss']
})
export class LayerControlComponent {

  public get canvas() {
    return this.canvasComponentService_.canvasComponent;
  }

  public get focusedDrawing() {
    return this.canvas.focusedDrawing?.drawing;
  }

  public get drawingComponents(): ReadonlyArray<IDrawingComponent> {
    return this.canvas.drawingComponents;
  }

  constructor(
    private readonly canvasComponentService_: CanvasComponentService,
    @Inject(ICommandService) private readonly commandService_: ICommandService) {
    
  }

  onItemClick(drawingComponent: IDrawingComponent) {
    this.canvas.focusDrawingComponent(drawingComponent);
  }

  trackFunc(index: number, comp: IDrawingComponent) {
    return comp.drawing.id;
  }

  onMoveUpClick() {
    if (!this.focusedDrawing) return;
    const index = this.canvas.canvas.getDrawingIndex(this.focusedDrawing);
    this.commandService_.dispatch(
      new CanvasReorderCommand(this.canvas.canvas, index, index - 1));
    this.commandService_.dispatch(
      new CanvasAddStackElementCommand());
  }

  onMoveDownClick() {
    if (!this.focusedDrawing) return;
    const index = this.canvas.canvas.getDrawingIndex(this.focusedDrawing);
    this.commandService_.dispatch(
      new CanvasReorderCommand(this.canvas.canvas, index, index + 1));
    this.commandService_.dispatch(
      new CanvasAddStackElementCommand());
  }

  onRemoveClick() {
    if (!this.focusedDrawing) return;
    this.commandService_.dispatch(
      new CanvasRemoveDrawingCommand(this.canvas.canvas, this.focusedDrawing));
    this.commandService_.dispatch(
      new CanvasAddStackElementCommand());
  }

  onSaveClick() {
      let image = this.canvasComponentService_.canvasComponent.render();
      image = image.replace('image/png', 'image/octet-stream');
      var link = document.getElementById('link');
      link.setAttribute('download', 'thumbnail.png');
      link.setAttribute('href', image);
      link.click();
  }

}