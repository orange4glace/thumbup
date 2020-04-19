import { Component, ComponentFactoryResolver, Input, OnInit, Inject, Type, ViewChild, ViewContainerRef, AfterViewInit, ComponentFactory, Injector, OnDestroy, ComponentRef, EventEmitter, ElementRef } from '@angular/core';
import { ComponentPortal, Portal, TemplatePortal } from '@angular/cdk/portal';
import { Canvas, CanvasDrawingAddRemoveEvent, CanvasRemoveDrawingCommand, CanvasAddStackElementCommand } from 'src/app/model/canvas';
import { ICommandService, CanvasCommandService } from 'src/app/service/command.service';
import { Drawing } from 'src/app/model/drawing';
import { ImageDrawing } from 'src/app/model/image-drawing';
import { TextDrawing } from 'src/app/model/text-drawing';
import { TextDrawingComponent } from 'src/app/components/text-drawing/text-drawing.component';
import { ImageDrawingComponent } from 'src/app/components/image-drawing/image-drawing.component';
import { Subscription } from 'rxjs';
import { IDrawingComponent } from 'src/app/components/drawing/drawing.component';
import { MovableComponent } from 'src/app/components/movable/movable.component';
import { CanvasComponentService } from 'src/app/components/canvas/canvas.component.service';
import vec2 from 'src/app/util/vec2';
import hotkeys from 'hotkeys-js';

@Component({
  selector: 'canvas-component',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, OnDestroy, AfterViewInit {

  private subs_: Subscription[] = [];

  public readonly onDidChangeFocusedDrawing = new EventEmitter<IDrawingComponent>();
  public readonly onDidChangeCamera = new EventEmitter<void>();

  @Input()
  canvas: Canvas;

  @ViewChild('drawingContainer', {read: ViewContainerRef}) 
      drawingContainerRef_: ViewContainerRef;
  @ViewChild('container', {static:true})
      containerRef_: ElementRef<HTMLDivElement>;
  @ViewChild('canvas', {static:true})
      canvasRef_: ElementRef<HTMLDivElement>;

  public guiPortal: Portal<any>;

  private drawingComponents_: Array<IDrawingComponent> = [];
  public get drawingComponents(): ReadonlyArray<IDrawingComponent> {
    return this.drawingComponents_; }
  private drawingComponentRefs_: Array<ComponentRef<IDrawingComponent>> = [];

  private focusedDrawing_: IDrawingComponent = null;
  public get focusedDrawing() { return this.focusedDrawing_; }

  private lastMousePosition_: vec2;
  private cameraX_: number = 0;
  public get cameraX() { return this.cameraX_; }
  public set cameraX(v: number) {
    this.cameraX_ = v;
    this.onDidChangeCamera.emit();
  }
  private cameraY_: number = 0;
  public get cameraY() { return this.cameraY_; }
  public set cameraY(v: number) {
    this.cameraY_ = v;
    this.onDidChangeCamera.emit();
  }
  private cameraZoom_: number = 1;
  public get cameraZoom() { return this.cameraZoom_; }
  public set cameraZoom(v: number) {
    v = Math.min(3, Math.max(0.2, v));
    v *= 10;
    v = Math.round(v);
    v /= 10;
    this.cameraZoom_ = v;
    this.onDidChangeCamera.emit();
  }

  constructor(
    private readonly injector_: Injector,
    private readonly canvasComponentService_: CanvasComponentService,
    @Inject(ICommandService) private readonly commandService_: CanvasCommandService,
    private readonly componentFactoryResolver_: ComponentFactoryResolver) {
    this.canvasComponentService_.canvasComponent = this;
    this.moveCamera = this.moveCamera.bind(this);

    hotkeys('delete', () => {
      if (!this.focusedDrawing) return;
      this.commandService_.dispatch(
        new CanvasRemoveDrawingCommand(this.canvas, this.focusedDrawing.drawing));
      this.commandService_.dispatch(
        new CanvasAddStackElementCommand());
    })
  }
  
  ngOnDestroy() {
    this.subs_.forEach(sub => sub.unsubscribe());
  }

  ngOnInit() {
    this.commandService_.canvas = this.canvas;
  }

  ngAfterViewInit() {
    for (let i = 0; i < this.canvas.drawings.length; i ++) {
      const drawing = this.canvas.drawings[i];
      this.createDrawingComponent(drawing, i);
    }
    this.subs_.push(this.canvas.onDidAddDrawing.subscribe((e: CanvasDrawingAddRemoveEvent) => {
      this.createDrawingComponent(e.drawing, e.index);
    }));
    this.subs_.push(this.canvas.onDidReorderDrawing.subscribe(([i, j]) => {
      let tmp1 = this.drawingComponentRefs_[i];
      this.drawingComponentRefs_[i] = this.drawingComponentRefs_[j];
      this.drawingComponentRefs_[j] = tmp1;
      let tmp2 = this.drawingComponents[i];
      this.drawingComponents_[i] = this.drawingComponents_[j];
      this.drawingComponents_[j] = tmp2;
    }));
    this.subs_.push(this.canvas.onWillRemoveDrawing.subscribe((e: CanvasDrawingAddRemoveEvent) => {
      if (this.focusedDrawing_?.drawing == e.drawing) this.blurAll();
      this.drawingComponentRefs_.splice(e.index, 1)[0]!.destroy();
      this.drawingComponents_.splice(e.index, 1);
    }));

    this.containerRef_.nativeElement.addEventListener('mousewheel', (e: any) => {
      this.onMouseWheel(e);
    })
    this.containerRef_.nativeElement.addEventListener('DOMMouseScroll', (e: any) => {
      this.onMouseWheel(e);
    })
  }
  
  private createDrawingComponent(drawing: Drawing, index: number) {
    let factory: ComponentFactory<any>;
    switch (drawing.type) {
      case ImageDrawing.type:
        factory = this.componentFactoryResolver_.resolveComponentFactory(ImageDrawingComponent);
        break;
      case TextDrawing.type:
        factory = this.componentFactoryResolver_.resolveComponentFactory(TextDrawingComponent);
        break;
    }
    const componentRef = this.drawingContainerRef_.createComponent(
        factory, index, this.injector_);
    (componentRef.instance as any).drawing = drawing;
    this.drawingComponentRefs_.splice(index, 0, componentRef);
    this.drawingComponents_.splice(index, 0, componentRef.instance);
  }

  public focusDrawingComponent(drawingComponent: IDrawingComponent) {
    this.blurAll();
    const movableComponent = drawingComponent.movableComponent;
    movableComponent!.focus();
    this.focusedDrawing_ = drawingComponent;
    this.onDidChangeFocusedDrawing.emit(drawingComponent);
    this.guiPortal = new TemplatePortal(movableComponent.guiContent, movableComponent.viewContainerRef);
  }

  public blurAll() {
    for (let i = 0; i < this.drawingComponents_.length; i ++) {
      const drawing = this.drawingComponents_[i];
      drawing.movableComponent.blur();
    }
    this.guiPortal = null;
    this.focusedDrawing_ = null;
    this.onDidChangeFocusedDrawing.emit(null);
  }

  onMousedown(e: MouseEvent) {
    if (e.button == 0) {
      let element: HTMLElement | null = e.target as (HTMLElement | null);
      let movableId = 0;
      while (element instanceof HTMLElement) {
        if (element.tagName.toLowerCase() == 'movable') {
          movableId = +element.getAttribute('movable-id');
          break;
        }
        element = element.parentElement;
      }
      if (!movableId) {
        this.blurAll();
        return;
      }
      const drawingComponent = this.getDrawingComponentByMovableId(movableId);
      this.focusDrawingComponent(drawingComponent);
    }
    else if (e.button == 2) {
      e.preventDefault();
      this.lastMousePosition_ = new vec2([e.screenX, e.screenY]);
      window.addEventListener('mousemove', this.moveCamera);
      const mouseup = () => {
        window.removeEventListener('mousemove', this.moveCamera);
        window.removeEventListener('mouseup', mouseup);
      }
      window.addEventListener('mouseup', mouseup);
    }
  }

  onMouseWheel(e: WheelEvent) {
    const pos = new vec2([e.pageX, e.pageY]);
    const dvec2 = this.fromPageToCanvas(pos);
    const delta = e.deltaY | e.detail;
    const lastZoom = this.cameraZoom;
    if (delta < 0) {
      this.cameraZoom = this.cameraZoom + 0.1;
    }
    else {
      this.cameraZoom = this.cameraZoom - 0.1;
    }
    const dz = this.cameraZoom - lastZoom;
    const dx = dvec2.scale(dz);
    this.cameraX = this.cameraX - dx.x;
    this.cameraY = this.cameraY - dx.y;
  }

  private moveCamera(e: MouseEvent) {
    const position = new vec2([e.screenX, e.screenY]);
    position.subtract(this.lastMousePosition_);
    this.cameraX = this.cameraX + position.x;
    this.cameraY = this.cameraY + position.y;
    this.lastMousePosition_ = new vec2([e.screenX, e.screenY]);;
  }

  public fromPageToCanvas(vec: vec2) {
    const center = new vec2([
      this.containerRef_.nativeElement.offsetWidth / 2,
      this.containerRef_.nativeElement.offsetHeight / 2]);
    const cs = vec.copy();
    cs.subtract(center);
    cs.subtract(new vec2([this.cameraX, this.cameraY]));
    cs.scale(1 / this.cameraZoom);
    cs.x = Math.round(cs.x);
    cs.y = Math.round(cs.y);
    return cs;
  }

  public fromPageToCanvasScreen(vec: vec2) {
    const center = new vec2([
      this.containerRef_.nativeElement.offsetWidth / 2,
      this.containerRef_.nativeElement.offsetHeight / 2]);
    const cs = new vec2([vec.x, vec.y]);
    cs.subtract(center);
    return cs;
  }

  private getMovableComponentById(id: number): MovableComponent | null {
    for (let i = 0; i < this.drawingComponents_.length; i ++) {
      const drawing = this.drawingComponents_[i];
      const movable = drawing.drawing.movable;
      if (movable.id == id) return drawing.movableComponent;
    }
    return null;
  }

  private getDrawingComponentByMovableId(id: number): IDrawingComponent | null {
    for (let i = 0; i < this.drawingComponents_.length; i ++) {
      const drawing = this.drawingComponents_[i];
      const movable = drawing.drawing.movable;
      if (movable.id == id) return drawing;
    }
    return null;
  }

  private getDrawingComponentByDrawing(drawing: Drawing): IDrawingComponent | null {
    for (let i = 0; i < this.drawingComponents_.length; i ++) {
      const drawingComponent = this.drawingComponents_[i];
      if (drawingComponent.drawing === drawing) return drawingComponent;
    }
    return null;
  }

  public getContentStyle() {
    return {
      width: `${this.canvas.width}px`,
      height: `${this.canvas.height}px`
    }
  }

  public getCanvasStyle() {
    return {
      transform: `
        translateX(${this.cameraX_}px)
        translateY(${this.cameraY_}px)
        scale(${this.cameraZoom_})`
    }
  }

  public render(): string {
    const canvas = this.canvas;
    const cvs = document.createElement('canvas');
    const tmpCvs = document.createElement('canvas');
    const ctx = cvs.getContext('2d');
    const tmpCtx = tmpCvs.getContext('2d');
    cvs.width = this.canvas.width;
    cvs.height = this.canvas.height;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    for (let i = this.drawingComponents.length - 1; i >= 0; i --) {
      const drawingComponent = this.drawingComponents[i];
      const movable = drawingComponent.movableComponent.movable;
      tmpCvs.width = movable.w;
      tmpCvs.height = movable.h;
      drawingComponent.render(tmpCtx);

      // Blit
      ctx.save();
      ctx.translate(movable.x + canvas.width / 2, movable.y + canvas.height / 2);
      ctx.rotate(movable.rad);
      ctx.drawImage(tmpCvs, -movable.w / 2, -movable.h / 2);
      ctx.restore();
    }
    return cvs.toDataURL('image/png', 1.0);
  }

}