import { Component, Input, HostBinding } from '@angular/core';
import { Drawing } from 'src/app/model/drawing';

@Component({
  selector: 'layer-control-item',
  templateUrl: './layer-control-item.component.html',
  styleUrls: ['./layer-control-item.component.scss']
})
export class LayerControlItemComponent {

  @Input() drawing: Drawing;
  
  @HostBinding('class.active')
  @Input() active: boolean = false;

}