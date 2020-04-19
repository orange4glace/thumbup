import { Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, Inject, Optional, HostBinding, ViewChild, TemplateRef, ViewContainerRef, EventEmitter } from '@angular/core';
import vec2 from 'src/app/util/vec2';
import mat2 from 'src/app/util/mat2';
import { Movable, MovableTranslateCommand, MovableResizeCommand, MovableRotateCommand } from 'src/app/model/movable';
import vec4 from 'src/app/util/vec4';
import { Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { ICommandService } from 'src/app/service/command.service';
import { CanvasAddStackElementCommand } from 'src/app/model/canvas';
import { CanvasComponentService } from 'src/app/components/canvas/canvas.component.service';

@Component({
  selector: 'movable',
  templateUrl: './movable.component.html',
  styleUrls: ['movable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovableComponent implements OnInit, OnDestroy {

  public readonly onDidUpdate = new EventEmitter<void>();

  @Input() movable: Movable;
  @Input() focused: boolean = false;

  @ViewChild('gui') guiContent: TemplateRef<any>;

  @HostBinding('attr.movable-id')
  public get id() { return this.movable.id; }

  private subs_: Subscription[] = [];

  public centerVec = new vec2();
  public sizeVec = new vec2();
  public thumbTL = new vec2();
  public thumbTR = new vec2();
  public thumbBL = new vec2();
  public thumbBR = new vec2();
  public thumbBC = new vec2();
  public thumbCR = new vec2();

  private srcMousePosition_: vec2;
  private srcMovableState_: vec4;
  private srcMovableRotate_: number;

  private srcRotationMat_: mat2;
  private srcRrotationMat_: mat2;

  public readonly updateResizeUL = this.updateResize.bind(this, [1, 1, 0, 0]);
  public readonly updateResizeUR = this.updateResize.bind(this, [0, 1, 1, 0]);
  public readonly updateResizeBL = this.updateResize.bind(this, [1, 0, 0, 1]);
  public readonly updateResizeBR = this.updateResize.bind(this, [0, 0, 1, 1]);

  constructor(
    public readonly viewContainerRef: ViewContainerRef,
    private readonly changeRef: ChangeDetectorRef,
    private readonly canvasComponentService_: CanvasComponentService,
    @Inject(ICommandService) private readonly commandService_: ICommandService) {
    this.updateTranslate = this.updateTranslate.bind(this);
    this.updateRotate = this.updateRotate.bind(this);
  }

  ngOnInit() {
    this.update();
    this.subs_.push(this.movable.onDidChange.pipe(
      throttleTime(16, undefined, {trailing: true})).subscribe(() => {
      this.update();
    }));
    this.subs_.push(this.canvasComponentService_.canvasComponent.onDidChangeCamera.pipe(
      throttleTime(16, undefined, {trailing: true})).subscribe(() => {
      this.update();
    }));
  }

  ngOnDestroy() {
    this.subs_.forEach(sub => sub.unsubscribe());
  }

  private saveSrcRotation() {
    this.srcRotationMat_ = mat2.rotation(this.movable.rad);
    this.srcRrotationMat_ = mat2.rotation(-1 * this.movable.rad);
  }

  private update() {
    if (!this.focused) {
      this.onDidUpdate.emit();
      this.changeRef.markForCheck();
      return;
    }
    const canvas = this.canvasComponentService_.canvasComponent;
    const zoom = canvas.cameraZoom;
    const [w, h] = [this.movable.w, this.movable.h];
    const center = new vec2([this.movable.x, this.movable.y]);
    const zoomVec = new vec2([zoom, zoom]);
    const translate = new vec2([canvas.cameraX, canvas.cameraY]);
    center.multiply(zoomVec);
    this.centerVec.xy = [center.x, center.y];
    this.centerVec.add(translate);
    this.sizeVec = new vec2([this.movable.w, this.movable.h]);
    this.sizeVec.multiply(zoomVec);
    // translate.multiply(new vec2([zoom, zoom]));
   [[this.thumbTL,
      new vec2([-w / 2, -h / 2])],
    [this.thumbTR,
      new vec2([w / 2, -h / 2])],
    [this.thumbBL,
    new vec2([-w / 2, h / 2])],
    [this.thumbBR,
    new vec2([w / 2, h / 2])],
    [this.thumbBC,
    new vec2([0, h / 2])],
    [this.thumbCR,
    new vec2([0, h / 2 + 30])]].forEach(thumb => {
      const ct = thumb[1];
      ct.multiply(new vec2([zoom, zoom]));
      // ct.add(center);
      // ct.add(translate);
      // const rot_ct = ct.multiplyMat2(rot);
      thumb[0].xy = ct.xy;
    })
    this.onDidUpdate.emit();
    this.changeRef.markForCheck();
  }

  public startTranslate(e: MouseEvent, stopProp: boolean = false) {
    if (e.button != 0) return;
    if (stopProp) e.stopPropagation();
    const movable = this.movable;
    this.srcMousePosition_ = new vec2([e.screenX, e.screenY]);
    this.srcMovableState_ = new vec4([
      movable.x, movable.y, movable.w, movable.h])
    window.addEventListener('mousemove', this.updateTranslate);
    const mouseup = () => {
      this.commandService_.dispatch(
        new CanvasAddStackElementCommand());
      window.removeEventListener('mousemove', this.updateTranslate);
      window.removeEventListener('mouseup', mouseup);
    }
    window.addEventListener('mouseup', mouseup);
  }

  private updateTranslate(e: MouseEvent) {
    const movable = this.movable;
    const currentMosuePosition = new vec2([e.screenX, e.screenY]);
    const dp = currentMosuePosition.subtract(this.srcMousePosition_);
    const zoom = 1 / this.canvasComponentService_.canvasComponent.cameraZoom;
    dp.multiply(new vec2([zoom, zoom]));
    const nx = this.srcMovableState_.x + dp.x;
    const ny = this.srcMovableState_.y + dp.y;

    const command = new MovableTranslateCommand(movable, nx, ny);
    this.commandService_.dispatch(command);
  }

  public startResize(e: MouseEvent, resizeFunc: any) {
    if (e.button != 0) return;
    e.stopPropagation();
    const movable = this.movable;
    this.srcMousePosition_ = new vec2([e.screenX, e.screenY]);
    this.srcMovableState_ = new vec4([
      movable.x, movable.y, movable.w, movable.h])
    this.srcMovableRotate_ = movable.r;
    this.saveSrcRotation();
    window.addEventListener('mousemove', resizeFunc);
    const mouseup = () => {
      this.commandService_.dispatch(
        new CanvasAddStackElementCommand());
      window.removeEventListener('mousemove', resizeFunc);
      window.removeEventListener('mouseup', mouseup);
    }
    window.addEventListener('mouseup', mouseup);
  }

  private updateResize(
      multiplier: [number, number, number, number],
      e: MouseEvent) {
    e.stopPropagation();
    const movable = this.movable;
    const src = this.srcMovableState_;
    const currentMosuePosition = new vec2([e.screenX, e.screenY]);
    const dp = currentMosuePosition.subtract(this.srcMousePosition_);
    const local_dp = new vec2([dp.x, dp.y]);
    local_dp.multiplyMat2(this.srcRrotationMat_);
    const zoom = 1 / this.canvasComponentService_.canvasComponent.cameraZoom;
    local_dp.multiply(new vec2([zoom, zoom]));

    if (movable.aspect) { 
      const projection = new vec2([
        -src.z * multiplier[0] + src.z * multiplier[2],
        -src.w * multiplier[1] + src.w * multiplier[3]]).normalize();
      projection.scale(vec2.dot(projection, local_dp), local_dp);
    }

    const newLocalUL = new vec2([
      - src.z / 2 + local_dp.x * multiplier[0],
      - src.w / 2 + local_dp.y * multiplier[1]])
    const newLocalBR = new vec2([
      src.z / 2 + local_dp.x * multiplier[2],
      src.w / 2 + local_dp.y * multiplier[3]]);
    const newLocalCenter =  newLocalUL.copy();
    newLocalCenter.add(newLocalBR).multiply(new vec2([0.5, 0.5]));
    const newCenter = newLocalCenter.copy();
    newCenter.multiplyMat2(this.srcRotationMat_);
    newCenter.add(new vec2([src.x, src.y]));
    const newUL = newLocalUL.copy();
    const newBR = newLocalBR.copy();
    newUL.multiplyMat2(this.srcRotationMat_).add(newCenter);
    newBR.multiplyMat2(this.srcRotationMat_).add(newCenter);
    const newSize = newLocalBR.subtract(newLocalUL);

    const nx = newCenter.x;
    const ny = newCenter.y;
    const nw = Math.abs(newSize.x);
    const nh = Math.abs(newSize.y);
    const nr = (newSize.x >= 0 && newSize.y >= 0) ? 
      this.srcMovableRotate_ :
      (this.srcMovableRotate_ + 180 + 360) % 360;

    console.log(newSize.x, newSize.y);

    this.commandService_.dispatch(
        new MovableTranslateCommand(movable, nx, ny));
    this.commandService_.dispatch(
        new MovableResizeCommand(movable, nw, nh));
    this.commandService_.dispatch(
        new MovableRotateCommand(movable, nr));
  }

  startRotate(e: MouseEvent) {
    if (e.button != 0) return;
    e.stopPropagation();
    const movable = this.movable;
    this.srcMousePosition_ = new vec2([e.pageX, e.pageY]);
    this.srcMovableState_ = new vec4([
      movable.x, movable.y, movable.w, movable.h])
    this.srcMovableRotate_ = movable.r;
    this.saveSrcRotation();
    window.addEventListener('mousemove', this.updateRotate);
    const mouseup = () => {
      this.commandService_.dispatch(
        new CanvasAddStackElementCommand());
      window.removeEventListener('mousemove', this.updateRotate);
      window.removeEventListener('mouseup', mouseup);
    }
    window.addEventListener('mouseup', mouseup);
  }

  private updateRotate(e: MouseEvent) {
    e.stopPropagation();
    const movable = this.movable;
    const currentMosuePosition = new vec2([e.pageX, e.pageY]);
    const dp = this.canvasComponentService_.
        canvasComponent.fromPageToCanvasScreen(currentMosuePosition)
    dp.subtract(this.centerVec);
    const rad = Math.atan2(dp.y, dp.x);
    const deg = ((rad / Math.PI * 180 - 90) + 360) % 360

    this.commandService_.dispatch(
        new MovableRotateCommand(movable, deg));
  }

  public focus() {
    this.focused = true;
    this.update();
    this.changeRef.markForCheck();
  }

  public blur() {
    this.focused = false;
    this.update();
    this.changeRef.markForCheck();
  }

  public getCenterStyle() {
    return {
      'z-index': this.movable.z,
      transform: `
        translateX(${this.movable.x}px)
        translateY(${this.movable.y}px)`
    }
  }

  public getThumbCenterStyle() {
    return {
      transform: `
        translateX(${this.centerVec.x}px)
        translateY(${this.centerVec.y}px)
        rotate(${this.movable.r}deg)`
    }
  }

  public getThumbContentStyle() {
    return {
      width: `${this.sizeVec.x}px`,
      height: `${this.sizeVec.y}px`,
      transform: `
        translateX(${-this.sizeVec.x / 2}px)
        translateY(${-this.sizeVec.y / 2}px)`
    }
  }

  public getBoxStyle() {
    return {
      width: `${Math.abs(this.movable.w)}px`,
      height: `${Math.abs(this.movable.h)}px`,
      transform: `
        translateX(${-Math.abs(this.movable.w) / 2}px)
        translateY(${-Math.abs(this.movable.h) / 2}px)
        rotate(${this.movable.r}deg)`
    }
  }

  public getGUIStyle() {
    return {
      transform: `
        translateX(${this.movable.x}px)
        translateY(${this.movable.y}px)`
    }
  }

  public getThumbStyle(thumb: vec2) {
    return {
      transform: `translateX(${thumb.x}px) translateY(${thumb.y}px)`
    }
  }

  public getLineStyle(from: vec2, to: vec2) {
    const sub = new vec2([to.x, to.y]);
    sub.subtract(from);
    const angle = Math.atan2(sub.y, sub.x) / Math.PI * 180;
    return {
      width: `${sub.length()}px`,
      transform: `translateX(${from.x + 0.5}px) translateY(${from.y}px) rotate(${angle}deg)`
    }
  }

}