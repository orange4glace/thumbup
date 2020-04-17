import { EventEmitter } from '@angular/core';

export class Movable {

  public readonly onDidChange = new EventEmitter<void>();
  public readonly onDidChangePosition = new EventEmitter<void>();
  public readonly onDidChangeSize = new EventEmitter<void>();
  public readonly onDidChangeRotation = new EventEmitter<void>();

  private x_: number = 500;
  private y_: number = 500;
  private w_: number = 100;
  private h_: number = 50;
  private r_: number = 0;

  public get x() { return this.x_; }
  public set x(v: number) {
    this.x_ = v;
    this.onDidChangePosition.emit();
    this.onDidChange.emit();
  }
  public get y() { return this.y_; }
  public set y(v: number) {
    this.y_ = v;
    this.onDidChangePosition.emit();
    this.onDidChange.emit();
  }
  public get w() { return this.w_; }
  public set w(v: number) {
    this.w_ = v;
    this.onDidChangeSize.emit();
    this.onDidChange.emit();
  }
  public get h() { return this.h_; }
  public set h(v: number) {
    this.h_ = v;
    this.onDidChangeSize.emit();
    this.onDidChange.emit();
  }
  public get r() { return this.r_; }
  public set r(v: number) {
    this.r_ = v;
    this.onDidChangeRotation.emit();
    this.onDidChange.emit();
  }

  constructor() {
  }

}