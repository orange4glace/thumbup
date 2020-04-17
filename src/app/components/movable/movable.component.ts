import { EventEmitter, Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import vec2 from 'src/app/util/vec2';
import mat2 from 'src/app/util/mat2';
import { Movable } from 'src/app/model/movable';
import vec4 from 'src/app/util/vec4';
import { Subscription } from 'rxjs';
import { debounceTime, throttleTime } from 'rxjs/operators';

@Component({
  selector: 'movable',
  templateUrl: './movable.component.html',
  styleUrls: ['movable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovableComponent implements OnInit, OnDestroy {

  @Input() movable: Movable;

  private subs_: Subscription[] = [];

  public thumbTL = new vec2();
  public thumbTR = new vec2();
  public thumbBL = new vec2();
  public thumbBR = new vec2();

  private srcMousePosition_: vec2;
  private srcMovableState: vec4;

  private rotationMat_: mat2;

  public readonly updateResizeUL = this.updateResize.bind(this, [1, 1, 0, 0]);
  public readonly updateResizeUR = this.updateResize.bind(this, [0, 1, 1, 0]);
  public readonly updateResizeBL = this.updateResize.bind(this, [1, 0, 0, 1]);
  public readonly updateResizeBR = this.updateResize.bind(this, [0, 0, 1, 1]);

  constructor(
    private readonly changeRef: ChangeDetectorRef) {
    this.updateTranslate = this.updateTranslate.bind(this);
  }

  ngOnInit() {
    this.updateRotation();
    this.update();

    this.subs_.push(this.movable.onDidChangeRotation.subscribe(() => {
      this.updateRotation();
    }));
    this.subs_.push(this.movable.onDidChange.pipe(
      throttleTime(16, undefined, {
        trailing: true
      })).subscribe(() => {
      this.update();
    }));
  }

  ngOnDestroy() {
    this.subs_.forEach(sub => sub.unsubscribe());
  }

  private updateRotation() {
    this.rotationMat_ = mat2.identity.rotate(Math.PI * this.movable.r / 180);
  }

  private update() {
    const [w, h] = [this.movable.w, this.movable.h];
    const rot = this.rotationMat_;
    const center = new vec2([this.movable.x, this.movable.y]);
   [[this.thumbTL,
      new vec2([-w / 2, -h / 2])],
    [this.thumbTR,
      new vec2([w / 2, -h / 2])],
    [this.thumbBL,
    new vec2([-w / 2, h / 2])],
    [this.thumbBR,
    new vec2([w / 2, h / 2])]].forEach(thumb => {
      const ct = thumb[1];
      const rot_ct = ct.multiplyMat2(rot);
      thumb[0].xy = rot_ct.xy;
    })
    this.changeRef.markForCheck();
  }

  public startTranslate(e: MouseEvent) {
    const movable = this.movable;
    this.srcMousePosition_ = new vec2([e.screenX, e.screenY]);
    this.srcMovableState = new vec4([
      movable.x, movable.y, movable.w, movable.h])
    window.addEventListener('mousemove', this.updateTranslate);
    const mouseup = () => {
      window.removeEventListener('mousemove', this.updateTranslate);
      window.removeEventListener('mouseup', mouseup);
    }
    window.addEventListener('mouseup', mouseup);
  }

  private updateTranslate(e: MouseEvent) {
    const movable = this.movable;
    const currentMosuePosition = new vec2([e.screenX, e.screenY]);
    const dp = currentMosuePosition.subtract(this.srcMousePosition_);
    movable.x = this.srcMovableState.x + dp.x;
    movable.y = this.srcMovableState.y + dp.y;
  }

  public startResize(e: MouseEvent, resizeFunc: any) {
    const movable = this.movable;
    this.srcMousePosition_ = new vec2([e.screenX, e.screenY]);
    this.srcMovableState = new vec4([
      movable.x, movable.y, movable.w, movable.h])
    window.addEventListener('mousemove', resizeFunc);
    const mouseup = () => {
      window.removeEventListener('mousemove', resizeFunc);
      window.removeEventListener('mouseup', mouseup);
    }
    window.addEventListener('mouseup', mouseup);
  }

  private updateResize(
      multiplier: [number, number, number, number],
      e: MouseEvent) {
    const movable = this.movable;
    const src = this.srcMovableState;
    const currentMosuePosition = new vec2([e.screenX, e.screenY]);
    const dp = currentMosuePosition.subtract(this.srcMousePosition_);
    const rot_dp = dp.multiplyMat2(this.rotationMat_);

    const newUL = new vec2([
      src.x - src.z / 2 + rot_dp.x * multiplier[0],
      src.y - src.w / 2 + rot_dp.y * multiplier[1]])
    const newBR = new vec2([
      src.x + src.z / 2 + rot_dp.x * multiplier[2],
      src.y + src.w / 2 + rot_dp.y * multiplier[3]]);
    const newCenter = new vec2([newUL.x, newUL.y]);
    newCenter.add(newBR).multiply(new vec2([0.5, 0.5]));
    const newSize = newBR.subtract(newUL);
    movable.x = newCenter.x;
    movable.y = newCenter.y;
    movable.w = newSize.x;
    movable.h = newSize.y
  }

  public getCenterStyle() {
    return {
      transform: `translateX(${this.movable.x}px) translateY(${this.movable.y}px)`
    }
  }

  public getBoxStyle() {
    return {
      width: `${this.movable.w}px`,
      height: `${this.movable.h}px`,
      transform: `
        translateX(${-this.movable.w / 2}px)
        translateY(${-this.movable.h / 2}px)
        rotate(${this.movable.r}deg)`
    }
  }

  public getThumbStyle(thumb: vec2) {
    return {
      transform: `translateX(${thumb.x}px) translateY(${thumb.y}px)`
    }
  }

}