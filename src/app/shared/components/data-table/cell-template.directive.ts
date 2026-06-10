import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({ selector: '[appCellTemplate]' })
export class CellTemplateDirective {
  @Input('appCellTemplate') columnKey: string;
  constructor(public templateRef: TemplateRef<any>) {}
}
