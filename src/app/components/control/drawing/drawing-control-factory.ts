import { Injector, ComponentFactoryResolver, ViewContainerRef, ComponentRef } from '@angular/core';
import { Drawing } from 'src/app/model/drawing';
import { TextDrawing } from 'src/app/model/text-drawing';
import { TextDrawingControlComponent } from 'src/app/components/control/text-drawing/text-drawing-control.component';

export class DrawingControlFactory {

  constructor(private readonly resolver: ComponentFactoryResolver) {}

  public create(
    container: ViewContainerRef,
    drawing: Drawing, injector: Injector): ComponentRef<any> {
    if (!drawing) return null;
    let component: any;
    switch (drawing.type) {
      case TextDrawing.type:
        component = TextDrawingControlComponent;
        break;
    }
    if (!component) return null;
    const factory = this.resolver.resolveComponentFactory(component);
    const componentRef = container.createComponent(factory, undefined, injector);
    (componentRef.instance as any).drawing = drawing;
    return componentRef;
  }

}