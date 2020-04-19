import { Component, Inject, Injector, ComponentFactoryResolver, ComponentRef, ComponentFactory, ViewChild, ViewContainerRef } from '@angular/core';
import { ICommandService } from 'src/app/service/command.service';
import { TextDrawing } from 'src/app/model/text-drawing';
import { CanvasService } from 'src/app/service/canvas.service';
import { CanvasAddDrawingCommand, CanvasResizeCommand, CanvasAddStackElementCommand } from 'src/app/model/canvas';
import { ImageDrawing } from 'src/app/model/image-drawing';
import { Subscription } from 'rxjs';
import { Movable } from 'src/app/model/movable';
import { CanvasComponentService } from 'src/app/components/canvas/canvas.component.service';
import { MovableComponent } from 'src/app/components/movable/movable.component';
import { IDrawingComponent } from 'src/app/components/drawing/drawing.component';
import { TextDrawingControlComponent } from 'src/app/components/control/text-drawing/text-drawing-control.component';
import { MatSliderChange } from '@angular/material/slider';

@Component({
  selector: 'control-pannel',
  templateUrl: './control-pannel.component.html',
  styleUrls: ['./control-pannel.component.scss']
})
export class ControlPannelComponent {

  private subs_: Subscription[] = [];

  @ViewChild('drawingControlContainer', {read: ViewContainerRef}) 
      drawingControlContainer_: ViewContainerRef;

  public canvasWidth: number;
  public canvasHeight: number;
  onChangeCanvasSize(w: number, h: number) {
    const canvas = this.canvasService_.canvas;
    const ww = (w === undefined ? canvas.width : w); 
    const hh = (h === undefined ? canvas.height : h); 
    this.commandService_.dispatch(
      new CanvasResizeCommand(canvas, ww, hh));
  }
  public canvasZoom: number;
  onChangeCanvasZoom(e: MatSliderChange) {
    this.canvasComponentService_.canvasComponent.cameraZoom = e.value;
  }

  public get canvas() {
    return this.canvasService_.canvas; }

  private focusedDrawing_: IDrawingComponent;
  public get focusedDrawing() { return this.focusedDrawing_; }
  private drawingControlComponent_: ComponentRef<any>;

  constructor(
    private readonly injector_: Injector,
    private readonly componentFactoryResolver_: ComponentFactoryResolver,
    private readonly canvasService_: CanvasService,
    private readonly canvasComponentService_: CanvasComponentService,
    @Inject(ICommandService) private readonly commandService_: ICommandService) {

    const canvas = canvasService_.canvas;
    const canvasComponent = canvasComponentService_.canvasComponent;
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
    this.subs_.push(canvas.onDidChangeSize.subscribe(() => {
      this.canvasWidth = canvas.width;
      this.canvasHeight = canvas.height;
    }));
    this.canvasZoom = canvasComponent.cameraZoom;
    this.subs_.push(canvasComponent.onDidChangeCamera.subscribe(() => {
      this.canvasZoom = canvasComponent.cameraZoom;
    }));
    this.focusedDrawing_ = canvasComponent.focusedDrawing;
    this.subs_.push(canvasComponent.onDidChangeFocusedDrawing.subscribe(drawingComponent => {
      this.updateFocusedDrawing(drawingComponent);
    }))

  }

  private updateFocusedDrawing(drawingComponent: IDrawingComponent) {
    this.focusedDrawing_ = drawingComponent;
    // if (this.drawingControlComponent_) {
    //   this.drawingControlComponent_.destroy();
    //   this.drawingControlComponent_ = null;
    // }
    // if (!drawingComponent) return;
    // let factory: ComponentFactory<any>;
    // switch (drawingComponent.drawing.type) {
    //   case ImageDrawing.type:
    //     break;
    //   case TextDrawing.type:
    //     factory = this.componentFactoryResolver_.resolveComponentFactory(TextDrawingControlComponent);
    //     break;
    // }
    // if (!factory) return;
    // const componentRef = this.drawingControlContainer_.createComponent(
    //   factory, undefined, this.injector_);
    // componentRef.instance.drawing = drawingComponent.drawing;
    // this.drawingControlComponent_ = componentRef;
  }

  addTextDrawing() {
    const drawing = new TextDrawing('Nanum Myeongjo', 30, 'Text');
    const canvas = this.canvasService_.canvas;
    this.commandService_.dispatch(
      new CanvasAddDrawingCommand(canvas, drawing));
    this.commandService_.dispatch(new CanvasAddStackElementCommand());
  }

  addImageDrawing(e: any) {
    const file: File = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      const image = new Image();
      image.src = reader.result as string;
      image.onload = () => {
        const imageDrawing = new ImageDrawing(image);
        this.commandService_.dispatch(
          new CanvasAddDrawingCommand(this.canvasService_.canvas, imageDrawing));
        this.commandService_.dispatch(new CanvasAddStackElementCommand());
      }
    })
    reader.readAsDataURL(file);
  }

}