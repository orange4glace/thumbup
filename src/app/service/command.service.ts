import { ICommand } from 'src/app/model/command';
import { Canvas } from 'src/app/model/canvas';
import { InjectionToken, Injectable } from '@angular/core';

import hotkeys from 'hotkeys-js';

// const hotkeys: any = require('hotkeys-js');

export interface ICommandService {

  dispatch(command: ICommand): void;

}

@Injectable()
export class CanvasCommandService implements ICommandService {

  public canvas: Canvas;

  constructor() {
    hotkeys('ctrl+z', () => {
      this.canvas.editStack.undo();
    })
    hotkeys('ctrl+y', () => {
      this.canvas.editStack.redo();
    })
  }

  public dispatch(command: ICommand) {
    (command as any).canvas = this.canvas;
    this.canvas.pushCommand(command);
  }

}

export const ICommandService =
    new InjectionToken<ICommandService>('CommandService');