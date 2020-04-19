import { ICommand } from 'src/app/model/command';

interface IStackElement {
  commands: ICommand[];
}

class StackElement implements IStackElement {

  public commands: ICommand[] = [];

  push(command: ICommand): void {
    this.commands.push(command);
  }

}

export class EditStack {

  private past_: StackElement[] = [];
  private future_: StackElement[] = [];
  private currentStackElement_: StackElement | null = null;

  public pushEditCommand(command: ICommand) {
    const inverse = command.execute();
    if (!inverse) return;
    if (!this.currentStackElement_) {
      this.currentStackElement_ = new StackElement();
    }
    this.currentStackElement_.push(inverse);
    this.future_ = [];
  }

  public pushStackElement(): void {
    if (this.currentStackElement_ !== null) {
      this.past_.push(this.currentStackElement_);
      this.currentStackElement_ = null;
    }
  }

  public get canUndo() {
    return this.past_.length > 0 || this.currentStackElement_ != null;
  }

  public get canRedo() {
    return this.future_.length > 0;
  }

  public undo() {
    this.pushStackElement();
    const pastStackElement = this.past_.pop();
    if (!pastStackElement) return;
    const futureStackElemnet = new StackElement();
    for (let i = pastStackElement.commands.length - 1; i >= 0 ; i --) {
      const command = pastStackElement.commands[i];
      const inverse = command.execute();
      if (!inverse) continue;
      futureStackElemnet.push(inverse);
    }
    this.future_.push(futureStackElemnet);

  }

  public redo() {
    const futureStackElement = this.future_.pop();
    if (!futureStackElement) return;
    const pastStackElemnet = new StackElement();
    for (let i = futureStackElement.commands.length - 1; i >= 0 ; i --) {
      const command = futureStackElement.commands[i];
      const inverse = command.execute();
      if (!inverse) continue;
      pastStackElemnet.push(inverse);
    }
    this.past_.push(pastStackElemnet);
  }

}