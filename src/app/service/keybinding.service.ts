import { Injectable } from '@angular/core';
import hotkeys from 'hotkeys-js';
import { isMacintosh } from 'src/app/util/platform';

export interface IKeybinding {
  keychord: string;
  mac?: string;
}

export interface IKeybindingDisposer {
  (): void;
}

@Injectable()
export class KeybindingService {

  public bind(binding: IKeybinding, func: ()=>void): IKeybindingDisposer {
    let keychord = binding.keychord;
    if (isMacintosh) {
      keychord = binding.mac || keychord;
    }
    const disposer = () => {
      hotkeys.unbind(keychord, func);
    }
    hotkeys(keychord, func);
    return disposer;
  }

}