import { Movable } from 'src/app/model/movable';
import { IDrawingFilter } from 'src/app/model/drawing-filter';
import { EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { ICommand } from 'src/app/model/command';

let __next_id = 0;

export interface IDrawing {

  readonly id: number;
  readonly type: string;
  name: string;
  readonly movable: Movable;
  filter: IDrawingFilter;

}

export class DrawingChangeFilterCommand implements ICommand {
  constructor(public readonly drawing: Drawing,
      public readonly filter: IDrawingFilter) {}

  public execute(): ICommand {
    const prev = this.drawing.filter;
    const inverse = new DrawingChangeFilterCommand(this.drawing,
        prev);
    this.drawing.filter = this.filter;
    return inverse;
  }
}

export abstract class Drawing implements IDrawing {

  public readonly id: number;

  public readonly onDidDirty = new EventEmitter<void>();
  public readonly onDidChangeFilter = new EventEmitter<void>();

  private filterSub_: Subscription;

  public abstract get movable(): Movable;

  private filter_: IDrawingFilter;
  public get filter() { return this.filter_; }
  public set filter(filter: IDrawingFilter) {
    this.filterSub_ && this.filterSub_.unsubscribe();
    this.filter_ = filter;
    if (filter) {
      this.filterSub_ = this.filter_.onUpdate.subscribe(() => {
        this.onDidDirty.emit(); })
    }
    this.onDidChangeFilter.emit();
    this.onDidDirty.emit();
  }

  constructor(
    public readonly type: string,
    public name: string) {
    this.id = ++__next_id;
  }

  public dispose() {
    this.filterSub_ && this.filterSub_.unsubscribe();
  }

}