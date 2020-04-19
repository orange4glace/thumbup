import { EventEmitter } from '@angular/core';
import { ICommand } from 'src/app/model/command';

export class MovableResizeCommand implements ICommand {
  constructor(public readonly movable: Movable,
    public readonly w: number, public readonly h: number) {}

  execute(): ICommand {
    const movable = this.movable;
    const inverse = new MovableResizeCommand(
      movable, movable.w, movable.h);
    movable.w = this.w;
    movable.h = this.h;
    return inverse;
  }

}

export class MovableTranslateCommand implements ICommand {
constructor(public readonly movable: Movable,
    public readonly x: number, public readonly y: number) {}

  execute(): ICommand {
    const movable = this.movable;
    const inverse = new MovableTranslateCommand(
      movable, movable.x, movable.y);
    movable.x = this.x;
    movable.y = this.y;
    return inverse;
  }

}

export class MovableRotateCommand implements ICommand {
  constructor(public readonly movable: Movable,
    public readonly r: number) {}

  execute(): ICommand {
    const movable = this.movable;
    const inverse = new MovableRotateCommand(
      movable, movable.r);
    movable.r = this.r;
    return inverse;
  }

}

let __next_movable_id = 0;

export class Movable {

  public readonly id = ++__next_movable_id;

  public readonly onDidChange = new EventEmitter<void>();
  public readonly onDidChangePosition = new EventEmitter<void>();
  public readonly onDidChangeSize = new EventEmitter<void>();
  public readonly onDidChangeRotation = new EventEmitter<void>();

  private x_: number = 0;
  private y_: number = 0;
  private z_: number = 0;
  private w_: number = 100;
  private h_: number = 50;
  private r_: number = 0;
  private rad_: number = 0;

  private aspect_: boolean = true;
  public get aspect() { return this.aspect_; }
  public set aspect(v: boolean) {
    this.aspect_ = v;
    this.onDidChange.emit();
  }
  private aspectRatio_: number = 1;


  public get x() { return this.x_; }
  public set x(v: number) {
    if (isNaN(v)) {
      this.onDidChangePosition.emit();
      this.onDidChange.emit();
      return;
    }
    v = Math.round(v);
    this.x_ = v;
    this.onDidChangePosition.emit();
    this.onDidChange.emit();
  }
  public get z() { return this.z_; }
  public set z(v: number) {
    if (isNaN(v)) {
      this.onDidChangePosition.emit();
      this.onDidChange.emit();
      return;
    }
    this.z_ = v;
    this.onDidChangePosition.emit();
    this.onDidChange.emit();
  }
  public get y() { return this.y_; }
  public set y(v: number) {
    if (isNaN(v)) {
      this.onDidChangePosition.emit();
      this.onDidChange.emit();
      return;
    }
    v = Math.round(v);
    this.y_ = v;
    this.onDidChangePosition.emit();
    this.onDidChange.emit();
  }
  public get w() { return this.w_; }
  public set w(v: number) {
    if (isNaN(v)) {
      this.onDidChangeSize.emit();
      this.onDidChange.emit();
      return;
    }
    v = Math.round(v);
    this.w_ = v;
    this.onDidChangeSize.emit();
    this.onDidChange.emit();
  }
  public get h() { return this.h_; }
  public set h(v: number) {
    if (isNaN(v)) {
      this.onDidChangeSize.emit();
      this.onDidChange.emit();
      return;
    }
    v = Math.round(v);
    this.h_ = v;
    this.onDidChangeSize.emit();
    this.onDidChange.emit();
  }
  public get r() { return this.r_; }
  public set r(v: number) {
    if (isNaN(v)) {
      this.onDidChangeRotation.emit();
      this.onDidChange.emit();
      return;
    }
    v = Math.round(v);
    this.r_ = v;
    this.rad_ = v / 180 * Math.PI;
    this.onDidChangeRotation.emit();
    this.onDidChange.emit();
  }
  public get rad() { return this.rad_; }

  constructor() {
  }

}