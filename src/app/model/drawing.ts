let __next_id = 0;

export abstract class Drawing {

  public readonly id: number;

  constructor(
    public readonly type: string) {
    this.id = ++__next_id;
  }

}