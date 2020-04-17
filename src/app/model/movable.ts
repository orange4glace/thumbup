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
  public get y() { return this.y_; }
  public get w() { return this.w_; }
  public get h() { return this.h_; }
  public get r() { return this.r_; }

  constructor() {
  }

}