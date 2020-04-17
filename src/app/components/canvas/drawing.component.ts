import { Component, ComponentFactoryResolver, Input, OnInit, ComponentFactory, ViewChild, ComponentRef, ViewContainerRef } from '@angular/core';
import { Drawing } from 'src/app/model/drawing';
import { ImageDrawing } from 'src/app/model/image-drawing';
import { ImageDrawingComponent } from 'src/app/components/image-drawing/image-drawing.component';

@Component({
  selector: 'drawing',
  template: ''
})
export class DrawingComponent implements OnInit {

  @Input()
  drawing: Drawing;

  constructor(
    private readonly ref_: ViewContainerRef,
    private readonly componentFactoryResolver_: ComponentFactoryResolver) {
    
  }

  ngOnInit() {
    let factory: ComponentFactory<any>;
    switch (this.drawing.type) {
      case ImageDrawing.type:
        factory = this.componentFactoryResolver_.resolveComponentFactory(ImageDrawingComponent);
        break;
    }
    const componentRef = this.ref_.createComponent(factory);
    (componentRef.instance as any).drawing = this.drawing;
  }

}