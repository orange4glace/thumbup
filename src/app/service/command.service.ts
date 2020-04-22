import { ICommand } from 'src/app/model/command';
import { Canvas } from 'src/app/model/canvas';
import { InjectionToken, Injectable, OnDestroy } from '@angular/core';

import hotkeys from 'hotkeys-js';
import { KeybindingService, IKeybindingDisposer } from 'src/app/service/keybinding.service';

// const hotkeys: any = require('hotkeys-js');

export interface ICommandService {

  dispatch(command: ICommand): void;

}

@Injectable()
export class CanvasCommandService implements ICommandService {

  public canvas: Canvas;

  public dispatch(command: ICommand) {
    (command as any).canvas = this.canvas;
    this.canvas.pushCommand(command);
  }

}

export const ICommandService =
    new InjectionToken<ICommandService>('CommandService');