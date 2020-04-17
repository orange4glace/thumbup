import { EventEmitter, Component, Input } from '@angular/core';
import vec2 from 'src/app/util/vec2';
import mat2 from 'src/app/util/mat2';
import { Movable } from 'src/app/model/movable';

@Component({
  selector: 'movable',
  templateUrl: './movable.component.html',
  styleUrls: ['movable.component.scss']
})
export class MovableComponent {

  @Input() movable: Movable;

  public thumbTL = new vec2();
  public thumbTR = new vec2();
  public thumbBL = new vec2();
  public thumbBR = new vec2();

  constructor() {
    this.update();
  }

  private update() {
    const [w, h] = [this.movable.w, this.movable.h];
    const rot = mat2.identity.rotate(this.movable.r);
    const center = new vec2([this.movable.x, this.movable.y]);
   [[this.thumbTL,
      new vec2([-w / 2, -h / 2])],
    [this.thumbTR,
      new vec2([w / 2, -h / 2])],
    [this.thumbBL,
    new vec2([-w / 2, h / 2])],
    [this.thumbBR,
    new vec2([w / 2, h / 2])]].forEach(thumb => {
      const ct = thumb[1];
      const rot_ct = ct.multiplyMat2(rot);
      thumb[0].xy = rot_ct.xy;
    })
  }

  public getBoxStyle() {
    return {
      transform: `translateX(${this.movable.x}px) translateY(${this.movable.y}px)`
    }
  }

  public getThumbStyle(thumb: vec2) {
    return {
      transform: `translateX(${thumb.x}px) translateY(${thumb.y}px)`
    }
  }

}