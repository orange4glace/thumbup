import { Drawing } from 'src/app/model/drawing';
import { ICommand } from 'src/app/model/command';
import { EditStack } from 'src/app/model/edit-stack';
import { EventEmitter } from '@angular/core';

export abstract class CanvasCommand implements ICommand {
  canvas: Canvas;
  public abstract execute(): ICommand;
}

export class CanvasAddStackElementCommand extends CanvasCommand {
  public execute(): ICommand {
    this.canvas.editStack.pushStackElement();
    return null;
  }
}

export class CanvasAddDrawingCommand implements ICommand {
  constructor(public readonly canvas: Canvas,
    public readonly drawing: Drawing, public readonly index?: number) {}

  public execute(): ICommand {
    this.canvas.addDrawing(this.drawing);
    return new CanvasRemoveDrawingCommand(this.canvas, this.drawing);
  }

}

export class CanvasResizeCommand implements ICommand {
  constructor(public readonly canvas: Canvas,
    public readonly w: number, public readonly h: number) {}

  public execute(): ICommand {
    const canvas = this.canvas;
    const inverse = new CanvasResizeCommand(
      canvas, canvas.width, canvas.height);
    canvas.width = this.w;
    canvas.height = this.h;
    return inverse;
  }

}

export class CanvasRemoveDrawingCommand implements ICommand {
  constructor(public readonly canvas: Canvas,
    public readonly drawing: Drawing) {}

  public execute(): ICommand {
    if (!this.canvas.hasDrawing(this.drawing)) return;
    const index = this.canvas.getDrawingIndex(this.drawing);
    const inverse = new CanvasAddDrawingCommand(
      this.canvas, this.drawing, index);
    this.canvas.removeDrawing(this.drawing);
    return inverse;
  }
}

export class CanvasReorderCommand implements ICommand {
  constructor(public readonly canvas: Canvas,
    public readonly i: number, public readonly j: number) {}

  public execute(): ICommand {
    const canvas = this.canvas;
    const ii = canvas.drawings[this.i];
    const jj = canvas.drawings[this.j];
    if (!ii || !jj) return;
    const inverse = new CanvasReorderCommand(
      canvas, this.i, this.j);
    canvas.swapDrawing(this.i, this.j);
    return inverse;
  }

}

export interface CanvasDrawingAddRemoveEvent {
  readonly drawing: Drawing;
  readonly index: number;
}

export class Canvas {

  public readonly onDidAddDrawing = new EventEmitter<CanvasDrawingAddRemoveEvent>();
  public readonly onWillRemoveDrawing = new EventEmitter<CanvasDrawingAddRemoveEvent>();
  public readonly onDidChangeSize = new EventEmitter<void>();
  public readonly onDidReorderDrawing = new EventEmitter<[number, number]>();

  private editStack_: EditStack = new EditStack();
  public get editStack() { return this.editStack_; }

  private drawings_: Array<Drawing> = [];
  public get drawings(): ReadonlyArray<Drawing> {
    return this.drawings_; }

  private width_: number = 500;
  public get width() { return this.width_;}
  public set width(v: number) {
    if (isNaN(v)) {
      this.onDidChangeSize.emit();
      return;
    }
    this.width_ = v;
    this.onDidChangeSize.emit();
  }
  private height_: number = 500;
  public get height() { return this.height_; }
  public set height(v: number) {
    if (isNaN(v)) {
      this.onDidChangeSize.emit();
      return;
    }
    this.height_ = v;
    this.onDidChangeSize.emit();
  }

  constructor() {

  }

  public getDrawingIndex(drawing: Drawing) {
    return this.drawings_.indexOf(drawing);
  }

  public swapDrawing(i: number, j: number) {
    const tmp = this.drawings_[i];
    this.drawings_[i] = this.drawings_[j];
    this.drawings_[j] = tmp;
    this.reorder();
    this.onDidReorderDrawing.emit([i, j]);
  }

  public hasDrawing(drawing: Drawing) {
    return this.drawings.indexOf(drawing) != -1;
  }

  public addDrawing(drawing: Drawing, index?: number) {
    index = index || 0;
    this.drawings_.splice(index || 0, 0, drawing);
    this.reorder();
    this.onDidAddDrawing.emit({
      drawing: drawing,
      index: index
    });
  }

  public removeDrawing(drawing: Drawing) {
    this.onWillRemoveDrawing.emit({
      drawing: drawing,
      index: this.getDrawingIndex(drawing)
    });
    this.reorder();
    this.drawings_.splice(this.drawings_.indexOf(drawing), 1);
  }

  public pushCommand(command: ICommand) {
    this.editStack_.pushEditCommand(command);
  }

  private reorder() {
    let z = this.drawings_.length - 1;
    for (let i = 0; i < this.drawings_.length; i ++) {
      const drawing = this.drawings_[i];
      drawing.movable.z = z--;
    }
  }

}