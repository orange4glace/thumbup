import { IDrawingFilter, ColorDrawingFilter } from 'src/app/model/drawing-filter';
import { Injector, ComponentFactoryResolver, ViewContainerRef, ComponentRef } from '@angular/core';
import { ColorFilterControlComponent } from 'src/app/components/control/filter/color-filter-control';

export class FilterControlFactory {

  constructor(private readonly resolver: ComponentFactoryResolver) {}

  public create(
    container: ViewContainerRef,
    filter: IDrawingFilter, injector: Injector): ComponentRef<any> {
    if (!filter) return null;
    let component: any;
    switch (filter.type) {
      case ColorDrawingFilter.type:
        component = ColorFilterControlComponent;
        break;
    }
    if (!component) return null;
    const factory = this.resolver.resolveComponentFactory(component);
    const componentRef = container.createComponent(factory, undefined, injector);
    (componentRef.instance as any).filter = filter;
    return componentRef;
  }

}